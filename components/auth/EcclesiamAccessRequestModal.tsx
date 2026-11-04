'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Parish, UserRole } from '@/types';
import { recordSecurityAudit } from '@/lib/security/authSecurity';
import { EcclesiamAccessRequestFields } from './EcclesiamAccessRequestFields';

interface EcclesiamAccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EcclesiamAccessRequestModal({
  isOpen,
  onClose,
}: EcclesiamAccessRequestModalProps) {
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [selectedParishId, setSelectedParishId] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('coordenador_ceb');
  const [communityHint, setCommunityHint] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const loadParishes = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('parishes').select('*').order('name');
        if (data && data.length > 0) {
          setParishes(data as Parish[]);
          setSelectedParishId(data[0].id);
        }
      } catch {
        // fallback silencioso
      }
    };
    loadParishes();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Preencha seu nome completo e e-mail institucional ou pessoal.');
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const cleanEmail = email.trim().toLowerCase();
      const targetParishId =
        selectedParishId || parishes[0]?.id || 'c0000000-0000-0000-0000-000000000001';
      const displayName = communityHint.trim()
        ? `${name.trim()} (${communityHint.trim()})`
        : name.trim();

      const { error } = await supabase.from('user_profiles').insert([
        {
          parish_id: targetParishId,
          name: displayName,
          email: cleanEmail,
          phone: phone.trim() || null,
          role,
          status: 'pendente',
          allowed_modules:
            role === 'pascom'
              ? ['lp_geral', 'avisos', 'pastorais', 'galerias']
              : ['lp_geral', 'cpc', 'avisos', 'pastorais', 'horarios'],
        },
      ]);

      if (error) {
        setErrorMsg(
          error.code === '23505'
            ? 'Este e-mail já possui cadastro ou solicitação registrada. Aguarde a aprovação ou faça login.'
            : error.message || 'Não foi possível registrar a solicitação.'
        );
        setSubmitting(false);
        return;
      }

      await recordSecurityAudit({
        email: cleanEmail,
        eventType: 'access_request_submitted',
        parishId: targetParishId,
        role,
        metadata: { name: displayName, phone },
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro inesperado ao enviar solicitação.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setErrorMsg(null);
    setName('');
    setEmail('');
    setPhone('');
    setCommunityHint('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(5, 8, 15, 0.82)' }}
    >
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: '#0F1523',
          borderColor: 'rgba(200, 164, 99, 0.35)',
          color: '#F8FAFC',
        }}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ backgroundColor: '#0B101B', borderColor: 'rgba(148, 163, 184, 0.15)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(200, 164, 99, 0.14)',
                borderColor: 'rgba(200, 164, 99, 0.4)',
                color: '#E5C158',
              }}
            >
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold" style={{ color: '#FAF6F0' }}>
                Solicitar Credencial de Colaborador
              </h3>
              <p className="text-[11px]" style={{ color: '#94A3B8' }}>
                Seu pedido será encaminhado para aprovação da administração da sua paróquia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl transition-opacity hover:opacity-80 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            style={{ color: '#94A3B8' }}
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                borderColor: 'rgba(16, 185, 129, 0.35)',
                color: '#34D399',
              }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-cinzel text-lg font-bold" style={{ color: '#FAF6F0' }}>
                Solicitação Registrada com Sucesso!
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>
                Seus dados foram enviados para a fila de aprovação da sua paróquia. Assim que autorizada sua credencial, você poderá acessar o painel com seu e-mail.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider min-h-[46px] cursor-pointer transition-all hover:brightness-105"
              style={{ backgroundColor: '#C8A463', color: '#0B0F17' }}
            >
              Voltar para o Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div
                className="p-3.5 rounded-xl border flex items-start gap-2.5 text-xs"
                style={{
                  backgroundColor: 'rgba(244, 63, 94, 0.12)',
                  borderColor: 'rgba(244, 63, 94, 0.35)',
                  color: '#FDA4AF',
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <EcclesiamAccessRequestFields
              parishes={parishes}
              selectedParishId={selectedParishId}
              onSelectParishId={setSelectedParishId}
              name={name}
              onChangeName={setName}
              phone={phone}
              onChangePhone={setPhone}
              email={email}
              onChangeEmail={setEmail}
              role={role}
              onChangeRole={setRole}
              communityHint={communityHint}
              onChangeCommunityHint={setCommunityHint}
            />

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl border text-xs font-semibold min-h-[44px] cursor-pointer"
                style={{ borderColor: 'rgba(148, 163, 184, 0.25)', color: '#CBD5E1' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider min-h-[44px] flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 disabled:opacity-50"
                style={{ backgroundColor: '#C8A463', color: '#0B0F17' }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>Enviar Solicitação</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
