import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { HistoryAdminClient } from '@/components/admin/historia/HistoryAdminClient';
import { 
  Parish, 
  ParishHistoryMilestone, 
  ParishPastorSuccession, 
  ParishSacredHeritage 
} from '@/types';
import { 
  CATHEDRAL_HISTORICAL_MILESTONES, 
  BISHOPS_SUCCESSION, 
  PARISH_PRIESTS_SUCCESSION, 
  SACRED_HERITAGE_ITEMS,
  PastorSuccession
} from '@/lib/history';

export const metadata = {
  title: 'História & Memória • Painel Administrativo',
};

// Fallback de Marcos Históricos (gerado a partir de lib/history.ts)
const fallbackMilestones: ParishHistoryMilestone[] = CATHEDRAL_HISTORICAL_MILESTONES.map((m, idx) => ({
  id: m.id,
  parish_id: 'c0000000-0000-0000-0000-000000000001',
  year: m.year,
  year_order: parseInt(m.year, 10) || idx,
  era: m.era,
  title: m.title,
  subtitle: m.subtitle,
  description: m.description,
  icon_name: m.iconName,
  highlight: m.highlight || null,
  image_url: m.imageUrl || null,
  image_caption: m.imageCaption || null,
  is_active: true,
  created_at: new Date().toISOString(),
}));

// Fallback de Pastores & Bispos (gerado a partir de lib/history.ts)
const fallbackPastors: ParishPastorSuccession[] = [
  ...BISHOPS_SUCCESSION.map((b) => ({
    id: b.id,
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    category: 'bishop' as const,
    order_number: b.orderNumber,
    order_label: b.orderLabel,
    name: b.name,
    title: b.title,
    period: b.period,
    motto: b.motto,
    motto_translation: b.mottoTranslation,
    summary: b.summary,
    achievements: b.achievements,
    image_url: null,
    is_current: !!b.isCurrent,
    is_active: true,
    created_at: new Date().toISOString(),
  })),
  ...PARISH_PRIESTS_SUCCESSION.map((p: PastorSuccession, idx: number) => ({
    id: p.id,
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    category: 'pastor' as const,
    order_number: idx + 1,
    order_label: p.role,
    name: p.name,
    title: p.role,
    period: p.period,
    motto: null,
    motto_translation: null,
    summary: p.description,
    achievements: [],
    image_url: null,
    is_current: !!p.isCurrent,
    is_active: true,
    created_at: new Date().toISOString(),
  })),
];

// Fallback de Patrimônio Sacro (gerado a partir de lib/history.ts)
const fallbackHeritage: ParishSacredHeritage[] = SACRED_HERITAGE_ITEMS.map((h, idx) => ({
  id: h.id,
  parish_id: 'c0000000-0000-0000-0000-000000000001',
  title: h.title,
  category: h.category,
  description: h.description,
  theological_meaning: h.theologicalMeaning,
  icon: h.icon,
  image_url: h.imageUrl || null,
  image_caption: h.imageCaption || null,
  order_index: idx + 1,
  is_active: true,
  created_at: new Date().toISOString(),
}));

export default async function HistoriaAdminPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Obter paróquia ativa
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça da Catedral, s/n - Centro, Colatina/ES',
    whatsapp_number: '552737221234',
    pix_key: 'secretaria@catedraldecolatina.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  // 2. Buscar Marcos da Linha do Tempo
  let milestones: ParishHistoryMilestone[] = fallbackMilestones;
  try {
    const { data, error } = await supabase
      .from('parish_history_milestones')
      .select('*')
      .eq('parish_id', parish.id)
      .order('year_order', { ascending: true });

    if (!error && data && data.length > 0) {
      milestones = data as ParishHistoryMilestone[];
    }
  } catch (err) {
    console.warn('Usando fallback para marcos históricos:', err);
  }

  // 3. Buscar Sucessão Pastoral
  let pastors: ParishPastorSuccession[] = fallbackPastors;
  try {
    const { data, error } = await supabase
      .from('parish_pastors_succession')
      .select('*')
      .eq('parish_id', parish.id)
      .order('order_number', { ascending: true });

    if (!error && data && data.length > 0) {
      pastors = data as ParishPastorSuccession[];
    }
  } catch (err) {
    console.warn('Usando fallback para sucessão de pastores:', err);
  }

  // 4. Buscar Patrimônio Sacro
  let heritage: ParishSacredHeritage[] = fallbackHeritage;
  try {
    const { data, error } = await supabase
      .from('parish_sacred_heritage')
      .select('*')
      .eq('parish_id', parish.id)
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      heritage = data as ParishSacredHeritage[];
    }
  } catch (err) {
    console.warn('Usando fallback para patrimônio sacro:', err);
  }

  return (
    <HistoryAdminClient
      parish={parish}
      milestones={milestones}
      pastors={pastors}
      heritage={heritage}
    />
  );
}
