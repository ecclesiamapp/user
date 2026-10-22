import { createClient } from '@supabase/supabase-js';

// ==============================================================================
// TIPOS E SCHEMAS DE IDENTIDADE VISUAL & MOODBOARD (ECCLESIAM APP)
// ==============================================================================

export interface BrandColors {
  primary: string;
  primary_hover: string;
  secondary: string;
  background: string;
  surface: string;
  text_primary: string;
  text_secondary: string;
  action_pix: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
}

export interface BrandLogos {
  main_url: string;
  negative_url: string;
  favicon_url: string;
}

export type BrandPresetKey = 
  | 'catedral_sagrado_coracao'
  | 'mariano'
  | 'franciscano'
  | 'solene_rei'
  | 'basilica';

export interface BrandPreset {
  id: BrandPresetKey;
  name: string;
  subtitle: string;
  description: string;
  colors: BrandColors;
  fonts: BrandFonts;
}

export interface BrandIdentity {
  theme_preset: BrandPresetKey | 'custom';
  colors: BrandColors;
  fonts: BrandFonts;
  logos: BrandLogos;
  manual_pdf_url?: string;
  tagline?: string;
  updated_at?: string;
}

// ==============================================================================
// 5 PRESETS CANÔNICOS OFICIAIS DO ECCLESIAM APP
// ==============================================================================

export const CANONICAL_BRAND_PRESETS: Record<BrandPresetKey, BrandPreset> = {
  catedral_sagrado_coracao: {
    id: 'catedral_sagrado_coracao',
    name: 'Catedral Sagrado Coração',
    subtitle: 'Vinho Bordô & Dourado Sacro',
    description: 'Paleta nobre de catedrais históricas e padroeiros solenes, transmitindo reverência, tradição e acolhimento pastoral.',
    colors: {
      primary: '#8B1E22',
      primary_hover: '#6E161A',
      secondary: '#FFA82A',
      background: '#FBF9F5',
      surface: '#FFFFFF',
      text_primary: '#1A1D20',
      text_secondary: '#5A626A',
      action_pix: '#FFA82A',
    },
    fonts: {
      heading: 'Sora',
      body: 'Plus Jakarta Sans',
    },
  },
  mariano: {
    id: 'mariano',
    name: 'Mariano',
    subtitle: 'Azul Ultramarino & Dourado Marfim',
    description: 'Inspirado no manto de Nossa Senhora, transmitindo serenidade, paz e proteção maternal à comunidade paroquial.',
    colors: {
      primary: '#1B365D',
      primary_hover: '#132644',
      secondary: '#C5A059',
      background: '#F9F8F5',
      surface: '#FFFFFF',
      text_primary: '#151D28',
      text_secondary: '#505D6D',
      action_pix: '#C5A059',
    },
    fonts: {
      heading: 'Cormorant Garamond',
      body: 'Inter',
    },
  },
  franciscano: {
    id: 'franciscano',
    name: 'Franciscano & CEBs',
    subtitle: 'Verde Nobre & Tom Linho/Trigo',
    description: 'Inspirado na Criação, simplicidade evangélica, comunidades eclesiais de base e pastoral social fraterna.',
    colors: {
      primary: '#214D37',
      primary_hover: '#163626',
      secondary: '#D8C3A5',
      background: '#F7F8F5',
      surface: '#FFFFFF',
      text_primary: '#18241C',
      text_secondary: '#4D5E52',
      action_pix: '#214D37',
    },
    fonts: {
      heading: 'EB Garamond',
      body: 'Plus Jakarta Sans',
    },
  },
  solene_rei: {
    id: 'solene_rei',
    name: 'Solene / Cristo Rei',
    subtitle: 'Rubi Real & Ouro Antigo',
    description: 'Ideal para paróquias sob o patrocínio de Cristo Rei, mártires, festas triunfais e solenidades litúrgicas de grande pompa.',
    colors: {
      primary: '#721C24',
      primary_hover: '#541218',
      secondary: '#D4AF37',
      background: '#FAFAF7',
      surface: '#FFFFFF',
      text_primary: '#201819',
      text_secondary: '#5E5455',
      action_pix: '#D4AF37',
    },
    fonts: {
      heading: 'Cinzel',
      body: 'Inter',
    },
  },
  basilica: {
    id: 'basilica',
    name: 'Basílica & Páscoa',
    subtitle: 'Ouro Imperial & Alabastro',
    description: 'Tons luminescentes de celebração pascal, festas de padroeiros e basílicas com alta incidência de vitrais e arte sacra.',
    colors: {
      primary: '#B8860B',
      primary_hover: '#926A08',
      secondary: '#D4AF37',
      background: '#FDFBF7',
      surface: '#FFFFFF',
      text_primary: '#231F14',
      text_secondary: '#665F4D',
      action_pix: '#B8860B',
    },
    fonts: {
      heading: 'Cinzel',
      body: 'Plus Jakarta Sans',
    },
  },
};

