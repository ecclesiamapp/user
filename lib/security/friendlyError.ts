/**
 * Tradutor central de erros técnicos (Supabase, PostgreSQL, Auth, Storage, Fetch)
 * para mensagens humanas, claras e seguras em português, evitando exposição de
 * detalhes internos de banco de dados ou stack traces na interface.
 */

interface FriendlyErrorRule {
  patterns: RegExp[];
  message: string;
}

const FRIENDLY_ERROR_RULES: FriendlyErrorRule[] = [
  {
    patterns: [/invalid login credentials/i, /invalid_credentials/i],
    message: 'E-mail ou senha incorretos. Confira seus dados e tente novamente.',
  },
  {
    patterns: [/email not confirmed/i],
    message: 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.',
  },
  {
    patterns: [/jwt expired/i, /invalid jwt/i, /session_not_found/i, /refresh_token_not_found/i],
    message: 'Sua sessão expirou por segurança. Faça login novamente para continuar.',
  },
  {
    patterns: [
      /\b42501\b/i,
      /row-level security/i,
      /permission denied/i,
      /insufficient_privilege/i,
      /não autorizado/i,
    ],
    message: 'Você não tem permissão para esta operação ou sua sessão precisa ser renovada.',
  },
  {
    patterns: [/too many requests/i, /rate limit/i, /\b429\b/],
    message: 'Muitas tentativas em sequência. Aguarde alguns instantes antes de tentar novamente.',
  },
  {
    patterns: [/\b23505\b/i, /duplicate key/i, /unique constraint/i, /already registered/i],
    message: 'Este registro já foi enviado ou já está cadastrado no sistema.',
  },
  {
    patterns: [/\b23503\b/i, /foreign key constraint/i, /violates foreign key/i],
    message: 'Não foi possível concluir porque um registro vinculado não existe mais ou foi alterado.',
  },
  {
    patterns: [/\b23514\b/i, /violates check constraint/i, /invalid input syntax/i],
    message: 'Alguns campos estão em formato inválido. Revise os dados preenchidos e tente novamente.',
  },
  {
    patterns: [
      /failed to fetch/i,
      /networkerror/i,
      /network request failed/i,
      /load failed/i,
      /econnrefused/i,
      /enotfound/i,
      /etimedout/i,
      /aborterror/i,
      /the operation was aborted/i,
    ],
    message: 'Conexão instável com o servidor. Verifique sua internet (Wi-Fi ou 3G/4G) e tente novamente.',
  },
  {
    patterns: [
      /payload too large/i,
      /\b413\b/,
      /exceeded the maximum allowed size/i,
      /file too large/i,
      /entity too large/i,
    ],
    message: 'O arquivo selecionado excede o limite de tamanho permitido. Tente uma versão menor.',
  },
  {
    patterns: [/bucket not found/i, /mime type .* is not supported/i, /storage.*error/i],
    message: 'Não foi possível gravar o arquivo no armazenamento. Verifique o formato e tente novamente.',
  },
];

const TECHNICAL_LEAK_PATTERNS: RegExp[] = [
  /\bpgrst\d+/i,
  /\bsqlstate\b/i,
  /\b42703\b/i,
  /\b42p01\b/i,
  /\brelation\s+"[^"]+"/i,
  /\bcolumn\s+"[^"]+"/i,
  /\bsyntax error\b/i,
  /\btypeerror:/i,
  /\breferenceerror:/i,
  /\bsyntaxerror:/i,
  /\bunexpected token\b/i,
  /\bjson\.parse\b/i,
  /\binternal server error\b/i,
  /\bbad gateway\b/i,
  /\bservice unavailable\b/i,
  /\bgateway timeout\b/i,
  /\bsupabase\b.*\berror\b/i,
  /\bpostgres/i,
];

function extractRawErrorDetails(error: unknown): { code: string; message: string } {
  if (!error) return { code: '', message: '' };
  if (typeof error === 'string') return { code: '', message: error.trim() };

  if (error instanceof Error) {
    const withCode = error as Error & { code?: unknown; status?: unknown };
    const code = withCode.code ? String(withCode.code) : '';
    return { code, message: (error.message || '').trim() };
  }

  if (typeof error === 'object') {
    const obj = error as Record<string, unknown>;
    const code = obj.code ? String(obj.code) : obj.status ? String(obj.status) : '';
    const message =
      typeof obj.message === 'string'
        ? obj.message.trim()
        : typeof obj.error === 'string'
        ? obj.error.trim()
        : typeof obj.details === 'string'
        ? obj.details.trim()
        : '';
    return { code, message };
  }

  return { code: '', message: '' };
}

/**
 * Converte erros desconhecidos em mensagem segura e compreensível para o usuário.
 */
export function toFriendlyErrorMessage(
  error: unknown,
  fallbackMessage = 'Ocorreu uma instabilidade momentânea. Tente novamente em instantes.'
): string {
  const { code, message } = extractRawErrorDetails(error);
  const combined = `${code} ${message}`.trim();

  if (!combined) {
    return fallbackMessage;
  }

  for (const rule of FRIENDLY_ERROR_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(combined))) {
      return rule.message;
    }
  }

  if (TECHNICAL_LEAK_PATTERNS.some((pattern) => pattern.test(combined))) {
    return fallbackMessage;
  }

  // Preserva mensagens curtas já escritas em português pelos validadores da aplicação
  if (message.length > 0 && message.length <= 240) {
    return message;
  }

  return fallbackMessage;
}

