'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QrCode, Copy, Check, Heart, ShieldCheck } from 'lucide-react';
import { Community } from '@/types';
import { LiturgicalColorTheme, getLiturgicalColorTheme } from '@/lib/liturgy';

interface CommunityDizimoCardProps {
  community: Community;
  liturgicalTheme?: LiturgicalColorTheme;
}

export function CommunityDizimoCard({ community, liturgicalTheme }: CommunityDizimoCardProps) {
  const activeTheme = liturgicalTheme || getLiturgicalColorTheme('verde');
  const [copied, setCopied] = useState(false);
  const pixKey = community.pix_key || '31.800.170/0001-92';

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`relative h-full flex-1 rounded-3xl bg-gradient-to-b from-[#251B18]/95 via-[#1D1614]/95 to-[#161210]/95 border ${activeTheme.cardBorderClass} p-6 sm:p-7 shadow-xl shadow-black/40 overflow-hidden flex flex-col justify-between transition-colors duration-300`}>
      {/* Badge Numérico no Topo Direito (Acento Litúrgico Cirúrgico) */}
      <div className={`absolute top-0 right-0 w-10 h-10 rounded-bl-2xl rounded-tr-3xl ${activeTheme.numberBadgeClass} flex items-center justify-center font-serif font-bold text-sm shadow-sm transition-all duration-300`}>
        4
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="min-h-[64px] flex flex-col justify-start">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF3E3] tracking-tight">
            Dízimo na Comunidade
          </h2>
          <p className="text-xs text-[#EAE3D9]/70 mt-1 line-clamp-1">
            Sua partilha sustenta o templo, o acolhimento pastoral e as obras sociais
          </p>
        </div>

        {/* Linha com QR Code + Dados Bancários (Idêntico ao Mockup) */}
        <div className="my-auto py-1 space-y-2">
          <div className="text-[10px] font-semibold text-[#FFA82A] uppercase tracking-wider">
            PIX Oficial para Dízimo e Ofertas:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
            {/* QR Code Imponente à Esquerda */}
            <div className="sm:col-span-5 flex justify-center">
              <div className="p-2.5 rounded-2xl bg-[var(--dash-surface)] shadow-md relative group flex flex-col items-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                    `00020126580014BR.GOV.BCB.PIX0114${pixKey.replace(/\D/g, '')}5204000053039865802BR5925PAROQUIA SAGRADO CORACAO6008COLATINA62180514DIZIMO${(community.slug || 'CEB').toUpperCase().slice(0, 8)}6304`
                  )}`}
                  alt="QR Code PIX Dízimo"
                  className="w-24 h-24 object-contain"
                />
                <span className="text-[9px] font-bold text-gray-700 uppercase mt-1">
                  PIX Paroquial
                </span>
              </div>
            </div>

            {/* Dados Bancários & Detalhes à Direita */}
            <div className="sm:col-span-7 space-y-1.5 text-xs text-[#EAE3D9]/80 font-mono">
              <div className="p-2.5 rounded-xl bg-[#2D211D]/80 border border-[#C8A463]/30 space-y-0.5 text-[11px]">
                <p><span className="text-[#FFA82A] font-bold">Banco:</span> Sicoob (756)</p>
                <p><span className="text-[#FFA82A] font-bold">Agência:</span> 3220</p>
                <p><span className="text-[#FFA82A] font-bold">Conta:</span> 12.345-6</p>
                <p><span className="text-[#FFA82A] font-bold">CNPJ:</span> {pixKey}</p>
              </div>

              <p className="text-[10px] text-[#EAE3D9]/60 font-sans italic line-clamp-1">
                Identifique na descrição: <em>"Dízimo {community.name}"</em>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Vinho / Carmesim "Saber Mais / Contribuir" (Idêntico ao Mockup) */}
      <div className="pt-5 mt-5 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3 min-h-[46px]">
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-[#8B1E22] hover:bg-[#A32328] border border-[#C8A463]/40 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md min-h-[38px] cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chave PIX Copiada!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#FFA82A]" />
              <span>Copiar Chave PIX</span>
            </>
          )}
        </button>

        <Link
          href="/dizimo"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#2D211D] hover:bg-[#3D2C27] border border-[#C8A463]/30 text-xs text-[#EAE3D9] font-medium transition-colors min-h-[38px]"
        >
          <span>Saber Mais</span>
        </Link>
      </div>
    </div>
  );
}
