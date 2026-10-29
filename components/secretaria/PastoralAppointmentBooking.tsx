'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Compass, 
  Users, 
  Church, 
  Clock, 
  Calendar, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Check,
  ShieldCheck,
  Info
} from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '@/components/ui';
import { Clergy, Parish, Community, AppointmentType } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { AppointmentSuccessCard } from './AppointmentSuccessCard';

interface PastoralAppointmentBookingProps {
  parish: Parish;
  clergyList: Clergy[];
  communities: Community[];
}

interface AppointmentTypeOption {
  type: AppointmentType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  durationMinutes: number;
}

const APPOINTMENT_OPTIONS: AppointmentTypeOption[] = [
  {
    type: 'confissao',
    title: 'Confissão Individual',
    subtitle: 'Sacramento da Reconciliação no confessionário da Catedral',
    icon: Heart,
    badge: 'Sacramento',
    durationMinutes: 20,
  },
  {
    type: 'direcao_espiritual',
    title: 'Direção Espiritual',
    subtitle: 'Acompanhamento e discernimento vocacional/pessoal',
    icon: Compass,
    badge: 'Pastoral',
    durationMinutes: 30,
  },
  {
    type: 'pastoral_escuta',
    title: 'Pastoral da Escuta',
    subtitle: 'Acolhimento fraterno e diálogo com agentes preparados',
    icon: Users,
    badge: 'Acolhida',
    durationMinutes: 30,
  },
  {
    type: 'atendimento_padre',
    title: 'Atendimento Geral com o Padre',
    subtitle: 'Bênção de família, conversas canônicas e certidões',
    icon: Church,
    badge: 'Expediente',
    durationMinutes: 30,
  },
];

