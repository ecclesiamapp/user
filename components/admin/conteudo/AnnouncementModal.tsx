'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Newspaper, AlertCircle, Sparkles } from 'lucide-react';
import { Announcement } from '@/types';
import { ImageUploaderField } from '@/components/admin/shared/ImageUploaderField';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Announcement>) => Promise<void>;
  announcement: Announcement | null;
}

export function AnnouncementModal({
  isOpen,
  onClose,
  onSave,
  announcement,
}: AnnouncementModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('aviso');
  const [imageUrl, setImageUrl] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || '');
      setContent(announcement.content || '');
      setCategory(announcement.category || 'aviso');
      setImageUrl(announcement.image_url || '');
      setIsUrgent(!!announcement.is_urgent);
    } else {
      setTitle('');
      setContent('');
      setCategory('aviso');
      setImageUrl('');
      setIsUrgent(false);
    }
    setError(null);
  }, [announcement, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Por favor, informe o título e o conteúdo do comunicado.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        category,
        image_url: imageUrl.trim() || undefined,
        is_urgent: isUrgent,
      });
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar aviso:', err);
      setError(err?.message || 'Falha ao salvar aviso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-2xl p-6 sm:p-7 text-[var(--dash-text-primary)] my-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--dash-border)]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A]">
              <Newspaper className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-cinzel text-lg font-bold">
                {announcement ? 'Editar Publicação Pastoral' : 'Nova Publicação Pastoral'}
              </h3>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Divulgue comunicados, avisos e notícias para os fiéis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Título do Comunicado *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Horários Especiais da Semana Santa"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Announcement['category'])}
                className="dash-select w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
              >
                <option value="aviso">Aviso Geral</option>
                <option value="noticia">Notícia Paroquial</option>
                <option value="evento">Evento / Solenidade</option>
                <option value="pastoral">Pastoral</option>
                <option value="festa_padroeiro">Festa do Padroeiro</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-rose-500">
                  Marcar como Aviso Urgente
                </span>
              </label>
            </div>
          </div>

          {/* Upload com Compressão */}
          <ImageUploaderField
            label="Foto de Capa do Comunicado (Opcional)"
            value={imageUrl}
            onChange={setImageUrl}
            folder="avisos"
            aspectRatio={16 / 9}
            placeholder="https://exemplo.com/foto-aviso.webp"
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] mb-1">
              Conteúdo da Notícia *
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva as orientações, horários, recomendações pastorais e contatos..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
            />
          </div>

          {/* Botões */}
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
              {announcement ? 'Salvar Alterações' : 'Publicar Comunicado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
