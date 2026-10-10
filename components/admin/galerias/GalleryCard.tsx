'use client';

import React from 'react';
import {
  Calendar,
  MapPin,
  Image as ImageIcon,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Church
} from 'lucide-react';
import { Gallery } from '@/types';
import { Badge } from '@/components/ui';

interface GalleryCardProps {
  gallery: Gallery;
  onEdit: (gallery: Gallery) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  isActionLoading?: boolean;
}

export function GalleryCard({
  gallery,
  onEdit,
  onDelete,
  onToggleActive,
  isActionLoading = false,
}: GalleryCardProps) {
  const eventDateFormatted = gallery.event_date
    ? new Date(gallery.event_date + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Data não informada';

  const photoCount = Array.isArray(gallery.photos)
    ? gallery.photos.length
    : gallery.photos_count || 0;

  return (
    <div
      className={`rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-[var(--dash-border-hover,rgba(255,255,255,0.2))] shadow-xs ${
        !gallery.is_active ? 'opacity-65 bg-[var(--dash-surface-secondary)]/40' : ''
      }`}
    >
      <div>
        {/* Imagem de Capa do Álbum */}
        <div className="relative h-44 w-full bg-[var(--dash-surface-secondary)] overflow-hidden">
          {gallery.cover_image_url ? (
            <img
              src={gallery.cover_image_url}
              alt={gallery.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--dash-text-secondary)] gap-2">
              <ImageIcon className="w-10 h-10 opacity-40" />
              <span className="text-xs">Sem foto de capa</span>
            </div>
          )}

          {/* Badge de Quantidade de Fotos Sobreposta */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{photoCount} fotos</span>
          </div>

          {/* Badge de Status Ativo/Inativo */}
          <div className="absolute top-3 left-3">
            <Badge variant={gallery.is_active ? 'active' : 'inactive'}>
              {gallery.is_active ? 'Publicado' : 'Oculto'}
            </Badge>
          </div>
        </div>

        {/* Informações do Álbum */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>{eventDateFormatted}</span>
          </div>

          <h3 className="font-bold text-base leading-snug text-[var(--dash-text-primary)] line-clamp-1">
            {gallery.title}
          </h3>

          {gallery.description && (
            <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-2 leading-relaxed">
              {gallery.description}
            </p>
          )}

          <div className="pt-2 border-t border-[var(--dash-border)] flex items-center gap-1.5 text-xs text-[var(--dash-text-secondary)] truncate">
            <MapPin className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
            <span className="truncate font-medium text-[var(--dash-text-primary)]">
              {gallery.community?.name || 'Igreja Matriz (Geral)'}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Ações do Rodapé */}
      <div className="px-5 py-3 border-t border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/40 flex items-center justify-between text-xs">
        <span className="text-[11px] text-[var(--dash-text-secondary)]">Álbum Pastoral</span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleActive(gallery.id, gallery.is_active)}
            disabled={isActionLoading}
            title={gallery.is_active ? 'Ocultar Álbum' : 'Publicar Álbum'}
            className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)] transition-colors cursor-pointer"
          >
            {gallery.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onEdit(gallery)}
            disabled={isActionLoading}
            title="Editar Álbum"
            className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(gallery.id)}
            disabled={isActionLoading}
            title="Excluir Álbum"
            className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
