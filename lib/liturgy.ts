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
}

export function getLiturgicalColorTheme(colorName: string = 'Verde'): LiturgicalColorTheme {
  const normalized = (colorName || '').toLowerCase().trim();

  if (normalized.includes('verm') || normalized.includes('red')) {
    return {
      color: 'vermelho',
      colorLabel: 'Vermelho (Espírito Santo & Santos Mártires)',
      borderClass: 'border-red-500/40 hover:border-red-500/60',
      bgGradientClass: 'bg-gradient-to-r from-red-950/40 via-[var(--dash-surface)] to-[var(--dash-surface)]',
      badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30',
      pulseClass: 'bg-red-400',
      accentClass: 'text-red-400',
      buttonClass: 'border-red-500/30 hover:border-red-500 hover:bg-red-950/20 text-red-300',
    };
  }

  if (normalized.includes('rox') || normalized.includes('purple')) {
    return {
      color: 'roxo',
      colorLabel: 'Roxo (Conversão & Esperança no Senhor)',
      borderClass: 'border-purple-500/40 hover:border-purple-500/60',
      bgGradientClass: 'bg-gradient-to-r from-purple-950/40 via-[var(--dash-surface)] to-[var(--dash-surface)]',
      badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      pulseClass: 'bg-purple-400',
      accentClass: 'text-purple-400',
      buttonClass: 'border-purple-500/30 hover:border-purple-500 hover:bg-purple-950/20 text-purple-300',
    };
  }

  if (normalized.includes('bran') || normalized.includes('dour') || normalized.includes('white')) {
    return {
      color: 'branco',
      colorLabel: 'Branco / Dourado (Solenidade do Senhor & Festas)',
      borderClass: 'border-amber-500/40 hover:border-amber-500/60',
      bgGradientClass: 'bg-gradient-to-r from-amber-950/40 via-[var(--dash-surface)] to-[var(--dash-surface)]',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      pulseClass: 'bg-amber-400',
      accentClass: 'text-amber-400',
      buttonClass: 'border-amber-500/30 hover:border-amber-500 hover:bg-amber-950/20 text-amber-200',
    };
  }

  if (normalized.includes('ros') || normalized.includes('pink')) {
    return {
      color: 'rosa',
      colorLabel: 'Rosa (Alegria: Gaudete & Laetare)',
      borderClass: 'border-pink-500/40 hover:border-pink-500/60',
      bgGradientClass: 'bg-gradient-to-r from-pink-950/40 via-[var(--dash-surface)] to-[var(--dash-surface)]',
      badgeClass: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
      pulseClass: 'bg-pink-400',
      accentClass: 'text-pink-400',
      buttonClass: 'border-pink-500/30 hover:border-pink-500 hover:bg-pink-950/20 text-pink-300',
    };
  }

  // Padrão: Verde (Tempo Comum)
  return {
    color: 'verde',
    colorLabel: 'Verde (Tempo Comum & Perseverança)',
    borderClass: 'border-emerald-500/40 hover:border-emerald-500/60',
    bgGradientClass: 'bg-gradient-to-r from-emerald-950/40 via-[var(--dash-surface)] to-[var(--dash-surface)]',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    pulseClass: 'bg-emerald-400',
    accentClass: 'text-emerald-400',
    buttonClass: 'border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/20 text-emerald-300',
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
