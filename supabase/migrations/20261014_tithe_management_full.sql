-- Migração Consolidada: Gestão Completa da Pastoral do Dízimo no Dashboard e Portal
-- Data: 14/10/2026
-- Tabelas: tithe_registrations, tithe_transparency_items, tithe_faqs

-- 1. Tabela de Adesão de Novos Dizimistas (Sou do Sagrado)
CREATE TABLE IF NOT EXISTS public.tithe_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  birth_date date,
  address text,
  neighborhood text,
  preferred_payment_method text NOT NULL DEFAULT 'pix' CHECK (
    preferred_payment_method IN ('pix', 'envelope', 'transferencia', 'debito', 'secretaria')
  ),
  preferred_day integer DEFAULT 10 CHECK (preferred_day BETWEEN 1 AND 31),
  status text NOT NULL DEFAULT 'pendente' CHECK (
    status IN ('pendente', 'cadastrado_theos', 'ativo', 'cancelado')
  ),
  notes text,
  theos_code text, -- Código do dizimista gerado no sistema Theòs
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Tabela de Destinação do Dízimo & Obras (Transparência Pastoral)
CREATE TABLE IF NOT EXISTS public.tithe_transparency_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  title text NOT NULL,
  tag text NOT NULL,
  highlight text,
  description text NOT NULL,
  icon_name text DEFAULT 'Building2',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Tabela de Perguntas Frequentes (FAQ do Dízimo)
CREATE TABLE IF NOT EXISTS public.tithe_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_tithe_reg_parish ON public.tithe_registrations(parish_id);
CREATE INDEX IF NOT EXISTS idx_tithe_reg_status ON public.tithe_registrations(status);
CREATE INDEX IF NOT EXISTS idx_tithe_reg_phone ON public.tithe_registrations(phone);
CREATE INDEX IF NOT EXISTS idx_tithe_transp_parish ON public.tithe_transparency_items(parish_id);
CREATE INDEX IF NOT EXISTS idx_tithe_faq_parish ON public.tithe_faqs(parish_id);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.tithe_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tithe_transparency_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tithe_faqs ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para tithe_registrations
CREATE POLICY "Permitir inserção pública de adesão ao dízimo"
  ON public.tithe_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (parish_id IS NOT NULL);

CREATE POLICY "Permitir leitura de dizimistas para usuários autenticados"
  ON public.tithe_registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir atualização de dizimistas para usuários autenticados"
  ON public.tithe_registrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão de dizimistas para usuários autenticados"
  ON public.tithe_registrations
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas de RLS para tithe_transparency_items
CREATE POLICY "Permitir leitura pública de itens de transparência do dízimo"
  ON public.tithe_transparency_items
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Permitir gestão de transparência para autenticados"
  ON public.tithe_transparency_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas de RLS para tithe_faqs
CREATE POLICY "Permitir leitura pública de FAQs do dízimo"
  ON public.tithe_faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Permitir gestão de FAQs para autenticados"
  ON public.tithe_faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Dados Iniciais (Seed) de Transparência da Catedral de Colatina
INSERT INTO public.tithe_transparency_items (parish_id, title, tag, highlight, description, icon_name, order_index)
SELECT 
  id as parish_id,
  'Restauro & Conservação da Catedral' as title,
  'Patrimônio Sagrado' as tag,
  '100% conservada' as highlight,
  'Cuidado contínuo com os vitrais históricos alemães, sistema de som litúrgico, climatização da nave central e conservação da torre monumental.' as description,
  'Building2' as icon_name,
  1 as order_index
FROM public.parishes LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.tithe_transparency_items (parish_id, title, tag, highlight, description, icon_name, order_index)
SELECT 
  id as parish_id,
  'Pastoral da Caridade & Pobres' as title,
  'Ação Social Concreta' as tag,
  '+80 famílias assistidas/mês' as highlight,
  'Socorro imediato a famílias em vulnerabilidade em Colatina: distribuição regular de cestas básicas, medicamentos de urgência e apoio aos enfermos.' as description,
  'Heart' as icon_name,
  2 as order_index
