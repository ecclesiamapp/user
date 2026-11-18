import {
  sendAppointmentConfirmationEmail,
  sendSacramentRegistrationEmail,
  sendSecretaryNotificationEmail,
  sendTitheRegistrationEmail,
  type BaseEmailResult,
} from '@/utils/resend';

export interface AppointmentNotificationPayload {
  type: 'appointment';
  protocol: string;
  parishionerName?: string;
  parishionerPhone?: string;
  parishionerEmail?: string;
  appointmentTypeLabel?: string;
  priestName?: string;
  formattedDate?: string;
  time?: string;
  communityName?: string;
  notes?: string;
}

export interface SacramentNotificationPayload {
  type: 'sacrament';
  protocol: string;
  applicantName?: string;
  applicantPhone?: string;
  applicantEmail?: string;
  sacramentTitle?: string;
  candidateName?: string;
  communityName?: string;
  preferredDate?: string;
  extraSummary?: string;
}

export interface TitheNotificationPayload {
  type: 'tithe';
  protocol: string;
  parishionerName?: string;
  parishionerPhone?: string;
  parishionerEmail?: string;
  preferredMethodLabel?: string;
  preferredDay?: number;
  communityName?: string;
  notes?: string;
}

export type NotificationPayload =
  | AppointmentNotificationPayload
  | SacramentNotificationPayload
  | TitheNotificationPayload;

export interface DispatchNotificationResult {
  ok: true;
  type: NotificationPayload['type'];
  protocol: string;
  userEmailSent: boolean;
  secretaryNotified: boolean;
}

/**
 * [HARDENED] SEC-001: Serviço server-side compartilhado para envio de notificações
 * transacionais sem depender de auto-chamada HTTP pública para /api/notifications.
 */
export async function dispatchTransactionalNotification(
  payload: NotificationPayload
): Promise<DispatchNotificationResult> {
  const protocol = String(payload.protocol || '').trim();
  if (!protocol) {
    throw new Error('Protocolo obrigatório para disparo de notificação.');
  }

  let userEmailResult: BaseEmailResult = { success: false, simulated: false };
  let secretaryEmailResult: BaseEmailResult = { success: false, simulated: false };

  if (payload.type === 'appointment') {
    if (payload.parishionerEmail) {
      userEmailResult = await sendAppointmentConfirmationEmail({
        to: payload.parishionerEmail,
        parishionerName: payload.parishionerName || 'Paroquiano(a)',
        priestName: payload.priestName || 'Sacerdote da Catedral',
        appointmentTypeLabel: payload.appointmentTypeLabel || 'Atendimento Pastoral',
        formattedDate: payload.formattedDate || 'A definir',
        time: payload.time || 'A definir',
        protocol,
        communityName: payload.communityName,
        notes: payload.notes,
      });
    }

    secretaryEmailResult = await sendSecretaryNotificationEmail({
      type: 'appointment',
      protocol,
      applicantName: payload.parishionerName || 'Paroquiano(a)',
      applicantPhone: payload.parishionerPhone || 'Não informado',
      applicantEmail: payload.parishionerEmail,
      detailsTitle: `${payload.appointmentTypeLabel || 'Atendimento Pastoral'} com ${
        payload.priestName || 'Sacerdote da Catedral'
      }`,
      extraDetails: `Data: ${payload.formattedDate || 'A definir'} às ${
        payload.time || 'A definir'
      } | Local: ${payload.communityName || 'Catedral Diocesana'}${
        payload.notes ? ` | Obs: ${payload.notes}` : ''
      }`,
    });

    return {
      ok: true,
      type: 'appointment',
      protocol,
      userEmailSent: userEmailResult.success,
      secretaryNotified: secretaryEmailResult.success,
    };
  }

  if (payload.type === 'sacrament') {
    if (payload.applicantEmail) {
      userEmailResult = await sendSacramentRegistrationEmail({
        to: payload.applicantEmail,
        applicantName: payload.applicantName || 'Solicitante',
        sacramentTitle: payload.sacramentTitle || 'Inscrição Sacramental',
        protocol,
        candidateName: payload.candidateName,
        communityName: payload.communityName,
        preferredDate: payload.preferredDate,
      });
    }

    secretaryEmailResult = await sendSecretaryNotificationEmail({
      type: 'sacrament',
      protocol,
      applicantName: payload.applicantName || 'Solicitante',
      applicantPhone: payload.applicantPhone || 'Não informado',
      applicantEmail: payload.applicantEmail,
      detailsTitle: payload.sacramentTitle || 'Inscrição Sacramental',
      extraDetails: `Comunidade: ${payload.communityName || 'A definir'}${
        payload.preferredDate ? ` | Data Pretendida: ${payload.preferredDate}` : ''
      }${payload.extraSummary ? ` | Info: ${payload.extraSummary}` : ''}`,
    });

    return {
      ok: true,
      type: 'sacrament',
      protocol,
      userEmailSent: userEmailResult.success,
      secretaryNotified: secretaryEmailResult.success,
    };
  }

  if (payload.parishionerEmail) {
    userEmailResult = await sendTitheRegistrationEmail({
      to: payload.parishionerEmail,
      parishionerName: payload.parishionerName || 'Novo Dizimista',
      protocol,
      preferredMethodLabel: payload.preferredMethodLabel || 'PIX',
      preferredDay: payload.preferredDay || 10,
      communityName: payload.communityName,
    });
  }

  secretaryEmailResult = await sendSecretaryNotificationEmail({
    type: 'sacrament',
    protocol,
    applicantName: payload.parishionerName || 'Novo Dizimista',
    applicantPhone: payload.parishionerPhone || 'Não informado',
    applicantEmail: payload.parishionerEmail,
    detailsTitle: 'Adesão Dizimista (Sou do Sagrado)',
    extraDetails: `Comunidade: ${payload.communityName || 'Catedral Diocesana'} | Forma: ${
      payload.preferredMethodLabel || 'PIX'
    } | Dia preferido: ${payload.preferredDay || 10}${
      payload.notes ? ` | Obs: ${payload.notes}` : ''
    }`,
  });

  return {
    ok: true,
    type: 'tithe',
    protocol,
    userEmailSent: userEmailResult.success,
    secretaryNotified: secretaryEmailResult.success,
  };
}
