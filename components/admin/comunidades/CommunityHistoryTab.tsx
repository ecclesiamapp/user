'use client';

import React from 'react';
import { BookOpen, Calendar, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui';

interface CommunityHistoryTabProps {
  foundationYear: string;
  setFoundationYear: (val: string) => void;
  feastDay: string;
  setFeastDay: (val: string) => void;
  history: string;
  setHistory: (val: string) => void;
  slug: string;
}

export function CommunityHistoryTab({
  foundationYear,
  setFoundationYear,
  feastDay,
  setFeastDay,
  history,
  setHistory,
  slug,
}: CommunityHistoryTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ano ou Época de Fundação"
          value={foundationYear}
          onChange={(e) => setFoundationYear(e.target.value)}
          placeholder="Ex: 1982 ou Década de 80"
        />

        <Input
          label="Data da Festa do Padroeiro"
          value={feastDay}
          onChange={(e) => setFeastDay(e.target.value)}
          placeholder="Ex: 19 de Março ou Último Domingo de Outubro"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)] flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>História, Pioneiros & Vocação Pastoral da CEB</span>
        </label>
        <textarea
          rows={7}
          value={history}
          onChange={(e) => setHistory(e.target.value)}
          placeholder="Conte a história da comunidade, como foram erguidos os templos, as famílias pioneiras, as festas tradicionais e os grupos de oração..."
          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:ring-2 focus:ring-[var(--primary)] outline-hidden resize-y"
        />
        <p className="text-[11px] text-[var(--dash-text-secondary)]">
          Este texto compõe a identidade histórica da comunidade e será apresentado na página dedicada do minisite (`/comunidades/{slug || '...'}`).
        </p>
      </div>
    </div>
  );
}
