import React from 'react';
import Link from 'next/link';
import { ResolvedEventTheme } from '@/lib/events';

interface CathedralFooterProps {
  parishName?: string;
  dioceseName?: string;
  address?: string;
  whatsappNumber?: string;
  themeOverride?: ResolvedEventTheme;
}

export function CathedralFooter({
  parishName = 'Catedral do Sagrado Coração de Jesus',
  dioceseName = 'Diocese de Colatina',
  address = 'Praça da Catedral, s/n - Centro, Colatina/ES',
  whatsappNumber = '(27) 3722-1234',
  themeOverride,
}: CathedralFooterProps) {
  const isThemed = Boolean(themeOverride);
  const accentGold = themeOverride ? themeOverride.secondary : '#FFCC36';
  const borderGold = themeOverride ? themeOverride.secondary : '#C8A463';
  const textTitle = themeOverride ? themeOverride.textPrimary : '#FFFFFF';
  const textBody = themeOverride ? themeOverride.textSecondary : '#CFCAC4';
  const textSubtle = themeOverride ? themeOverride.textMuted : '#A39E98';

  return (
    <footer
      className="w-full pt-14 pb-8 border-t-2 transition-colors duration-300"
      style={
        isThemed && themeOverride
          ? {
              background: `linear-gradient(180deg, ${themeOverride.surfaceBg} 0%, ${themeOverride.pageBg} 100%)`,
              color: textBody,
              borderColor: borderGold,
            }
          : {
              backgroundColor: '#131313',
              color: '#CFCAC4',
              borderColor: '#C8A463',
            }
      }
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b"
          style={{
            borderColor: isThemed && themeOverride ? themeOverride.borderSubtle : '#2A2927',
          }}
        >
          {/* Coluna 1: Dados da Catedral */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-bold" style={{ color: accentGold }}>
                ✝
              </span>
              <h4
                className="font-cinzel text-base font-bold tracking-[0.08em] uppercase"
                style={{ color: textTitle }}
              >
                {parishName}
              </h4>
            </div>
            <p className="text-xs leading-relaxed font-sans" style={{ color: textSubtle }}>
              Igreja-Mãe da {dioceseName}. Um lugar de acolhimento, oração comunitária e anúncio do Evangelho de Cristo.
            </p>
            <div className="text-xs space-y-1 pt-1 font-sans" style={{ color: textSubtle }}>
              <p>📍 {address}</p>
              <p>📞 WhatsApp: {whatsappNumber}</p>
              <p>✉️ E-mail: secretaria@catedraldecolatina.org.br</p>
            </div>
          </div>

          {/* Coluna 2: Navegação Litúrgica & Serviços */}
          <div className="space-y-3">
            <h5
              className="font-cinzel text-xs font-bold uppercase tracking-[0.14em]"
              style={{ color: accentGold }}
            >
              Navegação
            </h5>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/agenda-liturgica" className="hover:opacity-80 transition-opacity">
                  Agenda Litúrgica da Catedral
                </Link>
              </li>
              <li>
                <Link href="/programacao" className="hover:opacity-80 transition-opacity">
                  Grandes Festas & Solenidades
                </Link>
              </li>
              <li>
                <Link href="/historia" className="hover:opacity-80 transition-opacity">
                  Nossa História & Sucessão
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:opacity-80 transition-opacity">
                  Mural de Notícias & Avisos
                </Link>
              </li>
              <li>
                <Link href="/dizimo" className="hover:opacity-80 transition-opacity">
                  Sou do Sagrado (Dízimo & PIX)
                </Link>
              </li>
              <li>
                <Link href="/secretaria" className="hover:opacity-80 transition-opacity">
                  Balcão Digital do Fiel
                </Link>
              </li>
              <li>
                <Link
                  href="/instalar"
                  className="hover:underline font-bold transition-colors flex items-center gap-1.5"
                  style={{ color: accentGold }}
                >
                  <span>📱 Instalar Aplicativo no Celular</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Comunidades (CEBs) */}
          <div className="space-y-3">
            <h5
              className="font-cinzel text-xs font-bold uppercase tracking-[0.14em]"
              style={{ color: accentGold }}
            >
              12 Comunidades (CEBs)
            </h5>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link
                  href="/comunidades/comunidade-sao-jose-operario"
                  className="hover:opacity-80 transition-opacity"
                >
                  Comunidade São José Operário
                </Link>
              </li>
              <li>
                <Link
                  href="/comunidades/comunidade-nossa-senhora-aparecida"
                  className="hover:opacity-80 transition-opacity"
                >
                  Comunidade N. Sra. Aparecida
                </Link>
              </li>
              <li>
                <Link
                  href="/comunidades/comunidade-santa-rita-de-cassia-brisa-do-vale"
                  className="hover:opacity-80 transition-opacity"
                >
                  Comunidade Santa Rita de Cássia
                </Link>
              </li>
              <li>
                <Link
                  href="/comunidades"
                  className="font-bold hover:underline"
                  style={{ color: borderGold }}
                >
                  Ver todas as 12 comunidades →
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Transmissões & Diocese */}
          <div className="space-y-3">
            <h5
              className="font-cinzel text-xs font-bold uppercase tracking-[0.14em]"
              style={{ color: accentGold }}
            >
              Mídias & Igreja
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.youtube.com/@catedraldecolatina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity flex items-center gap-1.5"
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
                  className="hover:opacity-80 transition-opacity"
                >
                  Diocese de Colatina (Site Oficial)
                </a>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: borderGold }}
                >
                  Privacidade & Proteção de Dados (LGPD)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé Inferior 100% White-Label */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: textSubtle }}
        >
          <p>
            © {new Date().getFullYear()} {parishName} • {dioceseName}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacidade" className="hover:underline transition-opacity">
              Política de Privacidade & LGPD
            </Link>
            <span>•</span>
            <p>Plataforma Paroquial Oficial</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
