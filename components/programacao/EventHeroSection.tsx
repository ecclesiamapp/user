'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Share2, 
  Navigation, 
  ZoomIn, 
  Sparkles, 
  ChevronRight, 
  Download,
  Church
} from 'lucide-react';
import { ParishSpecialEvent } from '@/types';
import { formatEventDateRange, generateWhatsAppShareText, getEventTheme } from '@/lib/events';
import { EventLightboxModal } from './EventLightboxModal';

interface EventHeroSectionProps {
  event: ParishSpecialEvent;
  parishAddress?: string;
  mapsUrl?: string;
}

export function EventHeroSection({
  event,
  parishAddress = 'Praça Frei José, Centro - Colatina/ES',
  mapsUrl = 'https://maps.google.com/?q=Catedral+do+Sagrado+Cora%C3%A7%C3%A3o+de+Jesus+Colatina',
}: EventHeroSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const eventTheme = getEventTheme(event);

  const formattedDate = formatEventDateRange(event.start_date, event.end_date);
  const locationName = event.community_name || 'Catedral Sagrado Coração de Jesus (Matriz)';

  // Geração de link de compartilhamento para WhatsApp
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://catedraldecolatina.org.br/programacao/${event.slug}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${generateWhatsAppShareText(event, currentUrl)}`;

  const getTypeBadgeLabel = (type: string) => {
    switch (type) {
      case 'copadroeira':
        return 'Festa da Co-Padroeira';
      case 'padroeiro_matriz':
        return 'Solenidade do Padroeiro (Matriz)';
      case 'liturgico_global':
        return 'Solenidade Universal';
      case 'padroeiro_ceb':
        return 'Festa da Comunidade (CEB)';
      default:
        return 'Solenidade Especial';
    }
  };

  return (
    <>
      <section 
        className="relative w-full text-[#EAE3D9] pt-6 pb-12 sm:pb-16 border-b border-[#C8A463]/30 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at top right, ${eventTheme.primary}45 0%, transparent 65%), linear-gradient(180deg, #131418 0%, #16181D 50%, #0F1014 100%)`
        }}
      >
        {/* Padrão Geométrico Sacro de Fundo */}
        <div className="absolute inset-0 bg-[radial-gradient(#C8A463_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          {/* Breadcrumb Amigável */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#A39E98] flex-wrap">
            <Link href="/" className="hover:text-[#FFCC36] transition-colors flex items-center gap-1 min-h-[36px]">
              <Church className="w-3.5 h-3.5 text-[#C8A463]" />
              <span>Início</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#5C616C]" />
            <span className="text-[#C8A463] font-medium">Programação Especial</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#5C616C]" />
            <span className="text-white font-bold truncate max-w-[220px] sm:max-w-none">
              {event.title}
            </span>
          </nav>

          {/* Grid Principal: Cartaz à esquerda (ou topo no mobile) + Conteúdo Monumental */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Coluna do Cartaz Oficial */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div 
                onClick={() => event.banner_url && setLightboxOpen(true)}
                className="relative group w-full max-w-[340px] sm:max-w-[380px] rounded-3xl overflow-hidden border-2 bg-black/60 shadow-2xl shadow-black/80 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{
                  borderColor: `${eventTheme.secondary}80`,
                  boxShadow: `0 20px 40px -15px ${eventTheme.primary}60`
                }}
              >
                {event.banner_url ? (
                  <img
                    src={event.banner_url}
                    alt={`Cartaz Oficial - ${event.title}`}
                    className="w-full h-auto object-cover object-center aspect-[3/4]"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1E2127] to-[#111317]">
                    <div className="w-16 h-16 rounded-2xl bg-[#8B1E22]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] mb-3">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-bold text-white block">
                      {event.title}
                    </span>
                    <span className="text-xs text-[#A39E98] mt-1">
                      Cartaz oficial da programação
                    </span>
                  </div>
                )}

                {/* Overlay de Toque/Hover para Ampliar */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold backdrop-blur-xs">
                  <ZoomIn className="w-5 h-5 text-[#FFCC36]" />
                  <span>Toque para Ampliar Cartaz</span>
                </div>

                {/* Selo no Cartaz */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-black/75 text-[#FFCC36] border border-[#C8A463]/40 backdrop-blur-md">
                    {getTypeBadgeLabel(event.event_type)}
                  </span>
                </div>
              </div>

              {/* Botão de Ampliação Auxiliar no Mobile */}
              {event.banner_url && (
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="mt-2.5 text-xs font-semibold text-[#C8A463] hover:text-[#FFCC36] flex items-center gap-1.5 min-h-[38px] cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Ver Cartaz em Tela Cheia</span>
                </button>
              )}
            </div>

            {/* Coluna dos Textos e Ações */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Badges Superiores */}
              <div className="flex flex-wrap items-center gap-2">
                <span 
                  className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs border"
                  style={{
                    backgroundColor: `${eventTheme.primary}EE`,
                    color: eventTheme.accent,
                    borderColor: `${eventTheme.secondary}90`,
                  }}
                >
                  {getTypeBadgeLabel(event.event_type)}
                </span>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--dash-surface)]/5 border border-white/10 text-amber-200">
                  <Calendar className="w-3.5 h-3.5 text-[#FFCC36]" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Título Majestoso */}
              <div className="space-y-2">
                <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {event.title}
                </h1>

                {/* Localização */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#D2CBC1]">
                  <MapPin className="w-4 h-4 text-[#FFA82A] shrink-0" />
                  <span className="font-medium">{locationName}</span>
                </div>
              </div>

              {/* Tema Pastoral e Lema Bíblico */}
              {(event.theme || event.motto) && (
                <div 
                  className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface)]/[0.04] border space-y-2 relative"
                  style={{
                    borderColor: `${eventTheme.secondary}40`,
                  }}
                >
                  <div 
                    className="absolute -top-3 left-4 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-xs"
                    style={{
                      backgroundColor: eventTheme.primary,
                      color: eventTheme.accent,
                      borderColor: eventTheme.secondary,
                    }}
                  >
                    Inspiração Litúrgica
                  </div>

                  {event.theme && (
                    <p className="text-sm sm:text-base font-serif italic text-[#FFF7E8] leading-relaxed pt-1">
                      &ldquo;{event.theme}&rdquo;
                    </p>
                  )}

                  {event.motto && (
                    <p className="text-xs text-[#C8A463] font-medium font-mono">
                      Lema: {event.motto}
                    </p>
                  )}
                </div>
              )}

              {/* Descrição Pastoral de Acolhida */}
              {event.description && (
                <p className="text-xs sm:text-sm text-[#B8B2A9] leading-relaxed">
                  {event.description}
                </p>
              )}

              {/* Grade de Botões de Ação Rápida (Touch Targets >= 44px) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Botão WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-100" />
                  <span>Compartilhar Programação no WhatsApp</span>
                </a>

                {/* Botão Rota GPS */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-[#262A32] hover:bg-[#323640] text-[#EAE3D9] hover:text-white border border-white/10 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <Navigation className="w-4 h-4 text-[#FFA82A]" />
                  <span>Como Chegar (GPS)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Lightbox */}
      <EventLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={event.banner_url || ''}
        title={event.title}
      />
    </>
  );
}
