/**
 * Tipos para a Área Privada do Fiel ("Meu Espaço Paroquial")
 * Alinhado ao ESCOPO_AREA_DO_FIEL.md e à LGPD (Lei 13.709/2018)
 */

export interface ParishionerSession {
  phone: string;
  name: string;
  email?: string | null;
  favorite_community_id?: string | null;
  favorite_community_name?: string | null;
  authenticated_at: string;
  auth_type: 'otp_phone' | 'protocol_direct';
  active_protocol?: string | null;
}

export interface ParishionerDataSummary {
  session: ParishionerSession;
  appointmentsCount: number;
  intentionsCount: number;
  favoriteCommunityId?: string | null;
  isTithingWelcomed: boolean;
}

