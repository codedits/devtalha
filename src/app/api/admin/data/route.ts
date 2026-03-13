import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

const SINGLE_ROW_TABLES = ['hero', 'about', 'reachus', 'footer', 'works_meta', 'services_meta', 'process_meta'] as const;
const MULTI_ROW_TABLES = ['works', 'services', 'process_steps'] as const;
const ALLOWED_TABLES = [...SINGLE_ROW_TABLES, ...MULTI_ROW_TABLES] as const;

// Generic data fetcher for admin panel
export async function GET(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const table = req.nextUrl.searchParams.get('table');
  if (!table) {
    return NextResponse.json({ error: 'Table parameter required' }, { status: 400 });
  }

  if (!(ALLOWED_TABLES as readonly string[]).includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const supabase = createAdminClient();

  if ((SINGLE_ROW_TABLES as readonly string[]).includes(table)) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'No data found' }, { status: 404 });
    return NextResponse.json(data);
  }

  // Multi-row tables
  const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
