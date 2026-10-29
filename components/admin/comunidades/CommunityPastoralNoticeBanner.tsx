'use client';

import React, { useState } from 'react';
import { Scroll, CheckCircle2, AlertCircle, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';
import { Button, Card, Badge } from '@/components/ui';

export function CommunityPastoralNoticeBanner() {
  const { unreadPastoralNotes, markNoteAsRead } = useAdminCommunity();
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  if (!unreadPastoralNotes || unreadPastoralNotes.length === 0) {
    return null;
  }

  const handleConfirm = async (logId: string) => {
    setSubmittingId(logId);
    try {
      await markNoteAsRead(logId);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-3 mb-6">
      {unreadPastoralNotes.map((note) => {
        const isSubmitting = submittingId === note.id;
        const formattedDate = note.created_at
          ? new Date(note.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Data recente';

        return (
          <div
            key={note.id}
            className="p-4 sm:p-5 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent text-[var(--dash-text-primary)] shadow-sm relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Scroll className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10 text-[11px] font-bold">
                      🏛️ Nota Pastoral da Catedral
                    </Badge>
                    <span className="text-[11px] text-[var(--dash-text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--dash-text-muted)]">
                      • Por: <strong className="text-[var(--dash-text-primary)]">{note.author_name}</strong>
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-[var(--dash-text-primary)]">
                    {note.action_type || 'Ajuste Canônico / Pastoral na Comunidade'}
                  </h4>

                  {note.pastoral_note && (
                    <blockquote className="text-xs sm:text-sm text-[var(--dash-text-muted)] border-l-2 border-amber-500/40 pl-3 italic py-0.5 my-1.5">
                      "{note.pastoral_note}"
                    </blockquote>
                  )}

                  {note.changes_summary && (
                    <p className="text-[11px] text-[var(--dash-text-muted)]">
                      <span className="font-semibold text-[var(--dash-text-primary)]">Resumo da alteração:</span>{' '}
                      {note.changes_summary}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <Button
                  size="sm"
                  onClick={() => handleConfirm(note.id)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white min-h-[38px] px-4 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Confirmar Leitura e Ciência</span>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
