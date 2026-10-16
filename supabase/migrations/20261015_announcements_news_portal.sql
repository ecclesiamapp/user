-- ==============================================================================
-- MIGRAÇÃO: Portal de Notícias & Avisos Pastorais (PASCOM) - TASK-26D
-- Paróquia Piloto: Catedral do Sagrado Coração de Jesus (Colatina/ES)
-- Data: 15/10/2026
-- ==============================================================================

-- 1. Ampliação da Tabela announcements para Suportar Leitor Editorial Completo
ALTER TABLE public.announcements 
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'PASCOM Paroquial',
  ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'Pastoral da Comunicação',
  ADD COLUMN IF NOT EXISTS image_caption TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_time_minutes INTEGER NOT NULL DEFAULT 3;

-- 2. Garantir Índices de Alta Performance para Busca por Slug e Notícias em Destaque
CREATE UNIQUE INDEX IF NOT EXISTS idx_announcements_parish_slug 
  ON public.announcements(parish_id, slug);

CREATE INDEX IF NOT EXISTS idx_announcements_featured_active 
  ON public.announcements(parish_id, is_featured, published_at DESC) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_announcements_category_active 
  ON public.announcements(parish_id, category, published_at DESC) 
  WHERE is_active = true;

-- 3. Inserção / Atualização das 6 Notícias Pastorais Oficiais da Catedral de Colatina
-- Utiliza ON CONFLICT no par (parish_id, slug) para garantir idempotência

