-- ==============================================================================
-- MIGRAÇÃO: CRIAÇÃO DO BUCKET DE STORAGE PARA FOLHETOS LITÚRGICOS (BOOKLETS)
-- ==============================================================================
-- Permite o upload de arquivos PDF de folhetos de missa ("Sou do Sagrado Missa")
-- Bucket público para leitura e download pelos fiéis no portal da Catedral.

-- 1. Criação do Bucket 'booklets' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('booklets', 'booklets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Políticas de Acesso ao Storage (Row Level Security em storage.objects)

-- Leitura pública: qualquer fiel pode visualizar ou baixar os PDFs
DROP POLICY IF EXISTS "Folhetos públicos para leitura e download" ON storage.objects;
CREATE POLICY "Folhetos públicos para leitura e download"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'booklets');

-- Inserção de folhetos: administradores / secretaria
DROP POLICY IF EXISTS "Upload de folhetos por administradores" ON storage.objects;
CREATE POLICY "Upload de folhetos por administradores"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'booklets');

-- Atualização / substituição de folhetos
DROP POLICY IF EXISTS "Atualização de folhetos por administradores" ON storage.objects;
CREATE POLICY "Atualização de folhetos por administradores"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'booklets')
WITH CHECK (bucket_id = 'booklets');

-- Exclusão de folhetos
DROP POLICY IF EXISTS "Exclusão de folhetos por administradores" ON storage.objects;
CREATE POLICY "Exclusão de folhetos por administradores"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'booklets');
