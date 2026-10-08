'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  QrCode, 
  Copy, 
  Check, 
  Church, 
  Cross, 
  HelpCircle, 
  Sparkles,
  Building2,
  Info
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { Parish } from '@/types';

interface DizimoDoacoesSectionProps {
  parish: Parish;
}

export function DizimoDoacoesSection({ parish }: DizimoDoacoesSectionProps) {
  const [copied, setCopied] = useState(false);

  const pixKey = parish.pix_key || 'secretaria@catedraldecolatina.org.br';

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="dizimo" className="space-y-6">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight">
              Dízimo Pastoral & Ofertas de Solidariedade
            </h3>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              Conscientização evangélica da partilha e canal direto para ofertas e obras da Catedral
            </p>
          </div>
        </div>

        <Badge variant="matriz" icon={<Cross className="w-3.5 h-3.5" />}>
          Comunhão e Missão
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Bloco 1: Conscientização Pastoral do Dízimo (Theòs) - 7 colunas */}
        <Card className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-7 space-y-6 bg-[var(--dash-surface)] border border-[var(--dash-border)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                Orientações da Igreja
              </span>
              <span className="text-xs text-[var(--dash-text-secondary)]">•</span>
              <span className="text-xs text-[var(--dash-text-secondary)] font-medium">
                Diretrizes Oficiais da CNBB
              </span>
            </div>

            <h4 className="font-display text-xl font-bold text-[var(--dash-text-primary)] leading-snug">
              O Que é o Dízimo? Um Ato de Amor, Gratidão e Fidelidade a Deus
            </h4>

            <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed">
              O dízimo não é uma taxa e nem pagamento por sacramentos: é um compromisso livre de fé e corresponsabilidade com a Igreja. Sustenta a vida comunitária através de <strong>quatro dimensões fundamentais</strong>:
            </p>

            {/* As 4 Dimensões Bíblicas da CNBB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-1">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  1. Dimensão Religiosa
                </span>
                <p className="text-[11px] text-[var(--dash-text-secondary)] leading-snug">
                  Gratidão a Deus criador por todas as graças recebidas na família e no trabalho.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-1">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  2. Dimensão Eclesial
                </span>
                <p className="text-[11px] text-[var(--dash-text-secondary)] leading-snug">
                  Manutenção do templo sagrado, liturgia, clero e serviços da secretaria paroquial.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-1">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  3. Dimensão Missionária
                </span>
                <p className="text-[11px] text-[var(--dash-text-secondary)] leading-snug">
                  Sustento das 12 comunidades, catequese, formação e presença nas periferias.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-1">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  4. Dimensão Caritativa
                </span>
                <p className="text-[11px] text-[var(--dash-text-secondary)] leading-snug">
                  Socorro concreto a enfermos, famílias vulneráveis e obras da Pastoral da Caridade.
                </p>
              </div>
            </div>

            {/* Caixa Informativa sobre o Sistema Theòs na Secretaria */}
            <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)]/80 border border-amber-500/20 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-[var(--dash-text-secondary)] space-y-1">
                <p className="font-semibold text-[var(--dash-text-primary)]">
                  Cadastro Oficial de Dizimistas no Sistema Paroquial (Theòs):
                </p>
                <p className="leading-relaxed">
                  Para controle contábil e eclesial transparente, o cadastro oficial do dizimista e a entrega de envelopes mensais são organizados pela <strong>Secretaria da Catedral</strong> no plantão das missas dominicais.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${parish.whatsapp_number.replace(/\D/g, '')}?text=Olá!%20Gostaria%20de%20informações%20sobre%20como%20me%20cadastrar%20como%20Dizimista%20da%20Catedral.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" icon={<HelpCircle className="w-3.5 h-3.5" />}>
                Dúvidas sobre o Dízimo no WhatsApp
              </Button>
            </a>
          </div>
        </Card>

        {/* Bloco 2: Ofertas e Doações Espontâneas com QR Code PIX - 5 colunas */}
        <Card className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 space-y-6 bg-gradient-to-b from-[var(--dash-surface)] to-[var(--dash-surface-secondary)] border border-[var(--dash-border)] shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Doações & Ofertas
              </span>
              <Badge variant="active" icon={<QrCode className="w-3 h-3" />}>
                PIX Instantâneo
              </Badge>
            </div>

            <div>
              <h4 className="font-display text-lg font-bold text-[var(--dash-text-primary)] leading-snug">
                Ofertas da Santa Missa & Obras da Catedral
              </h4>
              <p className="text-xs text-[var(--dash-text-secondary)] mt-1">
                Aponte a câmera do seu celular no QR Code abaixo para realizar sua oferta espontânea com rapidez e segurança.
              </p>
            </div>

            {/* Container do QR Code Visual Escaneável */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-slate-900 shadow-inner space-y-3">
              {/* QR Code SVG Vetorial Limpo e Escaneável */}
              <div className="relative p-2 bg-[var(--dash-surface)] rounded-xl shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixKey)}&margin=4`}
                  alt="QR Code PIX Paróquia Catedral de Colatina"
                  className="w-44 h-44 object-contain rounded-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 rounded-full bg-[var(--dash-surface)] shadow-md border border-slate-200 flex items-center justify-center">
                    <Church className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-slate-600 text-center">
                Escaneie pelo aplicativo de qualquer banco
              </span>
            </div>

            {/* Chave PIX e Botão Copia-e-Cola */}
            <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--dash-text-secondary)]">
                <span>Chave PIX Oficial ({parish.pix_key_type?.toUpperCase() || 'E-MAIL'}):</span>
                <span className="text-[10px] uppercase font-bold text-emerald-500">Copia e Cola</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-mono font-bold select-all text-[var(--primary)] truncate flex-1">
                  {pixKey}
                </span>

                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                    copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado!</span>
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

            {/* Dados Bancários Oficiais da Mitra */}
            <div className="text-[11px] text-[var(--dash-text-secondary)] space-y-1 pt-1 border-t border-[var(--dash-border)]">
              <p className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                <span><strong>Favorecido:</strong> {parish.name}</span>
              </p>
              <p><strong>Diocese:</strong> {parish.diocese} • Colatina/ES</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
