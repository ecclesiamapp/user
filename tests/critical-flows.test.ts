import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';

process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key-placeholder';

import { POST as notificationsPost } from '@/app/api/notifications/route';
import { POST as dizimoRegisterPost } from '@/app/api/dizimo/register/route';
import { dispatchTransactionalNotification } from '@/lib/notifications/dispatchNotification';

test('POST /api/notifications bloqueia chamadas anônimas sem sessão ou segredo interno (HTTP 401)', async () => {
  const prevSecret = process.env.INTERNAL_NOTIFICATION_SECRET;
  delete process.env.INTERNAL_NOTIFICATION_SECRET;

  try {
    const req = new NextRequest('https://ecclesiamapp.com.br/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'appointment', protocol: 'AGD-2026-9999' }),
    });

    const res = await notificationsPost(req);
    assert.equal(res.status, 401);
  } finally {
    if (prevSecret !== undefined) {
      process.env.INTERNAL_NOTIFICATION_SECRET = prevSecret;
    }
  }
});

test('POST /api/notifications com segredo interno rejeita payload sem type ou protocol (HTTP 400)', async () => {
  const prevSecret = process.env.INTERNAL_NOTIFICATION_SECRET;
  process.env.INTERNAL_NOTIFICATION_SECRET = 'test-internal-secret-123';

  try {
    const req = new NextRequest('https://ecclesiamapp.com.br/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ecclesiam-internal-key': 'test-internal-secret-123',
      },
      body: JSON.stringify({ type: 'appointment' }),
    });

    const res = await notificationsPost(req);
    assert.equal(res.status, 400);
  } finally {
    if (prevSecret !== undefined) {
      process.env.INTERNAL_NOTIFICATION_SECRET = prevSecret;
    } else {
      delete process.env.INTERNAL_NOTIFICATION_SECRET;
    }
  }
});

test('dispatchTransactionalNotification processa confirmações de agendamento e dízimo corretamente', async () => {
  const prevResend = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  try {
    const res = await dispatchTransactionalNotification({
      type: 'appointment',
      protocol: 'AGD-2026-9999',
      parishionerName: 'Maria da Penha',
      parishionerPhone: '27999990000',
      parishionerEmail: 'maria@exemplo.com.br',
      appointmentTypeLabel: 'Confissão',
      priestName: 'Pe. Irineu Claudino Sales',
      formattedDate: '20/11/2026',
      time: '15:00',
      communityName: 'Catedral Diocesana',
    });

    assert.equal(res.ok, true);
    assert.equal(res.type, 'appointment');
    assert.equal(res.protocol, 'AGD-2026-9999');
  } finally {
    if (prevResend !== undefined) {
      process.env.RESEND_API_KEY = prevResend;
    }
  }
});

test('POST /api/dizimo/register exige nome completo e telefone (HTTP 400)', async () => {
  const req = new NextRequest('https://ecclesiamapp.com.br/api/dizimo/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: '', phone: '' }),
  });

  const res = await dizimoRegisterPost(req);
  assert.equal(res.status, 400);
});
