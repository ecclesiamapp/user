'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  Users, 
  MapPin, 
  Clock, 
  BookOpen, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface KnowledgeStats {
  total_embeddings: number;
  total_documents: number;
  by_source: Record<string, number>;
  by_table: Record<string, number>;
  last_sync_at: string | null;
}

export function AdminAiKnowledgeStatsCard({ onSyncSuccess }: { onSyncSuccess?: () => void }) {
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/ai/sync-database');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas do RAG:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSyncDatabase = async () => {
    try {
      setSyncing(true);
      setFeedback(null);
      const res = await fetch('/api/admin/ai/sync-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: `Sincronização concluída! ${data.total_chunks} itens indexados na base vetorial.`,
        });
        await fetchStats();
        if (onSyncSuccess) onSyncSuccess();
      } else {
        throw new Error(data.error || 'Falha ao sincronizar banco.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro na sincronização';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl p-5 shadow-sm space-y-4">
      {/* Cabeçalho do Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[var(--dash-text-primary)]">
              Base Vetorial & RAG
            </h3>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              pgvector + Google text-embedding-004
            </p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading || syncing}
          className="p-2 rounded-xl border border-[var(--dash-border)] hover:bg-[var(--dash-bg)] text-[var(--dash-text-secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Atualizar estatísticas"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border)]">
          <span className="text-xs text-[var(--dash-text-secondary)] block">
            Chunks Vetoriais
          </span>
          <span className="text-2xl font-bold text-[var(--dash-text-primary)]">
            {stats ? stats.total_embeddings : '—'}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border)]">
          <span className="text-xs text-[var(--dash-text-secondary)] block">
            Documentos / PDFs
          </span>
          <span className="text-2xl font-bold text-[var(--dash-text-primary)]">
            {stats ? stats.total_documents : '0'}
          </span>
        </div>
      </div>

      {/* Distribuição por Entidades do Banco */}
      {stats && stats.by_table && Object.keys(stats.by_table).length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-[var(--dash-text-secondary)] uppercase tracking-wider block">
            Itens Indexados
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[var(--dash-text-secondary)]">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>Clero: <strong>{stats.by_table.clergy || 0}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--dash-text-secondary)]">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>12 CEBs: <strong>{stats.by_table.communities || 0}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--dash-text-secondary)]">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Mensagens: <strong>{stats.by_table.pastoral_messages || 0}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--dash-text-secondary)]">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Matriz/Geral: <strong>{stats.by_table.parishes || 0}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Mensagem */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Botão de Sincronização Total */}
      <button
        onClick={handleSyncDatabase}
        disabled={syncing}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-medium text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-sm min-h-[44px] cursor-pointer disabled:opacity-50"
      >
        <Sparkles className={`w-4 h-4 text-amber-300 ${syncing ? 'animate-spin' : ''}`} />
        <span>{syncing ? 'Indexando Banco no pgvector...' : 'Sincronizar Dados do Banco'}</span>
      </button>

      {/* Rodapé: Última Sincronização */}
      <div className="text-[11px] text-[var(--dash-text-secondary)] text-center pt-1 border-t border-[var(--dash-border)]">
        {stats?.last_sync_at ? (
          <span>
            Última sync: {new Date(stats.last_sync_at).toLocaleString('pt-BR')}
          </span>
        ) : (
          <span>Aguardando primeira sincronização</span>
        )}
      </div>
    </div>
  );
}
