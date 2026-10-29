'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  Clock, 
  Church, 
  User, 
  Phone, 
  Mail, 
  Send, 
  Loader2, 
  AlertCircle,
  Lock,
  PlusCircle,
  Check
} from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { Parish, Community, MassIntentionType, MassIntention } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { maskPhone } from '@/lib/utils';
import { MassIntentionSuccessCard, IntentionCategorySummary } from './MassIntentionSuccessCard';
import { CategoryNamesBox } from './CategoryNamesBox';

interface MassIntentionBookingProps {
  parish: Parish;
  communities: Community[];
}

export const INTENTION_TYPES: { id: MassIntentionType; label: string; icon: string; desc: string }[] = [
  { id: 'falecimento', label: 'Pela(s) Alma(s) de:', icon: '🕊️', desc: 'Oração pelo descanso eterno dos fiéis defuntos' },
  { id: 'setimo_dia', label: 'Missa de 7º Dia', icon: '🕯️', desc: 'Celebração solene de 7 dias de falecimento' },
  { id: 'trigesimo_dia', label: 'Missa de 30º Dia', icon: '✝️', desc: 'Celebração solene de 30 dias de falecimento' },
  { id: 'acao_gracas', label: 'Ação de Graças', icon: '🌸', desc: 'Gratidão a Deus por graças alcançadas e vitórias' },
  { id: 'saude', label: 'Saúde dos Enfermos', icon: '🌿', desc: 'Intercessão pela cura, alívio e conforto dos doentes' },
  { id: 'aniversario_vida', label: 'Aniversário Natalício', icon: '🎂', desc: 'Agradecimento pelo dom da vida de um familiar ou amigo' },
  { id: 'aniversario_matrimonio', label: 'Aniversário de Casamento', icon: '💍', desc: 'Bênção pelas bodas e vida conjugal do casal' },
  { id: 'outros', label: 'Outras Intenções e Bênçãos', icon: '✨', desc: 'Intenções particulares, trabalho ou discernimento' },
];

const DEFAULT_MASS_HOURS = ['07:00', '09:00', '18:00', '19:30'];
const MAX_SUBMISSIONS_PER_CELEBRATION = 3;

