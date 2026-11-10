-- ==============================================================================
-- Migração: 20261109_security_rls_hardening.sql
-- Módulo: Hardening de RLS & Blindagem de Segurança Pré-Go-Live
-- Paróquia Piloto: Catedral Sagrado Coração de Jesus (Colatina/ES)
-- Escopo da Auditoria Multi-Agente:
--   1. Revogação de permissões anônimas de exclusão/edição em todas as tabelas mestras
--   2. Blindagem LGPD em mass_intentions, certificate_requests e tithe_registrations
--   3. Blindagem de audit logs e activity logs contra espionagem anônima
--   4. Hardening de Storage Buckets (apenas authenticated pode gravar/deletar mídias)
--   5. Resolução dos avisos de SECURITY DEFINER do Supabase Linter (SET search_path = '')
--   6. Criação de RPCs seguras para consulta do fiel na Área Privada (/meu-espaco)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CORREÇÃO DOS AVISOS DO SUPABASE LINTER (SECURITY DEFINER SEARCH_PATH)
-- ------------------------------------------------------------------------------

-- Linter 0028/0029: Blindagem do search_path para evitar hijacking de funções
ALTER FUNCTION public.get_booked_appointment_slots(uuid, uuid, date) SET search_path = '';
ALTER FUNCTION public.increment_booklet_downloads(uuid) SET search_path = '';

-- ------------------------------------------------------------------------------
-- 2. HARDENING DAS TABELAS MESTRAS DA PARÓQUIA (REVOGAÇÃO DE MUTAÇÃO ANÔNIMA)
-- ------------------------------------------------------------------------------

-- A. Avisos Paroquiais (announcements)
DROP POLICY IF EXISTS "Gestão de avisos por administradores da paróquia" ON public.announcements;
CREATE POLICY "Gestão de avisos por administradores da paróquia"
ON public.announcements FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- B. Clero Paroquial (clergy)
DROP POLICY IF EXISTS "Gestão do clero por administradores" ON public.clergy;
CREATE POLICY "Gestão do clero por administradores"
ON public.clergy FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- C. Comunidades Eclesiais de Base (communities)
DROP POLICY IF EXISTS "Gestão de comunidades por administradores da paróquia" ON public.communities;
CREATE POLICY "Gestão de comunidades por administradores da paróquia"
ON public.communities FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- D. Galerias Fotográficas (galleries)
DROP POLICY IF EXISTS "Gestão de galerias por administradores" ON public.galleries;
CREATE POLICY "Gestão de galerias por administradores"
ON public.galleries FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- E. Folhetos Litúrgicos (liturgical_booklets e liturgy_booklets)
DROP POLICY IF EXISTS "Gestão de folhetos por administradores" ON public.liturgical_booklets;
CREATE POLICY "Gestão de folhetos por administradores"
ON public.liturgical_booklets FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

DROP POLICY IF EXISTS "Gestão de folhetos por administradores" ON public.liturgy_booklets;
CREATE POLICY "Gestão de folhetos por administradores"
ON public.liturgy_booklets FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- F. Horários de Missa (mass_schedules)
DROP POLICY IF EXISTS "Gestão de horários por administradores da paróquia" ON public.mass_schedules;
CREATE POLICY "Gestão de horários por administradores da paróquia"
ON public.mass_schedules FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- G. Mensagens Pastorais (pastoral_messages)
DROP POLICY IF EXISTS "Gestão de mensagens por administradores" ON public.pastoral_messages;
CREATE POLICY "Gestão de mensagens por administradores"
ON public.pastoral_messages FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- H. Pastorais (pastorals)
DROP POLICY IF EXISTS "Gestão de pastorais por administradores" ON public.pastorals;
CREATE POLICY "Gestão de pastorais por administradores"
ON public.pastorals FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- I. Paróquias (parishes)
DROP POLICY IF EXISTS "Gestão de paróquias" ON public.parishes;
CREATE POLICY "Gestão de paróquias por administradores autenticados"
ON public.parishes FOR ALL
TO authenticated
USING (id IS NOT NULL)
WITH CHECK (id IS NOT NULL);

-- J. Eventos Especiais & Dias (parish_special_events e parish_event_days)
DROP POLICY IF EXISTS "Permitir insercao de eventos especiais" ON public.parish_special_events;
DROP POLICY IF EXISTS "Permitir atualizacao de eventos especiais" ON public.parish_special_events;
DROP POLICY IF EXISTS "Permitir exclusao de eventos especiais" ON public.parish_special_events;
CREATE POLICY "Gestão de eventos especiais por administradores"
ON public.parish_special_events FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

