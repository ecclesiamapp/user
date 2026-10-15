-- ==============================================================================
-- Migração: Módulo Multi-Tenant de História, Linha do Tempo e Patrimônio Sacro
-- Data: 14/10/2026
-- Tabelas: parish_history_milestones, parish_pastors_succession, parish_sacred_heritage
-- ==============================================================================

-- 1. Tabela de Marcos da Linha do Tempo Histórica
CREATE TABLE IF NOT EXISTS public.parish_history_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  year text NOT NULL,
  year_order integer NOT NULL DEFAULT 0,
  era text NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  icon_name text DEFAULT 'church',
  highlight text,
  image_url text,
  image_caption text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Tabela de Sucessão Apostólica (Bispos Diocesanos e Párocos)
CREATE TABLE IF NOT EXISTS public.parish_pastors_succession (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('bishop', 'pastor')),
  order_number integer NOT NULL DEFAULT 0,
  order_label text,
  name text NOT NULL,
  title text,
  period text NOT NULL,
  motto text,
  motto_translation text,
  summary text NOT NULL,
  achievements jsonb DEFAULT '[]'::jsonb,
  image_url text,
  is_current boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Tabela de Patrimônio Sacro, Vitrais e Arquitetura do Templo
CREATE TABLE IF NOT EXISTS public.parish_sacred_heritage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  theological_meaning text NOT NULL,
  icon text DEFAULT 'sparkles',
  image_url text,
  image_caption text,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índices de Otimização Multi-Tenant
CREATE INDEX IF NOT EXISTS idx_history_milestones_parish ON public.parish_history_milestones(parish_id);
CREATE INDEX IF NOT EXISTS idx_history_milestones_active ON public.parish_history_milestones(is_active);
CREATE INDEX IF NOT EXISTS idx_pastors_succession_parish ON public.parish_pastors_succession(parish_id);
CREATE INDEX IF NOT EXISTS idx_pastors_succession_cat ON public.parish_pastors_succession(category);
CREATE INDEX IF NOT EXISTS idx_sacred_heritage_parish ON public.parish_sacred_heritage(parish_id);
CREATE INDEX IF NOT EXISTS idx_sacred_heritage_active ON public.parish_sacred_heritage(is_active);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.parish_history_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_pastors_succession ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_sacred_heritage ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Leitura Pública (Portal do Fiel)
DROP POLICY IF EXISTS "Permitir leitura publica de marcos historicos ativos" ON public.parish_history_milestones;
CREATE POLICY "Permitir leitura publica de marcos historicos ativos"
  ON public.parish_history_milestones FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Permitir leitura publica de pastores ativos" ON public.parish_pastors_succession;
CREATE POLICY "Permitir leitura publica de pastores ativos"
  ON public.parish_pastors_succession FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Permitir leitura publica de patrimonio sacro ativo" ON public.parish_sacred_heritage;
CREATE POLICY "Permitir leitura publica de patrimonio sacro ativo"
  ON public.parish_sacred_heritage FOR SELECT
  USING (is_active = true);

-- Políticas de RLS para Gestão Administrativa
DROP POLICY IF EXISTS "Permitir gestao total de marcos historicos para admin" ON public.parish_history_milestones;
CREATE POLICY "Permitir gestao total de marcos historicos para admin"
  ON public.parish_history_milestones FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir gestao total de pastores para admin" ON public.parish_pastors_succession;
CREATE POLICY "Permitir gestao total de pastores para admin"
  ON public.parish_pastors_succession FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir gestao total de patrimonio sacro para admin" ON public.parish_sacred_heritage;
CREATE POLICY "Permitir gestao total de patrimonio sacro para admin"
  ON public.parish_sacred_heritage FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- SEED DATA INICIAL PARA A PARÓQUIA PILOTO (Catedral de Colatina)
-- ID: c0000000-0000-0000-0000-000000000001
-- ==============================================================================

