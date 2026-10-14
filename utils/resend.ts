import { Resend } from 'resend';

// Inicializa a instância do Resend se a chave estiver configurada
const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// E-mail remetente padrão (no onboarding da Resend ou domínio próprio verificado)
export const DEFAULT_FROM_EMAIL = 
  process.env.RESEND_FROM_EMAIL || 'Catedral de Colatina <onboarding@resend.dev>';

// E-mail da Secretaria Paroquial para recebimento de alertas internos
export const SECRETARY_EMAIL = 
  process.env.SECRETARY_EMAIL || 'secretaria@catedraldecolatina.org.br';

export interface BaseEmailResult {
  success: boolean;
  simulated?: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Template Base de Alta Nobreza Litúrgica para E-mails Transacionais da Catedral
 */
function generateEmailHtml({
  preheader,
  badgeText,
  title,
  subtitle,
  protocol,
  detailsHtml,
  calloutHtml,
  whatsappUrl,
}: {
  preheader: string;
  badgeText: string;
  title: string;
  subtitle: string;
  protocol: string;
  detailsHtml: string;
  calloutHtml?: string;
  whatsappUrl?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F8F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D1A16; }
    .container { max-width: 600px; margin: 24px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EAE3D9; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #8B1E22 0%, #6E161A 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
    .header-badge { display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,204,54,0.4); border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #FFCC36; margin-bottom: 12px; }
    .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; color: #EAE3D9; opacity: 0.9; }
    .body-content { padding: 32px 24px; }
    .protocol-card { background-color: #FFF9F0; border: 1px dashed #FFA82A; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .protocol-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #8B1E22; display: block; margin-bottom: 4px; }
    .protocol-code { font-family: monospace; font-size: 24px; font-weight: 900; color: #8B1E22; letter-spacing: 2px; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
    .details-table td { padding: 10px 12px; border-bottom: 1px solid #F0EAE1; }
    .details-table td.label { font-weight: 600; color: #7E6B65; width: 35%; }
    .details-table td.value { font-weight: 500; color: #2D1A16; }
    .callout { background-color: #F8F5F0; border-left: 4px solid #8B1E22; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #5C4A45; margin-bottom: 24px; }
    .btn-container { text-align: center; margin: 28px 0 12px 0; }
    .btn-whatsapp { display: inline-block; background-color: #25D366; color: #FFFFFF; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none; box-shadow: 0 2px 8px rgba(37,211,102,0.3); }
    .footer { background-color: #F8F5F0; border-top: 1px solid #EAE3D9; padding: 24px; text-align: center; font-size: 12px; color: #8C7872; line-height: 1.6; }
    .footer strong { color: #5C4A45; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <div class="container">
    <div class="header">
      <div class="header-badge">${badgeText}</div>
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
    <div class="body-content">
      <div class="protocol-card">
        <span class="protocol-label">Número de Protocolo Oficial</span>
        <span class="protocol-code">${protocol}</span>
      </div>

      <table class="details-table">
        <tbody>
          ${detailsHtml}
        </tbody>
      </table>

      ${calloutHtml ? `<div class="callout">${calloutHtml}</div>` : ''}

      ${whatsappUrl ? `
        <div class="btn-container">
          <a href="${whatsappUrl}" class="btn-whatsapp" target="_blank">
            💬 Falar com a Secretaria no WhatsApp
          </a>
        </div>
      ` : ''}
    </div>
    <div class="footer">
      <strong>Catedral do Sagrado Coração de Jesus</strong><br>
      Praça Frei José, Nº 26 — Centro, Colatina - ES<br>
      Telefone: (27) 2102-5010 • WhatsApp Paroquial Oficial<br>
      <em>"A serviço da evangelização e da comunhão no Vale do Rio Doce"</em>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 1. Enviar confirmação de Agendamento Pastoral para o Fiel
 */
export async function sendAppointmentConfirmationEmail({
  to,
  parishionerName,
  priestName,
  appointmentTypeLabel,
  formattedDate,
  time,
  protocol,
  communityName,
  notes,
}: {
  to: string;
  parishionerName: string;
  priestName: string;
  appointmentTypeLabel: string;
  formattedDate: string;
  time: string;
  protocol: string;
  communityName?: string;
  notes?: string;
}): Promise<BaseEmailResult> {
  const cleanTo = to.trim();
  if (!cleanTo || !cleanTo.includes('@')) {
    return { success: false, error: 'E-mail inválido' };
  }

  const detailsHtml = `
    <tr>
      <td class="label">Fiel Solicitante:</td>
      <td class="value">${parishionerName}</td>
    </tr>
    <tr>
      <td class="label">Atendimento:</td>
      <td class="value"><strong>${appointmentTypeLabel}</strong></td>
    </tr>
    <tr>
      <td class="label">Sacerdote:</td>
      <td class="value">${priestName}</td>
    </tr>
    <tr>
      <td class="label">Data & Horário:</td>
      <td class="value">${formattedDate} às ${time}</td>
    </tr>
    ${communityName ? `
    <tr>
      <td class="label">Local / Comunidade:</td>
      <td class="value">${communityName}</td>
    </tr>
    ` : ''}
    ${notes ? `
    <tr>
      <td class="label">Observações:</td>
      <td class="value">${notes}</td>
    </tr>
    ` : ''}
  `;

  const html = generateEmailHtml({
    preheader: `Confirmação de agendamento: ${appointmentTypeLabel} com ${priestName} (Protocolo: ${protocol})`,
    badgeText: 'Agendamento Pastoral',
    title: 'Solicitação Registrada!',
    subtitle: 'Catedral do Sagrado Coração de Jesus • Diocese de Colatina',
    protocol,
    detailsHtml,
    calloutHtml: '<strong>Importante:</strong> Chegue com 10 minutos de antecedência na secretaria paroquial. Em caso de imprevisto, avise com antecedência.',
    whatsappUrl: `https://wa.me/552721025010?text=${encodeURIComponent(`Paz e Bem! Estou confirmando meu agendamento com protocolo ${protocol}.`)}`,
  });

  if (!resend) {
    console.info(`[RESEND MOCK] E-mail simulado para ${cleanTo} (Protocolo: ${protocol})`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [cleanTo],
      subject: `Agendamento Confirmado: ${appointmentTypeLabel} [${protocol}]`,
      html,
    });

    if (error) {
      console.error('[RESEND ERROR]', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error('[RESEND EXCEPTION]', err);
    return { success: false, error: err.message || 'Falha de conexão com Resend' };
  }
}

/**
 * 2. Enviar confirmação de Inscrição Sacramental para o Solicitante
 */
export async function sendSacramentRegistrationEmail({
  to,
  applicantName,
  sacramentTitle,
  protocol,
  candidateName,
  communityName,
  preferredDate,
}: {
  to: string;
  applicantName: string;
  sacramentTitle: string;
  protocol: string;
  candidateName?: string;
  communityName?: string;
  preferredDate?: string;
}): Promise<BaseEmailResult> {
  const cleanTo = to.trim();
  if (!cleanTo || !cleanTo.includes('@')) {
    return { success: false, error: 'E-mail inválido' };
  }

  const detailsHtml = `
    <tr>
      <td class="label">Solicitante:</td>
      <td class="value">${applicantName}</td>
    </tr>
    <tr>
      <td class="label">Sacramento / Pastoral:</td>
      <td class="value"><strong>${sacramentTitle}</strong></td>
    </tr>
    ${candidateName ? `
    <tr>
      <td class="label">Candidato(a):</td>
      <td class="value">${candidateName}</td>
    </tr>
    ` : ''}
    ${communityName ? `
    <tr>
      <td class="label">Comunidade Solicitada:</td>
      <td class="value">${communityName}</td>
    </tr>
    ` : ''}
    ${preferredDate ? `
    <tr>
      <td class="label">Data de Preferência:</td>
      <td class="value">${preferredDate}</td>
    </tr>
    ` : ''}
  `;

  const html = generateEmailHtml({
    preheader: `Pré-inscrição recebida: ${sacramentTitle} (Protocolo: ${protocol})`,
    badgeText: 'Secretaria Paroquial',
    title: 'Pré-Inscrição Registrada!',
    subtitle: 'Catedral do Sagrado Coração de Jesus • Diocese de Colatina',
    protocol,
    detailsHtml,
    calloutHtml: '<strong>Próximos Passos:</strong> A secretaria paroquial analisará a documentação informada. Você receberá a confirmação da data ou instruções adicionais.',
    whatsappUrl: `https://wa.me/552721025010?text=${encodeURIComponent(`Paz e Bem! Fiz uma pré-inscrição para ${sacramentTitle} com protocolo ${protocol}.`)}`,
  });

  if (!resend) {
    console.info(`[RESEND MOCK] E-mail de sacramento simulado para ${cleanTo} (Protocolo: ${protocol})`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [cleanTo],
      subject: `Pré-Inscrição Recebida: ${sacramentTitle} [${protocol}]`,
      html,
    });

    if (error) {
      console.error('[RESEND ERROR]', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error('[RESEND EXCEPTION]', err);
    return { success: false, error: err.message || 'Falha de conexão com Resend' };
  }
}

/**
 * 3. Notificar a Secretaria Paroquial sobre nova solicitação
 */
export async function sendSecretaryNotificationEmail({
  type,
  protocol,
  applicantName,
  applicantPhone,
  applicantEmail,
  detailsTitle,
  extraDetails,
}: {
  type: 'appointment' | 'sacrament';
  protocol: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  detailsTitle: string;
  extraDetails: string;
}): Promise<BaseEmailResult> {
  const detailsHtml = `
    <tr>
      <td class="label">Tipo:</td>
      <td class="value"><strong>${type === 'appointment' ? 'Agendamento com Padre' : 'Inscrição Sacramental'}</strong></td>
    </tr>
    <tr>
      <td class="label">Item:</td>
      <td class="value">${detailsTitle}</td>
    </tr>
    <tr>
      <td class="label">Fiel Solicitante:</td>
      <td class="value">${applicantName}</td>
    </tr>
    <tr>
      <td class="label">WhatsApp / Fone:</td>
      <td class="value"><strong>${applicantPhone}</strong></td>
    </tr>
    ${applicantEmail ? `
    <tr>
      <td class="label">E-mail:</td>
      <td class="value">${applicantEmail}</td>
    </tr>
    ` : ''}
    <tr>
      <td class="label">Detalhes:</td>
      <td class="value">${extraDetails}</td>
    </tr>
  `;

  const html = generateEmailHtml({
    preheader: `[SECRETARIA] Novo pedido via Portal: ${detailsTitle} de ${applicantName}`,
    badgeText: 'Alerta da Secretaria',
    title: 'Nova Solicitação no Portal!',
    subtitle: 'Painel Administrativo da Catedral de Colatina',
    protocol,
    detailsHtml,
    calloutHtml: 'Acesse o Painel Administrativo em <strong>/admin/secretaria</strong> para aprovar, reagendar ou emitir comprovante.',
  });

  if (!resend) {
    console.info(`[RESEND MOCK] Alerta para secretaria ${SECRETARY_EMAIL} (Protocolo: ${protocol})`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [SECRETARY_EMAIL],
      subject: `[PORTAL CATEDRAL] Novo(a) ${type === 'appointment' ? 'Agendamento' : 'Inscrição'}: ${applicantName} [${protocol}]`,
      html,
    });

    if (error) {
      console.error('[RESEND SECRETARY ERROR]', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error('[RESEND SECRETARY EXCEPTION]', err);
    return { success: false, error: err.message };
  }
}

/**
 * 4. E-mail de Boas-Vindas ao Novo Dizimista (Campanha Sou do Sagrado)
 */
export async function sendTitheRegistrationEmail({
  to,
  parishionerName,
  protocol,
  preferredMethodLabel,
  preferredDay,
  communityName,
}: {
  to: string;
  parishionerName: string;
  protocol: string;
  preferredMethodLabel: string;
  preferredDay: number;
  communityName?: string;
}): Promise<BaseEmailResult> {
  const detailsHtml = `
    <tr>
      <td class="label">Dizimista:</td>
      <td class="value">${parishionerName}</td>
    </tr>
    <tr>
      <td class="label">Protocolo:</td>
      <td class="value font-mono">${protocol}</td>
    </tr>
    <tr>
      <td class="label">Comunidade:</td>
      <td class="value">${communityName || 'Catedral Matriz do Sagrado Coração de Jesus'}</td>
    </tr>
    <tr>
      <td class="label">Forma de Contribuição:</td>
      <td class="value">${preferredMethodLabel}</td>
    </tr>
    <tr>
      <td class="label">Dia de Preferência:</td>
      <td class="value">Todo dia ${preferredDay} de cada mês</td>
    </tr>
  `;

  const html = generateEmailHtml({
    preheader: `Deus abençoe sua generosidade, ${parishionerName}! Seja bem-vindo(a) à família de dizimistas Sou do Sagrado.`,
    badgeText: 'Sou do Sagrado • Dízimo Pastoral',
    title: 'Seja Bem-vindo(a) à Família do Sagrado!',
    subtitle: 'Catedral do Sagrado Coração de Jesus • Diocese de Colatina',
    protocol,
    detailsHtml,
    calloutHtml: 'Sua adesão foi registrada na Secretaria Paroquial. Se escolheu envelope, retire-o no plantão das Santas Missas dominicais.',
  });

  if (!resend) {
    console.info(`[RESEND MOCK] E-mail de Dizimista enviado para ${to} (Protocolo: ${protocol})`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [to],
      subject: `[SOU DO SAGRADO] Bem-vindo(a) à Família do Dízimo da Catedral! [${protocol}]`,
      html,
    });

    if (error) {
      console.error('[RESEND TITHE ERROR]', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error('[RESEND TITHE EXCEPTION]', err);
    return { success: false, error: err.message };
  }
}

