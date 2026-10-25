import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { MarqueeAvisos } from '@/components/layout/MarqueeAvisos';
import { LiturgicalScheduleView } from '@/components/horarios/LiturgicalScheduleView';
import { SpecialEventLiturgicalAlert } from '@/components/horarios/SpecialEventLiturgicalAlert';
import { fallbackSchedules } from '@/lib/schedules';
import { FALLBACK_SPECIAL_EVENTS } from '@/lib/events';
import { MassSchedule, ParishSpecialEvent } from '@/types';

export const metadata: Metadata = {
  title: 'Agenda Litúrgica da Catedral • Diocese de Colatina',
  description:
    'Consulte a programação canônica de Santas Missas, Celebrações da Palavra, Confissões e Adoração ao Santíssimo na Catedral do Sagrado Coração de Jesus em Colatina.',
};

export default async function AgendaLiturgicaPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Buscar Horários Cadastrados
  const { data: dbSchedules } = await supabase
    .from('mass_schedules')
    .select('*, community:communities(*)')
    .eq('is_active', true)
    .order('time');

  // 1.1 Buscar evento/solenidade ativa da Catedral (TASK-48)
  const { data: specialEventsData } = await supabase
    .from('parish_special_events')
    .select('*')
    .eq('status', 'destaque_ativo')
    .order('start_date', { ascending: true })
    .limit(1);

  const activeSpecialEvent: ParishSpecialEvent | undefined =
    specialEventsData && specialEventsData.length > 0
      ? (specialEventsData[0] as ParishSpecialEvent)
      : FALLBACK_SPECIAL_EVENTS[0];

  const allSchedules: MassSchedule[] =
    dbSchedules && dbSchedules.length > 0
      ? (dbSchedules as MassSchedule[])
      : fallbackSchedules;

  // 2. Filtrar estritamente celebrações da Catedral Matriz (CEBs possuem seus próprios murais)
  const cathedralSchedules = allSchedules.filter((s) => {
    const isHeadquarters = s.community?.is_headquarters;
    const isCathedralId =
      s.community_id === 'b1aac446-758d-4595-8724-38ce39b3a27e' ||
      s.community_id === 'c0000000-0000-0000-0000-000000000011';
    const isCathedralName =
      s.location_name?.toLowerCase().includes('catedral') ||
      s.location_name?.toLowerCase().includes('matriz');
    const isMatrizPrefix = s.id.startsWith('sch-matriz');

    return isHeadquarters || isCathedralId || isCathedralName || isMatrizPrefix;
  });

  const finalSchedules =
    cathedralSchedules.length > 0
      ? cathedralSchedules
      : fallbackSchedules.filter((s) => s.id.startsWith('sch-matriz'));

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] flex flex-col justify-between">
      {/* 1. Marquee Litúrgico Fino no Topo */}
      <MarqueeAvisos />

      {/* 2. Top Header Limpo */}
      <header className="sticky top-0 z-30 bg-[var(--dash-surface)]/90 backdrop-blur-md border-b border-[var(--dash-border)]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors py-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
            <span>Voltar ao Portal</span>
          </Link>

          <span className="text-[11px] font-bold text-[#8B1E22] dark:text-[#FFA82A] uppercase tracking-wider bg-[#8B1E22]/10 px-3 py-1 rounded-full border border-[#8B1E22]/20">
            Catedral Matriz
          </span>
        </div>
      </header>

      {/* 3. Conteúdo Principal */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full font-sans flex-1">
        {/* Alerta de Horários Litúrgicos Especiais durante Solenidades (TASK-48) */}
        {activeSpecialEvent && (
          <SpecialEventLiturgicalAlert event={activeSpecialEvent} />
        )}

        <LiturgicalScheduleView initialSchedules={finalSchedules} />
      </main>

      {/* 4. Rodapé Institucional */}
      <footer className="mt-16 bg-[#16181B] text-[#D2CBC1] border-t border-[#C8A463]/30 py-10 px-4 sm:px-6">
        <div className="max-w-[1240px] mx-auto text-center space-y-3">
          <p className="font-cinzel text-sm sm:text-base font-bold text-white uppercase tracking-wider">
            Catedral do Sagrado Coração de Jesus • Diocese de Colatina
          </p>
          <p className="text-xs text-[#7E838B]">
            Praça Frei José, Nº 26 — Centro, Colatina - ES • Telefone: (27) 2102-5010
          </p>
          <p className="text-[11px] text-[#7E838B]/80 font-serif italic">
            "A Eucaristia é a fonte e o ápice de toda a vida cristã."
          </p>
        </div>
      </footer>
    </div>
  );
}
