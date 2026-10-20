'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Church,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Navigation,
  Share2,
  Check,
  Compass,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { Community, MassSchedule } from '@/types';
import { getCommunitySlug } from '@/lib/communities';

interface CommunityCardProps {
  community: Community;
  schedules?: MassSchedule[];
  onSelectOnMap?: (community: Community) => void;
}

export function CommunityCard({ community, schedules = [], onSelectOnMap }: CommunityCardProps) {
  const [copied, setCopied] = useState(false);
  const slug = getCommunitySlug(community);

  // Filtra horários específicos desta comunidade
  const communitySchedules = schedules.filter((s) => {
    if (s.community_id === community.id) return true;
    if (community.is_headquarters && (s.id.startsWith('sch-matriz') || s.location_name?.toLowerCase().includes('matriz'))) return true;
    const nameLower = community.name.toLowerCase();
    if (s.location_name && nameLower.includes(s.location_name.toLowerCase())) return true;
    return false;
  }).slice(0, 2); // Exibe até 2 horários no card resumido

  const destinationQuery = encodeURIComponent(
    `${community.name}, ${community.address || ''}, ${community.neighborhood || ''}, Colatina - ES`
  );

  const googleMapsUrl = community.latitude && community.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${community.latitude},${community.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${destinationQuery}`;

  const wazeUrl = community.latitude && community.longitude
    ? `https://waze.com/ul?ll=${community.latitude},${community.longitude}&navigate=yes`
    : `https://waze.com/ul?q=${destinationQuery}`;

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fullText = `${community.name} - ${community.address || ''}, ${community.neighborhood || ''}, Colatina/ES`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGrupoReflexao = community.name.toLowerCase().includes('grupo') || community.name.toLowerCase().includes('reflexão');

  return (
    <Card
      className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
        community.is_headquarters
          ? 'bg-[var(--dash-surface)] border-[#FFA82A]/70 ring-2 ring-[#FFA82A]/20'
          : 'bg-[var(--dash-surface)] border-[var(--dash-border)] hover:border-[#8B1E22]/50'
      }`}
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Cabeçalho do Card: Badges e Bairro */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {community.is_headquarters ? (
              <Badge variant="matriz" className="text-xs font-bold uppercase tracking-wider">
                Igreja Matriz
              </Badge>
            ) : isGrupoReflexao ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3 h-3" />
                Grupo de Reflexão
              </span>
            ) : (
              <Badge variant="ceb" className="text-xs font-medium">
                Comunidade Eclesial
              </Badge>
            )}
            {community.foundation_year && (
              <span className="text-[11px] font-medium text-[var(--dash-text-muted)] bg-[var(--dash-bg)] px-2 py-0.5 rounded-full border border-[var(--dash-border)]">
                Desde {community.foundation_year}
              </span>
            )}
          </div>

          <span className="text-xs font-medium text-[var(--dash-text-secondary)] shrink-0">
            {community.neighborhood || community.city}
          </span>
        </div>

        {/* Título & Padroeiro */}
        <div>
          <h3 className="font-cinzel text-lg font-bold text-[var(--dash-text-primary)] leading-snug">
            <Link
              href={`/comunidades/${slug}`}
              className="hover:text-[#8B1E22] dark:hover:text-[#FFA82A] transition-colors"
            >
              {community.name}
            </Link>
          </h3>

          {community.patron_saint && (
            <p className="text-xs text-[var(--dash-text-secondary)] mt-1 flex items-center gap-1.5">
              <span>Padroeiro(a):</span>
              <span className="font-semibold text-[#8B1E22] dark:text-[#FFA82A]">
                {community.patron_saint}
              </span>
              {community.feast_day && (
                <span className="text-[11px] text-[var(--dash-text-muted)]">
                  • {community.feast_day}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Endereço */}
        {community.address && (
          <div className="flex items-start gap-2 text-xs text-[var(--dash-text-secondary)] bg-[var(--dash-bg)]/60 p-2.5 rounded-xl border border-[var(--dash-border)]">
            <MapPin className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{community.address}</p>
              <p className="text-[11px] text-[var(--dash-text-muted)]">
                {community.neighborhood ? `${community.neighborhood}, ` : ''}{community.city} - {community.state}
              </p>
            </div>
            <button
              onClick={handleCopyAddress}
              title="Copiar endereço"
              className="p-1.5 rounded-lg hover:bg-[var(--dash-surface)] text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] transition-colors"
              aria-label="Copiar endereço"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Horários de Missas e Celebrações da Comunidade */}
        {communitySchedules.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">
              <Clock className="w-3 h-3 text-[#8B1E22]" />
              <span>Celebrações & Missas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {communitySchedules.map((sch) => (
                <div
                  key={sch.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--dash-bg)] border border-[var(--dash-border)] text-xs font-medium text-[var(--dash-text-primary)]"
                >
                  <span className="font-semibold text-[#8B1E22] dark:text-[#FFA82A]">
                    {sch.day_of_week.split('-')[0]}:
                  </span>
                  <span>{sch.time}</span>
                  <span className="text-[10px] text-[var(--dash-text-muted)]">
                    ({sch.type === 'missa' ? 'Missa' : 'Celebração'})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ações do Rodapé do Card: Rotas GPS & Conhecer Capela */}
      <div className="p-4 bg-[var(--dash-bg)]/40 border-t border-[var(--dash-border)] flex items-center justify-between gap-2">
        <Link
          href={`/comunidades/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] hover:opacity-80 transition-opacity min-h-[44px] px-2 rounded-xl"
        >
          <span>Conhecer Capela</span>
          <ChevronRight className="w-4 h-4" />
        </Link>

        {/* Botões GPS (Google Maps e Waze) */}
        <div className="flex items-center gap-1.5">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Navegar com Google Maps"
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--dash-text-secondary)] hover:text-[#2D1A16] dark:hover:text-[#FFA82A] bg-[var(--dash-surface)] hover:bg-[var(--dash-surface)]/80 border border-[var(--dash-border)] px-2.5 py-2 rounded-xl transition-all shadow-2xs min-h-[44px]"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden xs:inline">Maps</span>
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Navegar com Waze"
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--dash-text-secondary)] hover:text-[#2D1A16] dark:hover:text-[#FFA82A] bg-[var(--dash-surface)] hover:bg-[var(--dash-surface)]/80 border border-[var(--dash-border)] px-2.5 py-2 rounded-xl transition-all shadow-2xs min-h-[44px]"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden xs:inline">Waze</span>
          </a>

          {onSelectOnMap && (
            <button
              onClick={() => onSelectOnMap(community)}
              title="Localizar no Mapa"
              className="p-2 rounded-xl bg-[var(--dash-surface)] hover:bg-[var(--dash-surface)]/80 border border-[var(--dash-border)] text-[var(--dash-text-secondary)] hover:text-[#8B1E22] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Ver no Mapa"
            >
              <MapPin className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
