import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

import { getSectionTags } from '@/lib/admin/cache';
import {
  EDITABLE_FIELDS,
  REQUIRED_MULTI_ROW_FIELDS,
  isAdminSection,
  isMultiRowSection,
  isSingleRowSection,
  type AdminSection,
} from '@/lib/admin/sections';
import { isHomepageSectionKey } from '@/lib/admin/homepageSections';
import { createAdminClient } from '@/lib/supabase';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUnauthorized(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value !== 'true';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
    .filter(Boolean);
}

function toNonNegativeInteger(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.trunc(parsed));
}

function sanitizePayload(section: AdminSection, raw: Record<string, unknown>) {
  const editableFields = EDITABLE_FIELDS[section];
  const sanitized: Record<string, unknown> = {};

  for (const field of editableFields) {
    const value = raw[field];
    if (value === undefined) continue;

    if (field === 'sort_order' || field === 'featured_count') {
      sanitized[field] = toNonNegativeInteger(value);
      continue;
    }

    if (field === 'tags' || field === 'images' || field === 'gallery_images') {
      sanitized[field] = toStringArray(value);
      continue;
    }

    if (field === 'section_key') {
      sanitized[field] = typeof value === 'string' ? value.trim().toLowerCase() : String(value ?? '').trim().toLowerCase();
      continue;
    }

    if (field === 'background_mode' || field === 'text_theme') {
      sanitized[field] = typeof value === 'string' ? value.trim().toLowerCase() : String(value ?? '').trim().toLowerCase();
      continue;
    }

    if (field === 'stats') {
      sanitized[field] = Array.isArray(value)
        ? value.map((item) => {
            const next = isRecord(item) ? item : {};
            const rawValue = next.value;
            const parsed = typeof rawValue === 'number' ? rawValue : Number(rawValue);
            return {
              value: Number.isFinite(parsed) ? parsed : 0,
              suffix: typeof next.suffix === 'string' ? next.suffix : '',
              label: typeof next.label === 'string' ? next.label : '',
            };
          })
        : [];
      continue;
    }

    if (field === 'socials') {
      sanitized[field] = Array.isArray(value)
        ? value.map((item) => {
            const next = isRecord(item) ? item : {};
            return {
              name: typeof next.name === 'string' ? next.name : '',
              href: typeof next.href === 'string' ? next.href : '#',
            };
          })
        : [];
      continue;
    }

    sanitized[field] = typeof value === 'string' ? value : String(value ?? '');
  }

  return sanitized;
}

async function readBody(req: NextRequest) {
  try {
    const parsed = await req.json();
    if (!isRecord(parsed)) {
      return { ok: false as const, error: 'Invalid JSON body' };
    }

    return { ok: true as const, body: parsed };
  } catch {
    return { ok: false as const, error: 'Malformed JSON body' };
  }
}

function revalidatePortfolio(section: string) {
  for (const tag of getSectionTags(section)) {
    revalidateTag(tag, 'max');
  }
  revalidatePath('/');
  revalidatePath('/projects');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  if (isUnauthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { section } = await params;
  if (!isAdminSection(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (isSingleRowSection(section)) {
    const { data, error } = await supabase
      .from(section)
      .select('*')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'No data found' }, { status: 404 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabase.from(section).select('*').order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  if (isUnauthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { section } = await params;
  if (!isMultiRowSection(section)) {
    return NextResponse.json({ error: 'POST is only allowed for list sections' }, { status: 400 });
  }

  const parsedBody = await readBody(req);
  if (!parsedBody.ok) {
    return NextResponse.json({ error: parsedBody.error }, { status: 400 });
  }

  const supabase = createAdminClient();

  const insertPayload = sanitizePayload(section, parsedBody.body);
  if (typeof insertPayload.id === 'string' && insertPayload.id.trim() === '') {
    delete insertPayload.id;
  }

  for (const requiredField of REQUIRED_MULTI_ROW_FIELDS[section] ?? []) {
    const value = insertPayload[requiredField];
    if (typeof value !== 'string' || value.trim() === '') {
      return NextResponse.json({ error: `${requiredField} is required` }, { status: 400 });
    }
  }

  if (section === 'section_order') {
    const sectionKey = insertPayload.section_key;
    if (typeof sectionKey !== 'string' || !isHomepageSectionKey(sectionKey)) {
      return NextResponse.json({ error: 'Invalid section_key' }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from(section)
    .insert({ ...insertPayload, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePortfolio(section);
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  if (req.cookies.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { section } = await params;
  if (!isAdminSection(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }

  const parsedBody = await readBody(req);
  if (!parsedBody.ok) {
    return NextResponse.json({ error: parsedBody.error }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (isSingleRowSection(section)) {
    const updates = sanitizePayload(section, parsedBody.body);
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Get existing row id
    const { data: existing } = await supabase
      .from(section)
      .select('id')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    if (!existing) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
    
    const { data, error } = await supabase
      .from(section)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePortfolio(section);
    return NextResponse.json(data);
  }

  const rawId = parsedBody.body.id;
  if (typeof rawId !== 'string' || rawId.trim() === '') {
    return NextResponse.json({ error: 'ID is required for list sections' }, { status: 400 });
  }

  if (!UUID_REGEX.test(rawId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  const updates = sanitizePayload(section, parsedBody.body);
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  if (section === 'section_order' && updates.section_key !== undefined) {
    if (typeof updates.section_key !== 'string' || !isHomepageSectionKey(updates.section_key)) {
      return NextResponse.json({ error: 'Invalid section_key' }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from(section)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', rawId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePortfolio(section);
  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  if (isUnauthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { section } = await params;
  if (!isMultiRowSection(section)) {
    return NextResponse.json({ error: 'DELETE is only allowed for list sections' }, { status: 400 });
  }

  const parsedBody = await readBody(req);
  if (!parsedBody.ok) {
    return NextResponse.json({ error: parsedBody.error }, { status: 400 });
  }

  const id = parsedBody.body.id;
  if (typeof id !== 'string' || id.trim() === '') {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from(section).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePortfolio(section);
  return NextResponse.json({ success: true });
}
