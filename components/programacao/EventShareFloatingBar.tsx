'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Navigation } from 'lucide-react';
import { ParishSpecialEvent } from '@/types';
import { generateWhatsAppShareText, getEventTheme } from '@/lib/events';

interface EventShareFloatingBarProps {
  event: ParishSpecialEvent;
  mapsUrl?: string;
}

export function EventShareFloatingBar({
  event,
  mapsUrl = 'https://maps.google.com/?q=Catedral+do+Sagrado+Cora%C3%A7%C3%A3o+de+Jesus+Colatina',
}: EventShareFloatingBarProps) {
  const canonicalUrl = `https://catedraldecolatina.org.br/programacao/${event.slug}`;
  const [currentUrl, setCurrentUrl] = useState(canonicalUrl);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [event.slug]);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${generateWhatsAppShareText(event, currentUrl)}`;
  const eventTheme = getEventTheme(event);

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t p-2.5 px-4 flex items-center gap-2 shadow-2xl safe-bottom"
      style={{
        backgroundColor: `rgba(${eventTheme.pageBgRgb}, 0.94)`,
        borderColor: eventTheme.borderSubtle,
      }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-3 px-3 rounded-xl active:scale-95 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md min-h-[46px]"
        style={{
          backgroundColor: eventTheme.secondary,
          color: eventTheme.ctaTextOnSecondary,
        }}
      >
        <Share2 className="w-4 h-4 shrink-0" />
        <span className="truncate">Compartilhar no WhatsApp</span>
      </a>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-xl active:scale-95 border font-bold text-xs flex items-center justify-center min-h-[46px] min-w-[46px]"
        style={{
          backgroundColor: eventTheme.primary,
          color: eventTheme.secondary,
          borderColor: `${eventTheme.secondary}50`,
        }}
        title="Como Chegar (GPS)"
      >
        <Navigation className="w-4 h-4" />
      </a>
    </div>
  );
}
