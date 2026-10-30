'use client';

import React from 'react';
import { PartyPopper, Utensils, Heart, Navigation, MapPin } from 'lucide-react';
import { ParishSpecialEvent } from '@/types';
import { getEventTheme } from '@/lib/events';

interface EventSocialQuermesseSectionProps {
  event: ParishSpecialEvent;
  mapsUrl?: string;
}

export function EventSocialQuermesseSection({
  event,
  mapsUrl = 'https://maps.google.com/?q=Catedral+do+Sagrado+Cora%C3%A7%C3%A3o+de+Jesus+Colatina',
}: EventSocialQuermesseSectionProps) {
  const locationName = event.community_name || 'Catedral Sagrado Coração de Jesus';
  const eventTheme = getEventTheme(event);

  return (
    <section
      className="w-full py-12 border-t"
      style={{
        backgroundColor: eventTheme.bodyBg,
        borderColor: eventTheme.cardBorder,
      }}
    >
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        <div
          className="rounded-3xl border p-6 sm:p-10 relative overflow-hidden"
          style={{
            borderColor: eventTheme.cardBorder,
            background: `linear-gradient(135deg, ${eventTheme.cardSubtleBg} 0%, ${eventTheme.cardBg} 55%, ${eventTheme.cardHighlightBg} 100%)`,
            color: eventTheme.bodyTextPrimary,
            boxShadow: `0 18px 42px -12px ${eventTheme.primary}16`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8 space-y-4">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: eventTheme.cardHighlightBg,
                  color: eventTheme.accentOnLight,
                  borderColor: eventTheme.cardHighlightBorder,
                }}
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Convivência & Quermesse Comunitária</span>
              </div>

              <h3
                className="font-cinzel text-xl sm:text-3xl font-bold leading-tight"
                style={{ color: eventTheme.bodyTextPrimary }}
              >
                Espaço da Fraternidade & Barracas Festivas
              </h3>

              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: eventTheme.bodyTextSecondary }}
              >
                Após as celebrações litúrgicas, toda a comunidade paroquial, famílias e visitantes são convidados a partilhar momentos de alegria cristã na tradicional quermesse. Todas as doações e renda das barracas são revertidas para as obras de caridade e manutenção pastoral da paróquia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div
                  className="flex items-center gap-2.5 p-3 rounded-xl border"
                  style={{
                    backgroundColor: eventTheme.cardBg,
                    borderColor: eventTheme.cardBorder,
                    color: eventTheme.bodyTextPrimary,
                  }}
                >
                  <Utensils className="w-4 h-4 shrink-0" style={{ color: eventTheme.accentOnLight }} />
                  <span className="font-medium">Barracas típicas, pastéis, caldos e doces</span>
                </div>
                <div
                  className="flex items-center gap-2.5 p-3 rounded-xl border"
                  style={{
                    backgroundColor: eventTheme.cardBg,
                    borderColor: eventTheme.cardBorder,
                    color: eventTheme.bodyTextPrimary,
                  }}
                >
                  <Heart className="w-4 h-4 shrink-0" style={{ color: eventTheme.primary }} />
                  <span className="font-medium">Ambiente familiar, seguro e acolhedor</span>
                </div>
              </div>
            </div>

            <div
              className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl border space-y-3"
              style={{
                backgroundColor: eventTheme.cardBg,
                borderColor: eventTheme.cardBorder,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border"
                style={{
                  backgroundColor: `${eventTheme.primary}14`,
                  color: eventTheme.primary,
                  borderColor: eventTheme.cardBorder,
                }}
              >
                <MapPin className="w-6 h-6" />
              </div>

              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider block"
                  style={{ color: eventTheme.bodyTextMuted }}
                >
                  Pátio das Festividades
                </span>
                <span
                  className="text-xs font-bold block mt-0.5"
                  style={{ color: eventTheme.bodyTextPrimary }}
                >
                  {locationName}
                </span>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-extrabold text-xs transition-all hover:brightness-110 shadow-md flex items-center justify-center gap-2 min-h-[46px]"
                style={{
                  backgroundColor: eventTheme.primary,
                  color: eventTheme.accent,
                }}
              >
                <Navigation className="w-4 h-4 shrink-0" style={{ color: eventTheme.secondary }} />
                <span>Traçar Rota no GPS</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
