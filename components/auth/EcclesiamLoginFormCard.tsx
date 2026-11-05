'use client';

import React, { useState, useEffect } from 'react';
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
  Clock,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
  authenticateEcclesiamUser,
  getRateLimitState,
  recordSecurityAudit,
} from '@/lib/security/authSecurity';
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
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  useEffect(() => {
    const syncRateLimit = () => {
      const state = getRateLimitState();
      if (state.lockedUntil && state.lockedUntil > Date.now()) {
        setLockoutSeconds(Math.ceil((state.lockedUntil - Date.now()) / 1000));
      } else {
        setLockoutSeconds(0);
      }
    };
    syncRateLimit();
    const timer = setInterval(syncRateLimit, 1000);
    return () => clearInterval(timer);
  }, []);

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
        const state = getRateLimitState();
        if (state.lockedUntil && state.lockedUntil > Date.now()) {
          setLockoutSeconds(Math.ceil((state.lockedUntil - Date.now()) / 1000));
        }
        setLoading(false);
        return;
      }

      setSuccessMsg(
        `Credencial validada! Abrindo painel${
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
      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'https://ecclesiamapp.com.br';

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

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#FCF7F1',
    borderColor: '#E8DFD3',
    color: '#2D1A16',
  };

  return (
    <>
      <div className="w-full max-w-[430px] mx-auto space-y-6">
        {/* Topo Limpo: Logotipo Oficial Ecclesiam App */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div
            className="px-7 py-5 rounded-3xl border shadow-xl flex flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #2D1A16 0%, #4A1518 55%, #8B1E22 100%)',
              borderColor: 'rgba(255, 204, 54, 0.45)',
              boxShadow: '0 18px 40px -12px rgba(45, 26, 22, 0.35)',
            }}
          >
            <img
              src="/images/ecclesiam-logo-light.webp"
              alt="Ecclesiam App"
              className="h-24 sm:h-28 w-auto object-contain select-none"
            />
          </div>
          <p className="text-xs font-semibold tracking-wide pt-1" style={{ color: '#514D4B' }}>
            Portal de Acesso & Governança das Paróquias
          </p>
        </div>

        {/* Card Central de Autenticação & Cadastro */}
        <div
          className="rounded-3xl border p-6 sm:p-8 space-y-5"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E8DFD3',
            boxShadow: '0 20px 50px -15px rgba(45, 26, 22, 0.12)',
          }}
        >
          <div className="text-center space-y-1">
            <h1
              className="font-cinzel text-xl sm:text-2xl font-bold tracking-tight"
              style={{ color: '#2D1A16' }}
            >
              {mode === 'reset' ? 'Recuperar Credencial' : 'Acesso ao Painel'}
            </h1>
            <p className="text-xs leading-relaxed" style={{ color: '#514D4B' }}>
              {mode === 'reset'
                ? 'Informe seu e-mail cadastrado para receber o link de redefinição.'
                : 'Entre com seu e-mail paroquial credenciado para carregar seu dashboard.'}
            </p>
          </div>

          <EcclesiamLoginModeTabs
            mode={mode}
            onSelectMode={switchMode}
            errorMsg={errorMsg}
            successMsg={successMsg}
          />

          {lockoutSeconds > 0 && (
            <div
              className="p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold"
              style={{
                backgroundColor: 'rgba(183, 83, 25, 0.1)',
                borderColor: 'rgba(183, 83, 25, 0.3)',
                color: '#B75319',
              }}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Bloqueio temporário de segurança: aguarde {lockoutSeconds}s</span>
            </div>
          )}

          <form
            onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicOrReset}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="ecclesiam-email"
                className="text-xs font-bold block"
                style={{ color: '#2D1A16' }}
              >
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail
                  className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#86898C' }}
                />
                <input
                  id="ecclesiam-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@suaparoquia.org.br"
                  className="w-full rounded-xl border pl-10 pr-4 py-3 text-xs sm:text-sm min-h-[46px] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/25 transition-all"
                  style={inputStyle}
                />
              </div>
            </div>

            {mode === 'password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ecclesiam-password"
                    className="text-xs font-bold"
                    style={{ color: '#2D1A16' }}
                  >
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-[11px] font-bold hover:underline cursor-pointer"
                    style={{ color: '#8B1E22' }}
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#86898C' }}
                  />
                  <input
                    id="ecclesiam-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border pl-10 pr-11 py-3 text-xs sm:text-sm min-h-[46px] focus:outline-none focus:ring-2 focus:ring-[#8B1E22]/25 transition-all"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg cursor-pointer"
                    style={{ color: '#514D4B' }}
                    aria-label="Mostrar ou ocultar senha"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || lockoutSeconds > 0}
              className="w-full py-3.5 px-5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider min-h-[48px] flex items-center justify-center gap-2 transition-all hover:brightness-105 disabled:opacity-50 cursor-pointer shadow-md"
              style={{
                background: 'linear-gradient(90deg, #FFA82A 0%, #FFCC36 50%, #FFA82A 100%)',
                color: '#2D1A16',
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'password'
                      ? 'Acessar Meu Painel'
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
                className="w-full py-2 text-xs font-bold text-center hover:underline cursor-pointer"
                style={{ color: '#514D4B' }}
              >
                ← Voltar para o login com senha
              </button>
            )}
          </form>

          {/* Divisória + Botão do Modal de Cadastro / Solicitação de Credencial */}
          <div
            className="pt-4 border-t flex flex-col items-center gap-2.5 text-center"
            style={{ borderColor: '#E8DFD3' }}
          >
            <span className="text-[11px] font-medium" style={{ color: '#514D4B' }}>
              Ainda não possui credencial ou é novo colaborador da paróquia?
            </span>
            <button
              type="button"
              onClick={() => setRequestModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 min-h-[44px] transition-all hover:brightness-95 cursor-pointer"
              style={{
                backgroundColor: '#F5EFE7',
                borderColor: '#E8DFD3',
                color: '#2D1A16',
              }}
            >
              <UserPlus className="w-4 h-4" style={{ color: '#8B1E22' }} />
              <span>Solicitar Cadastro / Credencial Pastoral</span>
            </button>
          </div>
        </div>

        {/* Selo de Segurança Discreto */}
        <div
          className="flex items-center justify-center gap-2 text-[11px] text-center font-medium"
          style={{ color: '#514D4B' }}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#8B1E22' }} />
          <span>Isolamento Multi-Paróquia & Proteção LGPD</span>
        </div>
      </div>

      <EcclesiamAccessRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
    </>
  );
}
