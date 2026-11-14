'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Parish, UserRole } from '@/types';
import { EcclesiamAccessRequestFields } from './EcclesiamAccessRequestFields';
import { toFriendlyErrorMessage } from '@/lib/security/friendlyError';

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
      const cleanEmail = email.trim().toLowerCase();
      const targetParishId =
        selectedParishId || parishes[0]?.id || 'c0000000-0000-0000-0000-000000000001';

      const res = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parish_id: targetParishId,
          name: name.trim(),
          email: cleanEmail,
          phone: phone.trim() || null,
          role,
          communityHint: communityHint.trim() || null,
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        setErrorMsg(data?.error || 'Não foi possível registrar a solicitação.');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(
        toFriendlyErrorMessage(err, 'Erro inesperado ao enviar solicitação.')
      );
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
      style={{ backgroundColor: 'rgba(45, 26, 22, 0.65)' }}
    >
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E8DFD3',
          color: '#2D1A16',
        }}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, #2D1A16 0%, #5E1417 55%, #8B1E22 100%)',
            borderColor: 'rgba(200, 164, 99, 0.35)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(255, 204, 54, 0.16)',
                borderColor: 'rgba(255, 204, 54, 0.45)',
                color: '#FFCC36',
              }}
            >
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold" style={{ color: '#FCF7F1' }}>
                Cadastro de Credencial Pastoral
              </h3>
              <p className="text-[11px]" style={{ color: '#EEE3D4' }}>
                Solicitação enviada diretamente para aprovação da sua paróquia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl transition-opacity hover:opacity-80 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            style={{ color: '#FCF7F1' }}
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
                backgroundColor: 'rgba(53, 107, 88, 0.12)',
                borderColor: 'rgba(53, 107, 88, 0.35)',
                color: '#356B58',
              }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-cinzel text-lg font-bold" style={{ color: '#2D1A16' }}>
                Solicitação Registrada com Sucesso!
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#514D4B' }}>
                Seus dados foram enviados para a fila de aprovação da sua paróquia. Assim que autorizada sua credencial, você poderá acessar o painel com seu e-mail.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-3 px-5 rounded-xl font-extrabold text-xs uppercase tracking-wider min-h-[46px] cursor-pointer transition-all hover:brightness-105 shadow-md"
              style={{
                background: 'linear-gradient(90deg, #FFA82A 0%, #FFCC36 50%, #FFA82A 100%)',
                color: '#2D1A16',
              }}
            >
              Voltar para o Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div
                className="p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(139, 30, 34, 0.08)',
                  borderColor: 'rgba(139, 30, 34, 0.28)',
                  color: '#8B1E22',
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
                className="px-4 py-2.5 rounded-xl border text-xs font-bold min-h-[44px] cursor-pointer"
                style={{
                  backgroundColor: '#F5EFE7',
                  borderColor: '#E8DFD3',
                  color: '#514D4B',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider min-h-[44px] flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 disabled:opacity-50 shadow-sm"
                style={{
                  background: 'linear-gradient(90deg, #FFA82A 0%, #FFCC36 50%, #FFA82A 100%)',
                  color: '#2D1A16',
                }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>Enviar Cadastro</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
