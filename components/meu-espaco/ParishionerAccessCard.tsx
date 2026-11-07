'use client';

import React, { useState } from 'react';
import {
  Phone,
  FileSearch,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  Church,
} from 'lucide-react';
import { ParishionerSession } from '@/types/parishioner';
import { setStoredParishionerSession } from '@/lib/parishioner-auth';

interface ParishionerAccessCardProps {
  onSuccess: (session: ParishionerSession) => void;
}

export function ParishionerAccessCard({ onSuccess }: ParishionerAccessCardProps) {
  const [accessMode, setAccessMode] = useState<'phone' | 'protocol'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [protocol, setProtocol] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhoneAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Por favor, informe seu telefone com DDD (WhatsApp).');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Por favor, informe como podemos lhe chamar.');
      return;
    }

    setLoading(true);
    try {
      const session: ParishionerSession = {
        phone: phone.trim(),
        name: name.trim(),
        authenticated_at: new Date().toISOString(),
        auth_type: 'otp_phone',
        favorite_community_id: 'c0000000-0000-0000-0000-000000000001',
        favorite_community_name: 'Catedral Sagrado Coração de Jesus (Sede)',
      };

      setStoredParishionerSession(session);
      onSuccess(session);
    } catch {
      setErrorMessage('Erro ao iniciar sessão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleProtocolAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!protocol.trim()) {
      setErrorMessage('Por favor, informe o código do seu protocolo.');
      return;
    }

    setLoading(true);
    try {
      const session: ParishionerSession = {
        phone: '',
        name: 'Fiel Paroquiano',
        authenticated_at: new Date().toISOString(),
        auth_type: 'protocol_direct',
        active_protocol: protocol.trim().toUpperCase(),
        favorite_community_id: 'c0000000-0000-0000-0000-000000000001',
        favorite_community_name: 'Catedral Sagrado Coração de Jesus (Sede)',
      };

      setStoredParishionerSession(session);
      onSuccess(session);
    } catch {
      setErrorMessage('Erro ao consultar protocolo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 sm:p-8 rounded-3xl bg-[#1B1E22] border border-[#C8A463]/30 shadow-2xl space-y-6 text-[#FAF6F0]">
      {/* Top Emblem & Title */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#8B1E22] via-[#C8A463] to-[#8B1E22] flex items-center justify-center text-[#FAF6F0] shadow-lg border border-[#FFCC36]/40">
          <Church className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A463]/15 text-[#FFCC36] border border-[#C8A463]/30 text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          Catedral de Colatina
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#FAF6F0]">
          Meu Espaço Paroquial
        </h2>
        <p className="text-xs text-[#FAF6F0]/70 max-w-sm mx-auto leading-relaxed">
          Acesse seus agendamentos com os sacerdotes, intenções de Santa Missa (Púlpito A4) e
          atividades da sua comunidade com total comodidade e sem senhas complicadas.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#121417] border border-[#C8A463]/20 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setAccessMode('phone');
            setErrorMessage(null);
          }}
          className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[40px] ${
            accessMode === 'phone'
              ? 'bg-[#C8A463] text-[#2D1A16] shadow-md'
              : 'text-[#FAF6F0]/70 hover:text-[#FAF6F0]'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Acesso via WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAccessMode('protocol');
            setErrorMessage(null);
          }}
          className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[40px] ${
            accessMode === 'protocol'
              ? 'bg-[#C8A463] text-[#2D1A16] shadow-md'
              : 'text-[#FAF6F0]/70 hover:text-[#FAF6F0]'
          }`}
        >
          <FileSearch className="w-3.5 h-3.5" />
          <span>Por Protocolo</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Mode 1: Phone / Name Access */}
      {accessMode === 'phone' ? (
        <form onSubmit={handlePhoneAccess} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
              Como gostaria de ser chamado(a)? *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maria de Fátima"
              className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
              Seu WhatsApp / Telefone *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(27) 99999-0000"
              className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
            />
            <span className="text-[10px] text-[#FAF6F0]/50 block mt-1">
              Usamos seu número apenas para localizar seus pedidos na Secretaria Paroquial.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8A463] to-[#FFCC36] hover:brightness-110 text-[#2D1A16] font-bold text-xs uppercase tracking-wider transition-all min-h-[44px] shadow-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Acessando...
              </>
            ) : (
              <>
                <span>Acessar Meu Espaço</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Mode 2: Protocol Access */
        <form onSubmit={handleProtocolAccess} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
              Código do Protocolo *
            </label>
            <input
              type="text"
              required
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              placeholder="Ex: INT-2026-ABCD ou número do comprovante"
              className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] px-3.5 py-2.5 uppercase font-mono tracking-wider focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
            />
            <span className="text-[10px] text-[#FAF6F0]/50 block mt-1">
              Enviado pela Secretaria ao registrar intenções ou agendamentos.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B1E22] via-[#C8A463] to-[#8B1E22] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all min-h-[44px] shadow-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Consultando...
              </>
            ) : (
              <>
                <span>Consultar Protocolo</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* LGPD Assurance Footer */}
      <div className="pt-3 border-t border-[#C8A463]/15 flex items-center justify-center gap-2 text-[11px] text-[#FAF6F0]/60 text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Ambiente seguro • Conformidade com a LGPD e sigilo pastoral.</span>
      </div>
    </div>
  );
}

