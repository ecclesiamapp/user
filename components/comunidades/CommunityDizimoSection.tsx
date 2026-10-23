'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Copy, Check, QrCode, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import { Card, Button } from '@/components/ui';

interface CommunityDizimoSectionProps {
  communityName: string;
  pixKey?: string;
  pixKeyType?: string;
  dizimoInfo?: string;
}

export function CommunityDizimoSection({
  communityName,
  pixKey = '31.800.170/0001-92',
  pixKeyType = 'cnpj',
  dizimoInfo,
}: CommunityDizimoSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Card className="space-y-4 border border-[var(--dash-border)] bg-gradient-to-br from-[var(--dash-surface)] to-[var(--dash-surface-secondary)]">
      <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--dash-border)]">
        <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
          <Heart className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-[var(--dash-text-primary)]">Dízimo & Partilha na Comunidade</h3>
          <p className="text-[11px] text-[var(--dash-text-secondary)]">Sustento da evangelização e conservação da comunidade</p>
        </div>
      </div>

      <div className="space-y-2.5 text-xs text-[var(--dash-text-secondary)] leading-relaxed">
        <p>
          {dizimoInfo || (
            <>
              O Dízimo devolvido com amor nesta comunidade garante a conservação do templo, a acolhida pastoral e as obras de caridade na <strong>{communityName}</strong>.
            </>
          )}
        </p>

        <div className="p-3 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--dash-text-primary)]">
            <span className="flex items-center gap-1.5 text-amber-500">
              <QrCode className="w-3.5 h-3.5" />
              <span>Chave PIX Oficial (Paroquial)</span>
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-[var(--dash-text-muted)]">
              {pixKeyType}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] font-mono text-xs">
            <span className="truncate select-all text-[var(--dash-text-primary)] font-bold">{pixKey}</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-[#2D1A16] font-bold text-[11px] transition-all shrink-0 cursor-pointer min-h-[36px]"
              aria-label="Copiar chave PIX"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-[var(--dash-text-muted)] flex items-start gap-1">
            <Info className="w-3 h-3 text-amber-500/80 shrink-0 mt-0.5" />
            <span>
              Ao realizar a transferência, inclua na descrição: <em>"Dízimo - {communityName}"</em>.
            </span>
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--dash-border)] flex items-center justify-between">
        <Link
          href="/dizimo"
          className="inline-flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors min-h-[36px]"
        >
          <span>Conhecer o projeto «Sou do Sagrado»</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
