'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Church, MapPin, Heart, Copy, Check, QrCode, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Community } from '@/types';

interface CommunityFooterProps {
  community: Community;
  parishName?: string;
  dioceseName?: string;
}

export function CommunityFooter({
  community,
  parishName = 'Catedral do Sagrado Coração de Jesus',
  dioceseName = 'Diocese de Colatina',
}: CommunityFooterProps) {
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const pixKey = community.pix_key || '31.800.170/0001-92';

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    `00020126580014BR.GOV.BCB.PIX0114${pixKey.replace(/\D/g, '')}5204000053039865802BR5925PAROQUIA SAGRADO CORACAO6008COLATINA62180514OFERTA${(community.slug || 'CEB').toUpperCase().slice(0, 8)}6304`
  )}`;

  return (
    <footer className="w-full bg-[#161210] text-[#EAE3D9] border-t border-[#C8A463]/30 mt-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Bloco Sutil de Doações & Ofertas (Discreto e Pastoral) */}
        <div id="doacoes" className="scroll-mt-24 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#241B18]/90 via-[#1C1513]/95 to-[#241B18]/90 border border-[#C8A463]/25 shadow-lg shadow-black/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Mensagem Pastoral Fraterna */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-[#FFCC36]">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-[#FFF3E3] tracking-tight">
                  Doações & Ofertas Comunitárias
                </h4>
              </div>
              <p className="text-xs text-[#EAE3D9]/75 leading-relaxed">
                Sua partilha voluntária sustenta a conservação da comunidade de <strong>{community.name}</strong>, as celebrações litúrgicas e o apoio aos mais necessitados do bairro.
              </p>
            </div>

            {/* Caixa de PIX Rápida e Discreta */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFA82A]">PIX:</span>
                <span className="text-xs font-mono text-[#FFF3E3]">{pixKey}</span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8B1E22] hover:bg-[#A32328] text-white font-bold text-xs transition-all shadow-sm cursor-pointer min-h-[44px]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Chave Copiada!' : 'Copiar Chave PIX'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrCode(!showQrCode)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[var(--dash-surface)]/5 hover:bg-[var(--dash-surface)]/10 border border-white/10 text-xs font-medium text-[#EAE3D9] transition-all cursor-pointer min-h-[44px]"
              >
                <QrCode className="w-4 h-4 text-[#FFA82A]" />
                <span className="hidden sm:inline">{showQrCode ? 'Ocultar QR Code' : 'QR Code'}</span>
                {showQrCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* QR Code Desdobrável (Sob Demanda) */}
          {showQrCode && (
            <div className="mt-5 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center gap-5 animate-in fade-in duration-200">
              <div className="p-2.5 rounded-2xl bg-[var(--dash-surface)] shadow-md">
                <img
                  src={qrCodeUrl}
                  alt="QR Code PIX Ofertas"
                  className="w-28 h-28 object-contain"
                />
              </div>
              <div className="text-xs text-[#EAE3D9]/70 space-y-1 text-center sm:text-left">
                <p className="font-semibold text-white">Escaneie pelo aplicativo do seu banco</p>
                <p>Destinatário oficial: Paróquia Sagrado Coração de Jesus (Diocese de Colatina)</p>
                <p className="text-[11px] text-amber-400">Identificação sugerida: Oferta {community.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* 4 Colunas Tradicionais do Rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coluna 1: Identidade da Comunidade */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#5E1417] border border-[#FFA82A]/40 text-[#FFA82A] flex items-center justify-center shrink-0">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-amber-500 tracking-wider">
                  Comunidade Eclesial
                </p>
                <h3 className="text-sm font-bold font-serif text-white">
                  {community.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#EAE3D9]/70 leading-relaxed">
              Núcleo vivo de oração, fraternidade e evangelização da Igreja Católica no {community.neighborhood || community.city}.
            </p>

            {community.foundation_year && (
              <p className="text-[11px] text-amber-500/80 font-medium">
                🏛️ Evangelizando as famílias desde {community.foundation_year}.
              </p>
            )}
          </div>

          {/* Coluna 2: Endereço & Acesso */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFA82A]">
              Localização & Templo
            </h4>
            <div className="space-y-2 text-xs text-[#EAE3D9]/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{community.address || 'Consultar secretaria paroquial'}</span>
              </p>
              <p className="pl-6 text-[11px] text-[#EAE3D9]/60">
                {community.neighborhood || 'Centro'} • {community.city} - {community.state}
              </p>
            </div>
          </div>

          {/* Coluna 3: Vida Pastoral */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFA82A]">
              Navegação Rápida
            </h4>
            <ul className="space-y-2 text-xs text-[#EAE3D9]/80">
              <li>
                <a href="#horarios" className="hover:text-amber-400 transition-colors">
                  • Santa Missa e Celebrações da Palavra
                </a>
              </li>
              <li>
                <a href="#avisos" className="hover:text-amber-400 transition-colors">
                  • Mural de Avisos da Semana
                </a>
              </li>
              <li>
                <a href="#calendario" className="hover:text-amber-400 transition-colors">
                  • Atividades & Calendário Pastoral
                </a>
              </li>
              <li>
                <a href="#cpc" className="hover:text-amber-400 transition-colors">
                  • Conselho Pastoral Comunitário (CPC)
                </a>
              </li>
              <li>
                <a href="#doacoes" className="hover:text-amber-400 transition-colors">
                  • Apoio, Doações e Ofertas
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Comunhão Paroquial */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFA82A]">
              Comunhão Eclesial
            </h4>
            <p className="text-xs text-[#EAE3D9]/70 leading-relaxed">
              Esta comunidade integra a <strong>{parishName}</strong>, sob a jurisdição pastoral da <strong>{dioceseName}</strong>.
            </p>
            <div className="pt-2">
              <Link
                href="/comunidades"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
              >
                <span>Conhecer outras comunidades</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Faixa Inferior de Direitos & Selo Diocesano */}
        <div className="pt-8 border-t border-[#C8A463]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EAE3D9]/60">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {community.name} • {parishName}. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/" className="hover:text-[#FFA82A] transition-colors">
              Portal da Catedral
            </Link>
            <span>•</span>
            <Link href="/secretaria" className="hover:text-[#FFA82A] transition-colors">
              Secretaria Paroquial
            </Link>
            <span>•</span>
            <Link href="/privacidade" className="hover:text-[#FFA82A] transition-colors underline">
              Privacidade & LGPD
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
