-- ==============================================================================
-- MIGRAÇÃO: POVOAÇÃO VISUAL (ONDA 2) - ÁLBUNS OFICIAIS & PATRIMÔNIO SACRO CATEDRAL
-- ==============================================================================
-- Data: 24/11/2026
-- Autor: Cláudio Costa (Fotografia Autoral) / Ecclesiam App
-- Objetivo: Povoar 3 álbuns oficiais em public.galleries e atualizar o patrimônio
--           sacro em public.parish_sacred_heritage com fotos reais em WebP de alta performance.

DO $$
DECLARE
  v_parish_id UUID := 'c0000000-0000-0000-0000-000000000001';
  v_catedral_comm_id UUID;
BEGIN
  -- Obter o ID da Comunidade Sede (Catedral)
  SELECT id INTO v_catedral_comm_id FROM public.communities 
  WHERE parish_id = v_parish_id AND (is_headquarters = true OR slug = 'catedral-matriz')
  LIMIT 1;

  -- 1. ATUALIZAR AS FOTOS DO PATRIMÔNIO SACRO (parish_sacred_heritage)
  UPDATE public.parish_sacred_heritage
  SET 
    image_url = '/images/historia/vitral-frontal-arco.webp',
    image_caption = 'Grande Vitral Frontal em arco dedicado ao Sagrado Coração de Jesus. Foto: Cláudio Costa',
    updated_at = NOW()
  WHERE parish_id = v_parish_id AND order_index = 2;

  UPDATE public.parish_sacred_heritage
  SET 
    image_url = '/images/historia/nave-central-simetrica.webp',
    image_caption = 'Nave Monumental da Catedral e Presbitério. Foto: Cláudio Costa',
    updated_at = NOW()
  WHERE parish_id = v_parish_id AND order_index = 5;

  UPDATE public.parish_sacred_heritage
  SET 
    image_url = '/images/historia/fachada-frontal-limpa.webp',
    image_caption = 'Fachada frontal imponente da Catedral Diocesana. Foto: Cláudio Costa',
    updated_at = NOW()
  WHERE parish_id = v_parish_id AND order_index = 6;

  -- 2. INSERIR OS 3 ÁLBUNS OFICIAIS DA CATEDRAL (public.galleries)

  -- Álbum 1: Arquitetura e Fachadas da Catedral Diocesana
  INSERT INTO public.galleries (
    id,
    parish_id,
    community_id,
    title,
    slug,
    description,
    event_date,
    cover_image_url,
    photos_count,
    photos,
    is_active
  ) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    v_parish_id,
    v_catedral_comm_id,
    'Arquitetura e Fachadas da Catedral Diocesana',
    'arquitetura-fachadas-catedral-colatina',
    'Acervo fotográfico documentando a arquitetura moderna, torres e fachadas diurnas e noturnas da Catedral do Sagrado Coração de Jesus. Fotografia autoral: Cláudio Costa.',
    '2026-11-20',
    '/images/home/catedral-panoramica-elevada.webp',
    6,
    '[
      {"url": "/images/home/catedral-panoramica-elevada.webp", "caption": "Vista panorâmica elevada da Catedral e do centro de Colatina", "credit": "Cláudio Costa"},
      {"url": "/images/festas/natal-catedral-2026.webp", "caption": "Fachada monumental da Catedral com iluminação noturna especial", "credit": "Cláudio Costa"},
      {"url": "/images/historia/fachada-frontal-limpa.webp", "caption": "Fachada frontal imponente a partir da avenida", "credit": "Cláudio Costa"},
      {"url": "/images/galleries/arquitetura/catedral-galeria-fachada-04.webp", "caption": "Perspectiva arquitetônica das linhas verticais da Catedral", "credit": "Cláudio Costa"},
      {"url": "/images/galleries/arquitetura/catedral-galeria-fachada-06.webp", "caption": "Torres sineiras e frontispício da Catedral", "credit": "Cláudio Costa"},
      {"url": "/images/galleries/arquitetura/catedral-galeria-fachada-11.webp", "caption": "Catedral Diocesana sob o céu azul de Colatina", "credit": "Cláudio Costa"}
    ]'::jsonb,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    cover_image_url = EXCLUDED.cover_image_url,
    photos_count = EXCLUDED.photos_count,
    photos = EXCLUDED.photos,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  -- Álbum 2: Os Vitrais do Sagrado Coração e Via Sacra
  INSERT INTO public.galleries (
    id,
    parish_id,
    community_id,
    title,
    slug,
    description,
    event_date,
    cover_image_url,
    photos_count,
    photos,
    is_active
  ) VALUES (
    'a2222222-2222-2222-2222-222222222222',
    v_parish_id,
    v_catedral_comm_id,
    'Os Vitrais do Sagrado Coração e Arte Sacra',
    'vitrais-sagrado-coracao-catedral',
    'Registro em alta resolução dos vitrais coloridos que banham a nave da Catedral de luz e espiritualidade. Fotografia autoral: Cláudio Costa.',
    '2026-11-20',
    '/images/historia/vitral-frontal-arco.webp',
    3,
    '[
      {"url": "/images/historia/vitral-frontal-arco.webp", "caption": "Grande Vitral Frontal em arco com Santa Margarida Maria e São Cláudio de La Colombière", "credit": "Cláudio Costa"},
      {"url": "/images/historia/vitral-sagrado-coracao.webp", "caption": "Detalhe radiante do Sagrado Coração de Jesus e cenas bíblicas", "credit": "Cláudio Costa"},
      {"url": "/images/historia/nave-reflexos-vitrais.webp", "caption": "Luz dos vitrais refletida no piso polido da nave central", "credit": "Cláudio Costa"}
    ]'::jsonb,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    cover_image_url = EXCLUDED.cover_image_url,
    photos_count = EXCLUDED.photos_count,
    photos = EXCLUDED.photos,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  -- Álbum 3: Interior, Presbitério, Batistério e Natal
  INSERT INTO public.galleries (
    id,
    parish_id,
    community_id,
    title,
    slug,
    description,
    event_date,
    cover_image_url,
    photos_count,
    photos,
    is_active
  ) VALUES (
    'a3333333-3333-3333-3333-333333333333',
    v_parish_id,
    v_catedral_comm_id,
    'Interior, Presbitério e Batistério da Catedral',
    'interior-presbiterio-batisterio-catedral',
    'A beleza sagrada da nave central, coro elevado, batistério de mármore e presépio natalino da Catedral. Fotografia autoral: Cláudio Costa.',
    '2026-11-20',
    '/images/home/catedral-hero-coro.webp',
    6,
    '[
      {"url": "/images/home/catedral-hero-coro.webp", "caption": "Nave central vista a partir do coro e mezanino", "credit": "Cláudio Costa"},
      {"url": "/images/historia/nave-central-simetrica.webp", "caption": "Perspectiva do corredor central em direção ao Presbitério", "credit": "Cláudio Costa"},
      {"url": "/images/historia/batisterio-catedral.webp", "caption": "Batistério em mármore, Círio Pascal e painel do Batismo do Senhor", "credit": "Cláudio Costa"},
      {"url": "/images/festas/presepio-natal-catedral.webp", "caption": "Presépio de Natal da Catedral do Sagrado Coração de Jesus", "credit": "Cláudio Costa"},
      {"url": "/images/liturgia/lamparina-santissimo.webp", "caption": "Lamparina do Santíssimo Sacramento e silêncio orante", "credit": "Cláudio Costa"},
      {"url": "/images/dizimo/acolhida-sagrado-coracao.webp", "caption": "Acolhida e devoção diante do Sagrado Coração", "credit": "Cláudio Costa"}
    ]'::jsonb,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    cover_image_url = EXCLUDED.cover_image_url,
    photos_count = EXCLUDED.photos_count,
    photos = EXCLUDED.photos,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

END $$;
