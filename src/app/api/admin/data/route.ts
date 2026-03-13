import { NextRequest, NextResponse } from 'next/server';
import { isAdminSection, isSingleRowSection } from '@/lib/admin/sections';
import { createAdminClient } from '@/lib/supabase';

// Generic data fetcher for admin panel
export async function GET(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const table = req.nextUrl.searchParams.get('table');
  if (!table) {
    return NextResponse.json({ error: 'Table parameter required' }, { status: 400 });
  }

  if (!isAdminSection(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (isSingleRowSection(table)) {
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
