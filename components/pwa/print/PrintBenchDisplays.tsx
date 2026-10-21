import React from 'react';
import { Scissors } from 'lucide-react';

interface PrintBenchDisplaysProps {
  qrCodeUrl: string;
}

export function PrintBenchDisplays({ qrCodeUrl }: PrintBenchDisplaysProps) {
  return (
    <div className="p-3 sm:p-6 print:p-6 grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 w-full h-full min-h-auto print:min-h-[297mm]">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="p-4 sm:p-5 border-2 border-dashed border-[#8B1E22] rounded-2xl flex flex-col justify-between text-center relative overflow-hidden bg-[#FAF7F2] shadow-xs"
        >
          {/* Marca de Tesoura */}
          <div className="absolute top-2.5 right-2.5 text-[#C8A463] print:text-slate-600">
            <Scissors className="w-4 h-4 rotate-90" />
          </div>

          <div className="space-y-1 border-b border-[#E8DFD3] pb-2">
            <div className="flex items-center justify-center gap-1.5 text-[#8B1E22]">
              <div className="w-5 h-5 rounded-md bg-[#8B1E22] text-[#FFCC36] flex items-center justify-center text-xs font-bold">
                ✝
              </div>
              <span className="font-cinzel font-bold text-xs uppercase tracking-wider text-[#8B1E22]">
                Catedral de Colatina
              </span>
            </div>
            <h3 className="font-cinzel font-extrabold text-sm sm:text-sm text-[#1C1111] leading-tight pt-1 uppercase">
              Acesse a Catedral no Celular
            </h3>
            <p className="text-[11px] sm:text-[10px] text-[#514D4B] font-sans">
              Aponte a câmera para o QR Code abaixo:
            </p>
          </div>

          <div className="my-2.5 p-2 bg-[var(--dash-surface)] rounded-2xl border-2 border-[#C8A463] shadow-xs inline-block mx-auto relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="QR Code do Banco da Catedral"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#8B1E22] text-[#FFCC36] border border-[#C8A463] flex items-center justify-center text-xs font-bold shadow-xs">
                ✝
              </div>
            </div>
          </div>

          <div className="space-y-1 border-t border-[#E8DFD3] pt-2 text-[11px] sm:text-[10px] text-[#514D4B]">
            <p className="font-bold text-[#8B1E22] font-serif">
              • Horários de Missa • Folheto • Avisos
            </p>
            <p className="text-[10px] sm:text-[9px] font-bold text-[#C8A463] font-mono">
              catedraldecolatina.org.br/instalar
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
