import React from 'react';
import { Smartphone, Share2, PlusSquare, CheckCircle2, Info } from 'lucide-react';

export function IosInstallGuideCard() {
  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B1E22] via-[#651518] to-[#2D1A16] border-2 border-[#C8A463]/50 flex items-center justify-center text-[#FFCC36] shadow-md shrink-0">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B1E22] bg-[#8B1E22]/10 px-2.5 py-0.5 rounded-full border border-[#8B1E22]/20">
            Instruções para iPhone & iPad
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--dash-text-primary)] font-cinzel tracking-[0.04em] uppercase pt-1">
            Como salvar o atalho no seu iPhone
          </h3>
        </div>
      </div>

      <p className="text-sm text-[var(--dash-text-secondary)] leading-relaxed">
        No iPhone, a instalação é feita de forma simples e rápida através do navegador <strong>Safari</strong>, sem precisar de senhas nem ocupar a memória do aparelho.
      </p>

      {/* Passo a Passo Ilustrado em Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Passo 1 */}
        <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              1
            </span>
            <Share2 className="w-5 h-5 text-blue-400" />
          </div>
          <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
            Toque em Compartilhar
          </h4>
          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Na barra inferior do <strong>Safari</strong>, toque no ícone de quadrado com a seta para cima.
          </p>
        </div>

        {/* Passo 2 */}
        <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              2
            </span>
            <PlusSquare className="w-5 h-5 text-amber-400" />
          </div>
          <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
            Adicionar à Tela de Início
          </h4>
          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Role a lista para baixo e toque na opção <strong>"Adicionar à Tela de Início"</strong>.
          </p>
        </div>

        {/* Passo 3 */}
        <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              3
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
            Confirmar no Topo
          </h4>
          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Toque em <strong>"Adicionar"</strong> no canto superior direito. O ícone da Catedral surgirá na tela!
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>Aviso Pastoral:</strong> Se você abriu este link pelo WhatsApp ou Instagram, toque nos três pontinhos no topo da tela e escolha <em>"Abrir no Safari"</em> para permitir a instalação.
        </span>
      </div>
    </div>
  );
}
