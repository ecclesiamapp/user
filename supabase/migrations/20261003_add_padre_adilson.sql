-- ==============================================================================
-- MIGRAÇÃO: ADIÇÃO DO PADRE ADILSON RAMOS DE MELO AO CLERO DA CATEDRAL
-- ==============================================================================

-- 1. Inserir Padre Adilson Ramos de Melo como Vigário Paroquial
INSERT INTO public.clergy (
    id,
    parish_id,
    name,
    role,
    title,
    birthday,
    ordination_date,
    office_hours,
    order_index,
    is_active
) VALUES (
    'c0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000001',
    'Padre Adilson Ramos de Melo',
    'vigario',
    'Vigário Paroquial',
    '28 de outubro',
    '15 de dezembro de 2007',
    'Quarta e Sexta-feira: 14:00h às 16:30h (ou agendamento)',
    2,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    title = EXCLUDED.title,
    office_hours = EXCLUDED.office_hours,
    order_index = EXCLUDED.order_index,
    is_active = true;

-- 2. Reordenar os outros vigários para manter a sequência harmônica
UPDATE public.clergy
SET order_index = 3
WHERE name LIKE '%Deivid%' AND parish_id = 'c0000000-0000-0000-0000-000000000001';

UPDATE public.clergy
SET order_index = 4
WHERE name LIKE '%Ernandes%' AND parish_id = 'c0000000-0000-0000-0000-000000000001';
