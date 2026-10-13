'use client';

import React, { useState } from 'react';
import { SacramentConfig } from './types';
import { Card, Badge } from '@/components/ui';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Building2
} from 'lucide-react';

interface SacramentRequirementsCardProps {
  config: SacramentConfig;
}

export function SacramentRequirementsCard({ config }: SacramentRequirementsCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <Card className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${config.accentColor}15`, color: config.accentColor }}
          >
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--dash-text-primary)]">
              Documentos & Orientações Canônicas
            </h4>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              {config.title} • Conforme Diretrizes da Diocese de Colatina
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-secondary)] transition-colors cursor-pointer"
          aria-label={isOpen ? 'Recolher detalhes' : 'Expandir detalhes'}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-[var(--dash-border)] space-y-4 animate-fade-in text-xs sm:text-sm">
          {/* Alerta de Faixa Etária / Pré-requisito */}
          {config.minAgeNotice && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed font-medium">
                <span className="font-bold">Atenção pastoral:</span> {config.minAgeNotice}
              </div>
            </div>
          )}

          {/* Checklist de Documentos */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Documentação Necessária (Original ou Cópia)
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {config.requiredDocuments.map((doc, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]/60 text-[var(--dash-text-primary)]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diretrizes Canônicas */}
          {config.canonicalGuidelines.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
                Critérios Pastorais Canônicos
              </span>
              <ul className="space-y-1 text-xs text-[var(--dash-text-secondary)] list-disc list-inside">
                {config.canonicalGuidelines.map((guide, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {guide}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-[11px] text-[var(--dash-text-muted)] bg-[var(--dash-surface-secondary)]/50 p-2.5 rounded-xl border border-[var(--dash-border)]/40 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>
              Você pode preencher a pré-inscrição agora e apresentar os documentos físicos na Secretaria da Catedral durante o atendimento presencial.
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
