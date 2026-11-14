import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';

process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key-placeholder';

import { toFriendlyErrorMessage } from '@/lib/security/friendlyError';
import {
  clearIdempotencyMemoryCache,
  generateIdempotencyKey,
  isValidIdempotencyKey,
  runWithIdempotency,
} from '@/lib/security/idempotency';
import { POST as appointmentsPost } from '@/app/api/secretaria/appointments/route';
import { POST as intentionsPost } from '@/app/api/secretaria/intentions/route';

test('toFriendlyErrorMessage oculta vazamentos SQL/Postgres e traduz erros comuns', () => {
  assert.equal(
    toFriendlyErrorMessage({ code: '23505', message: 'duplicate key value violates unique constraint' }),
    'Este registro já foi enviado ou já está cadastrado no sistema.'
  );

  assert.equal(
    toFriendlyErrorMessage(new Error('Invalid login credentials')),
    'E-mail ou senha incorretos. Confira seus dados e tente novamente.'
  );

  assert.equal(
    toFriendlyErrorMessage(new TypeError('Failed to fetch')),
    'Conexão instável com o servidor. Verifique sua internet (Wi-Fi ou 3G/4G) e tente novamente.'
  );

  assert.equal(
    toFriendlyErrorMessage(
      new Error('PGRST204: Could not find the column "secret_token" in schema cache'),
      'Falha segura.'
    ),
    'Falha segura.'
  );

  assert.equal(
    toFriendlyErrorMessage(new Error('Nenhum arquivo enviado.')),
    'Nenhum arquivo enviado.'
  );
});

test('runWithIdempotency deduplica toques duplos simultâneos e repetições', async () => {
  clearIdempotencyMemoryCache();
  const key = generateIdempotencyKey('ag');
  assert.equal(isValidIdempotencyKey(key), true);
  assert.equal(isValidIdempotencyKey('ab'), false);
  assert.equal(isValidIdempotencyKey('invalid key with spaces'), false);

  let executions = 0;
  const slowInsert = async () => {
    executions += 1;
    await new Promise((r) => setTimeout(r, 20));
    return { protocol: 'AG-261234' };
  };

  const [first, second] = await Promise.all([
    runWithIdempotency('appointments:c001', key, slowInsert),
    runWithIdempotency('appointments:c001', key, slowInsert),
  ]);

  assert.equal(executions, 1);
  assert.equal(first.result.protocol, 'AG-261234');
  assert.equal(second.result.protocol, 'AG-261234');
  assert.equal(first.deduplicated, false);
  assert.equal(second.deduplicated, true);

  const third = await runWithIdempotency('appointments:c001', key, slowInsert);
  assert.equal(executions, 1);
  assert.equal(third.deduplicated, true);
});

test('POST /api/secretaria/appointments e /intentions exigem idempotency_key válida (HTTP 400)', async () => {
  const appointmentReq = new NextRequest(
    'https://ecclesiamapp.com.br/api/secretaria/appointments',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parish_id: 'c0000000-0000-0000-0000-000000000001',
        parishioner_name: 'José da Silva',
        parishioner_phone: '(27) 99999-1111',
        appointment_date: '2026-11-20',
        appointment_time: '15:00',
        idempotency_key: 'short',
      }),
    }
  );
  const appointmentRes = await appointmentsPost(appointmentReq);
  assert.equal(appointmentRes.status, 400);

  const intentionReq = new NextRequest(
    'https://ecclesiamapp.com.br/api/secretaria/intentions',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parish_id: 'c0000000-0000-0000-0000-000000000001',
        celebration_date: '2026-11-22',
        celebration_time: '18:00',
        entries: [{ type: 'acao_gracas', names: ['Família Silva'] }],
      }),
    }
  );
  const intentionRes = await intentionsPost(intentionReq);
  assert.equal(intentionRes.status, 400);
});

