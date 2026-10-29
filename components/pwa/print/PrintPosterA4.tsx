import React from 'react';
import { Sparkles, Clock, BookOpen, Smartphone } from 'lucide-react';

interface PrintPosterA4Props {
  qrCodeUrl: string;
}

export function PrintPosterA4({ qrCodeUrl }: PrintPosterA4Props) {
  return (
    <div className="p-4 sm:p-10 print:p-10 flex flex-col justify-between h-full min-h-auto print:min-h-[297mm] border-[4px] sm:border-[6px] border-[#8B1E22] relative w-full overflow-hidden">
      {/* Filete Interno Dourado com Cantos Sacros */}
      <div className="absolute inset-1.5 sm:inset-3 border sm:border-2 border-[#C8A463] pointer-events-none rounded-xs" />
      
      {/* Ornatos Litúrgicos de Canto (Cruzes Gregas em Ouro) */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-[#C8A463] text-xs sm:text-sm font-bold select-none">✝</div>
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-[#C8A463] text-xs sm:text-sm font-bold select-none">✝</div>
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-[#C8A463] text-xs sm:text-sm font-bold select-none">✝</div>
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-[#C8A463] text-xs sm:text-sm font-bold select-none">✝</div>

      {/* 1. CABEÇALHO MONUMENTAL DA CATEDRAL */}
      <div className="text-center space-y-2 pt-2 relative z-10">
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          {/* Brasão Solene do Sagrado Coração */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#8B1E22] via-[#651518] to-[#2D1A16] border-2 border-[#C8A463] flex items-center justify-center text-[#FFCC36] shadow-md shrink-0">
            <span className="font-serif text-xl sm:text-2xl font-bold leading-none select-none">✝</span>
          </div>
          <div className="text-left">
            <h2 className="font-cinzel text-base sm:text-xl font-bold tracking-[0.06em] uppercase text-[#8B1E22] leading-tight">
              Catedral do Sagrado Coração de Jesus
            </h2>
            <p className="text-[10px] sm:text-[11px] font-bold text-[#C8A463] tracking-[0.18em] uppercase font-sans">
              Diocese de Colatina • Igreja-Mãe
            </p>
          </div>
        </div>

        {/* Divisor Nobre com Losango Central */}
        <div className="flex items-center justify-center gap-3 py-0.5 opacity-75">
          <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent to-[#C8A463]" />
          <span className="text-[#C8A463] text-xs font-serif">◆</span>
          <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-l from-transparent to-[#C8A463]" />
        </div>
      </div>

      {/* 2. BLOCO DE CHAMADA HEROICA (TENHA A CATEDRAL NO SEU CELULAR) */}
      <div className="text-center space-y-3 my-auto py-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-[#8B1E22]/10 border border-[#8B1E22]/30 text-[#8B1E22] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C8A463]" />
          <span>Aplicativo Oficial da Catedral • Acesso Rápido</span>
        </div>

        <h3 className="font-cinzel text-xl sm:text-3xl font-extrabold text-[#1C1111] leading-tight tracking-[0.03em] uppercase max-w-xl mx-auto px-1">
          Tenha a Catedral sempre com você no seu celular
        </h3>

        <p className="text-xs sm:text-sm text-[#514D4B] max-w-lg mx-auto font-sans leading-relaxed px-2">
          Aponte a câmera do seu celular para o QR Code abaixo e salve o atalho da Catedral com 1 toque na sua tela inicial:
        </p>

        {/* 3. MOLDURA NOBRE DO QR CODE */}
        <div className="inline-block p-3 sm:p-5 rounded-3xl bg-[#FAF7F2] border-2 sm:border-3 border-[#C8A463] shadow-md mx-auto my-1">
          <div className="relative p-2 sm:p-2.5 bg-[var(--dash-surface)] rounded-2xl shadow-inner border border-[#E8DFD3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="QR Code da Catedral de Colatina"
              className="w-44 h-44 sm:w-56 sm:h-56 object-contain"
            />
            {/* Selo Central da Cruz no QR Code */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#8B1E22] text-[#FFCC36] border-2 border-[#C8A463] shadow-md flex items-center justify-center font-serif text-base sm:text-lg font-bold">
                ✝
              </div>
            </div>
          </div>

          <div className="pt-2 sm:pt-2.5 text-center">
            <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.12em] text-[#8B1E22] uppercase block">
              catedraldecolatina.org.br/instalar
            </span>
          </div>
        </div>

        {/* 4. PASSO A PASSO ILUSTRADO EM 3 ETAPAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto text-center pt-1">
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-0.5 sm:space-y-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-full bg-[#8B1E22] text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <p className="font-bold text-xs text-[#1C1111] font-serif">Aponte a Câmera</p>
            <p className="text-[10px] text-[#514D4B] leading-tight">Abra a câmera do celular e aponte para o código.</p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-0.5 sm:space-y-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-full bg-[#8B1E22] text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <p className="font-bold text-xs text-[#1C1111] font-serif">Toque no Link</p>
            <p className="text-[10px] text-[#514D4B] leading-tight">O portal da Catedral abrirá imediatamente.</p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-0.5 sm:space-y-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-full bg-[#8B1E22] text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <p className="font-bold text-xs text-[#1C1111] font-serif">Adicione à Tela</p>
            <p className="text-[10px] text-[#514D4B] leading-tight">Salve o ícone na tela inicial para acessar sempre.</p>
          </div>
        </div>

        {/* 5. GRADE DE 3 BENEFÍCIOS PASTORAIS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-2 sm:gap-3 text-left max-w-xl mx-auto pt-2 sm:pt-3 border-t border-[#E8DFD3]">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#8B1E22] flex items-center gap-1 font-serif">
              <Clock className="w-3.5 h-3.5 text-[#C8A463]" />
              Santas Missas
            </p>
            <p className="text-[10px] text-[#514D4B] leading-snug">
              Horários da Catedral e das 12 CEBs em tempo real.
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#8B1E22] flex items-center gap-1 font-serif">
              <BookOpen className="w-3.5 h-3.5 text-[#C8A463]" />
              Folheto Litúrgico
            </p>
            <p className="text-[10px] text-[#514D4B] leading-snug">
              Cânticos e leituras do domingo («Sou do Sagrado»).
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#8B1E22] flex items-center gap-1 font-serif">
              <Smartphone className="w-3.5 h-3.5 text-[#C8A463]" />
              Ultraleve e Seguro
            </p>
            <p className="text-[10px] text-[#514D4B] leading-snug">
              Não precisa de lojas nem gasta a memória do telefone.
            </p>
          </div>
        </div>

        {/* 6. SELO DE FACILIDADE CANÔNICA */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-[#8B1E22]/5 border border-[#8B1E22]/20 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] text-[#8B1E22] font-semibold max-w-xl mx-auto">
          <span>✔ Sem Play Store ou App Store</span>
          <span className="hidden sm:inline">•</span>
          <span>✔ 100% Gratuito</span>
          <span className="hidden sm:inline">•</span>
          <span>✔ Funciona em Android e iPhone</span>
        </div>
      </div>

      {/* 7. RODAPÉ DO CARTAZ */}
      <div className="pt-2 sm:pt-3 border-t sm:border-t-2 border-[#C8A463] flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#514D4B] relative z-10 font-sans">
        <span className="font-bold text-[#8B1E22]">
          Catedral do Sagrado Coração de Jesus • Colatina/ES
        </span>
        <span>Praça da Catedral, s/n - Centro</span>
      </div>
    </div>
  );
}
