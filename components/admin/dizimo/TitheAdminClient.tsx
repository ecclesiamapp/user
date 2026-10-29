'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Building2, 
  HelpCircle, 
  Settings, 
  Sparkles,
  Users
} from 'lucide-react';
import { Parish, TitheRegistration, TitheTransparencyItem, TitheFaq } from '@/types';
import { TitheRegistrationsTab } from './TitheRegistrationsTab';
import { TitheTransparencyTab } from './TitheTransparencyTab';
import { TitheFaqTab } from './TitheFaqTab';
import { TitheSettingsTab } from './TitheSettingsTab';
import { AdminRoleGuard } from '@/components/admin/auth/AdminRoleGuard';

interface TitheAdminClientProps {
  parish: Parish;
  registrations: TitheRegistration[];
  transparencyItems: TitheTransparencyItem[];
  faqs: TitheFaq[];
}

export function TitheAdminClient({
  parish,
  registrations,
  transparencyItems,
  faqs,
}: TitheAdminClientProps) {
  const [activeTab, setActiveTab] = useState<'cadastros' | 'transparencia' | 'faq' | 'configuracoes'>('cadastros');

  const pendingCount = registrations.filter((r) => r.status === 'pendente').length;

  return (
    <AdminRoleGuard
      allowedRoles={['superadmin', 'paroco', 'vigario', 'secretaria']}
      moduleName="a Pastoral do Dízimo • Sou do Sagrado"
    >
      <div className="space-y-6">
        {/* Cabeçalho da Página Administrativa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--dash-border)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#FFA82A] uppercase tracking-wider">
              Pastoral do Dízimo • Sou do Sagrado
            </span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1">
            Pastoral do Dízimo & Obras
          </h1>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] mt-1 font-sans">
            Acolha novas adesões pastorais (para lançamento oficial no Theòs), gerencie a prestação visual das obras da Catedral e configure a chave PIX direta da paróquia.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1E22]/10 dark:bg-[#FFA82A]/10 text-[#8B1E22] dark:text-[#FFA82A] text-xs font-bold">
          <HeartHandshake className="w-4 h-4" />
          <span>Secretaria Paroquial</span>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex items-center gap-2 border-b border-[var(--dash-border)] overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('cadastros')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeTab === 'cadastros'
              ? 'border-[#8B1E22] dark:border-[#FFA82A] text-[#8B1E22] dark:text-[#FFA82A]'
              : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Novos Dizimistas</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-mono font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('transparencia')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeTab === 'transparencia'
              ? 'border-[#8B1E22] dark:border-[#FFA82A] text-[#8B1E22] dark:text-[#FFA82A]'
              : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Onde o Dízimo Atua (Obras)</span>
          <span className="text-xs opacity-60">({transparencyItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeTab === 'faq'
              ? 'border-[#8B1E22] dark:border-[#FFA82A] text-[#8B1E22] dark:text-[#FFA82A]'
              : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Perguntas Frequentes (FAQ)</span>
          <span className="text-xs opacity-60">({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('configuracoes')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeTab === 'configuracoes'
              ? 'border-[#8B1E22] dark:border-[#FFA82A] text-[#8B1E22] dark:text-[#FFA82A]'
              : 'border-transparent text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Chave PIX da Mitra</span>
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div>
        {activeTab === 'cadastros' && (
          <TitheRegistrationsTab initialRegistrations={registrations} parishId={parish.id} />
        )}

        {activeTab === 'transparencia' && (
          <TitheTransparencyTab initialItems={transparencyItems} parishId={parish.id} />
        )}

        {activeTab === 'faq' && (
          <TitheFaqTab initialFaqs={faqs} parishId={parish.id} />
        )}

        {activeTab === 'configuracoes' && (
          <TitheSettingsTab parish={parish} />
        )}
      </div>
    </div>
  </AdminRoleGuard>
);
}
