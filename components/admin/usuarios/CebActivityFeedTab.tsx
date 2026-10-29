'use client';

import React, { useState, useMemo } from 'react';
import { Scroll, Clock, CheckCircle2, AlertCircle, Plus, MapPin, Search } from 'lucide-react';
import { CommunityActivityLog, Community } from '@/types';
import { Button, Card, Badge, Input } from '@/components/ui';

interface CebActivityFeedTabProps {
  logs: CommunityActivityLog[];
  communities: Community[];
  onOpenNewNote: () => void;
}

export function CebActivityFeedTab({
  logs,
  communities,
  onOpenNewNote,
}: CebActivityFeedTabProps) {
  const [selectedCommunityFilter, setSelectedCommunityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const communityMap = useMemo(() => {
    const map = new Map<string, string>();
    communities.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [communities]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesCommunity =
        selectedCommunityFilter === 'all' || log.community_id === selectedCommunityFilter;

      const commName = communityMap.get(log.community_id) || '';
      const matchesSearch =
        log.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.pastoral_note && log.pastoral_note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        commName.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCommunity && matchesSearch;
    });
  }, [logs, selectedCommunityFilter, searchTerm, communityMap]);

  return (
    <div className="space-y-4">
      {/* Controles de Topo: Filtro e Botão de Emitir Nota */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--dash-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar no histórico de atividades..."
              className="pl-9 rounded-xl border-[var(--dash-border)] bg-[var(--dash-surface)] text-xs min-h-[40px]"
            />
          </div>

          <select
            value={selectedCommunityFilter}
            onChange={(e) => setSelectedCommunityFilter(e.target.value)}
            className="dash-select text-xs font-medium rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          >
            <option value="all">Todas as 14 Comunidades (CEBs)</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.is_headquarters ? '⭐ ' : '⛪ '}
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={onOpenNewNote}
          className="rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white min-h-[40px] px-4 flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Nota Pastoral</span>
        </Button>
      </div>

      {/* Timeline do Changelog Fraterno */}
      <div className="space-y-3">
        {filteredLogs.map((log) => {
          const isParish = log.author_role === 'paroquia';
          const commName = communityMap.get(log.community_id) || 'Comunidade';
          const formattedDate = log.created_at
            ? new Date(log.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recentemente';

          return (
            <Card
              key={log.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isParish
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-[var(--dash-border)] bg-[var(--dash-surface)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-[var(--dash-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-bold ${
                      isParish
                        ? 'border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10'
                        : 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10'
                    }`}
                  >
                    {isParish ? '🏛️ Matriz Paroquial' : '⛪ Coordenação Local'}
                  </Badge>

                  <span className="text-xs font-bold text-[var(--dash-text-primary)]">
                    {log.author_name}
                  </span>

                  <span className="text-xs text-[var(--dash-text-muted)] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[var(--primary)]" />
                    <strong>{commName}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[var(--dash-text-muted)]">
                  <Clock className="w-3 h-3" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              <div className="pt-2.5 space-y-1.5">
                <h4 className="text-sm font-bold text-[var(--dash-text-primary)]">
                  {log.action_type}
                </h4>

                {log.pastoral_note && (
                  <blockquote className="text-xs text-[var(--dash-text-muted)] border-l-2 border-amber-500/50 pl-3 italic py-0.5">
                    "{log.pastoral_note}"
                  </blockquote>
                )}

                {log.changes_summary && (
                  <p className="text-xs text-[var(--dash-text-muted)]">
                    <strong className="text-[var(--dash-text-primary)]">Alterações realizadas:</strong>{' '}
                    {log.changes_summary}
                  </p>
                )}

                {isParish && (
                  <div className="pt-2 flex items-center gap-2">
                    {log.is_read_by_community ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Lido e ciente pela coordenação local
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Aguardando ciência do coordenador na comunidade
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--dash-border)] text-xs text-[var(--dash-text-muted)]">
            Nenhum registro de atividade encontrado para os critérios selecionados.
          </div>
        )}
      </div>
    </div>
  );
}
