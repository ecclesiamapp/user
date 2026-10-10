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
      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 bg-[var(--dash-surface)] ${
        community.is_headquarters
          ? 'border-amber-500/40 ring-1 ring-amber-500/20 shadow-xs'
          : 'border-[var(--dash-border)] hover:border-[var(--dash-border-hover,rgba(255,255,255,0.2))]'
      } ${!community.is_active ? 'opacity-65 bg-[var(--dash-surface-secondary)]/50' : ''}`}
    >
      <div className="space-y-4">
        {/* Badges de Identificação e Ações Rápidas */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {community.is_headquarters ? (
              <Badge variant="matriz">Igreja Matriz (Sede)</Badge>
            ) : (
              <Badge variant="ceb">CEB / Capela</Badge>
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
        </div>
      </div>

      {/* Rodapé com Navegação para Horários e Minisite */}
      <div className="pt-3 mt-4 border-t border-[var(--dash-border)] flex items-center justify-between text-xs">
        {community.slug ? (
          <Link
            href={`/comunidades/${community.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Minisite</span>
          </Link>
        ) : (
          <span className="text-[var(--dash-text-secondary)]/50 text-[11px]">Sem minisite</span>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(community)}
            className="text-[var(--primary)] hover:underline font-semibold cursor-pointer"
          >
            Editar Conteúdo
          </button>
          <Link
            href={`/admin/horarios?community_id=${community.id}`}
            className="inline-flex items-center gap-1 text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] font-semibold transition-colors"
          >
            <span>Horários</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
