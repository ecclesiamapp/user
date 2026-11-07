'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Clock,
  Plus,
  Shield,
  CheckCircle2,
  ExternalLink,
  FileText,
  Share2,
} from 'lucide-react';
import { MassIntention } from '@/types';
import { IntentionReceiptModal } from './IntentionReceiptModal';

interface MyIntentionsSectionProps {
  intentions: MassIntention[];
}

export function MyIntentionsSection({ intentions }: MyIntentionsSectionProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<MassIntention | null>(null);

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

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#1B1E22] border border-[#C8A463]/25 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#C8A463]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
              Liturgia da Santa Missa
            </span>
            <h3 className="text-base font-serif font-bold text-[#FAF6F0]">
              Minhas Intenções de Santa Missa (Púlpito A4)
            </h3>
          </div>
        </div>

        <Link
          href="/secretaria/intencoes"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8A463]/15 hover:bg-[#C8A463]/25 border border-[#C8A463]/30 text-[#FFCC36] text-xs font-bold uppercase tracking-wider transition-all min-h-[38px] shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Apresentar Intenção</span>
        </Link>
      </div>

      {/* Intentions List */}
      {intentions.length === 0 ? (
        <div className="p-6 rounded-2xl bg-[#16181B] border border-[#C8A463]/15 text-center space-y-2">
          <p className="text-xs text-[#FAF6F0]/70">
            Você não possui intenções de Santa Missa cadastradas no momento.
          </p>
          <Link
            href="/secretaria/intencoes"
            className="inline-flex items-center gap-1 text-xs text-[#FFCC36] hover:underline font-bold"
          >
            <span>Apresentar intenção para a próxima Santa Missa</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {intentions.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#16181B] border border-[#C8A463]/15 hover:border-[#C8A463]/35 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-[11px] font-bold text-[#FFCC36]">
                  {getCategoryLabel(item.intention_type)}
                </span>
                <div className="flex items-center gap-2">
                  {item.is_anonymous && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Shield className="w-3 h-3" />
                      Sigilo no Púlpito
                    </span>
                  )}
                  {item.protocol_code && (
                    <span className="text-[10px] font-mono text-[#FAF6F0]/50 bg-[#22262B] px-2 py-0.5 rounded-md">
                      {item.protocol_code}
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-sm font-serif font-bold text-[#FAF6F0]">
                {item.intention_for}
              </h4>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#C8A463]/10 text-xs text-[#FAF6F0]/70">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C8A463]" />
                    <span>{item.celebration_date.split('-').reverse().join('/')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C8A463]" />
                    <span>Santa Missa das {item.celebration_time}</span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Púlpito A4
                  </span>
                </div>

                {/* Comprovante Digital Action */}
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22262B] hover:bg-[#C8A463]/20 border border-[#C8A463]/25 text-[#FFCC36] text-xs font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto min-h-[34px]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Ver Comprovante</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comprovante Modal */}
      <IntentionReceiptModal
        intention={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