// ==============================================================================
// PADRÃO OFICIAL DEFAULT DO ECCLESIAM APP (DESIGN SYSTEM CANÔNICO)
// ==============================================================================

/**
 * Padrão Oficial Default do Ecclesiam App (Design System Sagrado Coração)
 * Serve como matriz primária e padrão de restauração para administradores.
 */
export const ECCLESIAM_APP_DEFAULT: BrandIdentity = {
  theme_preset: 'catedral_sagrado_coracao',
  colors: {
    primary: '#8B1E22',
    primary_hover: '#6E161A',
    secondary: '#FFA82A',
    background: '#FBF9F5',
    surface: '#FFFFFF',
    text_primary: '#1A1D20',
    text_secondary: '#5A626A',
    action_pix: '#FFA82A',
  },
  fonts: {
    heading: 'Sora',
    body: 'Plus Jakarta Sans',
  },
  logos: {
    main_url: '',
    negative_url: '',
    favicon_url: '',
  },
  tagline: 'Diocese de Colatina • Espírito Santo',
  manual_pdf_url: '',
  updated_at: new Date().toISOString(),
};

export const DEFAULT_BRAND_IDENTITY: BrandIdentity = ECCLESIAM_APP_DEFAULT;

export const CATEDRAL_PARISH_ID = 'c0000000-0000-0000-0000-000000000001';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
}

/**
 * Busca a identidade visual da paróquia no Supabase
 */
export async function getParishBrandIdentity(parishId: string = CATEDRAL_PARISH_ID): Promise<BrandIdentity> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('parishes')
      .select('brand_identity, brand_manual_url, logo_url, primary_color')
      .eq('id', parishId)
      .single();

    if (error || !data) {
      return DEFAULT_BRAND_IDENTITY;
    }

    const identity = (data.brand_identity as BrandIdentity) || DEFAULT_BRAND_IDENTITY;
    
    // Fallback de retrocompatibilidade com campos legados
    if (!identity.logos?.main_url && data.logo_url) {
      identity.logos = {
        ...identity.logos,
        main_url: data.logo_url,
      };
    }
    if (!identity.manual_pdf_url && data.brand_manual_url) {
      identity.manual_pdf_url = data.brand_manual_url;
    }

    return identity;
  } catch {
    return DEFAULT_BRAND_IDENTITY;
  }
}

/**
 * Gera as variáveis CSS em string para injeção no `:root` HTML
 */
export function generateCssVariables(identity: BrandIdentity): string {
  const colors = identity.colors || DEFAULT_BRAND_IDENTITY.colors;
  const fonts = identity.fonts || DEFAULT_BRAND_IDENTITY.fonts;

  return `
    :root {
      --brand-primary: ${colors.primary};
      --brand-primary-hover: ${colors.primary_hover};
      --brand-secondary: ${colors.secondary};
      --brand-bg: ${colors.background};
      --brand-surface: ${colors.surface};
      --brand-text-primary: ${colors.text_primary};
      --brand-text-secondary: ${colors.text_secondary};
      --brand-action-pix: ${colors.action_pix};
      --brand-font-heading: '${fonts.heading}', serif, system-ui;
      --brand-font-body: '${fonts.body}', sans-serif, system-ui;
    }
  `.replace(/\s+/g, ' ').trim();
}
