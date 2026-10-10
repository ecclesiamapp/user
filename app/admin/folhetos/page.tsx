'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Download,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui';
import { BookletCard } from '@/components/admin/folhetos/BookletCard';
import { BookletFormModal } from '@/components/admin/folhetos/BookletFormModal';
import { createClient } from '@/utils/supabase/client';
import { LiturgicalBooklet } from '@/types';

const CATEDRAL_PARISH_ID = 'c0000000-0000-0000-0000-000000000001';

export default function AdminFolhetosPage() {
  const [booklets, setBooklets] = useState<LiturgicalBooklet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBooklets = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('liturgical_booklets')
        .select('*')
        .eq('parish_id', CATEDRAL_PARISH_ID)
        .order('celebration_date', { ascending: false });

      if (error) {
        console.error('Erro ao carregar folhetos do Supabase:', error);
      } else if (data) {
        setBooklets(data as LiturgicalBooklet[]);
      }
    } catch (err) {
      console.error('Falha na requisição:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooklets();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient();
      const newStatus = !currentStatus;

      setBooklets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_active: newStatus } : b))
      );

      const { error } = await supabase
        .from('liturgical_booklets')
        .update({ is_active: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setFeedback(`Status do folheto atualizado com sucesso!`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Erro ao alternar status do folheto:', err);
      // Reverter estado local
      setBooklets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_active: currentStatus } : b))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este folheto?')) return;

    try {
      setDeletingId(id);
      const supabase = createClient();

      const { error } = await supabase
        .from('liturgical_booklets')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setBooklets((prev) => prev.filter((b) => b.id !== id));
      setFeedback('Folheto removido com sucesso!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Erro ao excluir folheto:', err);
      alert('Não foi possível excluir o folheto.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreated = (newBooklet: LiturgicalBooklet) => {
    setBooklets((prev) => [newBooklet, ...prev]);
    setFeedback(`"${newBooklet.title}" foi publicado com sucesso!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const totalDownloads = booklets.reduce((acc, curr) => acc + (curr.download_count || 0), 0);
  const activeCount = booklets.filter((b) => b.is_active).length;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            Folhetos de Missa («Sou do Sagrado Missa»)
          </h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gerencie os folhetos litúrgicos oficiais da Catedral e das CEBs para download móvel e impressão paroquial.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          className="shrink-0"
        >
          Novo Folheto (PDF)
        </Button>
      </div>

      {/* Alerta de Feedback */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 transition-all">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)]">
          <span className="text-xs font-semibold text-[var(--dash-text-secondary)] block">
            Total de Folhetos
          </span>
          <span className="text-2xl font-bold text-[var(--dash-text-primary)] mt-1 block">
            {booklets.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)]">
          <span className="text-xs font-semibold text-[var(--dash-text-secondary)] block">
            Folhetos Ativos no Portal
          </span>
          <span className="text-2xl font-bold text-emerald-500 mt-1 block">
            {activeCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)]">
          <span className="text-xs font-semibold text-[var(--dash-text-secondary)] block">
            Total de Downloads (Fiéis)
          </span>
          <span className="text-2xl font-bold text-amber-500 mt-1 block">
            {totalDownloads}
          </span>
        </div>
      </div>

      {/* Lista de Folhetos */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-[var(--dash-text-secondary)]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-xs">Carregando folhetos litúrgicos...</span>
        </div>
      ) : booklets.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[var(--dash-surface)] border border-dashed border-[var(--dash-border)] text-center space-y-3">
          <FileText className="w-10 h-10 text-[var(--dash-text-secondary)] mx-auto opacity-50" />
          <h3 className="font-bold text-base text-[var(--dash-text-primary)]">
            Nenhum folheto publicado ainda
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] max-w-md mx-auto">
            Faça o upload do primeiro PDF da série «Sou do Sagrado Missa» para que os fiéis possam acompanhar no celular ou imprimir para as celebrações.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
          >
            Publicar Primeiro Folheto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {booklets.map((booklet) => (
            <BookletCard
              key={booklet.id}
              booklet={booklet}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              isDeleting={deletingId === booklet.id}
            />
          ))}
        </div>
      )}

      {/* Modal de Publicação */}
      <BookletFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
}
