/**
 * Entidades e Tipos Centrais do Ecclesiam App
 * Definidos de acordo com o SSOT em [documentation]/MANIFESTO_ECCLESIAM.md
 * e [documentation]/planejamento/ESCOPO_HIERARQUIA_CEBS.md
 */

export interface Parish {
  id: string;
  name: string;
  diocese: string;
  slug: string;
  city: string;
  state: string;
  logo_url?: string;
  banner_url?: string;
  primary_color: string;
  whatsapp_number: string;
  address: string;
  pix_key: string;
  pix_key_type: 'cnpj' | 'email' | 'phone' | 'random';
  live_stream_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface CommunityLeader {
  id?: string;
  name: string;
  role: string; // ex: "Coordenador(a) do CPC", "Vice-Coordenador(a)", "Tesoureiro(a)", "Secretário(a)", "Coordenador(a) de Liturgia", "Coordenador(a) da Catequese", "Coordenador(a) do Dízimo"
  phone?: string;
  email?: string;
  photo_url?: string;
  image?: string;
  bio?: string;
}

export interface CommunityNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  category?: 'aviso' | 'liturgia' | 'formacao' | 'mutirao';
  priority?: 'normal' | 'alta';
}

export interface CommunityPastoralGroup {
  name: string;
  meeting_day_and_time: string;
  coordinator_name?: string;
  description?: string;
}

export interface CommunityActivity {
  id: string;
  title: string;
  date_label: string; // ex: "25 OUT"
  day_of_week?: string; // ex: "Quinta-feira"
  time: string; // ex: "19:30"
  category?: 'oracao' | 'liturgia' | 'pastoral' | 'formacao' | 'festa';
  location?: string;
  responsible_group?: string; // ex: "Terço dos Homens"
  description?: string;
}

export interface Community {
  id: string;
  parish_id: string;
  name: string; // ex: "Comunidade São José"
  patron_saint?: string; // ex: "São José Operário"
  is_headquarters: boolean; // true para Igreja Matriz
  address?: string;
  neighborhood?: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  banner_url?: string;
  patron_image_url?: string;
  contact_name?: string; // Coordenador da comunidade
  contact_phone?: string;
  is_active: boolean;
  slug?: string;
  history?: string;
  foundation_year?: string;
  feast_day?: string;
  cpc_leaders?: CommunityLeader[];
  notices?: CommunityNotice[];
  pastoral_groups?: CommunityPastoralGroup[];
  activities?: CommunityActivity[];
  pix_key?: string;
  pix_key_type?: 'cnpj' | 'email' | 'phone' | 'random';
  dizimo_info?: string;
  created_at: string;
  updated_at?: string;
}

