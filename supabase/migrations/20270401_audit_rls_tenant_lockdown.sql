-- ==============================================================================
-- Migração: 20270401_audit_rls_tenant_lockdown.sql
-- Origem: Auditoria Vibe-Security + Deslop (SEC-002, SEC-003, SEC-004, SEC-008, SEC-011)
-- Objetivo:
--   1. Fechar isolamento multi-tenant (can_access_parish_admin) em todas as tabelas
--      de PII da Secretaria/Dízimo/Movimentos, logs de CEBs e dias de eventos especiais.
--   2. Garantir lockdown final sobre parish_knowledge_documents/embeddings e eventos
--      especiais após as migrações 20270101–20270302.
--   3. Restringir INSERT em security_audit_logs ao próprio tenant e restringir escrita
--      em storage.objects apenas a administradores ativos em user_profiles.
--   4. Eliminar wildcard injection (ILIKE '%') nas RPCs públicas do /meu-espaco.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. GARANTIA IDEMPOTENTE DAS FUNÇÕES AUXILIARES & ÍNDICE DE FK
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_parish_knowledge_documents_uploaded_by
  ON public.parish_knowledge_documents (uploaded_by);

CREATE OR REPLACE FUNCTION public.can_access_parish_admin(target_parish_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    public.is_active_superadmin()
    OR (
      target_parish_id IS NOT NULL
      AND public.get_active_admin_parish_id() = target_parish_id
      AND public.get_active_admin_role() IN (
        'paroco',
        'vigario',
        'secretaria',
        'pascom',
        'coordenador_ceb'
      )
    );
$$;

-- ------------------------------------------------------------------------------
-- 2. ISOLAMENTO MULTI-TENANT NAS TABELAS PII (SECRETARIA, DÍZIMO, SACRAMENTOS)
-- ------------------------------------------------------------------------------

DO $$
DECLARE
  tbl text;
  pol record;
  pii_tables text[] := ARRAY[
    'mass_intentions',
    'certificate_requests',
    'tithe_registrations',
    'pastoral_appointments',
    'sacramental_registrations'
  ];
BEGIN
  FOREACH tbl IN ARRAY pii_tables LOOP
    IF to_regclass(format('public.%I', tbl)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);

      FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = tbl
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', pol.policyname, tbl);
      END LOOP;

      -- Público anônimo / fiel pode apenas INSERIR solicitações com parish_id explícito
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (parish_id IS NOT NULL);',
        tbl || '_public_insert',
        tbl
      );

      -- Leitura, atualização e exclusão restritas estritamente aos admins do mesmo tenant
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING ((SELECT public.can_access_parish_admin(parish_id)));',
        tbl || '_select_tenant_admin',
        tbl
      );

      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING ((SELECT public.can_access_parish_admin(parish_id))) WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));',
        tbl || '_update_tenant_admin',
        tbl
      );

      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING ((SELECT public.can_access_parish_admin(parish_id)));',
        tbl || '_delete_tenant_admin',
        tbl
      );
    END IF;
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 3. ISOLAMENTO MULTI-TENANT NOS MOVIMENTOS PAROQUIAIS (ECC, EAC, EJC)
-- ------------------------------------------------------------------------------

DO $$
DECLARE
  pol record;
