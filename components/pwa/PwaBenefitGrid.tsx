import React from 'react';
import Link from 'next/link';
import { Clock, BookOpen, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

export function PwaBenefitGrid() {
  return (
    <div className="space-y-6">
      {/* Título da Seção */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#C8A463]">
          A Catedral no seu dia a dia
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-[var(--dash-text-primary)] font-cinzel tracking-[0.04em] uppercase">
          Por que salvar o aplicativo no seu celular?
        </h3>
      </div>

      {/* Grid de 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-2.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
            Horários de Santa Missa
          </h4>
          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Consulte os Horários da Catedral e das 12 CEBs em tempo real, sem depender de ligar para a paróquia.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-2.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-red-800/20 text-red-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
            Folheto Litúrgico Dominical
          </h4>
          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Acompanhe leituras, cânticos e orações das celebrações na palma da mão («Sou do Sagrado Missa»).
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-2.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
            Avisos da Secretaria
          </h4>
          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Novidades da PASCOM, festas de padroeiros, encontros de catequese e avisos urgentes.
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-2.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
            Ultraleve e Seguro
          </h4>
          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Não gasta a memória do telefone, não exige senhas de lojas de aplicativos e é 100% gratuito.
          </p>
        </div>
      </div>

      {/* Botões Finais de Navegação */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto min-h-[44px] text-xs font-bold"
          >
            Acessar o Portal da Catedral
          </Button>
        </Link>
        <Link href="/agenda-liturgica" className="w-full sm:w-auto">
          <Button
            variant="ghost"
            size="md"
            className="w-full sm:w-auto min-h-[44px] text-xs text-amber-400 hover:text-amber-300"
          >
            Ver Horários de Missa →
          </Button>
        </Link>
      </div>
    </div>
  );
}
