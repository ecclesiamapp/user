import React from 'react';
import Link from 'next/link';
import { Clock, Church, Heart, User, BookOpen, Radio, Sparkles } from 'lucide-react';

interface HomeHeroSectionProps {
  parishName: string;
  dioceseName: string;
}

export function HomeHeroSection({ parishName, dioceseName }: HomeHeroSectionProps) {
  return (
    <div className="space-y-4">
      {/* 1. Hero Banner Panorâmico com Fotografia Imersiva (Estilo Pe. Alex Nogueira) */}
      <section className="relative overflow-hidden rounded-3xl min-h-[360px] sm:min-h-[420px] flex flex-col justify-end p-6 sm:p-10 shadow-lg border border-[#E8DFD3]">
        {/* Imagem de Fundo em Alta Definição com Efeito Eclesial */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548625361-195fe5795df5?auto=format&fit=crop&w=1920&q=85')`,
          }}
        />

        {/* Gradiente Suave para Assegurar Contraste Perfeito do Texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211A14]/95 via-[#211A14]/65 to-black/30" />

        {/* Conteúdo Sobreposto */}
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--dash-surface)]/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-[var(--brand-gold-soft)] tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold-500)]" />
            <span>{dioceseName} • Paróquia Catedral</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            <span className="text-[var(--brand-gold-500)]">Bem-vindo</span> à Casa do Sagrado Coração
          </h1>

          <p className="text-sm sm:text-base text-[#FCF7F1]/90 leading-relaxed max-w-xl font-normal">
            Uma comunidade viva de fé, acolhimento e oração no coração de Colatina. Participe das celebrações em nossa matriz e capelas.
          </p>

          {/* Botões de Ação no Padrão Âmbar Pe. Alex Nogueira */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <a
              href="#horarios"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-gold-500)] hover:bg-[var(--brand-gold-400)] text-[#2D1A16] font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#2D1A16]" />
              <span>Horários de Missa</span>
            </a>

            <a
              href="#comunidades"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--dash-surface)]/20 hover:bg-[var(--dash-surface)]/30 backdrop-blur-md text-white font-semibold text-sm border border-white/25 transition-all cursor-pointer"
            >
              <Church className="w-4 h-4" />
              <span>12 CEBs & Capelas</span>
            </a>

            <Link
              href="/secretaria"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--dash-surface)]/20 hover:bg-[var(--dash-surface)]/30 backdrop-blur-md text-white font-semibold text-sm border border-white/25 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Secretaria</span>
            </Link>

            <a
              href="#dizimo"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--dash-surface)]/20 hover:bg-[var(--dash-surface)]/30 backdrop-blur-md text-white font-semibold text-sm border border-white/25 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[var(--brand-gold-soft)]" />
              <span>Dízimo & Ofertas</span>
            </a>
          </div>
        </div>

        {/* Indicadores de Slide Inspirados no Carrossel do Pe. Alex */}
        <div className="relative z-10 flex items-center justify-center gap-2 mt-6 pt-2">
          <div className="w-8 h-1.5 rounded-full bg-[var(--brand-gold-500)]" />
          <div className="w-2 h-1.5 rounded-full bg-[var(--dash-surface)]/40" />
          <div className="w-2 h-1.5 rounded-full bg-[var(--dash-surface)]/40" />
        </div>
      </section>

      {/* 2. Floating Schedule Card (Card Branco Limpo com Numerais Tabulares) */}
      <div className="relative -mt-3 sm:-mt-5 mx-2 sm:mx-6 z-20">
        <div className="bg-[var(--dash-surface)] border border-[#E8DFD3] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[var(--dash-surface-secondary)] border border-[#E8DFD3] text-[var(--brand-gold-700)] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-[var(--brand-gold-700)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="tag-gold text-[10px] uppercase font-bold tracking-wider">
                  Hoje na Matriz
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Programação Confirmada
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-[var(--primary)] tabular-nums">
                  19:30
                </span>
                <span className="font-bold text-sm sm:text-base text-[var(--dash-text-primary)]">
                  Santa Missa e Bênção do Santíssimo
                </span>
              </div>
              <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5 flex items-center gap-2">
                <span className="font-medium">Pe. Irineu Claudino Sales</span>
                <span>•</span>
                <span>Confissões hoje das 16h às 18h</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#E8DFD3] shrink-0">
            <a
              href="https://www.youtube.com/@catedraldecolatina"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all"
            >
              <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Transmissão Ao Vivo</span>
            </a>
            <a
              href="#horarios"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[var(--dash-surface-secondary)] hover:bg-[#E2D6C5] text-[var(--dash-text-primary)] text-xs font-bold transition-all"
            >
              <span>Ver Semana</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
