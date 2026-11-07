'use client';

import React from 'react';
import { Calendar, MapPin, Clock, FileCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { ParishMovement, ParishMovementEvent } from '@/types/movements';

interface MovementEventsSectionProps {
  movement: ParishMovement;
  events: ParishMovementEvent[];
  onSelectEventToRegister: (eventId: string) => void;
}

export function MovementEventsSection({
  movement,
  events,
  onSelectEventToRegister,
}: MovementEventsSectionProps) {
  const formatDateRange = (startStr: string, endStr?: string | null) => {
    try {
      const startParts = startStr.split('-');
      const dayStart = startParts[2];
      const monthStart = startParts[1];

      if (!endStr || endStr === startStr) {
        return `${dayStart}/${monthStart}/${startParts[0]}`;
      }

      const endParts = endStr.split('-');
      const dayEnd = endParts[2];
      const monthEnd = endParts[1];

      if (monthStart === monthEnd) {
        return `${dayStart} a ${dayEnd}/${monthStart}/${startParts[0]}`;
      }

      return `${dayStart}/${monthStart} a ${dayEnd}/${monthEnd}/${startParts[0]}`;
    } catch {
      return startStr;
    }
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFCC36]">
              <Calendar className="w-4 h-4" />
              Cronograma Pastoral & Encontros
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6F0]">
              Próximas Etapas e Atividades do {movement.acronym}
            </h2>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/20 text-center space-y-2">
            <p className="text-sm text-[#FAF6F0]/70">
              Nenhuma etapa com inscrições ativas no momento.
            </p>
            <p className="text-xs text-[#FAF6F0]/50">
              Acompanhe os avisos no púlpito da Santa Missa ou entre em contato com a coordenação.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {events.map((ev) => {
              const isOpen = ev.registration_open && ev.status === 'agendado';

              return (
                <div
                  key={ev.id}
                  className="rounded-2xl bg-[#1B1E22] border border-[#C8A463]/25 hover:border-[#C8A463]/40 p-5 sm:p-6 transition-all shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                            <CheckCircle className="w-3 h-3" />
                            Inscrições Abertas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#22262B] border border-white/10 text-[#FAF6F0]/60 text-[11px] font-medium">
                            {ev.status === 'concluido' ? 'Concluído' : 'Programado'}
                          </span>
                        )}
                        <span className="text-xs text-[#FFCC36] font-semibold">
                          {formatDateRange(ev.start_date, ev.end_date)}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#FAF6F0]">
                        {ev.title}
                      </h3>
                    </div>

                    {isOpen && (
                      <button
                        type="button"
                        onClick={() => onSelectEventToRegister(ev.id)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A463] to-[#FFCC36] hover:brightness-110 text-[#2D1A16] font-bold text-xs uppercase tracking-wider transition-all min-h-[44px] shrink-0 shadow-md cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4" />
                        Quero Participar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#FAF6F0]/75 pt-2 border-t border-[#C8A463]/15">
                    {ev.time_info && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#C8A463]" />
                        <span>{ev.time_info}</span>
                      </div>
                    )}
                    {ev.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C8A463]" />
                        <span>{ev.location}</span>
                      </div>
                    )}
                  </div>

                  {ev.notes && (
                    <p className="text-xs text-[#FAF6F0]/70 bg-[#22262B]/50 p-3 rounded-xl border border-white/5 leading-relaxed">
                      {ev.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

