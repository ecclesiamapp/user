'use client';

import React, { useState, useMemo } from 'react';
import {
  Church,
  Clock,
  Calendar as CalendarIcon,
  Search,
  Sparkles,
  HeartHandshake,
  Flame,
  RotateCcw,
  BookOpen,
  ChevronRight,
  MapPin,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui';
import { MassSchedule } from '@/types';
import {
  CelebrationDetailsModal,
  CalendarEventInstance,
} from './CelebrationDetailsModal';
import { LiturgicalMonthlyCalendar } from './LiturgicalMonthlyCalendar';

interface LiturgicalScheduleViewProps {
  initialSchedules: MassSchedule[];
}

const WEEKDAY_NAMES = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const MONTH_NAMES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export function LiturgicalScheduleView({
  initialSchedules,
}: LiturgicalScheduleViewProps) {
  const today = useMemo(() => new Date(), []);
  const todayWeekdayName = WEEKDAY_NAMES[today.getDay()];

  // Estados de Filtro
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Estado do Modal de Celebração
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventInstance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenEvent = (event: CalendarEventInstance) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // 1. Próximos Acontecimentos da Semana (Próximos 7 Dias a partir de Hoje)
  const upcomingWeekEvents = useMemo(() => {
    const list: CalendarEventInstance[] = [];

    for (let offset = 0; offset < 7; offset++) {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      const weekday = WEEKDAY_NAMES[d.getDay()];

      const daySchedules = initialSchedules.filter((s) => {
        if (s.day_of_week !== weekday) return false;
        if (selectedType !== 'all' && s.type !== selectedType) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const desc = s.description?.toLowerCase() || '';
          const t = s.time.toLowerCase();
          if (!desc.includes(q) && !t.includes(q)) return false;
        }
        return true;
      });

      daySchedules.forEach((s) => {
        list.push({
          schedule: s,
          date: d,
          dateFormatted: `${weekday}, ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}. de ${d.getFullYear()}`,
          dateShort: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
        });
      });
    }

    return list.sort((a, b) => {
      const dateDiff = a.date.getTime() - b.date.getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.schedule.time.localeCompare(b.schedule.time);
    });
  }, [initialSchedules, today, selectedType, searchQuery]);

  // 2. Destaques do Topo: Próxima Santa Missa & Próxima Adoração/Confissão
  const nextMassEvent = useMemo(() => {
    return upcomingWeekEvents.find((e) => e.schedule.type === 'missa');
  }, [upcomingWeekEvents]);

  const nextPrayerEvent = useMemo(() => {
    return upcomingWeekEvents.find(
      (e) => e.schedule.type === 'adoracao' || e.schedule.type === 'confissao'
    );
  }, [upcomingWeekEvents]);

  return (
    <div className="space-y-10">
      {/* 1. HERO MONUMENTAL DA CATEDRAL */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#16181B] via-[#2A1215] to-[#16181B] text-white p-6 sm:p-10 border border-[#C8A463]/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--dash-surface)]/10 border border-[#FFCC36]/40 text-xs font-bold text-[#FFCC36] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Casa Mãe da Diocese de Colatina</span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wide leading-tight">
            Agenda Litúrgica da <span className="text-[#FFCC36]">Catedral</span>
          </h1>

          <p className="text-xs sm:text-base text-[#F5EFE7]/90 leading-relaxed max-w-2xl font-serif italic">
            Consulte a programação canônica de Santas Missas, Celebrações da Palavra, Confissões e Adoração ao Santíssimo na Catedral do Sagrado Coração de Jesus.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-[#FFA82A] font-bold">
            <CalendarIcon className="w-4 h-4" />
            <span>Hoje é {todayWeekdayName}, {today.getDate()} de {MONTH_NAMES[today.getMonth()]}.</span>
          </div>
        </div>
      </section>

      {/* 2. OS 2 CARDS DE DESTAQUE: PRÓXIMOS ACONTECIMENTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Próxima Santa Missa */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-[#8B1E22]/50 transition-all flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] text-xs font-bold uppercase tracking-wider">
                <Church className="w-3.5 h-3.5" />
                Próxima Santa Missa
              </span>
              <span className="text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A]">
                {nextMassEvent?.dateShort || 'Catedral'}
              </span>
            </div>

            <div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#8B1E22] dark:text-[#FFA82A] tracking-tight">
                {nextMassEvent ? nextMassEvent.schedule.time : '19:30'}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--dash-text-primary)] mt-1">
                {nextMassEvent?.schedule.description || 'Santa Missa no Altar Principal'}
              </h3>
              <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                {nextMassEvent ? nextMassEvent.dateFormatted : 'Altar Principal da Catedral'}
              </p>
            </div>
          </div>

          {nextMassEvent && (
            <button
              type="button"
              onClick={() => handleOpenEvent(nextMassEvent)}
              className="mt-4 pt-3 border-t border-[var(--dash-border)]/60 text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] hover:underline flex items-center justify-between cursor-pointer min-h-[44px]"
            >
              <span>Ver detalhes & salvar no Google Agenda</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Card 2: Próxima Adoração / Confissão */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                {nextPrayerEvent?.schedule.type === 'adoracao' ? (
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
                )}
                {nextPrayerEvent?.schedule.type === 'adoracao'
                  ? 'Adoração ao Santíssimo'
                  : 'Sacramento da Confissão'}
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                {nextPrayerEvent?.dateShort || 'Catedral'}
              </span>
            </div>

            <div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-amber-700 dark:text-amber-300 tracking-tight">
                {nextPrayerEvent ? nextPrayerEvent.schedule.time : '16:00'}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--dash-text-primary)] mt-1">
                {nextPrayerEvent?.schedule.description || 'Momento de Oração & Perdão'}
              </h3>
              <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                {nextPrayerEvent ? nextPrayerEvent.dateFormatted : 'Capela do Santíssimo / Secretaria'}
              </p>
            </div>
          </div>

          {nextPrayerEvent && (
            <button
              type="button"
              onClick={() => handleOpenEvent(nextPrayerEvent)}
              className="mt-4 pt-3 border-t border-[var(--dash-border)]/60 text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center justify-between cursor-pointer min-h-[44px]"
            >
              <span>Ver orientações & como participar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. BARRA DE FILTROS GLOBAIS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Seletor de Tipo */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'missa', label: '✝️ Missas' },
              { id: 'adoracao', label: '🔥 Adoração' },
              { id: 'confissao', label: '🙏 Confissões' },
              { id: 'celebracao_palavra', label: '📖 Celebração da Palavra' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[44px] cursor-pointer ${
                  selectedType === t.id
                    ? 'bg-[#8B1E22] text-white shadow-xs'
                    : 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Busca por Texto */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar horário ou título..."
              className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-9 pr-3 py-2 text-xs text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] focus:outline-hidden focus:border-[#FFA82A] min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* 4. PRÓXIMOS ACONTECIMENTOS DA SEMANA (LISTA COMPACTA DOS PRÓXIMOS 7 DIAS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8B1E22] dark:text-[#FFA82A]" />
            <h2 className="font-cinzel text-lg sm:text-xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)]">
              Próximos Acontecimentos da Semana
            </h2>
          </div>
          <span className="text-xs text-[var(--dash-text-muted)]">
            {upcomingWeekEvents.length} celebração(ões) nos próximos 7 dias
          </span>
        </div>

        {upcomingWeekEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingWeekEvents.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleOpenEvent(item)}
                className="p-3.5 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-[#FFA82A] hover:bg-[var(--dash-surface-secondary)] transition-all flex items-center justify-between text-left group shadow-xs min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center w-12 shrink-0 py-1 px-1.5 rounded-lg bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
                    <span className="text-[10px] font-bold uppercase text-[#8B1E22] dark:text-[#FFA82A] block leading-tight">
                      {item.schedule.day_of_week.slice(0, 3)}
                    </span>
                    <span className="font-mono text-sm font-black text-[var(--dash-text-primary)] block leading-tight">
                      {item.dateShort}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-black text-[#8B1E22] dark:text-[#FFA82A]">
                        {item.schedule.time}
                      </span>
                      <span className="text-[11px] font-bold text-[var(--dash-text-primary)]">
                        {item.schedule.type === 'missa'
                          ? 'Missa'
                          : item.schedule.type === 'adoracao'
                          ? 'Adoração'
                          : item.schedule.type === 'confissao'
                          ? 'Confissões'
                          : 'Celebração da Palavra'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--dash-text-secondary)] line-clamp-1">
                      {item.schedule.description || 'Catedral Matriz'}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[var(--dash-text-muted)] group-hover:text-[#FFA82A] transition-colors shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--dash-text-muted)] italic py-4 text-center">
            Nenhuma celebração encontrada para os filtros selecionados nesta semana.
          </p>
        )}
      </section>

      {/* 5. CALENDÁRIO MENSAL ESTILO GOOGLE AGENDA */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#8B1E22] dark:text-[#FFA82A]" />
          <h2 className="font-cinzel text-lg sm:text-xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)]">
            Calendário Mensal da Catedral
          </h2>
        </div>

        <LiturgicalMonthlyCalendar
          schedules={initialSchedules}
          selectedType={selectedType}
          searchQuery={searchQuery}
          onSelectEvent={handleOpenEvent}
        />
      </section>

      {/* 6. MODAL DETALHADO DA CELEBRAÇÃO (COM GOOGLE CALENDAR E WHATSAPP) */}
      <CelebrationDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
