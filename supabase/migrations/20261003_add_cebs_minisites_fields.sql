-- ==============================================================================
-- MIGRAÇÃO: CAMPOS PARA MINI-SITES DAS CEBs (SLUG, HISTÓRIA, PADROEIRO E GPS)
-- ==============================================================================

-- 1. Adicionar colunas necessárias para os mini-sites
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS history TEXT;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS foundation_year TEXT;
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS feast_day TEXT;

CREATE INDEX IF NOT EXISTS idx_communities_slug ON public.communities(slug);

-- 2. Atualizar as 11 Comunidades da Catedral com slugs e dados de identidade

-- 01. Catedral (Matriz)
UPDATE public.communities
SET 
    slug = 'catedral-matriz',
    foundation_year = '1927',
    feast_day = 'Solenidade do Sagrado Coração de Jesus (Junho)',
    history = 'Criada em 24 de dezembro de 1927 pelo primeiro bispo do Espírito Santo, Dom Fernando de Souza Monteiro, a Igreja Matriz tornou-se o centro pastoral de todo o Vale do Rio Doce. Em 1990, foi elevada à dignidade de Catedral com a criação da Diocese de Colatina.'
WHERE is_headquarters = true;

-- 02. Perpétuo Socorro
UPDATE public.communities
SET 
    slug = 'perpetuo-socorro',
    foundation_year = '1956',
    feast_day = '27 de Junho',
    history = 'Uma das primeiras comunidades da expansão urbana de Colatina, erguida com a dedicação fervorosa das famílias pioneiras do bairro Perpétuo Socorro e forte devoção mariana.'
WHERE name LIKE '%Perpétuo Socorro%';

-- 03. Sagrada Família
UPDATE public.communities
SET 
    slug = 'sagrada-familia',
    foundation_year = '1968',
    feast_day = 'Domingo no Oitavário do Natal',
    history = 'Comunidade acolhedora no Bairro Maria Ismênia, marcada pela atuação das Pastorais Familiares, grupos de jovens e círculos bíblicos que reúnem as famílias das redondezas.'
WHERE name LIKE '%Sagrada Família%';

-- 04. São Francisco de Assis
UPDATE public.communities
SET 
    slug = 'sao-francisco-de-assis',
    foundation_year = '1974',
    feast_day = '04 de Outubro',
    history = 'Localizada no Bairro Operário, a comunidade nasceu do trabalho operário e da espiritualidade franciscana de fraternidade, simplicidade e amor à criação divina.'
WHERE name LIKE '%São Francisco%';

-- 05. São Pedro
UPDATE public.communities
SET 
    slug = 'sao-pedro',
    foundation_year = '1981',
    feast_day = '29 de Junho',
    history = 'Erguida na Av. Pedro Vitalli no Bairro Tropical, destaca-se pelo espírito missionário e pelas celebrações vivas da Palavra de Deus em profunda união com a Catedral.'
WHERE name LIKE '%São Pedro%';

-- 06. Nossa Senhora de Guadalupe
UPDATE public.communities
SET 
    slug = 'nossa-senhora-de-guadalupe',
    foundation_year = '1989',
    feast_day = '12 de Dezembro',
    history = 'Situada no Bairro Vista da Serra, possui como padroeira a Padroeira de toda a América Latina. Reúne uma juventude expressiva e grande fervor nas novenas de fim de ano.'
WHERE name LIKE '%Guadalupe%';

-- 07. Santa Luzia
UPDATE public.communities
SET 
    slug = 'santa-luzia',
    foundation_year = '1979',
    feast_day = '13 de Dezembro',
    history = 'No alto do Bairro Alto Vila Nova, a capela de Santa Luzia é ponto de peregrinação e bênção dos olhos para centenas de devotos durante sua tradicional festa anual.'
WHERE name LIKE '%Santa Luzia%';

-- 08. Nossa Senhora da Penha
UPDATE public.communities
SET 
    slug = 'nossa-senhora-da-penha',
    foundation_year = '1962',
    feast_day = 'Oitava da Páscoa (Segunda-feira)',
    history = 'No Bairro Moacir Brotas, homenageia a padroeira do Estado do Espírito Santo, cultivando com piedade as tradições capixabas e a caridade fraterna comunitária.'
WHERE name LIKE '%Penha%';

-- 09. Santo Expedito
UPDATE public.communities
SET 
    slug = 'santo-expedito',
    foundation_year = '1995',
    feast_day = '19 de Abril',
    history = 'Situada na Praça Vitória Régia no Bairro Jardim Planalto, a comunidade atrai fiéis nas causas urgentes e mantém forte serviço pastoral de caridade.'
WHERE name LIKE '%Santo Expedito%';

-- 10. São Bento
UPDATE public.communities
SET 
    slug = 'sao-bento',
    foundation_year = '2004',
    feast_day = '11 de Julho',
    history = 'No Bairro Residencial Nobre, a comunidade inspira-se no lema de São Bento ("Ora et Labora"), promovendo a oração comunitária diária e a evangelização porta a porta.'
WHERE name LIKE '%São Bento%';

-- 11. São Lucas
UPDATE public.communities
SET 
    slug = 'sao-lucas',
    foundation_year = '2008',
    feast_day = '18 de Outubro',
    history = 'No Bairro Noêmia Vitalli, tem como padroeiro o evangelista dos pobres e da misericórdia, destacando-se pela Pastoral da Saúde e acolhimento aos enfermos.'
WHERE name LIKE '%São Lucas%';
