'use client';

import React, { useEffect, useState } from 'react';
import { X, MapPin, Navigation, ExternalLink, Copy, Check, Compass, Car, Accessibility } from 'lucide-react';
import { Community } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community;
  googleMapsUrl?: string;
  wazeUrl?: string;
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityLocationModal({
  isOpen,
  onClose,
  community,
  googleMapsUrl,
  wazeUrl,
  liturgicalTheme,
}: CommunityLocationModalProps) {
  const [copied, setCopied] = useState(false);
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fullAddress = `${community.address || 'Templo Comunitário'}, ${community.neighborhood || 'Centro'}, ${community.city} - ${community.state}`;

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#2A1E1A] via-[#1E1614] to-[#15100E] border border-[#C8A463]/40 shadow-2xl shadow-black/80 text-[#FFF3E3] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-location-title"
      >
        {/* Glow de Fundo Sutil */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFA82A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E53935]/20 border border-[#E53935]/50 text-[#E53935] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-[#FFA82A]" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#FFCC36] text-[10px] font-bold uppercase tracking-wider">
                <Compass className="w-3 h-3" />
                <span>Rotas & Localização</span>
              </span>
              <h2 id="modal-location-title" className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
                Como Chegar ao Templo
              </h2>
              <p className="text-xs text-[#EAE3D9]/70">
                {community.name} • {community.city}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-[#EAE3D9]/70 hover:text-white hover:bg-[var(--dash-surface)]/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Fechar localização"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Informações */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto">
          {/* Card Endereço com Copiar */}
          <div className="p-4 rounded-2xl bg-[#2D211D]/80 border border-[#C8A463]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFA82A]">
                Endereço Oficial
              </span>
              <button
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--dash-surface)]/10 hover:bg-[var(--dash-surface)]/20 text-[#FFA82A] text-xs transition-colors min-h-[36px] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
              {fullAddress}
            </p>
          </div>

          {/* Botões de Abertura nos Aplicativos GPS (Touch targets >= 44px) */}
          <div className="space-y-2.5">
            <span className="text-xs text-[#EAE3D9]/70 font-medium block">
              Iniciar Navegação GPS no Celular:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FFA82A] hover:bg-[#FFB74D] text-[#2D1A16] font-bold text-xs uppercase tracking-wide transition-all shadow-md min-h-[46px]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps</span>
                </a>
              )}

              {wazeUrl && (
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2D211D] hover:bg-[#3D2C27] border border-[#C8A463]/40 text-white font-semibold text-xs transition-all shadow-md min-h-[46px]"
                >
                  <ExternalLink className="w-4 h-4 text-[#FFA82A]" />
                  <span>Waze</span>
                </a>
              )}
            </div>
          </div>

          {/* Dicas de Acessibilidade & Estacionamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3.5 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[#FFA82A] font-serif font-bold">
                <Car className="w-3.5 h-3.5" />
                <span>Estacionamento</span>
              </div>
              <p className="text-[#EAE3D9]/70">
                Vagas disponíveis ao redor da praça e no entorno do templo comunitário.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--dash-surface)]/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[#FFA82A] font-serif font-bold">
                <Accessibility className="w-3.5 h-3.5" />
                <span>Acessibilidade</span>
              </div>
              <p className="text-[#EAE3D9]/70">
                Rampas de acesso para cadeirantes e assentos preferenciais para idosos.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161210] flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FFA82A] hover:bg-[#FFB74D] text-[#2D1A16] font-bold text-xs uppercase tracking-wide transition-all min-h-[44px] cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
