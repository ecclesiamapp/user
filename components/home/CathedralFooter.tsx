import React from 'react';
import Link from 'next/link';

interface CathedralFooterProps {
  parishName?: string;
  dioceseName?: string;
  address?: string;
  whatsappNumber?: string;
}

export function CathedralFooter({
  parishName = 'Catedral do Sagrado Coração de Jesus',
  dioceseName = 'Diocese de Colatina',
  address = 'Praça da Catedral, s/n - Centro, Colatina/ES',
  whatsappNumber = '(27) 3722-1234',
}: CathedralFooterProps) {
  return (
    <footer className="w-full bg-[#131313] text-[#CFCAC4] pt-14 pb-8 border-t-2 border-[#C8A463]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#2A2927]">
          {/* Coluna 1: Dados da Catedral */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[#FFCC36] text-xl font-bold">✝</span>
              <h4 className="font-cinzel text-base font-bold text-white tracking-[0.08em] uppercase">
                {parishName}
              </h4>
            </div>
            <p className="text-xs text-[#A39E98] leading-relaxed font-sans">
              Igreja-Mãe da {dioceseName}. Um lugar de acolhimento, oração comunitária e anúncio do Evangelho de Cristo.
            </p>
            <div className="text-xs text-[#8A8580] space-y-1 pt-1 font-sans">
              <p>📍 {address}</p>
              <p>📞 WhatsApp: {whatsappNumber}</p>
              <p>✉️ E-mail: secretaria@catedraldecolatina.org.br</p>
            </div>
          </div>

          {/* Coluna 2: Navegação Litúrgica & Serviços */}
          <div className="space-y-3">
            <h5 className="font-cinzel text-xs font-bold text-[#FFCC36] uppercase tracking-[0.14em]">
              Navegação
            </h5>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/agenda-liturgica" className="hover:text-white transition-colors">
                  Agenda Litúrgica da Catedral
                </Link>
              </li>
              <li>
                <Link href="/historia" className="hover:text-white transition-colors">
                  Nossa História & Sucessão
                </Link>
              </li>
              <li>
                <a href="#secretaria" className="hover:text-white transition-colors">
                  Secretaria & Sacramentos
                </a>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-white transition-colors">
                  Mural de Notícias & Avisos
                </Link>
              </li>
              <li>
                <Link href="/dizimo" className="hover:text-white transition-colors">
                  Sou do Sagrado (Dízimo & PIX)
                </Link>
              </li>
              <li>
                <Link href="/secretaria" className="hover:text-white transition-colors">
                  Balcão Digital do Fiel
                </Link>
              </li>
              <li>
                <Link href="/instalar" className="text-[#FFCC36] hover:underline font-bold transition-colors flex items-center gap-1.5">
                  <span>📱 Instalar Aplicativo no Celular</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Comunidades (CEBs) */}
          <div className="space-y-3">
            <h5 className="font-cinzel text-xs font-bold text-[#FFCC36] uppercase tracking-[0.14em]">
              12 Comunidades (CEBs)
            </h5>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/comunidades/comunidade-sao-jose-operario" className="hover:text-white transition-colors">
                  Comunidade São José Operário
                </Link>
              </li>
              <li>
                <Link href="/comunidades/comunidade-nossa-senhora-aparecida" className="hover:text-white transition-colors">
                  Comunidade N. Sra. Aparecida
                </Link>
              </li>
              <li>
                <Link href="/comunidades/comunidade-santa-rita-de-cassia-brisa-do-vale" className="hover:text-white transition-colors">
                  Comunidade Santa Rita de Cássia
                </Link>
              </li>
              <li>
                <a href="#comunidades" className="text-[#C8A463] font-bold hover:underline">
                  Ver todas as 12 comunidades →
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Transmissões & Diocese */}
          <div className="space-y-3">
            <h5 className="font-cinzel text-xs font-bold text-[#FFCC36] uppercase tracking-[0.14em]">
              Mídias & Igreja
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://www.youtube.com/@catedraldecolatina" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#D32F2F]" />
                  <span>YouTube Oficial (Missa ao Vivo)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://diocesedecolatina.org.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Diocese de Colatina (Site Oficial)
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-[#7A7570] hover:text-[#A39E98] transition-colors">
                  Área Administrativa da Paróquia
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé Inferior 100% White-Label */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A7570]">
          <p>© {new Date().getFullYear()} {parishName} • {dioceseName}. Todos os direitos reservados.</p>
          <p className="text-[11px]">Plataforma Paroquial Oficial</p>
        </div>
      </div>
    </footer>
  );
}
