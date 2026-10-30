'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, ChevronRight, Share2, MapPin } from 'lucide-react';
import { ParishSpecialEvent, Community } from '@/types';
import { getEventTheme, formatEventDateRange, generateWhatsAppShareText } from '@/lib/events';

interface CommunitySpecialEventCardProps {
  community: Community;
  event: ParishSpecialEvent;
}

export function CommunitySpecialEventCard({ community, event }: CommunitySpecialEventCardProps) {
  const theme = getEventTheme(event);
  const dates = formatEventDateRange(event.start_date, event.end_date);
  const isCommunityHost = Boolean(event.community_id && event.community_id === community.id);

  const canonicalUrl = `https://catedraldecolatina.org.br/programacao/${event.slug}`;
  const [eventUrl, setEventUrl] = useState(canonicalUrl);

  useEffect(() => {
    setEventUrl(`${window.location.origin}/programacao/${event.slug}`);
  }, [event.slug]);

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${generateWhatsAppShareText(event, eventUrl)}`;

  return (
    <div 
      aria-label="Festividade em Destaque na Comunidade"
      className="mb-8 overflow-hidden rounded-2xl border shadow-md transition-all duration-300"
      style={{
        borderColor: `${theme.secondary}45`,
        background: `linear-gradient(135deg, ${theme.primary}20 0%, rgba(26, 29, 36, 0.95) 45%, rgba(18, 20, 26, 0.98) 100%)`,
      }}
    >
      <div className="p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Lado Esquerdo: Identidade do Destaque Comunitário */}
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border shadow-sm"
              style={{
                backgroundColor: `${theme.primary}40`,
                color: theme.accent === '#FFFFFF' ? '#F8FAFC' : theme.accent,
                borderColor: `${theme.secondary}60`
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
              <span>
                {isCommunityHost 
                  ? 'Festa Litúrgica da Nossa Comunidade' 
                  : 'Programação Solene da Paróquia'}
              </span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 text-zinc-300 text-[11px] border border-white/10 font-medium">
              <Calendar className="w-3 h-3 text-zinc-400" />
              <span>{dates}</span>
            </span>
          </div>

          <div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white uppercase tracking-wide leading-snug">
              {event.title}
            </h3>
            {event.motto && (
              <p className="text-xs sm:text-sm text-zinc-300/90 font-serif italic mt-1">
                "{event.motto}"
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {isCommunityHost ? (
              <span>
                Nossa comunidade convida todas as famílias, pastorais e fiéis para os dias de festa e oração em honra ao nosso padroeiro.
              </span>
            ) : (
              <span>
                Nossa comunidade e as 12 CEBs estão unidas para celebrar este grande momento de fé e fraternidade em nossa paróquia.
              </span>
            )}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-[#FFA82A] shrink-0" />
            <span>{event.community_name || 'Catedral Diocesana & Comunidades Eclesiais de Base'}</span>
          </div>
        </div>

        {/* Lado Direito: Ações CTA */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <Link
            href={`/programacao/${event.slug}`}
            className="w-full sm:w-auto md:w-full min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-950 flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            style={{
              backgroundColor: theme.secondary,
            }}
          >
            <span>Ver Programação</span>
            <ChevronRight className="w-4 h-4 text-slate-950" />
          </Link>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartilhar programação no WhatsApp"
            className="w-full sm:w-auto md:w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 active:scale-[0.98] text-white border border-white/15 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Convidar Vizinhos</span>
          </a>
        </div>
      </div>
    </div>
  );
}
