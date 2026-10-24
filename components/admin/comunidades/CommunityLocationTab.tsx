'use client';

import React from 'react';
import { MapPin, Phone, User, QrCode, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui';

interface CommunityLocationTabProps {
  address: string;
  setAddress: (val: string) => void;
  neighborhood: string;
  setNeighborhood: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  contactName: string;
  setContactName: (val: string) => void;
  contactPhone: string;
  setContactPhone: (val: string) => void;
  pixKey: string;
  setPixKey: (val: string) => void;
  pixKeyType: string;
  setPixKeyType: (val: string) => void;
  dizimoInfo: string;
  setDizimoInfo: (val: string) => void;
}

export function CommunityLocationTab({
  address,
  setAddress,
  neighborhood,
  setNeighborhood,
  city,
  setCity,
  state,
  setState,
  contactName,
  setContactName,
  contactPhone,
  setContactPhone,
  pixKey,
  setPixKey,
  pixKeyType,
  setPixKeyType,
  dizimoInfo,
  setDizimoInfo,
}: CommunityLocationTabProps) {
  return (
    <div className="space-y-5">
      {/* Endereço Físico */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] flex items-center gap-1.5 pb-2 border-b border-[var(--dash-border)]">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span>Localização do Templo & Rotas</span>
        </h4>

        <Input
          label="Endereço Completo (Rua, Número)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ex: Rua São Pedro, Nº 120"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Bairro ou Setor Rural"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Ex: Bairro Tropical"
          />

          <Input
            label="Cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Colatina"
          />

          <Input
            label="Estado (UF)"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="ES"
          />
        </div>
      </div>

      {/* Contato Geral */}
      <div className="space-y-4 pt-3 border-t border-[var(--dash-border)]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] flex items-center gap-1.5 pb-2 border-b border-[var(--dash-border)]">
          <User className="w-3.5 h-3.5 text-amber-500" />
          <span>Plantão & Contato Geral da Comunidade</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nome do Coordenador(a) Geral"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Ex: Maria Auxiliadora"
          />

          <Input
            label="WhatsApp / Telefone de Contato"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="(27) 99999-0000"
          />
        </div>
      </div>

      {/* Dízimo & Chave PIX Dedicada da CEB */}
      <div className="space-y-4 pt-3 border-t border-[var(--dash-border)]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] flex items-center gap-1.5 pb-2 border-b border-[var(--dash-border)]">
          <QrCode className="w-3.5 h-3.5 text-amber-500" />
          <span>Dízimo & Ofertas Comunitárias (PIX)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Chave PIX da Comunidade (Opcional)"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="Ex: 31.800.170/0001-92 ou e-mail"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
              Tipo de Chave
            </label>
            <select
              value={pixKeyType}
              onChange={(e) => setPixKeyType(e.target.value)}
              className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 text-xs focus:ring-2 focus:ring-[var(--primary)] outline-hidden"
            >
              <option value="cnpj">CNPJ Paroquial</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefone</option>
              <option value="random">Chave Aleatória</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
            Orientações sobre Dízimo e Manutenção Material
          </label>
          <textarea
            rows={2}
            value={dizimoInfo}
            onChange={(e) => setDizimoInfo(e.target.value)}
            placeholder="O dízimo pode ser entregue no plantão antes das celebrações ou via PIX..."
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:ring-2 focus:ring-[var(--primary)] outline-hidden resize-y"
          />
        </div>
      </div>
    </div>
  );
}
