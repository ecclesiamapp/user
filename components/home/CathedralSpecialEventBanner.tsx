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
  generateWhatsAppShareText,
} from '@/lib/events';

interface CathedralSpecialEventBannerProps {
  event: ParishSpecialEvent;
}

export function CathedralSpecialEventBanner({ event }: CathedralSpecialEventBannerProps) {
  const theme = getEventTheme(event);
  const [countdown, setCountdown] = useState<EventCountdownState | null>(null);
  const canonicalEventUrl = `https://catedraldecolatina.org.br/programacao/${event.slug}`;
  const [shareEventUrl, setShareEventUrl] = useState(canonicalEventUrl);

  useEffect(() => {
    setShareEventUrl(`${window.location.origin}/programacao/${event.slug}`);

    const update = () => {
      setCountdown(calculateEventCountdown(event.start_date, event.end_date));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [event.start_date, event.end_date, event.slug]);

  const datesFormatted = formatEventDateRange(event.start_date, event.end_date);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${generateWhatsAppShareText(event, shareEventUrl)}`;
  const bannerImage = event.banner_url || '/images/festas/copadroeira-nossa-senhora-das-gracas.webp';

  return (
    <section
      aria-label="Destaque da Festividade Litúrgica"
      className="relative overflow-hidden rounded-3xl border shadow-xl transition-all duration-300"
      style={{
        borderColor: `${theme.secondary}55`,
        background: `linear-gradient(135deg, ${theme.pageBg} 0%, ${theme.surfaceBg} 52%, ${theme.primary}E6 100%)`,
        color: theme.textPrimary,
      }}
    >
      {/* Iluminação atmosférica de fundo na paleta da festa */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-25"
        style={{ backgroundColor: theme.secondary }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: theme.primary }}
      />

      <div className="relative z-10 p-5 sm:p-8 lg:p-9 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
        {/* Coluna 1 (lg:5): Moldura Devocional 16:9 da Arte Oficial */}
        <div className="lg:col-span-5">
          <Link
            href={`/programacao/${event.slug}`}
            className="group relative block w-full aspect-[16/9] rounded-2xl overflow-hidden border shadow-2xl"
            style={{
              borderColor: `${theme.secondary}65`,
              backgroundColor: theme.pageBg,
            }}
          >
            <img
              src={bannerImage}
              alt={event.title}
              className="w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-500 select-none"
              loading="lazy"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(${theme.pageBgRgb}, 0.78) 0%, transparent 45%)`,
              }}
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md"
                style={{
                  backgroundColor: `rgba(${theme.pageBgRgb}, 0.78)`,
                  color: theme.secondary,
                  borderColor: `${theme.secondary}55`,
                }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{datesFormatted}</span>
              </span>

              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
                style={{
                  backgroundColor: theme.secondary,
                  color: theme.ctaTextOnSecondary,
                }}
              >
                <span>Ver Tríduo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>

        {/* Coluna 2 (lg:7): Identidade, Tema, Contagem Regressiva e CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-wider border shadow-sm"
                style={{
                  backgroundColor: `${theme.primary}CC`,
                  color: theme.accent,
                  borderColor: `${theme.secondary}70`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.secondary }}
                />
                <Sparkles className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
                <span>Festa da Co-Padroeira • Destaque Paroquial</span>
              </span>

              {countdown && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `rgba(${theme.pageBgRgb}, 0.65)`,
                    color: theme.secondary,
                    borderColor: `${theme.secondary}45`,
                  }}
                >
                  <span>{countdown.label}</span>
                </span>
              )}
            </div>

            <div>
              <h2
                className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-wide uppercase leading-tight"
                style={{ color: theme.textPrimary }}
              >
                {event.title}
              </h2>
              {event.motto && (
                <p
                  className="text-xs sm:text-sm font-serif italic mt-1"
                  style={{ color: theme.secondary }}
                >
                  &ldquo;{event.motto}&rdquo;
                </p>
              )}
            </div>

            {event.theme && (
              <div
                className="flex items-start gap-2 text-xs sm:text-sm rounded-xl p-3 border backdrop-blur-sm"
                style={{
                  backgroundColor: `rgba(${theme.pageBgRgb}, 0.5)`,
                  borderColor: `${theme.secondary}35`,
                  color: theme.textSecondary,
                }}
              >
                <span
                  className="font-extrabold uppercase tracking-wider text-[11px] whitespace-nowrap"
                  style={{ color: theme.secondary }}
                >
                  Tema:
                </span>
                <p className="line-clamp-2 italic">{event.theme}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs" style={{ color: theme.textSecondary }}>
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.secondary }} />
              <span>{event.community_name || 'Catedral do Sagrado Coração de Jesus • Colatina/ES'}</span>
            </div>
          </div>

          {/* Barra Inferior: Contagem Regressiva Compacta + Botões */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {countdown && countdown.status !== 'ended' && (
              <div className="grid grid-cols-4 gap-2 text-center shrink-0">
                {[
                  { value: countdown.days, label: 'Dias', highlight: false },
                  { value: countdown.hours, label: 'Horas', highlight: false },
                  { value: countdown.minutes, label: 'Min', highlight: false },
                  { value: countdown.seconds, label: 'Seg', highlight: true },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="rounded-xl px-2.5 py-1.5 min-w-[54px] border"
                    style={{
                      backgroundColor: `rgba(${theme.pageBgRgb}, 0.65)`,
                      borderColor: unit.highlight ? `${theme.secondary}80` : theme.borderSubtle,
                    }}
                  >
                    <span
                      className="block font-cinzel text-base sm:text-lg font-bold leading-none"
                      style={{ color: unit.highlight ? theme.secondary : theme.textPrimary }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </span>
                    <span
                      className="block text-[9px] uppercase font-bold mt-0.5"
                      style={{ color: theme.textMuted }}
                    >
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 sm:justify-end">
              <Link
                href={`/programacao/${event.slug}`}
                className="min-h-[46px] px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all"
                style={{
                  backgroundColor: theme.secondary,
                  color: theme.ctaTextOnSecondary,
                }}
              >
                <span>Programação Completa</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no WhatsApp"
                className="min-h-[46px] px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{
                  backgroundColor: `${theme.primary}D9`,
                  color: theme.textPrimary,
                  borderColor: `${theme.secondary}45`,
                }}
              >
                <Share2 className="w-4 h-4" style={{ color: theme.secondary }} />
                <span>Convidar</span>
              </a>

              {event.poster_pdf_url && (
                <a
                  href={event.poster_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Baixar Cartaz Oficial em PDF"
                  className="min-h-[46px] px-3.5 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: `rgba(${theme.pageBgRgb}, 0.65)`,
                    color: theme.textPrimary,
                    borderColor: theme.borderSubtle,
                  }}
                  title="Baixar Cartaz Oficial (PDF)"
                >
                  <FileDown className="w-4 h-4" style={{ color: theme.secondary }} />
                  <span className="sm:hidden">Cartaz PDF</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
