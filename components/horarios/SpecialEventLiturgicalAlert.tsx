'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { ParishSpecialEvent } from '@/types';
import { getEventTheme, formatEventDateRange } from '@/lib/events';

interface SpecialEventLiturgicalAlertProps {
  event: ParishSpecialEvent;
}

export function SpecialEventLiturgicalAlert({ event }: SpecialEventLiturgicalAlertProps) {
  const theme = getEventTheme(event);
  const dates = formatEventDateRange(event.start_date, event.end_date);

  const primaryColor = theme.primary || '#1E3A8A';
  const secondaryColor = theme.secondary || '#38BDF8';

  return (
    <aside 
      aria-label="Aviso de Horários Litúrgicos Especiais"
      className="mb-8 rounded-2xl border-2 p-4 sm:p-5 shadow-xl transition-all duration-200 overflow-hidden relative"
      style={{
        borderColor: `${secondaryColor}80`,
        backgroundColor: '#121418',
        backgroundImage: `linear-gradient(135deg, ${primaryColor}55 0%, #161822 55%, #0F1117 100%)`,
        boxShadow: `0 12px 28px -6px ${primaryColor}30, 0 8px 12px -6px rgba(0, 0, 0, 0.5)`,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        {/* Lado Esquerdo: Ícone + Textos do Alerta */}
        <div className="flex items-start gap-3.5">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 shadow-md"
            style={{
              backgroundColor: `${primaryColor}70`,
              borderColor: `${secondaryColor}90`,
              color: secondaryColor
            }}
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1.5 min-w-0">
            {/* Linha de Badges: Aviso + Data */}
            <div className="flex flex-wrap items-center gap-2">
              <span 
                className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs"
                style={{
                  backgroundColor: `${primaryColor}95`,
                  color: '#FFFFFF',
                  borderColor: `${secondaryColor}90`
                }}
              >
                Aviso Litúrgico Especial
              </span>

              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40 shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{dates}</span>
              </span>
            </div>

            {/* Título com Alto Contraste */}
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-wide leading-snug">
              Horários Extraordinários em Vigor:{' '}
              <span 
                style={{ color: secondaryColor }} 
                className="font-extrabold underline decoration-white/30 underline-offset-4"
              >
                {event.title}
              </span>
            </h3>

            {/* Descrição em Slate-100 para Legibilidade Perfeita */}
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal max-w-3xl">
              Durante o período festivo, as celebrações eucarísticas, tríduos e procissões na Catedral Diocesana seguem uma grade de horários especial.
            </p>
          </div>
        </div>

        {/* Lado Direito: Ação Direta CTA */}
        <div className="shrink-0 flex items-center">
          <Link
            href={`/programacao/${event.slug}`}
            className="w-full md:w-auto min-h-[44px] px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-950 flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            style={{
              backgroundColor: secondaryColor,
              boxShadow: `0 4px 16px 0 ${secondaryColor}60`
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
