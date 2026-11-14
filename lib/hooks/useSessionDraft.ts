'use client';

/**
 * Helpers e hook de rascunho em `sessionStorage` em conformidade com LGPD/ECA Digital:
 * - Os dados permanecem apenas na sessão ativa da aba/navegador e são apagados ao fechar.
 * - Expiram automaticamente após 4 horas caso a aba permaneça aberta em dispositivo compartilhado.
 * - Nunca utiliza `localStorage` para dados pessoais preenchidos em formulários da Secretaria.
 */

const DRAFT_TTL_MS = 4 * 60 * 60 * 1000;
const DRAFT_VERSION = 1;

interface StoredDraftEnvelope<T> {
  v: number;
  updatedAt: number;
  data: T;
}

export function readSessionDraft<T>(storageKey: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredDraftEnvelope<T>;
    if (
      !parsed ||
      parsed.v !== DRAFT_VERSION ||
      typeof parsed.updatedAt !== 'number' ||
      Date.now() - parsed.updatedAt > DRAFT_TTL_MS
    ) {
      window.sessionStorage.removeItem(storageKey);
      return null;
    }

    return parsed.data ?? null;
  } catch {
    return null;
  }
}

export function writeSessionDraft<T>(storageKey: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: StoredDraftEnvelope<T> = {
      v: DRAFT_VERSION,
      updatedAt: Date.now(),
      data,
    };
    window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
  } catch {
    // Modo anônimo ou cota excedida não deve interromper o preenchimento
  }
}

export function clearSessionDraft(storageKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(storageKey);
  } catch {
    // Ignorar falha de acesso ao storage
  }
}

