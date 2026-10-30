'use client';

import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { ResolvedEventTheme } from '@/lib/events';

interface EventLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  eventTheme?: ResolvedEventTheme;
}

export function EventLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  eventTheme,
}: EventLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const primary = eventTheme?.primary || '#0E4A80';
  const secondary = eventTheme?.secondary || '#FDCA87';
  const pageBg = eventTheme?.pageBg || '#071629';
  const textPrimary = eventTheme?.textPrimary || '#FAF6F0';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
      style={{ backgroundColor: `${pageBg}F2` }}
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra Superior do Lightbox na Paleta Exclusiva */}
        <div
          className="w-full flex items-center justify-between pb-3"
          style={{ color: textPrimary }}
        >
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <span
              className="p-1.5 rounded-lg text-xs border"
              style={{
                backgroundColor: primary,
                color: secondary,
                borderColor: `${secondary}66`,
              }}
            >
              ✝
            </span>
            <span className="text-xs sm:text-sm font-bold truncate drop-shadow-md">
              {title} • Arte Oficial
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-arte.webp`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 transition-colors flex items-center gap-1.5 text-xs font-semibold min-h-[44px] min-w-[44px] justify-center border"
              style={{
                color: textPrimary,
                borderColor: `${secondary}33`,
              }}
              title="Baixar Arte Oficial"
            >
              <Download className="w-4 h-4" style={{ color: secondary }} />
              <span className="hidden sm:inline">Baixar Imagem</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer border"
              style={{
                color: textPrimary,
                borderColor: `${secondary}33`,
              }}
              aria-label="Fechar ampliação"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Imagem Ampliada com Contenção Responsiva */}
        <div
          className="relative max-h-[82vh] overflow-hidden rounded-2xl border shadow-2xl"
          style={{
            borderColor: `${secondary}45`,
            backgroundColor: pageBg,
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-auto h-auto max-h-[80vh] max-w-full object-contain mx-auto select-none"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