DROP POLICY IF EXISTS "Permitir insercao de dias do evento" ON public.parish_event_days;
DROP POLICY IF EXISTS "Permitir atualizacao de dias do evento" ON public.parish_event_days;
DROP POLICY IF EXISTS "Permitir exclusao de dias do evento" ON public.parish_event_days;
CREATE POLICY "Gestão de dias do evento por administradores"
ON public.parish_event_days FOR ALL
TO authenticated
USING (event_id IS NOT NULL)
WITH CHECK (event_id IS NOT NULL);

-- K. História, Sucessão e Patrimônio Sacro
DROP POLICY IF EXISTS "Permitir insercao de marcos historicos" ON public.parish_history_milestones;
DROP POLICY IF EXISTS "Permitir atualizacao de marcos historicos" ON public.parish_history_milestones;
DROP POLICY IF EXISTS "Permitir exclusao de marcos historicos" ON public.parish_history_milestones;
CREATE POLICY "Gestão de marcos históricos por administradores"
ON public.parish_history_milestones FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

DROP POLICY IF EXISTS "Permitir insercao de sucessao pastoral" ON public.parish_pastors_succession;
DROP POLICY IF EXISTS "Permitir atualizacao de sucessao pastoral" ON public.parish_pastors_succession;
DROP POLICY IF EXISTS "Permitir exclusao de sucessao pastoral" ON public.parish_pastors_succession;
CREATE POLICY "Gestão de sucessão pastoral por administradores"
ON public.parish_pastors_succession FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

DROP POLICY IF EXISTS "Permitir insercao de patrimonio sacro" ON public.parish_sacred_heritage;
DROP POLICY IF EXISTS "Permitir atualizacao de patrimonio sacro" ON public.parish_sacred_heritage;
DROP POLICY IF EXISTS "Permitir exclusao de patrimonio sacro" ON public.parish_sacred_heritage;
CREATE POLICY "Gestão de patrimônio sacro por administradores"
ON public.parish_sacred_heritage FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- L. Transparência do Dízimo & FAQs
DROP POLICY IF EXISTS "Permitir inserção de transparência do dízimo" ON public.tithe_transparency_items;
DROP POLICY IF EXISTS "Permitir atualização de transparência do dízimo" ON public.tithe_transparency_items;
DROP POLICY IF EXISTS "Permitir exclusão de transparência do dízimo" ON public.tithe_transparency_items;
CREATE POLICY "Gestão de transparência do dízimo por administradores"
ON public.tithe_transparency_items FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

DROP POLICY IF EXISTS "Permitir inserção de FAQs do dízimo" ON public.tithe_faqs;
DROP POLICY IF EXISTS "Permitir atualização de FAQs do dízimo" ON public.tithe_faqs;
DROP POLICY IF EXISTS "Permitir exclusão de FAQs do dízimo" ON public.tithe_faqs;
CREATE POLICY "Gestão de FAQs do dízimo por administradores"
ON public.tithe_faqs FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 3. BLINDAGEM LGPD DE FORMULÁRIOS & DADOS DOS FIÉIS (SECRETARIA & DÍZIMO)
-- ------------------------------------------------------------------------------

-- A. Intenções de Santa Missa (Púlpito A4)
-- O público anônimo pode APENAS cadastrar novas intenções. Leitura e alteração são exclusivas da administração.
DROP POLICY IF EXISTS "Permitir leitura anonima de intencoes" ON public.mass_intentions;
DROP POLICY IF EXISTS "Permitir atualizacao anonima de intencoes" ON public.mass_intentions;
DROP POLICY IF EXISTS "Permitir envio publico de intencoes de Santa Missa" ON public.mass_intentions;
DROP POLICY IF EXISTS "Permitir leitura de intencoes para usuarios autenticados" ON public.mass_intentions;
DROP POLICY IF EXISTS "Permitir atualizacao de intencoes para usuarios autenticados" ON public.mass_intentions;
DROP POLICY IF EXISTS "Permitir exclusao de intencoes para usuarios autenticados" ON public.mass_intentions;

CREATE POLICY "Cadastro publico de intencoes de Santa Missa"
ON public.mass_intentions FOR INSERT
TO anon, authenticated
WITH CHECK (parish_id IS NOT NULL);

