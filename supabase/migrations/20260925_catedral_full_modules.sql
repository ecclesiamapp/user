-- ==============================================================================
-- MIGRAÇÃO SUPABASE: MÓDULOS INSTITUCIONAL, CLERO, PASTORAIS E HISTÓRIA (CATEDRAL)
-- ==============================================================================

-- 1. Tabela do Clero (Pároco e Vigários)
CREATE TABLE IF NOT EXISTS public.clergy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'vigario' CHECK (role IN ('paroco', 'vigario', 'diacono', 'bispo')),
    title TEXT NOT NULL, -- Ex: "Pároco e Cura da Catedral"
    birthday TEXT, -- Ex: "24 de julho"
    ordination_date TEXT, -- Ex: "12 de agosto de 2017"
    bio TEXT,
    photo_url TEXT,
    office_hours TEXT, -- Ex: "Terça e Quinta-feira: 14:30h às 16:30h"
    is_active BOOLEAN NOT NULL DEFAULT true,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clergy ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública do clero ativo" ON public.clergy;
CREATE POLICY "Leitura pública do clero ativo"
ON public.clergy FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão do clero por administradores" ON public.clergy;
CREATE POLICY "Gestão do clero por administradores"
ON public.clergy FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_clergy_parish_id ON public.clergy(parish_id);


-- 2. Tabela de Pastorais, Equipes e Movimentos
CREATE TABLE IF NOT EXISTS public.pastorals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'pastoral' CHECK (type IN ('pastoral', 'movimento', 'equipe', 'servico')),
    coordinator_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    meeting_schedule TEXT, -- Ex: "Encontros quinzenais aos sábados às 16h"
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pastorals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de pastorais ativas" ON public.pastorals;
CREATE POLICY "Leitura pública de pastorais ativas"
ON public.pastorals FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de pastorais por administradores" ON public.pastorals;
CREATE POLICY "Gestão de pastorais por administradores"
ON public.pastorals FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_pastorals_parish_id ON public.pastorals(parish_id);


-- 3. Tabela de Folhetos Litúrgicos de Missa ("Sou do Sagrado Missa")
CREATE TABLE IF NOT EXISTS public.liturgy_booklets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- Ex: "26º Domingo do Tempo Comum"
    celebration_date DATE NOT NULL,
    liturgical_color TEXT NOT NULL DEFAULT 'verde' CHECK (liturgical_color IN ('verde', 'branco', 'vermelho', 'roxo', 'rosa')),
    file_url TEXT NOT NULL, -- URL para download do PDF
    file_size_kb INT,
    downloads_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.liturgy_booklets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de folhetos litúrgicos" ON public.liturgy_booklets;
CREATE POLICY "Leitura pública de folhetos litúrgicos"
ON public.liturgy_booklets FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Gestão de folhetos por administradores" ON public.liturgy_booklets;
CREATE POLICY "Gestão de folhetos por administradores"
ON public.liturgy_booklets FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_liturgy_booklets_date ON public.liturgy_booklets(celebration_date);


-- 4. Tabela de Galerias de Fotos e Eventos
CREATE TABLE IF NOT EXISTS public.galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_date DATE,
    cover_image_url TEXT,
    photos_count INT NOT NULL DEFAULT 0,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de URLs das fotos do álbum
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
USING (true)
WITH CHECK (true);


-- 5. Seed Completo: Clero Oficial da Catedral
INSERT INTO public.clergy (
    parish_id, name, role, title, birthday, ordination_date, office_hours, order_index
) VALUES 
(
    'c0000000-0000-0000-0000-000000000001',
    'Padre Irineu Claudino Sales',
    'paroco',
    'Pároco e Cura da Catedral de Colatina',
    '24 de julho',
    '12 de agosto de 2017',
    'Terça e Quinta-feira: 14:30h às 16:30h',
    1
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Padre Deivid José Langa Lopes',
    'vigario',
    'Vigário Paroquial',
    '08 de março',
    '25 de março de 2023',
    'Conforme agendamento na secretaria',
    2
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Padre Ernandes Samuel Fantin',
    'vigario',
    'Vigário Paroquial',
    '13 de julho',
    '12 de dezembro de 1971',
    'Conforme agendamento na secretaria',
    3
)
ON CONFLICT DO NOTHING;


