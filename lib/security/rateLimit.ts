/**
 * Rate Limiter em memória no servidor (sliding-window) para rotas de autenticação e APIs sensíveis.
 * Substitui o antigo rate-limit inseguro em localStorage.
 */

export interface RateLimitConfig {
  maxAttempts?: number;
  windowMs?: number;
  lockoutMs?: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
}

interface RateLimitBucket {
  attempts: number[];
  lockedUntil: number | null;
}

const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const DEFAULT_LOCKOUT_MS = 3 * 60 * 1000; // 3 minutos

const globalStore = globalThis as unknown as {
  __ecclesiamRateLimitMap?: Map<string, RateLimitBucket>;
};

const buckets: Map<string, RateLimitBucket> =
  globalStore.__ecclesiamRateLimitMap ?? new Map<string, RateLimitBucket>();

if (!globalStore.__ecclesiamRateLimitMap) {
  globalStore.__ecclesiamRateLimitMap = buckets;
}

function cleanupExpiredBuckets(now: number, windowMs: number): void {
  if (buckets.size < 250) return;
  for (const [key, bucket] of buckets.entries()) {
    const activeAttempts = bucket.attempts.filter((ts) => now - ts < windowMs);
    const lockActive = bucket.lockedUntil !== null && bucket.lockedUntil > now;
    if (activeAttempts.length === 0 && !lockActive) {
      buckets.delete(key);
    } else {
      bucket.attempts = activeAttempts;
      if (!lockActive) bucket.lockedUntil = null;
    }
  }
}

export function extractClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export function checkServerRateLimit(
  key: string,
  config: RateLimitConfig = {}
): RateLimitStatus {
  const now = Date.now();
  const maxAttempts = config.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const windowMs = config.windowMs ?? DEFAULT_WINDOW_MS;

  cleanupExpiredBuckets(now, windowMs);

  const existing = buckets.get(key);
  if (!existing) {
    return { allowed: true, remainingAttempts: maxAttempts, retryAfterSeconds: 0 };
  }

  if (existing.lockedUntil !== null && existing.lockedUntil > now) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.lockedUntil - now) / 1000)
    );
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  if (existing.lockedUntil !== null && existing.lockedUntil <= now) {
    existing.lockedUntil = null;
    existing.attempts = [];
  }

  existing.attempts = existing.attempts.filter((ts) => now - ts < windowMs);
  const remainingAttempts = Math.max(0, maxAttempts - existing.attempts.length);

  return {
    allowed: remainingAttempts > 0,
    remainingAttempts,
    retryAfterSeconds: 0,
  };
}

export function recordServerRateLimitFailure(
  key: string,
  config: RateLimitConfig = {}
): RateLimitStatus {
  const now = Date.now();
  const maxAttempts = config.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const windowMs = config.windowMs ?? DEFAULT_WINDOW_MS;
  const lockoutMs = config.lockoutMs ?? DEFAULT_LOCKOUT_MS;

  const bucket = buckets.get(key) ?? { attempts: [], lockedUntil: null };
  bucket.attempts = bucket.attempts.filter((ts) => now - ts < windowMs);
  bucket.attempts.push(now);

  if (bucket.attempts.length >= maxAttempts) {
    bucket.lockedUntil = now + lockoutMs;
    buckets.set(key, bucket);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(lockoutMs / 1000),
    };
  }

  buckets.set(key, bucket);
  return {
    allowed: true,
    remainingAttempts: Math.max(0, maxAttempts - bucket.attempts.length),
    retryAfterSeconds: 0,
  };
}

export function resetServerRateLimit(key: string): void {
  buckets.delete(key);
}

