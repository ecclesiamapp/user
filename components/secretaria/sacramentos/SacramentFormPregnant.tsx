'use client';

import React from 'react';
import { Input, Select } from '@/components/ui';
import { Community } from '@/types';

interface PregnantFormData {
  gestational_weeks: number | string;
  expected_due_date: string;
  companion_name: string;
  first_child: boolean;
  community_id: string;
  notes: string;
}

interface SacramentFormPregnantProps {
  data: PregnantFormData;
  onChange: (field: keyof PregnantFormData, value: any) => void;
  communities: Community[];
}

export function SacramentFormPregnant({
  data,
  onChange,
  communities,
}: SacramentFormPregnantProps) {
  return (
    <div className="space-y-4 pt-1">
      <div className="p-3 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 text-xs text-[var(--dash-text-secondary)]">
        <span className="font-bold text-[var(--dash-text-primary)]">Pastoral da Criança e da Família:</span> Curso de Gestantes voltado ao acolhimento da vida, preparação espiritual e cuidados nos primeiros dias do bebê.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Input
            id="pregnant_weeks"
            label="Semanas de Gestação (Aproximadas) *"
            type="number"
            min={1}
            max={42}
            required
            placeholder="Ex: 24"
            value={data.gestational_weeks}
            onChange={(e) => onChange('gestational_weeks', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="pregnant_due_date"
            label="Data Prevista do Parto (DPP)"
            type="date"
            value={data.expected_due_date}
            onChange={(e) => onChange('expected_due_date', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="pregnant_companion"
            label="Nome do(a) Acompanhante no Encontro"
            placeholder="Pai do bebê, avó ou familiar"
            value={data.companion_name}
            onChange={(e) => onChange('companion_name', e.target.value)}
          />
        </div>

        <div>
          <Select
            id="pregnant_community"
            label="Comunidade Paroquial de Referência"
            value={data.community_id}
            onChange={(e) => onChange('community_id', e.target.value)}
          >
            <option value="">Catedral (Matriz - Centro)</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.is_headquarters ? '(Matriz)' : ''}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[var(--dash-text-primary)]">
          <input
            type="checkbox"
            checked={data.first_child}
            onChange={(e) => onChange('first_child', e.target.checked)}
            className="rounded border-[var(--dash-border)] text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span>É a sua primeira gestação (primeiro filho)?</span>
        </label>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="pregnant_notes" className="block text-xs font-semibold text-[var(--dash-text-secondary)]">
          Observações ou Pedidos de Oração Especial (Opcional)
        </label>
        <textarea
          id="pregnant_notes"
          rows={2}
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Ex: Gravidez de risco / Desejo receber visita da Pastoral da Criança"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
        />
      </div>
    </div>
  );
}