FROM public.parishes LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.tithe_transparency_items (parish_id, title, tag, highlight, description, icon_name, order_index)
SELECT 
  id as parish_id,
  'Comunhão com as 12 Comunidades (CEBs)' as title,
  'Igreja em Saída' as tag,
  '12 CEBs fortalecidas' as highlight,
  'Ajuda fraterna da Catedral Diocesana para que as comunidades menores do interior e periferia mantenham seus templos e comunidades dignas para as Santas Missas.' as description,
  'Church' as icon_name,
  3 as order_index
FROM public.parishes LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.tithe_transparency_items (parish_id, title, tag, highlight, description, icon_name, order_index)
SELECT 
  id as parish_id,
  'Liturgia, Catequese & Vocacionados' as title,
  'Evangelização Viva' as tag,
  'Vida Eclesial Plena' as highlight,
  'Sustento da formação dos nossos seminaristas diocesanos, folhetos litúrgicos semanais, hóstias e vinho consagrados para as celebrações.' as description,
  'Sparkles' as icon_name,
  4 as order_index
FROM public.parishes LIMIT 1
ON CONFLICT DO NOTHING;

-- Dados Iniciais (Seed) de FAQs do Dízimo
INSERT INTO public.tithe_faqs (parish_id, question, answer, order_index)
SELECT 
  id as parish_id,
  'Existe um valor ou porcentagem obrigatória para o Dízimo?' as question,
  'Não. Na Igreja Católica, o dízimo não é imposto nem cobrança mercantil. A Bíblia fala em 10% como horizonte bíblico de gratidão, mas a Igreja orienta que cada família contribua de acordo com o que determinar livremente em sua consciência e capacidade financeira, de coração aberto e com alegria.' as answer,
  1 as order_index
FROM public.parishes LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.tithe_faqs (parish_id, question, answer, order_index)
SELECT 
  id as parish_id,
  'Qual a diferença entre Dízimo e a Oferta da Santa Missa?' as question,
  'O Dízimo é um compromisso mensal regular de pertença e corresponsabilidade com a Igreja, que sustenta as estruturas fixas da paróquia e do clero. A Oferta é uma doação espontânea realizada durante as coletas das celebrações litúrgicas para necessidades pontuais e caritativas.' as answer,
  2 as order_index
FROM public.parishes LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.tithe_faqs (parish_id, question, answer, order_index)
SELECT 
  id as parish_id,
  'Como faço para receber meu número de dizimista e os envelopes?' as question,
  'Ao realizar seu cadastro aqui no portal "Sou do Sagrado", a Secretaria Paroquial formaliza seu registro no sistema eclesial oficial (Theòs). Você poderá retirar seu número de dizimista e seu kit de envelopes mensais na Secretaria ou diretamente com os agentes da Pastoral do Dízimo no plantão das Santas Missas na Catedral.' as answer,
  3 as order_index
FROM public.parishes LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.tithe_faqs (parish_id, question, answer, order_index)
SELECT 
  id as parish_id,
  'Posso contribuir exclusivamente via PIX sem pegar envelope?' as question,
  'Sim! O PIX é totalmente integrado e aceito pela Mitra Diocesana. Muitos fiéis preferem contribuir mensalmente pelo PIX Copia & Cola oficial da Catedral pela praticidade e segurança bancária.' as answer,
  4 as order_index
FROM public.parishes LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.tithe_faqs (parish_id, question, answer, order_index)
SELECT 
  id as parish_id,
  'Moro em outro bairro ou cidade. Posso ser dizimista da Catedral?' as question,
  'Com certeza! A Catedral do Sagrado Coração de Jesus é a Casa Mãe de toda a Diocese de Colatina. Se você frequenta nossas celebrações ou acompanha as transmissões ao vivo e deseja apoiar esta missão, seu dízimo é acolhido com imensa gratidão e oração.' as answer,
  5 as order_index
FROM public.parishes LIMIT 1
ON CONFLICT DO NOTHING;