BEGIN
  IF to_regclass('public.parish_movements') IS NOT NULL THEN
    ALTER TABLE public.parish_movements ENABLE ROW LEVEL SECURITY;
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parish_movements' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.parish_movements;', pol.policyname);
    END LOOP;

    CREATE POLICY "parish_movements_select_unified"
      ON public.parish_movements FOR SELECT TO anon, authenticated
      USING (is_active = true OR (SELECT public.can_access_parish_admin(parish_id)));

    CREATE POLICY "parish_movements_insert_admin"
      ON public.parish_movements FOR INSERT TO authenticated
      WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));

    CREATE POLICY "parish_movements_update_admin"
      ON public.parish_movements FOR UPDATE TO authenticated
      USING ((SELECT public.can_access_parish_admin(parish_id)))
      WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));

    CREATE POLICY "parish_movements_delete_admin"
      ON public.parish_movements FOR DELETE TO authenticated
      USING ((SELECT public.can_access_parish_admin(parish_id)));
  END IF;

  IF to_regclass('public.parish_movement_events') IS NOT NULL THEN
    ALTER TABLE public.parish_movement_events ENABLE ROW LEVEL SECURITY;
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parish_movement_events' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.parish_movement_events;', pol.policyname);
    END LOOP;

    CREATE POLICY "parish_movement_events_select_unified"
      ON public.parish_movement_events FOR SELECT TO anon, authenticated
      USING (status <> 'cancelado' OR (SELECT public.can_access_parish_admin(parish_id)));

    CREATE POLICY "parish_movement_events_insert_admin"
      ON public.parish_movement_events FOR INSERT TO authenticated
      WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));

    CREATE POLICY "parish_movement_events_update_admin"
      ON public.parish_movement_events FOR UPDATE TO authenticated
      USING ((SELECT public.can_access_parish_admin(parish_id)))
      WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));

    CREATE POLICY "parish_movement_events_delete_admin"
      ON public.parish_movement_events FOR DELETE TO authenticated
      USING ((SELECT public.can_access_parish_admin(parish_id)));
  END IF;

  IF to_regclass('public.parish_movement_registrations') IS NOT NULL THEN
    ALTER TABLE public.parish_movement_registrations ENABLE ROW LEVEL SECURITY;
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parish_movement_registrations' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.parish_movement_registrations;', pol.policyname);
    END LOOP;

    CREATE POLICY "parish_movement_registrations_public_insert"
      ON public.parish_movement_registrations FOR INSERT TO anon, authenticated
      WITH CHECK (lgpd_consent = true AND parish_id IS NOT NULL);

    CREATE POLICY "parish_movement_registrations_select_admin"
      ON public.parish_movement_registrations FOR SELECT TO authenticated
      USING ((SELECT public.can_access_parish_admin(parish_id)));

    CREATE POLICY "parish_movement_registrations_update_admin"
      ON public.parish_movement_registrations FOR UPDATE TO authenticated
      USING ((SELECT public.can_access_parish_admin(parish_id)))
      WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));

    CREATE POLICY "parish_movement_registrations_delete_admin"
      ON public.parish_movement_registrations FOR DELETE TO authenticated
      USING ((SELECT public.can_access_parish_admin(parish_id)));
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. ISOLAMENTO DE community_activity_logs, parish_event_days & BASE RAG
-- ------------------------------------------------------------------------------

DO $$
DECLARE
  pol record;
