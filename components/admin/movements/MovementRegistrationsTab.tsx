'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Phone,
  Mail,
  User,
  ShieldAlert,
  Loader2,
  MessageSquare,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';
import { ParishMovement, ParishMovementRegistration } from '@/types/movements';
import { createClient } from '@/utils/supabase/client';

interface MovementRegistrationsTabProps {
  movements: ParishMovement[];
  registrations: ParishMovementRegistration[];
  onReload: () => Promise<void>;
}

export function MovementRegistrationsTab({
  movements,
  registrations,
  onReload,
}: MovementRegistrationsTabProps) {
  const [selectedMovementSlug, setSelectedMovementSlug] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = registrations.filter((reg) => {
    if (selectedMovementSlug !== 'todos') {
      const mov = movements.find((m) => m.id === reg.movement_id);
      if (mov?.slug !== selectedMovementSlug) return false;
    }

    if (statusFilter !== 'todos' && reg.status !== statusFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = reg.applicant_name?.toLowerCase().includes(q);
      const matchPhone = reg.applicant_phone?.includes(q);
      const matchSpouse = reg.spouse_or_guardian_name?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchSpouse) return false;
    }

    return true;
  });

  const handleUpdateStatus = async (
    id: string,
    newStatus: ParishMovementRegistration['status']
  ) => {
    try {
      setUpdatingId(id);
      const supabase = createClient();
      const { error } = await supabase
        .from('parish_movement_registrations')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        setFeedback(`Erro ao atualizar status: ${error.message}`);
      } else {
        setFeedback(`Status atualizado para "${newStatus}" com sucesso!`);
        await onReload();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na conexão';
      setFeedback(`Erro: ${msg}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteLGPD = async (id: string) => {
    try {
      setUpdatingId(id);
      const supabase = createClient();
      const { error } = await supabase
        .from('parish_movement_registrations')
        .delete()
        .eq('id', id);

      if (error) {
        setFeedback(`Erro ao excluir: ${error.message}`);
      } else {
        setFeedback('Ficha eliminada definitivamente em cumprimento à LGPD (Art. 18).');
        setDeleteConfirmId(null);
        await onReload();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao excluir';
      setFeedback(`Erro: ${msg}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getMovementLabel = (movementId: string) => {
    const mov = movements.find((m) => m.id === movementId);
    return mov ? mov.acronym : 'Movimento';
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <div className="p-3.5 rounded-xl bg-[#22262B] border border-[#C8A463]/40 text-xs text-[#FAF6F0] flex items-center justify-between">
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-[#FFCC36] hover:underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/25">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FAF6F0]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, cônjuge, responsável ou telefone..."
            className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] pl-10 pr-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
          />
        </div>

        <div>
          <select
            value={selectedMovementSlug}
            onChange={(e) => setSelectedMovementSlug(e.target.value)}
            className="dash-select w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] pl-3.5 pr-10 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
          >
            <option value="todos">Todos os Movimentos</option>
            {movements.map((m) => (
              <option key={m.id} value={m.slug}>
                {m.acronym} — {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dash-select w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-xs text-[#FAF6F0] pl-3.5 pr-10 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[40px]"
          >
            <option value="todos">Todos os Status</option>
            <option value="nova">🟡 Novas (Pendentes)</option>
            <option value="em_contato">🔵 Em Contato</option>
            <option value="confirmada">🟢 Confirmadas</option>
            <option value="arquivada">⚪ Arquivadas</option>
          </select>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/20 text-center space-y-2">
            <p className="text-sm text-[#FAF6F0]/70">Nenhuma ficha encontrada para os filtros selecionados.</p>
            <p className="text-xs text-[#FAF6F0]/40">As manifestações enviadas no portal público aparecerão aqui em tempo real.</p>
          </div>
        ) : (
          filtered.map((reg) => {
            const movAcronym = getMovementLabel(reg.movement_id);
            const isDeleting = deleteConfirmId === reg.id;
            const isUpdating = updatingId === reg.id;

            return (
              <div
                key={reg.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#1B1E22] border border-[#C8A463]/20 hover:border-[#C8A463]/40 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#C8A463]/20 text-[#FFCC36] flex items-center justify-center text-xs font-serif font-black shrink-0">
                      {movAcronym}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#FAF6F0]">{reg.applicant_name}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#FAF6F0]/60">
                        <span>Tel: {reg.applicant_phone}</span>
                        {reg.applicant_neighborhood && <span>• {reg.applicant_neighborhood}</span>}
                        <span>• {new Date(reg.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        reg.status === 'nova'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : reg.status === 'em_contato'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : reg.status === 'confirmada'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-700/30 text-zinc-400 border border-zinc-600/30'
                      }`}
                    >
                      {reg.status === 'nova'
                        ? 'Nova Ficha'
                        : reg.status === 'em_contato'
                        ? 'Em Contato'
                        : reg.status === 'confirmada'
                        ? 'Confirmada'
                        : 'Arquivada'}
                    </span>
                  </div>
                </div>

                {/* Additional Info Box */}
                {(reg.spouse_or_guardian_name || reg.marital_status || reg.notes) && (
                  <div className="p-3 rounded-xl bg-[#16181B] border border-[#C8A463]/15 text-xs text-[#FAF6F0]/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {reg.spouse_or_guardian_name && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#FFCC36] block">
                          {reg.is_minor ? 'Pai / Responsável Legal:' : 'Cônjuge (Esposa/Esposo):'}
                        </span>
                        <span>
                          {reg.spouse_or_guardian_name}{' '}
                          {reg.spouse_or_guardian_phone && `(${reg.spouse_or_guardian_phone})`}
                        </span>
                      </div>
                    )}
                    {reg.marital_status && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#FFCC36] block">
                          Situação Matrimonial:
                        </span>
                        <span className="capitalize">{reg.marital_status.replace('_', ' ')}</span>
                      </div>
                    )}
                    {reg.notes && (
                      <div className="sm:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-[#FFCC36] block">
                          Observações:
                        </span>
                        <p className="italic text-[#FAF6F0]/70">{reg.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="pt-2 border-t border-[#C8A463]/15 flex flex-wrap items-center justify-between gap-2">
                  {/* WhatsApp Action */}
                  <a
                    href={`https://wa.me/${reg.applicant_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Olá ${reg.applicant_name}, recebemos sua ficha de manifestação de interesse para o ${movAcronym} na Catedral de Colatina!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors min-h-[36px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chamar no WhatsApp
                  </a>

                  {/* Status Change Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {reg.status !== 'em_contato' && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(reg.id, 'em_contato')}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors min-h-[36px] cursor-pointer"
                      >
                        Marcar Em Contato
                      </button>
                    )}

                    {reg.status !== 'confirmada' && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(reg.id, 'confirmada')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors min-h-[36px] cursor-pointer"
                      >
                        Confirmar Inscrição
                      </button>
                    )}

                    {reg.status !== 'arquivada' && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(reg.id, 'arquivada')}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 text-zinc-300 text-xs font-semibold transition-colors min-h-[36px] cursor-pointer"
                      >
                        Arquivar
                      </button>
                    )}

                    {/* LGPD Erasure Button */}
                    {isDeleting ? (
                      <div className="flex items-center gap-1 bg-red-950/60 p-1 rounded-lg border border-red-500/40">
                        <span className="text-[10px] text-red-200 px-1">Confirma exclusão LGPD?</span>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleDeleteLGPD(reg.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                        >
                          Sim
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-zinc-700 text-zinc-200 rounded text-[10px]"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(reg.id)}
                        title="Exercer Direito de Eliminação (LGPD Art. 18)"
                        className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

