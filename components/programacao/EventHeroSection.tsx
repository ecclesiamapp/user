'use client';

import React, { useState } from 'react';
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
  FileDown,
} from 'lucide-react';
import { ParishSpecialEvent } from '@/types';
import { formatEventDateRange, generateWhatsAppShareText, getEventTheme } from '@/lib/events';
import { EventLightboxModal } from './EventLightboxModal';
import { EventHeroMobileView } from './EventHeroMobileView';

interface EventHeroSectionProps {
  event: ParishSpecialEvent;
  parishAddress?: string;
  mapsUrl?: string;
}

export function EventHeroSection({
  event,
  mapsUrl = 'https://maps.google.com/?q=Catedral+do+Sagrado+Cora%C3%A7%C3%A3o+de+Jesus+Colatina',
}: EventHeroSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const eventTheme = getEventTheme(event);

  const formattedDate = formatEventDateRange(event.start_date, event.end_date);
  const locationName = event.community_name || 'Catedral Sagrado Coração de Jesus (Sede)';
  const heroImageUrl = event.banner_url || '';

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://catedraldecolatina.org.br/programacao/${event.slug}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${generateWhatsAppShareText(event, currentUrl)}`;

  const getTypeBadgeLabel = (type: string) => {
    switch (type) {
      case 'copadroeira':
        return 'Festa da Co-Padroeira';
      case 'padroeiro_matriz':
        return 'Solenidade do Padroeiro (Catedral)';
      case 'liturgico_global':
        return 'Solenidade Universal';
      case 'padroeiro_ceb':
        return 'Festa da Comunidade (CEB)';
      default:
        return 'Solenidade Especial';
    }
  };

  const badgeLabel = getTypeBadgeLabel(event.event_type);

  return (
    <>
      <section
        aria-label={`Cabeçalho de ${event.title}`}
        className="relative w-full overflow-hidden border-b border-[#C8A463]/30 bg-[#0B101B] text-[#FAF6F0]"
      >
        {/* VERSÃO DESKTOP (lg+): ARTE 16:9 FULL-BLEED + MOLDURA NOS 4 CANTOS */}
        <div className="hidden lg:flex relative w-full lg:aspect-[16/8.4] lg:min-h-[630px] lg:max-h-[740px] flex-col justify-between">
          {heroImageUrl ? (
            <img
              src={heroImageUrl}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover object-[50%_15%] select-none"
              loading="eager"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `radial-gradient(ellipse at 50% 40%, ${eventTheme.primary}65 0%, #0B101B 75%)`,
              }}
            >
              <Sparkles className="w-20 h-20 text-[#FFCC36]/25" />
            </div>
          )}

          {/* Vinheta Cinematográfica Suave nas Extremidades (Centro 100% Puro) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 64% 58% at 50% 42%, transparent 48%, rgba(8, 12, 22, 0.62) 100%)',
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#080C16]/85 via-[#080C16]/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-[#080C16]/95 via-[#080C16]/65 to-transparent" />

          {/* LINHA SUPERIOR (Canto Superior Esquerdo + Canto Superior Direito) */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 xl:px-10 pt-5 flex items-start justify-between gap-6">
            {/* VÉRTICE 1 — TOPO ESQUERDO: Breadcrumb + Selo */}
            <div className="space-y-2.5 max-w-md">
              <nav
                aria-label="Breadcrumb"
                className="inline-flex items-center gap-1.5 text-xs text-[#E2DDD5] drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] flex-wrap"
              >
                <Link
                  href="/"
                  className="hover:text-[#FFCC36] transition-colors inline-flex items-center gap-1 min-h-[36px]"
                >
                  <Church className="w-3.5 h-3.5 text-[#FFCC36]" />
                  <span>Início</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#A39E98]" />
                <Link
                  href="/programacao"
                  className="text-[#FFD97D] hover:text-[#FFCC36] transition-colors font-medium inline-flex items-center min-h-[36px]"
                >
                  Programação Especial
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#A39E98]" />
                <span className="text-[#FAF6F0] font-semibold truncate max-w-[210px]">
                  {event.title}
                </span>
              </nav>

              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border backdrop-blur-md shadow-lg"
                  style={{
                    backgroundColor: `${eventTheme.primary}D9`,
                    color: eventTheme.accent,
                    borderColor: `${eventTheme.secondary}80`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: eventTheme.secondary }} />
                  <span>{badgeLabel}</span>
                </span>
              </div>
            </div>

            {/* VÉRTICE 2 — TOPO DIREITO: Data, Localização e "Ver Arte" */}
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="inline-flex items-center gap-2 flex-wrap justify-end">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#090E1A]/65 border border-[#FAF6F0]/15 text-[#FFE59E] backdrop-blur-md shadow-lg min-h-[38px]">
                  <Calendar className="w-3.5 h-3.5 text-[#FFCC36]" />
                  <span>{formattedDate}</span>
                </div>

                {heroImageUrl && (
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    title="Contemplar arte limpa em tela cheia"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#090E1A]/65 hover:bg-[#090E1A]/85 text-[#FAF6F0] hover:text-[#FFCC36] border border-[#FAF6F0]/15 hover:border-[#FFCC36]/50 backdrop-blur-md transition-all shadow-lg min-h-[38px] cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#FFCC36]" />
                    <span>Ver Arte</span>
                  </button>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090E1A]/50 border border-[#FAF6F0]/10 backdrop-blur-sm text-xs text-[#E8E2D9] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                <MapPin className="w-3.5 h-3.5 text-[#FFA82A] shrink-0" />
                <span className="font-medium">{locationName}</span>
              </div>
            </div>
          </div>

          {/* JANELA DEVOCIONAL CENTRAL: 100% desobstruída */}
          <div className="flex-1 pointer-events-none" aria-hidden="true" />

          {/* LINHA INFERIOR (Canto Inferior Esquerdo + Canto Inferior Direito) */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 xl:px-10 pb-7 pt-4 flex items-end justify-between gap-8">
            {/* VÉRTICE 3 — BASE ESQUERDA: Título + Descrição Enxuta */}
            <div className="max-w-[460px] xl:max-w-[500px] space-y-2.5">
              <h1 className="font-cinzel text-2xl xl:text-4xl font-extrabold text-[#FAF6F0] tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                {event.title}
              </h1>

              {event.description && (
                <p className="text-xs xl:text-sm text-[#DDD7CE] leading-relaxed line-clamp-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  {event.description}
                </p>
              )}
            </div>

            {/* VÉRTICE 4 — BASE DIREITA: Inspiração Litúrgica + Botões */}
            <div className="max-w-[460px] xl:max-w-[490px] w-full flex flex-col items-end space-y-3">
              {(event.theme || event.motto) && (
                <div
                  className="w-full px-4 py-3 rounded-2xl bg-[#090E1A]/55 backdrop-blur-md border space-y-1 shadow-xl"
                  style={{
                    borderColor: `${eventTheme.secondary}55`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-widest"
                      style={{ color: eventTheme.secondary }}
                    >
                      Inspiração Litúrgica
                    </span>
                    {event.poster_pdf_url && (
                      <a
                        href={event.poster_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FFD97D] hover:underline"
                      >
                        <FileDown className="w-3 h-3" />
                        <span>PDF Oficial</span>
                      </a>
                    )}
                  </div>

                  {event.theme && (
                    <p className="text-sm font-serif italic text-[#FFF8EB] leading-snug line-clamp-2">
                      &ldquo;{event.theme}&rdquo;
                    </p>
                  )}

                  {event.motto && (
                    <p className="text-[11px] text-[#E6C78B] font-medium font-mono truncate">
                      Lema: {event.motto}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 w-full">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-[#FAF6F0] font-bold text-xs xl:text-sm transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-100 shrink-0" />
                  <span>Compartilhar no WhatsApp</span>
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-[#161B26]/80 hover:bg-[#202736] text-[#FAF6F0] border border-[#FAF6F0]/15 hover:border-[#FFA82A]/40 backdrop-blur-md font-bold text-xs xl:text-sm transition-all flex items-center justify-center gap-2 min-h-[48px] shrink-0"
                >
                  <Navigation className="w-4 h-4 text-[#FFA82A] shrink-0" />
                  <span>Como Chegar (GPS)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* VERSÃO MOBILE & TABLET (< lg): ZERO CORTE + FUSÃO EM DEGRADÊ */}
        <EventHeroMobileView
          event={event}
          heroImageUrl={heroImageUrl}
          formattedDate={formattedDate}
          locationName={locationName}
          badgeLabel={badgeLabel}
          whatsappUrl={whatsappUrl}
          mapsUrl={mapsUrl}
          eventTheme={eventTheme}
          onOpenLightbox={() => setLightboxOpen(true)}
        />
      </section>

      <EventLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={heroImageUrl}
        title={event.title}
      />
    </>
  );
}
