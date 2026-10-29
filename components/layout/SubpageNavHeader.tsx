'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Home } from 'lucide-react';
import { useAdminSession } from '@/lib/hooks/useAdminSession';

interface SubpageNavHeaderProps {
  portalBackText?: string;
  portalBackHref?: string;
  adminReturnHref?: string;
  adminReturnText?: string;
  badgeText?: string;
  className?: string;
}

export function SubpageNavHeader({
  portalBackText = 'Voltar ao Portal',
  portalBackHref = '/',
  adminReturnHref = '/admin',
  adminReturnText = 'Painel Administrativo',
  badgeText = 'Canal Paroquial Oficial',
  className = '',
}: SubpageNavHeaderProps) {
  const { hasAdminSession, adminUser } = useAdminSession();

  const finalAdminRoute = adminUser?.role === 'coordenador_ceb' && adminUser?.community_id
    ? '/admin/comunidades'
    : adminReturnHref;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-[#C8A463]/15 ${className}`}>
      {/* Lado Esquerdo: Links de Navegação */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <Link 
          href={portalBackHref} 
          className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#FFCC36] transition-colors cursor-pointer py-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#C8A463]" />
          <span>{portalBackText}</span>
        </Link>

        {/* Botão de Retorno Direto ao Dashboard para Usuários Logados */}
        {hasAdminSession && (
          <Link
            href={finalAdminRoute}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-transparent hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer min-h-[36px]"
            title="Voltar ao Painel Administrativo"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>↩️ {adminReturnText}</span>
          </Link>
        )}
      </div>

      {/* Lado Direito: Selo Oficial */}
      {badgeText && (
        <span className="inline-flex items-center gap-1.5 text-amber-400/90 font-medium text-[11px] sm:text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{badgeText}</span>
        </span>
      )}
    </div>
  );
}
