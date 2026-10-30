'use client';

import React, { useEffect } from 'react';
import { X, Download, ZoomIn } from 'lucide-react';

interface EventLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export function EventLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  title,
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra Superior do Lightbox */}
        <div className="w-full flex items-center justify-between pb-3 text-[#FAF6F0]">
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <span className="p-1.5 rounded-lg bg-[#8B1E22] text-[#FFCC36] text-xs">✝</span>
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
              className="p-2.5 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 text-[#FAF6F0] transition-colors flex items-center gap-1.5 text-xs font-semibold min-h-[44px] min-w-[44px] justify-center"
              title="Baixar Arte Oficial"
            >
              <Download className="w-4 h-4 text-[#FFA82A]" />
              <span className="hidden sm:inline">Baixar Imagem</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Fechar ampliação"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Imagem Ampliada com Contenção Responsiva */}
        <div className="relative max-h-[82vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-black/50">
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