BEGIN
  IF to_regclass('public.community_activity_logs') IS NOT NULL THEN
    ALTER TABLE public.community_activity_logs ENABLE ROW LEVEL SECURITY;
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_activity_logs' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.community_activity_logs;', pol.policyname);
    END LOOP;

    CREATE POLICY "community_activity_logs_select_tenant"
      ON public.community_activity_logs FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.communities c
          WHERE c.id = community_id
            AND (SELECT public.can_access_parish_admin(c.parish_id))
        )
      );

    CREATE POLICY "community_activity_logs_insert_tenant"
      ON public.community_activity_logs FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.communities c
          WHERE c.id = community_id
            AND (SELECT public.can_access_parish_admin(c.parish_id))
        )
      );

    CREATE POLICY "community_activity_logs_update_tenant"
      ON public.community_activity_logs FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.communities c
          WHERE c.id = community_id
            AND (SELECT public.can_access_parish_admin(c.parish_id))
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.communities c
          WHERE c.id = community_id
            AND (SELECT public.can_access_parish_admin(c.parish_id))
        )
      );
  END IF;

  IF to_regclass('public.parish_event_days') IS NOT NULL THEN
    ALTER TABLE public.parish_event_days ENABLE ROW LEVEL SECURITY;
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parish_event_days' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.parish_event_days;', pol.policyname);
    END LOOP;

    CREATE POLICY "parish_event_days_select_unified"
      ON public.parish_event_days FOR SELECT TO anon, authenticated
      USING (true);

    CREATE POLICY "parish_event_days_insert_tenant"
      ON public.parish_event_days FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.parish_special_events e
          WHERE e.id = event_id
            AND (SELECT public.can_access_parish_admin(e.parish_id))
        )
      );

    CREATE POLICY "parish_event_days_update_tenant"
      ON public.parish_event_days FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.parish_special_events e
          WHERE e.id = event_id
            AND (SELECT public.can_access_parish_admin(e.parish_id))
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.parish_special_events e
          WHERE e.id = event_id
            AND (SELECT public.can_access_parish_admin(e.parish_id))
        )
      );

    CREATE POLICY "parish_event_days_delete_tenant"
      ON public.parish_event_days FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.parish_special_events e
          WHERE e.id = event_id
            AND (SELECT public.can_access_parish_admin(e.parish_id))
        )
      );
  END IF;

  IF to_regclass('public.parish_knowledge_documents') IS NOT NULL THEN
    ALTER TABLE public.parish_knowledge_documents ENABLE ROW LEVEL SECURITY;
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parish_knowledge_documents' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.parish_knowledge_documents;', pol.policyname);
    END LOOP;

    CREATE POLICY "parish_knowledge_documents_tenant_admin_only"
      ON public.parish_knowledge_documents FOR ALL TO authenticated
      USING ((SELECT public.can_access_parish_admin(parish_id)))
      WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));
  END IF;

  IF to_regclass('public.parish_knowledge_embeddings') IS NOT NULL THEN
    ALTER TABLE public.parish_knowledge_embeddings ENABLE ROW LEVEL SECURITY;
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parish_knowledge_embeddings' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.parish_knowledge_embeddings;', pol.policyname);
    END LOOP;

    CREATE POLICY "parish_knowledge_embeddings_tenant_admin_only"
      ON public.parish_knowledge_embeddings FOR ALL TO authenticated
      USING ((SELECT public.can_access_parish_admin(parish_id)))
      WITH CHECK ((SELECT public.can_access_parish_admin(parish_id)));
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. BLINDAGEM DE security_audit_logs (SEC-011)
-- ------------------------------------------------------------------------------

DO $$
BEGIN
  IF to_regclass('public.security_audit_logs') IS NOT NULL THEN
    DROP POLICY IF EXISTS "security_audit_logs_insert_authenticated_only" ON public.security_audit_logs;
    CREATE POLICY "security_audit_logs_insert_scoped_admin"
      ON public.security_audit_logs FOR INSERT TO authenticated
      WITH CHECK (
        (SELECT public.is_active_superadmin())
        OR (
          parish_id IS NOT NULL
          AND (SELECT public.can_access_parish_admin(parish_id))
        )
      );
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 6. HARDENING DE storage.objects PARA BUCKETS PAROQUIAIS (SEC-008)
-- ------------------------------------------------------------------------------
-- Leitura pública preservada para imagens/folhetos do portal; mutações exigem
-- usuário autenticado com perfil administrativo ativo em user_profiles.

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      AND policyname IN (
        'Upload de brand assets pela administração',
        'Atualização de brand assets pela administração',
        'Exclusão de brand assets pela administração',
        'Upload de event assets pela administracao',
        'Atualizacao de event assets pela administracao',
        'Exclusao de event assets pela administracao',
        'Upload de folhetos por administradores',
        'Atualização de folhetos por administradores',
        'Exclusão de folhetos por administradores',
        'Upload de midias dos movimentos por administradores',
        'Atualizacao de midias dos movimentos por administradores',
        'Exclusao de midias dos movimentos por administradores'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects;', pol.policyname);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "ecclesiam_storage_admin_insert" ON storage.objects;
CREATE POLICY "ecclesiam_storage_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('parish-media', 'booklets', 'galleries', 'brand_assets', 'event_assets', 'movement_assets')
    AND (SELECT public.get_active_admin_role()) IS NOT NULL
  );

