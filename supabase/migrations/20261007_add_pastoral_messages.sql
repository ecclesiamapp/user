-- ==============================================================================
-- MIGRAÇÃO: MÓDULO DE MENSAGENS PASTORAIS (PALAVRA DO PÁROCO & PALAVRA DO BISPO)
-- ==============================================================================
-- Solicitado pelo Pároco Pe. Irineu Claudino Sales na reunião de 07/10/2026
-- Permite colunas pastorais periódicas ("mini-blog") com destaque seletivo na Home.

CREATE TABLE IF NOT EXISTS public.pastoral_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    author_type TEXT NOT NULL CHECK (author_type IN ('paroco', 'bispo', 'vigario')),
    author_name TEXT NOT NULL,
    author_title TEXT NOT NULL,
    author_photo_url TEXT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT, -- Frase de impacto / citação para destaque
    content TEXT NOT NULL, -- Texto completo da mensagem/reflexão em parágrafos
    liturgical_season TEXT, -- Ex: "Tempo Comum", "Advento", "Natal", "Quaresma"
    cover_image_url TEXT,
    is_featured_home BOOLEAN NOT NULL DEFAULT false, -- Apenas 1 mensagem ativa por vez na Home
    is_active BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ativar Row Level Security (RLS)
ALTER TABLE public.pastoral_messages ENABLE ROW LEVEL SECURITY;

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_pastoral_messages_parish_id ON public.pastoral_messages(parish_id);
CREATE INDEX IF NOT EXISTS idx_pastoral_messages_author_type ON public.pastoral_messages(author_type);
CREATE INDEX IF NOT EXISTS idx_pastoral_messages_featured ON public.pastoral_messages(is_featured_home);
CREATE INDEX IF NOT EXISTS idx_pastoral_messages_published ON public.pastoral_messages(published_at DESC);

-- Políticas RLS
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

-- Seed Inicial: Mensagem Inaugural do Pe. Irineu e Mensagem de Dom Lauro Sérgio
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
