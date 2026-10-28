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
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { LiturgicalColor } from '@/lib/liturgy';
import { AdventPreviewControl } from '@/components/admin/aparencia/AdventPreviewControl';

interface CanonicalColorMeta {
  color: LiturgicalColor;
  name: string;
  textColor: string;
  dotColor: string;
  ringColor: string;
  activeBg: string;
  tempo: string;
  celebracao: string;
}

const CANONICAL_COLORS: CanonicalColorMeta[] = [
  {
    color: 'verde',
    name: 'Verde',
    textColor: 'text-emerald-500',
    dotColor: 'bg-emerald-500',
    ringColor: 'ring-2 ring-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/10',
    activeBg: 'bg-emerald-500/10',
    tempo: 'Tempo Comum (34 Semanas)',
    celebracao: 'Liturgia das Semanas do Tempo Comum — Esperança e Caminhada Pastoral',
  },
  {
    color: 'roxo',
    name: 'Roxo',
    textColor: 'text-purple-400',
    dotColor: 'bg-purple-500',
    ringColor: 'ring-2 ring-purple-500 border-purple-500 shadow-md shadow-purple-500/10',
    activeBg: 'bg-purple-500/10',
    tempo: 'Tempo do Advento e Quaresma',
    celebracao: 'Expectativa, Conversão, Penitência e Oração Litúrgica Profunda',
  },
  {
    color: 'branco',
    name: 'Branco / Dourado',
    textColor: 'text-amber-600',
    dotColor: 'bg-amber-400',
    ringColor: 'ring-2 ring-[#FFA82A] border-2 border-[#FFA82A] shadow-md shadow-amber-500/20',
    activeBg: 'bg-[#FFFFFF] border-2 border-[#FFA82A] text-slate-800 shadow-md',
    tempo: 'Tempo Pascal, Natal e Solenidades',
    celebracao: 'Ressurreição do Senhor, Glória e Grandes Solenidades da Igreja',
  },
  {
    color: 'vermelho',
    name: 'Vermelho',
    textColor: 'text-rose-400',
    dotColor: 'bg-rose-500',
    ringColor: 'ring-2 ring-rose-500 border-rose-500 shadow-md shadow-rose-500/10',
    activeBg: 'bg-rose-500/10',
    tempo: 'Pentecostes e Santos Mártires',
    celebracao: 'Fogo do Espírito Santo, Paixão do Senhor e Testemunho dos Mártires',
  },
  {
    color: 'rosa',
    name: 'Rosa',
    textColor: 'text-pink-400',
    dotColor: 'bg-pink-500',
    ringColor: 'ring-2 ring-pink-500 border-pink-500 shadow-md shadow-pink-500/10',
    activeBg: 'bg-pink-500/10',
    tempo: 'Domingos Gaudete e Laetare',
    celebracao: 'Alegria e Alívio da Espera no Advento e na Quaresma',
  },
];

