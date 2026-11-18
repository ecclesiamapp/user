import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedAdmin } from '@/lib/security/serverAuth';
import {
  checkServerRateLimit,
  extractClientIp,
  recordServerRateLimitFailure,
} from '@/lib/security/rateLimit';
import {
  dispatchTransactionalNotification,
  type NotificationPayload,
} from '@/lib/notifications/dispatchNotification';

const NOTIF_RATE_CFG = {
  maxAttempts: 20,
  windowMs: 5 * 60 * 1000,
  lockoutMs: 5 * 60 * 1000,
};

/**
 * [HARDENED] SEC-001 / SEC-010:
 * Rota protegida contra relay anônimo de e-mails e sem vazamento de error.message.
 * Fluxos públicos agora disparam notificações diretamente server-side via dispatchTransactionalNotification().
 */
export async function POST(req: NextRequest) {
  try {
    const internalSecret = process.env.INTERNAL_NOTIFICATION_SECRET?.trim();
    const headerSecret = req.headers.get('x-ecclesiam-internal-key')?.trim();
    const hasValidInternalSecret =
      Boolean(internalSecret) && Boolean(headerSecret) && headerSecret === internalSecret;

    if (!hasValidInternalSecret) {
      const auth = await requireAuthenticatedAdmin({ request: req });
      if (!auth.ok) return auth.response;
    }

    const clientIp = extractClientIp(req.headers);
    const rateKey = `notifications:${clientIp}`;
    const rateStatus = checkServerRateLimit(rateKey, NOTIF_RATE_CFG);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Muitas notificações em sequência. Aguarde alguns minutos.' },
        { status: 429 }
      );
    }
    recordServerRateLimitFailure(rateKey, NOTIF_RATE_CFG);

    const body = (await req.json().catch(() => null)) as Partial<NotificationPayload> | null;
    if (!body || !body.type || !body.protocol) {
      return NextResponse.json(
        { error: 'Parâmetros incompletos (type e protocol são obrigatórios).' },
        { status: 400 }
      );
    }

    if (body.type !== 'appointment' && body.type !== 'sacrament' && body.type !== 'tithe') {
      return NextResponse.json({ error: 'Tipo de notificação desconhecido.' }, { status: 400 });
    }

    const result = await dispatchTransactionalNotification(body as NotificationPayload);
    return NextResponse.json({
      success: true,
      type: result.type,
      protocol: result.protocol,
      userEmailSent: result.userEmailSent,
      secretaryNotified: result.secretaryNotified,
    });
  } catch (error: unknown) {
    console.error('Erro na rota de notificações:', error);
    return NextResponse.json(
      { error: 'Falha interna ao processar notificação.' },
      { status: 500 }
    );
  }
}
