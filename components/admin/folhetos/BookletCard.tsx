'use client';

import React from 'react';
import {
  FileText,
  Calendar,
  Download,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { LiturgicalBooklet } from '@/types';

interface BookletCardProps {
  booklet: LiturgicalBooklet;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function BookletCard({
  booklet,
  onToggleActive,
  onDelete,
  isDeleting,
}: BookletCardProps) {
  const isFeatured = booklet.sunday_label === 'Próximo Domingo' || booklet.sunday_label === 'Domingo Atual';

  return (
    <Card
      className={`p-5 flex flex-col justify-between space-y-4 transition-all ${
        isFeatured
          ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/5 to-transparent ring-1 ring-amber-500/20'
          : 'border-[var(--dash-border)]'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant={isFeatured ? 'active' : 'default'}>
              {booklet.sunday_label}
            </Badge>

            <button
              onClick={() => onToggleActive(booklet.id, booklet.is_active)}
              className="text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Clique para alternar visibilidade pública"
            >
              {booklet.is_active ? (
                <span className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Ativo no Portal
                </span>
              ) : (
                <span className="text-[var(--dash-text-muted)] hover:text-rose-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Oculto
                </span>
              )}
            </button>
          </div>

          <span className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {booklet.celebration_date}
          </span>
        </div>

        <div>
          <div className="flex items-start gap-2.5">
            <FileText className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--dash-text-primary)] leading-snug">
                {booklet.title}
              </h3>
              {booklet.theme && (
                <p className="text-xs text-[var(--dash-text-secondary)] italic mt-1">
                  Tema: {booklet.theme}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[var(--dash-text-secondary)] flex items-center gap-3 pt-1">
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3 text-amber-500" />
            <strong>{booklet.download_count}</strong> downloads
          </span>
          {booklet.pdf_url && (
            <span className="text-[var(--dash-text-muted)] truncate max-w-[200px]">
              PDF pronto na nuvem
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--dash-border)] flex items-center justify-between gap-2">
        {booklet.pdf_url ? (
          <a
            href={booklet.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--dash-border)] hover:border-amber-500 text-xs font-semibold text-[var(--dash-text-secondary)] hover:text-amber-500 transition-all"
            title="Abrir arquivo PDF oficial"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visualizar</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </a>
        ) : (
          <span className="text-xs text-[var(--dash-text-muted)] italic">
            Sem PDF anexado
          </span>
        )}

        <button
          onClick={() => onDelete(booklet.id)}
          disabled={isDeleting}
          className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
          title="Remover folheto"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </Card>
  );
}
