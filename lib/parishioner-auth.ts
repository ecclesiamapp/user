import { createClient } from '@/utils/supabase/client';
import { ParishionerSession } from '@/types/parishioner';
import { PastoralAppointment, MassIntention } from '@/types';
import { CATEDRAL_PARISH_ID } from './movements';

const SESSION_STORAGE_KEY = 'ecclesiam_parishioner_session';

/**
 * Lê a sessão do paroquiano armazenada no navegador (LocalStorage)
 */
export function getStoredParishionerSession(): ParishionerSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ParishionerSession;
  } catch {
    return null;
  }
}

/**
 * Salva a sessão do paroquiano no navegador
 */
export function setStoredParishionerSession(session: ParishionerSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Erro ao salvar sessão do paroquiano:', err);
  }
}

/**
 * Limpa a sessão do paroquiano (Logout)
 */
export function clearStoredParishionerSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Erro ao limpar sessão:', err);
  }
}

/**
 * Salva a Comunidade Eclesial de Base (CEB) favorita do fiel
 */
export function updateFavoriteCommunity(
  communityId: string,
  communityName: string
): ParishionerSession | null {
  const current = getStoredParishionerSession();
  if (!current) return null;

  const updated: ParishionerSession = {
    ...current,
    favorite_community_id: communityId,
    favorite_community_name: communityName,
  };

  setStoredParishionerSession(updated);
  return updated;
}

/**
 * Busca agendamentos pastorais com os padres vinculados ao telefone ou protocolo do fiel
 */
export async function fetchParishionerAppointments(
  phone: string,
  protocol?: string | null
): Promise<PastoralAppointment[]> {
  try {
    const supabase = createClient();
    const cleanPhone = phone.replace(/\D/g, '');

    let query = supabase
      .from('pastoral_appointments')
      .select('*, clergy:clergy_id(*), community:community_id(*)')
      .eq('parish_id', CATEDRAL_PARISH_ID);

    if (protocol) {
      query = query.or(`parishioner_phone.ilike.%${cleanPhone}%,id.eq.${protocol}`);
    } else if (cleanPhone) {
      query = query.ilike('parishioner_phone', `%${cleanPhone.slice(-8)}%`);
    }

    const { data, error } = await query.order('appointment_date', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data as PastoralAppointment[];
  } catch (err) {
    console.error('Erro ao buscar agendamentos do fiel:', err);
    return [];
  }
}

/**
 * Busca intenções de Santa Missa (Púlpito A4) vinculadas ao telefone ou protocolo do fiel
 */
export async function fetchParishionerIntentions(
  phone: string,
  protocol?: string | null
): Promise<MassIntention[]> {
  try {
    const supabase = createClient();
    const cleanPhone = phone.replace(/\D/g, '');

    let query = supabase
      .from('mass_intentions')
      .select('*')
      .eq('parish_id', CATEDRAL_PARISH_ID);

    if (protocol) {
      query = query.or(`contact_phone.ilike.%${cleanPhone}%,protocol_code.ilike.%${protocol}%`);
    } else if (cleanPhone) {
      query = query.ilike('contact_phone', `%${cleanPhone.slice(-8)}%`);
    }

    const { data, error } = await query.order('celebration_date', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as MassIntention[];
  } catch (err) {
    console.error('Erro ao buscar intenções do fiel:', err);
    return [];
  }
}

/**
 * Cancela previamente um agendamento pastoral com o sacerdote
 */
export async function cancelParishionerAppointment(
  appointmentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('pastoral_appointments')
      .update({ status: 'cancelado', updated_at: new Date().toISOString() })
      .eq('id', appointmentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Falha na conexão';
    return { success: false, error: msg };
  }
}

