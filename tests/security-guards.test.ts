import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';

process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key-placeholder';

import { createAdminClient, hasServiceRoleKey } from '@/utils/supabase/admin';
import {
  ADMIN_PANEL_ROLES,
  USER_PROFILE_SAFE_COLUMNS,
} from '@/lib/security/serverAuth';
import { POST as loginPost } from '@/app/api/auth/login/route';
import { POST as requestAccessPost } from '@/app/api/auth/request-access/route';

test('createAdminClient exige SUPABASE_SERVICE_ROLE_KEY sem fallback silencioso para ANON_KEY', () => {
  const previousServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    assert.equal(hasServiceRoleKey(), false);
    assert.throws(
      () => createAdminClient(),
      /SUPABASE_SERVICE_ROLE_KEY/
    );
  } finally {
    if (previousServiceKey !== undefined) {
      process.env.SUPABASE_SERVICE_ROLE_KEY = previousServiceKey;
    }
  }
});

test('USER_PROFILE_SAFE_COLUMNS nunca seleciona access_code e ADMIN_PANEL_ROLES inclui os 6 papéis', () => {
  const columns = USER_PROFILE_SAFE_COLUMNS.split(',').map((c) => c.trim());
  assert.equal(columns.includes('access_code'), false);
  assert.deepEqual([...ADMIN_PANEL_ROLES].sort(), [
    'coordenador_ceb',
    'paroco',
    'pascom',
    'secretaria',
    'superadmin',
    'vigario',
  ]);
});

test('POST /api/auth/login valida campos obrigatórios retornando HTTP 400', async () => {
  const req = new NextRequest('https://ecclesiamapp.com.br/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '', password: '' }),
  });

  const res = await loginPost(req);
  assert.equal(res.status, 400);
  const json = (await res.json()) as { ok: boolean; error?: string };
  assert.equal(json.ok, false);
  assert.ok(json.error);
});

test('POST /api/auth/request-access bloqueia auto-atribuição de superadmin ou paroco', async () => {
  for (const forbiddenRole of ['superadmin', 'paroco']) {
    const req = new NextRequest(
      'https://ecclesiamapp.com.br/api/auth/request-access',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '198.51.100.77',
        },
        body: JSON.stringify({
          name: 'Usuário Teste',
          email: 'teste@paroquia.org.br',
          role: forbiddenRole,
          parish_id: 'c0000000-0000-0000-0000-000000000001',
        }),
      }
    );

    const res = await requestAccessPost(req);
    assert.equal(res.status, 400, `Deveria bloquear role=${forbiddenRole}`);
  }
});

