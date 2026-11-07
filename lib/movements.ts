import { createClient } from '@supabase/supabase-js';
import {
  ParishMovement,
  ParishMovementEvent,
  ParishMovementRegistration,
} from '@/types/movements';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const CATEDRAL_PARISH_ID = 'c0000000-0000-0000-0000-000000000001';

export const FALLBACK_MOVEMENTS: ParishMovement[] = [
  {
    id: 'm0000000-0000-0000-0000-000000000001',
    parish_id: CATEDRAL_PARISH_ID,
    name: 'Encontro de Casais com Cristo',
    acronym: 'ECC',
    slug: 'ecc',
    patron_saint: 'Nossa Senhora do Bom Conselho & Sagrada Família',
    carisma:
      'Evangelização e fortalecimento das famílias e matrimônios no seio da Igreja Católica, despertando a corresponsabilidade pastoral.',
    spiritual_director_name: 'Pe. Irineu Valdereis de Castro',
    spiritual_director_role: 'Pároco e Diretor Espiritual',
    coordinating_team: 'Casal Coordenador Geral da Catedral',
    contact_whatsapp: '+5527999840001',
    contact_email: 'secretaria@catedraldecolatina.org.br',
    meeting_schedule:
      'Círculos mensais nas Comunidades e Reuniões de Pós-Encontro no Centro Pastoral São João Paulo II.',
    description:
      'O Encontro de Casais com Cristo (ECC) é um serviço pastoral da Igreja Católica para evangelizar a família, primeiro núcleo de comunhão humana e santuário da vida. Na Catedral de Colatina, o ECC atua com vigor integrando os casais à liturgia, aos serviços de caridade e à vida fraterna em comunidade.',
    logo_url: '/images/movements/ecc-logo.svg',
    banner_url: '/images/banners/banner-catedral.webp',
    order_index: 1,
    is_active: true,
    created_at: '2026-11-07T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
  {
    id: 'm0000000-0000-0000-0000-000000000002',
    parish_id: CATEDRAL_PARISH_ID,
    name: 'Encontro de Adolescentes com Cristo',
    acronym: 'EAC',
    slug: 'eac',
    patron_saint: 'São Carlos Borromeu & Santa Maria Goretti',
    carisma:
      'Evangelização e acolhimento dos adolescentes (12 a 15 anos), cultivando valores cristãos, oração e amizades sadias.',
    spiritual_director_name: 'Pe. Deivid Marcolino Pereira',
    spiritual_director_role: 'Vigário Paroquial e Assistente dos Movimentos Juvenis',
    coordinating_team: 'Equipe de Tios e Jovens Coordenadores',
    contact_whatsapp: '+5527999840001',
    contact_email: 'secretaria@catedraldecolatina.org.br',
    meeting_schedule:
      'Encontros quinzenais aos sábados às 15h00 no Centro Pastoral São João Paulo II.',
    description:
      'O EAC proporciona aos adolescentes da Paróquia da Catedral uma experiência viva de encontro com Jesus Cristo, ajudando-os a discernir caminhos retos de fé, solidariedade e respeito mútuo em uma fase decisiva de amadurecimento humano.',
    logo_url: '/images/movements/eac-logo.svg',
    banner_url: '/images/banners/banner-catedral.webp',
    order_index: 2,
    is_active: true,
    created_at: '2026-11-07T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
  {
    id: 'm0000000-0000-0000-0000-000000000003',
    parish_id: CATEDRAL_PARISH_ID,
    name: 'Encontro de Jovens com Cristo',
    acronym: 'EJC',
    slug: 'ejc',
    patron_saint: 'São João Paulo II & Beato Carlo Acutis',
    carisma:
      'Despertar a juventude (16 a 28 anos) para ser protagonista de sua fé e transformar a sociedade com a luz do Evangelho.',
    spiritual_director_name: 'Pe. Deivid Marcolino Pereira',
    spiritual_director_role: 'Vigário Paroquial e Assistente dos Movimentos Juvenis',
    coordinating_team: 'Jovens Coordenadores & Casal de Tios Apoiadores',
    contact_whatsapp: '+5527999840001',
    contact_email: 'secretaria@catedraldecolatina.org.br',
    meeting_schedule:
      'Grupão de Oração aos domingos às 17h30 no Salão Paroquial da Catedral (precedendo a Santa Missa das 19h00).',
    description:
      'O EJC reúne a juventude da Catedral de Colatina em torno da oração, da adoração eucarística, de ações solidárias e de momentos profundos de reflexão, preparando líderes comprometidos com a fé cristã e a Igreja.',
    logo_url: '/images/movements/ejc-logo.svg',
    banner_url: '/images/banners/banner-catedral.webp',
    order_index: 3,
    is_active: true,
    created_at: '2026-11-07T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
];

export const FALLBACK_MOVEMENT_EVENTS: Record<string, ParishMovementEvent[]> = {
  ecc: [
    {
      id: 'me000000-0000-0000-0000-000000000001',
      parish_id: CATEDRAL_PARISH_ID,
      movement_id: 'm0000000-0000-0000-0000-000000000001',
      title: 'XXXVI ECC — 1ª Etapa Paroquial',
      event_type: 'encontro_etapa',
      start_date: '2027-05-21',
      end_date: '2027-05-23',
      time_info: 'Sexta a Domingo (Integral)',
      location: 'Centro Pastoral São João Paulo II - Catedral',
      registration_open: true,
      registration_deadline: '2027-05-10',
      max_participants: 35,
      notes:
        'Vagas limitadas para casais residentes no território da Catedral e das 14 Comunidades Eclesiais de Base (CEBs).',
      status: 'agendado',
      order_index: 1,
      created_at: '2026-11-07T00:00:00Z',
      updated_at: '2026-11-07T00:00:00Z',
    },
  ],
  eac: [
    {
      id: 'me000000-0000-0000-0000-000000000002',
      parish_id: CATEDRAL_PARISH_ID,
      movement_id: 'm0000000-0000-0000-0000-000000000002',
      title: 'XIII EAC da Catedral — "Sede Fortes no Senhor"',
      event_type: 'encontro_etapa',
      start_date: '2027-06-12',
      end_date: '2027-06-13',
      time_info: 'Sábado e Domingo',
      location: 'Auditório do Colégio Marista / Centro Pastoral',
      registration_open: true,
      registration_deadline: '2027-06-01',
      max_participants: 50,
      notes:
        'Destinado a adolescentes de 12 a 15 anos. Ficha com autorização dos pais obrigatória.',
      status: 'agendado',
      order_index: 1,
      created_at: '2026-11-07T00:00:00Z',
      updated_at: '2026-11-07T00:00:00Z',
    },
  ],
  ejc: [
    {
      id: 'me000000-0000-0000-0000-000000000003',
      parish_id: CATEDRAL_PARISH_ID,
      movement_id: 'm0000000-0000-0000-0000-000000000003',
      title: 'XIX EJC da Catedral — "Não Tenhais Medo de Ser Santos"',
      event_type: 'encontro_etapa',
      start_date: '2027-07-16',
      end_date: '2027-07-18',
      time_info: 'Sexta a Domingo',
      location: 'Centro Pastoral São João Paulo II - Catedral',
      registration_open: true,
      registration_deadline: '2027-07-05',
      max_participants: 60,
      notes: 'Para jovens de 16 a 28 anos solteiros.',
      status: 'agendado',
      order_index: 1,
      created_at: '2026-11-07T00:00:00Z',
      updated_at: '2026-11-07T00:00:00Z',
    },
  ],
};

/**
 * Busca todos os movimentos paroquiais ativos
 */
export async function getParishMovements(
  parishId: string = CATEDRAL_PARISH_ID
): Promise<ParishMovement[]> {
  const supabase = getSupabase();
  if (!supabase) return FALLBACK_MOVEMENTS;

  try {
    const { data, error } = await supabase
      .from('parish_movements')
      .select('*')
      .eq('parish_id', parishId)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_MOVEMENTS;
    }

    return data as ParishMovement[];
  } catch (err) {
    console.error('Erro ao buscar movimentos no Supabase:', err);
    return FALLBACK_MOVEMENTS;
  }
}

/**
 * Busca um movimento paroquial por seu slug
 */
export async function getParishMovementBySlug(
  slug: string,
  parishId: string = CATEDRAL_PARISH_ID
): Promise<ParishMovement | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return (
      FALLBACK_MOVEMENTS.find(
        (m) => m.slug.toLowerCase() === slug.toLowerCase()
      ) || null
    );
  }

  try {
    const { data, error } = await supabase
      .from('parish_movements')
      .select('*')
      .eq('parish_id', parishId)
      .eq('slug', slug.toLowerCase())
      .single();

    if (error || !data) {
      return (
        FALLBACK_MOVEMENTS.find(
          (m) => m.slug.toLowerCase() === slug.toLowerCase()
        ) || null
      );
    }

    return data as ParishMovement;
  } catch (err) {
    console.error(`Erro ao buscar movimento ${slug} no Supabase:`, err);
    return (
      FALLBACK_MOVEMENTS.find(
        (m) => m.slug.toLowerCase() === slug.toLowerCase()
      ) || null
    );
  }
}

