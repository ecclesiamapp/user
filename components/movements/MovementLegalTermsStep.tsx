'use client';

import React from 'react';
import {
  ShieldCheck,
  Church,
  Users2,
  Lock,
  UserCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ParishMovement } from '@/types/movements';

interface MovementLegalTermsStepProps {
  movement: ParishMovement;
  onAccept: () => void;
  onCancel: () => void;
}

export function MovementLegalTermsStep({
  movement,
  onAccept,
  onCancel,
}: MovementLegalTermsStepProps) {
  const isEAC = movement.slug === 'eac';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Intro Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#22262B] via-[#1B1E22] to-[#22262B] border border-[#C8A463]/30 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#C8A463]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FFCC36]">
            <Sparkles className="w-3.5 h-3.5" />
            Compromisso de Privacidade da Catedral de Colatina
          </div>
          <h4 className="text-sm font-serif font-bold text-[#FAF6F0]">
            Tratamento de Dados Ético, Canônico e Conforme a Lei
          </h4>
          <p className="text-xs text-[#FAF6F0]/75 leading-relaxed">
            Antes de preencher sua ficha para o <strong>{movement.name} ({movement.acronym})</strong>,
            conheça as garantias legais e pastorais que protegem você e sua família.
          </p>
        </div>
      </div>

      {/* 4 Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1: Base Legal Religiosa */}
        <div className="p-4 rounded-xl bg-[#1B1E22] border border-[#C8A463]/20 space-y-2 hover:border-[#C8A463]/40 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#8B1E22]/30 text-[#FFCC36] flex items-center justify-center shrink-0">
              <Church className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
                Art. 11, II, «f» da LGPD
              </span>
              <h5 className="text-xs font-bold text-[#FAF6F0]">Base Legal Canônica</h5>
            </div>
          </div>
          <p className="text-[11px] text-[#FAF6F0]/75 leading-relaxed">
            A Lei Geral de Proteção de Dados confere à Igreja Católica o direito de acolher e
            cadastrar seus fiéis para fins religiosos, pastorais e comunitários legítimos.
          </p>
        </div>

        {/* Card 2: Menores & ECA Digital */}
        <div className="p-4 rounded-xl bg-[#1B1E22] border border-[#C8A463]/20 space-y-2 hover:border-[#C8A463]/40 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#C8A463]/20 text-[#FFCC36] flex items-center justify-center shrink-0">
              <Users2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
                {isEAC ? 'Art. 14 LGPD + Lei 15.211/2025' : 'Art. 14 da LGPD'}
              </span>
              <h5 className="text-xs font-bold text-[#FAF6F0]">
                {isEAC ? 'ECA Digital & Pais (Obrigatório)' : 'Proteção a Menores'}
              </h5>
            </div>
          </div>
          <p className="text-[11px] text-[#FAF6F0]/75 leading-relaxed">
            {isEAC
              ? 'No EAC, os contatos com adolescentes são realizados sob expressa anuência e acompanhamento dos pais ou responsáveis legais.'
              : 'Tratamento de dados sempre no melhor interesse da família cristã, com total transparência e zelo formativo.'}
          </p>
        </div>

        {/* Card 3: Sigilo Absoluto */}
        <div className="p-4 rounded-xl bg-[#1B1E22] border border-[#C8A463]/20 space-y-2 hover:border-[#C8A463]/40 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#C8A463]/20 text-[#FFCC36] flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
                Art. 6º, III e Art. 46
              </span>
              <h5 className="text-xs font-bold text-[#FAF6F0]">Sigilo & Não Compartilhamento</h5>
            </div>
          </div>
          <p className="text-[11px] text-[#FAF6F0]/75 leading-relaxed">
            Seus dados são confidenciais e restritos à coordenação do movimento e à Secretaria.
            Nunca serão vendidos, comercializados ou compartilhados com terceiros.
          </p>
        </div>

        {/* Card 4: Direitos do Titular */}
        <div className="p-4 rounded-xl bg-[#1B1E22] border border-[#C8A463]/20 space-y-2 hover:border-[#C8A463]/40 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#8B1E22]/30 text-[#FFCC36] flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
                Art. 18 da LGPD
              </span>
              <h5 className="text-xs font-bold text-[#FAF6F0]">Direito de Acesso e Exclusão</h5>
            </div>
          </div>
          <p className="text-[11px] text-[#FAF6F0]/75 leading-relaxed">
            Você tem o direito de solicitar a atualização, retificação ou exclusão definitiva dos
            seus dados dos registros a qualquer tempo na Secretaria da Catedral.
          </p>
        </div>
      </div>

      {/* Trust Notice */}
      <div className="p-3.5 rounded-xl bg-[#16181B] border border-[#C8A463]/25 text-[11px] text-[#FAF6F0]/70 flex items-center justify-between">
        <span>
          Controlador dos Dados: <strong>Mitra Diocesana de Colatina / Paróquia Sagrado Coração de Jesus</strong>
        </span>
        <span className="text-[#FFCC36] font-bold text-[10px] uppercase">Compliance Ativo</span>
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#C8A463]/20">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#C8A463]/30 hover:bg-[var(--dash-surface)]/5 text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px]"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={onAccept}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A463] to-[#FFCC36] hover:brightness-110 text-[#2D1A16] text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] shadow-lg cursor-pointer"
        >
          <span>Compreendi e Aceito os Termos</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
