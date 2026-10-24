'use client';

import React, { useEffect } from 'react';
import { X, Bell, Calendar, Tag, BookOpen, Users, HeartHandshake, Share2, Check } from 'lucide-react';
import { CommunityNotice } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: CommunityNotice | null;
  allNotices?: CommunityNotice[];
  communityName: string;
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityNoticeModal({
  isOpen,
  onClose,
  notice,
  allNotices = [],
  communityName,
  liturgicalTheme,
}: CommunityNoticeModalProps) {
  const [copied, setCopied] = React.useState(false);
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

  if (!isOpen || !notice) return null;

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'formacao':
        return { label: 'Formação & Catequese', icon: <BookOpen className="w-3.5 h-3.5" /> };
      case 'liturgia':
        return { label: 'Liturgia & Missa', icon: <Users className="w-3.5 h-3.5" /> };
      case 'mutirao':
        return { label: 'Ação Fraterna & Caridade', icon: <HeartHandshake className="w-3.5 h-3.5" /> };
      default:
        return { label: 'Comunicado Pastoral', icon: <Bell className="w-3.5 h-3.5" /> };
    }
  };

  const badgeInfo = getCategoryBadge(notice.category);

  const handleShare = () => {
    const text = `📢 Aviso da ${communityName}:\n*${notice.title}*\n${notice.content}\nData: ${new Date(notice.date + 'T12:00:00').toLocaleDateString('pt-BR')}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
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
        aria-labelledby="modal-notice-title"
      >
        {/* Glow de Fundo Sutil */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFA82A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-[#FFA82A] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#FFCC36] text-[10px] font-bold uppercase tracking-wider">
                {badgeInfo.icon}
                <span>{badgeInfo.label}</span>
              </span>
              <p className="text-xs text-[#EAE3D9]/70 mt-0.5">
                Mural Pastoral • {communityName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-[#EAE3D9]/70 hover:text-white hover:bg-[var(--dash-surface)]/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Fechar comunicado"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Aviso */}
        <div className="p-5 sm:p-7 space-y-4 overflow-y-auto">
          <h2 id="modal-notice-title" className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
            {notice.title}
          </h2>

          <div className="flex items-center gap-2 text-xs text-[#FFA82A] font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Publicado para {new Date(notice.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#241A17]/80 border border-white/10 text-sm text-[#EAE3D9] leading-relaxed whitespace-pre-line">
            {notice.content}
          </div>

          {/* Orientações extras pastorais */}
          <div className="p-3.5 rounded-xl bg-[var(--dash-surface)]/5 border border-[#C8A463]/25 text-xs text-[#EAE3D9]/70">
            Dúvidas sobre este comunicado? Procure a coordenação do Conselho Comunitário (CPC) ao final da celebração.
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161210] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D211D] hover:bg-[#3D2C27] border border-[#C8A463]/30 text-white font-medium text-xs transition-colors min-h-[44px] cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#FFA82A]" />}
            <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#FFA82A] hover:bg-[#FFB74D] text-[#2D1A16] font-bold text-xs uppercase tracking-wide transition-all min-h-[44px] cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
