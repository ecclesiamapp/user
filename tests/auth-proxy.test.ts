import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';

process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key-placeholder';

import { proxy } from '@/proxy';

test('proxy bloqueia acesso anônimo a /admin e /admin/usuarios redirecionando para /login', async () => {
  const reqRootAdmin = new NextRequest('https://ecclesiamapp.com.br/admin');
  const resRootAdmin = await proxy(reqRootAdmin);
  assert.equal(resRootAdmin.status, 307);
  assert.equal(
    resRootAdmin.headers.get('location'),
    'https://ecclesiamapp.com.br/login'
  );

  const reqSubAdmin = new NextRequest(
    'https://ecclesiamapp.com.br/admin/usuarios'
  );
  const resSubAdmin = await proxy(reqSubAdmin);
  assert.equal(resSubAdmin.status, 307);
  assert.equal(
    resSubAdmin.headers.get('location'),
    'https://ecclesiamapp.com.br/login?next=%2Fadmin%2Fusuarios'
  );
});

test('proxy rejeita cookie legado forjável ecclesiam_admin_active=true sem JWT Supabase', async () => {
  const reqForgedCookie = new NextRequest('https://ecclesiamapp.com.br/admin', {
    headers: {
      cookie: 'ecclesiam_admin_active=true; ecclesiam_user_role=superadmin',
    },
  });
  const resForged = await proxy(reqForgedCookie);
  assert.equal(resForged.status, 307);
  assert.equal(
    resForged.headers.get('location'),
    'https://ecclesiamapp.com.br/login'
  );
});

test('proxy retorna 401 JSON para /api/admin/** e /api/upload sem sessão JWT', async () => {
  const protectedEndpoints = [
    'https://ecclesiamapp.com.br/api/admin/ai-assistant',
    'https://ecclesiamapp.com.br/api/admin/ai/sync-database',
    'https://ecclesiamapp.com.br/api/admin/brand/extract',
    'https://ecclesiamapp.com.br/api/upload',
  ];

  for (const url of protectedEndpoints) {
    const req = new NextRequest(url, { method: 'POST' });
    const res = await proxy(req);
    assert.equal(res.status, 401, `Esperado 401 para ${url}`);
    const body = (await res.json()) as { error?: string };
    assert.ok(body.error);
  }
});

test('proxy bloqueia /admin e /login no domínio público da paróquia', async () => {
  const reqParishAdmin = new NextRequest(
    'https://catedraldecolatina.org.br/admin',
    {
      headers: { host: 'catedraldecolatina.org.br' },
    }
  );
  const res = await proxy(reqParishAdmin);
  assert.equal(res.status, 307);
  assert.equal(
    res.headers.get('location'),
    'https://ecclesiamapp.com.br/login'
  );
});

