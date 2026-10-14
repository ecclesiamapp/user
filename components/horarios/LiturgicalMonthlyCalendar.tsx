'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Church,
  Flame,
  HeartHandshake,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui';
import { MassSchedule } from '@/types';
import { CalendarEventInstance } from './CelebrationDetailsModal';

interface LiturgicalMonthlyCalendarProps {
  schedules: MassSchedule[];
  selectedType: string;
  searchQuery: string;
  onSelectEvent: (event: CalendarEventInstance) => void;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAY_NAMES_FULL = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const WEEKDAY_NAMES_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function LiturgicalMonthlyCalendar({
  schedules,
  selectedType,
  searchQuery,
  onSelectEvent,
}: LiturgicalMonthlyCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [selectedMobileDay, setSelectedMobileDay] = useState<number>(today.getDate());

  // Navegação de Mês
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedMobileDay(today.getDate());
  };

  // Cálculo da Grade Mensal
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      dayNumber: number;
      isCurrentMonth: boolean;
      date: Date;
      events: CalendarEventInstance[];
    }[] = [];

    // Dias do mês anterior para preencher a primeira semana
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const d = new Date(currentYear, currentMonth - 1, dayNum);
      days.push({
        dayNumber: dayNum,
        isCurrentMonth: false,
        date: d,
        events: [],
      });
    }

    // Dias do mês corrente
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const d = new Date(currentYear, currentMonth, dayNum);
      const weekdayName = WEEKDAY_NAMES_FULL[d.getDay()];

      // Localiza as celebrações deste dia da semana
      const dayEvents: CalendarEventInstance[] = schedules
        .filter((s) => {
          if (s.day_of_week !== weekdayName) return false;
          if (selectedType !== 'all' && s.type !== selectedType) return false;
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const desc = s.description?.toLowerCase() || '';
            const t = s.time.toLowerCase();
            if (!desc.includes(q) && !t.includes(q)) return false;
          }
          return true;
        })
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((s) => ({
          schedule: s,
          date: d,
          dateFormatted: `${weekdayName}, ${dayNum} de ${MONTH_NAMES[currentMonth]} de ${currentYear}`,
          dateShort: `${String(dayNum).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`,
        }));

      days.push({
        dayNumber: dayNum,
        isCurrentMonth: true,
        date: d,
        events: dayEvents,
      });
    }

    // Dias do próximo mês para fechar a última linha
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        date: d,
        events: [],
      });
    }

    return days;
  }, [currentYear, currentMonth, schedules, selectedType, searchQuery]);

  // Celebrações do dia mobile selecionado
  const selectedDayData = useMemo(() => {
    return calendarDays.find(
      (d) => d.isCurrentMonth && d.dayNumber === selectedMobileDay
    );
  }, [calendarDays, selectedMobileDay]);

  // Estilos de badge por tipo
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'missa':
        return 'bg-[#8B1E22] text-white hover:bg-[#6E161A]';
      case 'adoracao':
        return 'bg-amber-600 text-white hover:bg-amber-700';
      case 'confissao':
        return 'bg-purple-700 text-white hover:bg-purple-800';
      case 'celebracao_palavra':
        return 'bg-sky-700 text-white hover:bg-sky-800';
      default:
        return 'bg-emerald-700 text-white';
    }
  };

  return (
    <div className="bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] shadow-md overflow-hidden space-y-4 p-4 sm:p-6">
      {/* 1. BARRA DE NAVEGAÇÃO DO MÊS (Estilo Google Agenda) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--dash-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--dash-text-muted)] tracking-wider block">
              Calendário Mensal da Catedral
            </span>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--dash-text-primary)]">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
          </div>
        </div>

        {/* Controles de Navegação */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleJumpToToday}
            className="px-3.5 py-1.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-border)] text-xs font-bold text-[var(--dash-text-primary)] transition-all min-h-[44px] cursor-pointer"
          >
            Hoje
          </button>

          <div className="flex items-center rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface)] transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface)] transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CABEÇALHO DOS DIAS DA SEMANA */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] py-2 border-b border-[var(--dash-border)]/60">
        {WEEKDAY_NAMES_SHORT.map((w, idx) => (
          <span
            key={w}
            className={idx === 0 ? 'text-[#8B1E22] dark:text-[#FFA82A]' : ''}
          >
            {w}
          </span>
        ))}
      </div>

      {/* 3. GRADE DO CALENDÁRIO MENSAL */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((dayItem, index) => {
          const isToday =
            dayItem.isCurrentMonth &&
            dayItem.dayNumber === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          const isSelectedMobile =
            dayItem.isCurrentMonth && dayItem.dayNumber === selectedMobileDay;

          const hasEvents = dayItem.events.length > 0;

          return (
            <div
              key={`day-${index}`}
              onClick={() => {
                if (dayItem.isCurrentMonth) {
                  setSelectedMobileDay(dayItem.dayNumber);
                }
              }}
              className={`min-h-[64px] sm:min-h-[96px] p-1 sm:p-2 rounded-xl border transition-all flex flex-col justify-between ${
                !dayItem.isCurrentMonth
                  ? 'opacity-30 border-transparent bg-transparent pointer-events-none'
                  : isToday
                  ? 'border-[#FFA82A] bg-[#FFA82A]/5 shadow-xs font-bold'
                  : isSelectedMobile
                  ? 'border-[#8B1E22] bg-[var(--dash-surface-secondary)]'
                  : 'border-[var(--dash-border)]/60 bg-[var(--dash-surface)] hover:border-[var(--dash-border)] hover:bg-[var(--dash-surface-secondary)]/50 cursor-pointer'
              }`}
            >
              {/* Número do Dia */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs sm:text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                    isToday
                      ? 'bg-[#8B1E22] text-white font-black'
                      : isSelectedMobile
                      ? 'bg-[var(--dash-border)] text-[var(--dash-text-primary)]'
                      : 'text-[var(--dash-text-primary)]'
                  }`}
                >
                  {dayItem.dayNumber}
                </span>

                {/* Marcadores coloridos compactos para Mobile */}
                {hasEvents && (
                  <div className="flex sm:hidden items-center gap-0.5">
                    {dayItem.events.slice(0, 3).map((ev, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          ev.schedule.type === 'missa'
                            ? 'bg-[#8B1E22]'
                            : ev.schedule.type === 'adoracao'
                            ? 'bg-amber-500'
                            : 'bg-purple-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Tags de Eventos para Desktop (Estilo Google Calendar) */}
              <div className="hidden sm:flex flex-col gap-1 mt-1">
                {dayItem.events.slice(0, 2).map((ev, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(ev);
                    }}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold text-left truncate transition-transform hover:scale-[1.02] shadow-2xs ${getTypeBadge(
                      ev.schedule.type
                    )}`}
                    title={`${ev.schedule.time} - ${ev.schedule.description || ev.schedule.type}`}
                  >
                    <span>{ev.schedule.time}</span>{' '}
                    <span className="font-normal opacity-90 truncate">
                      {ev.schedule.type === 'missa'
                        ? 'Missa'
                        : ev.schedule.type === 'adoracao'
                        ? 'Adoração'
                        : ev.schedule.type === 'confissao'
                        ? 'Confissões'
                        : 'Celebração da Palavra'}
                    </span>
                  </button>
                ))}

                {dayItem.events.length > 2 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(dayItem.events[2]);
                    }}
                    className="text-[10px] font-bold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] text-left px-1"
                  >
                    +{dayItem.events.length - 2} mais...
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. EXPANSÃO DETALHADA DO DIA TOCADO NO MOBILE */}
      <div className="sm:hidden pt-3 border-t border-[var(--dash-border)] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--dash-text-primary)]">
            Celebrações de {selectedMobileDay} de {MONTH_NAMES[currentMonth]}:
          </span>
          <span className="text-[11px] text-[var(--dash-text-muted)]">
            {selectedDayData?.events.length || 0} programada(s)
          </span>
        </div>

        {selectedDayData && selectedDayData.events.length > 0 ? (
          <div className="space-y-2">
            {selectedDayData.events.map((ev, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectEvent(ev)}
                className="w-full p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex items-center justify-between text-left hover:border-[#FFA82A] transition-all min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-base font-black text-[#8B1E22] dark:text-[#FFA82A]">
                    {ev.schedule.time}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-[var(--dash-text-primary)] block">
                      {ev.schedule.type === 'missa'
                        ? 'Santa Missa'
                        : ev.schedule.type === 'adoracao'
                        ? 'Adoração ao Santíssimo'
                        : ev.schedule.type === 'confissao'
                        ? 'Confissões'
                        : 'Celebração da Palavra'}
                    </span>
                    <span className="text-[11px] text-[var(--dash-text-secondary)] line-clamp-1">
                      {ev.schedule.description || 'Catedral do Sagrado Coração'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] shrink-0">
                  Ver Detalhes →
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--dash-text-muted)] italic py-2 text-center">
            Nenhuma celebração pública programada para este dia.
          </p>
        )}
      </div>
    </div>
  );
}
