import React from 'react';
import { Church, Sparkles, Clock, Calendar, Navigation, ExternalLink, MessageCircle, MapPin } from 'lucide-react';
import { Community, MassSchedule } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityHeroProps {
  community: Community;
  schedules?: MassSchedule[];
  googleMapsUrl?: string;
  wazeUrl?: string;
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityHero({
  community,
  schedules = [],
  googleMapsUrl,
  wazeUrl,
  liturgicalTheme,
}: CommunityHeroProps) {
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');

  // 1. Detectar ou selecionar a próxima celebração inteligente
  const nextSchedule = schedules.length > 0 ? schedules[0] : null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EDE6D9] via-[#F6F2EB] to-[#F6F2EB] text-[#2D1A16] py-14 sm:py-20 border-b border-[#DDD3C4]">
      {/* Imagem de Fundo com Tratamento Nobre e Iluminação Suave */}
      <img
        src={community.banner_url || community.image_url || '/images/historia/catedral-vitrais.jpg'}
        alt={community.name}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-15 mix-blend-multiply pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#F6F2EB] pointer-events-none" />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Lado Esquerdo: Identidade da Comunidade e Boas-Vindas */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1E22] border border-[#FFA82A]/40 text-[#FFCC36] text-xs font-bold uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{community.is_headquarters ? 'Igreja Matriz • Catedral' : 'Comunidade Eclesial de Base'}</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold tracking-wide shadow-xs ${activeTheme.heroPillClass}`}>
                <span className={`w-2 h-2 rounded-full ${activeTheme.dotClass}`} />
                <span>{activeTheme.colorLabel.split('(')[0].trim()}</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight uppercase text-[#2D1A16] leading-tight">
              {community.name}
            </h1>

            {community.patron_saint && (
              <p className="text-sm sm:text-base text-[#5A483E] max-w-xl leading-relaxed">
                Padroeiro(a): <strong className="text-[#8B1E22] font-semibold">{community.patron_saint}</strong>
                {community.feast_day && ` • Solenidade: ${community.feast_day}`}
              </p>
            )}

            {/* Chips Informativos */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="px-3 py-1 rounded-xl bg-[var(--dash-surface)]/90 border border-[#DDD3C4] text-xs font-semibold text-[#8B1E22] shadow-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{community.neighborhood || community.city}</span>
              </span>
              {community.foundation_year && (
                <span className="px-3 py-1 rounded-xl bg-[var(--dash-surface)]/90 border border-[#DDD3C4] text-xs font-semibold text-[#8B1E22] shadow-xs flex items-center gap-1.5">
                  <Church className="w-3.5 h-3.5" />
                  <span>Fundada em {community.foundation_year}</span>
                </span>
              )}
              <span className="px-3 py-1 rounded-xl bg-[var(--dash-surface)]/90 border border-[#DDD3C4] text-xs font-semibold text-[#8B1E22] shadow-xs">
                Diocese de Colatina
              </span>
            </div>

            {/* Botões de Navegação GPS */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B1E22] hover:bg-[#6E171B] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md min-h-[44px]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Traçar Rota no Google Maps</span>
                </a>
              )}
              {wazeUrl && (
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--dash-surface)] hover:bg-gray-50 border border-[#DDD3C4] text-[#2D1A16] font-semibold text-xs transition-all shadow-md min-h-[44px]"
                >
                  <ExternalLink className="w-4 h-4 text-[#8B1E22]" />
                  <span>Navegar com Waze</span>
                </a>
              )}
            </div>
          </div>

          {/* Lado Direito: Card Flutuante Inteligente da Próxima Celebração */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#2A1D1A]/90 to-[#1C1614]/95 border-2 border-[#FFA82A]/40 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-24 h-24 bg-[#FFA82A]/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFA82A] uppercase tracking-wider">
                  <span className={`w-2.5 h-2.5 rounded-full ${activeTheme.dotClass} animate-pulse`} />
                  <span>Próxima Celebração</span>
                </div>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#8B1E22]/60 text-[#FFCC36] border border-[#FFA82A]/30">
                  {nextSchedule?.type === 'missa' ? 'Santa Missa' : 'Celebração da Palavra'}
                </span>
              </div>

              {nextSchedule ? (
                <div className="space-y-1">
                  <p className="text-3xl font-serif font-bold text-white tracking-tight">
                    {nextSchedule.day_of_week}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-[#FFA82A]">
                      {nextSchedule.time}
                    </span>
                    <span className="text-xs text-[#EAE3D9]/80 font-medium">
                      {nextSchedule.type === 'missa' ? 'Santa Missa' : 'Celebração da Palavra'}
                    </span>
                  </div>
                  {nextSchedule.description && (
                    <p className="text-xs text-[#EAE3D9]/70 pt-1">
                      {nextSchedule.description}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5 py-1">
                  <p className="text-xl font-serif font-bold text-white">
                    Domingos às 08:00
                  </p>
                  <p className="text-xs text-[#EAE3D9]/70">
                    Santa Missa / Celebração da Palavra conforme escala da Catedral.
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-white/10">
                <a
                  href={`https://wa.me/5527999990000?text=Olá,%20gostaria%20de%20confirmar%20a%20próxima%20celebração%20na%20${encodeURIComponent(community.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors min-h-[44px] shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar Horários no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