const AVAILABLE_TIMES = [
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export function PastoralAppointmentBooking({
  parish,
  clergyList,
  communities,
}: PastoralAppointmentBookingProps) {
  const supabase = createClient();

  // Etapas do fluxo: 1: Tipo | 2: Sacerdote | 3: Data/Hora | 4: Dados
  const [step, setStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<AppointmentType>('confissao');
  const [selectedClergyId, setSelectedClergyId] = useState<string | null>(null);
  
  // Data e Horário
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Dados do Fiel
  const [parishionerName, setParishionerName] = useState<string>('');
  const [parishionerPhone, setParishionerPhone] = useState<string>('');
  const [parishionerEmail, setParishionerEmail] = useState<string>('');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Status de Submissão
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successProtocol, setSuccessProtocol] = useState<string | null>(null);

  // Geração dos próximos 12 dias úteis (Segunda a Sábado)
  const availableDates = React.useMemo(() => {
    const dates: { dateStr: string; label: string; weekday: string }[] = [];
    const today = new Date();
    let current = new Date(today);
    current.setDate(current.getDate() + 1); // A partir de amanhã

    while (dates.length < 10) {
      const day = current.getDay();
      // Ignorar Domingos (dia litúrgico de celebração de missas)
      if (day !== 0) {
        const yyyy = current.getFullYear();
        const mm = String(current.getMonth() + 1).padStart(2, '0');
        const dd = String(current.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        
        const weekdays = ['Dom', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        dates.push({
          dateStr,
          label: `${dd}/${mm}`,
          weekday: weekdays[day],
        });
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, []);

  // Selecionar primeira data por padrão
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].dateStr);
    }
  }, [availableDates, selectedDate]);

  // Buscar slots ocupados ao mudar data ou sacerdote
  useEffect(() => {
    async function fetchBookedSlots() {
      if (!selectedDate) return;
      setLoadingSlots(true);
      try {
        let query = supabase
          .from('pastoral_appointments')
          .select('appointment_time')
          .eq('parish_id', parish.id)
          .eq('appointment_date', selectedDate)
          .in('status', ['pendente', 'confirmado']);

        if (selectedClergyId) {
          query = query.eq('clergy_id', selectedClergyId);
        }

        const { data, error } = await query;
        if (!error && data) {
          setBookedTimes(data.map((item: { appointment_time: string }) => item.appointment_time));
        } else {
          setBookedTimes([]);
        }
      } catch (err) {
        console.error('Erro ao consultar slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchBookedSlots();
  }, [selectedDate, selectedClergyId, parish.id, supabase]);

  const selectedPriest = clergyList.find((c) => c.id === selectedClergyId);
  const selectedTypeObj = APPOINTMENT_OPTIONS.find((t) => t.type === selectedType);
  const selectedCommunity = communities.find((c) => c.id === selectedCommunityId);

  // Formatação de telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 6) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    }
    setParishionerPhone(val);
  };

  // Submissão do Agendamento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parishionerName.trim() || parishionerPhone.length < 14) {
      setErrorMessage('Por favor, informe seu nome completo e telefone WhatsApp válido.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      setErrorMessage('Por favor, escolha uma data e horário para o atendimento.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const generatedProtocol = `AG-${new Date().getFullYear().toString().slice(-2)}${String(
        Math.floor(1000 + Math.random() * 9000)
      )}`;

      const { error } = await supabase.from('pastoral_appointments').insert({
        parish_id: parish.id,
        clergy_id: selectedClergyId || null,
        community_id: selectedCommunityId || null,
        parishioner_name: parishionerName.trim(),
        parishioner_phone: parishionerPhone.trim(),
        parishioner_email: parishionerEmail.trim() || null,
        community_name: selectedCommunity?.name || null,
        appointment_type: selectedType,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        duration_minutes: selectedTypeObj?.durationMinutes || 30,
        status: 'pendente',
        notes: notes.trim() ? `[Protocolo: ${generatedProtocol}] ${notes.trim()}` : `[Protocolo: ${generatedProtocol}]`,
      });

      if (error) throw error;

      // Disparo de Notificação Transacional (Resend & Secretaria)
      try {
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'appointment',
            protocol: generatedProtocol,
            parishionerName: parishionerName.trim(),
            parishionerPhone: parishionerPhone.trim(),
            parishionerEmail: parishionerEmail.trim() || undefined,
            appointmentTypeLabel: selectedTypeObj?.title || 'Atendimento Pastoral',
            priestName: selectedPriest?.name || 'Qualquer Sacerdote Disponível',
            formattedDate: selectedDate.split('-').reverse().join('/'),
            time: selectedTime,
            communityName: selectedCommunity?.name || 'Catedral Diocesana',
            notes: notes.trim() || undefined,
          }),
        }).catch((notifErr) => {
          console.warn('Alerta silencioso de notificação:', notifErr);
        });
      } catch (e) {
        // Envio assíncrono não impede o sucesso do agendamento
      }

      setSuccessProtocol(generatedProtocol);
    } catch (err: any) {
      console.error('Erro ao registrar agendamento:', err);
      setErrorMessage('Não foi possível gravar o agendamento no momento. Tente novamente ou contate a secretaria.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessProtocol(null);
    setStep(1);
    setSelectedTime('');
    setParishionerName('');
    setParishionerPhone('');
    setParishionerEmail('');
    setNotes('');
  };

  if (successProtocol) {
    return (
      <AppointmentSuccessCard
        protocol={successProtocol}
        appointmentTypeLabel={selectedTypeObj?.title || 'Atendimento Pastoral'}
        priestName={selectedPriest?.name || 'Qualquer Sacerdote Disponível'}
        formattedDate={selectedDate.split('-').reverse().join('/')}
        time={selectedTime}
        parishionerName={parishionerName}
        parishionerPhone={parishionerPhone}
        parishionerEmail={parishionerEmail.trim() || undefined}
        communityName={selectedCommunity?.name}
        whatsappSecretaryNumber={parish.whatsapp_number}
        parishAddress={parish.address}
        onNewBooking={handleReset}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Indicador de Etapas Mobile-First */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: 'Atendimento' },
          { num: 2, label: 'Sacerdote' },
          { num: 3, label: 'Data & Hora' },
          { num: 4, label: 'Seus Dados' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => s.num < step && setStep(s.num)}
            disabled={s.num > step}
            className={`flex flex-col items-center p-2 rounded-xl text-center transition-all ${
              step === s.num
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : step > s.num
                ? 'bg-[var(--dash-surface-secondary)] text-emerald-500 hover:bg-[var(--dash-border)]'
                : 'bg-[var(--dash-surface-secondary)] text-[var(--dash-text-muted)] opacity-60'
            }`}
          >
            <span className="text-xs font-black">
              {step > s.num ? '✓' : `0${s.num}`}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold truncate w-full">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* ETAPA 1: Tipo de Atendimento */}
      {step === 1 && (
        <Card className="p-5 sm:p-6 space-y-5 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold">Qual atendimento pastoral você busca?</h2>
            <p className="text-xs text-[var(--dash-text-secondary)] mt-1">
              Selecione a modalidade adequada para o acolhimento na Catedral.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {APPOINTMENT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setSelectedType(opt.type)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[96px] ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 ring-2 ring-[var(--primary)]/20'
                      : 'border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--primary)]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-[var(--primary)] text-white' : 'bg-[var(--dash-surface-secondary)] text-[var(--primary)]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[var(--dash-text-primary)]">{opt.title}</h3>
                        <span className="text-[10px] text-[var(--dash-text-muted)] font-medium">Aprox. {opt.durationMinutes} min</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[var(--primary)] shrink-0" />}
                  </div>
                  <p className="text-xs text-[var(--dash-text-secondary)] mt-2 leading-relaxed">
                    {opt.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          <Button
            className="w-full min-h-[46px] font-bold text-sm"
            onClick={() => setStep(2)}
          >
            Continuar para Escolha do Padre <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      )}

      {/* ETAPA 2: Escolha do Sacerdote */}
      {step === 2 && (
        <Card className="p-5 sm:p-6 space-y-5 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold">Com qual sacerdote deseja agendar?</h2>
            <p className="text-xs text-[var(--dash-text-secondary)] mt-1">
              Você pode escolher um sacerdote específico ou o primeiro que tiver vaga.
            </p>
          </div>

          {/* Opção Primeiro Disponível */}
          <button
            type="button"
            onClick={() => setSelectedClergyId(null)}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between min-h-[56px] ${
              selectedClergyId === null
                ? 'border-[var(--primary)] bg-[var(--primary)]/5 ring-2 ring-[var(--primary)]/20'
                : 'border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--primary)]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--dash-text-primary)]">
                  Primeiro Sacerdote Disponível (Recomendado)
                </h3>
                <p className="text-xs text-[var(--dash-text-secondary)]">
                  Maior agilidade de horários na grade da paróquia
                </p>
              </div>
            </div>
            {selectedClergyId === null && <Check className="w-5 h-5 text-[var(--primary)]" />}
          </button>

          {/* Lista dos 4 Padres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clergyList.map((priest) => {
              const isSelected = selectedClergyId === priest.id;
              return (
                <button
                  key={priest.id}
                  type="button"
                  onClick={() => setSelectedClergyId(priest.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[88px] ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 ring-2 ring-[var(--primary)]/20'
                      : 'border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--primary)]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant={priest.role === 'paroco' ? 'matriz' : 'ceb'} className="text-[10px] py-0 px-2">
                        {priest.role === 'paroco' ? 'Pároco' : 'Vigário'}
                      </Badge>
                      <h3 className="font-bold text-sm text-[var(--dash-text-primary)] mt-1">{priest.name}</h3>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[var(--primary)]" />}
                  </div>
                  {priest.office_hours && (
                    <p className="text-[11px] text-[var(--dash-text-secondary)] mt-2 line-clamp-1">
                      {priest.office_hours}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              variant="outline"
              className="w-1/3 min-h-[46px] font-semibold text-xs"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
            </Button>
            <Button
              className="w-2/3 min-h-[46px] font-bold text-sm"
              onClick={() => setStep(3)}
            >
              Avançar para Horário <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ETAPA 3: Data e Horário */}
      {step === 3 && (
        <Card className="p-5 sm:p-6 space-y-5 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold">Escolha a data e o horário</h2>
            <p className="text-xs text-[var(--dash-text-secondary)] mt-1">
              Atendimentos de Terça a Sexta-feira na Secretaria da Catedral.
            </p>
          </div>

          {/* Carrossel/Pílulas de Dias */}
          <div>
            <label className="block text-xs font-semibold text-[var(--dash-text-secondary)] mb-2">
              Selecione o Dia:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {availableDates.map((d) => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d.dateStr);
                      setSelectedTime('');
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border min-w-[72px] min-h-[64px] transition-all shrink-0 ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm'
                        : 'border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] hover:border-[var(--primary)]/50'
                    }`}
                  >
                    <span className="text-[11px] font-medium opacity-90">{d.weekday}</span>
                    <span className="text-sm font-black">{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grade de Horários */}
          <div className="space-y-2 pt-2 border-t border-[var(--dash-border)]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[var(--dash-text-secondary)]">
                Horários Disponíveis:
              </label>
              {loadingSlots && (
                <span className="text-xs text-[var(--primary)] flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verificando...
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {AVAILABLE_TIMES.map((time) => {
                const isBooked = bookedTimes.includes(time);
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all min-h-[44px] flex items-center justify-center ${
                      isBooked
                        ? 'border-dashed border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-[var(--dash-text-muted)] cursor-not-allowed opacity-50 line-through'
                        : isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm'
                        : 'border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              variant="outline"
              className="w-1/3 min-h-[46px] font-semibold text-xs"
              onClick={() => setStep(2)}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
            </Button>
            <Button
              className="w-2/3 min-h-[46px] font-bold text-sm"
              disabled={!selectedTime}
              onClick={() => setStep(4)}
            >
              Preencher Meus Dados <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ETAPA 4: Dados do Fiel */}
      {step === 4 && (
        <Card className="p-5 sm:p-6 space-y-5 animate-fade-in">
          <div>
            <h2 className="text-lg font-bold">Identificação do Fiel</h2>
            <p className="text-xs text-[var(--dash-text-secondary)] mt-1">
              Informe seus dados para contato da secretaria e confirmação via WhatsApp.
            </p>
          </div>

          {/* Resumo da Escolha */}
          <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[var(--dash-text-secondary)]">Atendimento:</span>
              <strong className="text-[var(--dash-text-primary)]">{selectedTypeObj?.title}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dash-text-secondary)]">Sacerdote:</span>
              <strong className="text-[var(--dash-text-primary)]">{selectedPriest?.name || 'Qualquer Disponível'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dash-text-secondary)]">Data e Hora:</span>
              <strong className="text-[var(--primary)]">{selectedDate.split('-').reverse().join('/')} às {selectedTime}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="parishionerName"
              label="Nome Completo *"
              placeholder="Digite seu nome completo"
              value={parishionerName}
              onChange={(e) => setParishionerName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                id="parishionerPhone"
                label="WhatsApp para Contato *"
                placeholder="(27) 99999-9999"
                value={parishionerPhone}
                onChange={handlePhoneChange}
                required
              />

              <Input
                id="parishionerEmail"
                label="E-mail (Opcional)"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={parishionerEmail}
                onChange={(e) => setParishionerEmail(e.target.value)}
              />
            </div>

            <Select
              id="communityId"
              label="Sua Comunidade de Fé (Opcional)"
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
            >
              <option value="">Catedral (Matriz) ou Outra Paróquia</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.is_headquarters ? '(Matriz)' : ''}
                </option>
              ))}
            </Select>

            <div className="space-y-1.5">
              <label htmlFor="notes" className="block text-xs font-semibold text-[var(--dash-text-secondary)]">
                Observações ou Intenção Pastoral (Opcional)
              </label>
              <textarea
                id="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Primeira confissão após muitos anos / Bênção da residência"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-bg)] text-sm text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex items-center gap-2.5 text-xs text-[var(--dash-text-secondary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Sigilo Pastoral & LGPD:</strong> Seus dados de contato são estritamente confidenciais e protegidos nos termos da Lei 13.709/2018 para o acolhimento pastoral.</span>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/3 min-h-[48px] font-semibold text-xs"
                onClick={() => setStep(3)}
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
              </Button>
              <Button
                type="submit"
                className="w-2/3 min-h-[48px] font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registrando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2" /> Confirmar Agendamento
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
