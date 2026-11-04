'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { authenticateEcclesiamUser, recordSecurityAudit } from '@/lib/security/authSecurity';
import { EcclesiamAccessRequestModal } from './EcclesiamAccessRequestModal';
import { EcclesiamLoginModeTabs, AuthMode } from './EcclesiamLoginModeTabs';

export function EcclesiamLoginFormCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';

  const [mode, setMode] = useState<AuthMode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const switchMode = (target: AuthMode) => {
    setMode(target);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Informe seu e-mail cadastrado e sua senha de acesso.');
      return;
    }

    setLoading(true);
    try {
      const result = await authenticateEcclesiamUser(email, password);
      if (!result.success) {
        setErrorMsg(result.error || 'Não foi possível autenticar.');
        setLoading(false);
        return;
      }

      setSuccessMsg(
        `Credencial validada! Redirecionando para o painel${
          result.parish?.name ? ` • ${result.parish.name}` : ''
        }...`
      );
      router.push(nextPath);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro de comunicação com o servidor de segurança.');
      setLoading(false);
    }
  };

  const handleMagicOrReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Informe o seu e-mail cadastrado.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ecclesiamapp.com.br';

      if (mode === 'reset') {
        await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo: `${origin}/login` });
        await recordSecurityAudit({ email: cleanEmail, eventType: 'password_reset_requested' });
        setSuccessMsg('Se o e-mail estiver ativo em nossa base, as instruções foram enviadas.');
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, status')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (!profile) {
        setErrorMsg('Este e-mail não consta na base de paróquias credenciadas.');
        setLoading(false);
        return;
      }

      if (profile.status !== 'ativo') {
        setErrorMsg(
          profile.status === 'pendente'
            ? 'Sua credencial ainda aguarda aprovação da administração paroquial.'
            : 'Esta credencial encontra-se suspensa.'
        );
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { emailRedirectTo: `${origin}/admin` },
      });

      if (error) {
        setErrorMsg('Utilize a aba "Com Senha" para acessar imediatamente com sua credencial.');
      } else {
        setSuccessMsg('Link de acesso seguro enviado! Verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Não foi possível processar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[440px] mx-auto space-y-6">
        <div className="lg:hidden flex flex-col items-center text-center space-y-2 pb-2">
          <div
            className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              borderColor: 'rgba(200, 164, 99, 0.55)',
              color: '#E5C158',
            }}
          >
            <span className="font-cinzel text-2xl font-extrabold">E</span>
          </div>
          <div>
            <span className="font-cinzel text-lg font-extrabold tracking-[0.16em] uppercase block" style={{ color: '#FAF6F0' }}>
              ECCLESIAM
            </span>
            <span className="text-[11px]" style={{ color: '#94A3B8' }}>
              Portal de Governança das Paróquias Clientes
            </span>
          </div>
        </div>

        <div
          className="rounded-3xl border p-6 sm:p-8 shadow-2xl space-y-6"
          style={{
            backgroundColor: '#0F1523',
            borderColor: 'rgba(200, 164, 99, 0.28)',
            boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.75)',
          }}
        >
          <div className="space-y-1.5">
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-tight" style={{ color: '#FAF6F0' }}>
              {mode === 'reset' ? 'Recuperar Credencial' : 'Acesso ao Dashboard'}
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
              {mode === 'reset'
                ? 'Informe seu e-mail cadastrado para receber as instruções de redefinição.'
                : 'Insira o e-mail cadastrado pela sua paróquia para carregar seu painel.'}
            </p>
          </div>

          <EcclesiamLoginModeTabs
            mode={mode}
            onSelectMode={switchMode}
            errorMsg={errorMsg}
            successMsg={successMsg}
          />

          <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicOrReset} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="ecclesiam-email" className="text-xs font-semibold block" style={{ color: '#E2E8F0' }}>
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#64748B' }} />
                <input
                  id="ecclesiam-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@suaparoquia.org.br"
                  className="w-full rounded-xl border pl-10 pr-4 py-3 text-xs sm:text-sm min-h-[46px] focus:outline-none"
                  style={{ backgroundColor: '#090D16', borderColor: 'rgba(148, 163, 184, 0.24)', color: '#F8FAFC' }}
                />
              </div>
            </div>

            {mode === 'password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="ecclesiam-password" className="text-xs font-semibold" style={{ color: '#E2E8F0' }}>
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-[11px] font-semibold hover:underline cursor-pointer"
                    style={{ color: '#E5C158' }}
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#64748B' }} />
                  <input
                    id="ecclesiam-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border pl-10 pr-11 py-3 text-xs sm:text-sm min-h-[46px] focus:outline-none"
                    style={{ backgroundColor: '#090D16', borderColor: 'rgba(148, 163, 184, 0.24)', color: '#F8FAFC' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg cursor-pointer"
                    style={{ color: '#94A3B8' }}
                    aria-label="Mostrar ou ocultar senha"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider min-h-[48px] flex items-center justify-center gap-2 transition-all hover:brightness-105 disabled:opacity-50 cursor-pointer shadow-lg"
              style={{
                background: 'linear-gradient(90deg, #C8A463 0%, #E5C158 50%, #C8A463 100%)',
                color: '#090D16',
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'password'
                      ? 'Acessar Meu Dashboard'
                      : mode === 'magic'
                      ? 'Enviar Link de Acesso'
                      : 'Enviar Link de Recuperação'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => switchMode('password')}
                className="w-full py-2 text-xs font-semibold text-center hover:underline cursor-pointer"
                style={{ color: '#94A3B8' }}
              >
                ← Voltar para o login com senha
              </button>
            )}
          </form>

          <div
            className="pt-4 border-t flex flex-col items-center gap-2.5 text-center"
            style={{ borderColor: 'rgba(148, 163, 184, 0.14)' }}
          >
            <span className="text-[11px]" style={{ color: '#94A3B8' }}>
              É Coordenador de Comunidade ou equipe de uma paróquia cliente?
            </span>
            <button
              type="button"
              onClick={() => setRequestModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 min-h-[44px] transition-all hover:brightness-110 cursor-pointer"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.55)',
                borderColor: 'rgba(200, 164, 99, 0.3)',
                color: '#E2E8F0',
              }}
            >
              <UserPlus className="w-3.5 h-3.5" style={{ color: '#E5C158' }} />
              <span>Solicitar Credencial Pastoral</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-center" style={{ color: '#64748B' }}>
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: '#C8A463' }} />
          <span>Protegido por Criptografia TLS & Controle de Acesso Multi-Tenant</span>
        </div>
      </div>

      <EcclesiamAccessRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
    </>
  );
}
