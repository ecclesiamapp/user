'use client';

import React, { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { ParishEventDay, ParishSpecialEvent } from '@/types';
import { formatDayDisplay, getEventTheme } from '@/lib/events';
import { EventDayDetailCard } from './EventDayDetailCard';

interface EventTimelineSectionProps {
  days: ParishEventDay[];
  event?: ParishSpecialEvent;
}

export function EventTimelineSection({ days, event }: EventTimelineSectionProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const eventTheme = getEventTheme(event);

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
