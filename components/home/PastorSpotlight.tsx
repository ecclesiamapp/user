import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, MessageCircle } from 'lucide-react';

interface PastorSpotlightProps {
  whatsappNumber?: string;
}

export function PastorSpotlight({ whatsappNumber = '552737221234' }: PastorSpotlightProps) {
  const cleanPhone = whatsappNumber.replace(/\D/g, '');

  return (
    <section id="paroco" className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22]/10 text-[#8B1E22] text-xs font-bold uppercase tracking-wider">
            Pastor da Nossa Comunidade
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#2D1A16] mt-1.5">
            Pároco da <span className="text-[#8B1E22]">Catedral</span>
          </h2>
        </div>
        <a 
          href="#comunidades"
          className="text-xs sm:text-sm font-bold text-[#03637A] hover:text-[#02495A] inline-flex items-center gap-1 transition-colors"
        >
          <span>Conhecer nossas 12 comunidades</span>
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
        {/* Retrato Oficial com Moldura Dourada da Catedral */}
        <div className="relative shrink-0">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-br from-[#8B1E22] via-[#211A14] to-[#121314] border-4 border-[#FFA82A] shadow-xl overflow-hidden flex items-center justify-center text-center p-2">
            {/* Foto ou Ícone Nobre Eclesial */}
            <div className="flex flex-col items-center justify-center text-white space-y-1">
              <span className="text-4xl">✝</span>
              <span className="font-cinzel text-sm font-bold text-[#FFCC36] uppercase tracking-wider">Pe. Irineu</span>
              <span className="text-[10px] text-[#EAE3D9]/80 uppercase tracking-widest">Pároco e Cura</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#8B1E22] text-white p-2 rounded-xl border-2 border-white shadow-md">
            <Sparkles className="w-4 h-4 text-[#FFCC36]" />
          </div>
        </div>

        {/* Informações e Saudação Pastoral */}
        <div className="space-y-3 text-center md:text-left flex-grow">
          <div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#2D1A16] uppercase tracking-wide">
              Pe. Irineu Claudino Sales
            </h3>
            <p className="text-sm font-semibold text-[#8B1E22]">
              Pároco e Cura da Catedral Sagrado Coração de Jesus
            </p>
            <p className="text-xs text-[#B75319] italic font-medium mt-0.5">
              "Apascenta as minhas ovelhas" (Jo 21, 17)
            </p>
          </div>

          <p className="text-sm text-[#514D4B] leading-relaxed">
            Seja muito bem-vindo à nossa Catedral! Como pároco, tenho a imensa alegria de acolher cada fiel e visitante que adentra as portas do Sagrado Coração. Esta paróquia é uma família viva, construída pela oração diária, pela dedicação das pastorais e pelo testemunho de fé do povo colatinense. Que o Coração de Jesus derrame bênçãos sobre o seu lar!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <a
              href={`https://wa.me/${cleanPhone}?text=Olá,%20gostaria%20de%20agendar%20um%20horário%20com%20o%20Pe.%20Irineu%20na%20Catedral.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B1E22] hover:bg-[#721C24] text-white text-xs font-bold transition-all shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Agendar com o Padre</span>
            </a>

            <Link
              href="/mensagens"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5EFE7] hover:bg-[#EEE3D4] text-[#2D1A16] text-xs font-bold transition-all border border-[#EAE3D9]"
            >
              <span>Ler Reflexões e Mensagens Pastorais</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8B1E22]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
