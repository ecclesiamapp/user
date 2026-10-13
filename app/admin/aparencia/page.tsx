'use client';

import React from 'react';
import { useAdminAppearance } from '@/components/admin/context/AdminAppearanceContext';
import { Card, Badge } from '@/components/ui';
import { 
  Palette, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Info, 
  Sun, 
  Moon, 
  Eye,
  Church,
  ShieldCheck
} from 'lucide-react';

export default function AdminAparenciaPage() {
  const { 
    liturgicalColoringEnabled, 
    setLiturgicalColoringEnabled, 
    liturgy,
    loadingLiturgy 
  } = useAdminAppearance();

  const getColorMeta = (color: string) => {
    switch (color) {
      case 'verde':
        return {
          bg: 'bg-emerald-600',
          border: 'border-emerald-500',
          text: 'text-emerald-500',
          gradient: 'from-emerald-700 to-emerald-950',
          desc: 'Esperança, juventude e perseverança cristã. Utilizada durante as 34 semanas do Tempo Comum.',
        };
      case 'roxo':
        return {
          bg: 'bg-purple-700',
          border: 'border-purple-600',
          text: 'text-purple-400',
          gradient: 'from-purple-800 to-purple-950',
          desc: 'Penitência, expectativa e oração profunda. Utilizada no Tempo do Advento e na Quaresma.',
        };
      case 'vermelho':
        return {
          bg: 'bg-rose-700',
          border: 'border-rose-600',
          text: 'text-rose-400',
          gradient: 'from-rose-800 to-rose-950',
          desc: 'Amor supremo e fogo do Espírito Santo. Utilizada no Domingo de Ramos, Pentecostes e festas dos Santos Mártires.',
        };
      case 'rosa':
        return {
          bg: 'bg-pink-600',
          border: 'border-pink-500',
          text: 'text-pink-400',
          gradient: 'from-pink-700 to-pink-900',
          desc: 'Alegria e antecipação solene. Utilizada nos domingos Gaudete (3º do Advento) e Laetare (4º da Quaresma).',
        };
      case 'branco':
      default:
        return {
          bg: 'bg-amber-600',
          border: 'border-amber-400',
          text: 'text-amber-400',
          gradient: 'from-amber-600 to-amber-850',
          desc: 'Glória, júbilo e ressurreição. Utilizada no Tempo do Natal, Tempo Pascal e Solenidades do Senhor e da Virgem Maria.',
        };
    }
  };

  const currentMeta = getColorMeta(liturgy.corLiturgica);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
            Personalização do Painel
          </span>
          <span className="text-xs text-[var(--dash-text-muted)]">• Diocese de Colatina</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text-primary)] mt-1">
          Aparência & Cores Litúrgicas
        </h1>
        <p className="text-sm text-[var(--dash-text-secondary)] mt-0.5">
          Personalize a resposta visual do painel ao ciclo litúrgico oficial da Igreja Católica.
        </p>
      </div>

      {/* 1. Status do Tempo Litúrgico Vigente */}
      <Card className="p-5 sm:p-6 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl ${currentMeta.bg} text-white flex items-center justify-center font-bold shadow-sm`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
                Tempo Litúrgico em Vigor (CNBB)
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[var(--dash-text-primary)]">
                {liturgy.tempoLiturgico}
              </h2>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-full ${currentMeta.bg} text-white text-xs font-bold shadow-xs flex items-center gap-1.5`}>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="capitalize">{liturgy.corLiturgica}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]/60 text-xs space-y-1">
          <p className="font-semibold text-[var(--dash-text-primary)]">
            {liturgy.celebracaoTitulo}
          </p>
          <p className="text-[var(--dash-text-secondary)]">
            {currentMeta.desc}
          </p>
        </div>
      </Card>

      {/* 2. Controle Principal: Coloração Dinâmica dos Menus */}
      <Card className="p-5 sm:p-6 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--dash-text-primary)] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[var(--primary)]" />
              Coloração Litúrgica nos Menus da Sidebar
            </h3>
            <p className="text-xs text-[var(--dash-text-secondary)] max-w-lg leading-relaxed">
              Quando ativada, a cor dos menus ativos da barra lateral acompanhará a cor litúrgica oficial do tempo da Igreja (verde no Tempo Comum, roxo no Advento/Quaresma, etc.). Se desativada, a barra exibirá apenas o clássico Bordeaux da Catedral, mantendo o sticker litúrgico no topo.
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => setLiturgicalColoringEnabled(!liturgicalColoringEnabled)}
            className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer shrink-0 border ${
              liturgicalColoringEnabled
                ? 'bg-emerald-600 border-emerald-700'
                : 'bg-slate-300 dark:bg-slate-700 border-slate-400'
            }`}
            aria-label="Alternar coloração litúrgica"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform absolute top-0.5 left-1 ${
                liturgicalColoringEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Pré-visualização Comparativa */}
        <div className="pt-3 border-t border-[var(--dash-border)] space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] block">
            Pré-visualização do Menu Ativo:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Opção A: Litúrgica Ativada */}
            <div
              onClick={() => setLiturgicalColoringEnabled(true)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                liturgicalColoringEnabled
                  ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                  : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--dash-text-primary)]">
                  Com Cor Litúrgica Dinâmica
                </span>
                {liturgicalColoringEnabled && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-r ${currentMeta.gradient} text-white font-bold text-xs flex items-center justify-between border ${currentMeta.border}`}>
                <span>Secretaria & Inscrições</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20">Ativo</span>
              </div>
            </div>

            {/* Opção B: Clássico Catedral */}
            <div
              onClick={() => setLiturgicalColoringEnabled(false)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                !liturgicalColoringEnabled
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5 ring-1 ring-[var(--primary)]'
                  : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--dash-text-primary)]">
                  Tema Clássico Bordeaux
                </span>
                {!liturgicalColoringEnabled && (
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                )}
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-bold text-xs flex items-center justify-between border border-[#FFA82A]/40 shadow-xs">
                <span>Secretaria & Inscrições</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20">Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Guia Rápido das Cores Canônicas da Igreja */}
      <Card className="p-5 sm:p-6 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-3 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-muted)] flex items-center gap-1.5">
          <Church className="w-3.5 h-3.5 text-[var(--primary)]" />
          Ciclo Canônico de Cores Litúrgicas
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Verde</span>
            </div>
            <p className="text-[11px] text-[var(--dash-text-secondary)]">Tempo Comum (34 Semanas)</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-600">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Roxo</span>
            </div>
            <p className="text-[11px] text-[var(--dash-text-secondary)]">Advento e Quaresma</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Branco / Dourado</span>
            </div>
            <p className="text-[11px] text-[var(--dash-text-secondary)]">Tempo Pascal, Natal e Solenidades</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-600">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Vermelho</span>
            </div>
            <p className="text-[11px] text-[var(--dash-text-secondary)]">Pentecostes e Mártires</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]/60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-pink-600">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>Rosa</span>
            </div>
            <p className="text-[11px] text-[var(--dash-text-secondary)]">Domingos Gaudete e Laetare</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
