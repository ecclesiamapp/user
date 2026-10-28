'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Quote,
  BookOpen,
  ChevronRight,
  Sparkles,
  UserCheck,
  Crown,
  Share2,
  Check,
  MessageCircle
} from 'lucide-react';
import { PastoralMessage } from '@/types';
import { Card, Badge, Button } from '@/components/ui';
import { fallbackFeaturedMessages } from '@/lib/pastoral-messages';

interface PastoralMessageFeaturedProps {
  message?: PastoralMessage | null;
  messages?: PastoralMessage[] | null;
}

export function PastoralMessageFeatured({ message, messages }: PastoralMessageFeaturedProps) {
  const messageList: PastoralMessage[] =
    messages && messages.length > 0
      ? messages
      : message
      ? [message]
      : fallbackFeaturedMessages;

  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const current = messageList[activeIndex] || messageList[0];
  const isBispo = current.author_type === 'bispo';

  const markImageFailed = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleShareWhatsApp = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://catedraldecolatina.org.br';
    const text = encodeURIComponent(
      `🕊️ *${current.title}*\n` +
      `✍️ *${current.author_name}* (${current.author_title})\n\n` +
      `${current.subtitle ? `_«${current.subtitle}»_\n\n` : ''}` +
      `Leia a mensagem completa no portal da Catedral:\n${baseUrl}/mensagens/${current.slug}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://catedraldecolatina.org.br';
    const url = `${baseUrl}/mensagens/${current.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="pastoral" className="space-y-4 scroll-mt-24">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#8B1E22]/10 dark:bg-[#8B1E22]/30 text-[#8B1E22] dark:text-[#FFA82A] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-[0.05em] text-[var(--dash-text-primary)]">
              Cartas & <span className="text-[#8B1E22] dark:text-[#FFA82A]">Mensagens Pastorais</span>
            </h3>
            <p className="text-xs text-[var(--dash-text-secondary)] font-sans">
              Orientações espirituais e bênçãos do Bispo Diocesano e do Pároco para a nossa comunidade
            </p>
          </div>
        </div>

        <Link
          href="/mensagens"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E22] dark:text-[#FFA82A] hover:underline self-start sm:self-auto min-h-[36px]"
        >
          <span>Ver Todas as Colunas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Seletor de Autor / Carta quando houver múltiplas mensagens */}
      {messageList.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[var(--dash-surface)] rounded-2xl border border-[var(--dash-border)] shadow-2xs">
          {messageList.map((msg, idx) => {
            const isSelected = idx === activeIndex;
            const isMsgBispo = msg.author_type === 'bispo';

            return (
              <button
                key={msg.id}
                onClick={() => setActiveIndex(idx)}
                className={`flex-1 min-w-[200px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#8B1E22] text-white shadow-xs'
                    : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-bg)]'
                }`}
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-stone-800">
                  {msg.author_photo_url && !failedImages[msg.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={msg.author_photo_url}
                      alt={msg.author_name}
                      onError={() => markImageFailed(msg.id)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-300">
                      {isMsgBispo ? <Crown className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </div>
                  )}
                </div>

                <div className="truncate">
                  <span className="block truncate">
                    {isMsgBispo ? 'Carta do Bispo' : 'Palavra do Pároco'}
                  </span>
                  <span className={`block text-[10px] font-normal truncate ${isSelected ? 'text-amber-200' : 'text-[var(--dash-text-muted)]'}`}>
                    {msg.author_name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Card da Mensagem Pastoral em Destaque */}
      <Card className="relative overflow-hidden p-6 sm:p-8 bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-[#FFA82A]/60 transition-all shadow-md">
        {/* Ícone de Aspas decorativo no fundo */}
        <Quote className="absolute right-4 bottom-4 w-32 h-32 text-[#FFA82A]/10 pointer-events-none -rotate-12" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar com identificação do autor */}
          <div className="flex sm:flex-col items-center sm:items-start gap-4 shrink-0">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-3 ring-[#FFA82A]/40 shadow-lg bg-[var(--dash-bg)] flex items-center justify-center">
                {current.author_photo_url && !failedImages[current.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.author_photo_url}
                    alt={current.author_name}
                    onError={() => markImageFailed(current.id)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A]">
                    {isBispo ? <Crown className="w-10 h-10" /> : <UserCheck className="w-10 h-10" />}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFA82A] text-[#2D1A16] shadow-xs uppercase tracking-wider">
                {isBispo ? 'Episcopal' : 'Pároco'}
              </div>
            </div>

            <div className="sm:mt-2 space-y-0.5">
              <h4 className="font-extrabold text-sm sm:text-base text-[var(--dash-text-primary)] leading-tight">
                {current.author_name}
              </h4>
              <p className="text-xs text-[var(--dash-text-secondary)] font-medium">
                {current.author_title}
              </p>
            </div>
          </div>

          {/* Conteúdo da Mensagem */}
          <div className="flex-1 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#8B1E22]/10 text-[#8B1E22] dark:text-[#FFA82A] border border-[#8B1E22]/20">
                <Sparkles className="w-3.5 h-3.5" />
                {isBispo ? 'Carta Episcopal' : 'Palavra do Pastor'}
              </span>
              {current.liturgical_season && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--dash-bg)] text-[var(--dash-text-secondary)] border border-[var(--dash-border)] font-medium">
                  {current.liturgical_season}
                </span>
              )}
            </div>

            <h4 className="font-cinzel text-lg sm:text-xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] leading-snug">
              {current.title}
            </h4>

            {current.subtitle && (
              <p className="font-serif italic text-sm sm:text-base text-[var(--dash-text-primary)] font-medium leading-relaxed bg-[var(--dash-bg)]/80 p-4 rounded-2xl border-l-4 border-[#FFA82A]">
                {current.subtitle}
              </p>
            )}

            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed line-clamp-3">
              {current.content}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <Link
                href={`/mensagens/${current.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#8B1E22] hover:bg-[#721C24] text-white transition-colors shadow-2xs min-h-[44px]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ler Mensagem Completa</span>
              </Link>

              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs min-h-[44px] cursor-pointer"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Compartilhar</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--dash-bg)] hover:bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] transition-colors min-h-[44px] cursor-pointer"
                title="Copiar link da mensagem"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
