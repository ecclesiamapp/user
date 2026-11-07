'use client';

import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Trash2, LogOut } from 'lucide-react';
import { ParishionerSession } from '@/types/parishioner';

interface MyPrivacyLGPDCardProps {
  session: ParishionerSession;
  onLogout: () => void;
}

export function MyPrivacyLGPDCard({ session, onLogout }: MyPrivacyLGPDCardProps) {
  const [confirmErasure, setConfirmErasure] = useState(false);

  return (
    <div className="p-5 rounded-3xl bg-[#1B1E22] border border-[#C8A463]/20 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFCC36]">
            Privacidade & LGPD (Art. 18)
          </h4>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-[var(--dash-surface)]/5 text-xs text-[#FAF6F0]/70 hover:text-[#FAF6F0] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair deste Dispositivo</span>
        </button>
      </div>

      <p className="text-[11px] text-[#FAF6F0]/70 leading-relaxed">
        Seus dados de contato (<strong>{session.name}</strong> •{' '}
        {session.phone || `Protocolo ${session.active_protocol}`}) são tratados exclusivamente para
        acolhimento pastoral na Catedral de Colatina.
      </p>

      {confirmErasure ? (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 space-y-2">
          <p>
            Deseja desconectar e limpar os dados salvos neste navegador conforme seu direito de
            eliminação (LGPD Art. 18)?
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
            >
              Sim, desconectar e limpar
            </button>
            <button
              type="button"
              onClick={() => setConfirmErasure(false)}
              className="px-3 py-1 rounded-lg bg-zinc-700 text-zinc-300 text-xs"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[11px] text-[#FAF6F0]/50 pt-1">
          <span>Controlador: Mitra Diocesana de Colatina</span>
          <button
            type="button"
            onClick={() => setConfirmErasure(true)}
            className="text-red-400/80 hover:text-red-300 underline cursor-pointer"
          >
            Exercer Direito de Esquecimento
          </button>
        </div>
      )}
    </div>
  );
}
