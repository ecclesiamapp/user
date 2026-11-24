-- =========================================================================
-- Script SQL: Purga e Limpeza de Dados do Teste de Carga de Natal (5.000 VUs)
-- Paróquia: Catedral do Sagrado Coração de Jesus (Colatina - ES)
-- Tag de Identificação Obrigatória: [CARGA-NATAL]
-- =========================================================================

BEGIN;

-- 1. Remover nomes associados às intenções de teste de carga
DELETE FROM public.mass_intention_names
WHERE name LIKE '%[CARGA-NATAL]%'
   OR intention_id IN (
     SELECT id FROM public.mass_intentions 
     WHERE notes LIKE '%[CARGA-NATAL]%' 
        OR offered_by LIKE '%[CARGA-NATAL]%'
        OR intention_for LIKE '%[CARGA-NATAL]%'
   );

-- 2. Remover registros de intenções de Santa Missa de teste de carga
DELETE FROM public.mass_intentions
WHERE notes LIKE '%[CARGA-NATAL]%'
   OR offered_by LIKE '%[CARGA-NATAL]%'
   OR intention_for LIKE '%[CARGA-NATAL]%'
   OR protocol_code LIKE 'INT-CARGA-%';

-- 3. Remover agendamentos pastorais gerados durante o teste de estresse
DELETE FROM public.pastoral_appointments
WHERE notes LIKE '%[CARGA-NATAL]%'
   OR parishioner_name LIKE '%[CARGA-NATAL]%'
   OR notes LIKE '%Teste de Carga%';

-- 4. Exibir resumo dos registros restantes
SELECT 'Limpeza de dados de teste [CARGA-NATAL] executada com sucesso!' AS status;

COMMIT;
