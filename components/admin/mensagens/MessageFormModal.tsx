'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  UserCheck,
  Church,
  Calendar,
  Sparkles,
  Loader2,
  FileText,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { PastoralMessage } from '@/types';

interface MessageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (messageText: string) => void;
  messageToEdit?: PastoralMessage | null;
  parishId: string;
}

export function MessageFormModal({
  isOpen,
  onClose,
  onSuccess,
  messageToEdit,
  parishId,
}: MessageFormModalProps) {
  const [authorType, setAuthorType] = useState<'paroco' | 'bispo' | 'vigario'>('paroco');
  const [authorName, setAuthorName] = useState('Padre Irineu Claudino Sales');
  const [authorTitle, setAuthorTitle] = useState('Pároco e Cura da Catedral');
  const [authorPhotoUrl, setAuthorPhotoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [liturgicalSeason, setLiturgicalSeason] = useState('Tempo Comum');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isFeaturedHome, setIsFeaturedHome] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preenchimento de dados ao abrir ou alternar edição
  useEffect(() => {
    if (messageToEdit) {
      setAuthorType(messageToEdit.author_type);
      setAuthorName(messageToEdit.author_name);
      setAuthorTitle(messageToEdit.author_title);
      setAuthorPhotoUrl(messageToEdit.author_photo_url || '');
      setTitle(messageToEdit.title);
      setSlug(messageToEdit.slug);
      setSubtitle(messageToEdit.subtitle || '');
      setContent(messageToEdit.content || '');
      setLiturgicalSeason(messageToEdit.liturgical_season || 'Tempo Comum');
      setCoverImageUrl(messageToEdit.cover_image_url || '');
      setIsFeaturedHome(messageToEdit.is_featured_home);
      setIsActive(messageToEdit.is_active);
    } else {
      resetForm();
    }
  }, [messageToEdit, isOpen]);

  const resetForm = () => {
    setAuthorType('paroco');
    setAuthorName('Padre Irineu Claudino Sales');
    setAuthorTitle('Pároco e Cura da Catedral');
    setAuthorPhotoUrl('');
    setTitle('');
    setSlug('');
    setSubtitle('');
    setContent('');
    setLiturgicalSeason('Tempo Comum');
    setCoverImageUrl('');
    setIsFeaturedHome(false);
    setIsActive(true);
    setErrorMsg(null);
  };

  // Sugestão automática de dados padrão ao mudar o tipo de autor
  const handleAuthorTypeChange = (type: 'paroco' | 'bispo' | 'vigario') => {
    setAuthorType(type);
    if (!messageToEdit) {
      if (type === 'paroco') {
        setAuthorName('Padre Irineu Claudino Sales');
        setAuthorTitle('Pároco e Cura da Catedral');
      } else if (type === 'bispo') {
        setAuthorName('Dom Lauro Sérgio Versiani Barbosa');
        setAuthorTitle('Bispo Diocesano de Colatina');
      } else {
        setAuthorName('Padre Deivid José');
        setAuthorTitle('Vigário Paroquial');
      }
    }
  };

  // Gerador automático de slug a partir do título
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!messageToEdit) {
      const generatedSlug = newTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !slug.trim() || !content.trim()) {
      setErrorMsg('Título, slug e conteúdo da mensagem são obrigatórios.');
      return;
    }

    try {
      setSaving(true);
      const supabase = createClient();

      // Regra de Ouro da Home: se esta mensagem for marcada como destaque, desmarcar as outras
      if (isFeaturedHome) {
        await supabase
          .from('pastoral_messages')
          .update({ is_featured_home: false })
          .eq('parish_id', parishId);
      }

      const payload = {
        parish_id: parishId,
        author_type: authorType,
        author_name: authorName.trim(),
        author_title: authorTitle.trim(),
        author_photo_url: authorPhotoUrl.trim() || null,
        title: title.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim() || null,
        content: content.trim(),
        liturgical_season: liturgicalSeason.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        is_featured_home: isFeaturedHome,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      };

      if (messageToEdit) {
        // Atualização
        const { error } = await supabase
          .from('pastoral_messages')
          .update(payload)
          .eq('id', messageToEdit.id);

        if (error) throw error;
        onSuccess('Mensagem pastoral atualizada com sucesso!');
      } else {
        // Criação
        const { error } = await supabase.from('pastoral_messages').insert({
          ...payload,
          published_at: new Date().toISOString(),
        });

        if (error) throw error;
        onSuccess('Nova mensagem pastoral publicada com sucesso!');
      }

      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Erro ao salvar mensagem pastoral:', err);
      setErrorMsg(error?.message || 'Erro ao comunicar com o banco de dados.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--dash-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--dash-text-primary)] font-display">
                {messageToEdit ? 'Editar Mensagem Pastoral' : 'Nova Mensagem Pastoral'}
              </h2>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Coluna editorial do Pároco, Bispo ou Vigários com destaque na Home
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerta de Erro */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Linha 1: Tipo de Autor e Tempo Litúrgico */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Coluna / Autor
              </label>
              <select
                value={authorType}
                onChange={(e) =>
                  handleAuthorTypeChange(e.target.value as 'paroco' | 'bispo' | 'vigario')
                }
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="paroco">Palavra do Pároco (Pe. Irineu)</option>
                <option value="bispo">Palavra do Bispo (Dom Lauro)</option>
                <option value="vigario">Palavra dos Vigários (Pe. Deivid / Pe. Ernandes)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Tempo Litúrgico / Solenidade
              </label>
              <input
                type="text"
                value={liturgicalSeason}
                onChange={(e) => setLiturgicalSeason(e.target.value)}
                placeholder="Ex: Tempo Comum, Solenidade de Todos os Santos"
                className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] px-3.5 py-2.5 text-xs text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)]/50 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Linha 2: Nome do Autor e Título Eclesiástico */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Nome do Autor
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] px-3.5 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Título Eclesiástico
              </label>
              <input
                type="text"
                value={authorTitle}
                onChange={(e) => setAuthorTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] px-3.5 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Título Principal */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
              Título da Mensagem
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Uma Igreja em Saída nos Meios Digitais: Bem-vindos ao Novo Portal!"
              required
              className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] px-3.5 py-2.5 text-xs text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)]/50 focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
            />
          </div>

          {/* Slug e Subtítulo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Slug da Rota (/mensagens/[slug])
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] px-3.5 py-2.5 text-xs font-mono text-[var(--dash-text-primary)] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Subtítulo / Citação Breve
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ex: A beleza de nossa fé precisa resplandecer onde o povo está..."
                className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] px-3.5 py-2.5 text-xs text-[var(--dash-text-primary)] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Conteúdo Completo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
              Conteúdo Pastoral Completo
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva a reflexão pastoral, carta aos paroquianos ou homilia..."
              required
              className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] p-3.5 text-xs leading-relaxed text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)]/50 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Checkboxes de Configuração */}
          <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeaturedHome}
                onChange={(e) => setIsFeaturedHome(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-[var(--dash-border)]"
              />
              <div className="text-xs">
                <span className="font-bold text-[var(--dash-text-primary)] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  Definir como Destaque Solene na Home
                </span>
                <p className="text-[var(--dash-text-secondary)] text-[11px] mt-0.5">
                  Esta mensagem ocupará o card nobre da Palavra do Pároco/Bispo na primeira página.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none pt-2 border-t border-[var(--dash-border)]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-[var(--dash-border)]"
              />
              <div className="text-xs">
                <span className="font-bold text-[var(--dash-text-primary)]">
                  Publicar Imediatamente (Visível no Portal do Fiel)
                </span>
                <p className="text-[var(--dash-text-secondary)] text-[11px] mt-0.5">
                  Se desmarcado, ficará salvo como rascunho invisível no portal público.
                </p>
              </div>
            </label>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--dash-border)]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-[var(--dash-border)] text-xs font-semibold text-[var(--dash-text-secondary)] hover:bg-[var(--dash-surface-secondary)] transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold hover:opacity-95 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando no Banco...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{messageToEdit ? 'Atualizar Mensagem' : 'Publicar Mensagem'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
