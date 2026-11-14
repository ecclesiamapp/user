import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkServerRateLimit,
  extractClientIp,
  recordServerRateLimitFailure,
  resetServerRateLimit,
} from '@/lib/security/rateLimit';

test('extractClientIp extrai o primeiro IP válido de x-forwarded-for e x-real-ip', () => {
  const headersForwarded = new Headers({
    'x-forwarded-for': '203.0.113.42, 10.0.0.1',
  });
  assert.equal(extractClientIp(headersForwarded), '203.0.113.42');

  const headersRealIp = new Headers({ 'x-real-ip': '198.51.100.12' });
  assert.equal(extractClientIp(headersRealIp), '198.51.100.12');

  const emptyHeaders = new Headers();
  assert.equal(extractClientIp(emptyHeaders), 'unknown');
});

test('Rate limiter bloqueia após atingir maxAttempts e limpa no reset', () => {
  const key = `test-lock-${Date.now()}`;
  const cfg = { maxAttempts: 3, windowMs: 60_000, lockoutMs: 120_000 };

  assert.equal(checkServerRateLimit(key, cfg).allowed, true);

  const f1 = recordServerRateLimitFailure(key, cfg);
  assert.equal(f1.allowed, true);
  assert.equal(f1.remainingAttempts, 2);

  const f2 = recordServerRateLimitFailure(key, cfg);
  assert.equal(f2.allowed, true);
  assert.equal(f2.remainingAttempts, 1);

  const f3 = recordServerRateLimitFailure(key, cfg);
  assert.equal(f3.allowed, false);
  assert.equal(f3.remainingAttempts, 0);
  assert.ok(f3.retryAfterSeconds > 0);

  const blockedCheck = checkServerRateLimit(key, cfg);
  assert.equal(blockedCheck.allowed, false);

  resetServerRateLimit(key);
  const afterReset = checkServerRateLimit(key, cfg);
  assert.equal(afterReset.allowed, true);
  assert.equal(afterReset.remainingAttempts, 3);
});

