'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Sparkles, 
  Church, 
  Bell, 
  Crown, 
  Scroll, 
  Cross,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { ParishHistoryMilestone } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { MilestoneModal } from './MilestoneModal';

interface MilestonesTabProps {
  initialMilestones: ParishHistoryMilestone[];
  parishId: string;
}

export function MilestonesTab({ initialMilestones, parishId }: MilestonesTabProps) {
  const [milestones, setMilestones] = useState<ParishHistoryMilestone[]>(initialMilestones);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<ParishHistoryMilestone | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  const getIcon = (iconName?: string | null) => {
    switch (iconName) {
      case 'cross': return <Cross className="w-4 h-4 text-[#FFA82A]" />;
      case 'bell': return <Bell className="w-4 h-4 text-[#FFA82A]" />;
      case 'crown': return <Crown className="w-4 h-4 text-[#FFA82A]" />;
      case 'scroll': return <Scroll className="w-4 h-4 text-[#FFA82A]" />;
      case 'sparkles': return <Sparkles className="w-4 h-4 text-[#FFA82A]" />;
      case 'church':
      default:
        return <Church className="w-4 h-4 text-[#FFA82A]" />;
    }
  };

  const handleOpenCreate = () => {
    setEditingMilestone(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (m: ParishHistoryMilestone) => {
    setEditingMilestone(m);
    setModalOpen(true);
  };

  const handleToggleActive = async (m: ParishHistoryMilestone) => {
    setActionLoading(true);
    try {
      const nextStatus = !m.is_active;
      const { error } = await supabase
        .from('parish_history_milestones')
        .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', m.id);

      if (error) throw error;

      setMilestones((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, is_active: nextStatus } : item))
      );
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      alert('Não foi possível alterar a visibilidade do marco.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este marco da linha do tempo histórica?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('parish_history_milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMilestones((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir marco:', err);
      alert('Falha ao excluir o marco histórico.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveMilestone = async (data: Partial<ParishHistoryMilestone>) => {
    if (editingMilestone) {
      const { data: updated, error } = await supabase
        .from('parish_history_milestones')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editingMilestone.id)
        .select()
        .single();

      if (error) throw error;
      if (updated) {
        setMilestones((prev) =>
          prev.map((item) => (item.id === editingMilestone.id ? (updated as ParishHistoryMilestone) : item))
        );
      }
    } else {
      const { data: created, error } = await supabase
        .from('parish_history_milestones')
        .insert({
          ...data,
          parish_id: parishId,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (created) {
        setMilestones((prev) => [...prev, created as ParishHistoryMilestone]);
      }
    }
  };

  const sortedMilestones = [...milestones].sort((a, b) => a.year_order - b.year_order);

  return (
    <div className="space-y-6">
      {/* Barra de Ação Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)]">
        <div>
          <h2 className="font-cinzel text-lg font-bold text-[var(--dash-text-primary)]">
            Linha do Tempo Centenária ({milestones.length} Marcos)
          </h2>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Gerencie os fatos canônicos, construções, restauros e momentos históricos exibidos no portal do fiel.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Marco Histórico</span>
        </button>
      </div>

      {/* Lista de Marcos em Cards */}
      {sortedMilestones.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-[var(--dash-surface)] border border-dashed border-[var(--dash-border)]">
          <Calendar className="w-12 h-12 mx-auto text-[var(--dash-text-secondary)]/50 mb-3" />
          <p className="text-sm font-semibold text-[var(--dash-text-primary)]">
            Nenhum marco histórico cadastrado ainda.
          </p>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-1">
            Clique no botão acima para adicionar o primeiro ano marcante da paróquia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedMilestones.map((m) => (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border transition-all ${
                m.is_active
                  ? 'bg-[var(--dash-surface)] border-[var(--dash-border)] hover:border-[#FFA82A]/30'
                  : 'bg-[var(--dash-surface)]/60 border-dashed border-[var(--dash-border)]/60 opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#8B1E22]/10 border border-[#8B1E22]/20 flex flex-col items-center justify-center min-w-[70px]">
                    <span className="font-cinzel text-xl font-black text-[#8B1E22] dark:text-[#FFA82A]">
                      {m.year}
                    </span>
                    <span className="mt-1">{getIcon(m.icon_name)}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFA82A]/10 text-[#FFA82A] border border-[#FFA82A]/20">
                        {m.era}
                      </span>
                      {!m.is_active && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                          Oculto no Portal
                        </span>
                      )}
                    </div>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--dash-text-primary)]">
                      {m.title}
                    </h3>
                    {m.subtitle && (
                      <p className="text-xs font-medium text-[#FFA82A]">
                        {m.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-2 pt-1 font-sans">
                      {m.description}
                    </p>
                    {m.highlight && (
                      <div className="mt-2 text-xs italic text-[var(--dash-text-primary)]/80 pl-3 border-l-2 border-[#FFA82A]">
                        “{m.highlight}”
                      </div>
                    )}
                    {m.image_url && (
                      <div className="flex items-center gap-2.5 pt-2">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-[var(--dash-border)] shrink-0 bg-stone-900">
                          <img
                            src={m.image_url}
                            alt={m.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-[11px] text-[var(--dash-text-secondary)] truncate">
                          <span className="font-medium text-[var(--dash-text-primary)] block truncate">
                            {m.image_caption || 'Foto do marco'}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--dash-text-secondary)]/80 truncate block">
                            {m.image_url}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 self-end lg:self-start pt-2 lg:pt-0">
                  <button
                    onClick={() => handleToggleActive(m)}
                    disabled={actionLoading}
                    className="p-2.5 rounded-xl border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title={m.is_active ? 'Ocultar marco' : 'Publicar marco'}
                  >
                    {m.is_active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-2.5 rounded-xl border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Editar marco"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={deletingId === m.id}
                    className="p-2.5 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Remover marco"
                  >
                    {deletingId === m.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <MilestoneModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveMilestone}
        milestone={editingMilestone}
      />
    </div>
  );
}
