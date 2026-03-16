import { NextRequest, NextResponse } from 'next/server';
import { getManagedStoragePathFromUrl } from '@/lib/admin/uploads';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  // Check admin auth
  if (req.cookies.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('portfolio-images')
    .upload(fileName, file, { contentType: file.type });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}

export async function DELETE(req: NextRequest) {
  if (req.cookies.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { url?: string } | null;
  const url = typeof body?.url === 'string' ? body.url : '';
  const objectPath = getManagedStoragePathFromUrl(url);

  if (!objectPath) {
    return NextResponse.json({ error: 'Only portfolio bucket images can be deleted' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from('portfolio-images').remove([objectPath]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
