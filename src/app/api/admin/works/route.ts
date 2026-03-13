import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// CRUD for works
export async function GET(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data } = await supabase.from('works').select('*').order('sort_order');
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('works').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { id, ...updates } = body;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('works')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  const supabase = createAdminClient();
  const { error } = await supabase.from('works').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
