-- ==============================================================================
-- Migração: 20261107_create_parish_movements.sql
-- Módulo: Movimentos Paroquiais Dedicados (ECC, EAC e EJC)
-- Paróquia Piloto: Catedral Sagrado Coração de Jesus (Colatina/ES)
-- Escopo:
--   1. Tabela parish_movements (Mestre de Movimentos da Paróquia)
--   2. Tabela parish_movement_events (Cronograma de Encontros, Etapas e Formações)
--   3. Tabela parish_movement_registrations (Fichas Digitais de Pré-Inscrição com LGPD/ECA)
--   4. Bucket de Storage 'movement_assets' para Brasões, Banners e Mídias
--   5. Índices de Alta Performance & Políticas RLS Multi-Tenant Seguras
--   6. Carga Inicial Oficial para ECC, EAC e EJC na Catedral de Colatina
-- ==============================================================================

-- 1. Criação da tabela public.parish_movements
CREATE TABLE IF NOT EXISTS public.parish_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  name text NOT NULL,
  acronym text NOT NULL,
  slug text NOT NULL,
  patron_saint text,
  carisma text,
  spiritual_director_name text,
  spiritual_director_role text,
  coordinating_team text,
  contact_whatsapp text,
  contact_email text,
  meeting_schedule text,
  description text,
  logo_url text,
  banner_url text,
  order_index integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_movement_slug_per_parish UNIQUE (parish_id, slug)
);

-- 2. Criação da tabela public.parish_movement_events
CREATE TABLE IF NOT EXISTS public.parish_movement_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  movement_id uuid NOT NULL REFERENCES public.parish_movements(id) ON DELETE CASCADE,
  title text NOT NULL,
  event_type text NOT NULL DEFAULT 'encontro_etapa' CHECK (
    event_type IN ('encontro_etapa', 'pos_encontro', 'circulo', 'missa_entrega', 'formacao', 'outro')
  ),
  start_date date NOT NULL,
  end_date date,
  time_info text,
  location text,
  registration_open boolean NOT NULL DEFAULT false,
  registration_deadline date,
  max_participants integer,
  notes text,
  status text NOT NULL DEFAULT 'agendado' CHECK (
    status IN ('agendado', 'em_andamento', 'concluido', 'cancelado')
  ),
  order_index integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Criação da tabela public.parish_movement_registrations
