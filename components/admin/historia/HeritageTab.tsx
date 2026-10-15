'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Sun, 
  Flame, 
  Shield, 
  Bell, 
  Scroll, 
  Armchair,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { ParishSacredHeritage } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { HeritageModal } from './HeritageModal';

interface HeritageTabProps {
  initialHeritage: ParishSacredHeritage[];
  parishId: string;
}

export function HeritageTab({ initialHeritage, parishId }: HeritageTabProps) {
  const [heritage, setHeritage] = useState<ParishSacredHeritage[]>(initialHeritage);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ParishSacredHeritage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClient();

  const getIcon = (iconName?: string | null) => {
    switch (iconName) {
      case 'sun': return <Sun className="w-4 h-4 text-[#FFA82A]" />;
      case 'flame': return <Flame className="w-4 h-4 text-[#FFA82A]" />;
      case 'shield': return <Shield className="w-4 h-4 text-[#FFA82A]" />;
      case 'bell': return <Bell className="w-4 h-4 text-[#FFA82A]" />;
      case 'chair': return <Armchair className="w-4 h-4 text-[#FFA82A]" />;
      case 'scroll': return <Scroll className="w-4 h-4 text-[#FFA82A]" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-[#FFA82A]" />;
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ParishSacredHeritage) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleToggleActive = async (item: ParishSacredHeritage) => {
    setActionLoading(true);
    try {
      const nextStatus = !item.is_active;
      const { error } = await supabase
        .from('parish_sacred_heritage')
        .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) throw error;

      setHeritage((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_active: nextStatus } : i))
      );
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      alert('Não foi possível alterar a visibilidade.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta obra do patrimônio sacro?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('parish_sacred_heritage')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHeritage((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir patrimônio sacro:', err);
      alert('Falha ao excluir a obra.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveHeritage = async (data: Partial<ParishSacredHeritage>) => {
    if (editingItem) {
      const { data: updated, error } = await supabase
        .from('parish_sacred_heritage')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', editingItem.id)
        .select()
        .single();

      if (error) throw error;
      if (updated) {
        setHeritage((prev) =>
          prev.map((i) => (i.id === editingItem.id ? (updated as ParishSacredHeritage) : i))
        );
      }
    } else {
      const { data: created, error } = await supabase
        .from('parish_sacred_heritage')
        .insert({
          ...data,
          parish_id: parishId,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      if (created) {
        setHeritage((prev) => [...prev, created as ParishSacredHeritage]);
      }
    }
  };

  const sortedHeritage = [...heritage].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="space-y-6">
      {/* Barra de Ação Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)]">
        <div>
          <h2 className="font-cinzel text-lg font-bold text-[var(--dash-text-primary)]">
            Patrimônio Sacro, Vitrais & Templo ({heritage.length} Obras)
          </h2>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Gerencie o acervo sacro, vitrais alemães, altares, baldaquino e detalhes catequéticos do templo.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Obra Sacra / Vitral</span>
        </button>
      </div>

      {/* Lista de Obras em Cards */}
      {sortedHeritage.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-[var(--dash-surface)] border border-dashed border-[var(--dash-border)]">
          <Sparkles className="w-12 h-12 mx-auto text-[var(--dash-text-secondary)]/50 mb-3" />
          <p className="text-sm font-semibold text-[var(--dash-text-primary)]">
            Nenhuma obra de arte sacra cadastrada ainda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedHeritage.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                item.is_active
                  ? 'bg-[var(--dash-surface)] border-[var(--dash-border)] hover:border-[#FFA82A]/30'
                  : 'bg-[var(--dash-surface)]/60 border-dashed border-[var(--dash-border)]/60 opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A]">
                      {getIcon(item.icon)}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFA82A]/10 text-[#FFA82A] border border-[#FFA82A]/20">
                        {item.category}
                      </span>
                      <h3 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)] mt-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(item)}
                      disabled={actionLoading}
                      className="p-2 rounded-lg border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title={item.is_active ? 'Ocultar' : 'Publicar'}
                    >
                      {item.is_active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 rounded-lg border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-2 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Remover"
                    >
                      {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[var(--dash-text-secondary)] line-clamp-3 font-sans">
                  {item.description}
                </p>

                <div className="p-3 rounded-xl bg-[#8B1E22]/5 dark:bg-[#FFA82A]/5 border border-[#8B1E22]/10 dark:border-[#FFA82A]/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFA82A] block mb-0.5">
                    Significado Catequético:
                  </span>
                  <p className="text-xs text-[var(--dash-text-primary)]/90 italic font-sans">
                    {item.theological_meaning}
                  </p>
                </div>

                {item.image_url && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--dash-text-secondary)] pt-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FFA82A]" />
                    <span className="truncate max-w-xs">{item.image_url}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <HeritageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveHeritage}
        item={editingItem}
      />
    </div>
  );
}
