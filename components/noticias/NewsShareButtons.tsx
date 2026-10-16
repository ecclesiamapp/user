'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle } from 'lucide-react';

interface NewsShareButtonsProps {
  title: string;
  slug: string;
}

export function NewsShareButtons({ title, slug }: NewsShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getArticleUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/noticias/${slug}`;
    }
    return `https://catedraldecolatina.org.br/noticias/${slug}`;
  };

  const handleCopyLink = async () => {
    const url = getArticleUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleShareWhatsApp = () => {
    const url = getArticleUrl();
    const text = encodeURIComponent(`*${title}*\n\nConfira esta notícia no portal da Catedral de Colatina:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title,
          text: `Confira esta notícia da Catedral de Colatina: ${title}`,
          url: getArticleUrl(),
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Botão WhatsApp */}
      <button
        onClick={handleShareWhatsApp}
        type="button"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-600/30 text-xs font-bold transition-all min-h-[44px] cursor-pointer"
        title="Compartilhar no WhatsApp"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span>WhatsApp</span>
      </button>

      {/* Botão Copiar Link */}
      <button
        onClick={handleCopyLink}
        type="button"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--dash-surface-hover)] hover:bg-[var(--dash-border)]/50 text-[var(--dash-text-primary)] border border-[var(--dash-border)] text-xs font-semibold transition-all min-h-[44px] cursor-pointer"
        title="Copiar link da notícia"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 font-bold">Link Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-[var(--dash-text-secondary)]" />
            <span>Copiar Link</span>
          </>
        )}
      </button>

      {/* Botão Compartilhar Geral (Mobile Share) */}
      <button
        onClick={handleNativeShare}
        type="button"
        className="sm:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--dash-surface-hover)] text-[var(--dash-text-secondary)] border border-[var(--dash-border)] text-xs font-semibold min-h-[44px] cursor-pointer"
        title="Compartilhar"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
