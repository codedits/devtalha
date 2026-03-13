import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

import { getSectionTags } from '@/lib/admin/cache';
import { createAdminClient } from '@/lib/supabase';

const SINGLE_ROW_TABLES = [
  'hero',
  'about',
  'reachus',
  'footer',
  'works_meta',
  'services_meta',
  'process_meta',
] as const;
const MULTI_ROW_TABLES = ['works', 'services', 'process_steps'] as const;
const ALLOWED_TABLES = [...SINGLE_ROW_TABLES, ...MULTI_ROW_TABLES];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EDITABLE_FIELDS: Record<(typeof ALLOWED_TABLES)[number], string[]> = {
  hero: ['heading', 'background_image_url', 'name_label'],
  about: ['label', 'heading', 'description', 'stats'],
  reachus: [
    'label',
    'heading',
    'email',
    'office_title',
    'office_line_1',
    'office_line_2',
    'office_line_3',
    'inquiry_title',
    'inquiry_text',
    'socials',
  ],
  footer: ['newsletter_heading', 'newsletter_description', 'brand_name', 'email'],
  works_meta: ['homepage_label', 'homepage_heading', 'featured_count', 'archive_heading'],
  services_meta: ['label', 'profile_image_url', 'intro_text', 'cta_text', 'cta_url'],
  process_meta: ['label'],
  works: ['title', 'client', 'summary', 'project_url', 'image_url', 'hover_image_url', 'gallery_images', 'sort_order'],
  services: ['title', 'description', 'tags', 'images', 'sort_order'],
  process_steps: ['number', 'title', 'description', 'sort_order'],
};

const REQUIRED_FIELDS: Partial<Record<(typeof MULTI_ROW_TABLES)[number], string[]>> = {
  works: ['title', 'client', 'image_url'],
  services: ['title'],
  process_steps: ['number', 'title'],
};

function isUnauthorized(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value !== 'true';
}

function isSingleRowTable(section: string): section is (typeof SINGLE_ROW_TABLES)[number] {
  return (SINGLE_ROW_TABLES as readonly string[]).includes(section);
}

function isMultiRowTable(section: string): section is (typeof MULTI_ROW_TABLES)[number] {
  return (MULTI_ROW_TABLES as readonly string[]).includes(section);
}

function isAllowedTable(section: string): section is (typeof ALLOWED_TABLES)[number] {
  return (ALLOWED_TABLES as readonly string[]).includes(section);
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

function sanitizePayload(section: (typeof ALLOWED_TABLES)[number], raw: Record<string, unknown>) {
  const editableFields = EDITABLE_FIELDS[section];
  const sanitized: Record<string, unknown> = {};

  for (const field of editableFields) {
    const value = raw[field];
    if (value === undefined) continue;

    if (field === 'sort_order' || field === 'featured_count') {
      const parsed = typeof value === 'number' ? value : Number(value);
      sanitized[field] = Number.isFinite(parsed) ? parsed : 0;
      continue;
    }

    if (field === 'tags' || field === 'images' || field === 'gallery_images') {
      sanitized[field] = toStringArray(value);
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
  if (!isAllowedTable(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (isSingleRowTable(section)) {
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
  if (!isMultiRowTable(section)) {
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

  for (const requiredField of REQUIRED_FIELDS[section] ?? []) {
    const value = insertPayload[requiredField];
    if (typeof value !== 'string' || value.trim() === '') {
      return NextResponse.json({ error: `${requiredField} is required` }, { status: 400 });
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
  if (!isAllowedTable(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }

  const parsedBody = await readBody(req);
  if (!parsedBody.ok) {
    return NextResponse.json({ error: parsedBody.error }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (isSingleRowTable(section)) {
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
  if (!isMultiRowTable(section)) {
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
