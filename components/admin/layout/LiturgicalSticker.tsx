'use client';

import React, { useState } from 'react';
import { useAdminAppearance } from '@/components/admin/context/AdminAppearanceContext';
import { Sparkles, Calendar, Info } from 'lucide-react';
import { LiturgicalColor } from '@/lib/liturgy';

export function LiturgicalSticker() {
  const { liturgy, loadingLiturgy } = useAdminAppearance();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const getColorClasses = (color: LiturgicalColor) => {
    switch (color) {
      case 'verde':
        return {
          pill: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500/60 shadow-emerald-950/20',
          dot: 'bg-emerald-300',
          label: 'Verde Litúrgico (Esperança & Perseverança)',
        };
      case 'roxo':
        return {
          pill: 'bg-purple-700 hover:bg-purple-800 text-white border-purple-500/60 shadow-purple-950/20',
          dot: 'bg-purple-300',
          label: 'Roxo Litúrgico (Penitência & Conversão)',
        };
      case 'vermelho':
        return {
          pill: 'bg-rose-700 hover:bg-rose-800 text-white border-rose-500/60 shadow-rose-950/20',
          dot: 'bg-rose-300',
          label: 'Vermelho Litúrgico (Espírito Santo & Martírio)',
        };
      case 'rosa':
        return {
          pill: 'bg-pink-600 hover:bg-pink-700 text-white border-pink-400/60 shadow-pink-950/20',
          dot: 'bg-pink-200',
          label: 'Rosa Litúrgico (Alegria: Gaudete/Laetare)',
        };
      case 'branco':
      default:
        return {
          pill: 'bg-[#FFFFFF] hover:bg-amber-50/50 text-slate-800 font-extrabold border-2 border-[#FFA82A] shadow-md shadow-[#FFA82A]/20',
          dot: 'bg-[#FFA82A]',
          label: 'Branco / Dourado (Solenidade do Senhor & Glória)',
        };
    }
  };

  const style = getColorClasses(liturgy.corLiturgica);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 border shadow-sm transition-all cursor-pointer select-none ${style.pill}`}
      >
        <span className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${style.dot}`} />
        <span>{liturgy.tempoLiturgico}</span>
      </div>

      {/* Tooltip com Contexto Canônico */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-2xl bg-[#16181B] text-[#EAE3D9] border border-[#C8A463]/40 shadow-xl z-50 text-xs space-y-1.5 animate-fade-in pointer-events-none">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FFCC36] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calendário Litúrgico</span>
          </div>
          <p className="font-semibold text-white leading-tight">
            {liturgy.celebracaoTitulo}
          </p>
          <div className="pt-1 border-t border-white/10 text-[11px] text-[#A39E98] space-y-0.5">
            <p><strong>Cor Canônica:</strong> {style.label}</p>
            <p><strong>Data:</strong> {liturgy.dataExtensa}</p>
          </div>
        </div>
      )}
    </div>
  );
}
