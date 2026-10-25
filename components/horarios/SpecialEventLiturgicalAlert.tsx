'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Sparkles, MapPin, AlertCircle } from 'lucide-react';
import { ParishSpecialEvent } from '@/types';
import { getEventTheme, formatEventDateRange } from '@/lib/events';

interface SpecialEventLiturgicalAlertProps {
  event: ParishSpecialEvent;
}

export function SpecialEventLiturgicalAlert({ event }: SpecialEventLiturgicalAlertProps) {
  const theme = getEventTheme(event);
  const dates = formatEventDateRange(event.start_date, event.end_date);

  return (
    <aside 
      aria-label="Aviso de Horários Litúrgicos Especiais"
      className="mb-8 rounded-2xl border p-4 sm:p-5 shadow-md transition-all duration-200"
      style={{
        borderColor: `${theme.secondary}40`,
        background: `linear-gradient(135deg, ${theme.primary}15 0%, rgba(26, 29, 36, 0.95) 100%)`,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Lado Esquerdo: Ícone + Textos do Alerta */}
        <div className="flex items-start gap-3.5">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 shadow-sm"
            style={{
              backgroundColor: `${theme.primary}40`,
              borderColor: `${theme.secondary}60`,
              color: theme.secondary
            }}
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span 
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${theme.primary}30`,
                  color: theme.accent === '#FFFFFF' ? '#F8FAFC' : theme.accent,
                  borderColor: `${theme.secondary}50`
                }}
              >
                Aviso Litúrgico Especial
              </span>

              <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-400" />
                {dates}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Horários Extraordinários em Vigor: <span style={{ color: theme.secondary }}>{event.title}</span>
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Durante o período festivo, as celebrações eucarísticas, tríduos e procissões na Catedral Matriz seguem uma grade de horários especial.
            </p>
          </div>
        </div>

        {/* Lado Direito: Ação Direta CTA */}
        <div className="shrink-0 flex items-center">
          <Link
            href={`/programacao/${event.slug}`}
            className="w-full md:w-auto min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-950 flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            style={{
              backgroundColor: theme.secondary,
            }}
          >
            <span>Ver Grade da Festa</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
