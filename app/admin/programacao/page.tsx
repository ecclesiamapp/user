import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { ParishSpecialEvent, ParishEventDay, Community } from '@/types';
import { ProgramacaoAdminClient } from '@/components/admin/programacao/ProgramacaoAdminClient';

export const metadata = {
  title: 'Festas & Solenidades • Painel Administrativo',
  description: 'Gerencie programações litúrgicas especiais, Tríduo Pascal, Padroeiros e solenidades.',
};

export default async function AdminProgramacaoPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Obter paróquia ativa
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
  };

  // 2. Obter as 12 Comunidades (CEBs)
  let communities: Community[] = [];
  try {
    const { data: commsData } = await supabase
      .from('communities')
      .select('*')
      .eq('parish_id', parish.id)
      .order('name', { ascending: true });

    if (commsData) {
      communities = commsData as Community[];
    }
  } catch (err) {
    console.warn('Aviso ao carregar comunidades:', err);
  }

  // 3. Obter as Festas e Solenidades cadastradas
  let events: ParishSpecialEvent[] = [];
  try {
    const { data: eventsData, error: eventsError } = await supabase
      .from('parish_special_events')
      .select('*')
      .eq('parish_id', parish.id)
      .order('start_date', { ascending: false });

    if (!eventsError && eventsData) {
      // Buscar todos os dias para enriquecer a contagem de dias
      const eventIds = eventsData.map((e) => e.id);
      let allDays: ParishEventDay[] = [];

      if (eventIds.length > 0) {
        const { data: daysData } = await supabase
          .from('parish_event_days')
          .select('*')
          .in('event_id', eventIds)
          .order('order_index', { ascending: true })
          .order('event_date', { ascending: true });

        if (daysData) {
          allDays = daysData as ParishEventDay[];
        }
      }

      events = eventsData.map((ev) => {
        const comm = communities.find((c) => c.id === ev.community_id);
        const eventDays = allDays.filter((d) => d.event_id === ev.id);
        return {
          ...ev,
          community_name: comm ? comm.name : 'Catedral Sagrado Coração de Jesus (Sede)',
          days: eventDays,
        };
      });
    }
  } catch (err) {
    console.error('Erro ao carregar festividades:', err);
  }

  return (
    <ProgramacaoAdminClient
      initialEvents={events}
      communities={communities}
      parishId={parish.id}
    />
  );
}
