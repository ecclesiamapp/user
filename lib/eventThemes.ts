import { ParishSpecialEvent, EventColorPreset } from '@/types';

export interface EventThemeConfig {
  id: EventColorPreset;
  name: string;
  subtitle: string;
  primary: string;
  secondary: string;
  accent: string;
  // Tokens escuros atmosféricos (Hero, Vinheta da Arte, Lightbox e Barra Mobile)
  pageBg: string;
  pageBgRgb: string;
  surfaceBg: string;
  surfaceElevated: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  ctaTextOnSecondary: string;
  // Tokens luminosos de fundo branco para o corpo da página (Grade Dia a Dia e Quermesse)
  bodyBg: string;
  cardBg: string;
  cardSubtleBg: string;
  cardHighlightBg: string;
  cardBorder: string;
  cardHighlightBorder: string;
  bodyTextPrimary: string;
  bodyTextSecondary: string;
  bodyTextMuted: string;
  accentOnLight: string;
  badgeBg: string;
  heroGradient: string;
}

export const EVENT_COLOR_PRESETS: Record<EventColorPreset, EventThemeConfig> = {
  mariano: {
    id: 'mariano',
    name: '🕊️ Mariano',
    subtitle: 'Nossa Senhora das Graças (Branco, Azul Manto & Ouro)',
    primary: '#0E4A80',
    secondary: '#FDCA87',
    accent: '#FAF6F0',
    pageBg: '#071629',
    pageBgRgb: '7, 22, 41',
    surfaceBg: '#0B1F3A',
    surfaceElevated: '#112B4E',
    borderSubtle: 'rgba(253, 202, 135, 0.24)',
    textPrimary: '#FAF6F0',
    textSecondary: '#CBDCF0',
    textMuted: '#94B0CF',
    ctaTextOnSecondary: '#071629',
    bodyBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardSubtleBg: '#F4F8FD',
    cardHighlightBg: '#FFF9EE',
    cardBorder: 'rgba(14, 74, 128, 0.15)',
    cardHighlightBorder: 'rgba(184, 132, 40, 0.28)',
    bodyTextPrimary: '#0A2540',
    bodyTextSecondary: '#415A77',
    bodyTextMuted: '#647D98',
    accentOnLight: '#A6731B',
    badgeBg: 'bg-[#0B1F3A]/85 text-[#FDCA87] border-[#FDCA87]/45',
    heroGradient: 'from-[#071629] via-[#0B213E] to-[#071629]',
  },
  sagrado_coracao: {
    id: 'sagrado_coracao',
    name: '❤️ Sagrado Coração',
    subtitle: 'Padroeiro & Mártires (Bordeaux & Dourado)',
    primary: '#8B1E22',
    secondary: '#FFA82A',
    accent: '#FAF6F0',
    pageBg: '#14090B',
    pageBgRgb: '20, 9, 11',
    surfaceBg: '#1E0E11',
    surfaceElevated: '#2A1418',
    borderSubtle: 'rgba(255, 168, 42, 0.24)',
    textPrimary: '#FAF6F0',
    textSecondary: '#E5D3D0',
    textMuted: '#B89E9A',
    ctaTextOnSecondary: '#1A0A0C',
    bodyBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardSubtleBg: '#FDF6F6',
    cardHighlightBg: '#FFF9EF',
    cardBorder: 'rgba(139, 30, 34, 0.15)',
    cardHighlightBorder: 'rgba(196, 132, 29, 0.28)',
    bodyTextPrimary: '#231012',
    bodyTextSecondary: '#5C4345',
    bodyTextMuted: '#856B6D',
    accentOnLight: '#9E6710',
    badgeBg: 'bg-rose-950/80 text-rose-200 border-rose-400/50',
    heroGradient: 'from-[#230C0E] via-[#1A0E10] to-[#14090B]',
  },
  natal: {
    id: 'natal',
    name: '⭐ Solenidade do Natal',
    subtitle: 'Mistério da Encarnação (Vermelho & Verde)',
    primary: '#991B1B',
    secondary: '#FDE68A',
    accent: '#FAF6F0',
    pageBg: '#0B1711',
    pageBgRgb: '11, 23, 17',
    surfaceBg: '#10231A',
    surfaceElevated: '#173124',
    borderSubtle: 'rgba(253, 230, 138, 0.24)',
    textPrimary: '#FAF6F0',
    textSecondary: '#D3E4DA',
    textMuted: '#9AB5A5',
    ctaTextOnSecondary: '#0B1711',
    bodyBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardSubtleBg: '#F6FAF7',
    cardHighlightBg: '#FFFBEB',
    cardBorder: 'rgba(22, 101, 52, 0.16)',
    cardHighlightBorder: 'rgba(180, 130, 25, 0.28)',
    bodyTextPrimary: '#14261C',
    bodyTextSecondary: '#435E4E',
    bodyTextMuted: '#6C8777',
    accentOnLight: '#991B1B',
    badgeBg: 'bg-red-950/80 text-red-200 border-emerald-500/50',
    heroGradient: 'from-[#260C0D] via-[#0E1F14] to-[#0B1711]',
  },
  pascoa: {
    id: 'pascoa',
    name: '✨ Páscoa & Corpus Christi',
    subtitle: 'Ressurreição & Eucaristia (Dourado & Branco)',
    primary: '#B45309',
    secondary: '#FCD34D',
    accent: '#FAF6F0',
    pageBg: '#171106',
    pageBgRgb: '23, 17, 6',
    surfaceBg: '#22190A',
    surfaceElevated: '#2F230F',
    borderSubtle: 'rgba(252, 211, 77, 0.25)',
    textPrimary: '#FAF6F0',
    textSecondary: '#E8DEC8',
    textMuted: '#BCAFA0',
    ctaTextOnSecondary: '#171106',
    bodyBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardSubtleBg: '#FDFAF3',
    cardHighlightBg: '#FFFBEB',
    cardBorder: 'rgba(180, 83, 9, 0.16)',
    cardHighlightBorder: 'rgba(217, 119, 6, 0.28)',
    bodyTextPrimary: '#271B09',
    bodyTextSecondary: '#5F4E36',
    bodyTextMuted: '#8A765A',
    accentOnLight: '#B45309',
    badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-400/50',
    heroGradient: 'from-[#241705] via-[#1A1208] to-[#171106]',
  },
  pentecostes: {
    id: 'pentecostes',
    name: '🔥 Pentecostes & Crisma',
    subtitle: 'Espírito Santo (Vermelho Fogo & Laranja)',
    primary: '#B91C1C',
    secondary: '#FDBA74',
    accent: '#FAF6F0',
    pageBg: '#190A08',
    pageBgRgb: '25, 10, 8',
    surfaceBg: '#25100C',
    surfaceElevated: '#331711',
    borderSubtle: 'rgba(253, 186, 116, 0.24)',
    textPrimary: '#FAF6F0',
    textSecondary: '#EAD4CA',
    textMuted: '#BA9E92',
    ctaTextOnSecondary: '#190A08',
    bodyBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardSubtleBg: '#FDF6F4',
    cardHighlightBg: '#FFF7ED',
    cardBorder: 'rgba(185, 28, 28, 0.15)',
    cardHighlightBorder: 'rgba(234, 88, 12, 0.26)',
    bodyTextPrimary: '#28110D',
    bodyTextSecondary: '#61433D',
    bodyTextMuted: '#8C6B64',
    accentOnLight: '#C2410C',
    badgeBg: 'bg-orange-950/80 text-orange-200 border-orange-400/50',
    heroGradient: 'from-[#290B0B] via-[#241306] to-[#190A08]',
  },
  sao_jose: {
    id: 'sao_jose',
    name: '⚒️ São José & Padroeiros',
    subtitle: 'Santos & Comunidades das CEBs (Marrom Âmbar)',
    primary: '#78350F',
    secondary: '#F59E0B',
    accent: '#FFFBEB',
    pageBg: '#160E07',
    pageBgRgb: '22, 14, 7',
    surfaceBg: '#21150B',
    surfaceElevated: '#2E1E10',
    borderSubtle: 'rgba(245, 158, 11, 0.24)',
    textPrimary: '#FFFBEB',
    textSecondary: '#E4D5C3',
    textMuted: '#B39F88',
    ctaTextOnSecondary: '#160E07',
    bodyBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardSubtleBg: '#FCF9F5',
    cardHighlightBg: '#FFFBEB',
    cardBorder: 'rgba(120, 53, 15, 0.16)',
    cardHighlightBorder: 'rgba(217, 119, 6, 0.28)',
    bodyTextPrimary: '#26170B',
    bodyTextSecondary: '#5C4938',
    bodyTextMuted: '#87715D',
    accentOnLight: '#92400E',
    badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-500/50',
    heroGradient: 'from-[#1F1106] via-[#181109] to-[#160E07]',
  },
  custom: {
    id: 'custom',
    name: '🎨 Personalizado',
    subtitle: 'Seletor de cores livre para comunidades',
    primary: '#8B1E22',
    secondary: '#FFA82A',
    accent: '#FAF6F0',
    pageBg: '#0E1117',
    pageBgRgb: '14, 17, 23',
    surfaceBg: '#151A23',
    surfaceElevated: '#1D2430',
    borderSubtle: 'rgba(255, 168, 42, 0.22)',
    textPrimary: '#FAF6F0',
    textSecondary: '#D1D6E0',
    textMuted: '#949DAB',
    ctaTextOnSecondary: '#0E1117',
    bodyBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardSubtleBg: '#F7F8FA',
    cardHighlightBg: '#FFF9F0',
    cardBorder: 'rgba(15, 23, 42, 0.12)',
    cardHighlightBorder: 'rgba(217, 119, 6, 0.25)',
    bodyTextPrimary: '#0F172A',
    bodyTextSecondary: '#475569',
    bodyTextMuted: '#64748B',
    accentOnLight: '#8B1E22',
    badgeBg: 'bg-zinc-900/80 text-zinc-200 border-zinc-600',
    heroGradient: 'from-[#17191E] via-[#121417] to-[#0E1117]',
  },
};

