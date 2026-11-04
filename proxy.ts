import { NextResponse, type NextRequest } from 'next/server';

const SAAS_LOGIN_DOMAIN = 'https://ecclesiamapp.com.br';

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = (request.headers.get('host') || '').toLowerCase();

  const isEcclesiamSaasDomain =
    host.includes('ecclesiamapp.com.br') || host.startsWith('admin.');
  const isParishPublicDomain = host.includes('catedraldecolatina.org.br');

  const isAdminSessionActive =
    request.cookies.get('ecclesiam_admin_active')?.value === 'true';

  // 1. No domínio público da Paróquia (ex: catedraldecolatina.org.br):
  // Bloquear qualquer acesso a /admin ou /login e enviar para o domínio SaaS ecclesiamapp.com.br
  if (isParishPublicDomain && (pathname.startsWith('/admin') || pathname.startsWith('/login'))) {
    return NextResponse.redirect(new URL('/login', SAAS_LOGIN_DOMAIN));
  }

  // 2. No domínio SaaS (ecclesiamapp.com.br):
  // A raiz (/) é exclusivamente a porta de entrada das paróquias clientes (Login ou Dashboard)
  if (isEcclesiamSaasDomain && pathname === '/') {
    const destination = isAdminSessionActive ? '/admin' : '/login';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 3. Proteção Server-Side de todas as rotas /admin/*
  if (pathname.startsWith('/admin')) {
    if (!isAdminSessionActive) {
      const loginUrl = new URL('/login', request.url);
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('next', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