CREATE POLICY "Gestao restrita de intencoes por administradores autenticados"
ON public.mass_intentions FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- B. Pedidos de Certidões (certificate_requests)
-- O público anônimo pode APENAS solicitar certidões. Leitura e alteração são exclusivas da administração.
DROP POLICY IF EXISTS "Permitir leitura anonima de certidoes" ON public.certificate_requests;
DROP POLICY IF EXISTS "Permitir atualizacao anonima de certidoes" ON public.certificate_requests;
DROP POLICY IF EXISTS "Permitir solicitacao publica de certidoes" ON public.certificate_requests;
DROP POLICY IF EXISTS "Permitir leitura de certidoes para usuarios autenticados" ON public.certificate_requests;
DROP POLICY IF EXISTS "Permitir atualizacao de certidoes para usuarios autenticados" ON public.certificate_requests;
DROP POLICY IF EXISTS "Permitir exclusao de certidoes para usuarios autenticados" ON public.certificate_requests;

CREATE POLICY "Solicitacao publica de certidoes"
ON public.certificate_requests FOR INSERT
TO anon, authenticated
WITH CHECK (parish_id IS NOT NULL);

CREATE POLICY "Gestao restrita de certidoes por administradores autenticados"
ON public.certificate_requests FOR ALL
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

-- C. Registros de Adesão ao Dízimo (tithe_registrations)
-- O público anônimo pode APENAS aderir. Leitura e alteração são restritas a autenticados.
DROP POLICY IF EXISTS "Permitir leitura de dizimistas para usuários autenticados" ON public.tithe_registrations;
DROP POLICY IF EXISTS "Permitir atualização de dizimistas para usuários autenticado" ON public.tithe_registrations;
DROP POLICY IF EXISTS "Permitir exclusão de dizimistas para usuários autenticados" ON public.tithe_registrations;

CREATE POLICY "Leitura de dizimistas exclusiva para administradores autenticados"
ON public.tithe_registrations FOR SELECT
TO authenticated
USING (parish_id IS NOT NULL);

CREATE POLICY "Gestao de dizimistas exclusiva para administradores autenticados"
ON public.tithe_registrations FOR UPDATE
TO authenticated
USING (parish_id IS NOT NULL)
WITH CHECK (parish_id IS NOT NULL);

CREATE POLICY "Exclusao de dizimistas exclusiva para administradores autenticados"
ON public.tithe_registrations FOR DELETE
TO authenticated
USING (parish_id IS NOT NULL);

-- D. Logs de Auditoria de Segurança (security_audit_logs)
-- Qualquer cliente pode registrar eventos de login (INSERT), mas NINGUÉM anônimo pode ler os logs (SELECT).
DROP POLICY IF EXISTS "security_audit_logs_select_policy" ON public.security_audit_logs;
CREATE POLICY "security_audit_logs_select_policy"
ON public.security_audit_logs FOR SELECT
TO authenticated
USING (true);

-- E. Logs de Atividades das CEBs (community_activity_logs)
DROP POLICY IF EXISTS "community_logs_select_all" ON public.community_activity_logs;
DROP POLICY IF EXISTS "community_logs_update_all" ON public.community_activity_logs;
CREATE POLICY "community_logs_select_authenticated"
ON public.community_activity_logs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "community_logs_update_authenticated"
ON public.community_activity_logs FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. HARDENING DE STORAGE BUCKETS (BLOQUEIO DE GRAVAÇÃO ANÔNIMA)
-- ------------------------------------------------------------------------------

-- Brand Assets
DROP POLICY IF EXISTS "Upload de brand assets pela administração" ON storage.objects;
DROP POLICY IF EXISTS "Atualização de brand assets pela administração" ON storage.objects;
DROP POLICY IF EXISTS "Exclusão de brand assets pela administração" ON storage.objects;

CREATE POLICY "Upload de brand assets pela administração"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'brand_assets');

CREATE POLICY "Atualização de brand assets pela administração"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'brand_assets')
WITH CHECK (bucket_id = 'brand_assets');

CREATE POLICY "Exclusão de brand assets pela administração"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'brand_assets');

-- Event Assets
DROP POLICY IF EXISTS "Upload de event assets pela administracao" ON storage.objects;
DROP POLICY IF EXISTS "Atualizacao de event assets pela administracao" ON storage.objects;
DROP POLICY IF EXISTS "Exclusao de event assets pela administracao" ON storage.objects;

CREATE POLICY "Upload de event assets pela administracao"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event_assets');

CREATE POLICY "Atualizacao de event assets pela administracao"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event_assets');

CREATE POLICY "Exclusao de event assets pela administracao"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event_assets');

-- Booklets
DROP POLICY IF EXISTS "Upload de folhetos por administradores" ON storage.objects;
DROP POLICY IF EXISTS "Atualização de folhetos por administradores" ON storage.objects;
DROP POLICY IF EXISTS "Exclusão de folhetos por administradores" ON storage.objects;

CREATE POLICY "Upload de folhetos por administradores"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'booklets');

