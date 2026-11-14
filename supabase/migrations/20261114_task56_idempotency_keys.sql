-- ==============================================================================
-- Migração: 20261114_task56_idempotency_keys.sql
-- Tarefa: TASK-56 — Chave de Idempotência em Intenções de Missa e Agendamentos
-- Objetivo: Garantir deduplicação em nível de banco de dados contra toques
--           duplos ou retentativas automáticas em conexões 3G/4G instáveis.
-- ==============================================================================

-- 1. Agendamentos Pastorais (public.pastoral_appointments)
ALTER TABLE public.pastoral_appointments
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pastoral_appointments_parish_idempotency
  ON public.pastoral_appointments (parish_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- 2. Intenções de Santa Missa (public.mass_intentions)
-- Índice composto com intention_type permite que um mesmo envio em lote (com várias categorias)
-- compartilhe a mesma idempotency_key sem duplicar a mesma categoria no reenvio.
ALTER TABLE public.mass_intentions
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mass_intentions_parish_idempotency_type
  ON public.mass_intentions (parish_id, idempotency_key, intention_type)
  WHERE idempotency_key IS NOT NULL;

