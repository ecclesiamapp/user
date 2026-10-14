'use client';

import React, { useState } from 'react';
import { 
  QrCode, 
  Copy, 
  Check, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Church, 
  MessageCircle,
  Heart,
  Send
} from 'lucide-react';
import { Parish } from '@/types';

interface DizimoPixDynamicProps {
  parish: Parish;
}

export function DizimoPixDynamic({ parish }: DizimoPixDynamicProps) {
  const [copied, setCopied] = useState(false);
  const [userMessage, setUserMessage] = useState('');

  const pixKey = parish.pix_key || 'secretaria@catedraldecolatina.org.br';

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanWhatsappNumber = parish.whatsapp_number ? parish.whatsapp_number.replace(/\D/g, '') : '552737221234';
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Paz e Bem! Segue uma mensagem/oferta para a Catedral:\n\n${userMessage ? `"${userMessage}"` : 'Realizei uma oferta via PIX para as obras e evangelização da Catedral.'}`
  )}`;

  return (
    <section id="pix-oferta" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dash-border)] pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Canal Direto de Fé & Gratidão
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1">
            Doações & Ofertas via PIX
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Mitra Diocesana Oficial</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Coluna Esquerda: Mensagem Pastoral e Explicação da Oferta (7 colunas) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFA82A]/10 text-[#FFA82A] text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5" />
                Oferta Espontânea & Consciente
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--dash-text-primary)]">
                Partilha Direta com a Casa do Senhor
              </h3>
              <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                Sua oferta voluntária pode ser realizada no valor que seu coração determinar, diretamente pelo aplicativo do seu banco via PIX oficial da paróquia. 
              </p>
            </div>

            {/* Campo Opcional: Deixe sua Mensagem */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                Deixe sua mensagem ou intenção (Opcional):
              </label>
              <textarea
                rows={3}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Escreva aqui uma intenção de oração, agradecimento ou mensagem fraterna para a Catedral..."
                className="w-full p-3.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)]/50 focus:outline-hidden focus:border-[#FFA82A] resize-none"
              />
              <div className="flex items-center justify-between text-[11px] text-[var(--dash-text-secondary)] pt-1">
                <span>Deseja compartilhar esta mensagem com a paróquia?</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 font-bold transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Enviar no WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Aviso de Transparência Eclesial */}
            <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-1.5">
              <span className="text-[11px] font-bold text-[#FFA82A] uppercase tracking-wider flex items-center gap-1">
                <Church className="w-3.5 h-3.5" />
                Destinação 100% Eclesial
              </span>
              <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                Todas as ofertas realizadas via PIX são creditadas diretamente na conta bancária oficial da Mitra Diocesana de Colatina, destinadas à manutenção da Catedral e socorro aos pobres.
              </p>
            </div>
          </div>

          {/* Dados Oficiais da Mitra */}
          <div className="text-xs text-[var(--dash-text-secondary)] space-y-1.5 pt-4 border-t border-[var(--dash-border)]">
            <p className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#8B1E22] dark:text-[#FFA82A] shrink-0" />
              <span><strong>Favorecido:</strong> {parish.name}</span>
            </p>
            <p><strong>Diocese:</strong> {parish.diocese} • Colatina/ES</p>
            <p className="text-[11px] opacity-80">
              * Ao transferir pelo seu banco, confira sempre a razão social oficial da Mitra na tela de confirmação.
            </p>
          </div>
        </div>

        {/* Coluna Direita: QR Code e Botão Copia-e-Cola (5 colunas) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[var(--dash-surface)] to-[var(--dash-surface-secondary)] border border-[var(--dash-border)] shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#FFA82A]" />
                QR Code Instantâneo
              </span>
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                PIX Ativo
              </span>
            </div>

            {/* Container do QR Code Visual Escaneável */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-slate-900 shadow-inner space-y-3">
              <div className="relative p-2.5 bg-[var(--dash-surface)] rounded-xl shadow-xs border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixKey)}&margin=4`}
                  alt="QR Code PIX Catedral de Colatina"
                  className="w-48 h-48 object-contain rounded-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-[var(--dash-surface)] shadow-md border border-slate-200 flex items-center justify-center">
                    <Church className="w-5 h-5 text-[#8B1E22]" />
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-600 text-center">
                Aponte a câmera no app de qualquer banco
              </span>
            </div>

            {/* Chave PIX e Botão Copiar */}
            <div className="p-3.5 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--dash-text-secondary)]">
                <span className="font-semibold">Chave Oficial ({parish.pix_key_type?.toUpperCase() || 'E-MAIL'}):</span>
                <span className="text-[10px] uppercase font-bold text-[#FFA82A]">Copia e Cola</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-mono font-bold select-all text-[#8B1E22] dark:text-[#FFA82A] truncate flex-1">
                  {pixKey}
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs min-h-[44px] ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#8B1E22] dark:bg-[#FFA82A] text-white dark:text-[#2D1A16] hover:brightness-105'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
