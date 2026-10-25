'use client';

import React from 'react';
import { Share2, Navigation } from 'lucide-react';
import { ParishSpecialEvent } from '@/types';
import { generateWhatsAppShareText } from '@/lib/events';

interface EventShareFloatingBarProps {
  event: ParishSpecialEvent;
  mapsUrl?: string;
}

export function EventShareFloatingBar({
  event,
  mapsUrl = 'https://maps.google.com/?q=Catedral+do+Sagrado+Cora%C3%A7%C3%A3o+de+Jesus+Colatina',
}: EventShareFloatingBarProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://catedraldecolatina.org.br/programacao/${event.slug}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${generateWhatsAppShareText(event, currentUrl)}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#16181D]/95 backdrop-blur-md border-t border-[#C8A463]/30 p-2.5 px-4 flex items-center gap-2 shadow-2xl safe-bottom">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md min-h-[46px]"
      >
        <Share2 className="w-4 h-4 text-emerald-100 shrink-0" />
        <span className="truncate">Compartilhar no WhatsApp</span>
      </a>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-xl bg-[#262A32] active:scale-95 text-[#EAE3D9] border border-white/10 font-bold text-xs flex items-center justify-center min-h-[46px] min-w-[46px]"
        title="Como Chegar (GPS)"
      >
        <Navigation className="w-4 h-4 text-[#FFA82A]" />
      </a>
    </div>
  );
}
