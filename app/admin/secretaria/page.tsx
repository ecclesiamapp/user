'use client';

import React, { useState } from 'react';
import { Calendar, FileText, Users, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { AppointmentsManagerTab } from '@/components/admin/secretaria/AppointmentsManagerTab';
import { SacramentsManagerTab } from '@/components/admin/secretaria/SacramentsManagerTab';
import { ClergyManagerTab } from '@/components/admin/secretaria/ClergyManagerTab';

type AdminTab = 'agendamentos' | 'inscricoes' | 'clero';

export default function AdminSecretariaPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('agendamentos');

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
              Módulo Secretaria On-line
            </span>
            <span className="text-xs text-[var(--dash-text-muted)]">• Diocese de Colatina</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text-primary)] mt-1">
            Gestão da Secretaria Paroquial
          </h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-0.5">
            Gerencie agendamentos pastorais com os padres, aprovações de inscrições sacramentais e o corpo clerical.
          </p>
        </div>
      </div>

      {/* Navegação por Sub-Abas */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('agendamentos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'agendamentos'
              ? 'bg-[var(--dash-surface)] text-[var(--primary)] shadow-xs border border-[var(--dash-border)]'
              : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Agendamentos com os Padres</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inscricoes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'inscricoes'
              ? 'bg-[var(--dash-surface)] text-[var(--primary)] shadow-xs border border-[var(--dash-border)]'
              : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Inscrições Sacramentais & Cursos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'clero'
              ? 'bg-[var(--dash-surface)] text-[var(--primary)] shadow-xs border border-[var(--dash-border)]'
              : 'text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-surface-hover)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Equipe do Clero & Expedientes</span>
        </button>
      </div>

      {/* Conteúdo Dinâmico da Aba Ativa */}
      {activeTab === 'agendamentos' && <AppointmentsManagerTab />}
      {activeTab === 'inscricoes' && <SacramentsManagerTab />}
      {activeTab === 'clero' && <ClergyManagerTab />}
    </div>
  );
}
