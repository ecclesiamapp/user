'use client';

import React, { useState, useEffect } from 'react';
import { Plus, User, ShieldCheck, Calendar, Clock, RefreshCw, Phone, Edit2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Clergy } from '@/types';
import { Button, Card, Badge, Input, Select, Modal } from '@/components/ui';

export function ClergyManagerTab() {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--dash-text-primary)]">
            Corpo Clerical da Paróquia
          </h2>
          <p className="text-xs text-[var(--dash-text-secondary)]">
            Sacerdotes ativos para agendamentos de confissão, direção espiritual e celebrações.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadClergy}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs rounded-xl"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Sacerdote
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-[var(--dash-text-secondary)]">
          Carregando informações do clero...
        </div>
      ) : clergyList.length === 0 ? (
        <Card className="p-8 text-center space-y-3 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)]">
          <User className="w-10 h-10 mx-auto text-[var(--dash-text-muted)] opacity-50" />
          <p className="text-sm text-[var(--dash-text-secondary)]">
            Nenhum sacerdote cadastrado no momento.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clergyList.map((priest) => (
            <Card
              key={priest.id}
              className="p-5 flex flex-col justify-between space-y-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--primary)]/40 transition-all shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-sm">
                    {priest.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <Badge variant={priest.role === 'paroco' ? 'matriz' : 'ceb'} className="text-[10px] uppercase font-bold">
                    {priest.role === 'paroco' ? 'Pároco' : 'Vigário'}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[var(--dash-text-primary)]">
                    {priest.name}
                  </h3>
                  <p className="text-xs text-[var(--primary)] font-medium mt-0.5">
                    {priest.title}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[var(--dash-border)]/60 text-xs text-[var(--dash-text-secondary)]">
                  {priest.office_hours && (
                    <div className="flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--dash-text-muted)] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{priest.office_hours}</span>
                    </div>
                  )}
                  {priest.birthday && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--dash-text-muted)] shrink-0" />
                      <span>Aniversário: {priest.birthday}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--dash-border)] flex items-center justify-between text-[11px] text-[var(--dash-text-muted)]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Ativo no portal
                </span>
                <span>#{priest.order_index}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Cadastro */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Novo Sacerdote"
      >
        <form onSubmit={handleCreatePriest} className="space-y-4">
          <Input
            id="priest_name"
            label="Nome Completo *"
            required
            placeholder="Ex: Padre Irineu Claudino Sales"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              id="priest_role"
              label="Função Canônica *"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="paroco">Pároco e Cura</option>
              <option value="vigario">Vigário Paroquial</option>
              <option value="diacono">Diácono Permanente</option>
            </Select>

            <Input
              id="priest_title"
              label="Título Honorífico"
              placeholder="Ex: Pároco e Cura da Catedral"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="priest_birthday"
              label="Data de Nascimento"
              placeholder="Ex: 15/08"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />

            <Input
              id="priest_ordination"
              label="Data de Ordenação"
              placeholder="Ex: 12/12/2010"
              value={ordinationDate}
              onChange={(e) => setOrdinationDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="priest_hours" className="block text-xs font-semibold text-[var(--dash-text-secondary)]">
              Horários de Atendimento na Secretaria
            </label>
            <textarea
              id="priest_hours"
              rows={2}
              value={officeHours}
              onChange={(e) => setOfficeHours(e.target.value)}
              placeholder="Ex: Terças e Quintas: 14h às 16h30"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--dash-border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[var(--primary)] text-white rounded-xl"
            >
              {saving ? 'Salvando...' : 'Salvar Sacerdote'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
