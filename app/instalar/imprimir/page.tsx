'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Printer, ArrowLeft, Palette } from 'lucide-react';
import { Button } from '@/components/ui';
import { PrintPosterA4 } from '@/components/pwa/print/PrintPosterA4';
import { PrintBenchDisplays } from '@/components/pwa/print/PrintBenchDisplays';
import { PrintPocketCards } from '@/components/pwa/print/PrintPocketCards';

type PrintTemplate = 'cartaz-a4' | 'displays-banco' | 'cartoes-bolso';

export default function ImprimirMateriaisPwaPage() {
  const [template, setTemplate] = useState<PrintTemplate>('cartaz-a4');
  const [isMonochrome, setIsMonochrome] = useState(false);

  const targetUrl = 'https://catedraldecolatina.org.br/instalar';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(targetUrl)}&margin=4&format=svg`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0F1012] text-slate-100 flex flex-col print:bg-[var(--dash-surface)] print:text-[var(--dash-text-primary)] w-full overflow-x-hidden">
      {/* Barra de Controles Superior - 100% Responsiva e Organizada */}
      <header className="p-3.5 sm:p-5 bg-[#16181B] border-b border-[#C8A463]/30 print:hidden sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 sm:gap-4">
          
          {/* Topo / Esquerda: Voltar + Identidade */}
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full lg:w-auto">
            <Link href="/instalar" className="shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="min-h-[42px] px-3.5 text-xs font-bold border-[#C8A463]/70 bg-[#25282E] !text-white hover:!text-[#FFCC36] hover:bg-[#C8A463]/20 shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 text-[#FFCC36]" />
                Voltar
              </Button>
            </Link>

            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-base font-cinzel font-bold text-white flex items-center gap-2 tracking-wide uppercase truncate">
                <Printer className="w-4 h-4 text-[#FFCC36] shrink-0 hidden sm:inline" />
                <span>Central de Impressão • Catedral</span>
              </h1>
              <p className="text-[11px] text-[#A39E98] font-sans truncate hidden sm:block">
                Cartazes A4 e displays para os bancos com QR Code oficial da paróquia.
              </p>
            </div>
          </div>

          {/* Controles: Seletor de Modelos + Ações (Organizado por Grid no Mobile e Linha Única no Desktop) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
            {/* Seletor de 3 Modelos */}
            <div className="grid grid-cols-3 sm:flex items-center bg-[#0F1012] p-1 rounded-xl border border-[#2D1A16] text-xs">
              <button
                type="button"
                onClick={() => setTemplate('cartaz-a4')}
                className={`py-2 px-2.5 sm:px-3 rounded-lg font-semibold transition-all cursor-pointer text-center truncate min-h-[38px] flex items-center justify-center ${
                  template === 'cartaz-a4' 
                    ? 'bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-bold border border-[#C8A463]/50 shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cartaz A4
              </button>
              <button
                type="button"
                onClick={() => setTemplate('displays-banco')}
                className={`py-2 px-2.5 sm:px-3 rounded-lg font-semibold transition-all cursor-pointer text-center truncate min-h-[38px] flex items-center justify-center ${
                  template === 'displays-banco' 
                    ? 'bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-bold border border-[#C8A463]/50 shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bancos (4x)
              </button>
              <button
                type="button"
                onClick={() => setTemplate('cartoes-bolso')}
                className={`py-2 px-2.5 sm:px-3 rounded-lg font-semibold transition-all cursor-pointer text-center truncate min-h-[38px] flex items-center justify-center ${
                  template === 'cartoes-bolso' 
                    ? 'bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white font-bold border border-[#C8A463]/50 shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cartões (6x)
              </button>
            </div>

            {/* Ações: P&B e Imprimir */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMonochrome(!isMonochrome)}
                className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[42px] flex items-center justify-center gap-1.5 ${
                  isMonochrome 
                    ? 'bg-slate-200 text-slate-950 border-slate-300' 
                    : 'bg-[#1E2024] text-[#C8A463] border-[#C8A463]/40 hover:bg-[#25282E]'
                }`}
              >
                <Palette className="w-3.5 h-3.5 shrink-0" />
                <span>{isMonochrome ? 'P&B' : 'Cores'}</span>
              </button>

              <Button
                variant="primary"
                size="md"
                onClick={handlePrint}
                className="flex-1 sm:flex-none bg-gradient-to-r from-[#FFCC36] to-[#FFA82A] hover:from-[#FFA82A] hover:to-[#B75319] text-slate-950 font-bold min-h-[42px] px-4 text-xs shadow-md shadow-black/40 border border-[#FFCC36] whitespace-nowrap"
                icon={<Printer className="w-4 h-4 shrink-0" />}
              >
                Imprimir Material
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dica Pastoral de Impressão */}
      <div className="bg-[#1C1410] border-b border-[#C8A463]/25 p-2 sm:p-2.5 text-center text-[11px] sm:text-xs text-[#EAE3D9] print:hidden px-3">
        🏛️ <strong>Dica da Secretaria:</strong> Marque a opção <em>"Gráficos de plano de fundo"</em> na impressora para exibir todas as cores e molduras em alta nitidez.
      </div>

      {/* Visualização da Folha A4 Realista & Fluida (Sem Quebra em Telas Pequenas) */}
      <main className="flex-1 flex items-start sm:items-center justify-center p-2.5 sm:p-6 lg:p-8 print:p-0 w-full overflow-x-hidden">
        <div 
          className={`w-full max-w-full sm:max-w-[210mm] mx-auto bg-[#FDFBF7] text-[#1C1111] shadow-2xl rounded-2xl print:shadow-none print:max-w-none print:w-full print:m-0 overflow-x-hidden ${
            isMonochrome ? 'grayscale' : ''
          }`}
        >
          {template === 'cartaz-a4' && <PrintPosterA4 qrCodeUrl={qrCodeUrl} />}
          {template === 'displays-banco' && <PrintBenchDisplays qrCodeUrl={qrCodeUrl} />}
          {template === 'cartoes-bolso' && <PrintPocketCards qrCodeUrl={qrCodeUrl} />}
        </div>
      </main>
    </div>
  );
}
