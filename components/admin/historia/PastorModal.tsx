'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Crown, User, Check, Image as ImageIcon } from 'lucide-react';
import { ParishPastorSuccession } from '@/types';
import { ImageUploaderField } from '@/components/admin/shared/ImageUploaderField';

interface PastorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ParishPastorSuccession>) => Promise<void>;
  pastor: ParishPastorSuccession | null;
  defaultCategory?: 'bishop' | 'pastor';
}

export function PastorModal({ isOpen, onClose, onSave, pastor, defaultCategory = 'bishop' }: PastorModalProps) {
  const [category, setCategory] = useState<'bishop' | 'pastor'>('bishop');
  const [orderNumber, setOrderNumber] = useState('1');
  const [orderLabel, setOrderLabel] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [motto, setMotto] = useState('');
  const [mottoTranslation, setMottoTranslation] = useState('');
  const [summary, setSummary] = useState('');
  const [achievementsText, setAchievementsText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [inMemoriam, setInMemoriam] = useState(false);
  const [deceasedYear, setDeceasedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pastor) {
      setCategory(pastor.category);
      setOrderNumber(String(pastor.order_number || 1));
      setOrderLabel(pastor.order_label || '');
      setName(pastor.name || '');
      setTitle(pastor.title || '');
      setPeriod(pastor.period || '');
      setMotto(pastor.motto || '');
      setMottoTranslation(pastor.motto_translation || '');
      setSummary(pastor.summary || '');
      setAchievementsText(Array.isArray(pastor.achievements) ? pastor.achievements.join('\n') : '');
      setImageUrl(pastor.image_url || '');
      setIsCurrent(!!pastor.is_current);
      setInMemoriam(!!pastor.in_memoriam);
      setDeceasedYear(pastor.deceased_year || '');
    } else {
      setCategory(defaultCategory);
      setOrderNumber('1');
      setOrderLabel(defaultCategory === 'bishop' ? '1º Bispo Diocesano' : 'Pároco');
      setName('');
      setTitle('');
      setPeriod('');
      setMotto('');
      setMottoTranslation('');
      setSummary('');
      setAchievementsText('');
      setImageUrl('');
      setIsCurrent(false);
      setInMemoriam(false);
      setDeceasedYear('');
    }
    setError(null);
  }, [pastor, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !period.trim() || !summary.trim()) {
      setError('Por favor, preencha o nome, período de governo e resumo biográfico.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const parsedAchievements = achievementsText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      await onSave({
        category,
        order_number: parseInt(orderNumber, 10) || 1,
        order_label: orderLabel.trim() || null,
        name: name.trim(),
        title: title.trim() || null,
        period: period.trim(),
        motto: motto.trim() || null,
        motto_translation: mottoTranslation.trim() || null,
        summary: summary.trim(),
        achievements: parsedAchievements,
        image_url: imageUrl.trim() || null,
        is_current: isCurrent,
        in_memoriam: inMemoriam,
        deceased_year: inMemoriam ? (deceasedYear.trim() || null) : null,
      });
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar pastor/bispo:', err);
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
              {category === 'bishop' ? <Crown className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </span>
            <div>
              <h2 className="font-cinzel text-xl font-bold">
                {pastor ? 'Editar Pastor / Bispo' : 'Cadastrar na Sucessão Pastoral'}
              </h2>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Registro canônico de bispos diocesanos e párocos da história da paróquia.
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
                Grau Ministerial *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'bishop' | 'pastor')}
                className="dash-select w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              >
                <option value="bishop">Bispo Diocesano</option>
                <option value="pastor">Pároco / Sacerdote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Rótulo / Título de Ordem
              </label>
              <input
                type="text"
                value={orderLabel}
                onChange={(e) => setOrderLabel(e.target.value)}
                placeholder="Ex: 1º Bispo Diocesano ou Pároco Atual"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Número de Sequência
              </label>
              <input
                type="number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Nome do Pastor / Bispo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dom Lauro Sérgio Versiani Barbosa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Período de Pastoreio *
              </label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Ex: 2022 – Presente ou 1990 – 2002"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Lema Episcopal / Sacerdotal (Latim ou Português)
              </label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                placeholder="Ex: Caritas Christi Urget Nos"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Tradução e Referência Bíblica do Lema
              </label>
              <input
                type="text"
                value={mottoTranslation}
                onChange={(e) => setMottoTranslation(e.target.value)}
                placeholder="Ex: O amor de Cristo nos impele (2Cor 5, 14)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Resumo Biográfico & Ministério Pastoral *
            </label>
            <textarea
              rows={3}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Descreva a missão, ordenação, acolhimento aos fiéis e zelo pastoral..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Principais Obras & Marcos Pastorais (1 por linha)
            </label>
            <textarea
              rows={3}
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              placeholder="Exemplo:&#10;Instalação solene da Cátedra e Cúria em 1990&#10;Criação do Seminário Diocesano&#10;Visitas pastorais em todas as 12 CEBs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div className="space-y-4 pt-1">
            <ImageUploaderField
              label="Foto Oficial do Bispo / Pároco"
              value={imageUrl}
              onChange={setImageUrl}
              folder="pastores"
              aspectRatio={3 / 4}
              placeholder="/images/pastores/bispo.webp"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => {
                    setIsCurrent(e.target.checked);
                    if (e.target.checked) setInMemoriam(false);
                  }}
                  className="w-4 h-4 rounded text-[#8B1E22] focus:ring-[#8B1E22]"
                />
                <span className="text-xs font-bold text-[var(--dash-text-primary)]">
                  Em exercício ministerial ativo?
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inMemoriam}
                  onChange={(e) => {
                    setInMemoriam(e.target.checked);
                    if (e.target.checked) setIsCurrent(false);
                  }}
                  className="w-4 h-4 rounded text-[#8B1E22] focus:ring-[#8B1E22]"
                />
                <span className="text-xs font-bold text-[var(--dash-text-primary)]">
                  ✝ In Memoriam (sacerdote falecido)?
                </span>
              </label>
            </div>

            {inMemoriam && (
              <div className="pt-2 animate-in fade-in duration-150">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                  Ano de Falecimento (para badge solene)
                </label>
                <input
                  type="text"
                  value={deceasedYear}
                  onChange={(e) => setDeceasedYear(e.target.value)}
                  placeholder="Ex: 2023, 2018 ou In Memoriam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
                />
              </div>
            )}
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
              {pastor ? 'Salvar Pastor' : 'Cadastrar Pastor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
