/**
 * Utilitário compartilhado de Idempotência para evitar duplicidade de envios
 * (Intenções de Santa Missa e Agendamentos Pastorais) em conexões 3G/4G instáveis.
 */

const IDEMPOTENCY_KEY_REGEX = /^[a-zA-Z0-9_-]{8,128}$/;
const DEFAULT_TTL_MS = 15 * 60 * 1000;
const MAX_CACHE_ENTRIES = 1000;

interface CachedIdempotentResult<T> {
  value: T;
  expiresAt: number;
}

const completedResults = new Map<string, CachedIdempotentResult<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();

export function isValidIdempotencyKey(value: unknown): value is string {
  return typeof value === 'string' && IDEMPOTENCY_KEY_REGEX.test(value.trim());
}

/**
 * Gera chave de idempotência segura no navegador ou servidor.
 */
export function generateIdempotencyKey(prefix = 'req'): string {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return `${prefix}_${globalThis.crypto.randomUUID()}`;
  }
  const randomPart = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
  return `${prefix}_${randomPart}`;
}

function pruneExpiredCache(now: number): void {
  if (completedResults.size <= MAX_CACHE_ENTRIES) return;
  for (const [k, entry] of completedResults.entries()) {
    if (entry.expiresAt <= now || completedResults.size > MAX_CACHE_ENTRIES) {
      completedResults.delete(k);
    }
  }
}

/**
 * Executa uma operação exatamente uma vez por `(namespace, key)` enquanto em andamento
 * ou dentro da janela TTL em memória no servidor, retornando `{ result, deduplicated }`.
 */
export async function runWithIdempotency<T>(
  namespace: string,
  key: string,
  executor: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<{ result: T; deduplicated: boolean }> {
  const scopedKey = `${namespace}:${key.trim()}`;
  const now = Date.now();

  const cached = completedResults.get(scopedKey);
  if (cached && cached.expiresAt > now) {
    return { result: cached.value as T, deduplicated: true };
  }
  if (cached) {
    completedResults.delete(scopedKey);
  }

  const existingPromise = inFlightRequests.get(scopedKey);
  if (existingPromise) {
    const result = (await existingPromise) as T;
    return { result, deduplicated: true };
  }

  const runPromise = (async () => {
    try {
      const value = await executor();
      pruneExpiredCache(Date.now());
      completedResults.set(scopedKey, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
      return value;
    } finally {
      inFlightRequests.delete(scopedKey);
    }
  })();

  inFlightRequests.set(scopedKey, runPromise);
  const result = await runPromise;
  return { result, deduplicated: false };
}

/**
 * Auxiliar para testes automatizados limparem estado entre cenários.
 */
export function clearIdempotencyMemoryCache(): void {
  completedResults.clear();
  inFlightRequests.clear();
}

