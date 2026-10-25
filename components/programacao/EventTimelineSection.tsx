'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  HeartHandshake, 
  PartyPopper, 
  Sparkles,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { ParishEventDay, ParishSpecialEvent } from '@/types';
import { formatDayDisplay, getEventTheme } from '@/lib/events';

interface EventTimelineSectionProps {
  days: ParishEventDay[];
  event?: ParishSpecialEvent;
}

export function EventTimelineSection({ days, event }: EventTimelineSectionProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const eventTheme = getEventTheme(event);

  if (!days || days.length === 0) {
    return (
      <section className="py-12 bg-[var(--dash-bg)] text-center">
        <div className="max-w-[800px] mx-auto px-4 p-8 rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)]">
          <Calendar className="w-10 h-10 text-[var(--dash-text-muted)] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
            Programação dos dias em definição
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-1">
            A equipe de liturgia e secretaria da Catedral está concluindo a grade horária detalhada.
          </p>
        </div>
      </section>
    );
  }

  const activeDay = days[activeDayIndex] || days[0];

  // Helper para cor litúrgica com alto contraste (WCAG AAA em Light e Dark Mode)
  const getLiturgicalBadge = (color?: string) => {
    switch (color) {
      case 'vermelho':
        return {
          label: 'Vermelho Solene',
          dot: 'bg-rose-600 dark:bg-rose-400',
          style: 'bg-rose-100 text-rose-950 border-rose-300/80 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-700/60 shadow-xs'
        };
      case 'verde':
        return {
          label: 'Verde (Tempo Comum)',
          dot: 'bg-emerald-600 dark:bg-emerald-400',
          style: 'bg-emerald-100 text-emerald-950 border-emerald-300/80 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-700/60 shadow-xs'
        };
      case 'roxo':
        return {
          label: 'Roxo (Penitencial)',
          dot: 'bg-purple-600 dark:bg-purple-400',
          style: 'bg-purple-100 text-purple-950 border-purple-300/80 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-700/60 shadow-xs'
        };
      case 'rosa':
        return {
          label: 'Rosa (Alegria)',
          dot: 'bg-pink-600 dark:bg-pink-400',
          style: 'bg-pink-100 text-pink-950 border-pink-300/80 dark:bg-pink-950/60 dark:text-pink-200 dark:border-pink-700/60 shadow-xs'
        };
      case 'branco':
      default:
        return {
          label: 'Branco / Dourado',
          dot: 'bg-amber-600 dark:bg-amber-400',
          style: 'bg-amber-100 text-amber-950 border-amber-300/90 dark:bg-amber-950/60 dark:text-amber-100 dark:border-amber-600/60 shadow-xs'
        };
    }
  };

  const liturgicalBadge = getLiturgicalBadge(activeDay.liturgical_color);

  return (
    <section className="w-full py-10 sm:py-16 bg-[var(--dash-bg)] text-[var(--dash-text-primary)]">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] border border-[#8B1E22]/20 dark:border-[#FFA82A]/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grade Oficial Dia a Dia</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[var(--dash-text-primary)]">
            Programação Litúrgica & Comunitária
          </h2>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-xl mx-auto">
            Toque nos dias abaixo para conferir os horários das Santas Missas, padres celebrantes, gestos de caridade e quermesse.
          </p>
        </div>

        {/* Barra de Abas Horizontais com Swipe Suave (Mobile-First Extremo) */}
        <div className="relative">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none no-scrollbar snap-x">
            {days.map((day, idx) => {
              const display = formatDayDisplay(day.event_date);
              const isActive = activeDayIndex === idx;

              return (
                <button
                  key={day.id || idx}
                  type="button"
                  onClick={() => setActiveDayIndex(idx)}
                  className={`snap-start px-4 sm:px-5 py-3 rounded-2xl transition-all shrink-0 flex items-center gap-3 border min-h-[54px] cursor-pointer text-left ${
                    isActive
                      ? 'text-white border shadow-lg shadow-black/40 ring-2'
                      : 'bg-[var(--dash-surface)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)] border-[var(--dash-border)]'
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${eventTheme.primary}, ${eventTheme.primary}EE)`,
                          borderColor: eventTheme.secondary,
                          boxShadow: `0 8px 24px -4px ${eventTheme.primary}60`,
                        }
                      : undefined
                  }
                >
                  {/* Quadrado com o dia */}
                  <div
                    className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[var(--dash-surface)]/15 text-white border border-white/20'
                        : 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] border border-[var(--dash-border)]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold leading-none">
                      {display.weekday}
                    </span>
                    <span className="text-sm font-extrabold leading-none mt-0.5">
                      {display.dayNumber}
                    </span>
                  </div>

                  <div>
                    <span className={`text-[11px] font-bold block ${isActive ? 'text-amber-200' : 'text-[#FFA82A]'}`}>
                      {idx + 1}º Dia
                    </span>
                    <span className={`text-xs font-bold truncate max-w-[140px] sm:max-w-[200px] block ${isActive ? 'text-white' : 'text-[var(--dash-text-primary)]'}`}>
                      {day.day_title.split('•')[0].trim()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Monumental do Dia Selecionado */}
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-xl overflow-hidden animate-in fade-in duration-300">
          {/* Topo do Card do Dia */}
          <div className="p-5 sm:p-7 border-b border-[var(--dash-border)] bg-gradient-to-r from-[var(--dash-surface)] via-[var(--dash-surface-hover)]/30 to-[var(--dash-surface)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border ${liturgicalBadge.style}`}>
                    <span className={`w-2 h-2 rounded-full ${liturgicalBadge.dot} shrink-0`} />
                    <span>Cor: {liturgicalBadge.label}</span>
                  </span>
                  <span className="text-xs font-semibold text-[var(--dash-text-muted)] font-mono">
                    Dia {activeDayIndex + 1} de {days.length}
                  </span>
                </div>
                <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-[var(--dash-text-primary)] leading-tight">
                  {activeDay.day_title}
                </h3>
                {activeDay.day_subtitle && (
                  <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] italic">
                    {activeDay.day_subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Painel de Celebrante, Pastoral e Gesto de Caridade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
              {/* Celebrante */}
              {activeDay.celebrant_name && (
                <div className="p-3.5 rounded-2xl bg-[var(--dash-surface-secondary)]/60 border border-[var(--dash-border)] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] block">
                      Sacerdote Celebrante
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[var(--dash-text-primary)] block mt-0.5">
                      {activeDay.celebrant_name}
                    </span>
                  </div>
                </div>
              )}

              {/* Pastoral Responsável */}
              {activeDay.responsible_group && (
                <div className="p-3.5 rounded-2xl bg-[var(--dash-surface-secondary)]/60 border border-[var(--dash-border)] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] block">
                      Liturgia & Acolhida
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--dash-text-primary)] block mt-0.5">
                      {activeDay.responsible_group}
                    </span>
                  </div>
                </div>
              )}

              {/* Gesto Concreto de Caridade */}
              {activeDay.gesture_of_charity && (
                <div className="p-3.5 rounded-2xl bg-rose-500/[0.08] border border-rose-500/20 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/15 text-rose-500 shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 block">
                      Gesto Concreto / Caridade
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--dash-text-primary)] block mt-0.5">
                      {activeDay.gesture_of_charity}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grade Horária do Dia */}
          <div className="p-5 sm:p-7 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFA82A]" />
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--dash-text-primary)]">
                Horários das Santas Missas & Celebrações
              </h4>
            </div>

            {activeDay.schedule_items && activeDay.schedule_items.length > 0 ? (
              <div className="space-y-3">
                {activeDay.schedule_items.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/40 hover:bg-[var(--dash-surface-secondary)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div 
                        className="px-3 py-1.5 rounded-xl font-mono text-sm sm:text-base font-extrabold shrink-0 border shadow-xs"
                        style={{
                          backgroundColor: eventTheme.primary,
                          color: eventTheme.accent,
                          borderColor: `${eventTheme.secondary}80`,
                        }}
                      >
                        {item.time}
                      </div>

                      <div className="space-y-0.5">
                        <h5 className="font-bold text-sm sm:text-base text-[var(--dash-text-primary)] group-hover:text-[#FFA82A] transition-colors">
                          {item.title}
                        </h5>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--dash-text-secondary)]">
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                              <span>{item.location}</span>
                            </span>
                          )}

                          {item.celebrant && (
                            <span className="flex items-center gap-1 text-[var(--dash-text-muted)]">
                              <User className="w-3.5 h-3.5 text-[#FFA82A]" />
                              <span>{item.celebrant}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--dash-text-muted)] italic">
                Nenhum horário específico cadastrado para este dia.
              </p>
            )}

            {/* Quermesse e Atrações Sociais do Dia */}
            {activeDay.social_attractions && (
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs sm:text-sm font-bold text-[var(--dash-text-primary)] flex items-center gap-1.5">
                    <span>Quermesse & Atrações Sociais da Noite</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed">
                    {activeDay.social_attractions}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
