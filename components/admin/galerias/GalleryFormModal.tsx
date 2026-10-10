'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Image as ImageIcon,
  Calendar,
  MapPin,
  UploadCloud,
  Trash2,
  AlertCircle,
  Plus,
  Loader2,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Community, Gallery } from '@/types';
import { Button, Input, Select } from '@/components/ui';

interface GalleryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  galleryToEdit?: Gallery | null;
  communities: Community[];
  parishId: string;
}

export function GalleryFormModal({
  isOpen,
  onClose,
  onSuccess,
  galleryToEdit,
  communities,
  parishId,
}: GalleryFormModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [communityId, setCommunityId] = useState<string>('none');
  const [eventDate, setEventDate] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [photosText, setPhotosText] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (galleryToEdit) {
      setTitle(galleryToEdit.title || '');
      setSlug(galleryToEdit.slug || generateSlug(galleryToEdit.title || ''));
      setCommunityId(galleryToEdit.community_id || 'none');
      setEventDate(galleryToEdit.event_date || '');
      setCoverImageUrl(galleryToEdit.cover_image_url || '');
      setDescription(galleryToEdit.description || '');
      setPhotosText(
        Array.isArray(galleryToEdit.photos) ? galleryToEdit.photos.join('\n') : ''
      );
      setIsActive(galleryToEdit.is_active ?? true);
    } else {
      setTitle('');
      setSlug('');
      setCommunityId('none');
      setEventDate(new Date().toISOString().split('T')[0]);
      setCoverImageUrl('');
      setDescription('');
      setPhotosText('');
      setIsActive(true);
    }
    setErrorMsg(null);
  }, [galleryToEdit, isOpen]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!galleryToEdit) {
      setSlug(generateSlug(val));
    }
  };

  // Upload opcional direto para o bucket 'galleries' do Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg(null);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `albums/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('galleries')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) {
          console.warn('Erro ao subir foto no storage:', uploadError.message);
          continue;
        }

        const { data: publicData } = supabase.storage
          .from('galleries')
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          uploadedUrls.push(publicData.publicUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        // Se ainda não tiver capa, define a primeira foto como capa
        if (!coverImageUrl) {
          setCoverImageUrl(uploadedUrls[0]);
        }
        // Adiciona as URLs ao textarea de fotos
        const currentList = photosText.trim() ? photosText.trim().split('\n') : [];
        const combined = [...currentList, ...uploadedUrls];
        setPhotosText(combined.join('\n'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha no upload';
      setErrorMsg('Aviso de upload: ' + msg);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('O título do álbum é obrigatório.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      // Processar URLs das fotos
      const photosArray = photosText
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const cover = coverImageUrl.trim() || photosArray[0] || null;

      const payload = {
        parish_id: parishId,
        community_id: communityId === 'none' ? null : communityId,
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        description: description.trim() || null,
        event_date: eventDate || null,
        cover_image_url: cover,
        photos_count: photosArray.length,
        photos: photosArray,
        is_active: isActive,
      };

      if (galleryToEdit) {
        const { error } = await supabase
          .from('galleries')
          .update(payload)
          .eq('id', galleryToEdit.id);

        if (error) throw error;
        onSuccess('Álbum atualizado com sucesso!');
      } else {
        const { error } = await supabase.from('galleries').insert([payload]);
        if (error) throw error;
        onSuccess('Novo álbum de fotos criado com sucesso!');
      }

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar álbum';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--dash-text-primary)]">
                {galleryToEdit ? 'Editar Álbum de Fotos' : 'Novo Álbum de Fotos'}
              </h2>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                {galleryToEdit
                  ? 'Atualize fotos e dados da galeria pastoral.'
                  : 'Crie um álbum de festa de padroeiro ou evento da paróquia.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-border)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Input
            label="Título do Álbum / Evento *"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ex: Festa de São José Operário 2026"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Comunidade Vinculada"
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
            >
              <option value="none">Igreja Matriz / Paróquia Geral</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.is_headquarters ? '⭐ ' : ''}{c.name}
                </option>
              ))}
            </Select>

            <Input
              label="Data da Celebração / Evento"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          <Input
            label="URL da Foto de Capa (Opcional)"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://exemplo.com/foto-capa.jpg"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--dash-text-primary)]">
              Descrição do Evento (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve resumo da festa, homenagens e momentos marcantes..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
            />
          </div>

          {/* Área de Upload e Inclusão de Fotos */}
          <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--dash-text-primary)] flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-amber-400" />
                <span>Upload de Fotos (Supabase Storage)</span>
              </span>
              {uploading && (
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enviando...</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--dash-text-primary)] transition-all">
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Selecionar Fotos do Computador</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <span className="text-[11px] text-[var(--dash-text-secondary)]">
                ou cole URLs abaixo
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[var(--dash-text-secondary)]">
                URLs das Fotos (uma por linha):
              </label>
              <textarea
                rows={4}
                value={photosText}
                onChange={(e) => setPhotosText(e.target.value)}
                placeholder="https://exemplo.com/foto1.jpg&#10;https://exemplo.com/foto2.jpg"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all resize-y"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
            <input
              type="checkbox"
              id="gallery_is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded-md text-[var(--primary)] border-[var(--dash-border)] focus:ring-[var(--primary)] cursor-pointer"
            />
            <label
              htmlFor="gallery_is_active"
              className="text-xs font-semibold text-[var(--dash-text-primary)] cursor-pointer select-none"
            >
              Álbum Publicado (visível no portal e minisite da comunidade)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--dash-border)]">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving || uploading}>
              {galleryToEdit ? 'Salvar Alterações' : 'Criar Álbum'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