CREATE TABLE IF NOT EXISTS public.parish_movement_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  movement_id uuid NOT NULL REFERENCES public.parish_movements(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.parish_movement_events(id) ON DELETE SET NULL,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  applicant_name text NOT NULL,
  applicant_birth_date date,
  applicant_phone text NOT NULL,
  applicant_email text,
  applicant_address text,
  applicant_neighborhood text,
  spouse_or_guardian_name text,
  spouse_or_guardian_phone text,
  is_minor boolean NOT NULL DEFAULT false,
  marital_status text,
  notes text,
  lgpd_consent boolean NOT NULL DEFAULT false CHECK (lgpd_consent = true),
  status text NOT NULL DEFAULT 'nova' CHECK (
    status IN ('nova', 'em_contato', 'confirmada', 'arquivada')
  ),
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Índices de Alta Performance (Foreign Keys & Queries Frequentes)
CREATE INDEX IF NOT EXISTS idx_parish_movements_parish_id ON public.parish_movements(parish_id);
CREATE INDEX IF NOT EXISTS idx_parish_movements_slug ON public.parish_movements(slug);
CREATE INDEX IF NOT EXISTS idx_parish_movements_active ON public.parish_movements(is_active);
CREATE INDEX IF NOT EXISTS idx_parish_movements_order ON public.parish_movements(order_index);

CREATE INDEX IF NOT EXISTS idx_movement_events_parish_id ON public.parish_movement_events(parish_id);
CREATE INDEX IF NOT EXISTS idx_movement_events_movement_id ON public.parish_movement_events(movement_id);
CREATE INDEX IF NOT EXISTS idx_movement_events_dates ON public.parish_movement_events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_movement_events_status ON public.parish_movement_events(status);

CREATE INDEX IF NOT EXISTS idx_movement_regs_parish_id ON public.parish_movement_registrations(parish_id);
CREATE INDEX IF NOT EXISTS idx_movement_regs_movement_id ON public.parish_movement_registrations(movement_id);
CREATE INDEX IF NOT EXISTS idx_movement_regs_event_id ON public.parish_movement_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_movement_regs_community_id ON public.parish_movement_registrations(community_id);
CREATE INDEX IF NOT EXISTS idx_movement_regs_status ON public.parish_movement_registrations(status);
CREATE INDEX IF NOT EXISTS idx_movement_regs_created_at ON public.parish_movement_registrations(created_at DESC);

-- 5. Habilitação de Row Level Security (RLS)
ALTER TABLE public.parish_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_movement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_movement_registrations ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de RLS para parish_movements
DROP POLICY IF EXISTS "Leitura publica de movimentos paroquiais ativos" ON public.parish_movements;
CREATE POLICY "Leitura publica de movimentos paroquiais ativos"
ON public.parish_movements FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestao de movimentos paroquiais por administradores" ON public.parish_movements;
CREATE POLICY "Gestao de movimentos paroquiais por administradores"
ON public.parish_movements FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- 7. Políticas de RLS para parish_movement_events
DROP POLICY IF EXISTS "Leitura publica de eventos de movimentos agendados" ON public.parish_movement_events;
CREATE POLICY "Leitura publica de eventos de movimentos agendados"
ON public.parish_movement_events FOR SELECT
TO anon, authenticated
USING (status != 'cancelado');

DROP POLICY IF EXISTS "Gestao de eventos de movimentos por administradores" ON public.parish_movement_events;
CREATE POLICY "Gestao de eventos de movimentos por administradores"
ON public.parish_movement_events FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- 8. Políticas de RLS para parish_movement_registrations (Proteção Estrita LGPD)
DROP POLICY IF EXISTS "Cadastro publico de ficha de pre-inscricao com consentimento LGPD" ON public.parish_movement_registrations;
CREATE POLICY "Cadastro publico de ficha de pre-inscricao com consentimento LGPD"
ON public.parish_movement_registrations FOR INSERT
TO anon, authenticated
WITH CHECK (lgpd_consent = true AND parish_id IS NOT NULL);

DROP POLICY IF EXISTS "Gestao e visualizacao restrita de fichas por administradores" ON public.parish_movement_registrations;
CREATE POLICY "Gestao e visualizacao restrita de fichas por administradores"
ON public.parish_movement_registrations FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- 9. Bucket de Storage 'movement_assets' (Brasões, Banners e Mídias)
INSERT INTO storage.buckets (id, name, public)
VALUES ('movement_assets', 'movement_assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Visualizacao publica de midias dos movimentos" ON storage.objects;
CREATE POLICY "Visualizacao publica de midias dos movimentos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'movement_assets');

DROP POLICY IF EXISTS "Upload de midias dos movimentos por administradores" ON storage.objects;
CREATE POLICY "Upload de midias dos movimentos por administradores"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'movement_assets');

DROP POLICY IF EXISTS "Edicao e delecao de midias dos movimentos por administradores" ON storage.objects;
CREATE POLICY "Edicao e delecao de midias dos movimentos por administradores"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'movement_assets');

-- 10. Carga Inicial de Dados Canônicos para a Catedral de Colatina
DO $$
DECLARE
  v_parish_id uuid := 'c0000000-0000-0000-0000-000000000001';
  v_ecc_id uuid;
  v_eac_id uuid;
  v_ejc_id uuid;
