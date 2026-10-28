'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Share2, Sparkles, MapPin, FileDown } from 'lucide-react';
import { ParishSpecialEvent } from '@/types';
import { 
  getEventTheme, 
  formatEventDateRange, 
  calculateEventCountdown, 
  EventCountdownState,
  generateWhatsAppShareText
} from '@/lib/events';

interface CathedralSpecialEventBannerProps {
  event: ParishSpecialEvent;
}

export function CathedralSpecialEventBanner({ event }: CathedralSpecialEventBannerProps) {
  const theme = getEventTheme(event);
  const [countdown, setCountdown] = useState<EventCountdownState>(() =>
    calculateEventCountdown(event.start_date, event.end_date)
  );

  useEffect(() => {
    // Atualiza a cada 1 segundo para mostrar a contagem em tempo real
    const timer = setInterval(() => {
      setCountdown(calculateEventCountdown(event.start_date, event.end_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [event.start_date, event.end_date]);

  const datesFormatted = formatEventDateRange(event.start_date, event.end_date);

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://catedraldecolatina.org.br';
    const liveEventUrl = `${origin}/programacao/${event.slug}`;
    const shareUrl = `https://api.whatsapp.com/send?text=${generateWhatsAppShareText(event, liveEventUrl)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const canonicalEventUrl = `https://catedraldecolatina.org.br/programacao/${event.slug}`;
  const defaultShareUrl = `https://api.whatsapp.com/send?text=${generateWhatsAppShareText(event, canonicalEventUrl)}`;

  return (
    <section 
      aria-label="Destaque da Festividade Litúrgica"
      className="relative overflow-hidden rounded-3xl border shadow-xl transition-all duration-300"
      style={{
        borderColor: `${theme.secondary}40`,
        background: `linear-gradient(135deg, ${theme.primary}18 0%, rgba(18, 20, 26, 0.95) 45%, rgba(13, 15, 20, 0.98) 100%)`,
      }}
    >
      {/* Brilho e iluminação atmosférica litúrgica de fundo */}
      <div 
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: theme.secondary }}
      />
      <div 
        className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: theme.primary }}
      />

      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Lado Esquerdo: Identidade da Festa, Título, Tema e Local */}
        <div className="space-y-4 max-w-2xl">
          {/* Badge de Destaque com Cor da Festa */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider border shadow-sm"
              style={{
                backgroundColor: `${theme.primary}35`,
                color: theme.accent === '#FFFFFF' ? '#F8FAFC' : theme.accent,
                borderColor: `${theme.secondary}60`
              }}
            >
              <span 
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: theme.secondary }}
              />
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
              <span>Solenidade & Grande Festa</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-zinc-300 text-[11px] sm:text-xs border border-white/10 font-medium">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{datesFormatted}</span>
            </span>
          </div>

          {/* Título Principal Monumental */}
          <div>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide uppercase leading-tight">
              {event.title}
            </h2>
            {event.motto && (
              <p className="text-xs sm:text-sm text-zinc-300/90 font-serif italic mt-1.5 line-clamp-2">
                "{event.motto}"
              </p>
            )}
          </div>

          {/* Tema pastoral explicativo */}
          {event.theme && (
            <div className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300 bg-[var(--dash-surface)]/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <span className="font-bold uppercase tracking-wider text-[11px] text-[#FFA82A] whitespace-nowrap">
                Tema:
              </span>
              <p className="line-clamp-2 italic">
                {event.theme}
              </p>
            </div>
          )}

          {/* Local de celebração */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-[#FFA82A] shrink-0" />
            <span>{event.community_name || 'Catedral do Sagrado Coração de Jesus • Colatina/ES'}</span>
          </div>
        </div>

        {/* Lado Direito: Caixa de Contagem Regressiva e Botões de Ação */}
        <div className="flex flex-col items-center lg:items-end gap-6 shrink-0 w-full lg:w-auto">
          {/* Módulo de Contagem Regressiva */}
          <div className="w-full lg:w-auto bg-black/50 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-inner text-center">
            <div className="flex items-center justify-center gap-1.5 mb-3 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              <span 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.secondary }}
              />
              <span>{countdown.label}</span>
            </div>

            {countdown.status !== 'ended' ? (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center" suppressHydrationWarning>
                <div className="bg-[var(--dash-surface)]/5 border border-white/10 rounded-xl p-2 min-w-[58px] sm:min-w-[68px]">
                  <span suppressHydrationWarning className="block font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wider">
                    {String(countdown.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Dias</span>
                </div>
                <div className="bg-[var(--dash-surface)]/5 border border-white/10 rounded-xl p-2 min-w-[58px] sm:min-w-[68px]">
                  <span suppressHydrationWarning className="block font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wider">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Horas</span>
                </div>
                <div className="bg-[var(--dash-surface)]/5 border border-white/10 rounded-xl p-2 min-w-[58px] sm:min-w-[68px]">
                  <span suppressHydrationWarning className="block font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wider">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Min</span>
                </div>
                <div className="bg-[var(--dash-surface)]/5 border border-white/10 rounded-xl p-2 min-w-[58px] sm:min-w-[68px]">
                  <span 
                    suppressHydrationWarning
                    className="block font-cinzel text-xl sm:text-2xl font-bold tracking-wider"
                    style={{ color: theme.secondary }}
                  >
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Seg</span>
                </div>
              </div>
            ) : (
              <div className="py-2 px-4 text-xs font-semibold text-zinc-300">
                Esta festividade já foi celebrada com grande alegria e comunhão.
              </div>
            )}
          </div>

          {/* Botões de Ação com Touch Target Confortável (min-h-[48px]) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href={`/programacao/${event.slug}`}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-950 flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
              style={{
                backgroundColor: theme.secondary,
              }}
            >
              <span>Ver Programação Completa</span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </Link>

            <a
              href={defaultShareUrl}
              onClick={handleShareWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartilhar no WhatsApp"
              className="w-full sm:w-auto min-h-[48px] px-4 py-3 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 active:scale-[0.98] text-white border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Convidar Família</span>
            </a>

            {event.poster_pdf_url && (
              <a
                href={event.poster_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Baixar Cartaz Oficial em PDF"
                className="w-full sm:w-auto min-h-[48px] px-3.5 py-3 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 text-zinc-200 border border-white/15 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                title="Baixar Cartaz Oficial (PDF)"
              >
                <FileDown className="w-4 h-4 text-amber-300" />
                <span className="sm:hidden">Cartaz Oficial</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
