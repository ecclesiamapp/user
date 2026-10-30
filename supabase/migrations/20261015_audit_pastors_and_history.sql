-- ==============================================================================
-- Migração: Refinamento Canônico de História, Sucessão Apostólica e In Memoriam
-- Data: 15/10/2026
-- Tarefa: TASK-26C-AUDIT
-- ==============================================================================

-- 1. Criar tabelas se ainda não existirem
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
  in_memoriam boolean NOT NULL DEFAULT false,
  deceased_year text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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

-- 2. Garantir novas colunas se a tabela já existia
ALTER TABLE public.parish_pastors_succession ADD COLUMN IF NOT EXISTS in_memoriam boolean NOT NULL DEFAULT false;
ALTER TABLE public.parish_pastors_succession ADD COLUMN IF NOT EXISTS deceased_year text;

-- 3. Índices de Performance e Isolamento Multi-Tenant
CREATE INDEX IF NOT EXISTS idx_history_milestones_parish ON public.parish_history_milestones(parish_id);
CREATE INDEX IF NOT EXISTS idx_history_milestones_active ON public.parish_history_milestones(is_active);
CREATE INDEX IF NOT EXISTS idx_pastors_succession_parish ON public.parish_pastors_succession(parish_id);
CREATE INDEX IF NOT EXISTS idx_pastors_succession_cat ON public.parish_pastors_succession(category);
CREATE INDEX IF NOT EXISTS idx_sacred_heritage_parish ON public.parish_sacred_heritage(parish_id);
CREATE INDEX IF NOT EXISTS idx_sacred_heritage_active ON public.parish_sacred_heritage(is_active);

-- 4. Habilitar RLS
ALTER TABLE public.parish_history_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_pastors_succession ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parish_sacred_heritage ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acesso
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

-- 6. Limpar sementes antigas para inserção limpa e atualizada da Catedral de Colatina
DELETE FROM public.parish_pastors_succession WHERE parish_id = 'c0000000-0000-0000-0000-000000000001';
DELETE FROM public.parish_history_milestones WHERE parish_id = 'c0000000-0000-0000-0000-000000000001';
DELETE FROM public.parish_sacred_heritage WHERE parish_id = 'c0000000-0000-0000-0000-000000000001';

-- 7. Inserir Sucessão Episcopal Oficial (Os 4 Bispos Diocesanos de Colatina com Fotos Oficiais)
INSERT INTO public.parish_pastors_succession (
  parish_id, category, order_number, order_label, name, title, period, motto, motto_translation, summary, achievements, image_url, is_current, in_memoriam, deceased_year
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
  'Primeiro bispo da Diocese de Colatina, nomeado pelo Papa São João Paulo II. Instalou solenemente a diocese, estruturou os conselhos pastorais e ordenou a primeira geração de padres diocesanos.',
  '["Instalação solene da Cátedra e da Cúria Diocesana em 1990", "Criação do Seminário Diocesano Maria Mãe da Igreja", "Posteriormente foi Arcebispo Metropolitano de Mariana e Presidente da CNBB"]'::jsonb,
  '/images/pastores/dom-geraldo-lyrio-rocha.webp',
  false,
  true,
  '2023'
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
  'Bispo salesiano com vibrante carisma vocacional e juvenil. Impulsionou com ardor a juventude, a catequese paroquial e elevou o Santuário Diocesano de Nossa Senhora da Saúde.',
  '["Elevação do Santuário Diocesano de Nossa Senhora da Saúde em Ibiraçu", "Grande incentivo às vocações sacerdotais e religiosas", "Dinamização das pastorais sociais e caritativas em toda a diocese"]'::jsonb,
  '/images/pastores/dom-decio-zandonade.webp',
  false,
  false,
  NULL
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
  'Dedicou seu ministério episcopal à proximidade pastoral com os presbíteros, sólida formação doutrinal dos leigos e à histórica celebração dos 30 anos da Diocese de Colatina.',
  '["Iniciativa da grande obra de adequação litúrgica da Catedral", "Fortalecimento da comunhão presbiteral e visitas pastorais contínuas", "Conduziu a Igreja Diocesana com serenidade durante a pandemia da Covid-19"]'::jsonb,
  '/images/pastores/dom-joaquim-wladimir.webp',
  false,
  false,
  NULL
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
  'Atual pastor próprio da Diocese de Colatina. Conduz o rebanho do Senhor com ardor missionário, escuta sinodal das comunidades, zelo pelas vocações e amor preferencial aos pobres.',
  '["Posse canônica na Catedral do Sagrado Coração em 02 de fevereiro de 2022", "Implementação do processo sinodal nas 12 comunidades e paróquias", "Presidente do Regional Leste 3 da Conferência Nacional dos Bispos do Brasil (CNBB)"]'::jsonb,
  '/images/pastores/dom-lauro-versiani.webp',
  true,
  false,
  NULL
);

