import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';

process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key-placeholder';

import { POST as notificationsPost } from '@/app/api/notifications/route';
import { POST as dizimoRegisterPost } from '@/app/api/dizimo/register/route';

test('POST /api/notifications rejeita payload sem type ou protocol (HTTP 400)', async () => {
  const req = new NextRequest('https://ecclesiamapp.com.br/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'appointment' }),
  });

  const res = await notificationsPost(req);
  assert.equal(res.status, 400);
});

test('POST /api/notifications processa confirmações de agendamento e dízimo corretamente', async () => {
  const prevResend = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  try {
    const appointmentReq = new NextRequest(
      'https://ecclesiamapp.com.br/api/notifications',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      }
    );

    const res = await notificationsPost(appointmentReq);
    assert.equal(res.status, 200);
    const json = (await res.json()) as {
      success?: boolean;
      type?: string;
      protocol?: string;
    };
    assert.equal(json.success, true);
    assert.equal(json.type, 'appointment');
    assert.equal(json.protocol, 'AGD-2026-9999');
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

