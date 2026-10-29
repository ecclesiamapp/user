'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Loader2, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Share2, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Church, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { Parish, CertificateType, CertificateRequest } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { maskPhone } from '@/lib/utils';

interface CertificateRequestFormProps {
  parish: Parish;
}

const CERTIFICATE_OPTIONS: { id: CertificateType; label: string; desc: string; icon: string }[] = [
  { id: 'batismo', label: 'Certidão de Batismo (2ª Via)', desc: 'Para casamento, crisma ou documento canônico', icon: '🕊️' },
  { id: 'crisma', label: 'Comprovante / Certidão de Crisma', desc: 'Comprovação do Sacramento da Confirmação', icon: '🔥' },
  { id: 'matrimonio', label: 'Certidão de Matrimônio Religioso', desc: '2ª via de casamento celebrado na paróquia', icon: '💍' },
  { id: 'transferencia', label: 'Transferência / Licença de Noivos', desc: 'Declaração para celebrar em outra paróquia', icon: '📜' },
  { id: 'outros', label: 'Outro Documento Paroquial', desc: 'Atestados gerais, histórico e declarações', icon: '📁' },
];

export function CertificateRequestForm({ parish }: CertificateRequestFormProps) {
  const supabase = createClient();

  // Estados do Formulário
  const [certType, setCertType] = useState<CertificateType>('batismo');
  const [holderName, setHolderName] = useState<string>('');
  const [holderBirthDate, setHolderBirthDate] = useState<string>('');
  const [parentsNames, setParentsNames] = useState<string>('');
  const [godparentsNames, setGodparentsNames] = useState<string>('');
  const [approximateYear, setApproximateYear] = useState<string>('');
  const [communityName, setCommunityName] = useState<string>('');
  const [bookNumber, setBookNumber] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<string>('');
  const [entryNumber, setEntryNumber] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');

  // Solicitante
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantRelation, setApplicantRelation] = useState<'proprio' | 'pai_mae' | 'conjuge' | 'responsavel' | 'outro'>('proprio');
  const [deliveryPreference, setDeliveryPreference] = useState<'retirada_presencial' | 'email_digital' | 'whatsapp'>('retirada_presencial');
  const [notes, setNotes] = useState<string>('');
  const [lgpdAccepted, setLgpdAccepted] = useState<boolean>(false);

  // Estados de envio e feedback
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [protocolGenerated, setProtocolGenerated] = useState<string | null>(null);
  const [copiedProtocol, setCopiedProtocol] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!holderName.trim()) {
      setErrorMessage('Por favor, informe o nome completo do titular do sacramento.');
      return;
    }

    if (!applicantName.trim()) {
      setErrorMessage('Por favor, informe o seu nome completo (solicitante).');
      return;
    }

    const cleanPhone = applicantPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Por favor, informe um WhatsApp válido com DDD para contato.');
      return;
    }

    if (!lgpdAccepted) {
      setErrorMessage('É necessário aceitar os termos de consentimento para busca e emissão nos livros paroquiais (LGPD).');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        parish_id: parish.id,
        certificate_type: certType,
        applicant_name: applicantName.trim(),
        applicant_phone: applicantPhone.trim(),
        applicant_email: applicantEmail.trim() || null,
        applicant_relation: applicantRelation,
        holder_name: holderName.trim(),
        holder_birth_date: holderBirthDate || null,
        parents_names: parentsNames.trim() || null,
        godparents_names: godparentsNames.trim() || null,
        approximate_year: approximateYear ? parseInt(approximateYear, 10) : null,
        community_name: communityName.trim() || null,
        book_number: bookNumber.trim() || null,
        page_number: pageNumber.trim() || null,
        entry_number: entryNumber.trim() || null,
        purpose: purpose.trim() || null,
        delivery_preference: deliveryPreference,
        notes: notes.trim() || null,
        status: 'pendente',
      };

      const { data, error } = await supabase
        .from('certificate_requests')
        .insert([payload])
        .select('id, created_at')
        .single();

      if (error) throw error;

      const code = `CERT-2026-${(data?.id || 'NOVO').slice(0, 6).toUpperCase()}`;
      setProtocolGenerated(code);
    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error('Erro ao solicitar certidão:', err);
      setErrorMessage(errorObj.message || 'Erro ao registrar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyProtocol = () => {
    if (protocolGenerated) {
      navigator.clipboard.writeText(protocolGenerated);
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!protocolGenerated) return;
    const certName = CERTIFICATE_OPTIONS.find((c) => c.id === certType)?.label || 'Certidão';
    const msg = encodeURIComponent(
      `📜 *Protocolo de Solicitação de Certidão Paroquial*\n` +
      `*Protocolo:* ${protocolGenerated}\n` +
      `*Documento:* ${certName}\n` +
      `*Titular:* ${holderName}\n` +
      `*Solicitante:* ${applicantName}\n` +
      `*Paróquia:* ${parish.name}\n\n` +
      `A secretaria localizará o registro nos livros de tombo e entrará em contato em até 3 a 5 dias úteis.`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleReset = () => {
    setProtocolGenerated(null);
    setHolderName('');
    setParentsNames('');
    setNotes('');
    setErrorMessage(null);
  };

  if (protocolGenerated) {
    return (
      <Card className="p-6 sm:p-8 max-w-2xl mx-auto space-y-6 text-center border-emerald-500/30 bg-emerald-500/5">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1.5">
          <Badge variant="matriz" className="text-xs uppercase font-bold tracking-wider">
            Pedido Protocolado com Sucesso
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--dash-text-primary)]">
            Solicitação de Certidão Enviada
          </h2>
          <p className="text-xs sm:text-sm text-[var(--dash-text-secondary)] max-w-md mx-auto">
            Nossa equipe de secretaria iniciará a busca nos livros de tombo da paróquia.
          </p>
        </div>

        {/* Protocolo Box */}
        <div className="p-4 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-2">
          <span className="text-xs text-[var(--dash-text-muted)] block">Seu Código de Acompanhamento</span>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-lg font-bold text-[var(--primary)]">{protocolGenerated}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyProtocol}
              className="h-8 gap-1 text-xs cursor-pointer"
            >
              {copiedProtocol ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedProtocol ? 'Copiado' : 'Copiar'}</span>
            </Button>
          </div>
        </div>

        {/* Orientações de Prazo */}
        <div className="p-4 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-left text-xs space-y-1.5 text-[var(--dash-text-secondary)]">
          <p className="font-semibold text-[var(--dash-text-primary)]">ℹ️ Prazo de Busca e Emissão:</p>
          <p>• O prazo habitual para localização em arquivo histórico e lavratura da 2ª via é de <strong>3 a 5 dias úteis</strong>.</p>
          <p>• Você receberá uma notificação no seu WhatsApp assim que o documento estiver pronto.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full sm:w-auto min-h-[44px] bg-[#25D366] hover:bg-[#20ba59] text-white font-bold gap-2 rounded-xl cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Salvar no WhatsApp</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto min-h-[44px] font-bold rounded-xl cursor-pointer"
          >
            <span>Nova Solicitação</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção 1: Tipo de Documento */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--dash-border)]">
            <BookOpen className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
              1. Qual documento você precisa?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {CERTIFICATE_OPTIONS.map((opt) => {
              const isSelected = certType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCertType(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-xs'
                      : 'border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] hover:border-[var(--dash-border-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.icon}</span>
                    <span className="text-xs font-bold leading-tight">{opt.label}</span>
                  </div>
                  <span className="text-[10px] text-[var(--dash-text-muted)] leading-tight">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seção 2: Dados do Titular do Sacramento */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--dash-border)]">
            <User className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
              2. Dados do Titular (Pessoa que recebeu o Sacramento)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="holder_name" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Nome Completo do Titular <span className="text-rose-500">*</span>
              </label>
              <Input
                id="holder_name"
                type="text"
                placeholder="Nome como consta na certidão ou nascimento"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="holder_birth_date" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Data de Nascimento do Titular
              </label>
              <Input
                id="holder_birth_date"
                type="date"
                value={holderBirthDate}
                onChange={(e) => setHolderBirthDate(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="approximate_year" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Ano Aproximado da Celebração
              </label>
              <Input
                id="approximate_year"
                type="number"
                placeholder="Ex: 1995"
                min="1920"
                max="2030"
                value={approximateYear}
                onChange={(e) => setApproximateYear(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="parents_names" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Nomes dos Pais (Filiação Completa)
              </label>
              <Input
                id="parents_names"
                type="text"
                placeholder="Nome do Pai e Nome da Mãe"
                value={parentsNames}
                onChange={(e) => setParentsNames(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="godparents_names" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Padrinhos / Cônjuge (se souber)
              </label>
              <Input
                id="godparents_names"
                type="text"
                placeholder="Nomes dos padrinhos ou do cônjuge"
                value={godparentsNames}
                onChange={(e) => setGodparentsNames(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="community_name" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Comunidade ou Igreja onde ocorreu
              </label>
              <Input
                id="community_name"
                type="text"
                placeholder="Ex: Catedral Diocesana ou Comunidade São José"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Dados de Tombo Prévios (Opcionais) */}
          <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-2">
            <span className="text-[11px] font-bold text-[var(--dash-text-primary)] block">
              Possui a certidão antiga ou dados do Livro de Tombo? (Opcional - agiliza a busca)
            </span>
            <div className="grid grid-cols-3 gap-3">
              <Input
                type="text"
                placeholder="Livro Nº"
                value={bookNumber}
                onChange={(e) => setBookNumber(e.target.value)}
                className="text-xs h-8"
              />
              <Input
                type="text"
                placeholder="Folha Nº"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                className="text-xs h-8"
              />
              <Input
                type="text"
                placeholder="Termo Nº"
                value={entryNumber}
                onChange={(e) => setEntryNumber(e.target.value)}
                className="text-xs h-8"
              />
            </div>
          </div>
        </div>

        {/* Seção 3: Dados do Solicitante & Finalidade */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--dash-border)]">
            <Phone className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--dash-text-primary)]">
              3. Dados do Solicitante & Entrega
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="applicant_name" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Seu Nome Completo <span className="text-rose-500">*</span>
              </label>
              <Input
                id="applicant_name"
                type="text"
                placeholder="Nome do requerente"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="applicant_phone" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                WhatsApp com DDD <span className="text-rose-500">*</span>
              </label>
              <Input
                id="applicant_phone"
                type="tel"
                placeholder="(27) 99999-9999"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(maskPhone(e.target.value))}
                required
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="applicant_relation" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Parentesco com o Titular
              </label>
              <select
                id="applicant_relation"
                value={applicantRelation}
                onChange={(e) => setApplicantRelation(e.target.value as any)}
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] cursor-pointer"
              >
                <option value="proprio">O próprio titular</option>
                <option value="pai_mae">Pai ou Mãe</option>
                <option value="conjuge">Cônjuge / Noivo(a)</option>
                <option value="responsavel">Responsável Legal</option>
                <option value="outro">Outro parente</option>
              </select>
            </div>

            <div>
              <label htmlFor="purpose" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Finalidade da Certidão
              </label>
              <Input
                id="purpose"
                type="text"
                placeholder="Ex: Casamento Religioso, Crisma, Cidadania"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="delivery" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Preferência de Entrega
              </label>
              <select
                id="delivery"
                value={deliveryPreference}
                onChange={(e) => setDeliveryPreference(e.target.value as any)}
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-2.5 text-xs text-[var(--dash-text-primary)] cursor-pointer"
              >
                <option value="retirada_presencial">Retirada na Secretaria Paroquial</option>
                <option value="whatsapp">Digitalização por WhatsApp</option>
                <option value="email_digital">Envio por E-mail (PDF)</option>
              </select>
            </div>

            <div>
              <label htmlFor="applicant_email" className="block text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                E-mail (Opcional)
              </label>
              <Input
                id="applicant_email"
                type="email"
                placeholder="exemplo@email.com"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* Termos de Privacidade LGPD */}
        <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] flex items-start gap-3">
          <input
            id="lgpd_cert_consent"
            type="checkbox"
            checked={lgpdAccepted}
            onChange={(e) => setLgpdAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[var(--dash-border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
            required
          />
          <label htmlFor="lgpd_cert_consent" className="text-xs text-[var(--dash-text-secondary)] leading-relaxed cursor-pointer">
            Autorizo a consulta e conferência dos dados pessoais nos livros eclesiásticos de tombo da Paróquia exclusivamente para a finalidade desta certidão canônica, em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
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
              <span>Protocolando Pedido de Certidão...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar Solicitação de Certidão</span>
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
