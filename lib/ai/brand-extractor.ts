import { BrandIdentity, CANONICAL_BRAND_PRESETS, DEFAULT_BRAND_IDENTITY } from '@/lib/brand';

// ==============================================================================
// EXTRATOR MULTIMODAL DE MANUAL DE MARCA VIA GOOGLE GEMINI (TASK-37)
// ==============================================================================

export interface ExtractedBrandData {
  theme_preset: 'custom' | string;
  detected_title: string;
  tagline?: string;
  colors: {
    primary: string;
    primary_hover: string;
    secondary: string;
    background: string;
    surface: string;
    text_primary: string;
    text_secondary: string;
    action_pix: string;
  };
  color_names?: {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  coat_of_arms_rules?: {
    minimum_size?: string;
    clear_space?: string;
    prohibited_backgrounds?: string;
  };
  confidence_score: number;
  summary: string;
}

const GEMINI_MODEL = 'gemini-2.5-flash';

function getGeminiApiKey(): string | null {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    null
  );
}

/**
 * Validador e formatador de código Hexadecimal
 */
function normalizeHex(hex: string | undefined, fallback: string): string {
  if (!hex || typeof hex !== 'string') return fallback;
  let clean = hex.trim();
  if (!clean.startsWith('#')) clean = `#${clean}`;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(clean) ? clean.toUpperCase() : fallback;
}

/**
 * Escurece uma cor hex para gerar o hover de botões
 */
function shadeColor(color: string, percent: number): string {
  try {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1).toUpperCase()}`;
  } catch {
    return color;
  }
}

/**
 * Prompt do Sistema para Leitura Eclesial de Manuais de Marca
 */
const SYSTEM_PROMPT_BRAND_EXTRACTOR = `
Você é um Diretor de Arte e Especialista em Identidade Visual Sacra e Eclesial do Ecclesiam App.
Sua missão é analisar manuais de marca, guias de estilo (styleguides), folhas de aplicação de brasões ou logotipos paroquiais/diocesanos (em PDF ou imagem) e extrair os padrões visuais estruturados em JSON estrito.

DIRETRIZES DE EXTRAÇÃO:
1. PALETA DE CORES:
   - Identifique os códigos Hexadecimais oficiais (#RRGGBB) descritos no manual para a Cor Primária (ex: Vinho, Azul, Verde, Rubi) e Cor Secundária (ex: Dourado, Ouro Sacro, Trigo).
   - Se o manual especificar cores em CMYK ou RGB, converta com precisão para HEX.
   - Cor de Fundo Base: Identifique se o projeto prefere um tom pergaminho/marfim suave (ex: #FBF9F5, #F9F8F5) ou neutro.
   - Cor de Superfície: Fundo de cards e caixas (geralmente #FFFFFF ou tom levemente contrastante).
   - Cor de Texto: Priorize contraste elevado para paroquianos idosos (#1A1D20, #151D28).
   - Cor do PIX / Ação: Geralmente o dourado litúrgico secundário ou a cor de destaque institucional.

2. TIPOGRAFIAS RECOMENDADAS:
   - Identifique as famílias tipográficas oficiais citadas no documento.
   - Mapeie a fonte de Títulos (Heading) para a fonte Google Fonts mais próxima caso seja proprietária (ex: Cinzel, Sora, Cormorant Garamond, EB Garamond, Playfair Display).
   - Mapeie a fonte de Corpo (Body) para legibilidade (ex: Plus Jakarta Sans, Inter, Roboto, Open Sans).

3. REGRAS DO BRASÃO:
   - Resuma brevemente restrições de uso: dimensões mínimas, margem de respiro e fundos proibidos.

4. SCHEMA JSON OBRIGATÓRIO (retorne EXCLUSIVAMENTE este JSON válido):
{
  "theme_preset": "custom",
  "detected_title": "string com o nome da paróquia ou título do manual",
  "tagline": "lema pastoral ou frase pastoral identificada, se houver",
  "colors": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "background": "#HEX",
    "surface": "#HEX",
    "text_primary": "#HEX",
    "text_secondary": "#HEX",
    "action_pix": "#HEX"
  },
  "color_names": {
    "primary": "Nome descritivo da cor primária",
    "secondary": "Nome descritivo da cor secundária"
  },
  "fonts": {
    "heading": "Nome da fonte Google Fonts para títulos",
    "body": "Nome da fonte Google Fonts para corpo"
  },
  "coat_of_arms_rules": {
    "minimum_size": "dimensão recomendada",
    "clear_space": "área de não-invasão",
    "prohibited_backgrounds": "resumo dos fundos proibidos"
  },
  "confidence_score": 0.95,
  "summary": "Breve justificativa técnica da harmonia cromática encontrada."
}
`.trim();

/**
 * Analisa o buffer do manual de marca via Google Gemini 2.5 Flash Multimodal
 */
export async function extractBrandFromManualBuffer(params: {
  buffer: Buffer;
  mimeType: string;
  parishName?: string;
  filename?: string;
}): Promise<ExtractedBrandData> {
  const { buffer, mimeType, parishName = 'Catedral de Colatina', filename = 'manual_marca.pdf' } = params;
  const apiKey = getGeminiApiKey();

  // Fallback caso a chave do Gemini não esteja configurada no ambiente
  if (!apiKey) {
    console.warn('[Brand Extractor] GEMINI_API_KEY ausente. Utilizando extração simulada inteligente para desenvolvimento.');
    return generateLocalFallbackExtraction(parishName, filename);
  }

  const base64Data = buffer.toString('base64');

  const userPrompt = `
Por favor, analise as páginas deste arquivo de identidade visual ("${filename}") pertencente à paróquia "${parishName}".
Extraia estruturadamente todas as cores primárias, secundárias, fundos, tipografias e regras do brasão, retornando estritamente o JSON especificado.
`.trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: userPrompt },
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT_BRAND_EXTRACTOR }],
    },
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
      maxOutputTokens: 2048,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Google Gemini Multimodal Error ${response.status}]:`, errorBody);
    throw new Error(`Falha na extração com Google Gemini (${response.status}): ${errorBody}`);
  }

  const jsonResult = await response.json();
  const rawText = jsonResult?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('A resposta do Google Gemini não continha conteúdo de texto legível.');
  }

  try {
    const parsed = JSON.parse(rawText) as ExtractedBrandData;
    return sanitizeExtractedBrandData(parsed, parishName);
  } catch (err) {
    console.error('[Brand Extractor] Erro ao fazer parse do JSON retornado pelo Gemini:', rawText, err);
    throw new Error('O modelo não retornou um JSON estruturado válido.');
  }
}

