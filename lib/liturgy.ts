/**
 * Tipos e Utilitários do Calendário Litúrgico e Folhetos da Missa
 * Conforme ESCOPO_CALENDARIO_LITURGICO.md
 */

export type LiturgicalColor = 'verde' | 'roxo' | 'vermelho' | 'branco' | 'rosa';

export interface LiturgicalReadings {
  firstReading: {
    reference: string;
    text: string;
  };
  psalm: {
    reference: string;
    response: string;
    text: string;
  };
  secondReading?: {
    reference: string;
    text: string;
  };
  gospel: {
    reference: string;
    text: string;
  };
}

export interface LiturgicalDayInfo {
  date: string;
  celebrationTitle: string;
  season: string; // ex: "Tempo Comum"
  week: string; // ex: "26ª Semana"
  color: LiturgicalColor;
  colorLabel: string;
  colorHex: string;
  colorBorder: string;
  colorBg: string;
  colorText: string;
  evangeliumExcerpt: string;
  gospelReference: string;
  readings: LiturgicalReadings;
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

export function getTodayLiturgicalInfo(): LiturgicalDayInfo {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth(); // 9 = Outubro (0-indexed)

  return {
    date: now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    celebrationTitle: 'Tempo Comum • 26ª Semana da Vida da Igreja',
    season: 'Tempo Comum',
    week: '26ª Semana',
    color: 'verde',
    colorLabel: 'Verde (Esperança e Perseverança)',
    colorHex: '#16a34a',
    colorBorder: 'border-emerald-600/40',
    colorBg: 'bg-emerald-950/20',
    colorText: 'text-emerald-400',
    evangeliumExcerpt: '«Quem vos der a beber um copo de água por serdes de Cristo, em verdade vos digo: de modo algum perderá a sua recompensa.»',
    gospelReference: 'Evangelho segundo São Lucas',
    readings: {
      firstReading: {
        reference: 'Livro do Profeta Jeremias',
        text: 'Eis que dias virão, diz o Senhor, em que concluirei com a casa de Israel uma nova aliança. Porei minha lei no seu peito e a gravarei no seu coração; serei o seu Deus e eles serão o meu povo.',
      },
      psalm: {
        reference: 'Salmo 118 (119)',
        response: 'R. Ensinai-me, Senhor, os vossos caminhos!',
        text: 'Feliz o homem que não anda conforme o conselho dos perversos, mas tem o seu enlevo na lei do Senhor e nela medita de dia e de noite. Ele é como a árvore plantada junto à corrente das águas.',
      },
      gospel: {
        reference: 'Evangelho segundo São Lucas 10, 1-9',
        text: 'Naquele tempo, o Senhor escolheu outros setenta e dois discípulos e enviou-os dois a dois, à sua frente, a toda cidade e lugar aonde ele próprio devia ir. E dizia-lhes: «A messe é grande, mas os trabalhadores são poucos. Por isso pedi ao Senhor da messe que mande trabalhadores para a sua colheita. Ide! Eis que vos envio como cordeiros para o meio de lobos...» Palavra da Salvação.',
      },
    },
  };
}

export const sampleMissalBooklets: MissalBooklet[] = [
  {
    id: 'folheto-27-domingo',
    title: 'Folheto Sou do Sagrado Missa • 27º Domingo do Tempo Comum',
    celebrationDate: '04 de Outubro de 2026',
    sundayLabel: 'Próximo Domingo',
    theme: '«Aumenta a nossa fé, Senhor!»',
    pdfUrl: '#',
    downloadCount: 142,
  },
  {
    id: 'folheto-26-domingo',
    title: 'Folheto Sou do Sagrado Missa • 26º Domingo do Tempo Comum',
    celebrationDate: '27 de Setembro de 2026',
    sundayLabel: 'Domingo Anterior',
    theme: '«Acolher a Palavra com sinceridade de coração»',
    pdfUrl: '#',
    downloadCount: 318,
  },
  {
    id: 'folheto-25-domingo',
    title: 'Folheto Sou do Sagrado Missa • 25º Domingo do Tempo Comum',
    celebrationDate: '20 de Setembro de 2026',
    sundayLabel: 'Edição Anterior',
    theme: '«O maior entre vós seja aquele que serve»',
    pdfUrl: '#',
    downloadCount: 295,
  },
];
