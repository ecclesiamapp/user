'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  User,
  ChevronRight,
  Edit3,
  Calendar,
  Sparkles,
  ExternalLink,
  Church,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { Community } from '@/types';
import { Badge, Button } from '@/components/ui';

interface CommunityCardProps {
  community: Community;
  onEdit: (community: Community) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  isActionLoading?: boolean;
}

export function CommunityCard({
  community,
  onEdit,
  onToggleActive,
  isActionLoading = false,
}: CommunityCardProps) {
  return (
    <div
      className={`rounded-2xl border flex flex-col justify-between transition-all duration-200 overflow-hidden bg-[var(--dash-surface)] ${
        community.is_headquarters
          ? 'border-amber-500/40 ring-1 ring-amber-500/20 shadow-xs'
          : 'border-[var(--dash-border)] hover:border-[var(--dash-border-hover,rgba(255,255,255,0.2))]'
      } ${!community.is_active ? 'opacity-65 bg-[var(--dash-surface-secondary)]/50' : ''}`}
    >
      {community.image_url ? (
        <div className="relative h-32 w-full bg-[var(--dash-surface-secondary)] overflow-hidden border-b border-[var(--dash-border)]">
          <img
            src={community.image_url}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : null}

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Badges de Identificação e Ações Rápidas */}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {community.is_headquarters ? (
              <Badge variant="matriz">Igreja Matriz (Sede)</Badge>
            ) : (
              <Badge variant="ceb">Comunidade (CEB)</Badge>
            )}
            <Badge variant={community.is_active ? 'active' : 'inactive'}>
              {community.is_active ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleActive(community.id, community.is_active)}
              disabled={isActionLoading}
              title={community.is_active ? 'Desativar Comunidade' : 'Ativar Comunidade'}
              className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)] transition-colors cursor-pointer"
            >
              {community.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onEdit(community)}
              disabled={isActionLoading}
              title="Editar Comunidade"
              className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título e Padroeiro */}
        <div>
          <h2 className="text-base font-bold leading-snug line-clamp-1 text-[var(--dash-text-primary)]">
            {community.name}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--dash-text-secondary)]">
            <span>Padroeiro(a):</span>
            <span className="font-semibold text-[var(--dash-text-primary)] truncate">
              {community.patron_saint || 'Não informado'}
            </span>
          </div>
        </div>

        {/* Informações Históricas e Litúrgicas */}
        {(community.foundation_year || community.feast_day) && (
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--dash-text-secondary)] pt-1">
            {community.foundation_year && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Fundada em {community.foundation_year}
              </span>
            )}
            {community.feast_day && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
                <Calendar className="w-3 h-3 text-emerald-400" />
                Festa: {community.feast_day}
              </span>
            )}
          </div>
        )}

        {/* Localização e Contato */}
        <div className="pt-2 border-t border-[var(--dash-border)] space-y-1.5 text-xs text-[var(--dash-text-secondary)]">
          <p className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--primary)]" />
            <span className="truncate">
              {community.neighborhood ? `${community.neighborhood}, ` : ''}{community.city} - {community.state}
            </span>
          </p>

          {community.contact_name && (
            <p className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-secondary)]" />
              <span className="truncate">{community.contact_name}</span>
            </p>
          )}

          {community.contact_phone && (
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-secondary)]" />
              <span>{community.contact_phone}</span>
            </p>
          )}

          {/* Módulos Configurados da LP */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
            {community.banner_url && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Altar Cadastrado
              </span>
            )}
            {Array.isArray(community.cpc_leaders) && community.cpc_leaders.length > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {community.cpc_leaders.length} CPC
              </span>
            )}
            {Array.isArray(community.notices) && community.notices.length > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {community.notices.length} Avisos
              </span>
            )}
            {Array.isArray(community.pastoral_groups) && community.pastoral_groups.length > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 border border-purple-500/20">
                {community.pastoral_groups.length} Pastorais
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rodapé com Navegação para Horários e Minisite */}
      <div className="px-5 sm:px-6 py-3 border-t border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/30 flex items-center justify-between text-xs mt-auto">
        {community.slug ? (
          <Link
            href={`/comunidades/${community.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] transition-all min-h-[36px]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            <span>Ver Minisite</span>
          </Link>
        ) : (
          <span className="text-[var(--dash-text-secondary)]/50 text-[11px] px-2.5 py-1.5">Sem minisite</span>
        )}

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onEdit(community)}
            className="px-2.5 py-1.5 rounded-lg text-[var(--primary)] hover:bg-[var(--primary)]/10 font-semibold cursor-pointer transition-all min-h-[36px]"
          >
            Editar Conteúdo
          </button>
          <Link
            href={`/admin/horarios?community_id=${community.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] font-semibold transition-all min-h-[36px]"
          >
            <span>Horários</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
