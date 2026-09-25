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

export interface Gallery {
  id: string;
  parish_id: string;
  title: string;
  event_date?: string;
  cover_image_url?: string;
  photos_count: number;
  photos: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}
