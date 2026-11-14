import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/lib/security/serverAuth';

const SAAS_LOGIN_DOMAIN = 'https://ecclesiamapp.com.br';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get('host') || '').toLowerCase();

  const isEcclesiamSaasDomain =
    host.includes('ecclesiamapp.com.br') || host.startsWith('admin.');
  const isParishPublicDomain = host.includes('catedraldecolatina.org.br');

  // 1. No domínio público da Paróquia (ex: catedraldecolatina.org.br):
  // Bloquear qualquer acesso a /admin ou /login e enviar para o domínio SaaS ecclesiamapp.com.br
  if (
    isParishPublicDomain &&
    (pathname.startsWith('/admin') || pathname.startsWith('/login'))
  ) {
    return NextResponse.redirect(new URL('/login', SAAS_LOGIN_DOMAIN));
  }

  let response = NextResponse.next({ request });
  let authenticatedUser = null;

  const isProtectedAdminPage = pathname.startsWith('/admin');
  const isProtectedApi =
    pathname.startsWith('/api/admin') || pathname === '/api/upload';
  const needsAuthCheck =
    isProtectedAdminPage ||
    isProtectedApi ||
    (isEcclesiamSaasDomain && pathname === '/');

  if (needsAuthCheck) {
    try {
      const supabase = createMiddlewareSupabaseClient(
        request,
        () => response,
        (nextRes) => {
          response = nextRes;
        }
      );
      const {
        data: { user },
      } = await supabase.auth.getUser();
      authenticatedUser = user;
    } catch (err) {
      console.error('[proxy] Falha ao validar sessão Supabase:', err);
      authenticatedUser = null;
    }
  }

  // 2. No domínio SaaS (ecclesiamapp.com.br):
  // A raiz (/) é exclusivamente a porta de entrada das paróquias clientes (Login ou Dashboard)
  if (isEcclesiamSaasDomain && pathname === '/') {
    const destination = authenticatedUser ? '/admin' : '/login';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 3. Proteção Server-Side de todas as rotas de API administrativas (/api/admin/** e /api/upload)
  if (isProtectedApi && !authenticatedUser) {
    return NextResponse.json(
      { error: 'Sessão administrativa não autenticada.' },
      { status: 401 }
    );
  }

  // 4. Proteção Server-Side de todas as rotas /admin/*
  if (isProtectedAdminPage && !authenticatedUser) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/admin') {
      loginUrl.searchParams.set('next', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/upload',
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

