'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  ArrowLeft, 
  Sparkles, 
  Shield, 
  Cross, 
  Palette, 
  Type, 
  QrCode, 
  Info,
  CheckCircle2,
  Loader2 
} from 'lucide-react';
import { 
  BrandIdentity, 
  DEFAULT_BRAND_IDENTITY, 
  CATEDRAL_PARISH_ID, 
  getParishBrandIdentity 
} from '@/lib/brand';

function hexToRgb(hex: string): string {
  try {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return 'rgb(0, 0, 0)';
  }
}

export default function ImprimirGuiaMarcaPage() {
  const [identity, setIdentity] = useState<BrandIdentity>(DEFAULT_BRAND_IDENTITY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await getParishBrandIdentity(CATEDRAL_PARISH_ID);
        setIdentity(data);
      } catch (err) {
        console.error('[ImprimirGuiaMarcaPage] Erro ao carregar identidade:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const manualOrPortalUrl = identity.manual_pdf_url || 'https://catedraldecolatina.org.br';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    manualOrPortalUrl
  )}&margin=4&format=svg`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFA82A]" />
      </div>
    );
  }

  const { colors, fonts, logos } = identity;

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-900 font-sans print:bg-[var(--dash-surface)] print:text-[var(--dash-text-primary)]">
      {/* Barra de Controles Superior (Oculta na Impressão) */}
      <header className="p-4 bg-neutral-950 border-b border-neutral-800 print:hidden sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/marca"
              className="px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#FFA82A]" />
              <span>Voltar ao Hub de Marca</span>
            </Link>
            <div>
              <h1 className="text-sm font-bold text-white">
                Ficha Resumo da Marca • PASCOM (Folha A4)
              </h1>
              <p className="text-xs text-neutral-400">
                Guia prático para voluntários, equipes de transmissão e designers da paróquia.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4 text-[#FFA82A]" />
            <span>Imprimir / Gerar PDF (A4)</span>
          </button>
        </div>
      </header>

      {/* Folha A4 Padronizada */}
      <main className="max-w-[210mm] mx-auto my-6 p-8 bg-[var(--dash-surface)] shadow-2xl rounded-2xl print:m-0 print:p-6 print:shadow-none print:rounded-2xl border border-neutral-200 print:border-none min-h-[297mm] flex flex-col justify-between">
        <div className="space-y-6">
          {/* Cabeçalho Solene */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-neutral-900">
            <div className="flex items-center gap-3">
              {logos.main_url ? (
                <img
                  src={logos.main_url}
                  alt="Brasão"
                  className="w-14 h-14 object-contain shrink-0"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Cross className="w-7 h-7" />
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Diocese de Colatina • Paróquia Sagrado Coração de Jesus
                </span>
                <h1 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                  Catedral Sagrado Coração de Jesus
                </h1>
                <p className="text-xs text-neutral-600 font-medium italic">
                  {identity.tagline || 'Guia Prático de Aplicação Visual • Pastoral da Comunicação (PASCOM)'}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-1 bg-neutral-100 rounded-md border border-neutral-300 font-bold block">
                Ficha A4 Oficial
              </span>
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Atualizado: {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Bloco 1: Paleta Cromática (6 Cores) */}
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b pb-1">
              <Palette className="w-3.5 h-3.5 text-neutral-700" />
              <span>1. Paleta Cromática Eclesial Oficial</span>
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {/* Primária */}
              <div className="p-2 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col items-center">
                <span
                  className="w-10 h-10 rounded-lg shadow-sm border border-black/10 mb-1.5"
                  style={{ backgroundColor: colors.primary }}
                />
                <span className="text-[10px] font-bold text-neutral-900">Primária</span>
                <span className="text-[10px] font-mono font-bold text-neutral-700">{colors.primary}</span>
                <span className="text-[8px] text-neutral-500 font-mono mt-0.5">{hexToRgb(colors.primary)}</span>
              </div>

              {/* Secundária */}
              <div className="p-2 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col items-center">
                <span
                  className="w-10 h-10 rounded-lg shadow-sm border border-black/10 mb-1.5"
                  style={{ backgroundColor: colors.secondary }}
                />
                <span className="text-[10px] font-bold text-neutral-900">Ouro Sacro</span>
                <span className="text-[10px] font-mono font-bold text-neutral-700">{colors.secondary}</span>
                <span className="text-[8px] text-neutral-500 font-mono mt-0.5">{hexToRgb(colors.secondary)}</span>
              </div>

              {/* Fundo */}
              <div className="p-2 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col items-center">
                <span
                  className="w-10 h-10 rounded-lg shadow-sm border border-black/10 mb-1.5"
                  style={{ backgroundColor: colors.background }}
                />
                <span className="text-[10px] font-bold text-neutral-900">Pergaminho</span>
                <span className="text-[10px] font-mono font-bold text-neutral-700">{colors.background}</span>
                <span className="text-[8px] text-neutral-500 font-mono mt-0.5">{hexToRgb(colors.background)}</span>
              </div>

              {/* Superfície */}
              <div className="p-2 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col items-center">
                <span
                  className="w-10 h-10 rounded-lg shadow-sm border border-black/10 mb-1.5"
                  style={{ backgroundColor: colors.surface }}
                />
                <span className="text-[10px] font-bold text-neutral-900">Superfície</span>
                <span className="text-[10px] font-mono font-bold text-neutral-700">{colors.surface}</span>
                <span className="text-[8px] text-neutral-500 font-mono mt-0.5">{hexToRgb(colors.surface)}</span>
              </div>

              {/* Texto */}
              <div className="p-2 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col items-center">
                <span
                  className="w-10 h-10 rounded-lg shadow-sm border border-black/10 mb-1.5"
                  style={{ backgroundColor: colors.text_primary }}
                />
                <span className="text-[10px] font-bold text-neutral-900">Texto Ébano</span>
                <span className="text-[10px] font-mono font-bold text-neutral-700">{colors.text_primary}</span>
                <span className="text-[8px] text-neutral-500 font-mono mt-0.5">{hexToRgb(colors.text_primary)}</span>
              </div>

              {/* PIX */}
              <div className="p-2 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col items-center">
                <span
                  className="w-10 h-10 rounded-lg shadow-sm border border-black/10 mb-1.5"
                  style={{ backgroundColor: colors.action_pix }}
                />
                <span className="text-[10px] font-bold text-neutral-900">PIX Dízimo</span>
                <span className="text-[10px] font-mono font-bold text-neutral-700">{colors.action_pix}</span>
                <span className="text-[8px] text-neutral-500 font-mono mt-0.5">{hexToRgb(colors.action_pix)}</span>
              </div>
            </div>
          </section>

          {/* Bloco 2: Tipografia Homologada */}
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b pb-1">
              <Type className="w-3.5 h-3.5 text-neutral-700" />
              <span>2. Tipografia Eclesial Recomendada</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
                  Títulos & Brasão (Heading)
                </span>
                <p className="text-base font-bold text-neutral-900 font-serif">
                  {fonts.heading}
                </p>
                <p className="text-[11px] text-neutral-600">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890
                </p>
                <p className="text-[10px] text-neutral-500 italic">
                  Utilizada em títulos solenes, avisos do púlpito e capas de livretos.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
                  Corpo de Texto & Horários (Body)
                </span>
                <p className="text-base font-bold text-neutral-900 font-sans">
                  {fonts.body}
                </p>
                <p className="text-[11px] text-neutral-600">
                  abcdefghijklmnopqrstuvwxyz 1234567890
                </p>
                <p className="text-[10px] text-neutral-500 italic">
                  Utilizada em leituras bíblicas, notícias da PASCOM e horários de missas.
                </p>
              </div>
            </div>
          </section>

          {/* Bloco 3: Aplicações do Brasão & Regras de Proteção */}
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 border-b pb-1">
              <Shield className="w-3.5 h-3.5 text-neutral-700" />
              <span>3. Variações do Brasão & Regras de Uso</span>
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {/* Brasão Principal */}
              <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center text-center">
                <div className="h-20 flex items-center justify-center mb-1">
                  {logos.main_url ? (
                    <img src={logos.main_url} alt="Brasão Principal" className="max-h-full object-contain" />
                  ) : (
                    <Shield className="w-10 h-10 text-neutral-400" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-neutral-800">Versão Principal</span>
                <span className="text-[9px] text-neutral-500">Fundos claros / branco</span>
              </div>

              {/* Versão Negativa */}
              <div className="p-3 rounded-xl border border-neutral-900 bg-neutral-900 flex flex-col items-center justify-center text-center text-white">
                <div className="h-20 flex items-center justify-center mb-1">
                  {logos.negative_url ? (
                    <img src={logos.negative_url} alt="Versão Negativa" className="max-h-full object-contain" />
                  ) : (
                    <Shield className="w-10 h-10 text-white/50" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-white">Versão Negativa</span>
                <span className="text-[9px] text-neutral-400">Fundos escuros / transmissões</span>
              </div>

              {/* Regras de Proteção */}
              <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 text-[10px] text-neutral-700 space-y-1">
                <span className="font-bold uppercase tracking-wider text-neutral-900 block">
                  Regras Cruciais:
                </span>
                <p>• Respeitar margem de respiro proporcional à cruz superior.</p>
                <p>• Jamais distorcer proporções horizontais/verticais.</p>
                <p>• Evitar aplicar sobre fotos com ruído visual ou baixo contraste.</p>
                <p>• Não alterar a ordem das cores litúrgicas do brasão.</p>
              </div>
            </div>
          </section>

          {/* Bloco 4: QR Code para Manual Completo em PDF */}
          <section className="p-3.5 rounded-xl border border-neutral-300 bg-neutral-50 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-neutral-700" />
                <span>Manual Completo de Identidade Visual (PDF)</span>
              </span>
              <p className="text-[11px] text-neutral-600 max-w-md">
                Aponte a câmera do celular para baixar o arquivo completo de diretrizes da Catedral com vetores de alta resolução.
              </p>
            </div>

            <div className="shrink-0 p-1.5 bg-[var(--dash-surface)] rounded-lg border border-neutral-300 shadow-xs">
              <img src={qrCodeUrl} alt="QR Code Manual" className="w-16 h-16 object-contain" />
            </div>
          </section>
        </div>

        {/* Rodapé da Folha */}
        <footer className="pt-4 border-t border-neutral-200 flex items-center justify-between text-[9px] text-neutral-500">
          <span>Emitido pelo Hub de Marca Oficial • Ecclesiam App (White-Label)</span>
          <span>Catedral Sagrado Coração de Jesus • Colatina/ES</span>
        </footer>
      </main>
    </div>
  );
}
