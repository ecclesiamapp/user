-- =========================================================================
-- Migração: Onda 1 de Povoação Oficial — Horários de Missas & Natal 2026
-- Paróquia: Catedral do Sagrado Coração de Jesus (Diocese de Colatina - ES)
-- Data: 23 de Novembro de 2026
-- Idempotente: segura para reexecução via ON CONFLICT
-- =========================================================================

BEGIN;

-- =========================================================================
-- 1. POVOAÇÃO OFICIAL DA TABELA public.mass_schedules (24 HORÁRIOS CANÔNICOS)
--    Catedral Diocesana (11) + Comunidades/CEBs & Grupo Santa Rita (13)
-- =========================================================================
INSERT INTO public.mass_schedules (
  id,
  parish_id,
  community_id,
  day_of_week,
  time,
  type,
  description,
  is_active
) VALUES
  -- 1.1 Catedral Diocesana (Sagrado Coração de Jesus — Sede)
  ('d1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Domingo',      '07:00', 'missa',              'Santa Missa Matutina dos Trabalhadores e Idosos • Catedral Diocesana', true),
  ('d1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Domingo',      '09:00', 'missa',              'Santa Missa Solene da Família e Catequese Paroquial', true),
  ('d1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Domingo',      '19:00', 'missa',              'Santa Missa Dominical da Noite com a Juventude Paroquial', true),
  ('d1000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Terça-feira',  '16:00', 'confissao',          'Atendimento de Confissões Individuais (16h às 18h) • Secretaria', true),
  ('d1000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Terça-feira',  '19:30', 'missa',              'Santa Missa em Louvor a Santo Antônio e Acolhimento Comunitário', true),
  ('d1000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Quarta-feira', '19:30', 'missa',              'Santa Missa com Novena Perpétua a Nossa Senhora do Perpétuo Socorro', true),
  ('d1000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Quinta-feira', '08:00', 'adoracao',           'Exposição e Adoração Contínua ao Santíssimo Sacramento (08h às 19h)', true),
  ('d1000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Quinta-feira', '16:00', 'confissao',          'Atendimento de Confissões Individuais (16h às 18h) • Secretaria', true),
  ('d1000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Quinta-feira', '19:30', 'missa',              'Santa Missa do Santíssimo com Bênção Eucarística Solene', true),
  ('d1000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Sexta-feira',  '19:30', 'missa',              'Santa Missa Votiva do Sagrado Coração de Jesus e pelas Famílias', true),
  ('d1000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000001', 'b1aac446-758d-4595-8724-38ce39b3a27e', 'Sábado',       '19:30', 'missa',              'Santa Missa da Vigília Dominical • Catedral Diocesana', true),

  -- 1.2 Comunidades Eclesiais de Base (CEBs) & Grupo de Reflexão Santa Rita
  ('d1000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000001', '35ad329f-6986-4778-b47c-b9723f5a2a91', 'Domingo',      '08:30', 'missa',              'Santa Missa Dominical da Comunidade Perpétuo Socorro', true),
  ('d1000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000001', '35ad329f-6986-4778-b47c-b9723f5a2a91', 'Quarta-feira', '19:30', 'celebracao_palavra', 'Celebração da Palavra e Novena Mariana', true),
  ('d1000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000001', '49576068-a744-404f-b4c0-0540e337158a', 'Sábado',       '18:00', 'missa',              'Santa Missa Vespertina da Comunidade Sagrada Família', true),
  ('d1000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000001', 'b9a25239-f993-4681-b8a3-b463d2b9c586', 'Domingo',      '08:00', 'missa',              'Santa Missa Dominical na Comunidade São Pedro', true),
  ('d1000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000001', 'b9a25239-f993-4681-b8a3-b463d2b9c586', 'Sexta-feira',  '19:30', 'celebracao_palavra', 'Celebração da Palavra e Encontro de Fé', true),
  ('d1000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000001', '88872d28-2f0a-44ce-94fe-fbe836bfec67', 'Domingo',      '10:00', 'missa',              'Santa Missa Dominical com Bênção dos Olhos • Santa Luzia', true),
  ('d1000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000001', 'bd1b097a-e973-4bc3-ac7b-c0c4bda6a379', 'Domingo',      '17:00', 'missa',              'Santa Missa em Devoção à Padroeira do Espírito Santo', true),
  ('d1000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000001', '6bbd63ab-2dd9-486a-97e3-b8e36910f392', 'Sábado',       '19:30', 'missa',              'Santa Missa das Causas Urgentes e da Juventude • Santo Expedito', true),
  ('d1000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000001', 'ca59ef6c-9b98-4303-baa0-2aaa10d659d2', 'Domingo',      '09:30', 'celebracao_palavra', 'Celebração da Palavra e Bênção da Medalha de São Bento', true),
  ('d1000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000001', 'ef24ca7b-b978-414e-858b-f5ba001474f3', 'Domingo',      '17:30', 'celebracao_palavra', 'Celebração da Palavra Franciscana e Partilha Fraterna', true),
  ('d1000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000001', 'b6c86819-fb5f-438d-9fa0-683bc6f0f8aa', 'Domingo',      '07:30', 'missa',              'Santa Missa Matutina • Nossa Senhora de Guadalupe', true),
  ('d1000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000001', '7f9db430-d06e-42c7-a44b-0c00f320c25d', 'Sábado',       '17:00', 'celebracao_palavra', 'Celebração da Palavra com os Idosos e Enfermos • São Lucas', true),
  ('d1000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000013', 'Terça-feira',  '19:00', 'missa',              'Santa Missa Tradicional das Terças de Santo Antônio', true),
  ('d1000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000022', 'Quinta-feira', '19:30', 'celebracao_palavra', 'Noite de Oração, Terço e Reflexão das Famílias • Grupo Santa Rita', true)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 2. ENCERRAMENTO DA FESTA DA CO-PADROEIRA (22/11) & ATIVAÇÃO DO NATAL 2026
