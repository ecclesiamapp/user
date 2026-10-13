'use client';

import React from 'react';
import { Input, Select } from '@/components/ui';
import { Community } from '@/types';

interface CatechesisFormData {
  candidate_name: string;
  candidate_birth_date: string;
  stage: 'eucaristia_infantil' | 'crisma_jovens' | 'crisma_adultos' | 'catequese_adultos';
  already_baptized: boolean;
  baptism_parish: string;
  school_grade: string;
  parent_name: string;
  parent_phone: string;
  community_id: string;
  notes: string;
}

interface SacramentFormCatechesisProps {
  data: CatechesisFormData;
  onChange: (field: keyof CatechesisFormData, value: any) => void;
  communities: Community[];
  isCrismaDefault?: boolean;
}

export function SacramentFormCatechesis({
  data,
  onChange,
  communities,
  isCrismaDefault = false,
}: SacramentFormCatechesisProps) {
  return (
    <div className="space-y-4 pt-1">
      <div className="p-3 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 text-xs text-[var(--dash-text-secondary)]">
        <span className="font-bold text-[var(--dash-text-primary)]">Iniciação à Vida Cristã:</span> Preencha os dados do catequizando. Se for menor de idade, informe também os dados dos responsáveis legais.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Select
            id="catechesis_stage"
            label="Etapa de Catequese *"
            value={data.stage}
            onChange={(e) => onChange('stage', e.target.value)}
          >
            <option value="eucaristia_infantil">1ª Eucaristia Infantil (a partir de 8/9 anos)</option>
            <option value="crisma_jovens">Crisma Jovens (a partir de 14 anos)</option>
            <option value="crisma_adultos">Crisma Adultos (acima de 18 anos)</option>
            <option value="catequese_adultos">Catecumenato de Adultos (Batismo + Eucaristia + Crisma)</option>
          </Select>
        </div>

        <div>
          <Select
            id="catechesis_community"
            label="Comunidade Onde Deseja Participar *"
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

        <div className="sm:col-span-2">
          <Input
            id="catechesis_candidate_name"
            label="Nome Completo do Catequizando / Crismando *"
            required
            placeholder="Nome completo do candidato"
            value={data.candidate_name}
            onChange={(e) => onChange('candidate_name', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="catechesis_birth_date"
            label="Data de Nascimento *"
            type="date"
            required
            value={data.candidate_birth_date}
            onChange={(e) => onChange('candidate_birth_date', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="catechesis_school_grade"
            label="Série Escolar / Ocupação (Opcional)"
            placeholder="Ex: 4º ano fundamental / Ensino Médio"
            value={data.school_grade}
            onChange={(e) => onChange('school_grade', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="catechesis_parent_name"
            label="Nome do Pai, Mãe ou Responsável"
            placeholder="Nome do responsável (se menor)"
            value={data.parent_name}
            onChange={(e) => onChange('parent_name', e.target.value)}
          />
        </div>

        <div>
          <Input
            id="catechesis_parent_phone"
            label="Telefone / WhatsApp do Responsável"
            placeholder="(27) 99999-9999"
            value={data.parent_phone}
            onChange={(e) => onChange('parent_phone', e.target.value)}
          />
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2.5">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[var(--dash-text-primary)]">
          <input
            type="checkbox"
            checked={data.already_baptized}
            onChange={(e) => onChange('already_baptized', e.target.checked)}
            className="rounded border-[var(--dash-border)] text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span>O catequizando já recebeu o Sacramento do Batismo?</span>
        </label>

        {data.already_baptized && (
          <div className="pt-1">
            <Input
              id="catechesis_baptism_parish"
              label="Paróquia onde foi batizado (Cidade/Estado)"
              placeholder="Ex: Catedral de Colatina ou Paróquia São Pedro - Vila Velha/ES"
              value={data.baptism_parish}
              onChange={(e) => onChange('baptism_parish', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="catechesis_notes" className="block text-xs font-semibold text-[var(--dash-text-secondary)]">
          Observações ou Necessidades Especiais (Opcional)
        </label>
        <textarea
          id="catechesis_notes"
          rows={2}
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Ex: Alergias, inclusão pedagógica ou disponibilidade de horários"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
        />
      </div>
    </div>
  );
}
