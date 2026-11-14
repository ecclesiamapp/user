import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  checkServerRateLimit,
  extractClientIp,
  recordServerRateLimitFailure,
  resetServerRateLimit,
} from '@/lib/security/rateLimit';
import {
  recordServerAuditEvent,
  resolveProfileForAuthUser,
  sanitizeUserProfile,
} from '@/lib/security/serverAuth';
import type { Parish, UserProfile } from '@/types';
import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

async function loadParishForProfile(
  parishId: string | null | undefined,
  fallbackClient: ReturnType<typeof createClient>
): Promise<Parish | null> {
  if (!parishId) return null;
  const reader = hasServiceRoleKey() ? createAdminClient() : fallbackClient;
  const { data } = await reader
    .from('parishes')
    .select('*')
    .eq('id', parishId)
    .maybeSingle();
  return (data as Parish) ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
      password?: string;
    } | null;

    const cleanEmail = (body?.email || '').trim().toLowerCase();
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!cleanEmail || !password) {
      return NextResponse.json(
        { ok: false, error: 'Informe o e-mail e a senha de acesso.' },
        { status: 400 }
      );
    }

    const clientIp = extractClientIp(request.headers);
    const userAgent = request.headers.get('user-agent');
    const rateKey = `login:${cleanEmail}::${clientIp}`;
    const rateStatus = checkServerRateLimit(rateKey);

    if (!rateStatus.allowed) {
      await recordServerAuditEvent({
        email: cleanEmail,
        eventType: 'login_blocked_rate_limit',
        ipHint: clientIp,
        userAgent,
        metadata: { retryAfterSeconds: rateStatus.retryAfterSeconds },
      });

      return NextResponse.json(
        {
          ok: false,
          lockedOut: true,
          retryAfterSeconds: rateStatus.retryAfterSeconds,
          error: `Muitas tentativas de login. Aguarde ${Math.ceil(
            rateStatus.retryAfterSeconds / 60
          )} minuto(s) e tente novamente.`,
        },
        { status: 429 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Tentativa oficial via Supabase Auth (JWT HttpOnly via @supabase/ssr)
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

    if (!authError && authData.user) {
      const profile = await resolveProfileForAuthUser(authData.user, supabase);

      if (!profile) {
        await supabase.auth.signOut();
        return NextResponse.json(
          {
            ok: false,
            error: 'Conta não vinculada a um perfil administrativo ativo.',
          },
          { status: 403 }
        );
      }

      if (profile.status === 'pendente') {
        await supabase.auth.signOut();
        return NextResponse.json(
          {
            ok: false,
            error:
              'Seu pedido de acesso ainda aguarda aprovação do Administrador da Paróquia.',
          },
          { status: 403 }
        );
      }

      if (profile.status === 'bloqueado') {
        await supabase.auth.signOut();
        return NextResponse.json(
          {
            ok: false,
            error: 'Este acesso foi bloqueado pela administração.',
          },
          { status: 403 }
        );
      }

      const parish = await loadParishForProfile(profile.parish_id, supabase);
      if (
        profile.role !== 'superadmin' &&
        parish &&
        parish.subscription_status === 'suspensa'
      ) {
        await supabase.auth.signOut();
        return NextResponse.json(
          {
            ok: false,
            error:
              'O acesso desta paróquia foi temporariamente suspenso pela administração do sistema. Contate o suporte.',
          },
          { status: 403 }
        );
      }

      const writer = hasServiceRoleKey() ? createAdminClient() : supabase;
      await writer
        .from('user_profiles')
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq('id', profile.id);

      resetServerRateLimit(rateKey);
      await recordServerAuditEvent({
        email: cleanEmail,
        eventType: 'login_success',
        parishId: profile.parish_id ?? null,
        userProfileId: profile.id,
        role: profile.role,
        ipHint: clientIp,
        userAgent,
      });

      return NextResponse.json({
        ok: true,
        profile: sanitizeUserProfile(profile),
        parish,
      });
    }

    // 2. Ponte de migração para contas pré-cadastradas com access_code no banco
    // (sem nenhuma senha padrão hardcoded no código-fonte).
    if (hasServiceRoleKey()) {
      const adminClient = createAdminClient();
      const { data: legacyProfile } = await adminClient
        .from('user_profiles')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (legacyProfile) {
        const typedProfile = legacyProfile as UserProfile;

        if (typedProfile.status === 'pendente') {
          const nextLimit = recordServerRateLimitFailure(rateKey);
          return NextResponse.json(
            {
              ok: false,
              remainingAttempts: nextLimit.remainingAttempts,
              error:
                'Seu pedido de acesso ainda aguarda aprovação do Administrador da Paróquia.',
            },
            { status: 403 }
          );
        }

        if (typedProfile.status === 'bloqueado') {
          const nextLimit = recordServerRateLimitFailure(rateKey);
          return NextResponse.json(
            {
              ok: false,
              remainingAttempts: nextLimit.remainingAttempts,
              error: 'Este acesso foi bloqueado pela administração.',
            },
            { status: 403 }
          );
        }

        const storedAccessCode = (typedProfile.access_code || '').trim();
        if (storedAccessCode.length > 0 && password === storedAccessCode) {
          const parish = await loadParishForProfile(
            typedProfile.parish_id,
            supabase
          );
          if (
            typedProfile.role !== 'superadmin' &&
            parish &&
            parish.subscription_status === 'suspensa'
          ) {
            return NextResponse.json(
              {
                ok: false,
                error:
                  'O acesso desta paróquia foi temporariamente suspenso pela administração do sistema. Contate o suporte.',
              },
              { status: 403 }
            );
          }

          let linkedUserId = typedProfile.user_id || null;

          if (!linkedUserId) {
            const { data: createdAuth, error: createErr } =
              await adminClient.auth.admin.createUser({
                email: cleanEmail,
                password,
                email_confirm: true,
                user_metadata: { name: typedProfile.name },
                app_metadata: {
                  role: typedProfile.role,
                  parish_id: typedProfile.parish_id ?? null,
                  profile_id: typedProfile.id,
                },
              });

            if (!createErr && createdAuth.user) {
              linkedUserId = createdAuth.user.id;
            }
          }

          if (linkedUserId) {
            await adminClient
              .from('user_profiles')
              .update({
                user_id: linkedUserId,
                last_sign_in_at: new Date().toISOString(),
              })
              .eq('id', typedProfile.id);

            const { data: signedInAfterMigration, error: secondSignInErr } =
              await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
              });

            if (!secondSignInErr && signedInAfterMigration.user) {
              resetServerRateLimit(rateKey);
              await recordServerAuditEvent({
                email: cleanEmail,
                eventType: 'login_success',
                parishId: typedProfile.parish_id ?? null,
                userProfileId: typedProfile.id,
                role: typedProfile.role,
                ipHint: clientIp,
                userAgent,
                metadata: { migratedFromLegacyProfile: true },
              });

              return NextResponse.json({
                ok: true,
                profile: sanitizeUserProfile({
                  ...typedProfile,
                  user_id: linkedUserId,
                }),
                parish,
              });
            }
          }
        }
      }
    } else {
      console.warn(
        '[auth/login] SUPABASE_SERVICE_ROLE_KEY não configurada: ponte de migração de contas legadas desabilitada.'
      );
    }

    const updatedRate = recordServerRateLimitFailure(rateKey);
    await recordServerAuditEvent({
      email: cleanEmail,
      eventType: 'login_failed',
      ipHint: clientIp,
      userAgent,
      metadata: { remainingAttempts: updatedRate.remainingAttempts },
    });

    if (!updatedRate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          lockedOut: true,
          retryAfterSeconds: updatedRate.retryAfterSeconds,
          remainingAttempts: 0,
          error:
            'Muitas tentativas incorretas. Acesso temporariamente bloqueado por 3 minutos.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        remainingAttempts: updatedRate.remainingAttempts,
        error: 'E-mail ou senha de acesso incorretos.',
      },
      { status: 401 }
    );
  } catch (err) {
    console.error('[auth/login] Erro interno:', err);
    return NextResponse.json(
      { ok: false, error: 'Erro interno ao processar autenticação.' },
      { status: 500 }
    );
  }
}

