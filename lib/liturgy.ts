/**
 * Tipos e Utilitários do Calendário Litúrgico e Folhetos da Missa
 * Conforme ESCOPO_CALENDARIO_LITURGICO.md e API da CNBB
 */

export type LiturgicalColor = 'verde' | 'roxo' | 'vermelho' | 'branco' | 'rosa';

export interface LiturgicalReadingItem {
  referencia: string;
  titulo?: string;
  texto: string;
}

export interface LiturgicalPsalmItem {
  referencia: string;
  refrao: string;
  texto: string;
}

export interface NormalizedLiturgicalData {
  isLive: boolean;
  data: string;
  celebrationTitle: string;
  colorName: string;
  dia?: string | null;
  primeiraLeitura: LiturgicalReadingItem | null;
  salmo: LiturgicalPsalmItem | null;
  segundaLeitura: LiturgicalReadingItem | null;
  evangelho: LiturgicalReadingItem | null;
  antifonas?: {
    entrada?: string;
    comunhao?: string;
  } | null;
}

export interface LiturgicalColorTheme {
  color: LiturgicalColor;
  colorLabel: string;
  borderClass: string;
  bgGradientClass: string;
  badgeClass: string;
  pulseClass: string;
  accentClass: string;
  buttonClass: string;
  // Acentos Cirúrgicos para as LPs de Comunidades:
  numberBadgeClass: string;
  cardBorderClass: string;
  cardGlowClass: string;
  heroPillClass: string;
  dotClass: string;
  tagClass: string;
}

