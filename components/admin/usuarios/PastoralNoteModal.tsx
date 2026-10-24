'use client';

import React, { useState } from 'react';
import { X, Scroll, Send, Loader2, MapPin } from 'lucide-react';
import { Community } from '@/types';
import { Button, Input } from '@/components/ui';

interface PastoralNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (params: { communityId: string; actionType: string; pastoralNote: string; changesSummary: string }) => Promise<boolean>;
  communities: Community[];
  initialCommunityId?: string | null;
}

export function PastoralNoteModal({
  isOpen,
  onClose,
  onSend,
  communities,
  initialCommunityId,
}: PastoralNoteModalProps) {
  const [communityId, setCommunityId] = useState(initialCommunityId || communities[0]?.id || '');
  const [actionType, setActionType] = useState('Ajuste de Horários & Liturgia');
  const [pastoralNote, setPastoralNote] = useState('');
  const [changesSummary, setChangesSummary] = useState('');
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastoralNote.trim()) {
      setErrorMsg('Por favor, informe a mensagem ou justificativa pastoral.');
      return;
    }
    if (!communityId) {
      setErrorMsg('Por favor, selecione a comunidade de destino.');
      return;
    }

    setSending(true);
    setErrorMsg(null);
    try {
      const ok = await onSend({
        communityId,
        actionType,
        pastoralNote: pastoralNote.trim(),
        changesSummary: changesSummary.trim(),
      });
      if (ok) {
        onClose();
        setPastoralNote('');
        setChangesSummary('');
      } else {
        setErrorMsg('Erro ao registrar a nota pastoral no banco.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--dash-border)] flex items-center justify-between bg-amber-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Scroll className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
                Emitir Nota Pastoral / Justificativa
              </h3>
              <p className="text-xs text-[var(--dash-text-muted)]">
                Notificação canônica exibida no painel da liderança local da CEB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Selecionar Comunidade */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--dash-text-primary)] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Comunidade / Capela de Destino *</span>
            </label>
            <select
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              className="dash-select w-full text-xs font-medium rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              required
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.is_headquarters ? '⭐ ' : '⛪ '}
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assunto / Tipo da Ação */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
              Assunto / Ação Realizada
            </label>
            <Input
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              placeholder="Ex: Ajuste no Horário da Santa Missa ou Atualização do CPC"
              required
              className="rounded-xl border-[var(--dash-border)] bg-[var(--dash-surface)] text-xs min-h-[40px]"
            />
          </div>

          {/* Texto Pastoral */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
              Mensagem Pastoral para o Coordenador *
            </label>
            <textarea
              value={pastoralNote}
              onChange={(e) => setPastoralNote(e.target.value)}
              rows={4}
              placeholder="Ex: Querida liderança, realizamos uma atualização no horário da celebração em virtude da visita pastoral do Bispo diocesano..."
              required
              className="w-full text-xs rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>

          {/* Resumo Técnico das Mudanças */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
              Resumo Técnico das Alterações (opcional)
            </label>
            <Input
              value={changesSummary}
              onChange={(e) => setChangesSummary(e.target.value)}
              placeholder="Ex: Alterado horário de domingo das 18h para 19h"
              className="rounded-xl border-[var(--dash-border)] bg-[var(--dash-surface)] text-xs min-h-[40px]"
            />
          </div>

          <div className="pt-3 border-t border-[var(--dash-border)] flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={sending}
              className="rounded-xl text-xs font-semibold min-h-[40px] px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={sending}
              className="rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white min-h-[40px] px-5 flex items-center gap-1.5 shadow-sm"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Emitir e Notificar CEB</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