export interface MassSchedule {
  id: string;
  parish_id: string;
  community_id: string;
  community?: Community;
  day_of_week: 'Domingo' | 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado';
  time: string; // formato "07:00", "19:30"
  type: 'missa' | 'confissao' | 'adoracao' | 'expediente' | 'celebracao_palavra';
  location_name?: string; // compatibilidade retroativa
  description?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Announcement {
  id: string;
  parish_id: string;
  community_id?: string; // opcional: se for null é da paróquia toda, se tiver ID é da CEB
  community?: Community;
  title: string;
  content: string;
  category: 'aviso' | 'noticia' | 'evento' | 'pastoral' | 'festa_padroeiro';
  image_url?: string;
  is_urgent: boolean;
  published_at: string;
  is_active: boolean;
  created_at?: string;
}

export interface Donation {
  id: string;
  parish_id: string;
  donor_name?: string;
  donor_document?: string; // CPF
  amount: number;
  type: 'dizimo' | 'oferta' | 'intencao_missa';
  intention_notes?: string;
  status: 'pending' | 'completed' | 'failed';
  pix_txid: string;
  pix_qr_code: string;
  created_at: string;
}

export interface Clergy {
  id: string;
  parish_id: string;
  name: string;
  role: 'paroco' | 'vigario' | 'diacono' | 'bispo';
  title: string;
  birthday?: string;
  ordination_date?: string;
  bio?: string;
  photo_url?: string;
  office_hours?: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at?: string;
}

export interface Pastoral {
  id: string;
  parish_id: string;
  name: string;
  type: 'pastoral' | 'movimento' | 'equipe' | 'servico';
  coordinator_name?: string;
  contact_phone?: string;
  contact_email?: string;
  meeting_schedule?: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LiturgyBooklet {
  id: string;
  parish_id: string;
  title: string;
  celebration_date: string;
  liturgical_color: 'verde' | 'branco' | 'vermelho' | 'roxo' | 'rosa';
  file_url: string;
  file_size_kb?: number;
  downloads_count: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LiturgicalBooklet {
  id: string;
  parish_id: string;
  title: string;
  celebration_date: string;
  sunday_label: string;
  theme?: string | null;
  pdf_url?: string | null;
  is_active: boolean;
  download_count: number;
  created_at: string;
  updated_at?: string;
}

export interface Gallery {
  id: string;
  parish_id: string;
  community_id?: string | null;
  community?: Community;
  title: string;
  slug?: string;
  description?: string;
  event_date?: string;
  cover_image_url?: string;
  photos_count: number;
  photos: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PastoralMessage {
  id: string;
  parish_id: string;
  author_type: 'paroco' | 'bispo' | 'vigario';
  author_name: string;
  author_title: string;
  author_photo_url?: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  liturgical_season?: string;
  cover_image_url?: string;
  is_featured_home: boolean;
  is_active: boolean;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

export type AppointmentType = 
  | 'confissao' 
  | 'direcao_espiritual' 
  | 'pastoral_escuta' 
  | 'atendimento_padre' 
  | 'bencao' 
  | 'processo_matrimonial';

export type AppointmentStatus = 
  | 'pendente' 
  | 'confirmado' 
  | 'concluido' 
  | 'cancelado' 
  | 'ausente';

export interface PastoralAppointment {
  id: string;
  parish_id: string;
  clergy_id?: string | null;
  clergy?: Clergy | null;
  community_id?: string | null;
  community?: Community | null;
  parishioner_name: string;
  parishioner_phone: string;
  parishioner_email?: string | null;
  community_name?: string | null;
  appointment_type: AppointmentType;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  notes?: string | null;
  internal_notes?: string | null;
  confirmed_at?: string | null;
  confirmed_by?: string | null;
  created_at: string;
  updated_at?: string;
}

export type SacramentType = 
  | 'batismo' 
  | 'eucaristia' 
  | 'crisma' 
  | 'noivos' 
  | 'gestantes' 
  | 'outro';

export type RegistrationStatus = 
  | 'pendente' 
  | 'em_analise' 
  | 'documentacao_pendente' 
  | 'aprovado' 
  | 'concluido' 
  | 'cancelado';

export type ApplicantRole = 
  | 'proprio' 
  | 'mae' 
  | 'pai' 
  | 'responsavel' 
  | 'noivo' 
  | 'noiva' 
  | 'outro';

export interface BaptismDetails {
  father_name?: string;
  mother_name?: string;
  godfather_name?: string;
  godmother_name?: string;
  godparents_church_marriage?: boolean;
  godparents_confirmed?: boolean;
  preparation_course_date?: string;
  celebration_date?: string;
}

export interface CatechesisDetails {
  stage: 'eucaristia_infantil' | 'crisma_jovens' | 'crisma_adultos' | 'catequese_adultos';
  already_baptized: boolean;
  baptism_parish?: string;
  school_grade?: string;
  parent_name?: string;
  parent_phone?: string;
}

export interface MarriagePrepDetails {
  groom_name: string;
  groom_phone: string;
  groom_parish?: string;
  bride_name: string;
  bride_phone: string;
  bride_parish?: string;
  wedding_date?: string;
  wedding_church?: string;
}

export interface PregnantCourseDetails {
  gestational_weeks?: number;
  expected_due_date?: string;
  companion_name?: string;
  first_child?: boolean;
}

export interface SacramentalRegistration {
  id: string;
  parish_id: string;
  community_id?: string | null;
  community?: Community | null;
  sacrament_type: SacramentType;
  status: RegistrationStatus;
  applicant_name: string;
  applicant_phone: string;
  applicant_email?: string | null;
  applicant_role?: ApplicantRole;
  candidate_name?: string | null;
  candidate_birth_date?: string | null;
  preferred_date?: string | null;
  details: Record<string, any>;
  documents_urls?: string[];
  notes?: string | null;
  internal_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface TitheRegistration {
  id: string;
  parish_id: string;
  community_id?: string | null;
  community?: Community | null;
  full_name: string;
  phone: string;
  email?: string | null;
  birth_date?: string | null;
  address?: string | null;
  neighborhood?: string | null;
  preferred_payment_method: 'pix' | 'envelope' | 'transferencia' | 'debito' | 'secretaria';
  preferred_day: number;
  status: 'pendente' | 'cadastrado_theos' | 'ativo' | 'cancelado';
  notes?: string | null;
  theos_code?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface TitheTransparencyItem {
  id: string;
  parish_id: string;
  title: string;
  tag: string;
  highlight?: string | null;
  description: string;
  icon_name?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TitheFaq {
  id: string;
  parish_id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ParishHistoryMilestone {
  id: string;
  parish_id: string;
  year: string;
  year_order: number;
  era: string;
  title: string;
  subtitle?: string | null;
  description: string;
  icon_name?: string | null;
  highlight?: string | null;
  image_url?: string | null;
  image_caption?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ParishPastorSuccession {
  id: string;
  parish_id: string;
  category: 'bishop' | 'pastor';
  order_number: number;
  order_label?: string | null;
  name: string;
  title?: string | null;
  period: string;
  motto?: string | null;
  motto_translation?: string | null;
  summary: string;
  achievements?: string[] | null;
  image_url?: string | null;
  is_current: boolean;
  in_memoriam?: boolean;
  deceased_year?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ParishSacredHeritage {
  id: string;
  parish_id: string;
  title: string;
  category: string;
  description: string;
  theological_meaning: string;
  icon?: string | null;
  image_url?: string | null;
  image_caption?: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type UserRole = 'paroco' | 'vigario' | 'secretaria' | 'pascom' | 'coordenador_ceb';
export type UserStatus = 'pendente' | 'ativo' | 'bloqueado';

export type AllowedCommunityModule = 
  | 'all'
  | 'lp_geral'
  | 'cpc'
  | 'avisos'
  | 'pastorais'
  | 'horarios'
  | 'dizimo'
  | 'galerias';

export interface UserProfile {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  community_id?: string | null;
  status: UserStatus;
  allowed_modules: AllowedCommunityModule[] | string[];
  created_at?: string;
  updated_at?: string;
  community_name?: string | null;
}

export interface CommunityActivityLog {
  id: string;
  community_id: string;
  user_id?: string | null;
  author_name: string;
  author_role: 'paroquia' | 'coordenador';
  action_type: string;
  pastoral_note?: string | null;
  changes_summary?: string | null;
  is_read_by_community: boolean;
  created_at: string;
  community_name?: string | null;
}

export type MassIntentionType = 
  | 'falecimento' 
  | 'setimo_dia' 
  | 'trigesimo_dia' 
  | 'acao_gracas' 
  | 'saude' 
  | 'aniversario_vida' 
  | 'aniversario_matrimonio' 
  | 'outros';

export type MassIntentionStatus = 'pendente' | 'aprovada' | 'rezada' | 'cancelada';

export interface MassIntention {
  id: string;
  parish_id: string;
  community_id?: string | null;
  celebration_date: string; // YYYY-MM-DD
  celebration_time: string; // HH:mm
  intention_type: MassIntentionType;
  intention_for: string;
  offered_by?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  is_anonymous?: boolean;
  protocol_code?: string | null;
  protocol?: string | null;
  notes?: string | null;
  status: MassIntentionStatus;
  created_at: string;
  updated_at?: string;
  community_name?: string;
}

export type CertificateType = 'batismo' | 'crisma' | 'matrimonio' | 'transferencia' | 'outros';

export type CertificateStatus = 
  | 'pendente' 
  | 'em_busca' 
  | 'localizado' 
  | 'emitido' 
  | 'pronto_para_retirada' 
  | 'entregue' 
  | 'nao_localizado';

export interface CertificateRequest {
  id: string;
  parish_id: string;
  certificate_type: CertificateType;
  applicant_name: string;
  applicant_phone: string;
  applicant_email?: string | null;
  applicant_relation: 'proprio' | 'pai_mae' | 'conjuge' | 'responsavel' | 'outro';
  holder_name: string;
  holder_birth_date?: string | null;
  parents_names?: string | null;
  godparents_names?: string | null;
  approximate_year?: number | null;
  community_name?: string | null;
  book_number?: string | null;
  page_number?: string | null;
  entry_number?: string | null;
  purpose?: string | null;
  status: CertificateStatus;
  delivery_preference: 'retirada_presencial' | 'email_digital' | 'whatsapp';
  notes?: string | null;
  internal_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// ==========================================
// 🕊️ Módulo de Grandes Festas & Solenidades
// ==========================================

export type EventType = 
  | 'copadroeira' 
  | 'padroeiro_matriz' 
  | 'liturgico_global' 
  | 'padroeiro_ceb' 
  | 'solenidade_especial';

export type EventStatus = 'rascunho' | 'destaque_ativo' | 'encerrado';

export interface EventScheduleItem {
  time: string;
  title: string;
  location?: string;
  celebrant?: string;
  description?: string;
}

export interface ParishEventDay {
  id: string;
  event_id: string;
  event_date: string; // YYYY-MM-DD
  day_title: string;
  day_subtitle?: string | null;
  liturgical_color?: string;
  celebrant_name?: string | null;
  gesture_of_charity?: string | null;
  responsible_group?: string | null;
  social_attractions?: string | null;
  schedule_items: EventScheduleItem[];
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export type EventColorPreset = 
  | 'mariano' 
  | 'sagrado_coracao' 
  | 'natal' 
  | 'pascoa' 
  | 'pentecostes' 
  | 'sao_jose' 
  | 'custom';

export interface ParishSpecialEvent {
  id: string;
  parish_id: string;
  community_id?: string | null;
  title: string;
  slug: string;
  event_type: EventType;
  theme?: string | null;
  motto?: string | null;
  description?: string | null;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  banner_url?: string | null;
  poster_pdf_url?: string | null;
  is_featured_home: boolean;
  status: EventStatus;
  color_preset?: EventColorPreset;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  created_at?: string;
  updated_at?: string;
  // Joins opcionais
  community_name?: string;
  days?: ParishEventDay[];
}





