'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui';

interface CommunityFacadeUploaderProps {
  value: string;
  onChange: (url: string) => void;
  communitySlug?: string;
  communityName?: string;
  disabled?: boolean;
}

export function CommunityFacadeUploader({
  value,
  onChange,
  communitySlug,
  communityName,
  disabled = false,
}: CommunityFacadeUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('A imagem deve ter no máximo 10MB.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanSlug = (communitySlug || 'comunidade')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-');
      const fileName = `facades/${cleanSlug}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('galleries')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicData } = supabase.storage
        .from('galleries')
        .getPublicUrl(fileName);

      if (publicData?.publicUrl) {
        onChange(publicData.publicUrl);
      } else {
        throw new Error('Não foi possível obter o endereço público da foto.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao realizar upload da imagem.';
      setErrorMsg(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleUploadFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || uploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleUploadFile(files[0]);
    }
  };

  const handleApplyManualUrl = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl('');
      setShowUrlInput(false);
      setErrorMsg(null);
    }
  };

  const handleRemove = () => {
    onChange('');
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--dash-text-primary)] flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
          <span>Foto Oficial da Fachada da Capela</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'Ocultar link manual' : 'Inserir link externo'}</span>
        </button>
      </div>

      {/* Input de URL manual alternativo */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] animate-in fade-in duration-200">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Cole o link da foto (https://...)"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:outline-hidden focus:ring-1 focus:ring-[var(--primary)]"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleApplyManualUrl}
            disabled={!manualUrl.trim()}
          >
            Aplicar
          </Button>
        </div>
      )}

      {/* Visualização de Imagem Existente ou Área de Upload */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]">
          <div className="relative h-44 w-full bg-[var(--dash-surface)]">
            <img
              src={value}
              alt={communityName || 'Fachada da Comunidade'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback visual se a imagem quebrar
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3.5">
              <div className="text-white text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/80 backdrop-blur-xs text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Fachada Cadastrada
                </span>
                <p className="text-[11px] text-zinc-300 mt-1 truncate max-w-[260px] sm:max-w-md">
                  {value}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-black/60 text-white border-white/20 hover:bg-black/80"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || disabled}
                >
                  Substituir
                </Button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled || uploading}
                  title="Remover foto"
                  className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && !disabled && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-[var(--primary)] bg-[var(--primary)]/5'
              : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50 hover:bg-[var(--dash-surface-secondary)] hover:border-[var(--dash-text-secondary)]'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <Loader2 className="w-7 h-7 animate-spin text-[var(--primary)]" />
              <p className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Enviando foto da capela para o Supabase Storage...
              </p>
              <p className="text-[11px] text-[var(--dash-text-secondary)]">
                Processando imagem em alta resolução
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-1 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[var(--dash-text-primary)]">
                  Clique para selecionar ou arraste a foto da capela aqui
                </p>
                <p className="text-[11px] text-[var(--dash-text-secondary)]">
                  Suporta JPG, PNG ou WebP (máximo 10MB). Envio direto para a nuvem.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input nativo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />

      {/* Mensagem de Erro */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
