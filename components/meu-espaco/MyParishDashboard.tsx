'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Church,
  Calendar,
  Heart,
  LogOut,
  RefreshCw,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { ParishionerSession } from '@/types/parishioner';
import { PastoralAppointment, MassIntention } from '@/types';
import {
  fetchParishionerAppointments,
  fetchParishionerIntentions,
  clearStoredParishionerSession,
} from '@/lib/parishioner-auth';
import { MyCommunityCard } from './MyCommunityCard';
import { MyAppointmentsSection } from './MyAppointmentsSection';
import { MyIntentionsSection } from './MyIntentionsSection';
import { MyTithePastoralCard } from './MyTithePastoralCard';
import { MyPrivacyLGPDCard } from './MyPrivacyLGPDCard';

interface MyParishDashboardProps {
  session: ParishionerSession;
  onLogout: () => void;
}

export function MyParishDashboard({ session, onLogout }: MyParishDashboardProps) {
  const [appointments, setAppointments] = useState<PastoralAppointment[]>([]);
  const [intentions, setIntentions] = useState<MassIntention[]>([]);
  const [loading, setLoading] = useState(true);

  const loadParishionerData = async () => {
    setLoading(true);
    try {
      const [aptData, intData] = await Promise.all([
        fetchParishionerAppointments(session.phone, session.active_protocol),
        fetchParishionerIntentions(session.phone, session.active_protocol),
      ]);
      setAppointments(aptData);
      setIntentions(intData);
    } catch (err) {
      console.error('Erro ao carregar dados do paroquiano:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParishionerData();
  }, [session.phone, session.active_protocol]);

  const handleLogout = () => {
    clearStoredParishionerSession();
    onLogout();
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#22262B] via-[#1B1E22] to-[#22262B] border border-[#C8A463]/30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B1E22] via-[#C8A463] to-[#8B1E22] flex items-center justify-center text-[#FAF6F0] shadow-md border border-[#FFCC36]/40 shrink-0">
            <Church className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] px-2 py-0.5 rounded-full bg-[#C8A463]/20 border border-[#C8A463]/30">
                Paroquiano Conectado
              </span>
              <span className="text-xs text-[#FAF6F0]/60">• Catedral de Colatina</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6F0] mt-0.5">
              A paz de Cristo, {session.name}!
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadParishionerData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#22262B] hover:bg-[#2A2E35] border border-[#C8A463]/30 text-xs font-semibold text-[#FAF6F0] transition-colors cursor-pointer min-h-[40px]"
            title="Atualizar Meus Dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 hover:bg-[var(--dash-surface)]/5 text-xs text-[#FAF6F0]/70 hover:text-[#FAF6F0] transition-colors cursor-pointer min-h-[40px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bento 1: Minha Comunidade (CEB Favorita) */}
        <MyCommunityCard currentCommunityId={session.favorite_community_id} />

        {/* Bento 2: Sou do Sagrado (Dimensão Pastoral do Dízimo) */}
        <MyTithePastoralCard />
      </div>

      {/* Bento 3: Meus Agendamentos com os Padres */}
      <MyAppointmentsSection
        appointments={appointments}
        onReload={loadParishionerData}
      />

      {/* Bento 4: Minhas Intenções de Santa Missa (Púlpito A4) */}
      <MyIntentionsSection intentions={intentions} />

      {/* Bento 5: Privacidade & LGPD */}
      <MyPrivacyLGPDCard session={session} onLogout={handleLogout} />
    </div>
  );
}
