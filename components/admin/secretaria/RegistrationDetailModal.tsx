'use client';

import React, { useState } from 'react';
import { SacramentalRegistration, RegistrationStatus } from '@/types';
import { Modal, Button, Badge, Select } from '@/components/ui';
import { 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  MessageCircle, 
  ShieldCheck, 
  Baby, 
  HeartHandshake, 
  Flame, 
  BookOpen, 
  Heart,
  Save,
  Clock
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface RegistrationDetailModalProps {
  registration: SacramentalRegistration | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: SacramentalRegistration) => void;
}

export function RegistrationDetailModal({
  registration,
  isOpen,
  onClose,
  onUpdated,
}: RegistrationDetailModalProps) {
  if (!registration) return null;

  const [status, setStatus] = useState<RegistrationStatus>(registration.status);
  const [internalNotes, setInternalNotes] = useState<string>(registration.internal_notes || '');
  const [saving, setSaving] = useState<boolean>(false);

  const supabase = createClient();
  const details = registration.details || {};

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        status,
        internal_notes: internalNotes.trim() || null,
        reviewed_by: 'Secretaria Paroquial',
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('sacramental_registrations')
        .update(payload)
        .eq('id', registration.id);

      if (error) {
        alert('Erro ao salvar alterações: ' + error.message);
      } else {
        onUpdated({ ...registration, ...payload });
        onClose();
      }
    } catch (err: any) {
      alert('Erro inesperado: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const cleanPhone = registration.applicant_phone.replace(/\D/g, '');
  const waAskDocs = encodeURIComponent(
    `Paz e Bem, ${registration.applicant_name}!\n\n` +
    `Aqui é da Secretaria da Catedral de Colatina referente à sua solicitação de inscrição para *${registration.sacrament_type.toUpperCase()}*.\n\n` +
    `Constatamos que restam documentos pendentes para a conclusão do processo. Por gentileza, nos envie foto legível ou compareça na secretaria com os documentos originais.\n\n` +
    `Ficamos à disposição!`
  );
  const waUrl = `https://wa.me/55${cleanPhone}?text=${waAskDocs}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalhes da Inscrição • Protocolo SAC-${registration.id.slice(0, 6).toUpperCase()}`}
    >
      <div className="space-y-5 text-xs sm:text-sm">
        {/* Status e Ação Rápida WhatsApp */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)]">
          <div className="space-y-1 w-full sm:w-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] block">
              Status Atual da Inscrição
            </span>
            <Select
              id="registration_status_modal"
              value={status}
              onChange={(e) => setStatus(e.target.value as RegistrationStatus)}
              className="text-xs"
            >
              <option value="pendente">Pendente</option>
              <option value="em_analise">Em Análise</option>
              <option value="documentacao_pendente">Documentação Pendente</option>
              <option value="aprovado">Aprovado (Vaga Garantida)</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </Select>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              type="button"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 min-h-[38px]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Solicitar Docs no WhatsApp</span>
            </Button>
          </a>
        </div>

        {/* Dados do Solicitante */}
        <div className="space-y-2 p-3.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[var(--primary)]" />
            Dados do Solicitante
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div><strong>Nome:</strong> {registration.applicant_name}</div>
            <div><strong>Parentesco/Papel:</strong> {registration.applicant_role || 'Próprio'}</div>
            <div><strong>Telefone:</strong> {registration.applicant_phone}</div>
            <div><strong>E-mail:</strong> {registration.applicant_email || 'Não informado'}</div>
          </div>
        </div>

        {/* Detalhes do Sacramento */}
        <div className="space-y-2.5 p-3.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[var(--primary)]" />
            Detalhes Específicos do Sacramento ({registration.sacrament_type.toUpperCase()})
          </span>

          {registration.candidate_name && (
            <div className="text-xs">
              <strong>Candidato(a):</strong> {registration.candidate_name}
              {registration.candidate_birth_date && ` (Nascimento: ${registration.candidate_birth_date})`}
            </div>
          )}

          {registration.preferred_date && (
            <div className="text-xs">
              <strong>Data Desejada:</strong> {registration.preferred_date}
            </div>
          )}

          {/* Batismo */}
          {registration.sacrament_type === 'batismo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-[var(--dash-border)]">
              <div><strong>Pai:</strong> {details.father_name || 'Não informado'}</div>
              <div><strong>Mãe:</strong> {details.mother_name || 'Não informado'}</div>
              <div><strong>Padrinho:</strong> {details.godfather_name || 'Não informado'}</div>
              <div><strong>Madrinha:</strong> {details.godmother_name || 'Não informado'}</div>
              <div><strong>Padrinhos Casados na Igreja:</strong> {details.godparents_church_marriage ? 'Sim' : 'Não'}</div>
              <div><strong>Padrinhos Crismados:</strong> {details.godparents_confirmed ? 'Sim' : 'Não'}</div>
              {details.preparation_course_date && (
                <div className="sm:col-span-2"><strong>Curso de Batismo:</strong> {details.preparation_course_date}</div>
              )}
            </div>
          )}

          {/* Noivos */}
          {registration.sacrament_type === 'noivos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-[var(--dash-border)]">
              <div><strong>Noivo:</strong> {details.groom_name} ({details.groom_phone})</div>
              <div><strong>Batismo do Noivo:</strong> {details.groom_parish || 'Não informado'}</div>
              <div><strong>Noiva:</strong> {details.bride_name} ({details.bride_phone})</div>
              <div><strong>Batismo da Noiva:</strong> {details.bride_parish || 'Não informado'}</div>
              {details.wedding_date && <div><strong>Data do Casamento:</strong> {details.wedding_date}</div>}
              {details.wedding_church && <div><strong>Local:</strong> {details.wedding_church}</div>}
            </div>
          )}

          {/* Catequese */}
          {(registration.sacrament_type === 'eucaristia' || registration.sacrament_type === 'crisma') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-[var(--dash-border)]">
              <div><strong>Etapa:</strong> {details.stage}</div>
              <div><strong>Já Batizado:</strong> {details.already_baptized ? 'Sim' : 'Não'}</div>
              {details.baptism_parish && <div><strong>Paróquia do Batismo:</strong> {details.baptism_parish}</div>}
              {details.school_grade && <div><strong>Série Escolar:</strong> {details.school_grade}</div>}
              {details.parent_name && <div><strong>Responsável:</strong> {details.parent_name} ({details.parent_phone})</div>}
            </div>
          )}

          {/* Gestantes */}
          {registration.sacrament_type === 'gestantes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-[var(--dash-border)]">
              <div><strong>Semanas:</strong> {details.gestational_weeks}</div>
              {details.expected_due_date && <div><strong>Previsão Parto:</strong> {details.expected_due_date}</div>}
              {details.companion_name && <div><strong>Acompanhante:</strong> {details.companion_name}</div>}
              <div><strong>Primeiro Filho:</strong> {details.first_child ? 'Sim' : 'Não'}</div>
            </div>
          )}
        </div>

        {/* Anotações Internas da Secretaria */}
        <div className="space-y-1.5">
          <label htmlFor="modal_internal_notes" className="block text-xs font-bold text-[var(--dash-text-primary)]">
            Anotações Internas da Secretaria (Livro Tombo, Validações, Pendências)
          </label>
          <textarea
            id="modal_internal_notes"
            rows={3}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Ex: Livro de Batizados nº 15, folha 42. Certidão apresentada em 12/10."
            className="w-full px-3 py-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-xs text-[var(--dash-text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] resize-none"
          />
        </div>

        {/* Rodapé do Modal */}
        <div className="flex justify-end gap-2 pt-3 border-t border-[var(--dash-border)]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl text-xs"
          >
            Fechar
          </Button>
          <Button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs rounded-xl flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Gravando...' : 'Salvar Alterações'}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
