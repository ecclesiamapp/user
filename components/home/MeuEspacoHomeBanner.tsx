import React from 'react';
import Link from 'next/link';
import {
  Church,
  UserCheck,
  Sparkles,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Heart,
} from 'lucide-react';

export function MeuEspacoHomeBanner() {
  return (
    <section className="w-full rounded-3xl bg-gradient-to-r from-[#22262B] via-[#1B1E22] to-[#22262B] border border-[#C8A463]/30 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 text-[#FAF6F0] relative">
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#8B1E22]/20 via-[#C8A463]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A463]/15 text-[#FFCC36] border border-[#C8A463]/30 text-xs font-bold uppercase tracking-wider font-serif">
            <Sparkles className="w-3.5 h-3.5" />
            Portal do Paroquiano • Catedral de Colatina
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#FAF6F0] tracking-tight leading-tight">
            Meu Espaço Paroquial
          </h2>

          <p className="text-sm sm:text-base text-[#FAF6F0]/80 leading-relaxed font-sans">
            Um ambiente acolhedor e sem senhas difíceis. Acompanhe seus agendamentos com os 4
            padres da Catedral, visualize suas intenções de Santa Missa (Púlpito A4), escolha sua
            Comunidade (CEB) de coração e viva sua fé em comunhão.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16181B] border border-[#C8A463]/20 text-[#FAF6F0]/90">
              <UserCheck className="w-3.5 h-3.5 text-[#C8A463]" />
              Agendamentos com os Padres
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16181B] border border-[#C8A463]/20 text-[#FAF6F0]/90">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A463]" />
              Intenções (Púlpito A4)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16181B] border border-[#C8A463]/20 text-[#FAF6F0]/90">
              <Church className="w-3.5 h-3.5 text-[#C8A463]" />
              Sua Comunidade (CEB)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16181B] border border-[#C8A463]/20 text-[#FAF6F0]/90">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Acesso Simples via WhatsApp
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
          <Link
            href="/meu-espaco"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C8A463] via-[#FFCC36] to-[#C8A463] hover:brightness-110 text-[#2D1A16] font-bold text-xs uppercase tracking-wider transition-all shadow-xl min-h-[48px] cursor-pointer"
          >
            <span>Acessar Meu Espaço</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-[11px] text-[#FAF6F0]/50 text-center lg:text-right">
            Disponível para todos os paroquianos
          </span>
        </div>
      </div>
    </section>
  );
}

