-- =========================================================================
-- Migração: Atualização e Carga Oficial das Mensagens Pastorais do Advento & Natal 2026
-- Paróquia: Catedral do Sagrado Coração de Jesus (Diocese de Colatina)
-- Data: 27 de Outubro de 2026
-- =========================================================================

-- 1. Desmarcar mensagens anteriores do destaque principal da home
UPDATE public.pastoral_messages
SET 
  is_featured_home = false,
  liturgical_season = 'Comunicação Pastoral • Inauguração Digital',
  updated_at = NOW()
WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- 2. Carga Oficial: Carta Pastoral de Dom Lauro Sérgio Versiani Barbosa (Bispo Diocesano)
INSERT INTO public.pastoral_messages (
  id,
  parish_id,
  author_type,
  author_name,
  author_title,
  author_photo_url,
  title,
  slug,
  subtitle,
  content,
  liturgical_season,
  cover_image_url,
  is_featured_home,
  is_active,
  published_at,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000010',
  'c0000000-0000-0000-0000-000000000001',
  'bispo',
  'Dom Lauro Sérgio Versiani Barbosa',
  'Bispo Diocesano de Colatina',
  '/images/pastores/dom-lauro-versiani.webp',
  'Glória a Deus no Mais Alto dos Céus e Paz na Terra: Carta Pastoral do Advento e Natal',
  'carta-pastoral-natal-2026-dom-lauro',
  '«O Verbo se fez carne e habitou entre nós (Jo 1, 14)» — O mistério do Deus próximo que renova a esperança dos lares e ilumina o Vale do Rio Doce.',
  'Amados diocesanos, sacerdotes, diáconos, religiosas e fiéis de toda a Diocese de Colatina e da nossa Paróquia Catedral do Sagrado Coração de Jesus:

Aproxima-se a Noite Santa na qual a Igreja inteira se prostra em adoração diante do Menino Deus deitado em uma manjedoura. O Natal não é uma mera recordação poética do passado, mas o acontecimento vivo da graça: o Deus Altíssimo desceu à nossa pequenez humana para nos elevar à Sua divindade.

Neste ano em que consolidamos nossa presença pastoral em cada comunidade urbana e rural, somos convidados pelo mistério da Encarnação a sermos instrumentos de verdadeira paz. O mundo clama por concórdia, justiça e fraternidade. Onde houver divisão, sejamos nós a ponte; onde houver solidão ou enfermidade, levemos o calor da presença e a caridade fraterna.

Dirijo meu olhar pastoral e afetuoso a todas as famílias: acolhei com alegria o Menino Jesus no presépio de vossos corações. Que a bênção de Deus Todo-Poderoso desça sobre vossos lares, proteja nossas crianças e console nossos enfermos.

Um Santo e Abençoado Natal a todos e um Ano Novo pleno de esperança e paz sob o olhar de Maria, Mãe de Deus e Senhora da Saúde!',
  'Tempo do Advento & Solenidade do Natal',
  NULL,
  true,
  true,
  '2026-11-29 08:00:00+00',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  liturgical_season = EXCLUDED.liturgical_season,
  author_photo_url = EXCLUDED.author_photo_url,
  is_featured_home = EXCLUDED.is_featured_home,
  is_active = EXCLUDED.is_active,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();

-- 3. Carga Oficial: Mensagem do Padre Irineu Claudino Sales (Pároco e Cura da Catedral)
INSERT INTO public.pastoral_messages (
  id,
  parish_id,
  author_type,
  author_name,
  author_title,
  author_photo_url,
  title,
  slug,
  subtitle,
  content,
  liturgical_season,
  cover_image_url,
  is_featured_home,
  is_active,
  published_at,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000011',
  'c0000000-0000-0000-0000-000000000001',
  'paroco',
  'Padre Irineu Claudino Sales',
  'Pároco e Cura da Catedral de Colatina',
  '/images/pastores/pe-irineu-claudino-sales.webp',
  'A Luz da Manjedoura Ilumina Nossas Famílias: Mensagem do Pároco',
  'mensagem-natal-2026-pe-irineu-paroco',
  '«Não tenhais medo! Eu vos anuncio uma grande alegria para todo o povo (Lc 2, 10)» — Que o Menino Jesus encontre pousada em cada coração e nas 12 CEBs da nossa Catedral.',
  'Queridos paroquianos da nossa amada Catedral do Sagrado Coração de Jesus e irmãos das 12 Comunidades Eclesiais de Base:

Chegamos ao ápice do ano pastoral com o coração transbordante de ação de graças. Olhando para trás, contemplamos os incontáveis passos dados na oração diária, nas Santas Missas celebradas com devoção em nossa Catedral, nos círculos bíblicos nos bairros e na assistência caridosa aos mais necessitados.

O Natal do Senhor nos recorda que Deus escolheu a simplicidade para nos amar. O Salvador não veio nos palácios da força, mas na ternura de uma criança envolta em panos. Por isso, a nossa paróquia se abre em festa para acolher cada irmão: os que vêm de perto e os que retornam ao seio familiar neste fim de ano.

Convido todos a participarem com fervor da nossa Novena de Natal e da Solene Missa da Vigília (Missa do Galo). Tragam seus filhos, idosos e amigos. Venham entronizar o Menino Jesus em família.

Em nome dos nossos padres vigários e de todas as lideranças pastorais, desejo a cada um de vocês um Natal santo, luminoso e repleto do Coração Imaculado de Maria e do Coração Sagrado de Jesus.',
  'Tempo do Advento & Natal',
  NULL,
  true,
  true,
  '2026-11-29 08:00:00+00',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  liturgical_season = EXCLUDED.liturgical_season,
  author_photo_url = EXCLUDED.author_photo_url,
  is_featured_home = EXCLUDED.is_featured_home,
  is_active = EXCLUDED.is_active,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();