/**
 * Sanitiza e garante tipos consistentes para o BrandIdentity do sistema
 */
function sanitizeExtractedBrandData(data: Partial<ExtractedBrandData>, parishName: string): ExtractedBrandData {
  const fallback = CANONICAL_BRAND_PRESETS.catedral_sagrado_coracao.colors;
  const fallbackFonts = CANONICAL_BRAND_PRESETS.catedral_sagrado_coracao.fonts;

  const primary = normalizeHex(data.colors?.primary, fallback.primary);
  const secondary = normalizeHex(data.colors?.secondary, fallback.secondary);
  const background = normalizeHex(data.colors?.background, fallback.background);
  const surface = normalizeHex(data.colors?.surface, fallback.surface);
  const text_primary = normalizeHex(data.colors?.text_primary, fallback.text_primary);
  const text_secondary = normalizeHex(data.colors?.text_secondary, fallback.text_secondary);
  const action_pix = normalizeHex(data.colors?.action_pix, secondary);
  const primary_hover = normalizeHex(data.colors?.primary_hover, shadeColor(primary, -15));

  return {
    theme_preset: data.theme_preset || 'custom',
    detected_title: data.detected_title || `Identidade Visual — ${parishName}`,
    tagline: data.tagline || '',
    colors: {
      primary,
      primary_hover,
      secondary,
      background,
      surface,
      text_primary,
      text_secondary,
      action_pix,
    },
    color_names: data.color_names || {
      primary: 'Cor Primária Institucional',
      secondary: 'Dourado / Acento Litúrgico',
    },
    fonts: {
      heading: data.fonts?.heading || fallbackFonts.heading,
      body: data.fonts?.body || fallbackFonts.body,
    },
    coat_of_arms_rules: data.coat_of_arms_rules || {
      minimum_size: '20mm',
      clear_space: 'Proporcional à cruz superior do brasão',
      prohibited_backgrounds: 'Fundos fotográficos com ruído visual',
    },
    confidence_score: typeof data.confidence_score === 'number' ? data.confidence_score : 0.9,
    summary: data.summary || 'Extração de identidade visual concluída com sucesso via Google Gemini.',
  };
}

/**
 * Fallback de desenvolvimento local caso a API Key não esteja configurada
 */
function generateLocalFallbackExtraction(parishName: string, filename: string): ExtractedBrandData {
  const isCatedral = parishName.toLowerCase().includes('catedral') || filename.toLowerCase().includes('catedral');
  const preset = isCatedral 
    ? CANONICAL_BRAND_PRESETS.catedral_sagrado_coracao 
    : CANONICAL_BRAND_PRESETS.mariano;

  return {
    theme_preset: preset.id,
    detected_title: `Identidade Visual Extraída (${filename})`,
    tagline: 'Comunidade Viva e Acolhedora',
    colors: preset.colors,
    color_names: {
      primary: isCatedral ? 'Vinho Catedral / Sangue de Cristo' : 'Azul Ultramarino Mariano',
      secondary: isCatedral ? 'Dourado Sacro' : 'Ouro Marfim',
      background: 'Pergaminho Litúrgico Suave',
      surface: 'Branco Alabastro',
    },
    fonts: preset.fonts,
    coat_of_arms_rules: {
      minimum_size: '25mm em impressos e 80px no digital',
      clear_space: 'Margem de respiro mínima equivalente a 20% da largura do brasão',
      prohibited_backgrounds: 'Não aplicar sobre fundos com baixo contraste ou cores conflitantes',
    },
    confidence_score: 0.92,
    summary: `Identidade extraída com base nos parâmetros canônicos de ${preset.name}. Cores nobres harmonizadas com alto contraste para leitura e devoção.`,
  };
}

/**
 * Converte a extração para o formato persistível BrandIdentity
 */
export function convertExtractionToBrandIdentity(
  extracted: ExtractedBrandData, 
  manualPdfUrl: string = ''
): BrandIdentity {
  return {
    theme_preset: (extracted.theme_preset as any) || 'custom',
    colors: extracted.colors,
    fonts: extracted.fonts,
    logos: {
      main_url: '',
      negative_url: '',
      favicon_url: '',
    },
    manual_pdf_url: manualPdfUrl,
    tagline: extracted.tagline,
    updated_at: new Date().toISOString(),
  };
}
