import React from 'react';
import { Bell, Calendar, Sparkles, Tag, AlertCircle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { CommunityNotice } from '@/types';

interface CommunityNoticesSectionProps {
  communityName: string;
  notices?: CommunityNotice[];
}

const categoryLabels: Record<string, { label: string; className: string }> = {
  liturgia: { label: 'Liturgia', className: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  formacao: { label: 'Catequese & Formação', className: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  mutirao: { label: 'Mutirão & Obras', className: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  festa: { label: 'Festa de Padroeiro', className: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  aviso: { label: 'Aviso Paroquial', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
};

export function CommunityNoticesSection({ communityName, notices = [] }: CommunityNoticesSectionProps) {
  if (!notices || notices.length === 0) {
    return null;
  }

  return (
    <Card className="space-y-5 border border-[var(--dash-border)] bg-[var(--dash-surface)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--dash-border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--dash-text-primary)]">Mural de Avisos da Comunidade</h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                {notices.length} {notices.length === 1 ? 'comunicado' : 'comunicados'}
              </span>
            </div>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              Informações, escalas e convites da comunidade {communityName}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5">
        {notices.map((notice) => {
          const categoryMeta = notice.category
            ? categoryLabels[notice.category] || categoryLabels.aviso
            : categoryLabels.aviso;

          return (
            <div
              key={notice.id}
              className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] hover:border-amber-500/30 transition-all space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] font-semibold ${categoryMeta.className}`}
                >
                  <Tag className="w-3 h-3" />
                  {categoryMeta.label}
                </span>

                <div className="flex items-center gap-2 text-xs text-[var(--dash-text-muted)]">
                  {notice.priority === 'alta' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase">
                      <AlertCircle className="w-3 h-3" />
                      Destaque
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-500/70" />
                    {new Date(notice.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[var(--dash-text-primary)] leading-snug">
                {notice.title}
              </h3>

              <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                {notice.content}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