-- =========================================================================
UPDATE public.parish_special_events
SET
  is_featured_home = false,
  status = 'encerrado',
  updated_at = NOW()
WHERE slug = 'festa-copadroeira-2026';

INSERT INTO public.parish_special_events (
  id,
  parish_id,
  community_id,
  title,
  slug,
  event_type,
  theme,
  motto,
  description,
  start_date,
  end_date,
  banner_url,
  poster_pdf_url,
  is_featured_home,
  status,
  color_preset,
  primary_color,
  secondary_color,
  accent_color
) VALUES (
  'e0000000-0000-0000-0000-000000000025',
  'c0000000-0000-0000-0000-000000000001',
  'b1aac446-758d-4595-8724-38ce39b3a27e',
  'Solenidade do Natal do Senhor 2026',
  'natal-2026',
  'liturgico_global',
  'O Verbo se fez carne e habitou entre nós',
  'Glória a Deus nas alturas e paz na terra aos homens por Ele amados (Lc 2,14)',
  'A Catedral do Sagrado Coração de Jesus e suas 12 Comunidades Eclesiais de Base convidam todas as famílias para celebrarem a Novena de Natal, a Solene Missa da Vigília (Missa do Galo), o Dia do Natal do Senhor e a Virada de Ano em Ação de Graças.',
  '2026-12-15',
  '2027-01-01',
  '/images/historia/catedral-interior.jpg',
  NULL,
  true,
  'destaque_ativo',
  'natal',
  '#991B1B',
  '#FDE68A',
  '#FAF6F0'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  theme = EXCLUDED.theme,
  motto = EXCLUDED.motto,
  description = EXCLUDED.description,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  is_featured_home = true,
  status = 'destaque_ativo',
  color_preset = EXCLUDED.color_preset,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  updated_at = NOW();

-- =========================================================================
-- 3. PROGRAMAÇÃO LITÚRGICA DIA A DIA DO NATAL 2026 (public.parish_event_days)
-- =========================================================================
INSERT INTO public.parish_event_days (
  id,
  event_id,
  event_date,
  day_title,
  day_subtitle,
  liturgical_color,
  celebrant_name,
  responsible_group,
  gesture_of_charity,
  social_attractions,
  order_index,
  schedule_items
) VALUES
  (
    'd0000000-0000-0000-0000-000000000021',
    'e0000000-0000-0000-0000-000000000025',
    '2026-12-15',
    'Novena de Natal & Mutirão de Confissões (15 a 23/12)',
    'Preparação espiritual das famílias e comunidades para a chegada do Menino Jesus',
    'roxo',
    'Clero da Catedral (Pe. Irineu, Pe. Adilson, Pe. Deivid e Pe. Ernandes)',
    'Equipes de Liturgia, Pastoral Familiar e Coordenadores das 12 CEBs',
    'Campanha Natal Solidário: doação de cestas básicas e panetones para a Cáritas e Vicentinos',
    'Encontros da Novena nas casas das 12 Comunidades e cantatas de Advento',
    1,
    '[
      {"time": "16:00", "title": "Mutirão de Confissões Individuais (Terças e Quintas)", "location": "Catedral Diocesana"},
      {"time": "19:00", "title": "Novena de Natal em Família nas 12 Comunidades (CEBs)", "location": "Lares e Comunidades"},
      {"time": "19:30", "title": "Santa Missa do Tempo do Advento na Catedral", "location": "Catedral Diocesana"}
    ]'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000022',
    'e0000000-0000-0000-0000-000000000025',
    '2026-12-24',
    'Noite Santa • Solene Missa da Vigília de Natal (Missa do Galo)',
    'Hoje nasceu para nós o Salvador, que é Cristo Senhor',
    'branco',
    'Dom Lauro Sérgio Versiani Barbosa (Bispo Diocesano) e Pe. Irineu Claudino Sales',
    'Coral da Catedral, Acólitos, Ministros da Eucaristia e PASCOM',
    'Oferta fraterna de Natal destinada às obras sociais da Catedral',
    'Bênção do Presépio e entronização solene da imagem do Menino Jesus',
    2,
    '[
      {"time": "18:00", "title": "Santa Missa da Vigília nas Comunidades (CEBs)", "location": "Comunidades da Paróquia"},
      {"time": "19:30", "title": "Cantata de Natal e Adoração diante do Presépio", "location": "Nave Central da Catedral"},
      {"time": "20:00", "title": "Solene Santa Missa da Noite de Natal (Missa do Galo)", "location": "Catedral Diocesana", "celebrant": "Dom Lauro Sérgio Versiani Barbosa"}
    ]'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000023',
    'e0000000-0000-0000-0000-000000000025',
    '2026-12-25',
    'Dia de Natal • Solenidade da Natividade do Senhor',
    'A Luz verdadeira brilha nas trevas e renova a esperança de todas as famílias',
    'branco',
    'Pe. Irineu Claudino Sales e Vigários Paroquiais',
    'Pastoral Familiar, Catequese, ECC e Movimentos Paroquiais',
    'Partilha fraterna com as famílias assistidas pela Pastoral Social',
    'Visitação aberta ao Presépio oficial da Catedral durante todo o dia',
    3,
    '[
      {"time": "07:00", "title": "Santa Missa da Aurora de Natal", "location": "Catedral Diocesana"},
      {"time": "09:00", "title": "Santa Missa Solene do Dia de Natal com as Famílias", "location": "Catedral Diocesana", "celebrant": "Pe. Irineu Claudino Sales"},
      {"time": "19:00", "title": "Santa Missa Solene de Encerramento do Dia de Natal", "location": "Catedral Diocesana"}
    ]'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000024',
    'e0000000-0000-0000-0000-000000000025',
    '2026-12-31',
    'Ação de Graças & Solenidade de Santa Maria, Mãe de Deus',
    'Consagração do Novo Ano de 2027 sob a proteção de Nossa Senhora e do Sagrado Coração',
    'branco',
    'Pe. Irineu Claudino Sales e Clero da Catedral',
    'Liturgia Geral da Catedral e Pastoral da Acolhida',
    'Ação de graças pelas bênçãos e conquistas comunitárias de 2026',
    'Canto solene do Te Deum em Ação de Graças pelo ano encerrado',
    4,
    '[
      {"time": "19:30", "title": "Santa Missa Solene de Ação de Graças (31/12) com canto do Te Deum", "location": "Catedral Diocesana", "celebrant": "Pe. Irineu Claudino Sales"},
      {"time": "09:00", "title": "Santa Missa da Solenidade de Santa Maria, Mãe de Deus (01/01) • Dia Mundial da Paz", "location": "Catedral Diocesana"},
      {"time": "19:00", "title": "Santa Missa de Ano Novo pelas Famílias (01/01)", "location": "Catedral Diocesana"}
    ]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  day_title = EXCLUDED.day_title,
  day_subtitle = EXCLUDED.day_subtitle,
  liturgical_color = EXCLUDED.liturgical_color,
  celebrant_name = EXCLUDED.celebrant_name,
  responsible_group = EXCLUDED.responsible_group,
  gesture_of_charity = EXCLUDED.gesture_of_charity,
  social_attractions = EXCLUDED.social_attractions,
  schedule_items = EXCLUDED.schedule_items,
  updated_at = NOW();

COMMIT;