export interface ResolvedEventTheme {
  preset: EventColorPreset;
  primary: string;
  secondary: string;
  accent: string;
  pageBg: string;
  pageBgRgb: string;
  surfaceBg: string;
  surfaceElevated: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  ctaTextOnSecondary: string;
  bodyBg: string;
  cardBg: string;
  cardSubtleBg: string;
  cardHighlightBg: string;
  cardBorder: string;
  cardHighlightBorder: string;
  bodyTextPrimary: string;
  bodyTextSecondary: string;
  bodyTextMuted: string;
  accentOnLight: string;
  heroGradient: string;
}

export function getEventTheme(event?: ParishSpecialEvent | null): ResolvedEventTheme {
  const presetKey = (event?.color_preset || 'sagrado_coracao') as EventColorPreset;
  const config = EVENT_COLOR_PRESETS[presetKey] || EVENT_COLOR_PRESETS.sagrado_coracao;
  const useCustomHex = presetKey === 'custom';

  return {
    preset: presetKey,
    primary: useCustomHex ? (event?.primary_color || config.primary) : config.primary,
    secondary: useCustomHex ? (event?.secondary_color || config.secondary) : config.secondary,
    accent: useCustomHex ? (event?.accent_color || config.accent) : config.accent,
    pageBg: config.pageBg,
    pageBgRgb: config.pageBgRgb,
    surfaceBg: config.surfaceBg,
    surfaceElevated: config.surfaceElevated,
    borderSubtle: config.borderSubtle,
    textPrimary: config.textPrimary,
    textSecondary: config.textSecondary,
    textMuted: config.textMuted,
    ctaTextOnSecondary: config.ctaTextOnSecondary,
    bodyBg: config.bodyBg,
    cardBg: config.cardBg,
    cardSubtleBg: config.cardSubtleBg,
    cardHighlightBg: config.cardHighlightBg,
    cardBorder: config.cardBorder,
    cardHighlightBorder: config.cardHighlightBorder,
    bodyTextPrimary: config.bodyTextPrimary,
    bodyTextSecondary: config.bodyTextSecondary,
    bodyTextMuted: config.bodyTextMuted,
    accentOnLight: useCustomHex ? (event?.primary_color || config.accentOnLight) : config.accentOnLight,
    heroGradient: config.heroGradient,
  };
}
