'use client';

import React, { useState } from 'react';
import { Clock, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { MassSchedule, Community } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';
import { CommunityLiturgyModal } from './CommunityLiturgyModal';

interface CommunityLiturgyCardProps {
  community: Community;
  schedules?: MassSchedule[];
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityLiturgyCard({ community, schedules = [], liturgicalTheme }: CommunityLiturgyCardProps) {
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Separa missas de domingo e celebrações da semana
  const sundaySchedules = schedules.filter(
    (s) => s.day_of_week === 'Domingo'
  );
  const weekdaySchedules = schedules.filter(
    (s) => s.day_of_week !== 'Domingo'
  );

  return (
    <>
      <div className={`relative h-full flex-1 rounded-3xl bg-gradient-to-b from-[#251B18]/95 via-[#1D1614]/95 to-[#161210]/95 border ${activeTheme.cardBorderClass} p-6 sm:p-7 shadow-xl shadow-black/40 overflow-hidden flex flex-col justify-between transition-colors duration-300`}>
        {/* Badge Numérico no Topo Direito (Acento Litúrgico Cirúrgico) */}
        <div className={`absolute top-0 right-0 w-10 h-10 rounded-bl-2xl rounded-tr-3xl ${activeTheme.numberBadgeClass} flex items-center justify-center font-serif font-bold text-sm shadow-sm transition-all duration-300`}>
          1
        </div>

        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="min-h-[64px] flex flex-col justify-start">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF3E3] tracking-tight">
              Celebrações & Liturgia
            </h2>
            <p className="text-xs text-[#EAE3D9]/70 mt-1 line-clamp-1">
              Santas Missas e Celebrações da Palavra na comunidade • Toque para detalhes
            </p>
          </div>

          {/* Grade de Pílulas de Horários Clicáveis */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto py-1 cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsModalOpen(true);
              }
            }}
            aria-label="Abrir detalhes das celebrações e liturgia da comunidade"
          >
            {/* Bloco Domingo */}
            <div className="rounded-2xl bg-[#2D211D]/80 group-hover:bg-[#382621] border border-[#C8A463]/30 group-hover:border-[#FFA82A]/70 p-3.5 text-center flex flex-col justify-between min-h-[125px] transition-all shadow-xs group-hover:scale-[1.02]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#FFA82A] border-b border-white/10 pb-1">
                Domingo
              </span>
              <div className="flex items-center justify-center gap-2 font-mono font-bold text-base sm:text-lg text-white my-auto">
                {sundaySchedules.length > 0 ? (
                  sundaySchedules.slice(0, 2).map((s, idx) => (
                    <React.Fragment key={s.id}>
                      {idx > 0 && <span className="text-[#FFA82A]/60">|</span>}
                      <span>{s.time}</span>
                    </React.Fragment>
                  ))
                ) : (
                  <span>08:00</span>
                )}
              </div>
              <span className="block text-[10px] text-[#EAE3D9]/60">
                {sundaySchedules[0]?.type === 'missa' ? 'Santa Missa' : 'Celebração da Palavra'}
              </span>
            </div>

            {/* Bloco Semana / Quinta */}
            <div className="rounded-2xl bg-[#2D211D]/80 group-hover:bg-[#382621] border border-[#C8A463]/30 group-hover:border-[#FFA82A]/70 p-3.5 text-center flex flex-col justify-between min-h-[125px] transition-all shadow-xs group-hover:scale-[1.02]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#FFA82A] border-b border-white/10 pb-1">
                {weekdaySchedules[0]?.day_of_week || 'Semana'}
              </span>
              <div className="font-mono font-bold text-base sm:text-lg text-white my-auto">
                {weekdaySchedules[0]?.time || '19:30'}
              </div>
              <span className="block text-[10px] text-[#EAE3D9]/60">
                {weekdaySchedules[0]?.type === 'missa' ? 'Santa Missa' : 'Celebração'}
              </span>
            </div>

            {/* Bloco Terço / Oração */}
            <div className="rounded-2xl bg-[#2D211D]/80 group-hover:bg-[#382621] border border-[#C8A463]/30 group-hover:border-[#FFA82A]/70 p-3.5 text-center flex flex-col justify-between min-h-[125px] transition-all shadow-xs group-hover:scale-[1.02]">
              <div className="flex items-center justify-center text-[#FFA82A] pt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="font-serif font-bold text-sm text-white my-auto">
                Santo Terço
              </div>
              <span className="block text-[10px] text-[#EAE3D9]/60">
                Segunda a Sexta
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé do Card Limpo (Sem botão WhatsApp - TASK-41B) */}
        <div className="pt-5 mt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 min-h-[46px]">
          <div className="flex items-center gap-2 text-xs text-[#C8A463]">
            <span className="text-[#FFA82A]">✝</span>
            <span className="font-serif italic text-[11px]">Celebrações em comunhão com a Catedral</span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFA82A] hover:bg-[#FFB74D] text-[#2D1A16] font-bold text-xs uppercase tracking-wide transition-all shadow-md min-h-[44px] cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guia Litúrgico Completo</span>
          </button>
        </div>
      </div>

      {/* Modal Litúrgico Solene */}
      <CommunityLiturgyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        community={community}
        schedules={schedules}
        liturgicalTheme={activeTheme}
      />
    </>
  );
}
