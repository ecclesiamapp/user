'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Shield,
  MessageCircle,
  FileCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ParishMovement } from '@/types/movements';

interface MovementHeroProps {
  movement: ParishMovement;
  onOpenModal: () => void;
}

export function MovementHero({ movement, onOpenModal }: MovementHeroProps) {
  const whatsappUrl = movement.contact_whatsapp
    ? `https://wa.me/${movement.contact_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Olá! Gostaria de mais informações sobre o ${movement.name} (${movement.acronym}) na Catedral de Colatina.`
      )}`
    : null;

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 border-b border-[#C8A463]/20 bg-gradient-to-b from-[#1E2228] via-[#16181B] to-[#121417]">
      {/* Decorative Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-[#8B1E22]/20 via-[#C8A463]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#FAF6F0]/60 mb-6 font-sans">
          <Link href="/" className="hover:text-[#FFCC36] transition-colors">
            Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#C8A463]/50" />
          <Link href="/movimentos" className="hover:text-[#FFCC36] transition-colors">
            Movimentos
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#C8A463]/50" />
          <span className="text-[#FFCC36] font-semibold">{movement.acronym}</span>
        </nav>

        {/* Hero Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A463]/15 border border-[#C8A463]/40 text-[#FFCC36] text-xs font-bold font-serif tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Movimento Paroquial Oficial
              </span>
              {movement.patron_saint && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#22262B] border border-[#C8A463]/25 text-[#FAF6F0]/80 text-xs font-medium">
                  Patrono(a): {movement.patron_saint}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#FFCC36] tracking-tight block">
                {movement.acronym}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#FAF6F0] mt-1 leading-tight">
                {movement.name}
              </h1>
            </div>

            {/* Carisma / Motto */}
            {movement.carisma && (
              <p className="text-sm sm:text-base text-[#FAF6F0]/85 font-sans leading-relaxed border-l-2 border-[#C8A463] pl-3.5 italic">
                &ldquo;{movement.carisma}&rdquo;
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8A463] to-[#FFCC36] hover:brightness-110 text-[#2D1A16] font-bold text-xs uppercase tracking-wider transition-all shadow-lg min-h-[44px] cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                Ficha de Manifestação de Interesse
              </button>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#22262B] hover:bg-[#2A2E35] border border-[#C8A463]/30 text-[#FAF6F0] font-bold text-xs uppercase tracking-wider transition-all min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Contato Coordenação
                </a>
              )}
            </div>
          </div>

          {/* Visual Emblem Badge */}
          <div className="hidden md:flex flex-col items-center justify-center w-48 h-48 rounded-3xl bg-gradient-to-br from-[#22262B] via-[#1B1E22] to-[#121417] border-2 border-[#C8A463]/40 shadow-2xl p-6 text-center shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-[#C8A463]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] text-2xl font-serif font-black mb-2">
              {movement.acronym}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFCC36]">
              Catedral de Colatina
            </span>
            <span className="text-[10px] text-[#FAF6F0]/60 mt-0.5">Diocese de Colatina</span>
          </div>
        </div>
      </div>
    </section>
  );
}

