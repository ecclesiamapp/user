import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Church, Smartphone, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';
import { CathedralHeader } from '@/components/layout/CathedralHeader';
import { CathedralFooter } from '@/components/home/CathedralFooter';
import { PwaInstallGuide } from '@/components/pwa/PwaInstallGuide';
import { SubpageNavHeader } from '@/components/layout/SubpageNavHeader';

export const metadata: Metadata = {
  title: 'Instalar Aplicativo Oficial • Catedral de Colatina',
  description: 'Instale o aplicativo oficial da Catedral do Sagrado Coração de Jesus direto no seu celular. Horários de Santa Missa, folhetos litúrgicos e avisos paroquiais.',
  openGraph: {
    title: 'Aplicativo Oficial da Catedral de Colatina',
    description: 'Acesse os horários de missas, folheto dominical e comunicados da Catedral direto na tela do seu celular.',
    type: 'website',
  },
};

export default function InstalarPwaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--dash-bg)] text-[var(--dash-text-primary)]">
      {/* Cabeçalho Oficial da Catedral */}
      <CathedralHeader />

      {/* Conteúdo Principal */}
      <main className="flex-1 pb-16">
        {/* Banner Hero Solene */}
        <section className="relative overflow-hidden py-10 sm:py-14 border-b border-[var(--dash-border)] bg-gradient-to-b from-[#1C1111] via-[var(--dash-bg)] to-[var(--dash-bg)]">
          {/* Elementos Decorativos de Fundo */}
          <div className="absolute inset-0 bg-[radial-gradient(#C8A463_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4">
            {/* Navegação Retrô / Voltar */}
            <SubpageNavHeader 
              portalBackText="Voltar ao Portal da Catedral"
              portalBackHref="/"
              adminReturnHref="/admin/materiais-impressao"
              adminReturnText="Painel Admin"
              badgeText="Canal Paroquial Oficial"
            />

            {/* Selo Litúrgico Solene */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8B1E22]/15 via-[#C8A463]/10 to-[#8B1E22]/15 border border-[#C8A463]/40 text-[#8B1E22] text-xs font-bold uppercase tracking-wider shadow-xs">
              <span className="text-[#C8A463]">✝</span>
              <span className="font-cinzel">Catedral do Sagrado Coração de Jesus</span>
              <span className="text-[#C8A463]">•</span>
              <span className="font-sans">Diocese de Colatina</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-2xl sm:text-4xl font-extrabold font-cinzel tracking-[0.04em] text-[var(--dash-text-primary)] uppercase max-w-2xl mx-auto leading-tight">
              Tenha a Catedral sempre com você no seu celular
            </h1>

            {/* Subtítulo Pastoral */}
            <p className="text-sm sm:text-base text-[var(--dash-text-secondary)] max-w-2xl mx-auto leading-relaxed font-sans">
              Acesse a grade de <strong>Santas Missas</strong>, o folheto dominical (<em>«Sou do Sagrado Missa»</em>), comunicados dos padres e as <strong>12 comunidades</strong> direto na tela inicial do seu smartphone.
            </p>
          </div>
        </section>

        {/* Corpo do Guia Interativo de Instalação */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          <PwaInstallGuide />

          {/* Atalho para Impressão de Materiais de Bancos (Equipe Pastoral) */}
          <div className="mt-14 p-5 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--dash-text-secondary)]">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[var(--dash-text-primary)]">
                  Faz parte da Secretaria ou Equipe da PASCOM?
                </p>
                <p>
                  Imprima os displays de banco e cartazes A4 com QR Code para os bancos da Catedral.
                </p>
              </div>
            </div>

            <Link href="/instalar/imprimir" className="shrink-0">
              <button 
                type="button"
                className="px-4 py-2 rounded-xl bg-[var(--dash-surface)] hover:bg-[var(--dash-border)] border border-[var(--dash-border)] text-amber-400 font-bold transition-colors cursor-pointer min-h-[44px]"
              >
                Gerar Materiais dos Bancos
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Rodapé Oficial da Catedral */}
      <CathedralFooter />
    </div>
  );
}