export function getLiturgicalColorTheme(colorName: string = 'Verde'): LiturgicalColorTheme {
  const normalized = (colorName || '').toLowerCase().trim();

  if (normalized.includes('verm') || normalized.includes('red')) {
    return {
      color: 'vermelho',
      colorLabel: 'Vermelho (Espírito Santo & Santos Mártires)',
      borderClass: 'border-red-300 dark:border-red-500/40 hover:border-red-400 dark:hover:border-red-500/60',
      bgGradientClass: 'bg-gradient-to-r from-red-50/90 via-[var(--dash-surface)] to-[var(--dash-surface)] dark:from-red-950/40 dark:via-[var(--dash-surface)] dark:to-[var(--dash-surface)]',
      badgeClass: 'bg-red-100 text-red-900 border border-red-300 dark:bg-red-500/20 dark:text-red-200 dark:border-red-500/30 font-bold',
      pulseClass: 'bg-red-600 dark:bg-red-400',
      accentClass: 'text-red-900 dark:text-red-400',
      buttonClass: 'border border-red-400 dark:border-red-500/40 hover:bg-red-700 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-red-950 dark:text-red-100 bg-red-100/70 dark:bg-red-950/40 font-bold shadow-xs',
      numberBadgeClass: 'bg-gradient-to-br from-red-800/80 to-red-950/90 border-b border-l border-red-500/60 text-red-200',
      cardBorderClass: 'border-red-600/30 hover:border-red-500/50',
      cardGlowClass: 'from-red-500/10 via-transparent to-transparent',
      heroPillClass: 'bg-red-950/80 border-red-500/40 text-red-200',
      dotClass: 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]',
      tagClass: 'text-red-400',
    };
  }

  if (normalized.includes('rox') || normalized.includes('purple')) {
    return {
      color: 'roxo',
      colorLabel: 'Roxo (Conversão & Esperança no Senhor)',
      borderClass: 'border-purple-300 dark:border-purple-500/40 hover:border-purple-400 dark:hover:border-purple-500/60',
      bgGradientClass: 'bg-gradient-to-r from-purple-50/90 via-[var(--dash-surface)] to-[var(--dash-surface)] dark:from-purple-950/40 dark:via-[var(--dash-surface)] dark:to-[var(--dash-surface)]',
      badgeClass: 'bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-500/20 dark:text-purple-200 dark:border-purple-500/30 font-bold',
      pulseClass: 'bg-purple-600 dark:bg-purple-400',
      accentClass: 'text-purple-900 dark:text-purple-400',
      buttonClass: 'border border-purple-400 dark:border-purple-500/40 hover:bg-purple-700 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white text-purple-950 dark:text-purple-100 bg-purple-100/70 dark:bg-purple-950/40 font-bold shadow-xs',
      numberBadgeClass: 'bg-gradient-to-br from-purple-800/80 to-purple-950/90 border-b border-l border-purple-500/60 text-purple-200',
      cardBorderClass: 'border-purple-600/30 hover:border-purple-500/50',
      cardGlowClass: 'from-purple-500/10 via-transparent to-transparent',
      heroPillClass: 'bg-purple-950/80 border-purple-500/40 text-purple-200',
      dotClass: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
      tagClass: 'text-purple-400',
    };
  }

  if (normalized.includes('bran') || normalized.includes('dour') || normalized.includes('white')) {
    return {
      color: 'branco',
      colorLabel: 'Branco / Dourado (Solenidade do Senhor & Festas)',
      borderClass: 'border-amber-300 dark:border-amber-500/40 hover:border-amber-400 dark:hover:border-amber-500/60',
      bgGradientClass: 'bg-gradient-to-r from-amber-50/90 via-[var(--dash-surface)] to-[var(--dash-surface)] dark:from-amber-950/40 dark:via-[var(--dash-surface)] dark:to-[var(--dash-surface)]',
      badgeClass: 'bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/30 font-bold',
      pulseClass: 'bg-amber-600 dark:bg-amber-400',
      accentClass: 'text-amber-950 dark:text-amber-400',
      buttonClass: 'border border-amber-500 dark:border-amber-500/40 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-500 dark:hover:text-stone-900 text-amber-950 dark:text-amber-100 bg-amber-100/70 dark:bg-amber-950/40 font-bold shadow-xs',
      numberBadgeClass: 'bg-gradient-to-br from-[#9E6E38]/80 to-[#6E4822]/90 border-b border-l border-[#FFA82A]/60 text-[#FFCC36]',
      cardBorderClass: 'border-[#C8A463]/40 hover:border-[#FFA82A]/60',
      cardGlowClass: 'from-amber-500/10 via-transparent to-transparent',
      heroPillClass: 'bg-[#8B1E22] border-[#FFA82A]/40 text-[#FFCC36]',
      dotClass: 'bg-[#FFA82A] shadow-[0_0_8px_rgba(255,168,42,0.8)]',
      tagClass: 'text-[#FFA82A]',
    };
  }

  if (normalized.includes('ros') || normalized.includes('pink')) {
    return {
      color: 'rosa',
      colorLabel: 'Rosa (Alegria: Gaudete & Laetare)',
      borderClass: 'border-pink-300 dark:border-pink-500/40 hover:border-pink-400 dark:hover:border-pink-500/60',
      bgGradientClass: 'bg-gradient-to-r from-pink-50/90 via-[var(--dash-surface)] to-[var(--dash-surface)] dark:from-pink-950/40 dark:via-[var(--dash-surface)] dark:to-[var(--dash-surface)]',
      badgeClass: 'bg-pink-100 text-pink-950 border border-pink-300 dark:bg-pink-500/20 dark:text-pink-200 dark:border-pink-500/30 font-bold',
      pulseClass: 'bg-pink-600 dark:bg-pink-400',
      accentClass: 'text-pink-950 dark:text-pink-400',
      buttonClass: 'border border-pink-400 dark:border-pink-500/40 hover:bg-pink-700 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white text-pink-950 dark:text-pink-100 bg-pink-100/70 dark:bg-pink-950/40 font-bold shadow-xs',
      numberBadgeClass: 'bg-gradient-to-br from-rose-800/80 to-pink-950/90 border-b border-l border-pink-500/60 text-pink-200',
      cardBorderClass: 'border-pink-600/30 hover:border-pink-500/50',
      cardGlowClass: 'from-pink-500/10 via-transparent to-transparent',
      heroPillClass: 'bg-pink-950/80 border-pink-500/40 text-pink-200',
      dotClass: 'bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]',
      tagClass: 'text-pink-400',
    };
  }

  // Padrão: Verde (Tempo Comum)
  return {
    color: 'verde',
    colorLabel: 'Verde (Tempo Comum & Perseverança)',
    borderClass: 'border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-400 dark:hover:border-emerald-500/60',
    bgGradientClass: 'bg-gradient-to-r from-emerald-50/90 via-[var(--dash-surface)] to-[var(--dash-surface)] dark:from-emerald-950/40 dark:via-[var(--dash-surface)] dark:to-[var(--dash-surface)]',
    badgeClass: 'bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30 font-bold',
    pulseClass: 'bg-emerald-600 dark:bg-emerald-400',
    accentClass: 'text-emerald-900 dark:text-emerald-400',
    buttonClass: 'border border-emerald-500 dark:border-emerald-500/40 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white text-emerald-950 dark:text-emerald-100 bg-emerald-100/70 dark:bg-emerald-950/40 font-bold shadow-xs',
    numberBadgeClass: 'bg-gradient-to-br from-emerald-800/80 to-emerald-950/90 border-b border-l border-emerald-500/60 text-emerald-200',
    cardBorderClass: 'border-emerald-600/30 hover:border-emerald-500/50',
    cardGlowClass: 'from-emerald-500/10 via-transparent to-transparent',
    heroPillClass: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
    dotClass: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    tagClass: 'text-emerald-400',
  };
}

export interface MissalBooklet {
  id: string;
  title: string;
  celebrationDate: string;
  sundayLabel: string;
  theme: string;
  pdfUrl: string;
  downloadCount?: number;
}

export const sampleMissalBooklets: MissalBooklet[] = [
  {
    id: 'folheto-28-domingo',
    title: 'Folheto Sou do Sagrado Missa • 28º Domingo do Tempo Comum',
    celebrationDate: '11 de Outubro de 2026',
    sundayLabel: 'Próximo Domingo',
    theme: '«Acolher a Palavra com sinceridade de coração»',
    pdfUrl: '#',
    downloadCount: 142,
  },
  {
    id: 'folheto-27-domingo',
    title: 'Folheto Sou do Sagrado Missa • 27º Domingo do Tempo Comum',
    celebrationDate: '04 de Outubro de 2026',
    sundayLabel: 'Domingo Anterior',
    theme: '«Aumenta a nossa fé, Senhor!»',
    pdfUrl: '#',
    downloadCount: 318,
  },
  {
    id: 'folheto-26-domingo',
    title: 'Folheto Sou do Sagrado Missa • 26º Domingo do Tempo Comum',
    celebrationDate: '27 de Setembro de 2026',
    sundayLabel: 'Edição Anterior',
    theme: '«O maior entre vós seja aquele que serve»',
    pdfUrl: '#',
    downloadCount: 295,
  },
];
