'use client';

import React, { useState } from 'react';
import { Parish, Community, SacramentType, ApplicantRole } from '@/types';
import { SACRAMENTS_CONFIG } from './types';
import { SacramentSelector } from './SacramentSelector';
import { SacramentRequirementsCard } from './SacramentRequirementsCard';
import { SacramentFormBaptism } from './SacramentFormBaptism';
import { SacramentFormCatechesis } from './SacramentFormCatechesis';
import { SacramentFormMarriage } from './SacramentFormMarriage';
import { SacramentFormPregnant } from './SacramentFormPregnant';
import { SacramentSuccessCard } from './SacramentSuccessCard';
import { Card, Button, Input, Select } from '@/components/ui';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Send, User, Phone, Mail, HelpCircle } from 'lucide-react';

interface SacramentRegistrationContainerProps {
  parish: Parish;
  communities: Community[];
}

export function SacramentRegistrationContainer({
  parish,
  communities,
}: SacramentRegistrationContainerProps) {
  const supabase = createClient();

  const [selectedType, setSelectedType] = useState<SacramentType>('batismo');
  const [protocol, setProtocol] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dados do Solicitante (Contato principal da secretaria)
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantRole, setApplicantRole] = useState<ApplicantRole>('proprio');

  // Estado específico: Batismo
  const [baptismData, setBaptismData] = useState({
    candidate_name: '',
    candidate_birth_date: '',
    preferred_date: '',
    father_name: '',
    mother_name: '',
    godfather_name: '',
    godmother_name: '',
    godparents_church_marriage: true,
    godparents_confirmed: true,
    preparation_course_date: '',
    community_id: '',
    notes: '',
  });

  // Estado específico: Catequese / Crisma
  const [catechesisData, setCatechesisData] = useState<{
    candidate_name: string;
    candidate_birth_date: string;
    stage: 'eucaristia_infantil' | 'crisma_jovens' | 'crisma_adultos' | 'catequese_adultos';
    already_baptized: boolean;
    baptism_parish: string;
    school_grade: string;
    parent_name: string;
    parent_phone: string;
    community_id: string;
    notes: string;
  }>({
    candidate_name: '',
    candidate_birth_date: '',
    stage: 'eucaristia_infantil',
    already_baptized: true,
    baptism_parish: '',
    school_grade: '',
    parent_name: '',
    parent_phone: '',
    community_id: '',
    notes: '',
  });

  // Estado específico: Noivos / Matrimônio
  const [marriageData, setMarriageData] = useState({
    groom_name: '',
    groom_phone: '',
    groom_parish: '',
    bride_name: '',
    bride_phone: '',
    bride_parish: '',
    wedding_date: '',
    wedding_church: '',
    community_id: '',
    notes: '',
  });

  // Estado específico: Gestantes
  const [pregnantData, setPregnantData] = useState({
    gestational_weeks: '',
    expected_due_date: '',
    companion_name: '',
    first_child: true,
    community_id: '',
    notes: '',
  });

  // Reset para nova inscrição
  const handleNewRegistration = () => {
    setProtocol(null);
    setApplicantName('');
    setApplicantPhone('');
    setApplicantEmail('');
    setErrorMessage(null);
  };

  // Submit unificado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!applicantName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!applicantPhone.trim() || applicantPhone.length < 8) {
      setErrorMessage('Por favor, informe um telefone/WhatsApp válido com DDD.');
      return;
    }

    setIsSubmitting(true);

    try {
      let resolvedCommunityId: string | null = null;
      let resolvedCandidateName: string | null = null;
      let resolvedCandidateBirthDate: string | null = null;
      let resolvedPreferredDate: string | null = null;
      let resolvedDetails: Record<string, any> = {};
      let resolvedNotes: string | null = null;

      if (selectedType === 'batismo') {
        if (!baptismData.candidate_name.trim() || !baptismData.candidate_birth_date) {
          throw new Error('Informe o nome da criança e sua data de nascimento.');
        }
        resolvedCommunityId = baptismData.community_id || null;
        resolvedCandidateName = baptismData.candidate_name;
        resolvedCandidateBirthDate = baptismData.candidate_birth_date;
        resolvedPreferredDate = baptismData.preferred_date || null;
        resolvedNotes = baptismData.notes || null;
        resolvedDetails = {
          father_name: baptismData.father_name,
          mother_name: baptismData.mother_name,
          godfather_name: baptismData.godfather_name,
          godmother_name: baptismData.godmother_name,
          godparents_church_marriage: baptismData.godparents_church_marriage,
          godparents_confirmed: baptismData.godparents_confirmed,
          preparation_course_date: baptismData.preparation_course_date,
        };
      } else if (selectedType === 'eucaristia' || selectedType === 'crisma') {
        if (!catechesisData.candidate_name.trim() || !catechesisData.candidate_birth_date) {
          throw new Error('Informe o nome do catequizando e a data de nascimento.');
        }
        resolvedCommunityId = catechesisData.community_id || null;
        resolvedCandidateName = catechesisData.candidate_name;
        resolvedCandidateBirthDate = catechesisData.candidate_birth_date;
        resolvedNotes = catechesisData.notes || null;
        resolvedDetails = {
          stage: catechesisData.stage,
          already_baptized: catechesisData.already_baptized,
          baptism_parish: catechesisData.baptism_parish,
          school_grade: catechesisData.school_grade,
          parent_name: catechesisData.parent_name,
          parent_phone: catechesisData.parent_phone,
        };
      } else if (selectedType === 'noivos') {
        if (!marriageData.groom_name.trim() || !marriageData.bride_name.trim()) {
          throw new Error('Informe o nome completo de ambos os noivos.');
        }
        resolvedCommunityId = marriageData.community_id || null;
        resolvedCandidateName = `${marriageData.groom_name} & ${marriageData.bride_name}`;
        resolvedPreferredDate = marriageData.wedding_date || null;
        resolvedNotes = marriageData.notes || null;
        resolvedDetails = {
          groom_name: marriageData.groom_name,
          groom_phone: marriageData.groom_phone,
          groom_parish: marriageData.groom_parish,
          bride_name: marriageData.bride_name,
          bride_phone: marriageData.bride_phone,
          bride_parish: marriageData.bride_parish,
          wedding_date: marriageData.wedding_date,
          wedding_church: marriageData.wedding_church,
        };
      } else if (selectedType === 'gestantes') {
        resolvedCommunityId = pregnantData.community_id || null;
        resolvedCandidateName = applicantName;
        resolvedPreferredDate = pregnantData.expected_due_date || null;
        resolvedNotes = pregnantData.notes || null;
        resolvedDetails = {
          gestational_weeks: pregnantData.gestational_weeks,
          expected_due_date: pregnantData.expected_due_date,
          companion_name: pregnantData.companion_name,
          first_child: pregnantData.first_child,
        };
      }

      const { data: record, error } = await supabase
        .from('sacramental_registrations')
        .insert([
          {
            parish_id: parish.id,
            community_id: resolvedCommunityId,
            sacrament_type: selectedType,
            status: 'pendente',
            applicant_name: applicantName.trim(),
            applicant_phone: applicantPhone.trim(),
            applicant_email: applicantEmail.trim() || null,
            applicant_role: applicantRole,
            candidate_name: resolvedCandidateName,
            candidate_birth_date: resolvedCandidateBirthDate,
            preferred_date: resolvedPreferredDate,
            details: resolvedDetails,
            notes: resolvedNotes,
          },
        ])
        .select('id, created_at')
        .single();

      if (error) throw error;

      const generatedProtocol = `SAC-2026-${(record?.id || 'NOVO').slice(0, 6).toUpperCase()}`;

      // Disparo de Notificação Transacional (Resend & Secretaria)
      try {
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'sacrament',
            protocol: generatedProtocol,
            applicantName: applicantName.trim(),
            applicantPhone: applicantPhone.trim(),
            applicantEmail: applicantEmail.trim() || undefined,
            sacramentTitle: currentConfig?.title || 'Inscrição Sacramental',
            candidateName: resolvedCandidateName || undefined,
            communityName: targetCommunity?.name || undefined,
            preferredDate: resolvedPreferredDate || undefined,
            extraSummary: resolvedNotes || undefined,
          }),
        }).catch((notifErr) => {
          console.warn('Alerta silencioso de notificação:', notifErr);
        });
      } catch (e) {
        // Envio assíncrono não impede o sucesso
      }

      setProtocol(generatedProtocol);
    } catch (err: any) {
      console.error('Erro ao registrar inscrição sacramental:', err);
      setErrorMessage(err.message || 'Ocorreu um erro ao gravar sua inscrição. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentConfig = SACRAMENTS_CONFIG[selectedType];
  const targetCommunity = communities.find(
    (c) =>
      c.id ===
      (selectedType === 'batismo'
        ? baptismData.community_id
        : selectedType === 'eucaristia' || selectedType === 'crisma'
        ? catechesisData.community_id
        : selectedType === 'noivos'
        ? marriageData.community_id
        : pregnantData.community_id)
  );

  // Se sucesso, exibe o cartão com protocolo
  if (protocol) {
    return (
      <SacramentSuccessCard
        protocol={protocol}
        config={currentConfig}
        applicantName={applicantName}
        applicantPhone={applicantPhone}
        applicantEmail={applicantEmail.trim() || undefined}
        communityName={targetCommunity?.name}
        whatsappSecretaryNumber={parish.whatsapp_number || '552721025010'}
        parishAddress={parish.address || 'Praça Frei José, Nº 26, Centro - Edifício João Paulo II'}
        onNewRegistration={handleNewRegistration}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Seletor de Sacramento */}
      <SacramentSelector
        selectedType={selectedType}
        onSelect={(type) => {
          setSelectedType(type);
          if (type === 'crisma') {
            setCatechesisData((prev) => ({ ...prev, stage: 'crisma_jovens' }));
          } else if (type === 'eucaristia') {
            setCatechesisData((prev) => ({ ...prev, stage: 'eucaristia_infantil' }));
          }
        }}
      />

      {/* 2. Requisitos e Orientações Canônicas */}
      <SacramentRequirementsCard config={currentConfig} />

      {/* 3. Formulário de Inscrição */}
      <Card className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 sm:p-7 shadow-sm space-y-6">
        <div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--dash-text-primary)]">
            Formulário de Inscrição: {currentConfig.title}
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Preencha os campos abaixo para dar entrada na documentação junto à Secretaria Paroquial.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dados do Solicitante (Quem está preenchendo) */}
          <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[var(--primary)]" />
              Identificação do Solicitante (Contato para Avisos)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  id="applicant_name"
                  label="Seu Nome Completo *"
                  required
                  placeholder="Nome de quem está preenchendo"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                />
              </div>

              <div>
                <Select
                  id="applicant_role"
                  label="Parentesco / Papel *"
                  value={applicantRole}
                  onChange={(e) => setApplicantRole(e.target.value as ApplicantRole)}
                >
                  <option value="proprio">O próprio candidato</option>
                  <option value="mae">Mãe</option>
                  <option value="pai">Pai</option>
                  <option value="responsavel">Responsável Legal</option>
                  <option value="noivo">Noivo</option>
                  <option value="noiva">Noiva</option>
                  <option value="outro">Outro familiar</option>
                </Select>
              </div>

              <div>
                <Input
                  id="applicant_phone"
                  label="Seu WhatsApp com DDD *"
                  required
                  placeholder="(27) 99999-9999"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  id="applicant_email"
                  label="E-mail para Confirmação (Opcional)"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Subformulários Dinâmicos Conforme o Sacramento */}
          {selectedType === 'batismo' && (
            <SacramentFormBaptism
              data={baptismData}
              onChange={(field, val) => setBaptismData((prev) => ({ ...prev, [field]: val }))}
              communities={communities}
            />
          )}

          {(selectedType === 'eucaristia' || selectedType === 'crisma') && (
            <SacramentFormCatechesis
              data={catechesisData}
              onChange={(field, val) => setCatechesisData((prev) => ({ ...prev, [field]: val }))}
              communities={communities}
              isCrismaDefault={selectedType === 'crisma'}
            />
          )}

          {selectedType === 'noivos' && (
            <SacramentFormMarriage
              data={marriageData}
              onChange={(field, val) => setMarriageData((prev) => ({ ...prev, [field]: val }))}
              communities={communities}
            />
          )}

          {selectedType === 'gestantes' && (
            <SacramentFormPregnant
              data={pregnantData}
              onChange={(field, val) => setPregnantData((prev) => ({ ...prev, [field]: val }))}
              communities={communities}
            />
          )}

          {/* Feedback de Erro */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Botão de Envio */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[50px] font-bold text-sm bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md flex items-center justify-center gap-2 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando Inscrição ao Supabase...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Concluir e Gerar Protocolo de Inscrição</span>
                </>
              )}
            </Button>
            <p className="text-[11px] text-[var(--dash-text-muted)] text-center mt-2">
              Seus dados serão tratados com sigilo pastoral exclusivo da Catedral de Colatina.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
