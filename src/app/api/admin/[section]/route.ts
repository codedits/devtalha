import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

import { getSectionTags } from '@/lib/admin/cache';
import { createAdminClient } from '@/lib/supabase';

const SINGLE_ROW_TABLES = ['hero', 'about', 'reachus', 'footer'];
const MULTI_ROW_TABLES = ['works', 'services', 'process_steps'];
const ALLOWED_TABLES = [...SINGLE_ROW_TABLES, ...MULTI_ROW_TABLES];

function isUnauthorized(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value !== 'true';
}

function isSingleRowTable(section: string) {
  return SINGLE_ROW_TABLES.includes(section);
}

function isMultiRowTable(section: string) {
  return MULTI_ROW_TABLES.includes(section);
}

function isAllowedTable(section: string) {
  return ALLOWED_TABLES.includes(section);
}

function revalidatePortfolio(section: string) {
  for (const tag of getSectionTags(section)) {
    revalidateTag(tag, 'max');
  }
  revalidatePath('/');
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
    const { data, error } = await supabase.from(section).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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

  const body = await req.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(section)
    .insert({ ...body, updated_at: new Date().toISOString() })
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

  const body = await req.json();
  const supabase = createAdminClient();

  if (isSingleRowTable(section)) {
    // Get existing row id
    const { data: existing } = await supabase.from(section).select('id').single();
    if (!existing) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
    
    const { data, error } = await supabase
      .from(section)
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePortfolio(section);
    return NextResponse.json(data);
  }

  if (!body.id) {
    return NextResponse.json({ error: 'ID is required for list sections' }, { status: 400 });
  }

  const { id, ...updates } = body;
  const { data, error } = await supabase
    .from(section)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
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

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from(section).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePortfolio(section);
  return NextResponse.json({ success: true });
}