-- 6. Seed Completo: As 11 CEBs Reais da Catedral de Colatina
INSERT INTO public.communities (
    parish_id, name, patron_saint, is_headquarters, address, neighborhood, city, state, is_active
) VALUES 
(
    'c0000000-0000-0000-0000-000000000001',
    'Catedral Sagrado Coração de Jesus (Matriz)',
    'Sagrado Coração de Jesus',
    true,
    'Praça Frei José, Nº 26',
    'Centro',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade Nossa Senhora do Perpétuo Socorro',
    'Nossa Senhora do Perpétuo Socorro',
    false,
    'Rua Lígia Fagundes Guerra, Nº 05',
    'Bairro Perpétuo Socorro',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade Sagrada Família',
    'Sagrada Família',
    false,
    'Rua Francisco Cunha, S/N',
    'Bairro Maria Ismênia',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade São Francisco de Assis',
    'São Francisco de Assis',
    false,
    'Rua Fabiano Silvas, S/N',
    'Bairro Operário',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade São Pedro',
    'São Pedro',
    false,
    'Av. Pedro Vitalli, S/N',
    'Bairro Tropical',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade Nossa Senhora de Guadalupe',
    'Nossa Senhora de Guadalupe',
    false,
    'Rua Matilde Guerra Comério, S/N',
    'Vista da Serra',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade Santa Luzia',
    'Santa Luzia',
    false,
    'Rua João da Mata, S/N',
    'Bairro Alto Vila Nova',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade Nossa Senhora da Penha',
    'Nossa Senhora da Penha',
    false,
    'Rua Macanã, Nº 63',
    'Bairro Moacir Brotas',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade Santo Expedito',
    'Santo Expedito',
    false,
    'Praça Vitória Régia, S/N',
    'Bairro Jardim Planalto',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade São Bento',
    'São Bento',
    false,
    'Rua Floriano Alves Brandão, S/N',
    'Bairro Residencial Nobre',
    'Colatina',
    'ES',
    true
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Comunidade São Lucas',
    'São Lucas',
    false,
    'Av. dos Imigrantes, S/N',
    'Bairro Noêmia Vitalli',
    'Colatina',
    'ES',
    true
)
ON CONFLICT DO NOTHING;


-- 7. Seed Completo: Pastorais e Movimentos Reais da Catedral
INSERT INTO public.pastorals (
    parish_id, name, type, coordinator_name, contact_phone, contact_email, description
) VALUES 
(
    'c0000000-0000-0000-0000-000000000001',
    'Liturgia Paroquial',
    'pastoral',
    'Willian Botan',
    '(27) 2102-5012',
    'liturgia@catedraldecolatina.org.br',
    'Organização das celebrações litúrgicas, leitores, ministros e solenidades.'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Canto Paroquial',
    'pastoral',
    'Leonardo Pimentel Mululo',
    '(27) 2102-5012',
    NULL,
    'Animação musical dos cânticos litúrgicos das santas missas.'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Catequese Paroquial (Iniciação à Vida Cristã)',
    'pastoral',
    'Cleuza Andreão da Silva',
    '(27) 2102-5010',
    'catequese@catedraldecolatina.org.br',
    'Preparação de crianças, jovens e adultos para Batismo, Eucaristia e Crisma.'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Pastoral Familiar',
    'pastoral',
    'Márcio Luis Dalapicula',
    '(27) 2102-5012',
    NULL,
    'Acolhimento, orientação e fortalecimento dos lares e famílias paroquiais.'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Pastoral da Comunicação (PASCOM)',
    'pastoral',
    'Vanessa Almeida Schmidt',
    '(27) 99878-5759',
    'pascom@catedraldecolatina.org.br',
    'Transmissão ao vivo das missas, coberturas fotográficas e redes sociais.'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Pastoral da Escuta',
    'pastoral',
    'Vitor Hugo Gobbi',
    '(27) 2102-5010',
    NULL,
    'Atendimento fraterno e acolhimento espiritual: Segunda a Quinta a partir das 19h.'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Pastoral da Criança',
    'pastoral',
    'Maria da Luz / Clarice Passos Viana',
    '(27) 2102-5010',
    NULL,
    'Acompanhamento nutricional, peso e acolhimento de famílias em vulnerabilidade.'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'Pastoral da Saúde',
    'pastoral',
    'Marilene de Souza Rogério',
    '(27) 2102-5012',
    NULL,
    'Visitas a enfermos nos lares e hospitais, oração e apoio humanitário.'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'EAC - Encontro de Adolescentes com Cristo',
    'movimento',
    'Geiziany Scarpatti Sepulcro Amorin',
    '(27) 2102-5012',
    NULL,
    'Evangelização, retiros e integração pastoral para adolescentes da paróquia.'
),
(
    'c0000000-0000-0000-0000-000000000001',
    'ECC - Encontro de Casais com Cristo',
    'movimento',
    'Eleomar Comério',
    '(27) 2102-5012',
    NULL,
    'Serviço às famílias para despertar casais para a pastoral paroquial.'
)
ON CONFLICT DO NOTHING;
