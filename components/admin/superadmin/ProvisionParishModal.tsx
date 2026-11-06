'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui';

export interface ProvisionParishInput {
  name: string;
  diocese: string;
  city: string;
  state: string;
  customDomain: string;
  whatsappNumber: string;
  pixKey: string;
  planTier: string;
  adminName: string;
  adminEmail: string;
  adminRole: 'paroco' | 'secretaria';
  initialAccessCode: string;
}

interface ProvisionParishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProvision: (input: ProvisionParishInput) => Promise<{
    success: boolean;
    error?: string;
    parishId?: string;
  }>;
}

export function ProvisionParishModal({
  isOpen,
  onClose,
  onProvision,
}: ProvisionParishModalProps) {
  const [name, setName] = useState('');
  const [diocese, setDiocese] = useState('Diocese de Colatina');
  const [city, setCity] = useState('');
  const [state, setState] = useState('ES');
  const [customDomain, setCustomDomain] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('5527999990000');
  const [pixKey, setPixKey] = useState('');
  const [planTier, setPlanTier] = useState('paroquia_pro');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState<'paroco' | 'secretaria'>('paroco');
  const [initialAccessCode, setInitialAccessCode] = useState('Ecclesiam@2026');

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = 'Ecl@';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInitialAccessCode(result);
  };

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [provisionedDone, setProvisionedDone] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !city.trim() || !adminName.trim() || !adminEmail.trim()) {
      setErrorMsg('Preencha o nome da paróquia, cidade e os dados do responsável inicial.');
      return;
    }

    setSubmitting(true);
    const res = await onProvision({
      name: name.trim(),
      diocese: diocese.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      customDomain: customDomain.trim().toLowerCase(),
      whatsappNumber: whatsappNumber.trim(),
      pixKey: pixKey.trim(),
      planTier,
      adminName: adminName.trim(),
      adminEmail: adminEmail.trim().toLowerCase(),
      adminRole,
      initialAccessCode: initialAccessCode.trim() || 'Ecclesiam@2026',
    });
    setSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao provisionar nova paróquia.');
      return;
    }

    setProvisionedDone(true);
  };

  const inviteText = `Olá, ${adminName}! O ambiente da *${name}* já está ativo no *Ecclesiam App*.\n\n🔗 *Portal de Acesso:* https://ecclesiamapp.com.br/login\n📧 *E-mail Credenciado:* ${adminEmail.trim().toLowerCase()}\n🔑 *Senha Inicial:* ${initialAccessCode}`;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 3000);
  };

  const handleResetAndClose = () => {
    setProvisionedDone(false);
    setErrorMsg(null);
    setName('');
    setCity('');
    setCustomDomain('');
    setPixKey('');
    setAdminName('');
    setAdminEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[var(--dash-text-primary)]">
                Provisionar Nova Paróquia em 1 Clique
              </h3>
              <p className="text-[11px] text-[var(--dash-text-muted)]">
                Cria automaticamente: Paróquia + Comunidade Sede + Credencial do Responsável
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {provisionedDone ? (
          <div className="p-6 sm:p-8 space-y-5 text-center overflow-y-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-extrabold text-[var(--dash-text-primary)]">
                Paróquia Provisionada com Sucesso!
              </h4>
              <p className="text-xs sm:text-sm text-[var(--dash-text-muted)]">
                A paróquia <strong>{name}</strong>, sua Comunidade Sede e a credencial de{' '}
                <strong>{adminName}</strong> já estão prontas para login.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] text-left space-y-2">
              <span className="text-[11px] font-bold uppercase text-[var(--dash-text-muted)] block">
                Credencial Pronta para Envio no WhatsApp:
              </span>
              <pre className="text-xs whitespace-pre-wrap font-sans text-[var(--dash-text-primary)] leading-relaxed">
                {inviteText}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyInvite}
                className="w-full sm:w-auto rounded-xl text-xs font-bold min-h-[44px] px-5 flex items-center justify-center gap-2"
              >
                {copiedInvite ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Convite Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Convite de Acesso</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto rounded-xl bg-[var(--primary)] text-white text-xs font-bold min-h-[44px] px-6"
              >
                Concluir e Fechar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] block">
                1. Dados Institucionais da Paróquia
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    Nome da Paróquia *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Paróquia São Mateus"
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    Diocese *
                  </label>
                  <input
                    type="text"
                    required
                    value={diocese}
                    onChange={(e) => setDiocese(e.target.value)}
                    placeholder="Ex: Diocese de Colatina"
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-1 sm:col-span-2">
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Linhares"
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    UF *
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px] uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    Plano SaaS
                  </label>
                  <select
                    value={planTier}
                    onChange={(e) => setPlanTier(e.target.value)}
                    className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] pl-3 pr-8 py-2.5 text-xs min-h-[42px]"
                  >
                    <option value="catedral_enterprise">Catedral</option>
                    <option value="paroquia_pro">Paróquia Pro</option>
                    <option value="paroquia_essencial">Essencial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    Domínio Oficial (Opcional)
                  </label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="paroquiasaomateus.org.br"
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    WhatsApp da Secretaria
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="5527999990000"
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    Chave PIX Oficial
                  </label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="CNPJ ou E-mail"
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--dash-border)] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] block">
                2. Credencial Inicial do Pároco / Secretaria
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    Nome do Responsável *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Ex: Pe. João Batista"
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    E-mail de Login *
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="paroco@suaparoquia.org.br"
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--dash-text-primary)] block mb-1">
                    Perfil Canônico
                  </label>
                  <select
                    value={adminRole}
                    onChange={(e) => setAdminRole(e.target.value as 'paroco' | 'secretaria')}
                    className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] pl-3.5 pr-10 py-2.5 text-xs min-h-[42px]"
                  >
                    <option value="paroco">Pároco (Acesso Total à Paróquia)</option>
                    <option value="secretaria">Secretaria Paroquial</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[var(--dash-text-primary)]">
                      Senha Inicial (`access_code`)
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="text-[10px] text-[var(--primary)] hover:underline inline-flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Gerar Aleatória</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={initialAccessCode}
                    onChange={(e) => setInitialAccessCode(e.target.value)}
                    className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3.5 py-2.5 text-xs min-h-[42px] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--dash-border)] flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetAndClose}
                className="rounded-xl text-xs font-bold min-h-[42px]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold min-h-[42px] px-5 flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Criar Paróquia, Sede & Credencial</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

