import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  checkServerRateLimit,
  extractClientIp,
  recordServerRateLimitFailure,
} from '@/lib/security/rateLimit';
import { recordServerAuditEvent } from '@/lib/security/serverAuth';
import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

const RATE_CFG = {
  maxAttempts: 5,
  windowMs: 10 * 60 * 1000,
  lockoutMs: 5 * 60 * 1000,
};

function resolveSafeRedirectBase(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured && configured.startsWith('http')) {
    return configured.replace(/\/+$/, '');
  }
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
      mode?: 'magic' | 'reset';
    } | null;

    const cleanEmail = (body?.email || '').trim().toLowerCase();
    const mode = body?.mode === 'reset' ? 'reset' : 'magic';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Informe um e-mail válido.' },
        { status: 400 }
      );
    }

    const clientIp = extractClientIp(request.headers);
    const rateKey = `magic:${cleanEmail}::${clientIp}`;
    const rateStatus = checkServerRateLimit(rateKey, RATE_CFG);

    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Muitas solicitações seguidas. Aguarde alguns minutos e tente novamente.',
        },
        { status: 429 }
      );
    }

    recordServerRateLimitFailure(rateKey, RATE_CFG);

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    if (hasServiceRoleKey()) {
      const adminClient = createAdminClient();
      const { data: profile } = await adminClient
        .from('user_profiles')
        .select('id, status, parish_id, role')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (!profile) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'E-mail não localizado nos cadastros ativos. Solicite um novo acesso.',
          },
          { status: 404 }
        );
      }

      if (profile.status !== 'ativo') {
        return NextResponse.json(
          {
            ok: false,
            error:
              profile.status === 'pendente'
                ? 'Seu pedido de acesso ainda aguarda aprovação do administrador.'
                : 'Este acesso encontra-se bloqueado.',
          },
          { status: 403 }
        );
      }
    }

    const redirectBase = resolveSafeRedirectBase(request);

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${redirectBase}/admin?reset=1`,
      });
      if (error) {
        console.error('[auth/magic-link] resetPasswordForEmail:', error.message);
        return NextResponse.json(
          {
            ok: false,
            error:
              'Não foi possível enviar o link de redefinição. Utilize o acesso com senha ou contate o suporte.',
          },
          { status: 400 }
        );
      }

      await recordServerAuditEvent({
        email: cleanEmail,
        eventType: 'password_reset_requested',
        ipHint: clientIp,
        userAgent: request.headers.get('user-agent'),
      });

      return NextResponse.json({
        ok: true,
        message: 'Link de redefinição enviado! Verifique sua caixa de entrada.',
      });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${redirectBase}/admin`,
        shouldCreateUser: false,
      },
    });

    if (error) {
      console.error('[auth/magic-link] signInWithOtp:', error.message);
      return NextResponse.json(
        {
          ok: false,
          error:
            "Utilize a aba 'Com Senha' para seu primeiro acesso ou solicite suporte ao administrador.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        'Link mágico enviado! Verifique sua caixa de entrada (e spam) para entrar.',
    });
  } catch (err) {
    console.error('[auth/magic-link] Erro interno:', err);
    return NextResponse.json(
      { ok: false, error: 'Erro interno ao processar solicitação.' },
      { status: 500 }
    );
  }
}