export function MassIntentionBooking({ parish, communities }: MassIntentionBookingProps) {
  const supabase = createClient();
  const todayStr = new Date().toISOString().split('T')[0];

  // Seção 1: Celebração
  const [communityId, setCommunityId] = useState<string>('');
  const [celebrationDate, setCelebrationDate] = useState<string>(todayStr);
  const [celebrationTime, setCelebrationTime] = useState<string>('18:00');

  // Seção 2: Múltiplas categorias ativas com seus respectivos nomes (até 5 por categoria)
  const [categoryNames, setCategoryNames] = useState<Partial<Record<MassIntentionType, string[]>>>({
    falecimento: [''],
  });

  // Seção 3: Dados do Solicitante (Opcionais) e Sigilo
  const [offeredBy, setOfferedBy] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [lgpdAccepted, setLgpdAccepted] = useState<boolean>(false);

  // Status de envio
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    protocol: string;
    celebrationDate: string;
    celebrationTime: string;
    communityName: string;
    categoriesSummary: IntentionCategorySummary[];
    offeredBy: string;
    contactPhone: string | null;
    isAnonymous: boolean;
    notes: string | null;
  } | null>(null);

  const selectedCommunity = communities.find((c) => c.id === communityId);
  const activeCategoryIds = Object.keys(categoryNames) as MassIntentionType[];

  // Ativar ou desativar uma categoria
  const handleToggleCategory = (typeId: MassIntentionType) => {
    if (categoryNames[typeId]) {
      // Se já está ativa e for a única, não desativa
      if (activeCategoryIds.length <= 1) return;
      // Desativa
      const updated = { ...categoryNames };
      delete updated[typeId];
      setCategoryNames(updated);
    } else {
      // Ativa com 1 campo vazio
      setCategoryNames((prev) => ({
        ...prev,
        [typeId]: [''],
      }));
    }
  };

  const handleUpdateCategoryNames = (typeId: MassIntentionType, newNames: string[]) => {
    setCategoryNames((prev) => ({
      ...prev,
      [typeId]: newNames,
    }));
  };

  const handleRemoveCategory = (typeId: MassIntentionType) => {
    if (activeCategoryIds.length <= 1) return;
    const updated = { ...categoryNames };
    delete updated[typeId];
    setCategoryNames(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validação de Nomes: Deve haver pelo menos 1 categoria com pelo menos 1 nome preenchido
    const activeEntries = Object.entries(categoryNames)
      .map(([type, names]) => ({
        type: type as MassIntentionType,
        names: (names || []).map((n) => n.trim()).filter(Boolean),
      }))
      .filter((entry) => entry.names.length > 0);

    if (activeEntries.length === 0) {
      setErrorMessage('Por favor, informe pelo menos um nome para quem deseja oferecer a intenção da Santa Missa.');
      return;
    }

    // 2. Validação condicional do WhatsApp (apenas se preenchido)
    const cleanPhone = contactPhone.replace(/\D/g, '');
    if (contactPhone.trim() && cleanPhone.length < 10) {
      setErrorMessage('Caso deseje informar o WhatsApp, por favor insira um número válido com DDD.');
      return;
    }

    // 3. Validação LGPD
    if (!lgpdAccepted) {
      setErrorMessage('É necessário concordar com os termos de proclamação litúrgica e privacidade (LGPD).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 4. Regra de Limite de Envios por Solicitante na mesma celebração
      if (cleanPhone) {
        const { data: existingRows } = await supabase
          .from('mass_intentions')
          .select('protocol_code')
          .eq('parish_id', parish.id)
          .eq('celebration_date', celebrationDate)
          .eq('celebration_time', celebrationTime)
          .eq('contact_phone', contactPhone.trim())
          .neq('status', 'cancelada');

        const distinctProtocols = new Set(existingRows?.map((r) => r.protocol_code).filter(Boolean)).size;

        if (distinctProtocols >= MAX_SUBMISSIONS_PER_CELEBRATION) {
          setErrorMessage(
            `Limite atingido: Você já possui ${distinctProtocols} solicitações registradas para esta mesma celebração (${celebrationTime}h). Para garantir a inclusão harmônica de toda a comunidade no altar, o limite é de ${MAX_SUBMISSIONS_PER_CELEBRATION} envios por celebração. Caso necessite de intenções adicionais, procure a secretaria paroquial.`
          );
          setIsSubmitting(false);
          return;
        }
      } else {
        // Validação no navegador (localStorage) para solicitações anônimas
        try {
          const storageKey = `intentions_limit_${celebrationDate}_${celebrationTime}`;
          const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
          if (currentCount >= MAX_SUBMISSIONS_PER_CELEBRATION) {
            setErrorMessage(
              `Limite atingido: Já foram registradas ${MAX_SUBMISSIONS_PER_CELEBRATION} solicitações para esta celebração a partir deste dispositivo. Esta medida fraterna garante espaço litúrgico a toda a comunidade.`
            );
            setIsSubmitting(false);
            return;
          }
        } catch {
          // Continua normalmente se localStorage estiver bloqueado
        }
      }

      // 5. Tratamento de nome do solicitante conforme privacidade/sigilo
      const resolvedOfferedBy = isAnonymous
        ? 'Anônimo'
        : offeredBy.trim() || 'Fiel da Comunidade';

      // 6. Geração de Protocolo Unificado compartilhado
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const protocolNumber = `INT-2026-${randomCode}`;

      // 7. Inserção em batch para cada categoria preenchida
      const batchPayload = activeEntries.map((entry) => ({
        parish_id: parish.id,
        community_id: communityId || null,
        celebration_date: celebrationDate,
        celebration_time: celebrationTime,
        intention_type: entry.type,
        intention_for: entry.names.join(', '),
        offered_by: resolvedOfferedBy,
        contact_phone: contactPhone.trim() || null,
        contact_email: contactEmail.trim() || null,
        is_anonymous: isAnonymous,
        protocol: protocolNumber,
        protocol_code: protocolNumber,
        notes: notes.trim() || null,
        status: 'pendente',
      }));

      const { error: insertError } = await supabase
        .from('mass_intentions')
        .insert(batchPayload);

      if (insertError) throw insertError;

      // Atualiza contador local
      try {
        const storageKey = `intentions_limit_${celebrationDate}_${celebrationTime}`;
        const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
        localStorage.setItem(storageKey, String(currentCount + 1));
      } catch {
        // Ignora
      }

      // 8. Prepara resumo para tela de sucesso
      const categoriesSummary: IntentionCategorySummary[] = activeEntries.map((entry) => {
        const info = INTENTION_TYPES.find((t) => t.id === entry.type);
        return {
          type: entry.type,
          label: info?.label || entry.type,
          icon: info?.icon || '✨',
          names: entry.names,
        };
      });

      setSubmittedData({
        protocol: protocolNumber,
        celebrationDate,
        celebrationTime,
        communityName: selectedCommunity?.name || 'Catedral Diocesana',
        categoriesSummary,
        offeredBy: resolvedOfferedBy,
        contactPhone: contactPhone.trim() || null,
        isAnonymous,
        notes: notes.trim() || null,
      });
    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error('Erro ao enviar intenções:', err);
      setErrorMessage(errorObj.message || 'Ocorreu um erro ao enviar suas intenções. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setCategoryNames({ falecimento: [''] });
    setNotes('');
    setErrorMessage(null);
  };

  if (submittedData) {
    return (
      <MassIntentionSuccessCard
        parish={parish}
        protocol={submittedData.protocol}
        celebrationDate={submittedData.celebrationDate}
        celebrationTime={submittedData.celebrationTime}
        communityName={submittedData.communityName}
        categoriesSummary={submittedData.categoriesSummary}
        offeredBy={submittedData.offeredBy}
        contactPhone={submittedData.contactPhone}
        isAnonymous={submittedData.isAnonymous}
        notes={submittedData.notes}
        onReset={handleReset}
      />
    );
  }

  return (
    <Card className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção 1: Comunidade e Celebração */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--dash-border)]">
            <Church className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
              1. Local, Data & Horário da Santa Missa
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="community" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Igreja / Comunidade
              </label>
              <select
                id="community"
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              >
                <option value="">Catedral Diocesana (Centro)</option>
                {communities.map((comm) => (
                  <option key={comm.id} value={comm.id}>
                    {comm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="celebration_date" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Data da Celebração
              </label>
              <Input
                id="celebration_date"
                type="date"
                min={todayStr}
                value={celebrationDate}
                onChange={(e) => setCelebrationDate(e.target.value)}
                required
                className="w-full text-xs min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="celebration_time" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Horário da Santa Missa
              </label>
              <select
                id="celebration_time"
                value={celebrationTime}
                onChange={(e) => setCelebrationTime(e.target.value)}
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              >
                {DEFAULT_MASS_HOURS.map((hr) => (
                  <option key={hr} value={hr}>
                    {hr}h
                  </option>
                ))}
                <option value="15:00">15:00h</option>
                <option value="19:00">19:00h</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção 2: Categorias de Intenções e Nomes */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--dash-border)] gap-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
                2. Categorias de Intenção & Nomes
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-0.5 rounded-full border border-[var(--primary)]/20 w-fit">
              Até 5 nomes por categoria
            </span>
          </div>

          <p className="text-xs text-[var(--dash-text-secondary)]">
            Selecione as categorias desejadas para a Santa Missa. Você pode incluir até 5 nomes em cada categoria:
          </p>

          {/* Grid de Seleção de Categorias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {INTENTION_TYPES.map((t) => {
              const isActive = Boolean(categoryNames[t.id]);
              const namesCount = categoryNames[t.id]?.filter((n) => n.trim()).length || 0;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleToggleCategory(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isActive
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-xs ring-1 ring-[var(--primary)]/40'
                      : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] hover:border-[var(--dash-border-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{t.icon}</span>
                      <span className="text-xs font-bold leading-tight line-clamp-1">{t.label}</span>
                    </div>
                    {isActive ? (
                      <span className="shrink-0 w-4 h-4 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] text-[var(--dash-text-muted)] font-bold">+</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[var(--dash-text-muted)] leading-tight line-clamp-1">
                      {t.desc}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-[var(--primary)] shrink-0 ml-1">
                        {namesCount}/5
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Caixas de Nomes para cada categoria ativa */}
          <div className="space-y-4 pt-2">
            {activeCategoryIds.map((typeId) => {
              const info = INTENTION_TYPES.find((t) => t.id === typeId);
              if (!info) return null;

              return (
                <CategoryNamesBox
                  key={typeId}
                  type={typeId}
                  label={info.label}
                  icon={info.icon}
                  desc={info.desc}
                  names={categoryNames[typeId] || ['']}
                  onChangeNames={(newNames) => handleUpdateCategoryNames(typeId, newNames)}
                  onRemoveCategory={() => handleRemoveCategory(typeId)}
                  canRemove={activeCategoryIds.length > 1}
                />
              );
            })}
          </div>
        </div>

        {/* Seção 3: Dados do Solicitante (Opcionais) com Área Clara de Sigilo */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--dash-border)] gap-1">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
                3. Seus Dados de Contato (Opcional)
              </h3>
            </div>
            <span className="text-[11px] text-[var(--dash-text-muted)]">
              Preenchimento não obrigatório
            </span>
          </div>

          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Você pode registrar suas intenções sem se identificar. Se desejar receber o comprovante no WhatsApp, preencha abaixo:
          </p>

          {/* Área Clara de Sigilo e Intenção Anônima */}
          <div className={`p-4 rounded-xl border transition-all ${
            isAnonymous 
              ? 'border-amber-500/50 bg-amber-500/10 shadow-xs' 
              : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="anonymous_toggle"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[var(--dash-border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
              />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[var(--dash-text-primary)] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Não divulgar nem ler meu nome no púlpito (Intenção Sigilosa / Anônima)</span>
                </span>
                <span className="text-[var(--dash-text-secondary)] leading-relaxed block text-[11px]">
                  Ao assinalar esta opção, os nomes informados acima serão proclamados normalmente na Santa Missa, mas <strong>o seu nome pessoal NÃO constará na folha impressa de intenções do púlpito nem será lido publicamente</strong>.
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="offered_by" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Seu Nome Completo <span className="text-[var(--dash-text-muted)] font-normal">(Opcional)</span>
              </label>
              <Input
                id="offered_by"
                type="text"
                placeholder="Ex: Ana Maria (ou deixe em branco)"
                value={offeredBy}
                onChange={(e) => setOfferedBy(e.target.value)}
                className="text-xs min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="contact_phone" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                WhatsApp com DDD <span className="text-[var(--dash-text-muted)] font-normal">(Opcional)</span>
              </label>
              <Input
                id="contact_phone"
                type="tel"
                placeholder="(27) 99999-9999"
                value={contactPhone}
                onChange={(e) => setContactPhone(maskPhone(e.target.value))}
                className="text-xs min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                E-mail <span className="text-[var(--dash-text-muted)] font-normal">(Opcional)</span>
              </label>
              <Input
                id="contact_email"
                type="email"
                placeholder="exemplo@email.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="text-xs min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
              Observações Litúrgicas Adicionais (Opcional)
            </label>
            <Input
              id="notes"
              type="text"
              placeholder="Ex: Parentesco, data de falecimento ou intenção especial"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs min-h-[44px]"
            />
          </div>
        </div>

        {/* Termos de Privacidade LGPD */}
        <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex items-start gap-3">
          <input
            id="lgpd_consent"
            type="checkbox"
            checked={lgpdAccepted}
            onChange={(e) => setLgpdAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[var(--dash-border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
            required
          />
          <label htmlFor="lgpd_consent" className="text-xs text-[var(--dash-text-secondary)] leading-relaxed cursor-pointer">
            Concordo com a proclamação litúrgica dos nomes nas preces comunitárias da Santa Missa e com o registro pastoral deste pedido pela Catedral, nos termos da Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
          </label>
        </div>

        {/* Feedback de Erro */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Botão de Envio */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[48px] font-bold text-sm bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md flex items-center justify-center gap-2 rounded-xl cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registrando Intenções no Livro Paroquial...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Registrar Intenções de Santa Missa</span>
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