-- 8. Inserir Censo Histórico Profundo de Párocos da Catedral (1928 – 2026)
INSERT INTO public.parish_pastors_succession (
  parish_id, category, order_number, order_label, name, title, period, summary, achievements, image_url, is_current, in_memoriam, deceased_year
) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  1,
  'Pároco Atual',
  'Pe. Irineu Claudino Sales',
  'Pároco e Cura da Catedral',
  '2024 – Presente',
  'Atual pároco responsável pela condução espiritual e administrativa da Paróquia Sagrado Coração de Jesus. Conhecido pelo acolhimento fraterno aos fiéis, zelo litúrgico solene e impulso à evangelização das 12 CEBs.',
  '["Dinamização das pastorais paroquiais e acolhimento dos fiéis", "Impulso pioneiro à presença digital e secretaria online", "Acompanhamento pastoral diário das 12 CEBs e Grupo Santa Rita"]'::jsonb,
  '/images/pastores/pe-irineu-claudino-sales.webp',
  true,
  false,
  NULL
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  2,
  'Pároco Anterior',
  'Pe. José Valdecy Romão',
  'Pároco e Cura Emérito da Catedral',
  '2017 – 2024',
  'Conduziu a Catedral do Sagrado Coração de Jesus com zelo pastoral exemplar, dedicação à Sagrada Liturgia e às Santas Missas e dinamização das pastorais urbanas e das comunidades de base.',
  '["Zelo sacramental e litúrgico contínuo na Catedral Diocesana", "Fortalecimento das pastorais sociais e caritativas em Colatina"]'::jsonb,
  NULL,
  false,
  false,
  NULL
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  3,
  'Pároco Emérito',
  'Pe. Valter Rohr',
  'Pároco Emérito da Catedral',
  '1985 – 2005',
  'Marcou época na vida eclesial de Colatina por seu coração acolhedor, formação de lideranças leigas e dedicação incansável às famílias e aos doentes da cidade.',
  '["Formação de dezenas de lideranças comunitárias leigas", "Zelo incansável pelas famílias e pelos doentes da cidade", "Apoio irrestrito à instalação da Diocese em 1990"]'::jsonb,
  NULL,
  false,
  true,
  '2017'
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  4,
  'Pároco Construtor',
  'Monsenhor Rubens Duque',
  'Pároco Construtor e Prelado de Honra',
  '1965 – 1985',
  'Figura de proa na história da fé colatinense. Liderou a mobilização de fé e comunidade para a consolidação material e espiritual do templo da Catedral.',
  '["Mobilização do povo colatinense para a conclusão do templo", "Consolidação dos círculos bíblicos na cidade de Colatina"]'::jsonb,
  NULL,
  false,
  true,
  '2018'
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  5,
  'Pároco Idealizador da Catedral',
  'Cônego Geraldo Meyers',
  'Pároco e Idealizador da Nova Matriz',
  '1945 – 1965',
  'Sacerdote de origem alemã que dedicou sua vida a Colatina. Idealizou e iniciou a construção da monumental Matriz em 1952 após o desabamento da antiga capela. Em honra ao seu legado, seus restos mortais repousam solenemente na Cripta da própria Catedral.',
  '["Lançamento da pedra fundamental da nova Matriz em 20 de junho de 1952", "Contratação do renomado arquiteto Benedito Calixto Neto", "Sepultamento com honras eclesiásticas na Cripta da Catedral"]'::jsonb,
  NULL,
  false,
  true,
  '1994'
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  6,
  'Memória Pastoral',
  'Pe. José Geraldo Vidigal',
  'Pároco da Memória Pastoral',
  'Período Histórico',
  'Sacerdote de profunda oração e caridade, dedicou anos fecundos à formação sacramental e pastoral dos paroquianos de Colatina.',
  '["Dedicação ao confessionário e atendimento pastoral diário", "Zelo pelos enfermos e consolo espiritual às famílias"]'::jsonb,
  NULL,
  false,
  true,
  'In Memoriam'
),
(
  'c0000000-0000-0000-0000-000000000001',
  'pastor',
  7,
  'Origens Centenárias',
  'Freis Capuchinhos & Primeiros Missionários',
  'Pioneiros da Evangelização no Rio Doce',
  '1927 – 1945',
  'Missionários pioneiros que desbravaram o Vale do Rio Doce e ergueram a primeira matriz de madeira e alvenaria no florescente povoado de Colatina, acolhendo os primeiros fiéis.',
  '["Criação canônica da Paróquia Sagrado Coração de Jesus em 24/12/1927", "Erguimento da primeira igreja matriz no centro de Colatina em 1928", "Fundação das primeiras associações religiosas e confrarias de fé"]'::jsonb,
  NULL,
  false,
  true,
  '1928'
);

-- 9. Inserir Marcos da Linha do Tempo Histórica
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
  'Erigida canonicamente em 24 de dezembro de 1927 por Dom Benedito Paulo Alves de Souza e estruturada em 1928, a paróquia nasceu com o florescimento do povoado às margens do Rio Doce, tornando-se o centro da vida católica colatinense.',
  'cross',
  'Marco fundador da presença católica oficial no centro de Colatina.',
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
  'Após o desabamento da antiga matriz pelas chuvas de 1949, a pedra fundamental do atual templo foi lançada em 20 de junho de 1952 pelo Cônego Geraldo Meyers. O projeto foi assinado pelo renomado arquiteto paulista Benedito Calixto Neto, erguendo duas torres majestosas de 47 metros e arcos plenos.',
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
  'O templo recebe os célebres vitrais artísticos de tradição alemã fabricados pela Casa Conrado, transformando a nave em um dos mais impressionantes conjuntos de arte vitralista do Brasil. O campanário abriga sinos de bronze batizados em 1960 e o relógio de quatro faces.',
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
  'Em 23 de abril de 1990, por meio da Bula Papal "Ex Munere Caritatis" de São João Paulo II, é criada a Diocese de Colatina. A Matriz do Sagrado Coração é solenemente elevada à dignidade de Catedral Diocesana, recebendo a Cátedra Episcopal e acolhendo Dom Geraldo Lyrio Rocha.',
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
);

-- 10. Inserir Patrimônio Sacro Oficial
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
  'Produzidos com maestria artística pela Casa Conrado. Filtram a luz em tons rubis, dourados e azuis, narrando a Paixão e o Sagrado Coração de Jesus.',
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
);
