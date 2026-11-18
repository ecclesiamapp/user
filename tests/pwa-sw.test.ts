import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

function loadServiceWorkerHarness() {
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  const swCode = fs.readFileSync(swPath, 'utf8');

  const listeners = new Map<string, (event: unknown) => void>();
  const cacheMap = new Map<string, Map<string, Response>>();

  const cachesMock = {
    async open(name: string) {
      if (!cacheMap.has(name)) cacheMap.set(name, new Map());
      const store = cacheMap.get(name)!;
      return {
        async addAll() {},
        async match(req: Request | string) {
          const key = typeof req === 'string' ? req : req.url;
          const hit = store.get(key) || store.get(new URL(key, 'https://catedraldecolatina.org.br').pathname);
          return hit ? hit.clone() : undefined;
        },
        async put(req: Request | string, res: Response) {
          const key = typeof req === 'string' ? req : req.url;
          store.set(key, res.clone());
        },
      };
    },
    async keys() {
      return [...cacheMap.keys()];
    },
    async delete(name: string) {
      return cacheMap.delete(name);
    },
  };

  let fetchCalls = 0;
  let nextResponseFactory: (req: Request) => Response = () =>
    new Response('ok', { status: 200, headers: { 'Content-Type': 'text/html' } });

  const selfMock = {
    location: { origin: 'https://catedraldecolatina.org.br' },
    addEventListener(type: string, fn: (event: unknown) => void) {
      listeners.set(type, fn);
    },
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  };

  const context = vm.createContext({
    self: selfMock,
    caches: cachesMock,
    URL,
    Request,
    Response,
    fetch: async (req: Request) => {
      fetchCalls += 1;
      return nextResponseFactory(req);
    },
  });

  vm.runInContext(swCode, context);

  return {
    listeners,
    cacheMap,
    getFetchCalls: () => fetchCalls,
    setResponseFactory: (fn: (req: Request) => Response) => {
      nextResponseFactory = fn;
    },
    dispatchFetch(
      url: string,
      method = 'GET'
    ): { respondedWith: Promise<Response> | null; waitPromises: Promise<unknown>[] } {
      const req = new Request(url, { method });
      let respondedWith: Promise<Response> | null = null;
      const waitPromises: Promise<unknown>[] = [];
      const event = {
        request: req,
        respondWith(p: Promise<Response>) {
          respondedWith = p;
        },
        waitUntil(p: Promise<unknown>) {
          waitPromises.push(p);
        },
      };
      listeners.get('fetch')?.(event);
      return { respondedWith, waitPromises };
    },
  };
}

test('sw.js bloqueia /admin, /login, /meu-espaco, /api/admin e métodos != GET (TASK-57)', () => {
  const sw = loadServiceWorkerHarness();
  const blockedUrls = [
    'https://catedraldecolatina.org.br/admin',
    'https://catedraldecolatina.org.br/admin/usuarios',
    'https://catedraldecolatina.org.br/login',
    'https://catedraldecolatina.org.br/meu-espaco',
    'https://catedraldecolatina.org.br/api/admin/ai-assistant',
    'https://catedraldecolatina.org.br/api/auth/session',
    'https://catedraldecolatina.org.br/api/upload',
    'https://catedraldecolatina.org.br/api/secretaria/appointments',
    'https://catedraldecolatina.org.br/?code=oauth-token',
    'https://other-domain.com/comunidades',
  ];

  for (const url of blockedUrls) {
    const { respondedWith } = sw.dispatchFetch(url, 'GET');
    assert.equal(respondedWith, null, `Não deveria interceptar ${url}`);
  }

  const postAttempt = sw.dispatchFetch('https://catedraldecolatina.org.br/', 'POST');
  assert.equal(postAttempt.respondedWith, null);
});

test('sw.js aplica stale-while-revalidate em rotas públicas e ignora respostas no-store/set-cookie (TASK-57)', async () => {
  const sw = loadServiceWorkerHarness();

  const publicUrls = [
    'https://catedraldecolatina.org.br/',
    'https://catedraldecolatina.org.br/agenda-liturgica',
    'https://catedraldecolatina.org.br/comunidades/matriz',
    'https://catedraldecolatina.org.br/historia',
    'https://catedraldecolatina.org.br/api/liturgia',
    'https://catedraldecolatina.org.br/images/pastores/pe-irineu-claudino-sales.webp',
    'https://catedraldecolatina.org.br/folhetos/missa-dominical.pdf',
  ];

  for (const url of publicUrls) {
    const { respondedWith } = sw.dispatchFetch(url, 'GET');
    assert.ok(respondedWith, `Deveria interceptar rota pública ${url}`);
    const res = await respondedWith;
    assert.equal(res.status, 200);
  }

  // Segunda leitura da Home deve responder imediatamente do cache e disparar revalidação
  const beforeCalls = sw.getFetchCalls();
  const secondHit = sw.dispatchFetch('https://catedraldecolatina.org.br/', 'GET');
  assert.ok(secondHit.respondedWith);
  const cachedRes = await secondHit.respondedWith;
  assert.equal(cachedRes.status, 200);
  await Promise.all(secondHit.waitPromises);
  assert.equal(sw.getFetchCalls(), beforeCalls + 1);

  // Resposta com Cache-Control: no-store não pode ir para o cache
  sw.setResponseFactory(
    () =>
      new Response('private', {
        status: 200,
        headers: { 'Cache-Control': 'private, no-store' },
      })
  );
  const noStoreAttempt = sw.dispatchFetch('https://catedraldecolatina.org.br/noticias', 'GET');
  await noStoreAttempt.respondedWith;
  const cacheEntries = sw.cacheMap.get('ecclesiam-public-v1');
  assert.equal(cacheEntries?.has('https://catedraldecolatina.org.br/noticias'), false);
});
