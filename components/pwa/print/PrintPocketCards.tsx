import React from 'react';

interface PrintPocketCardsProps {
  qrCodeUrl: string;
}

export function PrintPocketCards({ qrCodeUrl }: PrintPocketCardsProps) {
  return (
    <div className="p-3 sm:p-6 print:p-6 grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 print:grid-rows-3 gap-3 w-full h-full min-h-auto print:min-h-[297mm]">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div
          key={index}
          className="p-3.5 sm:p-4 border-2 border-dashed border-[#C8A463]/80 rounded-2xl flex items-center justify-between gap-3 text-left relative bg-[#FAF7F2] shadow-xs"
        >
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[#8B1E22]">
              <span className="text-xs font-bold">✝</span>
              <span className="font-cinzel text-[10px] sm:text-[9px] font-bold uppercase tracking-wider text-[#8B1E22] truncate">
                Catedral de Colatina
              </span>
            </div>
            <h4 className="font-cinzel font-bold text-xs sm:text-xs text-[#1C1111] leading-snug uppercase">
              Tenha a Catedral no Celular
            </h4>
            <p className="text-[11px] sm:text-[9px] text-[#514D4B] leading-tight font-sans">
              Missas, folheto dominical e avisos da paróquia.
            </p>
            <p className="text-[10px] sm:text-[9px] font-bold text-[#8B1E22] font-mono pt-0.5 truncate">
              catedraldecolatina.org.br/instalar
            </p>
          </div>

          <div className="p-1.5 bg-[var(--dash-surface)] border-2 border-[#C8A463] rounded-xl shrink-0 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="QR Code Catedral"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-5 h-5 rounded-full bg-[#8B1E22] text-[#FFCC36] flex items-center justify-center text-[10px] font-bold shadow-xs">
                ✝
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
