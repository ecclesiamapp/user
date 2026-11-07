/**
 * Tipos Canônicos e Estruturais para o Módulo de Movimentos Paroquiais (ECC, EAC, EJC)
 * Alinhado com a migração 20261107_create_parish_movements.sql
 */

export interface ParishMovement {
  id: string;
  parish_id: string;
  name: string;
  acronym: string;
  slug: string;
  patron_saint?: string | null;
  carisma?: string | null;
  spiritual_director_name?: string | null;
  spiritual_director_role?: string | null;
  coordinating_team?: string | null;
  contact_whatsapp?: string | null;
  contact_email?: string | null;
  meeting_schedule?: string | null;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type MovementEventType =
  | 'encontro_etapa'
  | 'pos_encontro'
  | 'circulo'
  | 'missa_entrega'
  | 'formacao'
  | 'outro';

export type MovementEventStatus =
  | 'agendado'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado';

export interface ParishMovementEvent {
  id: string;
  parish_id: string;
  movement_id: string;
  title: string;
  event_type: MovementEventType;
  start_date: string;
  end_date?: string | null;
  time_info?: string | null;
  location?: string | null;
  registration_open: boolean;
  registration_deadline?: string | null;
  max_participants?: number | null;
  notes?: string | null;
  status: MovementEventStatus;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type MovementRegistrationStatus =
  | 'nova'
  | 'em_contato'
  | 'confirmada'
  | 'arquivada';

export interface ParishMovementRegistration {
  id: string;
  parish_id: string;
  movement_id: string;
  event_id?: string | null;
  community_id?: string | null;
  applicant_name: string;
  applicant_birth_date?: string | null;
  applicant_phone: string;
  applicant_email?: string | null;
  applicant_address?: string | null;
  applicant_neighborhood?: string | null;
  spouse_or_guardian_name?: string | null;
  spouse_or_guardian_phone?: string | null;
  is_minor: boolean;
  marital_status?: string | null;
  notes?: string | null;
  lgpd_consent: boolean;
  status: MovementRegistrationStatus;
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joins opcionais
  movement?: ParishMovement;
  event?: ParishMovementEvent;
}

