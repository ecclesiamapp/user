'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ParishSacredHeritage } from '@/types';

interface HeritageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ParishSacredHeritage>) => Promise<void>;
  item: ParishSacredHeritage | null;
}

export function HeritageModal({ isOpen, onClose, onSave, item }: HeritageModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [theologicalMeaning, setTheologicalMeaning] = useState('');
  const [icon, setIcon] = useState('sparkles');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [orderIndex, setOrderIndex] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setCategory(item.category || '');
      setDescription(item.description || '');
      setTheologicalMeaning(item.theological_meaning || '');
      setIcon(item.icon || 'sparkles');
      setImageUrl(item.image_url || '');
      setImageCaption(item.image_caption || '');
      setOrderIndex(String(item.order_index || 1));
    } else {
      setTitle('');
      setCategory('Patrimônio Sacro & Arte');
      setDescription('');
      setTheologicalMeaning('');
      setIcon('sparkles');
      setImageUrl('');
      setImageCaption('');
      setOrderIndex('1');
    }
    setError(null);
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !description.trim() || !theologicalMeaning.trim()) {
      setError('Por favor, preencha o título, categoria, descrição e significado teológico.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        theological_meaning: theologicalMeaning.trim(),
        icon,
        image_url: imageUrl.trim() || null,
        image_caption: imageCaption.trim() || null,
        order_index: parseInt(orderIndex, 10) || 1,
      });
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar patrimônio sacro:', err);
      setError(err?.message || 'Falha ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-[var(--dash-text-primary)]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--dash-border)]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-cinzel text-xl font-bold">
                {item ? 'Editar Patrimônio Sacro' : 'Adicionar Elemento Sacro / Vitral'}
              </h2>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Descreva os vitrais, altares, mosaicos e elementos arquitetônicos sagrados.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Nome do Patrimônio / Obra *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Os Vitrais Sagrados ou Baldaquino dos 7 Dons"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Ordem de Exibição
              </label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Categoria / Tag *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Patrimônio Sacro & Luz, Arquitetura de 1952"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Ícone Teológico
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="dash-select w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              >
                <option value="sun">Sol / Luz dos Vitrais</option>
                <option value="flame">Fogo / Dons do Espírito Santo</option>
                <option value="shield">Escudo / Pavimento Litúrgico</option>
                <option value="chair">Cátedra Episcopal</option>
                <option value="bell">Sino / Campanário</option>
                <option value="scroll">Pergaminho / Arquitetura</option>
                <option value="sparkles">Brilho Litúrgico</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Descrição Física & Histórica *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a técnica artística, os autores, dimensões, materiais nobres e estado de conservação..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Significado Catequético & Teológico (Sentido da Fé) *
            </label>
            <textarea
              rows={3}
              required
              value={theologicalMeaning}
              onChange={(e) => setTheologicalMeaning(e.target.value)}
              placeholder="Explique o que esta obra ensina aos fiéis segundo o Magistério e a Bíblia..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                URL da Foto
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/historia/catedral-vitrais.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Legenda da Foto
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Ex: Vitrais originais filtrando a luz na nave..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--dash-border)] mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-[var(--dash-border)] hover:bg-[var(--dash-surface-hover)] text-sm font-semibold transition-colors min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] hover:brightness-110 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 min-h-[44px]"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {item ? 'Salvar Obra' : 'Adicionar Patrimônio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
