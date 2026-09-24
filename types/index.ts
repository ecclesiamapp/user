/**
 * Entidades e Tipos Centrais do Ecclesiam App
 * Definidos de acordo com o SSOT em [documentation]/MANIFESTO_ECCLESIAM.md
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
}

export interface MassSchedule {
  id: string;
  parish_id: string;
  day_of_week: 'Domingo' | 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado';
  time: string; // formato "07:00", "19:30"
  type: 'missa' | 'confissao' | 'adoracao' | 'expediente';
  location_name: string; // ex: "Igreja Matriz", "Comunidade São José"
  description?: string;
  is_active: boolean;
}

export interface Announcement {
  id: string;
  parish_id: string;
  title: string;
  content: string;
  category: 'aviso' | 'noticia' | 'evento' | 'pastoral';
  image_url?: string;
  is_urgent: boolean;
  published_at: string;
  is_active: boolean;
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