export default function AdminAparenciaPage() {
  const { 
    liturgicalColoringEnabled, 
    setLiturgicalColoringEnabled, 
    liturgy,
    canonicalLiturgy,
    isSimulating,
    previewColor,
    resetToCanonical,
    fallbackModalOpen,
    setFallbackModalOpen,
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
          bg: 'bg-[#FFFFFF] text-slate-800 border-2 border-[#FFA82A] shadow-xs',
          border: 'border-2 border-[#FFA82A]',
          text: 'text-slate-800 font-bold',
          gradient: 'bg-[#FFFFFF] text-slate-800 border-2 border-[#FFA82A] shadow-xs',
          desc: 'Glória, júbilo e ressurreição. Utilizada no Tempo do Natal, Tempo Pascal e Solenidades do Senhor e da Virgem Maria.',
        };
    }
  };

  const currentMeta = getColorMeta(liturgy.corLiturgica);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Banner de Modo Simulação Litúrgica Ativo */}
      {isSimulating && (
        <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-[var(--dash-text-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-[var(--dash-text-primary)] flex items-center justify-center shrink-0 font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                Modo de Simulação Litúrgica Ativo
              </span>
              <p className="text-xs font-semibold text-[var(--dash-text-primary)]">
                Visualizando tema de: <span className="capitalize font-bold text-amber-400">{liturgy.tempoLiturgico} ({liturgy.corLiturgica})</span>. As cores do painel foram adaptadas para demonstração.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetToCanonical}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-1.5 cursor-pointer shrink-0 transition-all self-start sm:self-auto"
            title="Retornar para o tempo litúrgico oficial de hoje"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFA82A]" />
            <span>Restaurar Liturgia de Hoje</span>
          </button>
        </div>
      )}

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
          Personalize a resposta visual do painel ao ciclo litúrgico oficial da Igreja Católica ou simule tempos do ano litúrgico.
        </p>
      </div>

      {/* 1. Status do Tempo Litúrgico Vigente */}
      <Card className="p-5 sm:p-6 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl ${
              liturgy.corLiturgica === 'branco'
                ? 'bg-[#FFFFFF] text-slate-800 border-2 border-[#FFA82A] shadow-xs'
                : `${currentMeta.bg} text-white`
            } flex items-center justify-center font-bold shadow-sm`}>
              <Sparkles className={`w-5 h-5 ${liturgy.corLiturgica === 'branco' ? 'text-[#FFA82A]' : ''}`} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
                {isSimulating ? 'Tempo Litúrgico Simulado (Demonstração)' : 'Tempo Litúrgico em Vigor (CNBB)'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[var(--dash-text-primary)]">
                {liturgy.tempoLiturgico}
              </h2>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-full ${
            liturgy.corLiturgica === 'branco'
              ? 'bg-[#FFFFFF] text-slate-800 border-2 border-[#FFA82A] shadow-xs'
              : `${currentMeta.bg} text-white`
          } text-xs font-bold shadow-xs flex items-center gap-1.5`}>
            <span className={`w-2 h-2 rounded-full ${liturgy.corLiturgica === 'branco' ? 'bg-[#FFA82A]' : 'bg-[var(--dash-surface)]'} animate-pulse`} />
            <span className="capitalize">{liturgy.corLiturgica === 'branco' ? 'Branco / Dourado' : liturgy.corLiturgica}</span>
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
              className={`w-6 h-6 rounded-full bg-[var(--dash-surface)] shadow-md transition-transform absolute top-0.5 left-1 ${
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
              <div className={`p-2.5 rounded-xl ${
                liturgy.corLiturgica === 'branco'
                  ? 'bg-[#FFFFFF] text-slate-800 border-2 border-[#FFA82A] shadow-md shadow-[#FFA82A]/15'
                  : `bg-gradient-to-r ${currentMeta.gradient} text-white border ${currentMeta.border}`
              } font-bold text-xs flex items-center justify-between`}>
                <span className={liturgy.corLiturgica === 'branco' ? 'text-slate-800 font-extrabold' : 'text-white'}>
                  Secretaria & Inscrições
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  liturgy.corLiturgica === 'branco'
                    ? 'bg-[#FFFFFF] text-slate-800 border border-[#FFA82A] font-bold shadow-xs'
                    : 'bg-[var(--dash-surface)]/20 text-white'
                }`}>
                  Ativo
                </span>
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
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--dash-surface)]/20">Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Guia Rápido das Cores Canônicas da Igreja (Interativo com Preview) */}
      <Card className="p-5 sm:p-6 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-muted)] flex items-center gap-1.5">
              <Church className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Ciclo Canônico de Cores Litúrgicas</span>
            </h4>
            <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
              Clique em qualquer cor litúrgica para simular e inspecionar como o painel responde visualmente em cada tempo litúrgico.
            </p>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFA82A]/10 text-[#FFA82A] border border-[#FFA82A]/20 self-start sm:self-auto">
            5 Cores Canônicas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {CANONICAL_COLORS.map((item) => {
            const isCurrentlyActive = liturgy.corLiturgica === item.color;
            const isWhiteActive = isCurrentlyActive && item.color === 'branco';

            return (
              <button
                key={item.color}
                type="button"
                onClick={() => previewColor(item.color, item.tempo, item.celebracao)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between space-y-1.5 ${
                  isCurrentlyActive
                    ? isWhiteActive
                      ? 'bg-[#FFFFFF] border-2 border-[#FFA82A] ring-2 ring-[#FFA82A] shadow-md shadow-[#FFA82A]/20'
                      : `${item.ringColor} ${item.activeBg}`
                    : 'border-[var(--dash-border)]/70 bg-[var(--dash-surface-secondary)]/50 hover:border-[var(--dash-border-hover)] hover:bg-[var(--dash-surface-secondary)]'
                }`}
                title={`Clique para simular o tempo litúrgico ${item.name}`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className={`flex items-center gap-1.5 font-bold ${isWhiteActive ? 'text-slate-800 font-extrabold' : item.textColor}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor} ${isCurrentlyActive ? 'animate-ping' : ''}`} />
                    <span>{item.name}</span>
                  </div>

                  {isCurrentlyActive && (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                      isWhiteActive 
                        ? 'bg-[#FFFFFF] border border-[#FFA82A] text-slate-800 font-extrabold shadow-xs' 
                        : 'bg-black/60 text-white'
                    }`}>
                      Simulando
                    </span>
                  )}
                </div>

                <p className={`text-[11px] font-medium ${isWhiteActive ? 'text-slate-800 font-bold' : 'text-[var(--dash-text-secondary)]'}`}>
                  {item.tempo}
                </p>

                <p className={`text-[10px] line-clamp-2 leading-relaxed pt-1 border-t ${isWhiteActive ? 'border-[#FFA82A]/30 text-slate-700 font-medium' : 'border-[var(--dash-border)]/40 text-[var(--dash-text-muted)]'}`}>
                  {item.celebracao}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Simulador Especial da Coroa do Advento & Velas Litúrgicas */}
      <AdventPreviewControl />
    </div>
  );
}
