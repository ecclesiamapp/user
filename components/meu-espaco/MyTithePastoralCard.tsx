'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartHandshake, Copy, Check, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export function MyTithePastoralCard() {
  const [copied, setCopied] = useState(false);
  const pixKey = '31.800.170/0001-92'; // CNPJ Mitra Diocesana de Colatina

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#1B1E22] border border-[#C8A463]/25 shadow-xl space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#8B1E22]/30 border border-[#8B1E22]/50 flex items-center justify-center text-[#FFCC36] shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
              Partilha & Gratidão
            </span>
            <h3 className="text-base font-serif font-bold text-[#FAF6F0]">
              Sou do Sagrado • Dízimo & Ofertas
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#FAF6F0]/80 leading-relaxed">
          O dízimo é um ato de amor e corresponsabilidade com a evangelização, as obras sociais
          e a manutenção da Catedral e das 14 Comunidades Eclesiais de Base.
        </p>

        {/* PIX Box */}
        <div className="p-3.5 rounded-2xl bg-[#16181B] border border-[#C8A463]/20 space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#FFCC36] block">
            Chave PIX Oficial (CNPJ - Mitra Diocesana de Colatina):
          </span>
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#22262B] border border-[#C8A463]/15 font-mono text-xs text-[#FAF6F0]">
            <span className="truncate">{pixKey}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFCC36] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links & Canonical Delimitation Note */}
      <div className="pt-2 border-t border-[#C8A463]/15 flex items-center justify-between gap-2 text-xs">
        <Link
          href="/dizimo"
          className="inline-flex items-center gap-1 text-[#FFCC36] hover:underline font-bold"
        >
          <span>Ver Obras e Transparência</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <span className="text-[10px] text-[#FAF6F0]/40">
          Controle contábil canônico via ERP Theòs
        </span>
      </div>
    </div>
  );
}

