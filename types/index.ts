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
  contact_name?: string; // Coordenador da comunidade
  contact_phone?: string;
  is_active: boolean;
  slug?: string;
  history?: string;
  foundation_year?: string;
  feast_day?: string;
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
