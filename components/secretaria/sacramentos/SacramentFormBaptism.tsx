'use client';

import React from 'react';
import { Input, Select } from '@/components/ui';
import { Community } from '@/types';

interface BaptismFormData {
  candidate_name: string;
  candidate_birth_date: string;
  preferred_date: string;
  father_name: string;
  mother_name: string;
  godfather_name: string;
  godmother_name: string;
  godparents_church_marriage: boolean;
  godparents_confirmed: boolean;
  preparation_course_date: string;
  community_id: string;
  notes: string;
}

interface SacramentFormBaptismProps {
  data: BaptismFormData;
  onChange: (field: keyof BaptismFormData, value: any) => void;
  communities: Community[];
}

export function SacramentFormBaptism({
  data,
  onChange,
  communities,
}: SacramentFormBaptismProps) {
  return (
    <div className="space-y-4 pt-1">
      <div className="p-3 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 text-xs text-[var(--dash-text-secondary)]">
        <span className="font-bold text-[var(--dash-text-primary)]">Batismo da Criança:</span> Preencha com os dados exatos da Certidão de Nascimento da criança e dos futuros padrinhos.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <Input
            id="baptism_candidate_name"
            label="Nome Completo da Criança *"
            required
            placeholder="Nome conforme certidão de nascimento"
            value={data.candidate_name}
            onChange={(e) => onChange('candidate_name', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="baptism_candidate_birth_date"
            label="Data de Nascimento da Criança *"
            type="date"
            required
            value={data.candidate_birth_date}
            onChange={(e) => onChange('candidate_birth_date', e.target.value)}
          />
        </div>

        <div>
          <Select
            id="baptism_community"
            label="Comunidade Pretendida *"
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

        <div>
          <Input
            id="baptism_father_name"
            label="Nome Completo do Pai"
            placeholder="Nome do pai"
            value={data.father_name}
            onChange={(e) => onChange('father_name', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="baptism_mother_name"
            label="Nome Completo da Mãe *"
            required
            placeholder="Nome da mãe"
            value={data.mother_name}
            onChange={(e) => onChange('mother_name', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="baptism_godfather_name"
            label="Nome do Padrinho"
            placeholder="Nome do padrinho de batismo"
            value={data.godfather_name}
            onChange={(e) => onChange('godfather_name', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="baptism_godmother_name"
            label="Nome da Madrinha"
            placeholder="Nome da madrinha de batismo"
            value={data.godmother_name}
            onChange={(e) => onChange('godmother_name', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="baptism_preferred_date"
            label="Data Desejada para o Batizado"
            type="date"
            value={data.preferred_date}
            onChange={(e) => onChange('preferred_date', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="baptism_course_date"
            label="Curso de Batismo Realizado / Data"
            placeholder="Ex: Já realizado em Out/2026 ou Pretende fazer"
            value={data.preparation_course_date}
            onChange={(e) => onChange('preparation_course_date', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2 p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] block">
          Declaração Canônica dos Padrinhos
        </span>
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--dash-text-secondary)]">
          <input
            type="checkbox"
            checked={data.godparents_confirmed}
            onChange={(e) => onChange('godparents_confirmed', e.target.checked)}
            className="mt-0.5 rounded border-[var(--dash-border)] text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span>Os padrinhos declaram ter pelo menos 16 anos e terem recebido o Sacramento do Crisma.</span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--dash-text-secondary)]">
          <input
            type="checkbox"
            checked={data.godparents_church_marriage}
            onChange={(e) => onChange('godparents_church_marriage', e.target.checked)}
            className="mt-0.5 rounded border-[var(--dash-border)] text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span>Se casados, os padrinhos são casados na Igreja Católica Apostólica Romana.</span>
        </label>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="baptism_notes" className="block text-xs font-semibold text-[var(--dash-text-secondary)]">
          Observações para a Secretaria Paroquial (Opcional)
        </label>
        <textarea
          id="baptism_notes"
          rows={2}
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Ex: Padrinhos residem em outra paróquia / Dúvidas sobre o curso"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
        />
      </div>
    </div>
  );
}
