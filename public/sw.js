/* eslint-disable no-restricted-globals */
/**
 * Service Worker Leve (PWA Offline Read-Only) — Ecclesiam App
 * TASK-57: Estratégia stale-while-revalidate restrita a páginas e mídias públicas.
 * Bloqueia expressamente rotas administrativas, autenticação, Área do Fiel (/meu-espaco) e mutações.
 */

const CACHE_VERSION = 'ecclesiam-public-v1';

const PRECACHE_ASSETS = [
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
];

const BLOCKED_PATH_PREFIXES = [
  '/admin',
  '/login',
  '/meu-espaco',
  '/api/admin',
  '/api/auth',
  '/api/upload',
  '/api/notifications',
  '/api/dizimo',
  '/api/secretaria',
  '/_next/webpack-hmr',
];

const ALLOWED_PUBLIC_PAGE_PREFIXES = [
  '/agenda-liturgica',
  '/comunidades',
  '/historia',
  '/horarios',
  '/noticias',
  '/mensagens',
  '/programacao',
  '/movimentos',
  '/dizimo',
  '/instalar',
  '/privacidade',
];

const ALLOWED_PUBLIC_ASSET_PREFIXES = [
  '/_next/static/',
  '/images/',
  '/icon-',
  '/manifest.webmanifest',
];

function isBlockedPath(pathname) {
  return BLOCKED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isCacheablePublicRequest(request, url) {
  if (!request || request.method !== 'GET') return false;
  if (url.origin !== self.location.origin) return false;

  const { pathname, search } = url;

  if (isBlockedPath(pathname)) return false;

  // Nunca cacheia URLs com parâmetros de token/sessão/callback
  if (/[?&](code|token|access_token|refresh_token|next)=/i.test(search)) {
    return false;
  }

  // Nunca cacheia hot-update de dev
  if (pathname.includes('hot-update')) return false;

  // Rota inicial pública e API pública de liturgia diária
  if (pathname === '/' || pathname === '/api/liturgia') {
    return true;
  }

  // Páginas públicas de leitura (Home, Agenda, Comunidades, História, Folhetos etc.)
  if (
    ALLOWED_PUBLIC_PAGE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    return true;
  }

  // Assets estáticos públicos e folhetos PDF
  if (
    ALLOWED_PUBLIC_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname.endsWith('.pdf') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.png')
  ) {
    return true;
  }

  return false;
}

function isResponseCacheable(response) {
  if (!response || !response.ok || response.status !== 200) return false;
  if (response.type === 'opaque' || response.type === 'error') return false;

  const cacheControl = (response.headers && response.headers.get('cache-control')) || '';
  if (/\b(no-store|private)\b/i.test(cacheControl)) {
    return false;
  }

  if (response.headers && response.headers.get('set-cookie')) {
    return false;
  }

  return true;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('ecclesiam-public-') && key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Bypass completo para rotas bloqueadas (/admin, /login, /meu-espaco, /api/admin) e não-GET
  if (!isCacheablePublicRequest(request, url)) {
    return;
  }

  // Estratégia stale-while-revalidate: entrega rápido do cache e revalida em segundo plano
  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      const networkPromise = fetch(request)
        .then((networkResponse) => {
          if (isResponseCacheable(networkResponse)) {
            cache.put(request, networkResponse.clone()).catch(() => undefined);
          }
          return networkResponse;
        })
        .catch(() => null);

      if (cachedResponse) {
        event.waitUntil(networkPromise);
        return cachedResponse;
      }

      const freshResponse = await networkPromise;
      if (freshResponse) {
        return freshResponse;
      }

      // Fallback amigável caso navegue offline para página pública ainda não cacheada
      if (request.mode === 'navigate') {
        const homeFallback = await cache.match('/');
        if (homeFallback) return homeFallback;
      }

      return new Response('Sem conexão com a internet no momento.', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    })
  );
});
