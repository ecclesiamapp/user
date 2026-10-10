'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, RefreshCw, Church, CheckCircle2, Filter, Clock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Community, MassSchedule } from '@/types';
import { Button, Card, Badge, Select } from '@/components/ui';
import { ScheduleItem, ScheduleFormModal } from '@/components/admin/horarios';

function HorariosContent() {
  const searchParams = useSearchParams();
  const initialCommunityParam = searchParams.get('community_id') || 'all';

  const [schedules, setSchedules] = useState<MassSchedule[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(initialCommunityParam);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<MassSchedule | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [parishId, setParishId] = useState<string>('c0000000-0000-0000-0000-000000000001');

  const supabase = createClient();

  // Sincronizar com param da URL caso mude externamente
  useEffect(() => {
    const param = searchParams.get('community_id');
    if (param) {
      setSelectedCommunityId(param);
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Carregar Paróquia
      const { data: parishes } = await supabase.from('parishes').select('id').limit(1);
      if (parishes?.[0]?.id) {
        setParishId(parishes[0].id);
      }

      // 2. Carregar Comunidades
      const { data: comms } = await supabase
        .from('communities')
        .select('*')
        .order('is_headquarters', { ascending: false })
        .order('name');

      if (comms && comms.length > 0) {
        setCommunities(comms as Community[]);
      }

      // 3. Carregar Horários do Supabase
      const { data: scheds, error } = await supabase
        .from('mass_schedules')
        .select('*, community:communities(*)')
        .order('time');

      if (!error && scheds) {
        setSchedules(scheds as MassSchedule[]);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (schedule: MassSchedule) => {
    setScheduleToEdit(schedule);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setScheduleToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza de que deseja excluir este horário de celebração?')) return;

    setActionLoadingId(id);
    try {
      const { error } = await supabase.from('mass_schedules').delete().eq('id', id);
      if (error) throw error;

      setSchedules((prev) => prev.filter((s) => s.id !== id));
      setFeedbackMsg('Horário excluído com sucesso.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao excluir';
      alert('Erro ao excluir horário: ' + msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setActionLoadingId(id);
    try {
      const nextStatus = !currentStatus;
      const { error } = await supabase
        .from('mass_schedules')
        .update({ is_active: nextStatus })
        .eq('id', id);

      if (error) throw error;

      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: nextStatus } : s))
      );
      setFeedbackMsg('Status do horário atualizado com sucesso.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao alterar status';
      alert('Erro: ' + msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSuccess = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
    loadData();
  };

  // Filtragem combinada por Comunidade e Tipo
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchCommunity =
        selectedCommunityId === 'all' || s.community_id === selectedCommunityId;
      const matchType = selectedType === 'all' || s.type === selectedType;
      return matchCommunity && matchType;
    });
  }, [schedules, selectedCommunityId, selectedType]);

  const selectedCommunityName = useMemo(() => {
    if (selectedCommunityId === 'all') return 'Todas as Comunidades & Matriz';
    const found = communities.find((c) => c.id === selectedCommunityId);
    return found ? found.name : 'Comunidade Selecionada';
  }, [communities, selectedCommunityId]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text-primary)]">
              Horários de Missas e Celebrações
            </h1>
            <Badge variant="active">{filteredSchedules.length} Horários</Badge>
          </div>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Escala pastoral por comunidade: Santa Missa, Celebrações da Palavra, Adoração e Confissões.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            title="Recarregar"
            icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          />
          <Button variant="primary" onClick={handleNew} icon={<Plus className="w-4 h-4" />}>
            Adicionar Horário
          </Button>
        </div>
      </div>

      {/* Alerta de Feedback Temporário */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Barra de Filtros (Comunidade & Tipo Litúrgico) */}
      <Card className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--dash-text-secondary)] mb-1.5 flex items-center gap-1.5">
            <Church className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Filtrar por Comunidade (CEB):</span>
          </label>
          <Select
            value={selectedCommunityId}
            onChange={(e) => setSelectedCommunityId(e.target.value)}
          >
            <option value="all">Todas as Comunidades & Matriz</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.is_headquarters ? '⭐ ' : ''}{c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--dash-text-secondary)] mb-1.5 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Tipo de Celebração:</span>
          </label>
          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all">Todos os Tipos de Celebração</option>
            <option value="missa">Santa Missa</option>
            <option value="celebracao_palavra">Celebração da Palavra (Culto)</option>
            <option value="adoracao">Adoração ao Santíssimo</option>
            <option value="confissao">Atendimento de Confissões</option>
            <option value="expediente">Expediente Paroquial</option>
          </Select>
        </div>
      </Card>

      {/* Lista de Horários */}
      <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-xs font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Escala Litúrgica: {selectedCommunityName}</span>
          </div>
          <Badge variant="default">{filteredSchedules.length} Exibidos</Badge>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
            <p className="text-sm text-[var(--dash-text-secondary)]">Carregando escala litúrgica...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-semibold text-[var(--dash-text-primary)]">
              Nenhum horário encontrado para este filtro
            </p>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              Altere a comunidade selecionada ou clique em "Adicionar Horário" para cadastrar.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--dash-border)]">
            {filteredSchedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                isActionLoading={actionLoadingId === schedule.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Formulário (Criação e Edição) */}
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        scheduleToEdit={scheduleToEdit}
        communities={communities}
        initialCommunityId={selectedCommunityId}
        parishId={parishId}
      />
    </div>
  );
}

export default function HorariosAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--dash-text-secondary)]">Carregando horários...</p>
        </div>
      }
    >
      <HorariosContent />
    </Suspense>
  );
}
