'use client';

import React, { useEffect } from 'react';
import { X, Clock, Calendar, Sparkles, HeartHandshake, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { MassSchedule, Community } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityLiturgyModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community;
  schedules?: MassSchedule[];
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityLiturgyModal({
  isOpen,
  onClose,
  community,
  schedules = [],
  liturgicalTheme,
}: CommunityLiturgyModalProps) {
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

  const sundaySchedules = schedules.filter((s) => s.day_of_week === 'Domingo');
  const weekdaySchedules = schedules.filter((s) => s.day_of_week !== 'Domingo');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#2A1E1A] via-[#1E1614] to-[#15100E] border border-[#C8A463]/40 shadow-2xl shadow-black/80 text-[#FFF3E3] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-liturgy-title"
      >
        {/* Glow de Fundo Sutil */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#FFA82A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Fixo */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B1E22] to-[#5E1417] border border-[#FFA82A]/50 text-[#FFA82A] flex items-center justify-center shadow-lg shrink-0">
              <span className="font-serif text-2xl font-bold">✝</span>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#FFCC36] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Vida Sacramental & Liturgia</span>
              </span>
              <h2 id="modal-liturgy-title" className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
                Celebrações na Comunidade
              </h2>
              <p className="text-xs text-[#EAE3D9]/70">
                {community.name} • Comunhão com a Catedral do Sagrado Coração
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-[#EAE3D9]/70 hover:text-white hover:bg-[var(--dash-surface)]/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Fechar guia litúrgico"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Rolagem Suave */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* Horários Regulares */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-[#FFA82A] flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Horários Regulares das Celebrações</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card Domingo */}
              <div className="p-4 rounded-2xl bg-[#2D211D]/80 border border-[#C8A463]/30 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFA82A] block">
                  Domingos (Dia do Senhor)
                </span>
                <div className="font-mono text-xl font-bold text-white">
                  {sundaySchedules.length > 0
                    ? sundaySchedules.map((s) => s.time).join('  |  ')
                    : '08:00'}
                </div>
                <p className="text-xs text-[#EAE3D9]/80">
                  {sundaySchedules[0]?.type === 'missa' ? 'Santa Missa Dominical' : 'Celebração da Palavra'} com a comunidade paroquial reunida.
                </p>
              </div>

              {/* Card Semana */}
              <div className="p-4 rounded-2xl bg-[#2D211D]/80 border border-[#C8A463]/30 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFA82A] block">
                  Semana (Encontros Comunitários)
                </span>
                <div className="font-mono text-xl font-bold text-white">
                  {weekdaySchedules[0]?.time || '19:30'}
                </div>
                <p className="text-xs text-[#EAE3D9]/80">
                  {weekdaySchedules[0]?.day_of_week || 'Quinta-feira'} • {weekdaySchedules[0]?.type === 'missa' ? 'Santa Missa' : 'Celebração da Palavra'} e oração.
                </p>
              </div>
            </div>
          </div>

          {/* Oração Comunitária */}
          <div className="p-4 rounded-2xl bg-[#241A17]/70 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[#FFCC36] font-serif font-bold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Santo Terço & Oração pelas Famílias</span>
            </div>
            <p className="text-xs text-[#EAE3D9]/80 leading-relaxed">
              Rezamos o Santo Terço de segunda a sexta-feira às 18:30 no templo da comunidade. Toda segunda-feira às 19:30 temos o tradicional Terço dos Homens aberto a toda a família.
            </p>
          </div>

          {/* Guia Pastoral de Sacramentos */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-[#FFA82A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Orientações Sacramentais & Pastorais</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10 space-y-1">
                <span className="font-bold text-white block font-serif">Intenções de Santa Missa</span>
                <p className="text-[#EAE3D9]/70 leading-relaxed">
                  As intenções de 7º dia, ação de graças e sufrágio devem ser apresentadas com 15 minutos de antecedência à equipe de acolhida antes do início da celebração.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10 space-y-1">
                <span className="font-bold text-white block font-serif">Sacramento do Batismo</span>
                <p className="text-[#EAE3D9]/70 leading-relaxed">
                  Preparação para pais e padrinhos agendada bimestralmente. Procure a coordenação do CPC ou a secretaria paroquial para inscrição e documentação.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10 space-y-1">
                <span className="font-bold text-white block font-serif">Confissões & Atendimento</span>
                <p className="text-[#EAE3D9]/70 leading-relaxed">
                  Atendimento confessional com o Pároco Pe. Irineu mediante escala pastoral ou na Catedral de Colatina às quartas e sextas-feiras.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10 space-y-1">
                <span className="font-bold text-white block font-serif">Ministério da Sagrada Comunhão</span>
                <p className="text-[#EAE3D9]/70 leading-relaxed">
                  Atendimento aos enfermos e idosos acamados que desejam receber a Eucaristia em casa. Comunique a coordenação pastoral local.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161210] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#C8A463]">
            <HeartHandshake className="w-4 h-4 text-[#FFA82A]" />
            <span className="italic font-serif">Venha celebrar conosco e fortalecer nossa vida em Cristo.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FFA82A] hover:bg-[#FFB74D] text-[#2D1A16] font-bold text-xs uppercase tracking-wide transition-all min-h-[44px] cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
