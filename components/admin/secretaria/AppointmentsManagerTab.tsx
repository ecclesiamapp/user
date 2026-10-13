'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Search, 
  Filter,
  Check,
  AlertCircle,
  Building2,
  ChevronRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { PastoralAppointment, AppointmentStatus, Clergy } from '@/types';
import { Card, Badge, Button, Input, Select } from '@/components/ui';

export function AppointmentsManagerTab() {
  const [appointments, setAppointments] = useState<PastoralAppointment[]>([]);
  const [clergyList, setClergyList] = useState<Clergy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filtros
  const [filterClergyId, setFilterClergyId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Carregar clero
      const { data: clergyData } = await supabase
        .from('clergy')
        .select('*')
        .order('order_index');
      if (clergyData) setClergyList(clergyData);

      // 2. Carregar agendamentos
      const { data: appData, error } = await supabase
        .from('pastoral_appointments')
        .select(`
          *,
          clergy:clergy_id (*)
        `)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: true });

      if (!error && appData) {
        setAppointments(appData as PastoralAppointment[]);
      }
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      const updatePayload: Record<string, any> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === 'confirmado') {
        updatePayload.confirmed_at = new Date().toISOString();
        updatePayload.confirmed_by = 'Secretária Paroquial';
      }

      const { error } = await supabase
        .from('pastoral_appointments')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        alert('Erro ao atualizar status: ' + error.message);
      } else {
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, ...updatePayload, status: newStatus } : app
          )
        );
      }
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtragem
  const filteredAppointments = appointments.filter((app) => {
    if (filterClergyId !== 'all' && app.clergy_id !== filterClergyId) return false;
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.parishioner_name.toLowerCase().includes(q);
      const matchPhone = app.parishioner_phone.includes(q);
      if (!matchName && !matchPhone) return false;
    }
    return true;
  });

  // Métricas
  const countPending = appointments.filter((a) => a.status === 'pendente').length;
  const countConfirmed = appointments.filter((a) => a.status === 'confirmado').length;
  const countTotal = appointments.length;

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmado':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">Confirmado</Badge>;
      case 'concluido':
        return <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/30">Concluído</Badge>;
      case 'cancelado':
        return <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/30">Cancelado</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30">Pendente</Badge>;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'confissao': return 'Confissão Individual';
      case 'direcao_espiritual': return 'Direção Espiritual';
      case 'pastoral_escuta': return 'Pastoral da Escuta';
      default: return 'Atendimento Pastoral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
              Aguardando Confirmação
            </span>
            <div className="text-2xl font-black text-amber-500 mt-1">{countPending}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
              Confirmados
            </span>
            <div className="text-2xl font-black text-emerald-500 mt-1">{countConfirmed}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
              Total de Atendimentos
            </span>
            <div className="text-2xl font-black text-[var(--dash-text-primary)] mt-1">{countTotal}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[var(--dash-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            id="search_appointments"
            placeholder="Buscar por nome ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Select
            id="filter_clergy"
            value={filterClergyId}
            onChange={(e) => setFilterClergyId(e.target.value)}
            className="w-full sm:w-48 text-xs"
          >
            <option value="all">Todos os Padres</option>
            {clergyList.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>

          <Select
            id="filter_status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-36 text-xs"
          >
            <option value="all">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[var(--dash-text-secondary)]">
          Carregando solicitações de atendimento pastoral...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card className="p-12 text-center space-y-3 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)]">
          <Calendar className="w-10 h-10 mx-auto text-[var(--dash-text-muted)] opacity-40" />
          <h3 className="font-bold text-sm text-[var(--dash-text-primary)]">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] max-w-sm mx-auto">
            Não há solicitações correspondentes aos filtros selecionados.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((item) => {
            const priestName = item.clergy?.name || 'Padre a Definir';
            const cleanPhone = item.parishioner_phone.replace(/\D/g, '');
            const isUpdating = updatingId === item.id;

            const whatsappMessage = encodeURIComponent(
              `Paz e Bem, ${item.parishioner_name}! Aqui é da Secretaria da Catedral de Colatina.\n\n` +
              `Informamos sobre o seu agendamento de *${getTypeName(item.appointment_type)}* com o *${priestName}* marcado para o dia *${item.appointment_date}* às *${item.appointment_time}*.\n\n` +
              `Qualquer dúvida, estamos à disposição!`
            );
            const waLink = `https://wa.me/55${cleanPhone}?text=${whatsappMessage}`;

            return (
              <Card
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--dash-border-hover)] transition-all shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 font-bold text-sm">
                      <Clock className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
                          {item.parishioner_name}
                        </h4>
                        {getStatusBadge(item.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--dash-text-secondary)] mt-0.5">
                        <span className="font-semibold text-[var(--primary)]">
                          {getTypeName(item.appointment_type)}
                        </span>
                        <span>•</span>
                        <span>{priestName}</span>
                        <span>•</span>
                        <span className="font-mono">{item.appointment_date} às {item.appointment_time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas em 1 Clique */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 transition-colors text-xs font-semibold flex items-center gap-1.5"
                      title="Abrir WhatsApp com o fiel"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    {item.status === 'pendente' && (
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(item.id, 'confirmado')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl flex items-center gap-1 min-h-[36px]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmar</span>
                      </Button>
                    )}

                    {item.status === 'confirmado' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(item.id, 'concluido')}
                        className="text-xs rounded-xl text-blue-600 hover:bg-blue-500/10 border-blue-500/30 min-h-[36px]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Concluir</span>
                      </Button>
                    )}

                    {item.status !== 'cancelado' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(item.id, 'cancelado')}
                        className="text-xs text-rose-500 hover:bg-rose-500/10 rounded-xl min-h-[36px]"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Cancelar</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Notas / Observações */}
                {item.notes && (
                  <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]/60 text-xs text-[var(--dash-text-secondary)]">
                    <span className="font-bold text-[var(--dash-text-primary)]">Mensagem do Fiel: </span>
                    {item.notes}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
