'use client';

import React, { useState, useEffect } from 'react';
import { Plus, User, ShieldCheck, Calendar, Sparkles, Clock, RefreshCw } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Clergy } from '@/types';
import { Button, Card, Badge, Input, Select, Modal } from '@/components/ui';

export default function AdminSecretariaPage() {
  const [clergyList, setClergyList] = useState<Clergy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<'paroco' | 'vigario' | 'diacono'>('vigario');
  const [title, setTitle] = useState('');
  const [birthday, setBirthday] = useState('');
  const [ordinationDate, setOrdinationDate] = useState('');
  const [officeHours, setOfficeHours] = useState('');

  const supabase = createClient();

  const loadClergy = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clergy')
        .select('*')
        .order('order_index');

      if (!error && data) {
        setClergyList(data as Clergy[]);
      }
    } catch (err) {
      console.warn('Erro ao carregar clero:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClergy();
  }, []);

  const handleCreatePriest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const { data: parishes } = await supabase.from('parishes').select('id').limit(1);
      const parishId = parishes?.[0]?.id || 'c0000000-0000-0000-0000-000000000001';

      const newPriest = {
        parish_id: parishId,
        name: name.trim(),
        role,
        title: title.trim() || (role === 'paroco' ? 'Pároco e Cura' : 'Vigário Paroquial'),
        birthday: birthday.trim() || null,
        ordination_date: ordinationDate.trim() || null,
        office_hours: officeHours.trim() || null,
        is_active: true,
        order_index: clergyList.length + 1,
      };

      const { error } = await supabase.from('clergy').insert([newPriest]);
      if (error) {
        alert('Aviso: ' + error.message);
      } else {
        setIsModalOpen(false);
        setName('');
        setTitle('');
        setBirthday('');
        setOrdinationDate('');
        setOfficeHours('');
        loadClergy();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar';
      alert('Erro ao cadastrar sacerdote: ' + msg);
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
            Clero & Secretaria Paroquial
          </h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gerencie os sacerdotes, expedientes de atendimento e informações pastorais oficiais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadClergy}
            title="Recarregar"
            icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          />
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Adicionar Sacerdote
          </Button>
        </div>
      </div>

      {/* Grid de Sacerdotes */}
      {loading ? (
        <Card className="flex flex-col items-center justify-center p-12 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--dash-text-secondary)]">Carregando dados do clero...</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {clergyList.map((priest) => (
            <Card
              key={priest.id}
              className={`flex flex-col justify-between space-y-4 ${
                priest.role === 'paroco'
                  ? 'border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'hover:border-[var(--primary)]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={priest.role === 'paroco' ? 'matriz' : 'ceb'}>
                    {priest.role === 'paroco' ? 'Pároco e Cura' : 'Vigário Paroquial'}
                  </Badge>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>

                <div>
                  <h3 className="font-bold text-base leading-snug">{priest.name}</h3>
                  <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">{priest.title}</p>
                </div>

                <div className="pt-2 border-t border-[var(--dash-border)] space-y-1.5 text-xs text-[var(--dash-text-secondary)]">
                  {priest.birthday && (
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>Aniversário: <strong>{priest.birthday}</strong></span>
                    </p>
                  )}
                  {priest.ordination_date && (
                    <p className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ordenação: <strong>{priest.ordination_date}</strong></span>
                    </p>
                  )}
                </div>
              </div>

              {priest.office_hours && (
                <div className="p-2.5 rounded-xl bg-[var(--dash-surface-secondary)] text-xs border border-[var(--dash-border)]">
                  <p className="font-semibold text-[var(--dash-text-primary)]">Atendimento:</p>
                  <p className="text-[var(--dash-text-secondary)] mt-0.5">{priest.office_hours}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Cadastro de Sacerdote */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Sacerdote"
        description="Preencha as informações canônicas e de atendimento pastoral do padre."
      >
        <form onSubmit={handleCreatePriest} className="space-y-4">
          <Input
            label="Nome Completo do Sacerdote *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Padre Irineu Claudino Sales"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Função Canônica *"
              value={role}
              onChange={(e) => setRole(e.target.value as 'paroco' | 'vigario' | 'diacono')}
            >
              <option value="paroco">Pároco / Cura da Catedral</option>
              <option value="vigario">Vigário Paroquial</option>
              <option value="diacono">Diácono Permanente</option>
            </Select>

            <Input
              label="Título Pastoral"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Pároco e Cura da Catedral"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Aniversário Natalício"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              placeholder="Ex: 24 de julho"
            />
            <Input
              label="Data de Ordenação Sacerdotal"
              value={ordinationDate}
              onChange={(e) => setOrdinationDate(e.target.value)}
              placeholder="Ex: 12 de agosto de 2017"
            />
          </div>

          <Input
            label="Horários de Atendimento e Confissão"
            value={officeHours}
            onChange={(e) => setOfficeHours(e.target.value)}
            placeholder="Ex: Terça e Quinta-feira: 14:30h às 16:30h"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--dash-border)]">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Salvar Sacerdote
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