-- 1. Inserir Marcos da Linha do Tempo
INSERT INTO public.parish_history_milestones (
  parish_id, year, year_order, era, title, subtitle, description, icon_name, highlight, image_url, image_caption
) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  '1928',
  1928,
  'Origens & Fundação',
  'Criação da Paróquia Sagrado Coração de Jesus',
  'Os primeiros missionários no vale do Rio Doce',
  'Com o florescimento do povoado de Colatina às margens do Rio Doce, é canonicamente erigida a Paróquia Sagrado Coração de Jesus. Os primeiros freis capuchinhos e padres missionários ergueram a primeira igreja matriz, tornando-se o coração espiritual da comunidade.',
  'cross',
  'Marco fundador da presença católica em Colatina.',
  NULL,
  NULL
),
(
  'c0000000-0000-0000-0000-000000000001',
  '1952',
  1952,
  'Construção do Templo',
  'A Nova Matriz por Benedito Calixto Neto',
  'O mesmo arquiteto do Santuário Nacional de Aparecida',
  'Após o desabamento da antiga matriz em 1949 por fortes chuvas, a pedra fundamental do atual templo foi lançada em 20 de junho de 1952. O projeto monumental foi assinado pelo renomado arquiteto paulista Benedito Calixto Neto, erguendo duas torres imponentes e uma nave majestosa com arcos plenos.',
  'church',
  'Projeto neoclássico e neorromânico concebido pelo mesmo projetista da Basílica de Aparecida/SP.',
  '/images/historia/projeto-benedito-calixto.jpg',
  'Projeto original de 1952 desenhado pelo arquiteto Benedito Calixto Neto.'
),
(
  'c0000000-0000-0000-0000-000000000001',
  '1970',
  1970,
  'Arte Sacra',
  'Instalação dos Magníficos Vitrais e Sinos',
  'Catequese viva através da luz e do bronze',
  'O templo recebe os célebres vitrais artísticos de tradição alemã e da Casa Conrado, transformando a nave em um dos mais impressionantes conjuntos de arte vitralista do Brasil. O campanário abriga sinos de bronze batizados em 1960, sendo o maior de uma tonelada, além do relógio de quatro faces na torre de 47 metros.',
  'bell',
  'Vitrais reconhecidos como patrimônio artístico, sacro e cultural do Espírito Santo.',
  '/images/historia/catedral-vitrais.jpg',
  'A luz solar filtrada pelos vitrais sacros da Catedral do Sagrado Coração.'
),
(
  'c0000000-0000-0000-0000-000000000001',
  '1990',
  1990,
  'Elevação Canônica',
  'Criação da Diocese de Colatina e Elevação a Catedral',
  'O Papa São João Paulo II institui a Igreja-Mãe',
  'Em 23 de abril de 1990, por meio da Bula Papal "Ex Munere Caritatis" de São João Paulo II, é criada a Diocese de Colatina, desmembrada da Arquidiocese de Vitória. A Matriz do Sagrado Coração é solenemente elevada à dignidade de Catedral Diocesana, recebendo a Cátedra Episcopal.',
  'crown',
  'Elevação da Matriz a Igreja-Mãe de 17 municípios capixabas.',
  '/images/historia/catedral-interior.jpg',
  'A imponente nave da Catedral Sagrado Coração de Jesus de Colatina.'
),
(
  'c0000000-0000-0000-0000-000000000001',
  '2006',
  2006,
  'Tombamento Histórico',
  'Patrimônio Histórico, Artístico e Cultural',
  'Reconhecimento oficial pela Lei Municipal nº 5.246/2006',
  'O templo da Catedral e seu conjunto arquitetônico são oficialmente declarados Patrimônio Histórico, Artístico e Cultural do município de Colatina, assegurando a preservação perpétua de suas fachadas, torres, arcos e entorno.',
  'scroll',
  'Catedral consagrada como patrimônio histórico e identidade viva do povo colatinense.',
  NULL,
  NULL
),
(
  'c0000000-0000-0000-0000-000000000001',
  '2022',
  2022,
  'Adequação Litúrgica & Futuro',
  'Revitalização do Presbitério & Era Digital',
  'Baldaquino dos 7 Dons, acústica e acolhida pastoral',
  'A Catedral passa por um minucioso restauro litúrgico: ganha o baldaquino heptagonal com os 7 dons do Espírito Santo sobre o Altar, o piso processional de círculos e losangos, painéis acústicos e, no centenário de evangelização, abre suas portas para a presença digital das 12 CEBs.',
  'sparkles',
  'Beleza sagrada atemporal unida à comunhão das novas gerações de fiéis.',
  '/images/historia/nave-revitalizada.jpg',
  'Vista da nave central e presbitério após o projeto de adequação litúrgica.'
)
ON CONFLICT DO NOTHING;