INSERT INTO public.announcements (
  parish_id,
  slug,
  title,
  subtitle,
  summary,
  content,
  category,
  image_url,
  image_caption,
  author_name,
  author_role,
  is_urgent,
  is_featured,
  read_time_minutes,
  published_at,
  is_active
) VALUES 
(
  'c0000000-0000-0000-0000-000000000001',
  'acao-solidaria-festa-sagrado-coracao-2026',
  'Ação Solidária e Programação Solene da Festa do Sagrado Coração de Jesus',
  'Novenas, carreatas e o tradicional almoço comunitário mobilizam toda a diocese',
  'Confira a programação completa de Santas Missas, novenas com bispos convidados e a grande ação fraterna em prol das famílias assistidas pelos Vicentinos.',
  'A Paróquia da Catedral do Sagrado Coração de Jesus se prepara com júbilo para vivenciar os festejos do seu excelso Padroeiro. Sob a coordenação do Pároco Pe. Irineu Claudino Sales e da Comissão Pastoral Paroquial, as festividades deste ano trazem o lema: *"Coração de Jesus, fornalha ardente de amor e solidariedade"*.

### Programação das Santas Missas e Novena Solene
A novena litúrgica ocorrerá diariamente na Catedral com a presença de sacerdotes da nossa Diocese e paróquias coirmãs:
* **Segunda a Sexta-feira:** 19h00 — Santa Missa Solene com pregação temática e bênção do Santíssimo Sacramento.
* **Sábados:** 18h00 — Santa Missa com bênção especial das famílias e juventude.
* **Domingos:** 07h00, 09h00 e 19h00 — Celebrações Eucarísticas na nave central.

### Almoço Comunitário e Arrecadação de Alimentos
No domingo festivo, após a Santa Missa das 09h presidida por Dom Lauro Sérgio Versiani Barbosa, acontecerá o tradicional almoço beneficente no pátio paroquial. Toda a renda obtida será revertida para as obras sociais da Paróquia e reforma dos espaços catequéticos das comunidades de periferia.

A Pastoral Social e a Conferência Vicentina também estarão recolhendo alimentos não perecíveis e materiais de higiene durante todas as celebrações. Participe com sua família e fortaleça nossa comunhão eclesial!',
  'festa_padroeiro',
  '/images/historia/catedral-interior.jpg',
  'A imponente nave da Catedral em dia de celebração solene.',
  'PASCOM Catedral',
  'Pastoral da Comunicação',
  false,
  true,
  4,
  '2026-10-14 10:00:00-03',
  true
),
(
  'c0000000-0000-0000-0000-000000000001',
  'inscricoes-catequese-primeira-eucaristia-crisma-2027',
  'Inscrições Abertas para a Catequese de Primeira Eucaristia e Crisma',
  'Iniciação cristã para crianças, adolescentes e adultos em todas as 12 comunidades',
  'A Pastoral Catequética convoca os pais e catequizandos para o período oficial de inscrições. O processo pode ser realizado online ou na secretaria paroquial.',
  'A Iniciação à Vida Cristã é o caminho luminoso pelo qual acolhemos o Evangelho e somos incorporados plenamente aos Sacramentos da Igreja. A Pastoral Catequética da Catedral comunica a abertura das inscrições para o itinerário formativo de 2027.

### Etapas e Faixas Etárias
1. **Eucaristia Infantil (1ª e 2ª Etapas):** Crianças a partir de 8 anos completos até o início do ano letivo.
2. **Crisma para Jovens:** Adolescentes a partir dos 14 anos, preparando o coração para a confirmação do Batismo e a efusão do Espírito Santo.
3. **Catequese e Crisma de Adultos:** Itinerário para homens e mulheres que desejam completar os sacramentos de Iniciação Cristã.

### Documentos Necessários
* Cópia da Certidão de Nascimento do catequizando.
* Lembrança do Batismo (se já for batizado).
* Comprovante de residência familiar em Colatina.
* Contato telefônico e autorização dos responsáveis.

As inscrições podem ser feitas diretamente pelo módulo de sacramentos do portal da Catedral ou na Secretaria Paroquial de segunda a sexta-feira.',
  'pastoral',
  '/images/historia/altar-baldaquino.jpg',
  'Presbitério da Catedral onde os sacramentos são celebrados.',
  'Coordenação Catequética',
  'Pastoral da Iniciação Cristã',
  false,
  false,
  3,
  '2026-10-10 14:30:00-03',
  true
),
(
  'c0000000-0000-0000-0000-000000000001',
  'folheto-liturgico-sou-do-sagrado-leituras-domingo',
  'Sou do Sagrado Missa: Folheto Litúrgico com as Leituras do Domingo',
  'Baixe antecipadamente as leituras bíblicas, orações e cantos dominicais',
  'Disponibilizado o libreto oficial das celebrações dominicais na Catedral e nas 12 capelas. Acompanhe a Liturgia da Palavra pelo celular.',
  'Para promover a participação ativa, consciente e frutuosa dos fiéis nas celebrações da Santa Missa, a equipe litúrgica da Catedral do Sagrado Coração de Jesus disponibiliza semanalmente a versão digital do folheto litúrgico **«Sou do Sagrado Missa»**.

### Conteúdo do Folheto
* Ritos Iniciais e Antífona de Entrada.
* Leituras bíblicas oficiais extraídas do Lecionário da CNBB (Primeira Leitura, Salmo Responsorial, Segunda Leitura e Evangelho).
* Oração dos Fiéis com intenções pela Igreja Universal, pela Diocese de Colatina e pelos enfermos.
* Rito da Comunhão e Bênção Final.

O folheto está otimizado para visualização leve em qualquer modelo de smartphone e pode ser baixado em PDF ou lido diretamente na tela do celular durante a Santa Missa.',
  'aviso',
  '/images/historia/caminho-procissoes.jpg',
  'Piso processional da nave central da Catedral.',
  'Equipe de Liturgia',
  'Pastoral Litúrgica',
  false,
  false,
  2,
  '2026-10-08 09:00:00-03',
  true
),
(
  'c0000000-0000-0000-0000-000000000001',
  'restauro-vitrais-centenarios-catedral-colatina',
  'Adequação Litúrgica e Preservação dos Vitrais Artísticos da Catedral',
  'Obras de conservação preventiva do patrimônio histórico e sacro tombado por lei',
  'Equipe de especialistas conclui revisão técnica nos vitrais da Casa Conrado e na iluminação sacra do baldaquino dos 7 dons.',
  'A Catedral do Sagrado Coração de Jesus é um dos maiores tesouros sacros e arquitetônicos do estado do Espírito Santo. Tombada como Patrimônio Histórico, Artístico e Cultural do município de Colatina (Lei nº 5.246/2006), a igreja passou por mais uma etapa do seu plano contínuo de preservação e adequação litúrgica.

### Os Vitrais Históricos
Produzidos na década de 1960 e 1970 pela renomada Casa Conrado, os vitrais representam cenas comoventes dos Evangelhos e a mística do Sagrado Coração. A manutenção preventiva garantiu a limpeza dos vidros alemães, a vedação dos perfis de chumbo contra infiltrações de água de chuva e o reforço estrutural dos arcos.

*"A beleza material do templo é um convite permanente à oração e à contemplação do Mistério Divino. Cuidar desta casa é zelar pela memória viva dos pioneiros e oferecer aos nossos filhos um santuário de paz"*, destacou o Pároco Pe. Irineu Claudino Sales.

Agradecemos a todos os dizimistas e benfeitores que, através do portal **«Sou do Sagrado»**, tornam possível a manutenção perpétua da nossa amada Catedral.',
  'noticia',
  '/images/historia/catedral-vitrais.jpg',
  'A luz solar filtrada pelos vitrais sacros restaurados.',
  'Conselho de Obras e Patrimônio',
  'Administração Paroquial',
  false,
  false,
  4,
  '2026-10-03 16:00:00-03',
  true
),
(
  'c0000000-0000-0000-0000-000000000001',
  'assembleia-paroquial-12-cebs-natal-2026',
  'Assembleia Paroquial com as 12 Comunidades Rumo à Novena de Natal',
  'Coordenadores de CEBs e lideranças pastorais alinham a grande vigília de fim de ano',
  'Encontro sinodal reuniu representantes de todas as capelas para organizar os círculos bíblicos nos bairros e a Missa da Noite de Natal na Matriz.',
  'Em comunhão com as diretrizes diocesanas emanadas por Dom Lauro Sérgio Versiani Barbosa, a Paróquia da Catedral reuniu os coordenadores e ministros das 12 Comunidades Eclesiais de Base para a Assembleia Pastoral de Planejamento do Tempo do Advento e Natal de 2026.

### Foco nos Grupos de Reflexão nos Bairros
O ponto central do encontro foi a dinamização das novenas de Natal em família. O livreto de orações será partilhado em dezenas de círculos bíblicos nos bairros de Colatina, promovendo a fraternidade, a partilha da Palavra e a arrecadação de cestas natalinas para os mais necessitados.

### Grade de Celebrações de Fim de Ano
Ficou definida a escala oficial das celebrações:
* **Missa da Vigília de Natal (Missa da Noite):** 24 de Dezembro às 20h00 na Catedral, com bênção do presépio monumental.
* **Missa do Dia de Natal:** 25 de Dezembro às 09h00 e 19h00.
* **Solenidade de Santa Maria Mãe de Deus:** 31 de Dezembro às 19h30 e 01 de Janeiro às 09h00 e 19h00.',
  'evento',
  '/images/historia/nave-revitalizada.jpg',
  'Nave central preparada para as assembleias paroquiais.',
  'Coordenação Paroquial de Pastoral',
  'CPP Catedral',
  false,
  false,
  3,
  '2026-09-28 19:30:00-03',
  true
),
(
  'c0000000-0000-0000-0000-000000000001',
  'campanha-agasalho-alimentos-vicentinos-2026',
  'Campanha de Arrecadação de Alimentos e Apoio às Famílias Vicentinas',
  'Gesto concreto de amor fraterno para mais de 120 famílias cadastradas na paróquia',
  'Sociedade São Vicente de Paulo e Pastoral da Criança recebem doações de alimentos e agasalhos para assistência mensal aos lares necessitados.',
  'A caridade cristã é o fruto mais autêntico da Eucaristia celebrada no Altar. A Conferência São Vicente de Paulo, que atua em íntima ligação com a Catedral de Colatina, reforça o pedido de solidariedade aos paroquianos e visitantes.

### O que doar?
* Alimentos não perecíveis (arroz, feijão, óleo, café, leite em pó e macarrão).
* Itens de higiene pessoal (sabonetes, creme dental, fraldas infantis e geriátricas).
* Cobertores e agasalhos em bom estado de conservação.

### Postos de Coleta
As doações podem ser entregues diariamente na Secretaria Paroquial da Catedral (Praça da Matriz) ou depositadas nos cestos de ofertório solene ao término de cada Santa Missa. Se você deseja fazer uma doação via PIX, utilize a chave oficial da paróquia com a descrição *"Caridade Vicentina"*.

*"Quem se compadece do pobre empresta ao Senhor, que lhe retribuirá o benefício." (Pr 19, 17)*',
  'pastoral',
  '/images/historia/projeto-benedito-calixto.jpg',
  'Catedral de Colatina, farol de fé e caridade no Rio Doce.',
  'Conferência Vicentina',
  'Pastoral Social',
  true,
  false,
  3,
  '2026-09-20 08:30:00-03',
  true
)
ON CONFLICT (parish_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  image_caption = EXCLUDED.image_caption,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  is_urgent = EXCLUDED.is_urgent,
  is_featured = EXCLUDED.is_featured,
  read_time_minutes = EXCLUDED.read_time_minutes,
  published_at = EXCLUDED.published_at,
  is_active = EXCLUDED.is_active,
  updated_at = now();
