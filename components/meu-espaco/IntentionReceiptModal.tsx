'use client';

import React from 'react';
import {
  X,
  Printer,
  MessageSquare,
  Sparkles,
  Shield,
  Calendar,
  Clock,
  Church,
  CheckCircle2,
} from 'lucide-react';
import { MassIntention } from '@/types';

interface IntentionReceiptModalProps {
  intention: MassIntention | null;
  onClose: () => void;
}

export function IntentionReceiptModal({ intention, onClose }: IntentionReceiptModalProps) {
  if (!intention) return null;

  const getCategoryLabel = (type: MassIntention['intention_type']) => {
    switch (type) {
      case 'falecimento':
      case 'setimo_dia':
      case 'trigesimo_dia':
        return 'Pela(s) Alma(s) de:';
      case 'acao_gracas':
        return 'Em Ação de Graças:';
      case 'saude':
        return 'Pela Saúde dos Enfermos:';
      default:
        return 'Intenção Particular:';
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*Comprovante de Intenção de Santa Missa • Catedral de Colatina*\n\n` +
        `⛪ *Catedral Sagrado Coração de Jesus*\n` +
        `📅 *Data:* ${intention.celebration_date.split('-').reverse().join('/')} às ${intention.celebration_time}\n` +
        `🙏 *Intenção (${getCategoryLabel(intention.intention_type)}):* ${intention.intention_for}\n` +
        (intention.is_anonymous ? `🔒 *Sigilo no Púlpito:* Sim (identificação preservada)\n` : '') +
        (intention.protocol_code ? `📋 *Protocolo:* ${intention.protocol_code}\n\n` : '\n') +
        `_Apresentada nas intenções oficiais para a proclamação no Púlpito da Santa Missa. Que Deus abençoe!_`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#16181B] border border-[#C8A463]/30 rounded-3xl shadow-2xl text-[#FAF6F0] z-10 overflow-hidden my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#C8A463]/20 bg-gradient-to-r from-[#22262B] to-[#16181B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C8A463]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shrink-0">
              <Church className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#FFCC36]">
                Comprovante Litúrgico de Intenção
              </h3>
              <p className="text-[11px] text-[#FAF6F0]/60">
                Folha Litúrgica para o Púlpito (A4) • Catedral de Colatina
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#FAF6F0]/60 hover:text-[#FAF6F0] hover:bg-[var(--dash-surface)]/5 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Status Banner */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Intenção registrada e incluída na lista oficial para proclamação no Púlpito.
            </span>
          </div>

          {/* Receipt Box */}
          <div className="p-5 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/25 space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#C8A463]/15 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#FFCC36] block">
                  Protocolo Canônico
                </span>
                <span className="font-mono text-sm font-bold text-[#FAF6F0]">
                  {intention.protocol_code || 'INT-PAROQUIAL'}
                </span>
              </div>
              {intention.is_anonymous && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-500/30">
                  <Shield className="w-3 h-3" />
                  Sigilo no Púlpito
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#FFCC36] block">
                {getCategoryLabel(intention.intention_type)}
              </span>
              <p className="text-base font-serif font-bold text-[#FAF6F0] leading-snug">
                {intention.intention_for}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#C8A463]/15 text-[11px] text-[#FAF6F0]/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#C8A463]" />
                <span>{intention.celebration_date.split('-').reverse().join('/')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C8A463]" />
                <span>Santa Missa das {intention.celebration_time}</span>
              </div>
            </div>

            <div className="text-[10px] text-[#FAF6F0]/50 pt-2 border-t border-[#C8A463]/10">
              Local: Catedral Sagrado Coração de Jesus (Sede) • Praça Frei José, 26, Centro
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors min-h-[44px] cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Avisar Família (WhatsApp)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#22262B] hover:bg-[#2A2E35] border border-[#C8A463]/30 text-[#FAF6F0] font-bold text-xs uppercase tracking-wider transition-colors min-h-[44px] cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C8A463]" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
