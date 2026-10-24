'use client';

import React, { useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Sparkles, ChevronRight, BookOpen } from 'lucide-react';
import { CommunityActivity, Community } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community;
  activities?: CommunityActivity[];
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityCalendarModal({
  isOpen,
  onClose,
  community,
  activities = [],
  liturgicalTheme,
}: CommunityCalendarModalProps) {
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#2A1E1A] via-[#1E1614] to-[#15100E] border border-[#C8A463]/40 shadow-2xl shadow-black/80 text-[#FFF3E3] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-calendar-title"
      >
        {/* Glow de Fundo Sutil */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#FFA82A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Fixo */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C1513] to-[#2B1D19] border border-[#FFA82A]/50 text-[#FFA82A] flex items-center justify-center shadow-lg shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#FFCC36] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Linha do Tempo Pastoral</span>
              </span>
              <h2 id="modal-calendar-title" className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
                Agenda & Atividades Comunitárias
              </h2>
              <p className="text-xs text-[#EAE3D9]/70">
                {community.name} • Encontros, orações e reuniões de pastoral
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-[#EAE3D9]/70 hover:text-white hover:bg-[var(--dash-surface)]/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Fechar calendário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Atividades com Rolagem */}
        <div className="p-5 sm:p-7 space-y-4 overflow-y-auto flex-1">
          {activities.length > 0 ? (
            activities.map((act) => {
              const [diaNum, mesSigla] = (act.date_label || '25 OUT').split(' ');

              return (
                <div
                  key={act.id}
                  className="p-4 rounded-2xl bg-[#2D211D]/80 border border-[#C8A463]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Bloco Data */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1C1513] to-[#2B1D19] border border-[#FFA82A]/40 flex flex-col items-center justify-center shrink-0">
                      <span className="font-serif font-bold text-base text-[#FFCC36] leading-none">
                        {diaNum || '25'}
                      </span>
                      <span className="text-[10px] font-bold text-[#EAE3D9]/70 uppercase tracking-wider mt-0.5 leading-none">
                        {mesSigla || 'OUT'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                          {act.title}
                        </h3>
                        {act.responsible_group && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
                            {act.responsible_group}
                          </span>
                        )}
                      </div>

                      {act.description && (
                        <p className="text-xs text-[#EAE3D9]/80 leading-relaxed">
                          {act.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#FFA82A] pt-1">
                        <span className="inline-flex items-center gap-1 font-mono font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{act.time}</span>
                        </span>
                        {act.day_of_week && (
                          <span className="text-[#EAE3D9]/70">• {act.day_of_week}</span>
                        )}
                        {act.location && (
                          <span className="inline-flex items-center gap-1 text-[#EAE3D9]/70">
                            <MapPin className="w-3 h-3 text-[#FFA82A]" />
                            <span>{act.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-[#EAE3D9]/70">
              Nenhuma atividade agendada para esta semana.
            </div>
          )}

          {/* Dica Pastoral */}
          <div className="p-4 rounded-2xl bg-[#241A17]/70 border border-white/10 flex items-start gap-3 text-xs text-[#EAE3D9]/80">
            <BookOpen className="w-4 h-4 text-[#FFA82A] shrink-0 mt-0.5" />
            <p>
              Deseja participar de uma pastoral ou grupo de oração? Todas as reuniões são abertas e acolhedoras para todos os paroquianos e visitantes.
            </p>
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161210] flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-[#C8A463] italic font-serif">
            {activities.length} encontros registrados
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#FFA82A] hover:bg-[#FFB74D] text-[#2D1A16] font-bold text-xs uppercase tracking-wide transition-all min-h-[44px] cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
