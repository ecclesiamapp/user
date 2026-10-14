import { NextRequest, NextResponse } from 'next/server';
import {
  sendAppointmentConfirmationEmail,
  sendSacramentRegistrationEmail,
  sendSecretaryNotificationEmail,
  sendTitheRegistrationEmail,
  BaseEmailResult,
} from '@/utils/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    if (!type || !body.protocol) {
      return NextResponse.json(
        { error: 'Parâmetros incompletos (type e protocol são obrigatórios).' },
        { status: 400 }
      );
    }

    let userEmailResult: BaseEmailResult = { success: false, simulated: false };
    let secretaryEmailResult: BaseEmailResult = { success: false, simulated: false };

    if (type === 'appointment') {
      const {
        protocol,
        parishionerName,
        parishionerPhone,
        parishionerEmail,
        appointmentTypeLabel,
        priestName,
        formattedDate,
        time,
        communityName,
        notes,
      } = body;

      // 1. E-mail para o Fiel (se informado)
      if (parishionerEmail) {
        userEmailResult = await sendAppointmentConfirmationEmail({
          to: parishionerEmail,
          parishionerName: parishionerName || 'Paroquiano(a)',
          priestName: priestName || 'Sacerdote da Catedral',
          appointmentTypeLabel: appointmentTypeLabel || 'Atendimento Pastoral',
          formattedDate: formattedDate || 'A definir',
          time: time || 'A definir',
          protocol,
          communityName,
          notes,
        });
      }

      // 2. Alerta para a Secretaria
      secretaryEmailResult = await sendSecretaryNotificationEmail({
        type: 'appointment',
        protocol,
        applicantName: parishionerName,
        applicantPhone: parishionerPhone,
        applicantEmail: parishionerEmail,
        detailsTitle: `${appointmentTypeLabel} com ${priestName}`,
        extraDetails: `Data: ${formattedDate} às ${time} | Local: ${communityName || 'Catedral Matriz'}${notes ? ` | Obs: ${notes}` : ''}`,
      });

      return NextResponse.json({
        success: true,
        type: 'appointment',
        protocol,
        userEmailSent: userEmailResult.success,
        secretaryNotified: secretaryEmailResult.success,
      });
    }

    if (type === 'sacrament') {
      const {
        protocol,
        applicantName,
        applicantPhone,
        applicantEmail,
        sacramentTitle,
        candidateName,
        communityName,
        preferredDate,
        extraSummary,
      } = body;

      // 1. E-mail para o Solicitante (se informado)
      if (applicantEmail) {
        userEmailResult = await sendSacramentRegistrationEmail({
          to: applicantEmail,
          applicantName: applicantName || 'Solicitante',
          sacramentTitle: sacramentTitle || 'Inscrição Sacramental',
          protocol,
          candidateName,
          communityName,
          preferredDate,
        });
      }

      // 2. Alerta para a Secretaria
      secretaryEmailResult = await sendSecretaryNotificationEmail({
        type: 'sacrament',
        protocol,
        applicantName,
        applicantPhone,
        applicantEmail,
        detailsTitle: sacramentTitle,
        extraDetails: `Comunidade: ${communityName || 'A definir'}${preferredDate ? ` | Data Pretendida: ${preferredDate}` : ''}${extraSummary ? ` | Info: ${extraSummary}` : ''}`,
      });

      return NextResponse.json({
        success: true,
        type: 'sacrament',
        protocol,
        userEmailSent: userEmailResult.success,
        secretaryNotified: secretaryEmailResult.success,
      });
    }

    if (type === 'tithe') {
      const {
        protocol,
        parishionerName,
        parishionerPhone,
        parishionerEmail,
        preferredMethodLabel,
        preferredDay,
        communityName,
        notes,
      } = body;

      // 1. E-mail de Boas-Vindas ao Dizimista (se informado)
      if (parishionerEmail) {
        userEmailResult = await sendTitheRegistrationEmail({
          to: parishionerEmail,
          parishionerName: parishionerName || 'Novo Dizimista',
          protocol,
          preferredMethodLabel: preferredMethodLabel || 'PIX',
          preferredDay: preferredDay || 10,
          communityName,
        });
      }

      // 2. Notificação interna da Secretaria
      secretaryEmailResult = await sendSecretaryNotificationEmail({
        type: 'sacrament',
        protocol,
        applicantName: parishionerName,
        applicantPhone: parishionerPhone,
        applicantEmail: parishionerEmail,
        detailsTitle: 'Adesão Dizimista (Sou do Sagrado)',
        extraDetails: `Comunidade: ${communityName || 'Catedral Matriz'} | Forma: ${preferredMethodLabel || 'PIX'} | Dia preferido: ${preferredDay || 10}${notes ? ` | Obs: ${notes}` : ''}`,
      });

      return NextResponse.json({
        success: true,
        type: 'tithe',
        protocol,
        userEmailSent: userEmailResult.success,
        secretaryNotified: secretaryEmailResult.success,
      });
    }

    return NextResponse.json({ error: 'Tipo de notificação desconhecido.' }, { status: 400 });
  } catch (error: any) {
    console.error('Erro na rota de notificações:', error);
    return NextResponse.json(
      { error: 'Falha interna ao processar notificação.', details: error.message },
      { status: 500 }
    );
  }
}
