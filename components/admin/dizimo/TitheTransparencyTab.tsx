'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { TitheTransparencyItem } from '@/types';
import { createClient } from '@/utils/supabase/client';

interface TitheTransparencyTabProps {
  initialItems: TitheTransparencyItem[];
  parishId: string;
}

export function TitheTransparencyTab({ initialItems, parishId }: TitheTransparencyTabProps) {
  const [items, setItems] = useState<TitheTransparencyItem[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TitheTransparencyItem | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [highlight, setHighlight] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState('1');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setTag('Patrimônio Sagrado');
    setHighlight('100% conservada');
    setDescription('');
    setOrderIndex(String(items.length + 1));
    setModalOpen(true);
  };

  const openEditModal = (item: TitheTransparencyItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setTag(item.tag);
    setHighlight(item.highlight || '');
    setDescription(item.description);
    setOrderIndex(String(item.order_index));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      if (editingItem) {
        // Atualizar
        const { error } = await supabase
          .from('tithe_transparency_items')
          .update({
            title: title.trim(),
            tag: tag.trim(),
            highlight: highlight.trim() || null,
            description: description.trim(),
            order_index: Number(orderIndex),
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingItem.id);

        if (!error) {
          setItems((prev) =>
            prev.map((it) =>
              it.id === editingItem.id
                ? {
                    ...it,
                    title: title.trim(),
                    tag: tag.trim(),
                    highlight: highlight.trim() || null,
                    description: description.trim(),
                    order_index: Number(orderIndex),
                  }
                : it
            )
          );
          setModalOpen(false);
        }
      } else {
        // Inserir novo
        const newItemPayload = {
          parish_id: parishId,
          title: title.trim(),
          tag: tag.trim(),
          highlight: highlight.trim() || null,
          description: description.trim(),
          order_index: Number(orderIndex),
          is_active: true,
        };

        const { data, error } = await supabase
          .from('tithe_transparency_items')
          .insert(newItemPayload)
          .select('*')
          .single();

        if (!error && data) {
          setItems((prev) => [...prev, data as TitheTransparencyItem]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Erro ao salvar item de transparência:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('tithe_transparency_items')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (!error) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, is_active: !currentActive } : it))
        );
      }
    } catch (err) {
      console.error('Erro ao alternar status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta destinação do dízimo?')) return;

    try {
      const { error } = await supabase
        .from('tithe_transparency_items')
        .delete()
        .eq('id', id);

      if (!error) {
        setItems((prev) => prev.filter((it) => it.id !== id));
      }
    } catch (err) {
      console.error('Erro ao excluir item:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--dash-text-primary)]">
            Destinações do Dízimo & Prestação de Contas
          </h2>
          <p className="text-xs text-[var(--dash-text-secondary)]">
            Gerencie os cards exibidos na seção "Onde o seu Dízimo Atua na Catedral" do portal.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B1E22] dark:bg-[#FFA82A] text-white dark:text-[#2D1A16] font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Destinação</span>
        </button>
      </div>

      {/* Grade de Cards de Transparência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-[var(--dash-surface)] border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
              item.is_active ? 'border-[var(--dash-border)]' : 'border-dashed border-gray-400 opacity-60'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#8B1E22]/10 dark:bg-[#FFA82A]/10 text-[#8B1E22] dark:text-[#FFA82A] uppercase tracking-wider">
                  {item.tag}
                </span>

                {item.highlight && (
                  <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    {item.highlight}
                  </span>
                )}
              </div>

              <h3 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)]">
                {item.title}
              </h3>

              <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Ações */}
            <div className="pt-2 flex items-center justify-between border-t border-[var(--dash-border)] text-xs">
              <span className="text-[11px] text-[var(--dash-text-secondary)]">
                Ordem: #{item.order_index}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActive(item.id, item.is_active)}
                  className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]"
                  title={item.is_active ? 'Ocultar no portal' : 'Exibir no portal'}
                >
                  {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[#FFA82A]"
                  title="Editar"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-rose-500"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--dash-surface)] border border-[var(--dash-border)] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--dash-border)] pb-3">
              <h3 className="font-cinzel text-lg font-bold text-[var(--dash-text-primary)]">
                {editingItem ? 'Editar Destinação' : 'Nova Destinação do Dízimo'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Título da Obra / Ação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Restauro & Conservação da Catedral"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                    Tag / Categoria
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Patrimônio Sagrado"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                    Destaque Visual
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 100% conservada"
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Descrição Pastoral *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explique como o dízimo sustenta esta obra com transparência..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(e.target.value)}
                  className="w-24 px-3.5 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--dash-border)] text-xs font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B1E22] dark:bg-[#FFA82A] text-white dark:text-[#2D1A16] font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Salvar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
