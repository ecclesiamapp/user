'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Clock, MapPin, Trash2, RefreshCw, Church } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Community, MassSchedule } from '@/types';
import { Button, Card, Badge, Input, Select, Modal } from '@/components/ui';

export default function HorariosAdminPage() {
  const [schedules, setSchedules] = useState<MassSchedule[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [dayOfWeek, setDayOfWeek] = useState<string>('Domingo');
  const [time, setTime] = useState<string>('07:00');
  const [type, setType] = useState<string>('missa');
  const [formCommunityId, setFormCommunityId] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar Comunidades
      const { data: comms } = await supabase
        .from('communities')
        .select('*')
        .order('is_headquarters', { ascending: false })
        .order('name');

      if (comms && comms.length > 0) {
        setCommunities(comms as Community[]);
        if (!formCommunityId) setFormCommunityId(comms[0].id);
      }

      // Carregar Horários
      let query = supabase.from('mass_schedules').select('*, community:communities(*)').order('time');
      if (selectedCommunityId !== 'all') {
        query = query.eq('community_id', selectedCommunityId);
      }
      const { data: scheds, error } = await query;

      if (!error && scheds && scheds.length > 0) {
        setSchedules(scheds as MassSchedule[]);
      } else {
        // Fallback para visualização padrão caso ainda não haja horários cadastrados
        setSchedules([
          {
            id: '1',
            parish_id: 'c0000000-0000-0000-0000-000000000001',
            community_id: comms?.[0]?.id || 'c0000000-0000-0000-0000-000000000011',
            day_of_week: 'Domingo',
            time: '07:00',
            type: 'missa',
            location_name: 'Igreja Matriz',
            description: 'Santa Missa Dominical',
            is_active: true,
          },
          {
            id: '2',
            parish_id: 'c0000000-0000-0000-0000-000000000001',
            community_id: comms?.[0]?.id || 'c0000000-0000-0000-0000-000000000011',
            day_of_week: 'Domingo',
            time: '09:00',
            type: 'missa',
            location_name: 'Igreja Matriz',
            description: 'Missa das Famílias e Crianças',
            is_active: true,
          },
          {
            id: '3',
            parish_id: 'c0000000-0000-0000-0000-000000000001',
            community_id: comms?.[1]?.id || 'c0000000-0000-0000-0000-000000000012',
            day_of_week: 'Domingo',
            time: '17:00',
            type: 'missa',
            location_name: 'Comunidade São Pedro e São Paulo',
            description: 'Missa Comunitária',
            is_active: true,
          },
          {
            id: '4',
            parish_id: 'c0000000-0000-0000-0000-000000000001',
            community_id: comms?.[0]?.id || 'c0000000-0000-0000-0000-000000000011',
            day_of_week: 'Quinta-feira',
            time: '15:00',
            type: 'confissao',
            location_name: 'Secretaria Paroquial',
            description: 'Atendimento de Confissões',
            is_active: true,
          },
        ]);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCommunityId]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCommunityId || !time) return;

    setSaving(true);
    try {
      const { data: parishes } = await supabase.from('parishes').select('id').limit(1);
      const parishId = parishes?.[0]?.id || 'c0000000-0000-0000-0000-000000000001';

      const newSchedule = {
        parish_id: parishId,
        community_id: formCommunityId,
        day_of_week: dayOfWeek,
        time,
        type,
        description: description.trim() || null,
        is_active: true,
      };

      const { error } = await supabase.from('mass_schedules').insert([newSchedule]);
      if (error) {
        alert('Aviso: ' + error.message);
      } else {
        setIsModalOpen(false);
        setDescription('');
        loadData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar';
      alert('Erro ao cadastrar horário: ' + msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--dash-text-primary)]">
            Horários de Missas e Celebrações
          </h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Organize a escala pastoral da Igreja Matriz e das CEBs para exibição imediata no portal do fiel.
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
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Adicionar Horário
          </Button>
        </div>
      </div>

      {/* Filtro por CEB / Comunidade */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Church className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--dash-text-secondary)]">
            Filtrar por Comunidade:
          </span>
        </div>

        <div className="w-full sm:w-72">
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
      </Card>

      {/* Lista de Horários */}
      <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-xs font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider flex justify-between items-center">
          <span>Celebrações Litúrgicas</span>
          <Badge variant="default">{schedules.length} Horários Ativos</Badge>
        </div>

        <div className="divide-y divide-[var(--dash-border)]">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--dash-surface-secondary)]/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-[var(--dash-text-primary)]">{schedule.day_of_week}</span>
                  <Badge variant="active" icon={<Clock className="w-3 h-3" />}>
                    {schedule.time}
                  </Badge>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] capitalize">
                    {schedule.type}
                  </span>
                </div>
                <p className="text-sm font-medium text-[var(--dash-text-primary)]">
                  {schedule.description || schedule.type}
                </p>
                <p className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                  {schedule.community?.name || schedule.location_name || 'Comunidade Paroquial'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-rose-500" />} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Criação de Horário */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Horário de Celebração"
        description="Selecione a comunidade e defina o dia e horário da Santa Missa ou ato pastoral."
      >
        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <Select
            label="Comunidade / Capela *"
            required
            value={formCommunityId}
            onChange={(e) => setFormCommunityId(e.target.value)}
          >
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.is_headquarters ? '⭐ ' : ''}{c.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Dia da Semana *"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
            >
              <option value="Domingo">Domingo</option>
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
            </Select>

            <Input
              label="Horário *"
              type="text"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Ex: 07:00 ou 19:30"
            />
          </div>

          <Select
            label="Tipo de Celebração *"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="missa">Santa Missa</option>
            <option value="confissao">Atendimento de Confissões</option>
            <option value="adoracao">Adoração ao Santíssimo</option>
            <option value="celebracao_palavra">Celebração da Palavra (Culto)</option>
            <option value="expediente">Expediente Paroquial</option>
          </Select>

          <Input
            label="Descrição / Detalhes (Opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Missa Solene com Bênção das Famílias"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--dash-border)]">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Salvar Horário
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
