'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Church,
  MapPin,
  Map as MapIcon,
  LayoutGrid,
  Filter,
  Sparkles,
  X
} from 'lucide-react';
import { Community, MassSchedule } from '@/types';
import { CommunityCard } from './CommunityCard';
import { CommunitiesMap } from './CommunitiesMap';

interface CommunitiesDirectoryProps {
  communities: Community[];
  schedules?: MassSchedule[];
}

type CategoryFilter = 'todas' | 'matriz' | 'cebs' | 'grupos';

export function CommunitiesDirectory({ communities, schedules = [] }: CommunitiesDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('todas');
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'both'>('grid');
  const [focusedCommunityId, setFocusedCommunityId] = useState<string | undefined>(undefined);

  // Filtros combinados de busca e categoria
  const filteredCommunities = useMemo(() => {
    return communities.filter((comm) => {
      // 1. Filtro de Categoria
      const isMatriz = comm.is_headquarters;
      const isGrupo = comm.name.toLowerCase().includes('grupo') || comm.name.toLowerCase().includes('reflexão');

      if (selectedCategory === 'matriz' && !isMatriz) return false;
      if (selectedCategory === 'cebs' && (isMatriz || isGrupo)) return false;
      if (selectedCategory === 'grupos' && !isGrupo) return false;

      // 2. Filtro de Busca Textual
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      const matchName = comm.name.toLowerCase().includes(query);
      const matchPatron = comm.patron_saint?.toLowerCase().includes(query) || false;
      const matchNeighborhood = comm.neighborhood?.toLowerCase().includes(query) || false;
      const matchAddress = comm.address?.toLowerCase().includes(query) || false;
      const matchCity = comm.city.toLowerCase().includes(query);

      return matchName || matchPatron || matchNeighborhood || matchAddress || matchCity;
    });
  }, [communities, searchQuery, selectedCategory]);

  const handleSelectOnMap = (community: Community) => {
    setFocusedCommunityId(community.id);
    if (viewMode === 'grid') {
      setViewMode('both');
    }
    // Scroll suave até o container do mapa
    const mapElement = document.getElementById('mapa-diocesano');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Barra de Filtros, Busca & Modos de Visualização */}
      <div className="bg-[var(--dash-surface)] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--dash-border)] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          {/* Campo de Busca Rápida */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dash-text-muted)]" />
            <input
              type="text"
              placeholder="Buscar por capela, padroeiro, bairro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border)] text-sm text-[var(--dash-text-primary)] placeholder-[var(--dash-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40 transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)]"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Alternância de Modo de Visualização */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-[var(--dash-bg)] p-1 rounded-xl border border-[var(--dash-border)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[40px] ${
                viewMode === 'grid'
                  ? 'bg-[var(--dash-surface)] text-[#8B1E22] dark:text-[#FFA82A] shadow-xs border border-[var(--dash-border)]'
                  : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[40px] ${
                viewMode === 'map'
                  ? 'bg-[var(--dash-surface)] text-[#8B1E22] dark:text-[#FFA82A] shadow-xs border border-[var(--dash-border)]'
                  : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Mapa</span>
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`hidden sm:flex px-3 py-1.5 rounded-lg text-xs font-semibold items-center gap-1.5 transition-all min-h-[40px] ${
                viewMode === 'both'
                  ? 'bg-[var(--dash-surface)] text-[#8B1E22] dark:text-[#FFA82A] shadow-xs border border-[var(--dash-border)]'
                  : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
              }`}
            >
              <Church className="w-3.5 h-3.5" />
              <span>Ambos</span>
            </button>
          </div>
        </div>

        {/* Chips de Categoria Litúrgica */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--dash-border)]">
          <span className="text-xs font-semibold text-[var(--dash-text-muted)] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Filtrar:
          </span>

          <button
            onClick={() => setSelectedCategory('todas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all min-h-[36px] ${
              selectedCategory === 'todas'
                ? 'bg-[#8B1E22] text-white shadow-2xs'
                : 'bg-[var(--dash-bg)] text-[var(--dash-text-secondary)] hover:bg-[var(--dash-surface)] border border-[var(--dash-border)]'
            }`}
          >
            Todas as Capelas ({communities.length})
          </button>

          <button
            onClick={() => setSelectedCategory('matriz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all min-h-[36px] ${
              selectedCategory === 'matriz'
                ? 'bg-[#8B1E22] text-white shadow-2xs'
                : 'bg-[var(--dash-bg)] text-[var(--dash-text-secondary)] hover:bg-[var(--dash-surface)] border border-[var(--dash-border)]'
            }`}
          >
            Igreja Matriz (1)
          </button>

          <button
            onClick={() => setSelectedCategory('cebs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all min-h-[36px] ${
              selectedCategory === 'cebs'
                ? 'bg-[#8B1E22] text-white shadow-2xs'
                : 'bg-[var(--dash-bg)] text-[var(--dash-text-secondary)] hover:bg-[var(--dash-surface)] border border-[var(--dash-border)]'
            }`}
          >
            Comunidades Eclesiais (10)
          </button>

          <button
            onClick={() => setSelectedCategory('grupos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all min-h-[36px] ${
              selectedCategory === 'grupos'
                ? 'bg-[#8B1E22] text-white shadow-2xs'
                : 'bg-[var(--dash-bg)] text-[var(--dash-text-secondary)] hover:bg-[var(--dash-surface)] border border-[var(--dash-border)]'
            }`}
          >
            Grupos de Reflexão (1)
          </button>
        </div>
      </div>

      {/* Seção do Mapa Diocesano (Modo Map ou Both) */}
      {(viewMode === 'map' || viewMode === 'both') && (
        <section id="mapa-diocesano" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--dash-text-primary)]">
              Localização Geográfica das Capelas
            </h3>
            <span className="text-xs text-[var(--dash-text-muted)]">
              Pins com GPS e integração Google Maps/Waze
            </span>
          </div>

          <CommunitiesMap
            communities={filteredCommunities}
            selectedCommunityId={focusedCommunityId}
          />
        </section>
      )}

      {/* Seção da Grade de Cards (Modo Grid ou Both) */}
      {(viewMode === 'grid' || viewMode === 'both') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--dash-text-muted)]">
              Exibindo <span className="font-bold text-[var(--dash-text-primary)]">{filteredCommunities.length}</span> de {communities.length} comunidades
            </p>
          </div>

          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  schedules={schedules}
                  onSelectOnMap={handleSelectOnMap}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-3">
              <Church className="w-10 h-10 text-[var(--dash-text-muted)] mx-auto" />
              <h4 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)]">
                Nenhuma comunidade encontrada
              </h4>
              <p className="text-xs text-[var(--dash-text-muted)] max-w-sm mx-auto">
                Tente buscar por outro termo ou limpe os filtros para visualizar as 12 capelas da Catedral.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('todas');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#8B1E22] text-white hover:bg-[#721C24] transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
