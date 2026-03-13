import { NextRequest, NextResponse } from 'next/server';
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

  const supabase = createAdminClient();
  const singleRowTables = ['hero', 'about', 'reachus', 'footer'];

  if (singleRowTables.includes(table)) {
    const { data, error } = await supabase.from(table).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // Multi-row tables
  const { data, error } = await supabase.from(table).select('*').order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
