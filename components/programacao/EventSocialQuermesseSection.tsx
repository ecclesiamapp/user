'use client';

import React from 'react';
import { PartyPopper, Utensils, Heart, Navigation, MapPin } from 'lucide-react';
import { ParishSpecialEvent } from '@/types';

interface EventSocialQuermesseSectionProps {
  event: ParishSpecialEvent;
  mapsUrl?: string;
}

export function EventSocialQuermesseSection({
  event,
  mapsUrl = 'https://maps.google.com/?q=Catedral+do+Sagrado+Cora%C3%A7%C3%A3o+de+Jesus+Colatina',
}: EventSocialQuermesseSectionProps) {
  const locationName = event.community_name || 'Catedral Sagrado Coração de Jesus';

  return (
    <section className="w-full py-12 bg-gradient-to-b from-[var(--dash-bg)] via-[var(--dash-surface)] to-[var(--dash-bg)] border-t border-[var(--dash-border)]">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-[#FFA82A]/30 bg-gradient-to-br from-[#1C1F24] via-[#141619] to-[#0F1012] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          {/* Decoração Sacra de Fundo */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#8B1E22]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFA82A]/20 text-[#FFCC36] border border-[#FFA82A]/30 text-xs font-bold uppercase tracking-wider">
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Convivência & Quermesse Comunitária</span>
              </div>

              <h3 className="font-cinzel text-xl sm:text-3xl font-bold text-white leading-tight">
                Espaço da Fraternidade & Barracas Festivas
              </h3>

              <p className="text-xs sm:text-sm text-[#CFCAC4] leading-relaxed">
                Após as celebrações litúrgicas, toda a comunidade paroquial, famílias e visitantes são convidados a partilhar momentos de alegria cristã na tradicional quermesse. Todas as doações e renda das barracas são revertidas para as obras de caridade e manutenção pastoral da paróquia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10">
                  <Utensils className="w-4 h-4 text-[#FFCC36] shrink-0" />
                  <span>Barracas típicas, pastéis, caldos e doces</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Ambiente familiar, seguro e acolhedor</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-black/40 border border-[#C8A463]/30 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#8B1E22]/25 text-[#FFCC36] flex items-center justify-center mx-auto border border-[#C8A463]/40">
                <MapPin className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A39E98] block">
                  Pátio das Festividades
                </span>
                <span className="text-xs font-bold text-white block mt-0.5">
                  {locationName}
                </span>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Navigation className="w-4 h-4 text-[#FFA82A]" />
                <span>Traçar Rota no GPS</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
