'use client';

import React from 'react';
import Link from 'next/link';
import {
  Star,
  Calendar,
  Edit3,
  Trash2,
  ExternalLink,
  Church,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
  Loader2
} from 'lucide-react';
import { PastoralMessage } from '@/types';
import { Badge } from '@/components/ui';

interface MessageCardProps {
  message: PastoralMessage;
  onSetFeatured: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (message: PastoralMessage) => void;
  onDelete: (id: string) => void;
  isActionLoading?: boolean;
}

export function MessageCard({
  message,
  onSetFeatured,
  onToggleActive,
  onEdit,
  onDelete,
  isActionLoading = false,
}: MessageCardProps) {
  const publishedDateFormatted = message.published_at
    ? new Date(message.published_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Data não informada';

  return (
    <div
      className={`p-5 rounded-2xl bg-[var(--dash-surface)] border transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 ${
        message.is_featured_home
          ? 'border-amber-500/50 ring-1 ring-amber-500/20'
          : 'border-[var(--dash-border)]'
      } ${!message.is_active ? 'opacity-70 bg-[var(--dash-surface-secondary)]/50' : ''}`}
    >
      <div className="space-y-2.5 flex-1">
        {/* Badges de Identificação */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              message.author_type === 'bispo'
                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}
          >
            {message.author_type === 'bispo' ? (
              <Church className="w-3 h-3" />
            ) : (
              <UserCheck className="w-3 h-3" />
            )}
            {message.author_type === 'bispo'
              ? 'Palavra do Bispo'
              : message.author_type === 'paroco'
              ? 'Palavra do Pároco'
              : 'Palavra dos Vigários'}
          </span>

          {message.is_featured_home && (
            <Badge variant="active" icon={<Star className="w-3 h-3 fill-current" />}>
              Destaque na Home
            </Badge>
          )}

          {!message.is_active && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
              <EyeOff className="w-3 h-3" />
              Rascunho
            </span>
          )}

          {message.liturgical_season && (
            <span className="text-xs text-[var(--dash-text-secondary)]">
              • {message.liturgical_season}
            </span>
          )}
        </div>

        {/* Título */}
        <h2 className="text-base sm:text-lg font-bold text-[var(--dash-text-primary)] leading-snug">
          {message.title}
        </h2>

        {/* Citação / Subtítulo */}
        {message.subtitle && (
          <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-1 italic">
            &ldquo;{message.subtitle}&rdquo;
          </p>
        )}

        {/* Metadados do Autor e Data */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--dash-text-secondary)] pt-1">
          <span>
            Por:{' '}
            <strong className="text-[var(--dash-text-primary)] font-semibold">
              {message.author_name}
            </strong>{' '}
            <span className="text-[11px] opacity-80">({message.author_title})</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {publishedDateFormatted}
          </span>
          <span>•</span>
          <span className="font-mono text-[11px] text-[var(--dash-text-secondary)]/80">
            /mensagens/{message.slug}
          </span>
        </div>
      </div>

      {/* Ações da Mensagem */}
      <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--dash-border)]">
        {/* Botão de Destaque na Home */}
        {!message.is_featured_home ? (
          <button
            onClick={() => onSetFeatured(message.id)}
            disabled={isActionLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--dash-border)] hover:border-amber-500 text-xs font-semibold text-[var(--dash-text-secondary)] hover:text-amber-500 transition-all cursor-pointer disabled:opacity-50"
            title="Exibir esta mensagem no card principal da Home"
          >
            <Star className="w-3.5 h-3.5" />
            <span>Destacar na Home</span>
          </button>
        ) : (
          <span className="text-xs font-bold text-amber-500 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            Ativo na Home
          </span>
        )}

        {/* Visibilidade (Ativo/Oculto) */}
        <button
          onClick={() => onToggleActive(message.id, message.is_active)}
          disabled={isActionLoading}
          className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] transition-colors cursor-pointer"
          title={message.is_active ? 'Ocultar mensagem do portal' : 'Publicar mensagem no portal'}
        >
          {message.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-zinc-400" />}
        </button>

        {/* Link Externo para Visualizar no Portal */}
        <Link
          href={`/mensagens/${message.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] transition-colors"
          title="Ver página da mensagem no portal do fiel"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>

        {/* Botão Editar */}
        <button
          onClick={() => onEdit(message)}
          disabled={isActionLoading}
          className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--dash-surface-secondary)] transition-colors cursor-pointer"
          title="Editar mensagem"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        {/* Botão Deletar */}
        <button
          onClick={() => onDelete(message.id)}
          disabled={isActionLoading}
          className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          title="Remover mensagem"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