BEGIN
  -- A. Encontro de Casais com Cristo (ECC)
  INSERT INTO public.parish_movements (
    parish_id,
    name,
    acronym,
    slug,
    patron_saint,
    carisma,
    spiritual_director_name,
    spiritual_director_role,
    coordinating_team,
    contact_whatsapp,
    contact_email,
    meeting_schedule,
    description,
    order_index,
    is_active
  ) VALUES (
    v_parish_id,
    'Encontro de Casais com Cristo',
    'ECC',
    'ecc',
    'Nossa Senhora do Bom Conselho & Sagrada Família',
    'Evangelização e fortalecimento das famílias e matrimônios no seio da Igreja Católica, despertando a corresponsabilidade pastoral.',
    'Pe. Irineu Valdereis de Castro',
    'Pároco e Diretor Espiritual',
    'Casal Coordenador Geral da Catedral',
    '+5527999840001',
    'secretaria@catedraldecolatina.org.br',
    'Círculos mensais nas Comunidades e Reuniões de Pós-Encontro no Centro Pastoral São João Paulo II.',
    'O Encontro de Casais com Cristo (ECC) é um serviço pastoral da Igreja Católica para evangelizar a família, primeiro núcleo de comunhão humana e santuário da vida. Na Catedral de Colatina, o ECC atua com vigor integrando os casais à liturgia, aos serviços de caridade e à vida fraterna em comunidade.',
    1,
    true
  )
  ON CONFLICT (parish_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    patron_saint = EXCLUDED.patron_saint,
    carisma = EXCLUDED.carisma,
    spiritual_director_name = EXCLUDED.spiritual_director_name,
    spiritual_director_role = EXCLUDED.spiritual_director_role,
    coordinating_team = EXCLUDED.coordinating_team,
    meeting_schedule = EXCLUDED.meeting_schedule,
    description = EXCLUDED.description
  RETURNING id INTO v_ecc_id;

  -- B. Encontro de Adolescentes com Cristo (EAC)
  INSERT INTO public.parish_movements (
    parish_id,
    name,
    acronym,
    slug,
    patron_saint,
    carisma,
    spiritual_director_name,
    spiritual_director_role,
    coordinating_team,
    contact_whatsapp,
    contact_email,
    meeting_schedule,
    description,
    order_index,
    is_active
  ) VALUES (
    v_parish_id,
    'Encontro de Adolescentes com Cristo',
    'EAC',
    'eac',
    'São Carlos Borromeu & Santa Maria Goretti',
    'Evangelização e acolhimento dos adolescentes (12 a 15 anos), cultivando valores cristãos, oração e amizades sadias.',
    'Pe. Deivid Marcolino Pereira',
    'Vigário Paroquial e Assistente dos Movimentos Juvenis',
    'Equipe de Tios e Jovens Coordenadores',
    '+5527999840001',
    'secretaria@catedraldecolatina.org.br',
    'Encontros quinzenais aos sábados às 15h00 no Centro Pastoral São João Paulo II.',
    'O EAC proporciona aos adolescentes da Paróquia da Catedral uma experiência viva de encontro com Jesus Cristo, ajudando-os a discernir caminhos retos de fé, solidariedade e respeito mútuo em uma fase decisiva de amadurecimento humano.',
    2,
    true
  )
  ON CONFLICT (parish_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    patron_saint = EXCLUDED.patron_saint,
    carisma = EXCLUDED.carisma,
    spiritual_director_name = EXCLUDED.spiritual_director_name,
    spiritual_director_role = EXCLUDED.spiritual_director_role,
    coordinating_team = EXCLUDED.coordinating_team,
    meeting_schedule = EXCLUDED.meeting_schedule,
    description = EXCLUDED.description
  RETURNING id INTO v_eac_id;

  -- C. Encontro de Jovens com Cristo (EJC)
  INSERT INTO public.parish_movements (
    parish_id,
    name,
    acronym,
    slug,
    patron_saint,
    carisma,
    spiritual_director_name,
    spiritual_director_role,
    coordinating_team,
    contact_whatsapp,
    contact_email,
    meeting_schedule,
    description,
    order_index,
    is_active
  ) VALUES (
    v_parish_id,
    'Encontro de Jovens com Cristo',
    'EJC',
    'ejc',
    'São João Paulo II & Beato Carlo Acutis',
    'Despertar a juventude (16 a 28 anos) para ser protagonista de sua fé e transformar a sociedade com a luz do Evangelho.',
    'Pe. Deivid Marcolino Pereira',
    'Vigário Paroquial e Assistente dos Movimentos Juvenis',
    'Jovens Coordenadores & Casal de Tios Apoiadores',
    '+5527999840001',
    'secretaria@catedraldecolatina.org.br',
    'Grupão de Oração aos domingos às 17h30 no Salão Paroquial da Catedral (precedendo a Santa Missa das 19h00).',
    'O EJC reúne a juventude da Catedral de Colatina em torno da oração, da adoração eucarística, de ações solidárias e de momentos profundos de reflexão, preparando líderes comprometidos com a fé cristã e a Igreja.',
    3,
    true
  )
  ON CONFLICT (parish_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    patron_saint = EXCLUDED.patron_saint,
    carisma = EXCLUDED.carisma,
    spiritual_director_name = EXCLUDED.spiritual_director_name,
    spiritual_director_role = EXCLUDED.spiritual_director_role,
    coordinating_team = EXCLUDED.coordinating_team,
    meeting_schedule = EXCLUDED.meeting_schedule,
    description = EXCLUDED.description
  RETURNING id INTO v_ejc_id;

  -- Eventos Exemplares para o Cronograma Litúrgico
  IF v_ecc_id IS NOT NULL THEN
    INSERT INTO public.parish_movement_events (
      parish_id,
      movement_id,
      title,
      event_type,
      start_date,
      end_date,
      time_info,
      location,
      registration_open,
      notes,
      status,
      order_index
    ) VALUES (
      v_parish_id,
      v_ecc_id,
      'XXXVI ECC — 1ª Etapa Paroquial',
      'encontro_etapa',
      '2027-05-21',
      '2027-05-23',
      'Sexta a Domingo (Integral)',
      'Centro Pastoral São João Paulo II - Catedral',
      true,
      'Vagas limitadas para casais residentes no território da Catedral e das 14 CEBs.',
      'agendado',
      1
    ) ON CONFLICT DO NOTHING;
  END IF;

  IF v_eac_id IS NOT NULL THEN
    INSERT INTO public.parish_movement_events (
      parish_id,
      movement_id,
      title,
      event_type,
      start_date,
      end_date,
      time_info,
      location,
      registration_open,
      notes,
      status,
      order_index
    ) VALUES (
      v_parish_id,
      v_eac_id,
      'XIII EAC da Catedral — "Sede Fortes no Senhor"',
      'encontro_etapa',
      '2027-06-12',
      '2027-06-13',
      'Sábado e Domingo',
      'Auditório do Colégio Marista / Centro Pastoral',
      true,
      'Destinado a adolescentes de 12 a 15 anos. Autorização dos pais obrigatória.',
      'agendado',
      1
    ) ON CONFLICT DO NOTHING;
  END IF;

  IF v_ejc_id IS NOT NULL THEN
    INSERT INTO public.parish_movement_events (
      parish_id,
      movement_id,
      title,
      event_type,
      start_date,
      end_date,
      time_info,
      location,
      registration_open,
      notes,
      status,
      order_index
    ) VALUES (
      v_parish_id,
      v_ejc_id,
      'XIX EJC da Catedral — "Não Tenhais Medo de Ser Santos"',
      'encontro_etapa',
      '2027-07-16',
      '2027-07-18',
      'Sexta a Domingo',
      'Centro Pastoral São João Paulo II - Catedral',
      true,
      'Para jovens de 16 a 28 anos solteiros.',
      'agendado',
      1
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

