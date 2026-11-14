import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { extractClientIp } from '@/lib/security/rateLimit';
import {
  recordServerAuditEvent,
  resolveProfileForAuthUser,
} from '@/lib/security/serverAuth';
import { createClient } from '@/utils/supabase/server';

const LEGACY_SESSION_COOKIES = [
  'ecclesiam_admin_active',
  'ecclesiam_user_id',
  'ecclesiam_parish_id',
  'ecclesiam_user_role',
];

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const profile = await resolveProfileForAuthUser(user, supabase);
      await recordServerAuditEvent({
        email: user.email || profile?.email || 'desconhecido@ecclesiamapp.com.br',
        eventType: 'logout',
        parishId: profile?.parish_id ?? null,
        userProfileId: profile?.id ?? null,
        role: profile?.role ?? null,
        ipHint: extractClientIp(request.headers),
        userAgent: request.headers.get('user-agent'),
      });
    }

    await supabase.auth.signOut();

    const response = NextResponse.json({ ok: true });
    LEGACY_SESSION_COOKIES.forEach((cookieName) => {
      response.cookies.set(cookieName, '', {
        path: '/',
        maxAge: 0,
      });
    });

    return response;
  } catch (err) {
    console.error('[auth/logout] Erro ao encerrar sessão:', err);
    return NextResponse.json(
      { ok: false, error: 'Falha ao encerrar sessão.' },
      { status: 500 }
    );
  }
}

