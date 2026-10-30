'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Share2,
  Navigation,
  Maximize2,
  Sparkles,
  ChevronRight,
  Church,
} from 'lucide-react';
import { ParishSpecialEvent } from '@/types';

interface EventHeroMobileViewProps {
  event: ParishSpecialEvent;
  heroImageUrl: string;
  formattedDate: string;
  locationName: string;
  badgeLabel: string;
  whatsappUrl: string;
  mapsUrl: string;
  eventTheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  onOpenLightbox: () => void;
}

export function EventHeroMobileView({
  event,
  heroImageUrl,
  formattedDate,
  locationName,
  badgeLabel,
  whatsappUrl,
  mapsUrl,
  eventTheme,
  onOpenLightbox,
}: EventHeroMobileViewProps) {
  return (
    <div className="lg:hidden flex flex-col w-full">
      {/* 1. Arco Superior Sacro */}
      <div
        className="px-4 pt-3.5 pb-3 space-y-2.5 relative z-10"
        style={{
          background: `radial-gradient(ellipse at top, ${eventTheme.primary}55 0%, #0B101B 80%)`,
        }}
      >
        <nav aria-label="Breadcrumb Mobile" className="flex items-center gap-1.5 text-xs text-[#BDB7AE] flex-wrap">
          <Link
            href="/"
            className="hover:text-[#FFCC36] transition-colors inline-flex items-center gap-1 min-h-[44px]"
          >
            <Church className="w-3.5 h-3.5 text-[#C8A463]" />
            <span>Início</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5C616C]" />
          <Link
            href="/programacao"
            className="text-[#C8A463] font-medium inline-flex items-center min-h-[44px]"
          >
            Programação
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5C616C]" />
          <span className="text-[#FAF6F0] font-bold truncate max-w-[165px] sm:max-w-xs">
            {event.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border"
            style={{
              backgroundColor: `${eventTheme.primary}E6`,
              color: eventTheme.accent,
              borderColor: `${eventTheme.secondary}80`,
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: eventTheme.secondary }} />
            <span>{badgeLabel}</span>
          </span>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--dash-surface)]/10 border border-[#FAF6F0]/15 text-[#FFE59E]">
            <Calendar className="w-3.5 h-3.5 text-[#FFCC36]" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* 2. Vitrine da Arte 16:9 Inteira (Sem Cortar "Nossa Senhora DAS GRAÇAS") */}
      <div className="relative w-full bg-[#0B101B]">
        {heroImageUrl ? (
          <div onClick={onOpenLightbox} className="relative w-full cursor-pointer">
            <img
              src={heroImageUrl}
              alt={event.title}
              className="w-full h-auto aspect-[16/9] object-cover object-center block select-none"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#0B101B] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0B101B] via-[#0B101B]/55 to-transparent" />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox();
              }}
              aria-label="Ver arte em tela cheia"
              className="absolute top-2.5 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#090E1A]/70 text-[#FAF6F0] border border-[#FAF6F0]/20 backdrop-blur-md min-h-[44px] cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#FFCC36]" />
              <span>Ver Arte</span>
            </button>
          </div>
        ) : (
          <div
            className="w-full aspect-[16/9] flex items-center justify-center"
            style={{
              background: `radial-gradient(ellipse at center, ${eventTheme.primary}55 0%, #0B101B 75%)`,
            }}
          >
            <Sparkles className="w-12 h-12 text-[#FFCC36]/40" />
          </div>
        )}
      </div>

      {/* 3. Base em Fusão Contínua: Título, Local, Inspiração e Botões (>= 48px) */}
      <div className="px-4 sm:px-6 pt-1 pb-8 bg-gradient-to-b from-[#0B101B] to-[#0F1014] space-y-4">
        <div className="space-y-1.5">
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#FAF6F0] tracking-tight leading-tight">
            {event.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-[#D6CFC5]">
            <MapPin className="w-4 h-4 text-[#FFA82A] shrink-0" />
            <span className="font-medium">{locationName}</span>
          </div>
        </div>

        {(event.theme || event.motto) && (
          <div
            className="p-4 rounded-2xl bg-[var(--dash-surface)]/[0.05] border space-y-1.5"
            style={{
              borderColor: `${eventTheme.secondary}45`,
            }}
          >
            <span
              className="block text-[10px] font-extrabold uppercase tracking-widest"
              style={{ color: eventTheme.secondary }}
            >
              Inspiração Litúrgica
            </span>

            {event.theme && (
              <p className="text-sm sm:text-base font-serif italic text-[#FFF7E8] leading-relaxed">
                &ldquo;{event.theme}&rdquo;
              </p>
            )}

            {event.motto && (
              <p className="text-xs text-[#E2C285] font-medium font-mono">
                Lema: {event.motto}
              </p>
            )}
          </div>
        )}

        {event.description && (
          <p className="text-sm text-[#C8C2B8] leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-[#FAF6F0] font-bold text-sm transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-100" />
            <span>Compartilhar Programação no WhatsApp</span>
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-[#1D222D] hover:bg-[#272D3B] text-[#EAE3D9] border border-[#FAF6F0]/15 font-bold text-sm transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Navigation className="w-4 h-4 text-[#FFA82A]" />
            <span>Como Chegar (GPS)</span>
          </a>
        </div>
      </div>
    </div>
  );
}

