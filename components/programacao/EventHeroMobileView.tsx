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
import { ResolvedEventTheme } from '@/lib/events';

interface EventHeroMobileViewProps {
  event: ParishSpecialEvent;
  heroImageUrl: string;
  formattedDate: string;
  locationName: string;
  badgeLabel: string;
  whatsappUrl: string;
  mapsUrl: string;
  eventTheme: ResolvedEventTheme;
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
      {/* 1. Arco Superior Sacro na Paleta Exclusiva */}
      <div
        className="px-4 pt-3.5 pb-3 space-y-2.5 relative z-10"
        style={{
          background: `radial-gradient(ellipse at top, ${eventTheme.primary}65 0%, ${eventTheme.pageBg} 82%)`,
        }}
      >
        <nav
          aria-label="Breadcrumb Mobile"
          className="flex items-center gap-1.5 text-xs flex-wrap"
          style={{ color: eventTheme.textSecondary }}
        >
          <Link
            href="/"
            className="transition-opacity hover:opacity-80 inline-flex items-center gap-1 min-h-[44px]"
          >
            <Church className="w-3.5 h-3.5" style={{ color: eventTheme.secondary }} />
            <span>Início</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: eventTheme.textMuted }} />
          <Link
            href="/programacao"
            className="font-medium inline-flex items-center min-h-[44px]"
            style={{ color: eventTheme.secondary }}
          >
            Programação
          </Link>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: eventTheme.textMuted }} />
          <span
            className="font-bold truncate max-w-[165px] sm:max-w-xs"
            style={{ color: eventTheme.textPrimary }}
          >
            {event.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border"
            style={{
              backgroundColor: `${eventTheme.primary}E6`,
              color: eventTheme.accent,
              borderColor: `${eventTheme.secondary}75`,
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: eventTheme.secondary }} />
            <span>{badgeLabel}</span>
          </span>

          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: `${eventTheme.surfaceBg}CC`,
              borderColor: eventTheme.borderSubtle,
              color: eventTheme.secondary,
            }}
          >
            <Calendar className="w-3.5 h-3.5" style={{ color: eventTheme.secondary }} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* 2. Vitrine da Arte 16:9 Inteira (Zero Corte Lateral) */}
      <div className="relative w-full" style={{ backgroundColor: eventTheme.pageBg }}>
        {heroImageUrl ? (
          <div onClick={onOpenLightbox} className="relative w-full cursor-pointer">
            <img
              src={heroImageUrl}
              alt={event.title}
              className="w-full h-auto aspect-[16/9] object-cover object-center block select-none"
              loading="eager"
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-6"
              style={{
                background: `linear-gradient(to bottom, ${eventTheme.pageBg}, transparent)`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
              style={{
                background: `linear-gradient(to top, ${eventTheme.pageBg}, rgba(${eventTheme.pageBgRgb}, 0.55), transparent)`,
              }}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox();
              }}
              aria-label="Ver arte em tela cheia"
              className="absolute top-2.5 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-md min-h-[44px] cursor-pointer"
              style={{
                backgroundColor: `rgba(${eventTheme.pageBgRgb}, 0.72)`,
                color: eventTheme.textPrimary,
                borderColor: `${eventTheme.secondary}55`,
              }}
            >
              <Maximize2 className="w-3.5 h-3.5" style={{ color: eventTheme.secondary }} />
              <span>Ver Arte</span>
            </button>
          </div>
        ) : (
          <div
            className="w-full aspect-[16/9] flex items-center justify-center"
            style={{
              background: `radial-gradient(ellipse at center, ${eventTheme.primary}65 0%, ${eventTheme.pageBg} 75%)`,
            }}
          >
            <Sparkles className="w-12 h-12 opacity-40" style={{ color: eventTheme.secondary }} />
          </div>
        )}
      </div>

      {/* 3. Base em Fusão Contínua na Paleta Exclusiva */}
      <div
        className="px-4 sm:px-6 pt-1 pb-8 space-y-4"
        style={{ backgroundColor: eventTheme.pageBg }}
      >
        <div className="space-y-1.5">
          <h1
            className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight"
            style={{ color: eventTheme.textPrimary }}
          >
            {event.title}
          </h1>

          <div className="flex items-center gap-2 text-sm" style={{ color: eventTheme.textSecondary }}>
            <MapPin className="w-4 h-4 shrink-0" style={{ color: eventTheme.secondary }} />
            <span className="font-medium">{locationName}</span>
          </div>
        </div>

        {(event.theme || event.motto) && (
          <div
            className="p-4 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: `${eventTheme.surfaceBg}CC`,
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
              <p
                className="text-sm sm:text-base font-serif italic leading-relaxed"
                style={{ color: eventTheme.textPrimary }}
              >
                &ldquo;{event.theme}&rdquo;
              </p>
            )}

            {event.motto && (
              <p className="text-xs font-medium font-mono" style={{ color: eventTheme.secondary }}>
                Lema: {event.motto}
              </p>
            )}
          </div>
        )}

        {event.description && (
          <p className="text-sm leading-relaxed" style={{ color: eventTheme.textSecondary }}>
            {event.description}
          </p>
        )}

        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl font-extrabold text-sm transition-all hover:brightness-105 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
            style={{
              backgroundColor: eventTheme.secondary,
              color: eventTheme.ctaTextOnSecondary,
              boxShadow: `0 10px 26px -6px ${eventTheme.secondary}50`,
            }}
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>Compartilhar Programação no WhatsApp</span>
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl border font-bold text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2 min-h-[48px]"
            style={{
              backgroundColor: `${eventTheme.primary}CC`,
              color: eventTheme.textPrimary,
              borderColor: `${eventTheme.secondary}45`,
            }}
          >
            <Navigation className="w-4 h-4 shrink-0" style={{ color: eventTheme.secondary }} />
            <span>Como Chegar (GPS)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
