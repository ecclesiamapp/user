import React from 'react';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';
import { Card } from '@/components/ui';
import { Community } from '@/types';

interface CommunityLocationSectionProps {
  community: Community;
  googleMapsUrl?: string;
  wazeUrl?: string;
}

export function CommunityLocationSection({
  community,
  googleMapsUrl,
  wazeUrl,
}: CommunityLocationSectionProps) {
  return (
    <Card className="space-y-6 border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--dash-border)]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--dash-text-primary)]">
              Como Chegar & Localização
            </h2>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              Acesso fácil à {community.name} no {community.neighborhood || community.city}
            </p>
          </div>
        </div>

        {/* Botões Rápidos de GPS */}
        <div className="flex flex-wrap items-center gap-2.5">
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#2D1A16] font-bold text-xs uppercase tracking-wide transition-all shadow-xs min-h-[44px]"
            >
              <Navigation className="w-4 h-4" />
              <span>Google Maps</span>
            </a>
          )}
          {wazeUrl && (
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--dash-surface-secondary)] hover:bg-[var(--dash-border)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] font-semibold text-xs transition-all min-h-[44px]"
            >
              <ExternalLink className="w-4 h-4 text-amber-500" />
              <span>Waze</span>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Dados do Endereço */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Endereço Físico
              </span>
              <p className="font-semibold text-sm text-[var(--dash-text-primary)]">
                {community.address || 'Consultar secretaria da Catedral'}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--dash-border)] flex flex-wrap gap-4 text-[var(--dash-text-secondary)]">
              <div>
                <span className="block text-[10px] uppercase text-[var(--dash-text-muted)]">Bairro</span>
                <span className="font-medium text-[var(--dash-text-primary)]">{community.neighborhood || 'Centro'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-[var(--dash-text-muted)]">Cidade / UF</span>
                <span className="font-medium text-[var(--dash-text-primary)]">{community.city} - {community.state}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            A comunidade conta com fácil acesso para veículos e pedestres, com estacionamento nas ruas laterais e acessibilidade.
          </p>
        </div>

        {/* Visualizador / Preview Gráfico de Mapa */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl overflow-hidden border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] h-48 sm:h-56 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="space-y-1 max-w-sm">
              <p className="text-xs font-bold text-[var(--dash-text-primary)]">
                Coordenadas Geográficas Verificadas
              </p>
              <p className="text-[11px] text-[var(--dash-text-secondary)]">
                Latitude: {community.latitude || '-19.53585'} • Longitude: {community.longitude || '-40.63056'}
              </p>
            </div>
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-semibold underline underline-offset-4"
              >
                <span>Abrir visualização completa no mapa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
