'use client';

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Sparkles } from 'lucide-react';
import { ImageCropCompressModal } from './ImageCropCompressModal';

interface ImageUploaderFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  bucket?: string;
  aspectRatio?: number;
  placeholder?: string;
}

export function ImageUploaderField({
  label,
  value,
  onChange,
  folder = 'geral',
  bucket = 'parish-media',
  aspectRatio,
  placeholder = '/images/exemplo.webp',
}: ImageUploaderFieldProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#FFA82A]" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-[#FFA82A] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualInput ? 'Ocultar URL manual' : 'Digitar URL manual'}</span>
        </button>
      </div>

      {/* Card Visual com Preview ou Botão de Upload */}
      {value ? (
        <div className="flex items-center gap-4 p-3 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface-hover)]/30">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-[var(--dash-border)] shrink-0">
            <img
              src={value}
              alt="Preview da imagem"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Foto Carregada
            </span>
            <p className="text-xs text-[var(--dash-text-secondary)] truncate font-mono">
              {value}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="text-xs font-bold text-[#FFA82A] hover:brightness-110 flex items-center gap-1 min-h-[36px]"
              >
                <Sparkles className="w-3 h-3" />
                <span>Trocar / Reenquadrar</span>
              </button>
              <span className="text-[var(--dash-border)]">•</span>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs font-semibold text-rose-500 hover:text-rose-400 flex items-center gap-1 min-h-[36px]"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remover</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full p-4 rounded-2xl border border-dashed border-[var(--dash-border)] hover:border-[#FFA82A]/60 bg-[var(--dash-surface-input)] hover:bg-[var(--dash-surface-hover)]/40 transition-all flex items-center justify-center gap-3 group min-h-[56px] cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] group-hover:scale-105 transition-transform">
            <Upload className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-[var(--dash-text-primary)] block">
              + Enviar Foto (com corte e compressão WebP)
            </span>
            <span className="text-[11px] text-[var(--dash-text-secondary)]">
              Reduz automaticamente o tamanho do arquivo para carregamento rápido
            </span>
          </div>
        </button>
      )}

      {/* Campo Manual Retrátil */}
      {showManualInput && (
        <div className="pt-1 animate-in fade-in duration-200">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-input)] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/40"
          />
        </div>
      )}

      {/* Modal de Recorte e Compressão */}
      <ImageCropCompressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUploadSuccess={(url) => onChange(url)}
        folder={folder}
        bucket={bucket}
        initialAspectRatio={aspectRatio}
      />
    </div>
  );
}
