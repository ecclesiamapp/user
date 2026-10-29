-- Migração: Criação da tabela tithe_registrations e Seed de Novos Dizimistas (Sou do Sagrado)
-- Data: 28/10/2026
-- Objetivo: Cadastro de fiéis acolhidos pelo portal para posterior lançamento pela secretaria no THEÒS

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
  theos_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tithe_reg_parish ON public.tithe_registrations(parish_id);
CREATE INDEX IF NOT EXISTS idx_tithe_reg_status ON public.tithe_registrations(status);
CREATE INDEX IF NOT EXISTS idx_tithe_reg_phone ON public.tithe_registrations(phone);

-- Habilitar Row Level Security
ALTER TABLE public.tithe_registrations ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
DROP POLICY IF EXISTS "Permitir inserção pública de adesão ao dízimo" ON public.tithe_registrations;
CREATE POLICY "Permitir inserção pública de adesão ao dízimo"
  ON public.tithe_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (parish_id IS NOT NULL);

DROP POLICY IF EXISTS "Permitir leitura de dizimistas para usuários autenticados" ON public.tithe_registrations;
CREATE POLICY "Permitir leitura de dizimistas para usuários autenticados"
  ON public.tithe_registrations
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Permitir atualização de dizimistas para usuários autenticados" ON public.tithe_registrations;
CREATE POLICY "Permitir atualização de dizimistas para usuários autenticados"
  ON public.tithe_registrations
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir exclusão de dizimistas para usuários autenticados" ON public.tithe_registrations;
CREATE POLICY "Permitir exclusão de dizimistas para usuários autenticados"
  ON public.tithe_registrations
  FOR DELETE
  TO authenticated
  USING (true);

-- Seed de Cadastros de Dizimistas para Homologação
INSERT INTO public.tithe_registrations (
  id,
  parish_id,
  full_name,
  phone,
  email,
  birth_date,
  neighborhood,
  preferred_payment_method,
  preferred_day,
  status,
  theos_code,
  notes,
  created_at
)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'c0000000-0000-0000-0000-000000000001',
    'Maria Aparecida da Silva',
    '(27) 99876-5432',
    'maria.aparecida@gmail.com',
    '1974-05-12',
    'Centro',
    'envelope',
    10,
    'pendente',
    NULL,
    'Deseja retirar os envelopes mensais no plantão da Santa Missa das 09h na Catedral.',
    now() - interval '2 hours'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'c0000000-0000-0000-0000-000000000001',
    'João Paulo Ferreira',
    '(27) 99765-4321',
    'joao.paulo.colatina@hotmail.com',
    '1982-11-20',
    'Honório Fraga',
    'pix',
    5,
    'pendente',
    NULL,
    'Contribuirá mensalmente via PIX oficial direto pelo app do banco.',
    now() - interval '14 hours'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'c0000000-0000-0000-0000-000000000001',
    'Ana Clara Santos',
    '(27) 99654-3210',
    'anaclara.santos@yahoo.com.br',
    '1995-03-08',
    'Marista',
    'pix',
    15,
    'pendente',
    NULL,
    'Jovem atuante na comunidade assumindo o compromisso bíblico do dízimo.',
    now() - interval '1 day'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'c0000000-0000-0000-0000-000000000001',
    'José Carlos de Oliveira',
    '(27) 99543-2109',
    'jose.carlos.olv@gmail.com',
    '1961-08-15',
    'Bela Vista',
    'envelope',
    10,
    'cadastrado_theos',
    'TH-1042',
    'Ficha formalizada no Theòs pela secretaria. Kit de envelopes entregue.',
    now() - interval '2 days'
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'c0000000-0000-0000-0000-000000000001',
    'Tereza Cristina Zanetti',
    '(27) 99432-1098',
    'tereza.zanetti@uol.com.br',
    '1958-09-29',
    'Esplanada',
    'envelope',
    20,
    'cadastrado_theos',
    'TH-0895',
    'Dizimista fiel da Catedral. Cadastro atualizado no Theòs.',
    now() - interval '3 days'
  ),
  (
    'a6666666-6666-6666-6666-666666666666',
    'c0000000-0000-0000-0000-000000000001',
    'Marcos Vinícius Bermudes',
    '(27) 99321-0987',
    'marcos.bermudes@empresa.com.br',
    '1988-12-04',
    'São Silvano',
    'pix',
    10,
    'cadastrado_theos',
    'TH-1120',
    'Lançado no Theòs. Contribui mensalmente no dia 10 pelo PIX da paróquia.',
    now() - interval '4 days'
  )
ON CONFLICT (id) DO UPDATE 
SET 
  full_name = EXCLUDED.full_name,
  status = EXCLUDED.status,
  theos_code = EXCLUDED.theos_code,
  notes = EXCLUDED.notes;
