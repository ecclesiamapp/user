import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';

process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key-placeholder';

import { escapeHtml } from '@/utils/resend';
import {
  MAX_IMAGE_UPLOAD_BYTES,
  detectMimeFromMagicBytes,
  validateUploadBuffer,
} from '@/lib/security/uploadValidation';
import { POST as certificatesPost } from '@/app/api/secretaria/certificates/route';
import { POST as sacramentsPost } from '@/app/api/secretaria/sacraments/route';
import { POST as dizimoRegisterPost } from '@/app/api/dizimo/register/route';

test('escapeHtml neutraliza tags HTML e aspas contra injeção em e-mails (SEC-001)', () => {
  const dirty = '<script>alert("xss")</script>&\'test\'';
  const clean = escapeHtml(dirty);
  assert.equal(clean.includes('<'), false);
  assert.equal(clean.includes('>'), false);
  assert.equal(clean.includes('"'), false);
  assert.equal(clean, '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;&amp;&#39;test&#39;');
});

test('validateUploadBuffer rejeita SVG/HTML disfarçado e valida magic bytes reais (SEC-008)', () => {
  const svgPayload = Buffer.from('<svg onload="alert(1)"></svg>', 'utf8');
  const svgResult = validateUploadBuffer({
    buffer: svgPayload,
    declaredMime: 'image/svg+xml',
    filename: 'logo.svg',
  });
  assert.equal(svgResult.ok, false);

  const spoofedPng = Buffer.from('<html><body>xss</body></html>', 'utf8');
  const spoofResult = validateUploadBuffer({
    buffer: spoofedPng,
    declaredMime: 'image/png',
    filename: 'fake.png',
  });
  assert.equal(spoofResult.ok, false);

  const validPngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
  assert.equal(detectMimeFromMagicBytes(validPngHeader), 'image/png');
  const validResult = validateUploadBuffer({
    buffer: validPngHeader,
    declaredMime: 'image/png',
    filename: 'brasao.png',
  });
  assert.deepEqual(validResult, { ok: true, mimeType: 'image/png' });

  const oversized = Buffer.alloc(MAX_IMAGE_UPLOAD_BYTES + 1);
  oversized[0] = 0xff;
  oversized[1] = 0xd8;
  oversized[2] = 0xff;
  const oversizedResult = validateUploadBuffer({
    buffer: oversized,
    declaredMime: 'image/jpeg',
    filename: 'foto.jpg',
  });
  assert.equal(oversizedResult.ok, false);
  if (!oversizedResult.ok) {
    assert.equal(oversizedResult.status, 413);
  }
});

test('POST /api/secretaria/certificates valida campos obrigatórios e idempotency_key (BUG-001)', async () => {
  const reqMissingKey = new NextRequest('https://ecclesiamapp.com.br/api/secretaria/certificates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '198.51.100.88',
    },
    body: JSON.stringify({
      parish_id: 'c0000000-0000-0000-0000-000000000001',
      certificate_type: 'batismo',
      holder_name: 'João da Silva',
      applicant_name: 'Maria da Silva',
      applicant_phone: '(27) 99999-8888',
    }),
  });

  const res = await certificatesPost(reqMissingKey);
  assert.equal(res.status, 400);
});

test('POST /api/secretaria/sacraments valida campos obrigatórios e idempotency_key (VAL-001)', async () => {
  const reqMissingKey = new NextRequest('https://ecclesiamapp.com.br/api/secretaria/sacraments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '198.51.100.89',
    },
    body: JSON.stringify({
      parish_id: 'c0000000-0000-0000-0000-000000000001',
      sacrament_type: 'batismo',
      applicant_name: 'Maria da Silva',
      applicant_phone: '(27) 99999-8888',
    }),
  });

  const res = await sacramentsPost(reqMissingKey);
  assert.equal(res.status, 400);
});

test('POST /api/dizimo/register rejeita e-mail malformado (HTTP 400)', async () => {
  const req = new NextRequest('https://ecclesiamapp.com.br/api/dizimo/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '198.51.100.90',
    },
    body: JSON.stringify({
      fullName: 'José Pereira',
      phone: '27999998888',
      email: 'email-invalido',
    }),
  });

  const res = await dizimoRegisterPost(req);
  assert.equal(res.status, 400);
});
