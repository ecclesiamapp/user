'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Parish, UserRole } from '@/types';

interface EcclesiamAccessRequestFieldsProps {
  parishes: Parish[];
  selectedParishId: string;
  onSelectParishId: (id: string) => void;
  name: string;
  onChangeName: (v: string) => void;
  phone: string;
  onChangePhone: (v: string) => void;
  email: string;
  onChangeEmail: (v: string) => void;
  role: UserRole;
  onChangeRole: (r: UserRole) => void;
  communityHint: string;
  onChangeCommunityHint: (v: string) => void;
}

const inputStyle: React.CSSProperties = {
  backgroundColor: '#FCF7F1',
  borderColor: '#E8DFD3',
  color: '#2D1A16',
};

export function EcclesiamAccessRequestFields({
  parishes,
  selectedParishId,
  onSelectParishId,
  name,
  onChangeName,
  phone,
  onChangePhone,
  email,
  onChangeEmail,
  role,
  onChangeRole,
  communityHint,
  onChangeCommunityHint,
}: EcclesiamAccessRequestFieldsProps) {
  return (
    <>
      {parishes.length > 1 && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold block" style={{ color: '#2D1A16' }}>
            Paróquia Vinculada
          </label>
          <select
            value={selectedParishId}
            onChange={(e) => onSelectParishId(e.target.value)}
            className="dash-select w-full rounded-xl border pl-3.5 pr-10 py-2.5 text-xs min-h-[44px]"
            style={inputStyle}
          >
            {parishes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.city}/{p.state})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold block" style={{ color: '#2D1A16' }}>
            Nome Completo *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Ex: Maria do Carmo"
            className="w-full rounded-xl border px-3.5 py-2.5 text-xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/25"
            style={inputStyle}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold block" style={{ color: '#2D1A16' }}>
            WhatsApp de Contato *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="(27) 99999-0000"
            className="w-full rounded-xl border px-3.5 py-2.5 text-xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/25"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold block" style={{ color: '#2D1A16' }}>
          E-mail de Acesso *
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder="seu.email@paroquia.org.br"
          className="w-full rounded-xl border px-3.5 py-2.5 text-xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/25"
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold block" style={{ color: '#2D1A16' }}>
            Função / Pastoral *
          </label>
          <select
            value={role}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="dash-select w-full rounded-xl border pl-3.5 pr-10 py-2.5 text-xs min-h-[44px]"
            style={inputStyle}
          >
            <option value="coordenador_ceb">Coordenador(a) de Comunidade</option>
            <option value="pascom">Agente da PASCOM</option>
            <option value="secretaria">Secretaria Paroquial</option>
            <option value="vigario">Vigário Paroquial</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold block" style={{ color: '#2D1A16' }}>
            Comunidade / Setor (Opcional)
          </label>
          <input
            type="text"
            value={communityHint}
            onChange={(e) => onChangeCommunityHint(e.target.value)}
            placeholder="Ex: Comunidade São José"
            className="w-full rounded-xl border px-3.5 py-2.5 text-xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/25"
            style={inputStyle}
          />
        </div>
      </div>

      <div
        className="p-3 rounded-xl border flex items-center gap-2 text-[11px] font-medium"
        style={{
          backgroundColor: '#F5EFE7',
          borderColor: '#E8DFD3',
          color: '#514D4B',
        }}
      >
        <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#8B1E22' }} />
        <span>
          Por segurança, nenhuma conta possui acesso automático antes da validação da paróquia.
        </span>
      </div>
    </>
  );
}
