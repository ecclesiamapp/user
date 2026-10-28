'use client';

import React from 'react';
import { AdventCandle } from '@/types';

interface AdventWreathSvgProps {
  candles: AdventCandle[];
  onSelectCandle?: (candle: AdventCandle) => void;
  selectedWeek?: number;
  className?: string;
}

export function AdventWreathSvg({
  candles,
  onSelectCandle,
  selectedWeek,
  className = '',
}: AdventWreathSvgProps) {
  // Coordenadas das velas no sistema 500x460
  // 1: Topo (Norte), 2: Direita (Leste), 3: Fundo (Sul), 4: Esquerda (Oeste), 5: Centro (Cristo)
  const candlePositions = [
    { week: 1, x: 250, y: 70, height: 74, width: 26, flameDelayClass: 'animate-advent-flame' },
    { week: 2, x: 375, y: 195, height: 68, width: 26, flameDelayClass: 'animate-advent-flame-delayed' },
    { week: 3, x: 250, y: 310, height: 64, width: 26, flameDelayClass: 'animate-advent-flame-slow' },
    { week: 4, x: 125, y: 195, height: 68, width: 26, flameDelayClass: 'animate-advent-flame-delayed' },
    { week: 5, x: 250, y: 195, height: 86, width: 32, flameDelayClass: 'animate-advent-flame' }, // Vela Central de Cristo
  ];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 500 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[440px] h-auto drop-shadow-2xl"
        aria-label="Coroa do Advento com 4 velas semanais e a vela central de Cristo"
      >
        <defs>
          {/* Brilho Dourado do Advento */}
          <radialGradient id="halo-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFA82A" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFCC36" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFCC36" stopOpacity="0" />
          </radialGradient>

          {/* Brilho da Vela de Cristo */}
          <radialGradient id="christ-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          {/* Vela 1: Roxo */}
          <linearGradient id="wax-purple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#581c87" />
            <stop offset="35%" stopColor="#7e22ce" />
            <stop offset="70%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>

          {/* Vela 2: Vermelho */}
          <linearGradient id="wax-red" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="35%" stopColor="#dc2626" />
            <stop offset="70%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          {/* Vela 3: Rosa Gaudete */}
          <linearGradient id="wax-rose" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#be185d" />
            <stop offset="35%" stopColor="#ec4899" />
            <stop offset="70%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#9d174d" />
          </linearGradient>

          {/* Vela 4: Branco */}
          <linearGradient id="wax-white" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="35%" stopColor="#f8fafc" />
            <stop offset="70%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Vela 5: Vela de Cristo (Branco/Ouro) */}
          <linearGradient id="wax-christ" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="30%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Chama da Vela: Gradiente Radial Incandescente */}
          <radialGradient id="flame-gradient" cx="50%" cy="80%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* 1. Halo de Iluminação Ambiente da Coroa */}
        <circle cx="250" cy="230" r="210" fill="url(#halo-glow)" className="animate-advent-halo pointer-events-none" />

        {/* 2. Círculo de Ramos Verdes & Pinheiro (Base da Coroa) */}
        <g id="coroa-folhagens" className="pointer-events-none">
          {/* Anel de base verde escuro perpétuo */}
          <circle cx="250" cy="230" r="145" stroke="#064e3b" strokeWidth="60" strokeLinecap="round" opacity="0.9" />
          <circle cx="250" cy="230" r="145" stroke="#065f46" strokeWidth="48" strokeDasharray="18 12" />
          <circle cx="250" cy="230" r="140" stroke="#047857" strokeWidth="36" strokeDasharray="24 16" />
          <circle cx="250" cy="230" r="150" stroke="#059669" strokeWidth="22" strokeDasharray="12 18" />

          {/* Folhagens de Pinheiro e Cipreste em arco (Textura rica e orgânica) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const fx = 250 + Math.cos(rad) * 145;
            const fy = 230 + Math.sin(rad) * 145;
            return (
              <g key={`branch-${idx}`} transform={`translate(${fx}, ${fy}) rotate(${angle + 45})`}>
                <path d="M-15,-6 Q0,0 15,-6 Q0,8 -15,-6" fill="#10b981" opacity="0.75" />
                <path d="M-10,-12 Q0,-4 10,-12 Q0,4 -10,-12" fill="#047857" opacity="0.85" />
                <circle cx="0" cy="0" r="3" fill="#b91c1c" />
                <circle cx="6" cy="-4" r="2.5" fill="#ef4444" />
                <circle cx="-5" cy="4" r="2.2" fill="#991b1b" />
              </g>
            );
          })}

          {/* Fitas e Laços Vermelhos com Fio Dourado (Amor de Deus na Aliança) */}
          <path
            d="M175,135 Q190,165 210,185"
            stroke="#b91c1c"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M175,135 Q190,165 210,185"
            stroke="#FFA82A"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d="M325,135 Q310,165 290,185"
            stroke="#b91c1c"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M325,135 Q310,165 290,185"
            stroke="#FFA82A"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d="M200,290 Q225,310 250,335 Q275,310 300,290"
            stroke="#b91c1c"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M200,290 Q225,310 250,335 Q275,310 300,290"
            stroke="#FFA82A"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            fill="none"
          />
        </g>

        {/* 3. As Velas da Coroa (Interativas e Vivas) */}
        {candlePositions.map((pos) => {
          const candle = candles.find((c) => c.week === pos.week);
          if (!candle) return null;

          const isChrist = pos.week === 5;
          const isSelected = selectedWeek === pos.week;
          const waxGradient =
            pos.week === 1
              ? 'url(#wax-purple)'
              : pos.week === 2
              ? 'url(#wax-red)'
              : pos.week === 3
              ? 'url(#wax-rose)'
              : pos.week === 4
              ? 'url(#wax-white)'
              : 'url(#wax-christ)';

          const candleTopY = pos.y - pos.height / 2;
          const candleBottomY = pos.y + pos.height / 2;
          const wickY = candleTopY - 6;

          return (
            <g
              key={`candle-group-${pos.week}`}
              onClick={() => onSelectCandle && onSelectCandle(candle)}
              className="cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-none"
              role="button"
              tabIndex={0}
              aria-label={`${candle.name}: ${candle.theme}. ${candle.isLit ? 'Acesa' : 'Aguardando'}. Toque para ver oração.`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCandle && onSelectCandle(candle);
                }
              }}
            >
              {/* Indicador de Seleção / Foco */}
              {isSelected && (
                <ellipse
                  cx={pos.x}
                  cy={pos.y + 10}
                  rx={pos.width + 12}
                  ry={pos.height / 2 + 18}
                  fill="none"
                  stroke="#FFA82A"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                  className="animate-pulse"
                />
              )}

              {/* Bocal de Latão Dourado na Base da Vela */}
              <ellipse
                cx={pos.x}
                cy={candleBottomY + 2}
                rx={pos.width / 2 + 6}
                ry="7"
                fill="#854d0e"
              />
              <ellipse
                cx={pos.x}
                cy={candleBottomY}
                rx={pos.width / 2 + 4}
                ry="5"
                fill="#eab308"
              />

              {/* Cilindro de Cera da Vela */}
              <rect
                x={pos.x - pos.width / 2}
                y={candleTopY}
                width={pos.width}
                height={pos.height}
                rx={pos.width / 4}
                fill={waxGradient}
                stroke={isChrist ? '#fef08a' : 'rgba(0,0,0,0.2)'}
                strokeWidth={isChrist ? '1.5' : '1'}
              />

              {/* Topo Arredondado da Cera com Depressão do Pavio */}
              <ellipse
                cx={pos.x}
                cy={candleTopY}
                rx={pos.width / 2}
                ry="5"
                fill={isChrist ? '#ffffff' : candle.hexColor}
                opacity="0.9"
              />

              {/* Faixa / Borda Dourada Imperial para a Vela Central de Cristo */}
              {isChrist && (
                <rect
                  x={pos.x - pos.width / 2}
                  y={pos.y - 10}
                  width={pos.width}
                  height="12"
                  fill="#FFA82A"
                  opacity="0.85"
                />
              )}

              {/* Pavio Escuro da Vela */}
              <line
                x1={pos.x}
                y1={candleTopY}
                x2={pos.x}
                y2={wickY}
                stroke="#1f2937"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* CHAMA VIVA (Se a vela estiver acesa) */}
              {candle.isLit ? (
                <g className={pos.flameDelayClass}>
                  {/* Halo de Luz Radial da Chama */}
                  <circle
                    cx={pos.x}
                    cy={wickY - 12}
                    r={isChrist ? 36 : 26}
                    fill={isChrist ? 'url(#christ-halo)' : 'url(#halo-glow)'}
                    className="pointer-events-none"
                  />

                  {/* Chama Gota Teardrop em Vetor Puro */}
                  <path
                    d={`M${pos.x},${wickY - (isChrist ? 32 : 25)} C${pos.x + (isChrist ? 13 : 9)},${wickY - 16} ${pos.x + (isChrist ? 11 : 8)},${wickY - 2} ${pos.x},${wickY - 1} C${pos.x - (isChrist ? 11 : 8)},${wickY - 2} ${pos.x - (isChrist ? 13 : 9)},${wickY - 16} ${pos.x},${wickY - (isChrist ? 32 : 25)} Z`}
                    fill="url(#flame-gradient)"
                  />

                  {/* Núcleo Incandescente Branco Central */}
                  <ellipse
                    cx={pos.x}
                    cy={wickY - (isChrist ? 9 : 7)}
                    rx={isChrist ? 3.5 : 2.5}
                    ry={isChrist ? 7 : 5}
                    fill="#ffffff"
                    opacity="0.95"
                  />
                </g>
              ) : (
                /* Pavio Apagado aguardando o domingo */
                <circle cx={pos.x} cy={wickY} r="1.5" fill="#374151" />
              )}

              {/* Badge Numérico Litúrgico / Símbolo da Vela */}
              <circle
                cx={pos.x}
                cy={candleBottomY + 14}
                r="11"
                fill="#2D1A16"
                stroke={candle.isLit ? '#FFA82A' : '#78716c'}
                strokeWidth="1.5"
              />
              <text
                x={pos.x}
                y={candleBottomY + 18}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill={candle.isLit ? '#FFA82A' : '#d6d3d1'}
                className="font-cinzel select-none pointer-events-none"
              >
                {isChrist ? '✝' : `${pos.week}º`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
