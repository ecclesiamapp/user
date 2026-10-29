'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ArrowRight, X, ChevronUp, ChevronDown, UserCheck } from 'lucide-react';
import { useAdminSession } from '@/lib/hooks/useAdminSession';

const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Super Administrador',
  paroco: 'Pároco & Cura',
  vigario: 'Vigário Paroquial',
  secretaria: 'Secretaria Paroquial',
  coordenador_ceb: 'Coordenador de Comunidade',
  pascom: 'Comunicação (PASCOM)',
  tesoureiro: 'Tesoureiro Paroquial',
  admin: 'Administrador',
};

export function AdminGlobalFloatingReturnBar() {
  const pathname = usePathname();
  const { hasAdminSession, adminUser, clearAdminSession } = useAdminSession();
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Não renderizar se estiver dentro de qualquer rota do dashboard administrativo
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Não renderizar se não houver usuário logado ou sessão administrativa ativa
  if (!hasAdminSession || isDismissed) {
    return null;
  }

  const roleLabel = adminUser?.role ? ROLE_LABELS[adminUser.role] || adminUser.role : 'Usuário Paroquial';
  const targetAdminRoute = adminUser?.role === 'coordenador_ceb' && adminUser?.community_id
    ? '/admin/comunidades'
    : '/admin';

  // Modo Minimizado: Apenas um Pill Flutuante Compacto
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 print:hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#16181B]/95 hover:bg-[#25282E] text-white border border-[#C8A463]/60 shadow-2xl backdrop-blur-xl cursor-pointer min-h-[44px] transition-all hover:scale-105"
          title="Abrir barra de retorno ao painel administrativo"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <ShieldCheck className="w-4 h-4 text-[#FFCC36]" />
          <span className="text-xs font-bold text-white group-hover:text-[#FFCC36] transition-colors">
            Painel Admin
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-[#C8A463]" />
        </button>
      </div>
    );
  }

  // Modo Completo: Dock de Apoio Notável
  return (
    <aside 
      aria-label="Barra de Navegação Rápida ao Dashboard Administrativo"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 print:hidden animate-in slide-in-from-bottom-5 duration-300 max-w-md"
    >
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#16181B]/95 backdrop-blur-xl border border-[#C8A463]/50 shadow-2xl shadow-black/80 text-white flex flex-col gap-3">
        {/* Topo do Card Flutuante */}
        <div className="flex items-center justify-between gap-3 border-b border-[#C8A463]/15 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#2D1A16] border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A463] truncate">
                  Sessão Administrativa Ativa
                </span>
              </div>
              <p className="text-xs font-semibold text-white/95 truncate">
                {adminUser?.name || 'Administrador'} • <span className="text-amber-400/90 font-normal">{roleLabel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Minimizar */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-[var(--dash-surface)]/10 transition-colors cursor-pointer"
              title="Minimizar barra"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {/* Fechar/Ocultar nesta sessão */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Ocultar nesta página"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rodapé com Botão Principal de Retorno */}
        <div className="flex items-center gap-2">
          <Link
            href={targetAdminRoute}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFA82A] via-[#FFCC36] to-[#FFA82A] hover:brightness-105 text-[#2D1A16] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-[#FFA82A]/20 cursor-pointer min-h-[44px]"
          >
            <span>↩️ Voltar ao Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#2D1A16]" />
          </Link>

          <button
            type="button"
            onClick={clearAdminSession}
            className="px-3 py-2.5 rounded-xl bg-[var(--dash-surface)]/5 hover:bg-rose-500/20 hover:text-rose-300 text-white/70 border border-white/10 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
            title="Encerrar sessão administrativa neste navegador"
          >
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
