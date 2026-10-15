'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Crown, 
  User, 
  Sparkles, 
  CheckCircle2,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { ParishPastorSuccession } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { PastorModal } from './PastorModal';

interface PastorsTabProps {
  initialPastors: ParishPastorSuccession[];
  parishId: string;
}

export function PastorsTab({ initialPastors, parishId }: PastorsTabProps) {
  const [pastors, setPastors] = useState<ParishPastorSuccession[]>(initialPastors);
  const [filterCategory, setFilterCategory] = useState<'all' | 'bishop' | 'pastor'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPastor, setEditingPastor] = useState<ParishPastorSuccession | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  const handleOpenCreate = (cat: 'bishop' | 'pastor' = 'bishop') => {
    setEditingPastor(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: ParishPastorSuccession) => {
    setEditingPastor(p);
    setModalOpen(true);
  };

  const handleToggleActive = async (p: ParishPastorSuccession) => {
    setActionLoading(true);
    try {
      const nextStatus = !p.is_active;
      const { error } = await supabase
        .from('parish_pastors_succession')
        .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', p.id);

      if (error) throw error;

      setPastors((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, is_active: nextStatus } : item))
      );
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      alert('Não foi possível alterar a visibilidade.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este pastor/bispo da sucessão histórica?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('parish_pastors_succession')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPastors((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir pastor:', err);
      alert('Falha ao excluir pastor histórico.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSavePastor = async (data: Partial<ParishPastorSuccession>) => {
    if (editingPastor) {
      const { data: updated, error } = await supabase
        .from('parish_pastors_succession')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editingPastor.id)
        .select()
        .single();

      if (error) throw error;
      if (updated) {
        setPastors((prev) =>
          prev.map((item) => (item.id === editingPastor.id ? (updated as ParishPastorSuccession) : item))
        );
      }
    } else {
      const { data: created, error } = await supabase
        .from('parish_pastors_succession')
        .insert({
          ...data,
          parish_id: parishId,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (created) {
        setPastors((prev) => [...prev, created as ParishPastorSuccession]);
      }
    }
  };

  const filteredPastors = pastors.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  const sortedPastors = [...filteredPastors].sort((a, b) => a.order_number - b.order_number);

  return (
    <div className="space-y-6">
      {/* Barra de Ação Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)]">
        <div>
          <h2 className="font-cinzel text-lg font-bold text-[var(--dash-text-primary)]">
            Sucessão Apostólica & Pastores ({pastors.length} Ministros)
          </h2>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Registro dos bispos diocesanos e sacerdotes que pastorearam a comunidade ao longo dos tempos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenCreate('bishop')}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all min-h-[44px]"
          >
            <Crown className="w-4 h-4 text-[#FFA82A]" />
            <span>+ Bispo Diocesano</span>
          </button>
          <button
            onClick={() => handleOpenCreate('pastor')}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-primary)] font-bold text-xs shadow-sm transition-all min-h-[44px]"
          >
            <User className="w-4 h-4 text-[#8B1E22] dark:text-[#FFA82A]" />
            <span>+ Pároco</span>
          </button>
        </div>
      </div>

      {/* Filtros por Categoria */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
            filterCategory === 'all'
              ? 'bg-[#8B1E22] text-white shadow'
              : 'bg-[var(--dash-surface)] text-[var(--dash-text-secondary)] border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          Todos ({pastors.length})
        </button>
        <button
          onClick={() => setFilterCategory('bishop')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px] ${
            filterCategory === 'bishop'
              ? 'bg-[#8B1E22] text-white shadow'
              : 'bg-[var(--dash-surface)] text-[var(--dash-text-secondary)] border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Bispos Diocesanos ({pastors.filter((p) => p.category === 'bishop').length})</span>
        </button>
        <button
          onClick={() => setFilterCategory('pastor')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px] ${
            filterCategory === 'pastor'
              ? 'bg-[#8B1E22] text-white shadow'
              : 'bg-[var(--dash-surface)] text-[var(--dash-text-secondary)] border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Párocos ({pastors.filter((p) => p.category === 'pastor').length})</span>
        </button>
      </div>

      {/* Lista de Pastores */}
      {sortedPastors.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-[var(--dash-surface)] border border-dashed border-[var(--dash-border)]">
          <Crown className="w-12 h-12 mx-auto text-[var(--dash-text-secondary)]/50 mb-3" />
          <p className="text-sm font-semibold text-[var(--dash-text-primary)]">
            Nenhum pastor ou bispo encontrado nesta categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedPastors.map((p) => (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                p.is_active
                  ? 'bg-[var(--dash-surface)] border-[var(--dash-border)] hover:border-[#FFA82A]/30'
                  : 'bg-[var(--dash-surface)]/60 border-dashed border-[var(--dash-border)]/60 opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A]">
                      {p.category === 'bishop' ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFA82A]/10 text-[#FFA82A] border border-[#FFA82A]/20">
                          {p.order_label || (p.category === 'bishop' ? 'Bispo Diocesano' : 'Pároco')}
                        </span>
                        {p.is_current && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Em Exercício
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--dash-text-secondary)] font-medium">
                        {p.period}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(p)}
                      disabled={actionLoading}
                      className="p-2 rounded-lg border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title={p.is_active ? 'Ocultar' : 'Publicar'}
                    >
                      {p.is_active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 rounded-lg border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="p-2 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Remover"
                    >
                      {deletingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)]">
                    {p.name}
                  </h3>
                  {p.motto && (
                    <div className="mt-1 text-xs text-[#FFA82A] italic">
                      “{p.motto}”
                      {p.motto_translation && (
                        <span className="text-[var(--dash-text-secondary)] not-italic block text-[11px]">
                          {p.motto_translation}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-3 mt-2 font-sans">
                    {p.summary}
                  </p>
                </div>

                {Array.isArray(p.achievements) && p.achievements.length > 0 && (
                  <div className="pt-2 border-t border-[var(--dash-border)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] block mb-1">
                      Marcos & Conquistas:
                    </span>
                    <ul className="text-[11px] text-[var(--dash-text-secondary)] space-y-1">
                      {p.achievements.slice(0, 2).map((ach, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#FFA82A] mt-0.5">•</span>
                          <span className="line-clamp-1">{ach}</span>
                        </li>
                      ))}
                      {p.achievements.length > 2 && (
                        <li className="text-[10px] text-[#FFA82A] italic">
                          +{p.achievements.length - 2} outro(s) marco(s) cadastrado(s)
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <PastorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSavePastor}
        pastor={editingPastor}
        defaultCategory={filterCategory === 'pastor' ? 'pastor' : 'bishop'}
      />
    </div>
  );
}
