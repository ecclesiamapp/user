-- ==============================================================================
-- Migração: 20270301_create_special_events_and_schedules.sql
-- Módulo: Grandes Festas, Solenidades & Programações Litúrgicas Especiais (TASK-45)
-- Paróquia Piloto: Catedral Sagrado Coração de Jesus (Colatina/ES)
-- ==============================================================================

-- 1. Criação da tabela parish_special_events
CREATE TABLE IF NOT EXISTS public.parish_special_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL,
  event_type text NOT NULL CHECK (
    event_type IN ('copadroeira', 'padroeiro_matriz', 'liturgico_global', 'padroeiro_ceb', 'solenidade_especial')
  ),
  theme text,
  motto text,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  banner_url text,
  poster_pdf_url text,
  is_featured_home boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'destaque_ativo' CHECK (
    status IN ('rascunho', 'destaque_ativo', 'encerrado')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_event_slug_per_parish UNIQUE (parish_id, slug)
);

-- 2. Criação da tabela parish_event_days
CREATE TABLE IF NOT EXISTS public.parish_event_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.parish_special_events(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  day_title text NOT NULL,
  day_subtitle text,
  liturgical_color text DEFAULT 'branco',
  celebrant_name text,
  gesture_of_charity text,
  responsible_group text,
  social_attractions text,
  schedule_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_index integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Índices de Alta Performance (Foreign Keys & Queries)
CREATE INDEX IF NOT EXISTS idx_parish_special_events_parish_id ON public.parish_special_events(parish_id);
CREATE INDEX IF NOT EXISTS idx_parish_special_events_community_id ON public.parish_special_events(community_id);
CREATE INDEX IF NOT EXISTS idx_parish_special_events_slug ON public.parish_special_events(slug);
CREATE INDEX IF NOT EXISTS idx_parish_special_events_status ON public.parish_special_events(status);
CREATE INDEX IF NOT EXISTS idx_parish_special_events_dates ON public.parish_special_events(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_parish_event_days_event_id ON public.parish_event_days(event_id);
CREATE INDEX IF NOT EXISTS idx_parish_event_days_event_date ON public.parish_event_days(event_date);
CREATE INDEX IF NOT EXISTS idx_parish_event_days_order ON public.parish_event_days(order_index);

-- 4. Habilitação de RLS
ALTER TABLE public.parish_special_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_event_days ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS parish_special_events
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parish_special_events' AND policyname = 'Permitir leitura publica de eventos especiais') THEN
    CREATE POLICY "Permitir leitura publica de eventos especiais" ON public.parish_special_events FOR SELECT TO anon, authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parish_special_events' AND policyname = 'Permitir insercao de eventos especiais') THEN
    CREATE POLICY "Permitir insercao de eventos especiais" ON public.parish_special_events FOR INSERT TO anon, authenticated WITH CHECK (parish_id IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parish_special_events' AND policyname = 'Permitir atualizacao de eventos especiais') THEN
    CREATE POLICY "Permitir atualizacao de eventos especiais" ON public.parish_special_events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parish_special_events' AND policyname = 'Permitir exclusao de eventos especiais') THEN
    CREATE POLICY "Permitir exclusao de eventos especiais" ON public.parish_special_events FOR DELETE TO anon, authenticated USING (true);
  END IF;
END $$;

-- 6. Políticas RLS parish_event_days
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parish_event_days' AND policyname = 'Permitir leitura publica de dias do evento') THEN
    CREATE POLICY "Permitir leitura publica de dias do evento" ON public.parish_event_days FOR SELECT TO anon, authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parish_event_days' AND policyname = 'Permitir insercao de dias do evento') THEN
    CREATE POLICY "Permitir insercao de dias do evento" ON public.parish_event_days FOR INSERT TO anon, authenticated WITH CHECK (event_id IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parish_event_days' AND policyname = 'Permitir atualizacao de dias do evento') THEN
    CREATE POLICY "Permitir atualizacao de dias do evento" ON public.parish_event_days FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parish_event_days' AND policyname = 'Permitir exclusao de dias do evento') THEN
    CREATE POLICY "Permitir exclusao de dias do evento" ON public.parish_event_days FOR DELETE TO anon, authenticated USING (true);
  END IF;
END $$;

-- 7. Bucket de Storage event_assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event_assets',
  'event_assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para event_assets
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Event assets publicos para visualizacao') THEN
    CREATE POLICY "Event assets publicos para visualizacao" ON storage.objects FOR SELECT TO public USING (bucket_id = 'event_assets');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Upload de event assets pela administracao') THEN
    CREATE POLICY "Upload de event assets pela administracao" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'event_assets');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Atualizacao de event assets pela administracao') THEN
    CREATE POLICY "Atualizacao de event assets pela administracao" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'event_assets');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Exclusao de event assets pela administracao') THEN
    CREATE POLICY "Exclusao de event assets pela administracao" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'event_assets');
  END IF;
END $$;
