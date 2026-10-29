'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  MessageCircle, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard 
} from 'lucide-react';
import { Community, Parish } from '@/types';

interface DizimoRegistrationFormProps {
  parish: Parish;
  communities: Community[];
}

export function DizimoRegistrationForm({ parish, communities }: DizimoRegistrationFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [preferredDay, setPreferredDay] = useState('10');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [successProtocol, setSuccessProtocol] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage('Por favor, preencha ao menos seu nome completo e telefone/WhatsApp.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const communityObj = communities.find((c) => c.id === selectedCommunity);
    const communityName = communityObj?.name || 'Catedral Diocesana do Sagrado Coração de Jesus';

    try {
      const res = await fetch('/api/dizimo/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parishId: parish.id,
          communityId: selectedCommunity || null,
          communityName,
          fullName,
          phone,
          email,
          birthDate,
          neighborhood,
          preferredPaymentMethod: paymentMethod,
          preferredDay: Number(preferredDay),
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar adesão.');
      }

      setSuccessProtocol(data.protocol || 'DIZ-OK');
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao enviar formulário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappLink = parish.whatsapp_number
    ? `https://wa.me/${parish.whatsapp_number.replace(/\D/g, '')}?text=Olá!%20Acabei%20de%20me%20cadastrar%20no%20Dízimo%20pelo%20Portal%20Sou%20do%20Sagrado%20(Protocolo:%20${successProtocol}).`
    : null;

  return (
    <section id="adesao-dizimista" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dash-border)] pb-4">
        <div>
          <span className="text-xs font-bold text-[#FFA82A] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Faça Parte da Nossa Família
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)] mt-1">
            Cadastro de Novo Dizimista (Sou do Sagrado)
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E22]/10 dark:bg-[#FFA82A]/10 text-[#8B1E22] dark:text-[#FFA82A] text-xs font-bold">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Adesão Espiritual & Pastoral</span>
        </div>
      </div>

      <div className="p-6 sm:p-10 rounded-3xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-md">
        {successProtocol ? (
          <div className="text-center py-8 px-4 max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-cinzel text-2xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)]">
                Deus Abençoe Sua Generosidade!
              </h3>
              <p className="text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans">
                Seu cadastro de dizimista foi recebido pela <strong>Secretaria Paroquial da Catedral</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] inline-block">
              <span className="text-[11px] font-bold text-[var(--dash-text-secondary)] uppercase tracking-wider block">
                Protocolo Pastoral:
              </span>
              <span className="text-xl font-mono font-bold text-[#8B1E22] dark:text-[#FFA82A]">
                {successProtocol}
              </span>
            </div>

            <p className="text-xs text-[var(--dash-text-secondary)] max-w-md mx-auto italic">
              A Secretaria formalizará seu cadastro no sistema eclesial diocesano (Theòs) e você poderá retirar seu número de dizimista e envelopes com a equipe da Pastoral do Dízimo no plantão das Santas Missas na Catedral.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar com a Secretaria no WhatsApp</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setSuccessProtocol(null)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--dash-border)] text-xs font-semibold text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] min-h-[44px]"
              >
                Cadastrar Outro Membro da Família
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-500">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome Completo */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[var(--dash-text-secondary)] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A] min-h-[44px]"
                  />
                </div>
              </div>

              {/* Telefone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  WhatsApp / Telefone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[var(--dash-text-secondary)] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="(27) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A] min-h-[44px]"
                  />
                </div>
              </div>

              {/* E-mail */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  E-mail (Opcional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--dash-text-secondary)] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A] min-h-[44px]"
                  />
                </div>
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Data de Nascimento (Para rezarmos por você)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[var(--dash-text-secondary)] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A] min-h-[44px]"
                  />
                </div>
              </div>

              {/* Bairro / Região */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Bairro / Localidade
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[var(--dash-text-secondary)] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Ex: Centro, Maria das Graças..."
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A] min-h-[44px]"
                  />
                </div>
              </div>

              {/* Comunidade de Frequência */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Comunidade de Frequência Habitual
                </label>
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2.5 focus:outline-hidden focus:border-[#FFA82A] min-h-[44px]"
                >
                  <option value="">Catedral Diocesana do Sagrado Coração de Jesus (Centro)</option>
                  {communities.map((comm) => (
                    <option key={comm.id} value={comm.id}>
                      {comm.name} {comm.neighborhood ? `(${comm.neighborhood})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Forma Preferida de Contribuição */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Forma Preferida de Contribuição
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2.5 focus:outline-hidden focus:border-[#FFA82A] min-h-[44px]"
                >
                  <option value="pix">PIX Instantâneo</option>
                  <option value="envelope">Envelope Mensal (Nas Santas Missas)</option>
                  <option value="transferencia">Transferência Bancária</option>
                  <option value="secretaria">Presencial na Secretaria Paroquial</option>
                </select>
              </div>

              {/* Dia de Preferência */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                  Dia do Mês de Preferência
                </label>
                <select
                  value={preferredDay}
                  onChange={(e) => setPreferredDay(e.target.value)}
                  className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2.5 focus:outline-hidden focus:border-[#FFA82A] min-h-[44px]"
                >
                  <option value="5">Dia 05 de cada mês</option>
                  <option value="10">Dia 10 de cada mês</option>
                  <option value="15">Dia 15 de cada mês</option>
                  <option value="20">Dia 20 de cada mês</option>
                  <option value="25">Dia 25 de cada mês</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FFA82A] via-[#FFCC36] to-[#FFA82A] hover:brightness-105 text-[#2D1A16] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#FFA82A]/20 transition-all cursor-pointer min-h-[44px] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#2D1A16]" />
                    <span>Registrando Adesão...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#2D1A16]" />
                    <span>Confirmar Minha Adesão</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
