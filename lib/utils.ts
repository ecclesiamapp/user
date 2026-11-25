/**
 * Utilitários gerais do Ecclesiam App
 */

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Mascara telefone para exibição pública segura (LGPD Art. 6, VII / Art. 13)
 * Ex: (27) 99887-6655 -> (27) 9****-6655
 */
export function maskSensitivePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) return '****-****';
  const ddd = digits.length >= 10 ? `(${digits.slice(0, 2)}) ` : '';
  const body = digits.length >= 10 ? digits.slice(2) : digits;
  if (body.length === 9) {
    return `${ddd}${body[0]}****-${body.slice(5)}`;
  }
  return `${ddd}****-${body.slice(-4)}`;
}

/**
 * Mascara e-mail para exibição pública segura (LGPD Art. 6, VII)
 * Ex: joao.silva@gmail.com -> j***a@gmail.com
 */
export function maskSensitiveEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}
