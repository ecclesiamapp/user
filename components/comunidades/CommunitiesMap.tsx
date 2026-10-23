'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Compass,
  Church,
  ExternalLink,
  ChevronRight,
  Layers,
  Map as MapIcon,
  Sparkles,
  Eye,
  Info
} from 'lucide-react';
import { Community } from '@/types';
import { getCommunitySlug } from '@/lib/communities';

interface CommunitiesMapProps {
  communities: Community[];
  selectedCommunityId?: string;
  onSelectCommunity?: (community: Community) => void;
}

export function CommunitiesMap({
  communities,
  selectedCommunityId,
  onSelectCommunity
}: CommunitiesMapProps) {
  const [activeId, setActiveId] = useState<string>(
    selectedCommunityId || communities.find((c) => c.is_headquarters)?.id || communities[0]?.id || ''
  );
  const [mapMode, setMapMode] = useState<'vector' | 'satellite'>('vector');

  const activeCommunity = useMemo(() => {
    return communities.find((c) => c.id === activeId) || communities[0];
  }, [communities, activeId]);

  // Limites geográficos aproximados da área urbana de Colatina/ES
  const minLat = -19.555;
  const maxLat = -19.516;
  const minLng = -40.648;
  const maxLng = -40.610;

  const getPositionPercent = (lat?: number, lng?: number, fallbackIndex = 0) => {
    if (lat && lng) {
      const x = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 78 + 11, 8), 92);
      const y = Math.min(Math.max(((maxLat - lat) / (maxLat - minLat)) * 74 + 13, 10), 90);
      return { x, y };
    }
    // Fallback em grade suave se coordenadas não estiverem presentes
    const col = fallbackIndex % 4;
    const row = Math.floor(fallbackIndex / 4);
    return { x: 18 + col * 22, y: 22 + row * 26 };
  };

  const destinationQuery = activeCommunity
    ? encodeURIComponent(`${activeCommunity.name}, ${activeCommunity.address || ''}, Colatina - ES`)
    : '';

  const googleMapsUrl = activeCommunity?.latitude && activeCommunity?.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${activeCommunity.latitude},${activeCommunity.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${destinationQuery}`;

  const wazeUrl = activeCommunity?.latitude && activeCommunity?.longitude
    ? `https://waze.com/ul?ll=${activeCommunity.latitude},${activeCommunity.longitude}&navigate=yes`
    : `https://waze.com/ul?q=${destinationQuery}`;

  const slug = activeCommunity ? getCommunitySlug(activeCommunity) : 'catedral-matriz';

  return (
    <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)] overflow-hidden shadow-lg space-y-0">
      {/* Barra Superior de Controles do Mapa */}
      <div className="p-4 sm:p-5 bg-[var(--dash-bg)]/80 border-b border-[var(--dash-border)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#8B1E22]/10 dark:bg-[#8B1E22]/30 text-[#8B1E22] dark:text-[#FFA82A] flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-[var(--dash-text-primary)]">
              Mapa Diocesano das 12 Comunidades
            </h3>
            <p className="text-[11px] text-[var(--dash-text-muted)]">
              Região Pastoral de Colatina/ES • Vale do Rio Doce
            </p>
          </div>
        </div>

        {/* Alternância de Modo (Vetor Diocesano vs Iframe Dinâmico) */}
        <div className="flex items-center gap-1 bg-[var(--dash-surface)] p-1 rounded-xl border border-[var(--dash-border)]">
          <button
            onClick={() => setMapMode('vector')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] flex items-center gap-1.5 ${
              mapMode === 'vector'
                ? 'bg-[#8B1E22] text-white shadow-xs'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Mapa Diocesano</span>
          </button>
          <button
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] flex items-center gap-1.5 ${
              mapMode === 'satellite'
                ? 'bg-[#8B1E22] text-white shadow-xs'
                : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Navegador GPS</span>
          </button>
        </div>
      </div>

      {/* Área Central do Mapa */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] min-h-[340px] max-h-[520px] bg-gradient-to-b from-[#1C1715] to-[#120E0D] overflow-hidden select-none">
        {mapMode === 'vector' ? (
          <div className="absolute inset-0">
            {/* SVG Decorativo do relevo e Rio Doce em Colatina */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 500"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#2563EB" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.4" />
                </linearGradient>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
              </defs>

              <rect width="800" height="500" fill="url(#gridPattern)" />

              {/* Rio Doce atravessando a cidade de Colatina */}
              <path
                d="M 0,210 C 150,220 220,290 350,270 C 480,250 560,330 800,280"
                fill="none"
                stroke="url(#riverGrad)"
                strokeWidth="28"
                strokeLinecap="round"
              />
              <path
                d="M 0,210 C 150,220 220,290 350,270 C 480,250 560,330 800,280"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeDasharray="6 6"
                opacity="0.6"
              />

              {/* Rótulo Rio Doce */}
              <text x="320" y="260" fill="#93C5FD" fontSize="11" fontFamily="sans-serif" opacity="0.6" letterSpacing="2">
                RIO DOCE
              </text>
            </svg>

            {/* Pins Interativos de cada uma das 12 CEBs */}
            {communities.map((comm, idx) => {
              const { x, y } = getPositionPercent(comm.latitude, comm.longitude, idx);
              const isSelected = comm.id === activeId;
              const isMatriz = comm.is_headquarters;

              return (
                <button
                  key={comm.id}
                  onClick={() => {
                    setActiveId(comm.id);
                    if (onSelectCommunity) onSelectCommunity(comm);
                  }}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={`${comm.name} (${comm.neighborhood || comm.city})`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none z-10 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                  aria-label={`Selecionar ${comm.name}`}
                >
                  {/* Pulso de destaque se selecionado */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-full bg-[#FFA82A] animate-ping opacity-70 pointer-events-none" />
                  )}

                  <div
                    className={`relative flex items-center justify-center rounded-full p-2 shadow-xl border transition-all ${
                      isMatriz
                        ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white border-[#FFA82A] ring-2 ring-amber-300/60'
                        : isSelected
                        ? 'bg-[#8B1E22] text-white border-white ring-2 ring-[#FFA82A]'
                        : 'bg-[#2A201C] hover:bg-[#8B1E22] text-amber-200 border-amber-900/60'
                    }`}
                  >
                    {isMatriz ? <Church className="w-4 h-4" /> : <MapPin className="w-3.5 h-3.5" />}
                  </div>

                  {/* Nome da Comunidade em balão flutuante */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all shadow-md pointer-events-none ${
                      isSelected
                        ? 'bg-[#FFA82A] text-[#2D1A16] opacity-100 z-30'
                        : 'bg-black/80 text-white/90 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {comm.is_headquarters ? 'Matriz' : comm.name.replace('Comunidade ', '')}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-stone-900">
            {/* Visualização de Mapa OpenStreetMap / Iframe sem API key externa */}
            <iframe
              title={`Mapa de ${activeCommunity.name}`}
              className="w-full h-full border-0"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                (activeCommunity.longitude || -40.63056) - 0.012
              }%2C${(activeCommunity.latitude || -19.53585) - 0.008}%2C${
                (activeCommunity.longitude || -40.63056) + 0.012
              }%2C${(activeCommunity.latitude || -19.53585) + 0.008}&layer=mapnik&marker=${
                activeCommunity.latitude || -19.53585
              }%2C${activeCommunity.longitude || -40.63056}`}
            />
          </div>
        )}

        {/* Legenda rápida sobreposta no mapa */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-white/80 flex items-center gap-2 pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Toque em um pin para traçar rotas</span>
        </div>
      </div>

      {/* Painel Inferior: Detalhes da Comunidade Ativa com Botões GPS */}
      {activeCommunity && (
        <div className="p-4 sm:p-6 bg-[var(--dash-surface)] border-t border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A]">
                {activeCommunity.is_headquarters ? 'Igreja Matriz' : 'Comunidade Eclesial'}
              </span>
              <span className="text-xs text-[var(--dash-text-muted)]">
                {activeCommunity.neighborhood || activeCommunity.city}
              </span>
            </div>
            <h4 className="font-cinzel text-lg font-bold text-[var(--dash-text-primary)]">
              {activeCommunity.name}
            </h4>
            <p className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8B1E22] shrink-0" />
              <span>{activeCommunity.address || 'Colatina/ES'}</span>
            </p>
          </div>

          {/* Botões de Ação Imediata */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#8B1E22] hover:bg-[#721C24] text-white px-3.5 py-2.5 rounded-xl transition-all shadow-sm min-h-[44px]"
            >
              <Navigation className="w-4 h-4" />
              <span>Google Maps</span>
            </a>

            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-cyan-700 hover:bg-cyan-800 text-white px-3.5 py-2.5 rounded-xl transition-all shadow-sm min-h-[44px]"
            >
              <Compass className="w-4 h-4" />
              <span>Waze</span>
            </a>

            <Link
              href={`/comunidades/${slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--dash-text-primary)] hover:text-[#8B1E22] bg-[var(--dash-bg)] border border-[var(--dash-border)] px-3 py-2.5 rounded-xl transition-all min-h-[44px]"
            >
              <span>Ver Comunidade</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
