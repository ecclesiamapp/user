-- ==============================================================================
-- MIGRAÇÃO: ADIÇÃO DO GRUPO DE REFLEXÃO SANTA RITA (BRISA DO VALE)
-- ==============================================================================
-- Solicitado pelo Pároco Pe. Irineu na Reunião de 07/10/2026
-- Totaliza agora 12 Comunidades/Núcleos da Catedral do Sagrado Coração de Jesus.

INSERT INTO public.communities (
    id,
    parish_id,
    name,
    patron_saint,
    is_headquarters,
    neighborhood,
    city,
    state,
    slug,
    foundation_year,
    feast_day,
    history,
    contact_name,
    contact_phone,
    is_active
) VALUES (
    'c0000000-0000-0000-0000-000000000022',
    'c0000000-0000-0000-0000-000000000001',
    'Grupo de Reflexão Santa Rita',
    'Santa Rita de Cássia',
    false,
    'Brisa do Vale',
    'Colatina',
    'ES',
    'santa-rita-brisa-do-vale',
    '2018',
    '22 de Maio',
    'Núcleo vivo de oração e partilha da Palavra de Deus reunido no Bairro Brisa do Vale. Sob a poderosa intercessão de Santa Rita de Cássia, as famílias do bairro se reúnem semanalmente em círculos bíblicos de reflexão, terço e fraternidade cristã em profunda união com a Catedral.',
    'Coordenação do Grupo de Reflexão',
    '(27) 2102-5012',
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    patron_saint = EXCLUDED.patron_saint,
    neighborhood = EXCLUDED.neighborhood,
    slug = EXCLUDED.slug,
    feast_day = EXCLUDED.feast_day,
    history = EXCLUDED.history;