-- 2. Inserir Bispos Diocesanos e Párocos
INSERT INTO public.parish_pastors_succession (
  parish_id, category, order_number, order_label, name, title, period, motto, motto_translation, summary, achievements, is_current
) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'bishop',
  1,
  '1º Bispo Diocesano',
  'Dom Geraldo Lyrio Rocha',
  'Bispo de Colatina (1990 – 2002)',
  '1990 – 2002',
  'Opus Justitiae Pax',
  'A paz é fruto da justiça (Is 32, 17)',
  'Primeiro bispo da Diocese de Colatina, nomeado pelo Papa São João Paulo II. Instalou a diocese, estruturou os conselhos pastorais e ordenou os primeiros padres diocesanos.',
  '["Instalação solene da Cátedra e da Cúria Diocesana em 1990", "Criação do Seminário Diocesano Maria Mãe da Igreja", "Posteriormente foi Arcebispo de Mariana e Presidente da CNBB"]'::jsonb,
  false
),
(
  'c0000000-0000-0000-0000-000000000001',
  'bishop',
  2,
  '2º Bispo Diocesano',
  'Dom Décio Sossai Zandonade, SDB',
  'Bispo de Colatina (2003 – 2014)',
  '2003 – 2014',
  'Domine, Ut Videam',
  'Senhor, que eu veja! (Lc 18, 41)',
  'Bispo salesiano com forte carisma vocacional e juvenil. Impulsionou intensamente a juventude, a catequese paroquial e a devoção a Nossa Senhora da Saúde.',
  '["Elevação do Santuário Diocesano de Nossa Senhora da Saúde em Ibiraçu", "Grande incentivo às vocações sacerdotais e religiosas", "Dinamização das pastorais sociais e caritativas em toda a diocese"]'::jsonb,
  false
),
(
  'c0000000-0000-0000-0000-000000000001',
  'bishop',
  3,
  '3º Bispo Diocesano',
  'Dom Joaquim Wladimir Lopes Dias',
  'Bispo de Colatina (2015 – 2021)',
  '2015 – 2021',
  'Caritas in Veritate',
  'A caridade na verdade (Ef 4, 15)',
  'Dedicou seu ministério episcopal à proximidade com os párocos, formação doutrinal sólida dos fiéis e celebração dos 30 anos de criação da Diocese de Colatina.',
  '["Iniciativa da grande obra de adequação litúrgica da Catedral", "Fortalecimento da comunhão presbiteral e visitas pastorais nas paróquias", "Conduziu a Igreja Diocesana com serenidade durante o período da pandemia"]'::jsonb,
  false
),
(
  'c0000000-0000-0000-0000-000000000001',
  'bishop',
  4,
  '4º Bispo Diocesano (Atual)',
  'Dom Lauro Sérgio Versiani Barbosa',
  'Bispo Diocesano de Colatina (2022 – presente)',
  '2022 – Presente',
  'Caritas Christi Urget Nos',
  'O amor de Cristo nos impele (2Cor 5, 14)',
  'Atual pastor da Diocese de Colatina. Conduz o povo de Deus com ardor missionário, foco na sinodalidade, escuta das comunidades e testemunho do Evangelho junto aos mais necessitados.',
  '["Posse canônica na Catedral do Sagrado Coração em 02 de fevereiro de 2022", "Implementação do processo sinodal nas 12 comunidades e paróquias", "Intensa presença pastoral celebrativa e caritativa junto ao povo de Deus"]'::jsonb,
  true
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  1,
  'Pároco Atual',
  'Pe. Irineu Claudino Sales',
  'Pároco e Cura da Catedral',
  '2021 – Presente',
  NULL,
  NULL,
  'Atual pároco responsável pela condução espiritual e administrativa da Paróquia Sagrado Coração de Jesus. Conhecido pelo acolhimento fraterno aos fiéis, zelo litúrgico solene e impulso à evangelização das 12 CEBs.',
  '["Dinamização das pastorais paroquiais e acolhimento dos fiéis", "Impulso pioneiro à presença digital e secretaria online", "Acompanhamento pastoral diário das 12 CEBs"]'::jsonb,
  true
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  2,
  'Pároco Emérito',
  'Pe. Valter Rohr',
  'Pároco Emérito',
  'Período Histórico',
  NULL,
  NULL,
  'Marcou época na vida eclesial de Colatina por seu coração acolhedor, formação de lideranças leigas e dedicação incansável às famílias e aos doentes.',
  '["Formação de dezenas de lideranças comunitárias leigas", "Zelo incansável pelas famílias e pelos doentes da cidade"]'::jsonb,
  false
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  3,
  'Pároco Construtor',
  'Monsenhor Rubens Duque',
  'Pároco Construtor',
  'Período Histórico',
  NULL,
  NULL,
  'Figura de proa na história da fé colatinense. Liderou a mobilização de fé e comunidade para a concretização material e espiritual do templo da Catedral.',
  '["Mobilização do povo colatinense para a construção da Matriz", "Consolidação dos círculos bíblicos na cidade"]'::jsonb,
  false
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  4,
  'Pároco da Memória Pastoral',
  'Pe. José Geraldo Vidigal',
  'Pároco da Memória Pastoral',
  'Período Histórico',
  NULL,
  NULL,
  'Sacerdote de profunda oração e caridade, dedicou anos fecundos à formação sacramental e pastoral dos paroquianos de Colatina.',
  '["Dedicação ao atendimento pastoral e espiritual diário"]'::jsonb,
  false
)
ON CONFLICT DO NOTHING;

