'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
  ParishMovement,
  ParishMovementEvent,
  ParishMovementRegistration,
} from '@/types/movements';
import {
  FALLBACK_MOVEMENTS,
  FALLBACK_MOVEMENT_EVENTS,
  CATEDRAL_PARISH_ID,
} from '@/lib/movements';
import { MovementRegistrationsTab } from '@/components/admin/movements/MovementRegistrationsTab';
import { MovementEventsTab } from '@/components/admin/movements/MovementEventsTab';
import { MovementInfoTab } from '@/components/admin/movements/MovementInfoTab';

export default function AdminMovimentosPage() {
  const [activeTab, setActiveTab] = useState<'fichas' | 'encontros' | 'movimentos'>('fichas');
  const [loading, setLoading] = useState(true);
  const [movements, setMovements] = useState<ParishMovement[]>(FALLBACK_MOVEMENTS);
  const [events, setEvents] = useState<ParishMovementEvent[]>([]);
  const [registrations, setRegistrations] = useState<ParishMovementRegistration[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // 1. Movimentos
      const { data: movData } = await supabase
        .from('parish_movements')
        .select('*')
        .eq('parish_id', CATEDRAL_PARISH_ID)
        .order('order_index', { ascending: true });

      if (movData && movData.length > 0) {
        setMovements(movData as ParishMovement[]);
      } else {
        setMovements(FALLBACK_MOVEMENTS);
      }

      // 2. Eventos
      const { data: evData } = await supabase
        .from('parish_movement_events')
        .select('*')
        .eq('parish_id', CATEDRAL_PARISH_ID)
        .order('start_date', { ascending: true });

      if (evData && evData.length > 0) {
        setEvents(evData as ParishMovementEvent[]);
      } else {
        const fallbacks: ParishMovementEvent[] = [];
        Object.values(FALLBACK_MOVEMENT_EVENTS).forEach((list) => fallbacks.push(...list));
        setEvents(fallbacks);
      }

      // 3. Fichas de Inscrição
      const { data: regData } = await supabase
        .from('parish_movement_registrations')
        .select('*')
        .eq('parish_id', CATEDRAL_PARISH_ID)
        .order('created_at', { ascending: false });

      if (regData) {
        setRegistrations(regData as ParishMovementRegistration[]);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do módulo de movimentos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingCount = registrations.filter((r) => r.status === 'nova').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#1B1E22] border border-[#C8A463]/25 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B1E22] to-[#C8A463] flex items-center justify-center text-white shadow-lg shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] px-2 py-0.5 rounded-full bg-[#C8A463]/20 border border-[#C8A463]/40">
                Apostolado Leigo & Famílias
              </span>
              <span className="text-xs text-[#FAF6F0]/60">ECC • EAC • EJC</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6F0] mt-0.5">
              Movimentos Paroquiais
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#22262B] hover:bg-[#2A2E35] border border-[#C8A463]/30 text-xs font-semibold text-[#FAF6F0] transition-colors cursor-pointer shrink-0 min-h-[40px]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#C8A463]/20 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('fichas')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all min-h-[40px] cursor-pointer ${
            activeTab === 'fichas'
              ? 'bg-[#C8A463] text-[#2D1A16] shadow-md'
              : 'text-[#FAF6F0]/70 hover:text-[#FAF6F0] hover:bg-[var(--dash-surface)]/5'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Fichas de Interesse</span>
          {pendingCount > 0 && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'fichas' ? 'bg-[#8B1E22] text-white' : 'bg-amber-500 text-[var(--dash-text-primary)]'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('encontros')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all min-h-[40px] cursor-pointer ${
            activeTab === 'encontros'
              ? 'bg-[#C8A463] text-[#2D1A16] shadow-md'
              : 'text-[#FAF6F0]/70 hover:text-[#FAF6F0] hover:bg-[var(--dash-surface)]/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Encontros & Cronograma</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">
            {events.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('movimentos')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all min-h-[40px] cursor-pointer ${
            activeTab === 'movimentos'
              ? 'bg-[#C8A463] text-[#2D1A16] shadow-md'
              : 'text-[#FAF6F0]/70 hover:text-[#FAF6F0] hover:bg-[var(--dash-surface)]/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Dados dos Movimentos</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/20 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-[#FFCC36] animate-spin" />
          <span className="text-xs text-[#FAF6F0]/70">Carregando dados dos movimentos...</span>
        </div>
      ) : activeTab === 'fichas' ? (
        <MovementRegistrationsTab
          movements={movements}
          registrations={registrations}
          onReload={loadData}
        />
      ) : activeTab === 'encontros' ? (
        <MovementEventsTab movements={movements} events={events} onReload={loadData} />
      ) : (
        <MovementInfoTab movements={movements} onReload={loadData} />
      )}
    </div>
  );
}
