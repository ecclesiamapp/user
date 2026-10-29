'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  ExternalLink,
  Building2,
  Check,
  UserCheck
} from 'lucide-react';
import { TitheRegistration } from '@/types';
import { createClient } from '@/utils/supabase/client';

interface TitheRegistrationsTabProps {
  initialRegistrations: TitheRegistration[];
  parishId: string;
}

export function TitheRegistrationsTab({ initialRegistrations, parishId }: TitheRegistrationsTabProps) {
  const [registrations, setRegistrations] = useState<TitheRegistration[]>(initialRegistrations);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'cadastrado_theos'>('todos');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const handleUpdateStatus = async (id: string, newStatus: 'cadastrado_theos' | 'pendente') => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('tithe_registrations')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (!error) {
        setRegistrations((prev) =>
          prev.map((reg) => (reg.id === id ? { ...reg, status: newStatus } : reg))
        );
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = registrations.filter((reg) => {
    const matchesSearch =
      reg.full_name.toLowerCase().includes(search.toLowerCase()) ||
      reg.phone.includes(search) ||
      (reg.neighborhood && reg.neighborhood.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'todos' || reg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = registrations.filter((r) => r.status === 'pendente').length;
  const registeredCount = registrations.filter((r) => r.status === 'cadastrado_theos').length;

  const methodLabels: Record<string, string> = {
    pix: 'PIX Instantâneo',
    envelope: 'Envelope Mensal',
    transferencia: 'Transferência / TED',
    debito: 'Débito / Cartão',
    secretaria: 'Presencial',
  };

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider">
            Total de Adesões
          </span>
          <div className="text-2xl font-bold text-[var(--dash-text-primary)]">
            {registrations.length}
          </div>
          <p className="text-xs text-[var(--dash-text-secondary)]">Cadastrados pelo Portal Sou do Sagrado</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface)] border border-amber-500/30 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Pendentes no Theòs
          </span>
          <div className="text-2xl font-bold text-amber-500">
            {pendingCount}
          </div>
          <p className="text-xs text-[var(--dash-text-secondary)]">Aguardando lançamento no sistema oficial</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface)] border border-emerald-500/30 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
            Lançados no Theòs
          </span>
          <div className="text-2xl font-bold text-emerald-500">
            {registeredCount}
          </div>
          <p className="text-xs text-[var(--dash-text-secondary)]">Ficha gerada e envelopes preparados</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--dash-text-secondary)] absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou bairro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'todos'
                ? 'bg-[#8B1E22] dark:bg-[#FFA82A] text-white dark:text-[#2D1A16]'
                : 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            Todos ({registrations.length})
          </button>
          <button
            onClick={() => setStatusFilter('pendente')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'pendente'
                ? 'bg-amber-500 text-white'
                : 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            Pendentes ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('cadastrado_theos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'cadastrado_theos'
                ? 'bg-emerald-600 text-white'
                : 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]'
            }`}
          >
            No Theòs ({registeredCount})
          </button>
        </div>
      </div>

      {/* Lista de Dizimistas */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-2">
            <HeartHandshake className="w-10 h-10 text-[var(--dash-text-secondary)]/40 mx-auto" />
            <p className="text-sm font-semibold text-[var(--dash-text-primary)]">
              Nenhuma adesão encontrada
            </p>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              As adesões preenchidas no portal público aparecerão aqui automaticamente.
            </p>
          </div>
        ) : (
          filtered.map((reg) => {
            const cleanPhone = reg.phone.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/55${cleanPhone}?text=Olá,%20${encodeURIComponent(reg.full_name)}!%20Recebemos%20sua%20adesão%20como%20Dizimista%20da%20Catedral%20do%20Sagrado%20Coração%20de%20Jesus.%20Seja%20muito%20bem-vindo(a)!`;

            const isPending = reg.status === 'pendente';

            return (
              <div
                key={reg.id}
                className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] hover:border-[#FFA82A]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-cinzel text-base font-bold text-[var(--dash-text-primary)]">
                      {reg.full_name}
                    </span>

                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isPending
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {isPending ? <Clock className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                      <span>{isPending ? 'Pendente Theòs' : 'Lançado no Theòs'}</span>
                    </span>

                    <span className="text-xs text-[var(--dash-text-secondary)] font-mono">
                      (Dia {reg.preferred_day || 10})
                    </span>
                  </div>

                  {/* Detalhes de Contato e Frequência */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--dash-text-secondary)]">
                    <span className="flex items-center gap-1 text-[var(--dash-text-primary)] font-semibold">
                      <Phone className="w-3 h-3 text-[#FFA82A]" />
                      {reg.phone}
                    </span>

                    {reg.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[var(--dash-text-secondary)]" />
                        {reg.email}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[var(--dash-text-secondary)]" />
                      {reg.community?.name || 'Catedral Diocesana'}
                    </span>

                    <span className="text-xs bg-[var(--dash-surface-secondary)] px-2 py-0.5 rounded-md text-[var(--dash-text-secondary)]">
                      {methodLabels[reg.preferred_payment_method] || 'PIX'}
                    </span>

                    {reg.neighborhood && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--dash-text-secondary)]" />
                        {reg.neighborhood}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botões de Ação da Secretaria */}
                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                    title="Conversar no WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>

                  {isPending ? (
                    <button
                      onClick={() => handleUpdateStatus(reg.id, 'cadastrado_theos')}
                      disabled={updatingId === reg.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--dash-surface-secondary)] hover:bg-emerald-500/10 border border-[var(--dash-border)] hover:border-emerald-500/40 text-xs font-bold text-[var(--dash-text-primary)] hover:text-emerald-500 transition-all cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Lançar no Theòs</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(reg.id, 'pendente')}
                      disabled={updatingId === reg.id}
                      className="inline-flex items-center gap-1 text-[11px] text-[var(--dash-text-secondary)] hover:text-amber-500 transition-colors"
                      title="Voltar para pendente"
                    >
                      <span>Desmarcar Theòs</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
