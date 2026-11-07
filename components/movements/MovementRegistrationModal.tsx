'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Send,
  Loader2,
  Users,
  Calendar,
  Phone,
  User,
  Heart,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import { ParishMovement, ParishMovementEvent } from '@/types/movements';
import { fallbackCommunities } from '@/lib/communities';
import { submitMovementRegistration } from '@/lib/movements';
import { MovementLegalTermsStep } from './MovementLegalTermsStep';

interface MovementRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  movement: ParishMovement;
  events: ParishMovementEvent[];
  selectedEventId?: string | null;
}

export function MovementRegistrationModal({
  isOpen,
  onClose,
  movement,
  events,
  selectedEventId,
}: MovementRegistrationModalProps) {
  // Stepper state: 1 = Termos Legais / LGPD; 2 = Formulário Cadastral
  const [step, setStep] = useState<1 | 2>(1);

  const [eventId, setEventId] = useState<string>(selectedEventId || (events[0]?.id || ''));
  const [applicantName, setApplicantName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [spouseOrGuardianName, setSpouseOrGuardianName] = useState('');
  const [spouseOrGuardianPhone, setSpouseOrGuardianPhone] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('casado_igreja');
  const [notes, setNotes] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isECC = movement.slug === 'ecc';
  const isEAC = movement.slug === 'eac';
  const isEJC = movement.slug === 'ejc';

  const handleAcceptLegalTerms = () => {
    setLgpdConsent(true);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!applicantName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Por favor, informe um telefone/WhatsApp de contato.');
      return;
    }

    if (!lgpdConsent) {
      setErrorMessage('É necessário declarar consentimento conforme a LGPD.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitMovementRegistration({
        parish_id: movement.parish_id,
        movement_id: movement.id,
        event_id: eventId || null,
        community_id: communityId || null,
        applicant_name: applicantName.trim(),
        applicant_birth_date: birthDate || null,
        applicant_phone: phone.trim(),
        applicant_email: email.trim() || null,
        applicant_address: address.trim() || null,
        applicant_neighborhood: neighborhood.trim() || null,
        spouse_or_guardian_name: spouseOrGuardianName.trim() || null,
        spouse_or_guardian_phone: spouseOrGuardianPhone.trim() || null,
        is_minor: isEAC,
        marital_status: isECC ? maritalStatus : null,
        notes: notes.trim() || null,
        lgpd_consent: true,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Ocorreu um erro ao enviar sua ficha. Tente novamente.');
      } else {
        setIsSuccess(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro na comunicação';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppNotify = () => {
    const text = encodeURIComponent(
      `Olá! Preenchi a ficha de manifestação de interesse para o *${movement.name} (${movement.acronym})* na Catedral de Colatina.\n\nNome: ${applicantName}\nContato: ${phone}`
    );
    window.open(`https://wa.me/5527999840001?text=${text}`, '_blank');
  };

  const handleCloseModal = () => {
    setStep(1);
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleCloseModal}
      />

      <div className="relative w-full max-w-2xl bg-[#16181B] border border-[#C8A463]/30 rounded-2xl shadow-2xl text-[#FAF6F0] z-10 overflow-hidden my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#C8A463]/20 bg-gradient-to-r from-[#22262B] to-[#16181B]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#C8A463]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] text-xs font-bold font-serif">
              {movement.acronym}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#FFCC36]">
                {step === 1 ? 'Segurança Jurídica & LGPD' : 'Ficha de Manifestação de Interesse'}
              </h3>
              <p className="text-xs text-[#FAF6F0]/70 font-sans">
                {movement.name} • Catedral de Colatina
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stepper Pill */}
            {!isSuccess && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B1E22] border border-[#C8A463]/30 text-[11px] font-bold">
                <span className={step === 1 ? 'text-[#FFCC36]' : 'text-[#FAF6F0]/50'}>
                  1. Termos
                </span>
                <span className="text-[#C8A463]/40">➔</span>
                <span className={step === 2 ? 'text-[#FFCC36]' : 'text-[#FAF6F0]/50'}>
                  2. Dados
                </span>
              </div>
            )}

            <button
              onClick={handleCloseModal}
              className="p-2 rounded-xl text-[#FAF6F0]/60 hover:text-[#FAF6F0] hover:bg-[var(--dash-surface)]/5 transition-colors cursor-pointer"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif font-bold text-[#FFCC36]">
                Ficha Registrada com Sucesso!
              </h4>
              <p className="text-sm text-[#FAF6F0]/80 max-w-md mx-auto leading-relaxed">
                Agradecemos pelo seu coração aberto! Os dados foram encaminhados com total
                sigilo pastoral para a coordenação do <strong>{movement.acronym}</strong> e para a
                Secretaria da Catedral de Colatina.
              </p>
              <div className="p-4 rounded-xl bg-[#22262B] border border-[#C8A463]/20 text-xs text-[#FAF6F0]/70 max-w-md mx-auto">
                <p>Nossa equipe pastoral entrará em contato em breve para os próximos passos.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleWhatsAppNotify}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4" />
                  Avisar Coordenação via WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#C8A463]/30 hover:bg-[var(--dash-surface)]/5 text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px]"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* ETAPA 1: TERMOS LEGAIS E LGPD */
            <MovementLegalTermsStep
              movement={movement}
              onAccept={handleAcceptLegalTerms}
              onCancel={handleCloseModal}
            />
          ) : (
            /* ETAPA 2: FORMULÁRIO CADASTRAL */
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
              {/* Selo Verde de Aceite Legal */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Consentimento LGPD registrado:</strong> Art. 11, II, «f» e sigilo pastoral ativo.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] underline hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                >
                  Rever Termos
                </button>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs leading-relaxed">
                  {errorMessage}
                </div>
              )}

              {/* Event selection if exists */}
              {events.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#FFCC36] uppercase tracking-wider mb-1.5">
                    Etapa / Encontro de Interesse
                  </label>
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="dash-select w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] pl-3.5 pr-10 py-2.5 focus:border-[#FFCC36] focus:outline-none"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.start_date.split('-').reverse().join('/')})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Applicant Name & Birth Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                    {isECC ? 'Nome do Esposo / Solicitante *' : isEAC ? 'Nome do Adolescente *' : 'Nome Completo *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(27) 99999-0000"
                    className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>

              {/* Specific fields for ECC or EAC */}
              {isECC && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#22262B]/70 border border-[#C8A463]/20">
                  <div>
                    <label className="block text-xs font-semibold text-[#FFCC36] mb-1">
                      Nome da Esposa *
                    </label>
                    <input
                      type="text"
                      value={spouseOrGuardianName}
                      onChange={(e) => setSpouseOrGuardianName(e.target.value)}
                      placeholder="Nome da esposa"
                      className="w-full rounded-xl border border-[#C8A463]/30 bg-[#16181B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#FFCC36] mb-1">
                      Situação Matrimonial
                    </label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      className="dash-select w-full rounded-xl border border-[#C8A463]/30 bg-[#16181B] text-sm text-[#FAF6F0] pl-3.5 pr-10 py-2.5 focus:border-[#FFCC36] focus:outline-none"
                    >
                      <option value="casado_igreja">Casados na Igreja Católica</option>
                      <option value="casado_civil">Casados no Civil</option>
                      <option value="uniao_estavel">União Estável</option>
                      <option value="outro">Outra situação</option>
                    </select>
                  </div>
                </div>
              )}

              {isEAC && (
                <div className="p-3.5 rounded-xl bg-[#22262B]/70 border border-[#C8A463]/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#FFCC36] font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Autorização dos Pais / Responsáveis (ECA Digital)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                        Nome do Pai, Mãe ou Responsável *
                      </label>
                      <input
                        type="text"
                        value={spouseOrGuardianName}
                        onChange={(e) => setSpouseOrGuardianName(e.target.value)}
                        placeholder="Nome do responsável legal"
                        className="w-full rounded-xl border border-[#C8A463]/30 bg-[#16181B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                        WhatsApp do Responsável *
                      </label>
                      <input
                        type="tel"
                        value={spouseOrGuardianPhone}
                        onChange={(e) => setSpouseOrGuardianPhone(e.target.value)}
                        placeholder="(27) 99999-0000"
                        className="w-full rounded-xl border border-[#C8A463]/30 bg-[#16181B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Neighborhood & CEB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                    Bairro / Cidade
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex: Centro / Colatina"
                    className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                    Sua Comunidade (CEB) de Origem
                  </label>
                  <select
                    value={communityId}
                    onChange={(e) => setCommunityId(e.target.value)}
                    className="dash-select w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] pl-3.5 pr-10 py-2.5 focus:border-[#FFCC36] focus:outline-none"
                  >
                    <option value="">Selecione (ou Catedral Sede)</option>
                    {Object.values(fallbackCommunities).map((comm) => (
                      <option key={comm.id} value={comm.id}>
                        {comm.name} ({comm.neighborhood})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-xs font-semibold text-[#FAF6F0]/90 mb-1">
                  Observações Pastorais ou Mensagem (opcional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alguma necessidade especial, restrição ou intenção para partilhar com a equipe..."
                  className="w-full rounded-xl border border-[#C8A463]/30 bg-[#22262B] text-sm text-[#FAF6F0] px-3.5 py-2.5 focus:border-[#FFCC36] focus:outline-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#C8A463]/20">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#C8A463]/30 hover:bg-[var(--dash-surface)]/5 text-xs font-bold uppercase tracking-wider transition-colors min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para Termos
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] via-[#C8A463] to-[#8B1E22] hover:brightness-110 text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando Ficha...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Ficha de Interesse
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