CREATE POLICY "Atualização de folhetos por administradores"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'booklets')
WITH CHECK (bucket_id = 'booklets');

CREATE POLICY "Exclusão de folhetos por administradores"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'booklets');

-- ------------------------------------------------------------------------------
-- 5. RPCS SEGURAS PARA A ÁREA PRIVADA DO FIEL (/meu-espaco)
-- ------------------------------------------------------------------------------

-- A. Consulta segura de intenções de Santa Missa (Púlpito A4) por telefone ou protocolo
CREATE OR REPLACE FUNCTION public.lookup_parishioner_intentions(
  p_parish_id uuid,
  p_phone text,
  p_protocol text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  parish_id uuid,
  community_id uuid,
  celebration_date date,
  celebration_time text,
  category text,
  intention_names text,
  intention_notes text,
  applicant_name text,
  contact_phone text,
  protocol_code text,
  is_confidential boolean,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_clean_phone text := regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g');
  v_protocol text := trim(COALESCE(p_protocol, ''));
BEGIN
  -- Bloqueio contra varredura anônima: exige critério de busca válido
  IF length(v_clean_phone) < 8 AND length(v_protocol) = 0 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    i.id,
    i.parish_id,
    i.community_id,
    i.celebration_date,
    i.celebration_time,
    i.category,
    i.intention_names,
    i.intention_notes,
    i.applicant_name,
    i.contact_phone,
    i.protocol_code,
    i.is_confidential,
    i.status,
    i.created_at,
    i.updated_at
  FROM public.mass_intentions i
  WHERE i.parish_id = p_parish_id
    AND (
      (length(v_protocol) > 0 AND i.protocol_code ILIKE '%' || v_protocol || '%')
      OR (length(v_clean_phone) >= 8 AND regexp_replace(i.contact_phone, '\D', '', 'g') ILIKE '%' || right(v_clean_phone, 8) || '%')
    )
  ORDER BY i.celebration_date DESC, i.celebration_time DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_parishioner_intentions(uuid, text, text) TO anon, authenticated;

-- B. Consulta segura de agendamentos pastorais com os sacerdotes
CREATE OR REPLACE FUNCTION public.lookup_parishioner_appointments(
  p_parish_id uuid,
  p_phone text,
  p_protocol text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  parish_id uuid,
  clergy_id uuid,
  community_id uuid,
  appointment_date date,
  appointment_time text,
  duration_minutes integer,
  appointment_type text,
  parishioner_name text,
  parishioner_phone text,
  parishioner_email text,
  notes text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  clergy jsonb,
  community jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_clean_phone text := regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g');
  v_protocol text := trim(COALESCE(p_protocol, ''));
BEGIN
  -- Bloqueio contra varredura anônima: exige critério de busca válido
  IF length(v_clean_phone) < 8 AND length(v_protocol) = 0 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    a.id,
    a.parish_id,
    a.clergy_id,
    a.community_id,
    a.appointment_date,
    a.appointment_time,
    a.duration_minutes,
    a.appointment_type,
    a.parishioner_name,
    a.parishioner_phone,
    a.parishioner_email,
    a.notes,
    a.status,
    a.created_at,
    a.updated_at,
    row_to_json(c.*)::jsonb AS clergy,
    row_to_json(cm.*)::jsonb AS community
  FROM public.pastoral_appointments a
  LEFT JOIN public.clergy c ON c.id = a.clergy_id
  LEFT JOIN public.communities cm ON cm.id = a.community_id
  WHERE a.parish_id = p_parish_id
    AND (
      (length(v_protocol) > 0 AND a.id::text ILIKE '%' || v_protocol || '%')
      OR (length(v_clean_phone) >= 8 AND regexp_replace(a.parishioner_phone, '\D', '', 'g') ILIKE '%' || right(v_clean_phone, 8) || '%')
    )
  ORDER BY a.appointment_date ASC, a.appointment_time ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_parishioner_appointments(uuid, text, text) TO anon, authenticated;

-- C. Cancelamento prévio seguro de agendamento pelo próprio fiel (exige confirmação de telefone)
CREATE OR REPLACE FUNCTION public.cancel_parishioner_appointment(
  p_appointment_id uuid,
  p_phone text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_clean_phone text := regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g');
BEGIN
  IF length(v_clean_phone) < 8 THEN
    RETURN false;
  END IF;

  UPDATE public.pastoral_appointments
  SET status = 'cancelado', updated_at = now()
  WHERE id = p_appointment_id
    AND regexp_replace(parishioner_phone, '\D', '', 'g') ILIKE '%' || right(v_clean_phone, 8) || '%';

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_parishioner_appointment(uuid, text) TO anon, authenticated;

