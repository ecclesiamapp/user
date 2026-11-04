'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Clock } from 'lucide-react';
import { ParishEventDay, ParishSpecialEvent } from '@/types';
import {
  formatDayDisplay,
  getEventTheme,
  calculateEventCountdown,
  EventCountdownState,
} from '@/lib/events';
import { EventDayDetailCard } from './EventDayDetailCard';

interface EventTimelineSectionProps {
  days: ParishEventDay[];
  event?: ParishSpecialEvent;
}

export function EventTimelineSection({ days, event }: EventTimelineSectionProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [countdown, setCountdown] = useState<EventCountdownState | null>(null);
  const eventTheme = getEventTheme(event);

  useEffect(() => {
    if (!event?.start_date) return;

    const update = () => {
      setCountdown(calculateEventCountdown(event.start_date, event.end_date));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [event?.start_date, event?.end_date]);

  const isMarianFeast =
    event?.event_type === 'copadroeira' || event?.color_preset === 'mariano';

  const devotionalQuote = isMarianFeast
    ? '“Ó Maria concebida sem pecado, rogai por nós que recorremos a vós.”'
    : event?.motto
    ? `“${event.motto}”`
    : '“Onde dois ou três estiverem reunidos em meu nome, eu estou ali no meio deles.”';

  if (!days || days.length === 0) {
    return (
      <section
        className="py-12 text-center"
        style={{ backgroundColor: eventTheme.bodyBg, color: eventTheme.bodyTextPrimary }}
      >
        <div
          className="max-w-[800px] mx-auto px-4 p-8 rounded-3xl border shadow-sm"
          style={{
            backgroundColor: eventTheme.cardSubtleBg,
            borderColor: eventTheme.cardBorder,
          }}
        >
          <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: eventTheme.primary }} />
          <h3 className="text-base font-bold" style={{ color: eventTheme.bodyTextPrimary }}>
            Programação dos dias em definição
          </h3>
          <p className="text-xs mt-1" style={{ color: eventTheme.bodyTextSecondary }}>
            A equipe de liturgia e secretaria da Catedral está concluindo a grade horária detalhada.
          </p>
        </div>
      </section>
    );
  }

  const activeDay = days[activeDayIndex] || days[0];

  return (
    <section
      className="relative w-full py-10 sm:py-16 overflow-hidden"
      style={{
        backgroundColor: eventTheme.bodyBg,
        color: eventTheme.bodyTextPrimary,
      }}
    >
      <div className="relative z-10 max-w-[1140px] mx-auto px-4 sm:px-6 space-y-8">
        {/* Faixa Devocional & Contagem Regressiva de Transição sobre o Fundo Branco */}
        {event && (
          <div
            className="rounded-3xl border p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            style={{
              borderColor: eventTheme.cardBorder,
              background: `linear-gradient(135deg, ${eventTheme.cardSubtleBg} 0%, ${eventTheme.cardBg} 55%, ${eventTheme.cardHighlightBg} 100%)`,
              boxShadow: `0 12px 32px -12px ${eventTheme.primary}15`,
            }}
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest" style={{ color: eventTheme.accentOnLight }}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isMarianFeast
                    ? 'Jaculatória & Devoção Mariana'
                    : 'Preparação Espiritual & Comunhão'}
                </span>
              </div>
              <p
                className="font-cinzel text-sm sm:text-lg font-bold leading-snug"
                style={{ color: eventTheme.bodyTextPrimary }}
              >
                {devotionalQuote}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: eventTheme.bodyTextSecondary }}>
                Participe em família do Santo Terço, do Sacramento da Confissão e das Santas Missas de cada dia da nossa programação solene.
              </p>
            </div>

            {countdown && countdown.status !== 'ended' && (
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2.5 shrink-0">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: eventTheme.cardHighlightBg,
                    color: eventTheme.accentOnLight,
                    borderColor: eventTheme.cardHighlightBorder,
                  }}
                >
                  <Clock className="w-3 h-3" />
                  <span>{countdown.label}</span>
                </div>

                <div className="grid grid-cols-4 gap-2 w-full sm:w-auto">
                  {[
                    { value: countdown.days, label: 'Dias', highlight: false },
                    { value: countdown.hours, label: 'Horas', highlight: false },
                    { value: countdown.minutes, label: 'Min', highlight: false },
                    { value: countdown.seconds, label: 'Seg', highlight: true },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      className="rounded-xl px-2.5 py-1.5 text-center min-w-[54px] border"
                      style={
                        unit.highlight
                          ? {
                              backgroundColor: eventTheme.primary,
                              borderColor: eventTheme.primary,
                              color: eventTheme.secondary,
                            }
                          : {
                              backgroundColor: eventTheme.cardBg,
                              borderColor: eventTheme.cardBorder,
                              color: eventTheme.bodyTextPrimary,
                            }
                      }
                    >
                      <span className="block font-cinzel text-base sm:text-lg font-extrabold leading-none">
                        {String(unit.value).padStart(2, '0')}
                      </span>
                      <span
                        className="block text-[9px] font-bold uppercase tracking-wider mt-0.5"
                        style={{
                          color: unit.highlight ? eventTheme.accent : eventTheme.bodyTextMuted,
                        }}
                      >
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cabeçalho da Seção sobre Fundo Branco */}
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: eventTheme.cardSubtleBg,
              color: eventTheme.primary,
              borderColor: eventTheme.cardBorder,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: eventTheme.accentOnLight }} />
            <span>Grade Oficial Dia a Dia</span>
          </div>
          <h2
            className="font-cinzel text-2xl sm:text-3xl font-extrabold"
            style={{ color: eventTheme.bodyTextPrimary }}
          >
            Programação Litúrgica & Comunitária
          </h2>
          <p
            className="text-xs sm:text-sm max-w-xl mx-auto"
            style={{ color: eventTheme.bodyTextSecondary }}
          >
            Toque nos dias abaixo para conferir os horários das Santas Missas, padres celebrantes, gestos de caridade e quermesse.
          </p>
        </div>

        {/* Barra de Abas Horizontais com Swipe Suave (Mobile-First) */}
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
                  className="snap-start px-4 sm:px-5 py-3 rounded-2xl transition-all shrink-0 flex items-center gap-3 border min-h-[54px] cursor-pointer text-left"
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${eventTheme.primary}, ${eventTheme.surfaceElevated})`,
                          borderColor: eventTheme.primary,
                          color: eventTheme.textPrimary,
                          boxShadow: `0 10px 24px -6px ${eventTheme.primary}65`,
                        }
                      : {
                          backgroundColor: eventTheme.cardBg,
                          borderColor: eventTheme.cardBorder,
                          color: eventTheme.bodyTextSecondary,
                        }
                  }
                >
                  <div
                    className="w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 border transition-colors"
                    style={
                      isActive
                        ? {
                            backgroundColor: `${eventTheme.secondary}24`,
                            color: eventTheme.secondary,
                            borderColor: `${eventTheme.secondary}66`,
                          }
                        : {
                            backgroundColor: eventTheme.cardSubtleBg,
                            color: eventTheme.primary,
                            borderColor: eventTheme.cardBorder,
                          }
                    }
                  >
                    <span className="text-[10px] uppercase font-semibold leading-none">
                      {display.weekday}
                    </span>
                    <span className="text-sm font-extrabold leading-none mt-0.5">
                      {display.dayNumber}
                    </span>
                  </div>

                  <div>
                    <span
                      className="text-[11px] font-bold block"
                      style={{ color: isActive ? eventTheme.secondary : eventTheme.accentOnLight }}
                    >
                      {idx + 1}º Dia
                    </span>
                    <span
                      className="text-xs font-bold truncate max-w-[140px] sm:max-w-[200px] block"
                      style={{ color: isActive ? eventTheme.textPrimary : eventTheme.bodyTextPrimary }}
                    >
                      {day.day_title.split('•')[0].trim()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Monumental do Dia Selecionado */}
        <EventDayDetailCard
          activeDay={activeDay}
          activeDayIndex={activeDayIndex}
          totalDays={days.length}
          eventTheme={eventTheme}
        />
      </div>
    </section>
  );
}