/**
 * Busca eventos e etapas de um movimento específico
 */
export async function getMovementEvents(
  movementId: string,
  slugFallback?: string
): Promise<ParishMovementEvent[]> {
  const supabase = getSupabase();
  const fallbackList = slugFallback
    ? FALLBACK_MOVEMENT_EVENTS[slugFallback.toLowerCase()] || []
    : [];

  if (!supabase) return fallbackList;

  try {
    const { data, error } = await supabase
      .from('parish_movement_events')
      .select('*')
      .eq('movement_id', movementId)
      .neq('status', 'cancelado')
      .order('start_date', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackList;
    }

    return data as ParishMovementEvent[];
  } catch (err) {
    console.error('Erro ao buscar eventos do movimento:', err);
    return fallbackList;
  }
}

/**
 * Registra uma ficha digital de pré-inscrição / manifestação de interesse
 */
export async function submitMovementRegistration(
  payload: Omit<ParishMovementRegistration, 'id' | 'created_at' | 'updated_at' | 'status'>
): Promise<{ success: boolean; error?: string }> {
  if (!payload.lgpd_consent) {
    return {
      success: false,
      error: 'É obrigatório declarar consentimento conforme a LGPD.',
    };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: false,
      error: 'Conexão com o banco de dados indisponível.',
    };
  }

  try {
    const { error } = await supabase
      .from('parish_movement_registrations')
      .insert([
        {
          parish_id: payload.parish_id || CATEDRAL_PARISH_ID,
          movement_id: payload.movement_id,
          event_id: payload.event_id || null,
          community_id: payload.community_id || null,
          applicant_name: payload.applicant_name,
          applicant_birth_date: payload.applicant_birth_date || null,
          applicant_phone: payload.applicant_phone,
          applicant_email: payload.applicant_email || null,
          applicant_address: payload.applicant_address || null,
          applicant_neighborhood: payload.applicant_neighborhood || null,
          spouse_or_guardian_name: payload.spouse_or_guardian_name || null,
          spouse_or_guardian_phone: payload.spouse_or_guardian_phone || null,
          is_minor: payload.is_minor || false,
          marital_status: payload.marital_status || null,
          notes: payload.notes || null,
          lgpd_consent: true,
          status: 'nova',
        },
      ]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro inesperado';
    return { success: false, error: msg };
  }
}

