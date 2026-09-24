import React from 'react';
import { Plus, Clock, MapPin, Trash2, Edit3 } from 'lucide-react';

export default function HorariosAdminPage() {
  const sampleSchedules = [
    { id: '1', day: 'Domingo', time: '07:00', type: 'Missa', location: 'Igreja Matriz' },
    { id: '2', day: 'Domingo', time: '09:00', type: 'Missa das Crianças', location: 'Igreja Matriz' },
    { id: '3', day: 'Domingo', time: '17:00', type: 'Missa', location: 'Comunidade Nossa Senhora Aparecida' },
    { id: '4', day: 'Domingo', time: '19:00', type: 'Missa Solene', location: 'Igreja Matriz' },
    { id: '5', day: 'Terça-feira', time: '19:30', type: 'Missa e Novena de N. Sra. do Perpétuo Socorro', location: 'Igreja Matriz' },
    { id: '6', day: 'Quinta-feira', time: '15:00 às 17:30', type: 'Confissões e Atendimento', location: 'Secretaria Paroquial' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Horários de Missas e Celebrações</h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Cadastre os horários fixos e sazonais para exibição imediata no portal do fiel.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          Adicionar Horário
        </button>
      </div>

      {/* Lista de Horários */}
      <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-xs font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider flex justify-between items-center">
          <span>Celebrações Cadastradas</span>
          <span>{sampleSchedules.length} Horários Ativos</span>
        </div>

        <div className="divide-y divide-[var(--dash-border)]">
          {sampleSchedules.map((schedule) => (
            <div key={schedule.id} className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--dash-surface-secondary)]/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm">{schedule.day}</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] font-semibold text-xs">
                    <Clock className="w-3 h-3" />
                    {schedule.time}
                  </span>
                </div>
                <p className="text-sm font-medium">{schedule.type}</p>
                <p className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {schedule.location}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button className="p-2 rounded-lg hover:bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] transition-colors" title="Editar">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors" title="Remover">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
