'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Star,
  Sparkles,
  Loader2,
  Check,
  Church,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { PastoralMessage } from '@/types';
import { OFFICIAL_CHRISTMAS_MESSAGES } from '@/lib/pastoral-messages';
import { MessageCard } from '@/components/admin/mensagens/MessageCard';
import { MessageFormModal } from '@/components/admin/mensagens/MessageFormModal';

const CATEDRAL_PARISH_ID = 'c0000000-0000-0000-0000-000000000001';
const LOCAL_STORAGE_KEY = 'ecclesiam_local_pastoral_messages';

export default function AdminMensagensPage() {
  const [messages, setMessages] = useState<PastoralMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState<PastoralMessage | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pastoral_messages')
        .select('*')
        .eq('parish_id', CATEDRAL_PARISH_ID)
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setMessages(data as PastoralMessage[]);
        return;
      }

      // Fallback 1: LocalStorage com mensagens salvas pelo usuário
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
              return;
            }
          } catch {
            // ignore parsing error
          }
        }
      }

      // Fallback 2: Mensagens canônicas oficiais (Dom Lauro e Pe. Irineu)
      setMessages(OFFICIAL_CHRISTMAS_MESSAGES);
    } catch (err) {
      console.warn('Falha na API, adotando mensagens canônicas locais:', err);
      setMessages(OFFICIAL_CHRISTMAS_MESSAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const showFeedback = (text: string) => {
    setFeedback(text);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setMessageToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (message: PastoralMessage) => {
    setMessageToEdit(message);
    setIsModalOpen(true);
  };

  const syncToLocalStorage = (updated: PastoralMessage[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Erro ao sincronizar com localStorage:', err);
      }
    }
  };

  const handleSetFeatured = async (id: string) => {
    try {
      setActionLoadingId(id);
      const supabase = createClient();

      // 1. Tentar atualizar no Supabase (se online)
      try {
        await supabase
          .from('pastoral_messages')
          .update({ is_featured_home: false })
          .eq('parish_id', CATEDRAL_PARISH_ID);

        await supabase
          .from('pastoral_messages')
          .update({ is_featured_home: true, is_active: true })
          .eq('id', id);
      } catch (dbErr) {
        console.warn('Supabase offline ou sem tabela, aplicando no cache local:', dbErr);
      }

      setMessages((prev) => {
        const next = prev.map((m) => ({
          ...m,
          is_featured_home: m.id === id,
          is_active: m.id === id ? true : m.is_active,
        }));
        syncToLocalStorage(next);
        return next;
      });

      const target = messages.find((m) => m.id === id);
      showFeedback(`"${target?.title}" agora é o destaque oficial na Home!`);
    } catch (err) {
      console.error('Erro ao definir mensagem em destaque:', err);
      showFeedback('Erro ao definir destaque na Home.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setActionLoadingId(id);
      const supabase = createClient();
      const newStatus = !currentStatus;

      try {
        await supabase
          .from('pastoral_messages')
          .update({ is_active: newStatus })
          .eq('id', id);
      } catch (dbErr) {
        console.warn('Supabase offline ou sem tabela, aplicando no cache local:', dbErr);
      }

      setMessages((prev) => {
        const next = prev.map((m) => (m.id === id ? { ...m, is_active: newStatus } : m));
        syncToLocalStorage(next);
        return next;
      });

      showFeedback(newStatus ? 'Mensagem publicada no portal!' : 'Mensagem salva como rascunho.');
    } catch (err) {
      console.error('Erro ao alternar status da mensagem:', err);
      showFeedback('Erro ao alterar status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const target = messages.find((m) => m.id === id);
    if (!target) return;

    if (!confirm(`Tem certeza que deseja excluir a mensagem "${target.title}"?`)) {
      return;
    }

    try {
      setActionLoadingId(id);
      const supabase = createClient();

      try {
        await supabase.from('pastoral_messages').delete().eq('id', id);
      } catch (dbErr) {
        console.warn('Supabase offline ou sem tabela, aplicando no cache local:', dbErr);
      }

      setMessages((prev) => {
        const next = prev.filter((m) => m.id !== id);
        syncToLocalStorage(next);
        return next;
      });

      showFeedback('Mensagem removida com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar mensagem:', err);
      showFeedback('Erro ao excluir mensagem.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const featuredMessage = messages.find((m) => m.is_featured_home);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[var(--primary)]" />
            Palavra do Pároco & Palavra do Bispo
          </h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gerencie colunas pastorais, reflexões de fé e selecione qual mensagem aparece em destaque na primeira página da Catedral.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nova Mensagem
        </button>
      </div>

      {/* Alerta de Feedback */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 transition-all">
          <Check className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Alerta de Erro */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2 transition-all">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Card Informativo de Destaque da Home */}
      <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--dash-text-secondary)]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong>Regra Visual:</strong> Apenas <strong>1 mensagem</strong> fica ativa em destaque solene na Home por vez, preservando foco e elegância.
          </span>
        </div>

        <span className="font-semibold text-[var(--dash-text-primary)]">
          Destaque Atual:{' '}
          {featuredMessage ? (
            <span className="text-amber-500">{featuredMessage.author_name}</span>
          ) : (
            <span className="text-zinc-400">Nenhum definido</span>
          )}
        </span>
      </div>

      {/* Lista de Mensagens */}
      {loading ? (
        <div className="p-12 text-center text-[var(--dash-text-secondary)] space-y-3">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" />
          <p className="text-xs">Carregando colunas pastorais do banco de dados...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[var(--dash-border)] rounded-2xl space-y-3">
          <BookOpen className="w-8 h-8 mx-auto text-[var(--dash-text-secondary)]/50" />
          <p className="text-sm font-semibold text-[var(--dash-text-primary)]">
            Nenhuma mensagem pastoral cadastrada ainda.
          </p>
          <p className="text-xs text-[var(--dash-text-secondary)]">
            Clique no botão acima para publicar a primeira reflexão do Pároco ou Bispo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((item) => (
            <MessageCard
              key={item.id}
              message={item}
              onSetFeatured={handleSetFeatured}
              onToggleActive={handleToggleActive}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              isActionLoading={actionLoadingId === item.id}
            />
          ))}
        </div>
      )}

      {/* Modal Modular de Criação e Edição */}
      <MessageFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(msg) => {
          showFeedback(msg);
          fetchMessages();
        }}
        messageToEdit={messageToEdit}
        parishId={CATEDRAL_PARISH_ID}
      />
    </div>
  );
}
