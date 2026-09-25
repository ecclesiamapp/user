-- ==============================================================================
-- MIGRAÇÃO SUPABASE: HIERARQUIA PAROQUIAL E CEBs (COMUNIDADES ECLESIAIS DE BASE)
-- ==============================================================================

-- 1. Tabela Base de Paróquias (Tenants)
CREATE TABLE IF NOT EXISTS public.parishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    diocese TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT,
    whatsapp_number TEXT,
    pix_key TEXT,
    pix_key_type TEXT CHECK (pix_key_type IN ('cnpj', 'email', 'phone', 'random')),
    primary_color TEXT DEFAULT '#1e3a8a',
    logo_url TEXT,
    banner_url TEXT,
    live_stream_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ativar RLS em parishes
ALTER TABLE public.parishes ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública da paróquia
DROP POLICY IF EXISTS "Leitura pública de paróquias ativas" ON public.parishes;
CREATE POLICY "Leitura pública de paróquias ativas"
ON public.parishes FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Gestão de paróquias" ON public.parishes;
CREATE POLICY "Gestão de paróquias"
ON public.parishes FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);


-- 2. Tabela de Comunidades Eclesiais de Base (CEBs) e Capelas
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    patron_saint TEXT,
    is_headquarters BOOLEAN NOT NULL DEFAULT false, -- True para Igreja Matriz
    address TEXT,
    neighborhood TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'ES',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    contact_name TEXT,
    contact_phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ativar RLS em communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Índices de Performance (Supabase Postgres Best Practices)
CREATE INDEX IF NOT EXISTS idx_communities_parish_id ON public.communities(parish_id);
CREATE INDEX IF NOT EXISTS idx_communities_is_active ON public.communities(is_active);

-- Políticas de RLS em communities
DROP POLICY IF EXISTS "Leitura pública de comunidades ativas" ON public.communities;
CREATE POLICY "Leitura pública de comunidades ativas"
ON public.communities FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de comunidades por administradores da paróquia" ON public.communities;
CREATE POLICY "Gestão de comunidades por administradores da paróquia"
ON public.communities FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);


-- 3. Tabela de Horários de Missas (com vínculo à CEB/Comunidade)
CREATE TABLE IF NOT EXISTS public.mass_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN (
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    )),
    time TIME NOT NULL,
    type TEXT NOT NULL DEFAULT 'missa' CHECK (type IN (
        'missa', 'confissao', 'adoracao', 'expediente', 'celebracao_palavra'
    )),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ativar RLS em mass_schedules
ALTER TABLE public.mass_schedules ENABLE ROW LEVEL SECURITY;

-- Índices para consultas de horários por paróquia e comunidade
CREATE INDEX IF NOT EXISTS idx_mass_schedules_parish_id ON public.mass_schedules(parish_id);
CREATE INDEX IF NOT EXISTS idx_mass_schedules_community_id ON public.mass_schedules(community_id);

-- Políticas RLS em mass_schedules
DROP POLICY IF EXISTS "Leitura pública de horários ativos" ON public.mass_schedules;
CREATE POLICY "Leitura pública de horários ativos"
ON public.mass_schedules FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de horários por administradores da paróquia" ON public.mass_schedules;
CREATE POLICY "Gestão de horários por administradores da paróquia"
ON public.mass_schedules FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);


-- 4. Tabela de Notícias e Avisos Pastorais
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL, -- NULL = Aviso Geral da Paróquia
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'aviso' CHECK (category IN (
        'aviso', 'noticia', 'evento', 'pastoral', 'festa_padroeiro'
    )),
    image_url TEXT,
    is_urgent BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ativar RLS em announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_announcements_parish_id ON public.announcements(parish_id);
CREATE INDEX IF NOT EXISTS idx_announcements_community_id ON public.announcements(community_id);

-- Políticas RLS em announcements
DROP POLICY IF EXISTS "Leitura pública de avisos ativos" ON public.announcements;
CREATE POLICY "Leitura pública de avisos ativos"
ON public.announcements FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de avisos por administradores da paróquia" ON public.announcements;
CREATE POLICY "Gestão de avisos por administradores da paróquia"
ON public.announcements FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);


-- 5. Seed Inicial de Dados (Paróquia Matriz & CEBs de Demonstração)
INSERT INTO public.parishes (
    id, name, diocese, slug, city, state, address, whatsapp_number, primary_color
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'Catedral Sagrado Coração de Jesus',
    'Diocese de Colatina',
    'catedral-colatina',
    'Colatina',
    'ES',
    'Praça da Catedral, s/n - Centro',
    '(27) 99999-0000',
    '#1e3a8a'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.communities (
    id, parish_id, name, patron_saint, is_headquarters, neighborhood, city, contact_name, contact_phone, is_active
) VALUES 
(
    'c0000000-0000-0000-0000-000000000011',
    'c0000000-0000-0000-0000-000000000001',
    'Igreja Matriz - Catedral do Sagrado Coração de Jesus',
    'Sagrado Coração de Jesus',
    true,
    'Centro',
    'Colatina',
    'Secretaria Geral',
    '(27) 99999-0000',
    true
),
(
    'c0000000-0000-0000-0000-000000000012',
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade São Pedro e São Paulo',
    'São Pedro e São Paulo',
    false,
    'Bairro Vila Nova',
    'Colatina',
    'Antônio Carlos (Coordenador)',
    '(27) 98888-1111',
    true
),
(
    'c0000000-0000-0000-0000-000000000013',
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade Santo Antônio',
    'Santo Antônio de Pádua',
    false,
    'Córrego das Flores (Zona Rural)',
    'Colatina',
    'Dona Maria de Lourdes',
    '(27) 97777-2222',
    true
)
ON CONFLICT (id) DO NOTHING;
