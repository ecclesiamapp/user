'use client';

import React from 'react';
import { Input, Select } from '@/components/ui';
import { Community } from '@/types';

interface MarriageFormData {
  groom_name: string;
  groom_phone: string;
  groom_parish: string;
  bride_name: string;
  bride_phone: string;
  bride_parish: string;
  wedding_date: string;
  wedding_church: string;
  community_id: string;
  notes: string;
}

interface SacramentFormMarriageProps {
  data: MarriageFormData;
  onChange: (field: keyof MarriageFormData, value: any) => void;
  communities: Community[];
}

export function SacramentFormMarriage({
  data,
  onChange,
  communities,
}: SacramentFormMarriageProps) {
  return (
    <div className="space-y-4 pt-1">
      <div className="p-3 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 text-xs text-[var(--dash-text-secondary)]">
        <span className="font-bold text-[var(--dash-text-primary)]">Encontro de Preparação para Noivos:</span> Preencha os dados de ambos os noivos para reserva de vaga no encontro e abertura preliminar do processo paroquial.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dados do Noivo */}
        <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-3">
          <span className="text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider block">
            Dados do Noivo
          </span>

          <Input
            id="marriage_groom_name"
            label="Nome Completo do Noivo *"
            required
            placeholder="Nome do noivo"
            value={data.groom_name}
            onChange={(e) => onChange('groom_name', e.target.value)}
          />

          <Input
            id="marriage_groom_phone"
            label="WhatsApp do Noivo *"
            required
            placeholder="(27) 99999-9999"
            value={data.groom_phone}
            onChange={(e) => onChange('groom_phone', e.target.value)}
          />

          <Input
            id="marriage_groom_parish"
            label="Paróquia onde o noivo foi batizado"
            placeholder="Ex: Catedral de Colatina ou Paróquia X"
            value={data.groom_parish}
            onChange={(e) => onChange('groom_parish', e.target.value)}
          />
        </div>

        {/* Dados da Noiva */}
        <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-3">
          <span className="text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider block">
            Dados da Noiva
          </span>

          <Input
            id="marriage_bride_name"
            label="Nome Completo da Noiva *"
            required
            placeholder="Nome da noiva"
            value={data.bride_name}
            onChange={(e) => onChange('bride_name', e.target.value)}
          />

          <Input
            id="marriage_bride_phone"
            label="WhatsApp da Noiva *"
            required
            placeholder="(27) 99999-9999"
            value={data.bride_phone}
            onChange={(e) => onChange('bride_phone', e.target.value)}
          />

          <Input
            id="marriage_bride_parish"
            label="Paróquia onde a noiva foi batizada"
            placeholder="Ex: Paróquia São Sebastião ou Paróquia Y"
            value={data.bride_parish}
            onChange={(e) => onChange('bride_parish', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Input
            id="marriage_wedding_date"
            label="Data Pretendida para o Casamento"
            type="date"
            value={data.wedding_date}
            onChange={(e) => onChange('wedding_date', e.target.value)}
          />
        </div>

        <div>
          <Select
            id="marriage_church"
            label="Igreja / Local da Celebração"
            value={data.community_id}
            onChange={(e) => onChange('community_id', e.target.value)}
          >
            <option value="">Catedral (Altar-Mor da Matriz)</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.is_headquarters ? '(Matriz)' : ''}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="marriage_notes" className="block text-xs font-semibold text-[var(--dash-text-secondary)]">
          Observações para a Pastoral Familiar (Opcional)
        </label>
        <textarea
          id="marriage_notes"
          rows={2}
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Ex: Já possuem casamento civil / Dúvidas sobre datas disponíveis de curso"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
        />
      </div>
    </div>
  );
}
