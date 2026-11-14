import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import { requireAuthenticatedAdmin } from '@/lib/security/serverAuth';

export const dynamic = 'force-dynamic';

const ALLOWED_BUCKETS = new Set([
  'parish-media',
  'booklets',
  'galleries',
  'brand_assets',
  'event_assets',
  'movement_assets',
]);

function sanitizeFolder(rawFolder: string | null): string {
  if (!rawFolder) return 'geral';
  const cleaned = rawFolder
    .replace(/\.\.+/g, '')
    .replace(/[^a-zA-Z0-9/_-]/g, '-')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/');
  return cleaned || 'geral';
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthenticatedAdmin();
    if (!auth.ok) return auth.response;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = sanitizeFolder(formData.get('folder') as string | null);
    const bucket = ((formData.get('bucket') as string) || 'parish-media').trim();

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json(
        { error: 'Bucket de armazenamento não permitido.' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const timestamp = Date.now();
    const cleanFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');
    const fileName = `${timestamp}-${cleanFileName}`;
    const storagePath = `${folder}/${fileName}`;

    const cookieStore = await cookies();
    const supabase = hasServiceRoleKey()
      ? createAdminClient()
      : createClient(cookieStore);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: file.type || 'image/webp',
        upsert: true,
      });

    if (uploadError || !uploadData) {
      console.error('[api/upload] Erro no Supabase Storage:', uploadError?.message);
      return NextResponse.json(
        {
          error:
            'Falha ao enviar imagem para o Supabase Storage. Verifique permissões do bucket ou configuração de armazenamento.',
        },
        { status: 502 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Upload concluído sem URL pública gerada pelo Storage.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      publicUrl: publicUrlData.publicUrl,
      source: 'supabase',
    });
  } catch (err: unknown) {
    console.error('Erro inesperado no endpoint de upload:', err);
    return NextResponse.json(
      { error: 'Erro interno ao processar o envio do arquivo.' },
      { status: 500 }
    );
  }
}
