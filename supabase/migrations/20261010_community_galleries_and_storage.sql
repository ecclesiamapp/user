-- ==============================================================================
-- MIGRAÇÃO: VÍNCULO DE GALERIAS ÀS CEBS & STORAGE BUCKET 'galleries' (ECCLESIAM APP)
-- ==============================================================================
-- Data: 10/10/2026
-- Objetivo: Permitir álbuns fotográficos vinculados às 12 CEBs e à Matriz, com
--           bucket de storage público configurado no Supabase para fotos em alta resolução.

-- 1. ADICIONAR COLUNAS EM public.galleries CASO NÃO EXISTAM
ALTER TABLE public.galleries ADD COLUMN IF NOT EXISTS community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL;
ALTER TABLE public.galleries ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.galleries ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. ÍNDICES DE PERFORMANCE PARA BUSCAS RÁPIDAS
CREATE INDEX IF NOT EXISTS idx_galleries_community_id ON public.galleries(community_id);
CREATE INDEX IF NOT EXISTS idx_galleries_parish_active ON public.galleries(parish_id, is_active);
CREATE INDEX IF NOT EXISTS idx_galleries_event_date ON public.galleries(event_date DESC);

-- 3. POLÍTICAS DE RLS REFORÇADAS NA TABELA public.galleries
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de galerias ativas" ON public.galleries;
CREATE POLICY "Leitura pública de galerias ativas"
ON public.galleries FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de galerias por administradores" ON public.galleries;
CREATE POLICY "Gestão de galerias por administradores"
ON public.galleries FOR ALL
TO anon, authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- 4. BUCKET DE STORAGE: 'galleries' (PÚBLICO PARA FOTOS DE EVENTOS E PADROEIROS)
INSERT INTO storage.buckets (id, name, public)
VALUES ('galleries', 'galleries', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de RLS para o bucket 'galleries'
DROP POLICY IF EXISTS "Fotos de galerias públicas para visualização" ON storage.objects;
CREATE POLICY "Fotos de galerias públicas para visualização"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'galleries');

DROP POLICY IF EXISTS "Upload de fotos de galerias por administradores" ON storage.objects;
CREATE POLICY "Upload de fotos de galerias por administradores"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'galleries');

DROP POLICY IF EXISTS "Atualização de fotos de galerias por administradores" ON storage.objects;
CREATE POLICY "Atualização de fotos de galerias por administradores"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'galleries')
WITH CHECK (bucket_id = 'galleries');

DROP POLICY IF EXISTS "Exclusão de fotos de galerias por administradores" ON storage.objects;
CREATE POLICY "Exclusão de fotos de galerias por administradores"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'galleries');

-- 5. SEEDS ILUSTRATIVOS: ÁLBUNS HISTÓRICOS DAS CEBS E MATRIZ
DO $$
DECLARE
  v_parish_id UUID;
  v_matriz_id UUID;
  v_sao_jose_id UUID;
  v_sao_pedro_id UUID;
BEGIN
  -- Obter IDs da Paróquia e Comunidades
  SELECT id INTO v_parish_id FROM public.parishes LIMIT 1;
  IF v_parish_id IS NULL THEN
    v_parish_id := 'c0000000-0000-0000-0000-000000000001';
  END IF;

  SELECT id INTO v_matriz_id FROM public.communities WHERE is_headquarters = true LIMIT 1;
  SELECT id INTO v_sao_jose_id FROM public.communities WHERE name ILIKE '%São José%' LIMIT 1;
  SELECT id INTO v_sao_pedro_id FROM public.communities WHERE name ILIKE '%São Pedro%' LIMIT 1;

  -- Álbum 1: Catedral Matriz - Solenidade do Sagrado Coração
  IF NOT EXISTS (SELECT 1 FROM public.galleries WHERE title = 'Solenidade do Sagrado Coração de Jesus') THEN
    INSERT INTO public.galleries (
      parish_id, community_id, title, slug, description, event_date, cover_image_url, photos_count, photos, is_active
    ) VALUES (
      v_parish_id,
      v_matriz_id,
      'Solenidade do Sagrado Coração de Jesus',
      'solenidade-sagrado-coracao-de-jesus',
      'Missa Solene presidida por Dom Lauro Sérgio Versiani Barbosa com a consagração das famílias da Diocese.',
      '2026-06-12',
      'https://images.unsplash.com/photo-1548625361-1926601f0923?q=80&w=1200&auto=format&fit=crop',
      3,
      '[
        "https://images.unsplash.com/photo-1548625361-1926601f0923?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop"
      ]'::jsonb,
      true
    );
  END IF;

  -- Álbum 2: CEB São José Operário - Festa do Padroeiro
  IF v_sao_jose_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.galleries WHERE title = 'Festa de São José Operário 2026') THEN
    INSERT INTO public.galleries (
      parish_id, community_id, title, slug, description, event_date, cover_image_url, photos_count, photos, is_active
    ) VALUES (
      v_parish_id,
      v_sao_jose_id,
      'Festa de São José Operário 2026',
      'festa-sao-jose-operario-2026',
      'Festejos do padroeiro dos trabalhadores com bênção das carteiras de trabalho e almoço comunitário.',
      '2026-05-01',
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1200&auto=format&fit=crop',
      2,
      '[
        "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1548625361-1926601f0923?q=80&w=1200&auto=format&fit=crop"
      ]'::jsonb,
      true
    );
  END IF;

  -- Álbum 3: CEB São Pedro e São Paulo - Procissão dos Pescadores
  IF v_sao_pedro_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.galleries WHERE title = 'Festa de São Pedro e São Paulo') THEN
    INSERT INTO public.galleries (
      parish_id, community_id, title, slug, description, event_date, cover_image_url, photos_count, photos, is_active
    ) VALUES (
      v_parish_id,
      v_sao_pedro_id,
      'Festa de São Pedro e São Paulo',
      'festa-sao-pedro-e-sao-paulo',
      'Celebração eucarística, procissão luminosa e confraternização das famílias da comunidade.',
      '2026-06-29',
      'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop',
      2,
      '[
        "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1548625361-1926601f0923?q=80&w=1200&auto=format&fit=crop"
      ]'::jsonb,
      true
    );
  END IF;
END $$;
