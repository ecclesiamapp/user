-- ==============================================================================
-- SCRIPT CONSOLIDADO: MENSAGENS PASTORAIS, GRUPO SANTA RITA & FOLHETOS/STORAGE
-- ==============================================================================
-- Paróquia Piloto: Catedral do Sagrado Coração de Jesus (Colatina/ES)
-- ID Paróquia: c0000000-0000-0000-0000-000000000001
-- Execução Segura e Idempotente (IF NOT EXISTS / ON CONFLICT)

-- ------------------------------------------------------------------------------
-- 1. MÓDULO DE MENSAGENS PASTORAIS (PALAVRA DO PÁROCO & DO BISPO)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pastoral_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    author_type TEXT NOT NULL CHECK (author_type IN ('paroco', 'bispo', 'vigario')),
    author_name TEXT NOT NULL,
    author_title TEXT NOT NULL,
    author_photo_url TEXT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    liturgical_season TEXT,
    cover_image_url TEXT,
    is_featured_home BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pastoral_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_pastoral_messages_parish_id ON public.pastoral_messages(parish_id);
CREATE INDEX IF NOT EXISTS idx_pastoral_messages_author_type ON public.pastoral_messages(author_type);
CREATE INDEX IF NOT EXISTS idx_pastoral_messages_featured ON public.pastoral_messages(is_featured_home);
CREATE INDEX IF NOT EXISTS idx_pastoral_messages_published ON public.pastoral_messages(published_at DESC);

DROP POLICY IF EXISTS "Leitura pública de mensagens ativas" ON public.pastoral_messages;
CREATE POLICY "Leitura pública de mensagens ativas"
ON public.pastoral_messages FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de mensagens por administradores" ON public.pastoral_messages;
CREATE POLICY "Gestão de mensagens por administradores"
ON public.pastoral_messages FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Seed de Mensagens Inaugurais
INSERT INTO public.pastoral_messages (
    id,
    parish_id,
    author_type,
    author_name,
    author_title,
    title,
    slug,
    subtitle,
    content,
    liturgical_season,
    is_featured_home,
    published_at
) VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'paroco',
    'Padre Irineu Claudino Sales',
    'Pároco e Cura da Catedral de Colatina',
    'Uma Igreja em Saída nos Meios Digitais: Bem-vindos ao Novo Portal da Catedral!',
    'palavra-do-paroco-uma-igreja-em-saida-digital',
    '«A beleza de nossa fé precisa resplandecer onde o povo está — e hoje, nossos lares e corações também se conectam pela tela do celular.»',
    'Queridos paroquianos da Catedral do Sagrado Coração de Jesus e irmãos de todas as nossas 12 comunidades e núcleos de oração!

É com imensa alegria pastoral e coração repleto de esperança que apresentamos este novo portal digital da nossa paróquia. O Papa Francisco constantemente nos convida a sermos uma "Igreja de Portas Abertas", acolhedora e próxima de cada família, enfermo e jovem.

Este espaço não é apenas um site informativo: ele é uma extensão viva do altar de nossa Catedral. Aqui vocês encontram nossos horários de celebração diária, as orientações para os sacramentos, a partilha fraterna através das nossas comunidades e o acesso diário à Palavra de Deus.

Acolham este canal como um instrumento de bênção para seu lar. Que o Sagrado Coração de Jesus derrame copiosas bênçãos sobre cada família colatinense!',
    'Solenidade de Todos os Santos',
    true,
    '2026-10-07 10:00:00-03'
),
(
    'a0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'bispo',
    'Dom Lauro Sérgio Versiani Barbosa',
    'Bispo Diocesano de Colatina',
    'Comunhão, Participação e Missão: A Catedral como Mãe e Referência Pastoral',
    'palavra-do-bispo-catedral-mae-e-referencia-pastoral',
    '«A Catedral é a cátedra de onde emana a unidade da Diocese de Colatina; que a comunicação eclesial seja reflexo do amor misericordioso de Cristo.»',
    'Irmãos e irmãs da amada Diocese de Colatina e da Paróquia Catedral do Sagrado Coração de Jesus, paz e bem!

A Igreja Diocesana se alegra com cada passo que damos rumo à sinodalidade e à comunhão. A Catedral, sede da nossa cátedra episcopal, possui a sublime missão de ser luz orientadora e abraço acolhedor para todas as paróquias do Vale do Rio Doce.

A evangelização através dos meios contemporâneos de comunicação é uma exigência missionária. Que esta presença digital renove em cada fiel o ardor missionário, a dedicação às comunidades de base e o compromisso solene com os mais pobres e necessitados.

Com minha bênção episcopal a todo o clero, pastorais e paroquianos da Catedral!',
    'Tempo Comum',
    false,
    '2026-10-05 09:00:00-03'
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. CADASTRO DO GRUPO DE REFLEXÃO SANTA RITA (12ª COMUNIDADE/NÚCLEO)
-- ------------------------------------------------------------------------------
INSERT INTO public.communities (
    id,
    parish_id,
    name,
    patron_saint,
    is_headquarters,
    neighborhood,
    city,
    state,
    slug,
    foundation_year,
    feast_day,
    history,
    contact_name,
    contact_phone,
    is_active
) VALUES (
    'c0000000-0000-0000-0000-000000000022',
    'c0000000-0000-0000-0000-000000000001',
    'Grupo de Reflexão Santa Rita',
    'Santa Rita de Cássia',
    false,
    'Brisa do Vale',
    'Colatina',
    'ES',
    'santa-rita-brisa-do-vale',
    '2018',
    '22 de Maio',
    'Núcleo vivo de oração e partilha da Palavra de Deus reunido no Bairro Brisa do Vale. Sob a poderosa intercessão de Santa Rita de Cássia, as famílias do bairro se reúnem semanalmente em círculos bíblicos de reflexão, terço e fraternidade cristã em profunda união com a Catedral.',
    'Coordenação do Grupo de Reflexão',
    '(27) 2102-5012',
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    patron_saint = EXCLUDED.patron_saint,
    neighborhood = EXCLUDED.neighborhood,
    slug = EXCLUDED.slug,
    feast_day = EXCLUDED.feast_day,
    history = EXCLUDED.history;

-- ------------------------------------------------------------------------------
-- 3. MÓDULO DE FOLHETOS DE MISSA (SOU DO SAGRADO MISSA)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.liturgical_booklets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    celebration_date DATE NOT NULL,
    sunday_label TEXT NOT NULL DEFAULT 'Domingo',
    theme TEXT,
    pdf_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    download_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.liturgical_booklets ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_liturgical_booklets_parish_id ON public.liturgical_booklets(parish_id);
CREATE INDEX IF NOT EXISTS idx_liturgical_booklets_date ON public.liturgical_booklets(celebration_date);

DROP POLICY IF EXISTS "Leitura pública de folhetos ativos" ON public.liturgical_booklets;
CREATE POLICY "Leitura pública de folhetos ativos"
ON public.liturgical_booklets FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de folhetos por administradores" ON public.liturgical_booklets;
CREATE POLICY "Gestão de folhetos por administradores"
ON public.liturgical_booklets FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. BUCKET DE SUPABASE STORAGE: 'booklets' (FOLHETOS EM PDF)
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
