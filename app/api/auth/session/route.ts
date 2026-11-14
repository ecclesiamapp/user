import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  resolveProfileForAuthUser,
  sanitizeUserProfile,
} from '@/lib/security/serverAuth';
import type { Parish } from '@/types';
import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({
        authenticated: false,
        profile: null,
        parish: null,
      });
    }

    const profile = await resolveProfileForAuthUser(user, supabase);
    if (!profile || profile.status !== 'ativo') {
      return NextResponse.json({
        authenticated: false,
        profile: null,
        parish: null,
      });
    }

    let parish: Parish | null = null;
    if (profile.parish_id) {
      const reader = hasServiceRoleKey() ? createAdminClient() : supabase;
      const { data } = await reader
        .from('parishes')
        .select('*')
        .eq('id', profile.parish_id)
        .maybeSingle();
      parish = (data as Parish) ?? null;
    }

    if (
      profile.role !== 'superadmin' &&
      parish &&
      parish.subscription_status === 'suspensa'
    ) {
      return NextResponse.json({
        authenticated: false,
        profile: null,
        parish: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      profile: sanitizeUserProfile(profile),
      parish,
    });
  } catch (err) {
    console.error('[auth/session] Erro ao consultar sessão:', err);
    return NextResponse.json(
      { authenticated: false, profile: null, parish: null },
      { status: 500 }
    );
  }
}