DROP POLICY IF EXISTS "ecclesiam_storage_admin_update" ON storage.objects;
CREATE POLICY "ecclesiam_storage_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id IN ('parish-media', 'booklets', 'galleries', 'brand_assets', 'event_assets', 'movement_assets')
    AND (SELECT public.get_active_admin_role()) IS NOT NULL
  )
  WITH CHECK (
    bucket_id IN ('parish-media', 'booklets', 'galleries', 'brand_assets', 'event_assets', 'movement_assets')
    AND (SELECT public.get_active_admin_role()) IS NOT NULL
  );

DROP POLICY IF EXISTS "ecclesiam_storage_admin_delete" ON storage.objects;
CREATE POLICY "ecclesiam_storage_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id IN ('parish-media', 'booklets', 'galleries', 'brand_assets', 'event_assets', 'movement_assets')
    AND (SELECT public.get_active_admin_role()) IS NOT NULL
  );

-- ------------------------------------------------------------------------------
-- 7. HARDENING DE RPCS DO /meu-espaco CONTRA WILDCARD ILIKE '%' (SEC-004)
-- ------------------------------------------------------------------------------

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
  v_protocol text := upper(trim(COALESCE(p_protocol, '')));
BEGIN
  -- Exige telefone completo (>=10 dígitos) ou código de protocolo alfanumérico válido (>=6 chars, sem curingas)
  IF length(v_clean_phone) < 10 AND v_protocol !~ '^[A-Z0-9-]{6,64}$' THEN
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
      (
        v_protocol ~ '^[A-Z0-9-]{6,64}$'
        AND upper(trim(COALESCE(i.protocol_code, ''))) = v_protocol
      )
      OR (
        length(v_clean_phone) >= 10
        AND right(regexp_replace(COALESCE(i.contact_phone, ''), '\D', '', 'g'), 8) = right(v_clean_phone, 8)
      )
    )
  ORDER BY i.celebration_date DESC, i.celebration_time DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_parishioner_intentions(uuid, text, text) TO anon, authenticated;

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
  v_protocol text := upper(trim(COALESCE(p_protocol, '')));
BEGIN
  IF length(v_clean_phone) < 10 AND v_protocol !~ '^[A-Z0-9-]{6,64}$' THEN
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
      (
        v_protocol ~ '^[A-Z0-9-]{6,64}$'
        AND (
          upper(a.id::text) = v_protocol
          OR upper(COALESCE(a.notes, '')) LIKE '%[PROTOCOLO: ' || v_protocol || ']%'
        )
      )
      OR (
        length(v_clean_phone) >= 10
        AND right(regexp_replace(COALESCE(a.parishioner_phone, ''), '\D', '', 'g'), 8) = right(v_clean_phone, 8)
      )
    )
  ORDER BY a.appointment_date ASC, a.appointment_time ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_parishioner_appointments(uuid, text, text) TO anon, authenticated;

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
  IF length(v_clean_phone) < 10 THEN
    RETURN false;
  END IF;

  UPDATE public.pastoral_appointments
  SET status = 'cancelado', updated_at = now()
  WHERE id = p_appointment_id
    AND length(regexp_replace(COALESCE(parishioner_phone, ''), '\D', '', 'g')) >= 8
    AND right(regexp_replace(COALESCE(parishioner_phone, ''), '\D', '', 'g'), 8) = right(v_clean_phone, 8);

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_parishioner_appointment(uuid, text) TO anon, authenticated;