-- 3. Inserir Patrimônio Sacro
INSERT INTO public.parish_sacred_heritage (
  parish_id, title, category, description, theological_meaning, icon, image_url, image_caption, order_index
) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'Planta de Benedito Calixto Neto',
  'Arquitetura de 1952',
  'Projeto assinado pelo mesmo arquiteto da Basílica de Aparecida/SP. Destaca arcos plenos, nave ampla e duas torres imponentes com relógio de quatro faces.',
  'A igreja de pedras visíveis expressa a dignidade da Igreja espiritual de Pedras Vivas, chamada a ser farol da verdade divina na cidade.',
  'scroll',
  '/images/historia/projeto-benedito-calixto.jpg',
  'Desenho arquitetônico original da Catedral assinado em 1952.',
  1
),
(
  'c0000000-0000-0000-0000-000000000001',
  'Os Vitrais Sagrados',
  'Patrimônio Sacro & Luz',
  'Produzidos com maestria artística pela Casa Conrado e restaurados pela Kingdom. Filtram a luz em tons rubis, dourados e azuis, narrando a Paixão e o Sagrado Coração.',
  'Uma Bíblia aberta em cores e luz celestial. A luz que atravessa os vitrais representa a Graça Divina que ilumina e transfigura a vida dos fiéis.',
  'sun',
  '/images/historia/catedral-vitrais.jpg',
  'Vitrais sacros originais iluminando a nave da Catedral de Colatina.',
  2
),
(
  'c0000000-0000-0000-0000-000000000001',
  'O Altar e o Baldaquino dos 7 Dons',
  'Centro da Liturgia Eucarística',
  'Mesa de pedra maciça consagrada, coroada por um elegante baldaquino heptagonal com os sete dons do Espírito Santo e piso em quatro círculos orgânicos.',
  'O Altar é o próprio Cristo Vivo. O baldaquino evoca a proteção do Espírito Santo, enquanto os círculos lembram que a Eucaristia deve ir aos quatro cantos do mundo.',
  'flame',
  '/images/historia/altar-baldaquino.jpg',
  'Baldaquino heptagonal e Altar consagrado da Catedral.',
  3
),
(
  'c0000000-0000-0000-0000-000000000001',
  'Caminho das Procissões',
  'Piso em Mosaico Litúrgico',
  'Inspirado nos labirintos sagrados das basílicas medievais, possui 8 círculos e 7 losangos em granito nobre que conduzem da porta principal ao Altar.',
  'O número 8 representa a Ressurreição (o Oitavo Dia da Nova Criação) e o número 7 a plenitude do Espírito Santo, guiando a caminhada do cristão rumo ao Céu.',
  'shield',
  '/images/historia/caminho-procissoes.jpg',
  'Piso processional com geometria sagrada e sentido catequético.',
  4
),
(
  'c0000000-0000-0000-0000-000000000001',
  'A Cátedra & Nave Monumental',
  'Símbolo Episcopal & Assembléia',
  'A cátedra no presbitério assinala a autoridade docente do Bispo. A ampla nave com painéis acústicos acolhe calorosamente o povo de Deus.',
  'A Cátedra é o sinal da unidade diocesana com os Apóstolos e com o Sucessor de Pedro em Roma. A nave expressa a Igreja como Corpo Místico de Cristo.',
  'chair',
  '/images/historia/catedral-interior.jpg',
  'Nave central e perspectiva em direção ao presbitério da Catedral.',
  5
),
(
  'c0000000-0000-0000-0000-000000000001',
  'O Campanário e Sinos de Bronze',
  'A Voz de Deus na Cidade',
  'Torre sineira com 47 metros de altura, relógio de quatro faces e três sinos fundidos em bronze batizados em 1960 (o maior pesando cerca de 1 tonelada).',
  'A voz da Igreja que convoca a comunidade colatinense para as Santas Missas, a oração do Angelus e o louvor perpétuo a Deus.',
  'bell',
  '/images/historia/nave-revitalizada.jpg',
  'Harmonia acústica e monumentalidade do templo erguido em Colatina.',
  6
)
ON CONFLICT DO NOTHING;
