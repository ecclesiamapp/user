/**
 * [HARDENED] SEC-008: Validação server-side de uploads (allowlist de MIME, magic bytes e tamanho máximo).
 * Bloqueia explicitamente SVG, HTML e scripts que poderiam gerar Stored XSS em buckets públicos.
 */

export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_PDF_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export const ALLOWED_UPLOAD_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'application/pdf',
]);

export function detectMimeFromMagicBytes(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;

  // PDF: %PDF
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return 'application/pdf';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // WebP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }

  // AVIF: ....ftypavif ou ....ftypavis
  if (buffer.length >= 12 && buffer.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = buffer.subarray(8, 12).toString('ascii');
    if (brand === 'avif' || brand === 'avis') {
      return 'image/avif';
    }
  }

  return null;
}

export function validateUploadBuffer(params: {
  buffer: Buffer;
  declaredMime?: string | null;
  filename?: string | null;
}): { ok: true; mimeType: string } | { ok: false; error: string; status: number } {
  const { buffer, declaredMime, filename } = params;

  if (!buffer || buffer.length === 0) {
    return { ok: false, error: 'Arquivo vazio ou corrompido.', status: 400 };
  }

  const lowerName = (filename || '').toLowerCase();
  if (/\.(svg|html?|xhtml|js|mjs|cjs|xml|php|sh)$/i.test(lowerName)) {
    return {
      ok: false,
      error: 'Extensão de arquivo não permitida por política de segurança.',
      status: 400,
    };
  }

  const normalizedDeclared = (declaredMime || '').split(';')[0].trim().toLowerCase();
  if (normalizedDeclared && !ALLOWED_UPLOAD_MIMES.has(normalizedDeclared)) {
    return {
      ok: false,
      error: 'Tipo de arquivo não permitido. Envie apenas JPG, PNG, WebP, AVIF ou PDF.',
      status: 400,
    };
  }

  const detectedMime = detectMimeFromMagicBytes(buffer);
  if (!detectedMime || !ALLOWED_UPLOAD_MIMES.has(detectedMime)) {
    return {
      ok: false,
      error: 'Assinatura binária do arquivo não corresponde a uma imagem ou PDF válido.',
      status: 400,
    };
  }

  const maxBytes =
    detectedMime === 'application/pdf' ? MAX_PDF_UPLOAD_BYTES : MAX_IMAGE_UPLOAD_BYTES;
  if (buffer.length > maxBytes) {
    const limitMb = Math.round(maxBytes / (1024 * 1024));
    return {
      ok: false,
      error: `O arquivo excede o limite máximo permitido (${limitMb} MB).`,
      status: 413,
    };
  }

  return { ok: true, mimeType: detectedMime };
}
