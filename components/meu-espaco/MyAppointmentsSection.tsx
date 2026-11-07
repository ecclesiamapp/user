'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  UserCheck,
  Plus,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  XCircle,
  Loader2,
} from 'lucide-react';
import { PastoralAppointment } from '@/types';
import { cancelParishionerAppointment } from '@/lib/parishioner-auth';

interface MyAppointmentsSectionProps {
  appointments: PastoralAppointment[];
  onReload?: () => Promise<void>;
}

export function MyAppointmentsSection({
  appointments,
  onReload,
}: MyAppointmentsSectionProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      const res = await cancelParishionerAppointment(id);
      if (res.success) {
        setFeedback('Agendamento cancelado com sucesso. A vaga foi liberada na agenda do sacerdote.');
        setConfirmId(null);
        await onReload?.();
      } else {
        setFeedback(`Erro ao cancelar: ${res.error || 'Tente novamente'}`);
      }
    } catch {
      setFeedback('Falha na comunicação.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: PastoralAppointment['status']) => {
    switch (status) {
      case 'confirmado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            Confirmado
          </span>
        );
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            Agendado / Pendente
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 text-[11px] line-through">
            Cancelado
          </span>
        );
      case 'concluido':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[11px]">
            Realizado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
            Em Análise
          </span>
        );
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#1B1E22] border border-[#C8A463]/25 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#8B1E22]/30 border border-[#8B1E22]/50 flex items-center justify-center text-[#FFCC36] shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC36] block">
              Atendimento com os Padres
            </span>
            <h3 className="text-base font-serif font-bold text-[#FAF6F0]">
              Meus Agendamentos Pastorais
            </h3>
          </div>
        </div>

        <Link
          href="/secretaria/agendamentos"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8A463]/15 hover:bg-[#C8A463]/25 border border-[#C8A463]/30 text-[#FFCC36] text-xs font-bold uppercase tracking-wider transition-all min-h-[38px] shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Agendamento</span>
        </Link>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-[#22262B] border border-[#C8A463]/40 text-xs text-[#FAF6F0] flex items-center justify-between">
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-[11px] text-[#FFCC36] hover:underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="p-6 rounded-2xl bg-[#16181B] border border-[#C8A463]/15 text-center space-y-2">
          <p className="text-xs text-[#FAF6F0]/70">
            Você ainda não possui atendimentos ou confissões agendados.
          </p>
          <Link
            href="/secretaria/agendamentos"
            className="inline-flex items-center gap-1 text-xs text-[#FFCC36] hover:underline font-bold"
          >
            <span>Ver horários dos 4 sacerdotes da Catedral</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => {
            const canCancel = apt.status === 'pendente' || apt.status === 'confirmado';
            const isConfirming = confirmId === apt.id;
            const isCancelling = cancellingId === apt.id;

            return (
              <div
                key={apt.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#16181B] border border-[#C8A463]/15 hover:border-[#C8A463]/35 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#FFCC36] block">
                      {apt.appointment_type === 'confissao'
                        ? 'Sacramento da Confissão'
                        : apt.appointment_type === 'direcao_espiritual'
                        ? 'Direção Espiritual'
                        : 'Atendimento Pastoral'}
                    </span>
                    <h4 className="text-sm font-bold text-[#FAF6F0]">
                      {apt.clergy?.name || 'Sacerdote da Catedral'}
                    </h4>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#FAF6F0]/75 pt-1 border-t border-[#C8A463]/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C8A463]" />
                    <span>
                      {apt.appointment_date.split('-').reverse().join('/')} às {apt.appointment_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C8A463]" />
                    <span>Secretaria da Catedral / Centro Pastoral</span>
                  </div>
                </div>

                {/* Cancel Action if applicable */}
                {canCancel && (
                  <div className="pt-2 border-t border-[#C8A463]/10 flex items-center justify-end">
                    {isConfirming ? (
                      <div className="flex items-center gap-2 bg-red-950/40 p-1.5 rounded-xl border border-red-500/30 text-xs">
                        <span className="text-[11px] text-red-200">Liberar vaga para outro fiel?</span>
                        <button
                          type="button"
                          disabled={isCancelling}
                          onClick={() => handleCancel(apt.id)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
                        >
                          {isCancelling ? 'Cancelando...' : 'Confirmar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded-lg text-xs"
                        >
                          Voltar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmId(apt.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-red-400/80 hover:text-red-300 underline cursor-pointer"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Não poderei comparecer (cancelar agendamento)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
