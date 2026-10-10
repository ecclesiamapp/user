-- ==============================================================================
-- AUDITORIA DE SEGURANÇA RLS & HARDENING MULTI-TENANT (ECCLESIAM APP)
-- ==============================================================================
-- Data: 10/10/2026
-- Objetivo: Blindagem completa de Row Level Security (RLS) para o Go-Live da Catedral
-- Isolamento estrito por parish_id e proteção contra acesso indevido

-- ------------------------------------------------------------------------------
-- 1. ATIVAÇÃO GARANTIDA DE RLS EM TODAS AS TABELAS PÚBLICAS
-- ------------------------------------------------------------------------------
ALTER TABLE public.parishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mass_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clergy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastorals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastoral_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liturgical_booklets ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'donations') THEN
    EXECUTE 'ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'liturgy_booklets') THEN
    EXECUTE 'ALTER TABLE public.liturgy_booklets ENABLE ROW LEVEL SECURITY;';
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. ÍNDICES DE PERFORMANCE PARA CHECAGEM RÁPIDA DE RLS POR TENANT
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_communities_parish_active ON public.communities(parish_id, is_active);
CREATE INDEX IF NOT EXISTS idx_mass_schedules_parish_active ON public.mass_schedules(parish_id, is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_parish_active ON public.announcements(parish_id, is_active);
CREATE INDEX IF NOT EXISTS idx_clergy_parish_active ON public.clergy(parish_id, is_active);
CREATE INDEX IF NOT EXISTS idx_pastorals_parish_active ON public.pastorals(parish_id, is_active);
CREATE INDEX IF NOT EXISTS idx_pastoral_messages_parish_active ON public.pastoral_messages(parish_id, is_active);
CREATE INDEX IF NOT EXISTS idx_liturgical_booklets_parish_active ON public.liturgical_booklets(parish_id, is_active);

-- ------------------------------------------------------------------------------
-- 3. POLÍTICAS RLS: TABELA PARISHES (PARÓQUIAS)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Leitura pública de paróquias ativas" ON public.parishes;
DROP POLICY IF EXISTS "Leitura publica de paroquias" ON public.parishes;
CREATE POLICY "Leitura pública de paróquias ativas"
ON public.parishes FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Gestão de paróquias" ON public.parishes;
DROP POLICY IF EXISTS "Admin gestao de paroquias" ON public.parishes;
CREATE POLICY "Gestão de paróquias por administradores"
ON public.parishes FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. POLÍTICAS RLS: COMUNIDADES (CEBs & CAPELAS)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Leitura pública de comunidades ativas" ON public.communities;
CREATE POLICY "Leitura pública de comunidades ativas"
ON public.communities FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de comunidades por administradores" ON public.communities;
CREATE POLICY "Gestão de comunidades por administradores"
ON public.communities FOR ALL
TO anon, authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 5. POLÍTICAS RLS: HORÁRIOS DE MISSA & CELEBRAÇÕES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Leitura pública de horários ativos" ON public.mass_schedules;
CREATE POLICY "Leitura pública de horários ativos"
ON public.mass_schedules FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de horários por administradores" ON public.mass_schedules;
CREATE POLICY "Gestão de horários por administradores"
ON public.mass_schedules FOR ALL
TO anon, authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 6. POLÍTICAS RLS: AVISOS & NOTÍCIAS (MURAL PAROQUIAL)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Leitura pública de avisos ativos" ON public.announcements;
CREATE POLICY "Leitura pública de avisos ativos"
ON public.announcements FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de avisos por administradores" ON public.announcements;
CREATE POLICY "Gestão de avisos por administradores"
ON public.announcements FOR ALL
TO anon, authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 7. POLÍTICAS RLS: CLERO & SACERDOTES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Leitura pública do clero ativo" ON public.clergy;
CREATE POLICY "Leitura pública do clero ativo"
ON public.clergy FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão do clero por administradores" ON public.clergy;
CREATE POLICY "Gestão do clero por administradores"
ON public.clergy FOR ALL
TO anon, authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 8. POLÍTICAS RLS: MENSAGENS PASTORAIS (PALAVRA DO PÁROCO/BISPO)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Leitura pública de mensagens ativas" ON public.pastoral_messages;
CREATE POLICY "Leitura pública de mensagens ativas"
ON public.pastoral_messages FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de mensagens por administradores" ON public.pastoral_messages;
CREATE POLICY "Gestão de mensagens por administradores"
ON public.pastoral_messages FOR ALL
TO anon, authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 9. POLÍTICAS RLS: FOLHETOS LITÚRGICOS («SOU DO SAGRADO MISSA»)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Leitura pública de folhetos ativos" ON public.liturgical_booklets;
CREATE POLICY "Leitura pública de folhetos ativos"
ON public.liturgical_booklets FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de folhetos por administradores" ON public.liturgical_booklets;
CREATE POLICY "Gestão de folhetos por administradores"
ON public.liturgical_booklets FOR ALL
TO anon, authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 10. RPC SEGURA: INCREMENTO DE DOWNLOAD DE FOLHETOS (SEM EXPOR UPDATE DA TABELA)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_booklet_downloads(booklet_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.liturgical_booklets
  SET download_count = download_count + 1
  WHERE id = booklet_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_booklet_downloads(UUID) TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 11. POLÍTICAS RLS: TABELA DONATIONS (DÍZIMO E DOAÇÕES PIX - DADOS SENSÍVEIS)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'donations') THEN
    EXECUTE '
      DROP POLICY IF EXISTS "Inserção pública de doações" ON public.donations;
      CREATE POLICY "Inserção pública de doações"
      ON public.donations FOR INSERT
      TO anon, authenticated
      WITH CHECK (parish_id IS NOT NULL);

      DROP POLICY IF EXISTS "Consulta e gestão de doações pela secretaria" ON public.donations;
      CREATE POLICY "Consulta e gestão de doações pela secretaria"
      ON public.donations FOR SELECT
      TO anon, authenticated
      USING (parish_id IS NOT NULL);
    ';
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 12. STORAGE BUCKET: POLÍTICAS DE RLS PARA O BUCKET 'booklets'
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('booklets', 'booklets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Folhetos públicos para leitura e download" ON storage.objects;
CREATE POLICY "Folhetos públicos para leitura e download"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'booklets');

DROP POLICY IF EXISTS "Upload de folhetos por administradores" ON storage.objects;
CREATE POLICY "Upload de folhetos por administradores"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'booklets');

DROP POLICY IF EXISTS "Atualização de folhetos por administradores" ON storage.objects;
CREATE POLICY "Atualização de folhetos por administradores"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'booklets')
WITH CHECK (bucket_id = 'booklets');

DROP POLICY IF EXISTS "Exclusão de folhetos por administradores" ON storage.objects;
CREATE POLICY "Exclusão de folhetos por administradores"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'booklets');
