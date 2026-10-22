-- ==============================================================================
-- MIGRAÇÃO: MODELAGEM SUPABASE & STORAGE DE MARCA (TASK-36)
-- Fase 6: Hub de Marca, Manual com IA & Moodboard Inteligente
-- ==============================================================================

-- 1. Criação do Bucket de Storage 'brand_assets'
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand_assets', 'brand_assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Políticas de Segurança (RLS) para o Bucket 'brand_assets' em storage.objects

-- Leitura pública: fiéis e visitantes precisam visualizar brasões, logotipos e favicons
DROP POLICY IF EXISTS "Brand assets públicos para visualização" ON storage.objects;
CREATE POLICY "Brand assets públicos para visualização"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'brand_assets');

-- Upload de arquivos de marca (manuais, logos, favicons, texturas)
DROP POLICY IF EXISTS "Upload de brand assets pela administração" ON storage.objects;
CREATE POLICY "Upload de brand assets pela administração"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'brand_assets');

-- Atualização de arquivos de marca
DROP POLICY IF EXISTS "Atualização de brand assets pela administração" ON storage.objects;
CREATE POLICY "Atualização de brand assets pela administração"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'brand_assets')
WITH CHECK (bucket_id = 'brand_assets');

-- Exclusão de arquivos de marca
DROP POLICY IF EXISTS "Exclusão de brand assets pela administração" ON storage.objects;
CREATE POLICY "Exclusão de brand assets pela administração"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'brand_assets');

-- 3. Adição das Colunas de Identidade Visual na Tabela 'public.parishes'

-- Coluna brand_identity (JSONB com estrutura padronizada de cores, fontes, logos e presets)
ALTER TABLE public.parishes
  ADD COLUMN IF NOT EXISTS brand_identity JSONB DEFAULT jsonb_build_object(
    'theme_preset', 'catedral_sagrado_coracao',
    'colors', jsonb_build_object(
      'primary', '#8B1E22',
      'primary_hover', '#6E161A',
      'secondary', '#FFA82A',
      'background', '#FBF9F5',
      'surface', '#FFFFFF',
      'text_primary', '#1A1D20',
      'text_secondary', '#5A626A',
      'action_pix', '#FFA82A'
    ),
    'fonts', jsonb_build_object(
      'heading', 'Sora',
      'body', 'Plus Jakarta Sans'
    ),
    'logos', jsonb_build_object(
      'main_url', '',
      'negative_url', '',
      'favicon_url', ''
    ),
    'manual_pdf_url', '',
    'updated_at', to_jsonb(now()::text)
  ),
  ADD COLUMN IF NOT EXISTS brand_manual_url TEXT;

-- 4. Índice GIN para otimização de consultas e filtros sobre propriedades JSONB
CREATE INDEX IF NOT EXISTS idx_parishes_brand_identity 
ON public.parishes USING gin (brand_identity);

-- 5. Inicialização e Atualização do Registro Piloto (Catedral de Colatina)
UPDATE public.parishes
SET 
  primary_color = '#8B1E22',
  brand_identity = jsonb_build_object(
    'theme_preset', 'catedral_sagrado_coracao',
    'colors', jsonb_build_object(
      'primary', '#8B1E22',
      'primary_hover', '#6E161A',
      'secondary', '#FFA82A',
      'background', '#FBF9F5',
      'surface', '#FFFFFF',
      'text_primary', '#1A1D20',
      'text_secondary', '#5A626A',
      'action_pix', '#FFA82A'
    ),
    'fonts', jsonb_build_object(
      'heading', 'Sora',
      'body', 'Plus Jakarta Sans'
    ),
    'logos', jsonb_build_object(
      'main_url', coalesce(logo_url, ''),
      'negative_url', '',
      'favicon_url', ''
    ),
    'manual_pdf_url', coalesce(brand_manual_url, ''),
    'updated_at', to_jsonb(now()::text)
  )
WHERE id = 'c0000000-0000-0000-0000-000000000001'
  AND (brand_identity IS NULL OR brand_identity = '{}'::jsonb);
