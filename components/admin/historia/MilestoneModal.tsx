'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ParishHistoryMilestone } from '@/types';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestoneData: Partial<ParishHistoryMilestone>) => Promise<void>;
  milestone: ParishHistoryMilestone | null;
}

export function MilestoneModal({ isOpen, onClose, onSave, milestone }: MilestoneModalProps) {
  const [year, setYear] = useState('');
  const [yearOrder, setYearOrder] = useState('0');
  const [era, setEra] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('church');
  const [highlight, setHighlight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (milestone) {
      setYear(milestone.year || '');
      setYearOrder(String(milestone.year_order || 0));
      setEra(milestone.era || '');
      setTitle(milestone.title || '');
      setSubtitle(milestone.subtitle || '');
      setDescription(milestone.description || '');
      setIconName(milestone.icon_name || 'church');
      setHighlight(milestone.highlight || '');
      setImageUrl(milestone.image_url || '');
      setImageCaption(milestone.image_caption || '');
    } else {
      setYear('');
      setYearOrder('0');
      setEra('Origens & Fundação');
      setTitle('');
      setSubtitle('');
      setDescription('');
      setIconName('church');
      setHighlight('');
      setImageUrl('');
      setImageCaption('');
    }
    setError(null);
  }, [milestone, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim() || !title.trim() || !description.trim()) {
      setError('Por favor, preencha o ano, título e descrição do marco histórico.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const parsedYearOrder = parseInt(yearOrder, 10) || parseInt(year.replace(/\D/g, ''), 10) || 0;
      await onSave({
        year: year.trim(),
        year_order: parsedYearOrder,
        era: era.trim() || 'Origens & Fundação',
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        description: description.trim(),
        icon_name: iconName,
        highlight: highlight.trim() || null,
        image_url: imageUrl.trim() || null,
        image_caption: imageCaption.trim() || null,
      });
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar marco histórico:', err);
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
                {milestone ? 'Editar Marco Histórico' : 'Adicionar Novo Marco Histórico'}
              </h2>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Registre os acontecimentos e datas memoráveis da caminhada da paróquia.
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
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Ano Exibido *
              </label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 1952"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Ordem Cronológica
              </label>
              <input
                type="number"
                value={yearOrder}
                onChange={(e) => setYearOrder(e.target.value)}
                placeholder="Ex: 1952"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Ícone Litúrgico
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="dash-select w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              >
                <option value="church">Igreja / Templo</option>
                <option value="cross">Cruz Sagrada</option>
                <option value="bell">Sino / Torre</option>
                <option value="crown">Coroa / Catedral</option>
                <option value="scroll">Pergaminho / Tombamento</option>
                <option value="sparkles">Luz / Restauro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Época / Fase Histórica
            </label>
            <input
              type="text"
              value={era}
              onChange={(e) => setEra(e.target.value)}
              placeholder="Ex: Construção do Templo, Origens & Fundação, Elevação Canônica"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Título do Acontecimento *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: A Nova Matriz por Benedito Calixto Neto"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Subtítulo / Contexto
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: O mesmo arquiteto do Santuário Nacional de Aparecida"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Narrativa Histórica Detalhada *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva com riqueza o contexto histórico, os pioneiros e o significado para a fé da comunidade..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Destaque / Citação Chave (Box Dourado)
            </label>
            <input
              type="text"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder="Ex: Projeto neoclássico concebido pelo mesmo projetista da Basílica de Aparecida/SP."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                URL da Foto Histórica
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/historia/projeto-benedito-calixto.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Legenda da Imagem
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Ex: Projeto original de 1952 assinado pelo arquiteto..."
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
              {milestone ? 'Salvar Alterações' : 'Criar Marco Histórico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
