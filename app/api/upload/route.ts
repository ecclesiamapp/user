import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'geral';
    const bucket = (formData.get('bucket') as string) || 'parish-media';

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

    // 1. Tentar upload no Supabase Storage
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, {
          contentType: file.type || 'image/webp',
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(storagePath);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            publicUrl: publicUrlData.publicUrl,
            source: 'supabase',
          });
        }
      } else {
        console.warn('Supabase storage upload aviso:', uploadError?.message);
      }
    } catch (storageErr) {
      console.warn('Tentando fallback local devido a erro no Supabase Storage:', storageErr);
    }

    // 2. Fallback de alta disponibilidade: Salvar localmente em public/uploads/
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
      await fs.mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, fileName);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));

      const localPublicUrl = `/uploads/${folder}/${fileName}`;

      return NextResponse.json({
        success: true,
        publicUrl: localPublicUrl,
        source: 'local',
      });
    } catch (fsErr: any) {
      console.error('Erro no fallback local de upload:', fsErr);
      return NextResponse.json(
        { error: 'Falha ao salvar a imagem localmente ou na nuvem.' },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('Erro inesperado no endpoint de upload:', err);
    return NextResponse.json({ error: err?.message || 'Erro interno.' }, { status: 500 });
  }
}
