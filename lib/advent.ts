import { AdventCandle, AdventSeasonState, AdventSimulationMode } from '@/types';
import { getLiturgicalColorTheme, LiturgicalColorTheme } from './liturgy';

/**
 * Definições canônicas das 4 Velas Dominicais + 5ª Vela Central de Cristo
 * Tradição Catequética das 4 Cores da Diocese de Colatina / Catedral do Sagrado Coração de Jesus
 */
export const BASE_ADVENT_CANDLES: Omit<AdventCandle, 'isLit' | 'isCurrentWeek'>[] = [
  {
    week: 1,
    name: '1ª Vela: Esperança e Vigília',
    candleTitle: 'Vela dos Profetas',
    color: 'roxo',
    colorLabel: 'Roxo Litúrgico',
    hexColor: '#9333ea', // Roxo vibrante
    glowColor: 'rgba(168, 85, 247, 0.75)',
    periodLabel: '29 de Novembro a 05 de Dezembro',
    biblicalFigure: 'Os Profetas do Antigo Testamento & Patriarcas',
    biblicalPassage: {
      reference: 'Isaías 9, 1',
      text: '«O povo que andava nas trevas viu uma grande luz; sobre os que habitavam na terra da sombra da morte resplandeceu a claridade.»',
    },
    theme: 'Vigilância, Despertar e Esperança Viva',
    catechesis:
      'A primeira vela acesa na Coroa do Advento simboliza a luz da esperança que os profetas acenderam nos corações do povo de Deus enquanto esperavam a vinda do Salvador. Ela nos convida a despertar do sono da tibieza, vigiar em oração constante e preparar o coração para acolher Jesus que vem ao nosso encontro.',
    familyPrayer:
      'Senhor Jesus, Luz do mundo que dissipa todas as trevas: ao acendermos esta primeira vela do Advento, pedimos que renoves em nosso lar a virtude da esperança. Desperta nossa família para a vigilância e a caridade, para que saibamos reconhecer Tua presença viva nos irmãos mais necessitados. Amém!',
    fraternalGesture:
      'Separar alimentos ou agasalhos no lar para entregar à Pastoral Social da Catedral e dedicar 10 minutos diários de silêncio e oração em família.',
  },
  {
    week: 2,
    name: '2ª Vela: Amor e Fé Inabalável',
    candleTitle: 'Vela de Belém e dos Patriarcas',
    color: 'vermelho',
    colorLabel: 'Vermelho Eclesial',
    hexColor: '#dc2626', // Vermelho do amor ardente
    glowColor: 'rgba(239, 68, 68, 0.75)',
    periodLabel: '06 a 12 de Dezembro',
    biblicalFigure: 'A Aliança com Abraão, Isaac, Jacó e a Pequena Belém',
    biblicalPassage: {
      reference: 'Miqueias 5, 1',
      text: '«E tu, Belém-Efrata, pequena entre as cidades de Judá, de ti há de sair para mim aquele que há de reinar sobre Israel.»',
    },
    theme: 'O Amor Redentor e a Fidelidade da Aliança',
    catechesis:
      'A segunda vela recorda o amor fiel de Deus pela humanidade e a jornada de fé dos patriarcas. Ela nos aponta para a humilde cidade de Belém, onde o Altíssimo escolheu nascer na pobreza de uma manjedoura. Convida-nos a endireitar os caminhos do nosso coração e praticar a fé pelo amor fraterno.',
    familyPrayer:
      'Deus de fidelidade e amor infinito: ao vermos crescer a luz desta segunda vela, recordamos que Teu amor nunca nos desampara. Ensina nossa família a caminhar na obediência e na confiança como os patriarcas. Que nossa casa seja uma Belém acolhedora, repleta de reconciliação e generosidade. Amém!',
    fraternalGesture:
      'Promover um momento de reconciliação em família (pedir perdão a quem magoamos) e enviar uma mensagem fraterna de conforto a um irmão que esteja distante.',
  },
  {
    week: 3,
    name: '3ª Vela: A Alegria no Senhor (Gaudete)',
    candleTitle: 'Vela dos Pastores e do Rei Davi',
    color: 'rosa',
    colorLabel: 'Rosa Gaudete',
    hexColor: '#ec4899', // Rosa Gaudete
    glowColor: 'rgba(244, 114, 182, 0.85)',
    periodLabel: '13 a 19 de Dezembro',
    biblicalFigure: 'Os Pastores no Campo e a Promessa à Casa de Davi',
    biblicalPassage: {
      reference: 'Filipenses 4, 4-5',
      text: '«Alegrai-vos sempre no Senhor! Repito: alegrai-vos! Seja a vossa modéstia conhecida de todos os homens. O Senhor está próximo!»',
    },
    theme: 'Alegria Santa: «O Senhor está Próximo!»',
    catechesis:
      'No 3º Domingo do Advento, o Domingo Gaudete, a cor da vela e das vestes litúrgicas suaviza-se para o rosa. É a exultação dos simples e pequeninos! Os pastores velavam seus rebanhos no meio da noite quando foram surpreendidos pelo canto glorioso dos anjos anunciando a Boa Nova: o Salvador já vem!',
    familyPrayer:
      'Senhor Jesus, Fonte de toda a nossa alegria: o Teu nascimento já se aproxima e nossos corações exultam de júbilo! Afasta do nosso lar a tristeza, a ansiedade e a discórdia. Enche nossos filhos e nossos pais da Tua santa paz, para que transbordemos o sorriso da Tua graça por onde passarmos. Amém!',
    fraternalGesture:
      'Confeccionar e partilhar uma lembrança natalina ou visitar uma família ou idoso enfermo da nossa comunidade, levando o abraço fraterno da Catedral.',
  },
  {
    week: 4,
    name: '4ª Vela: Paz e Pureza da Alvorada',
    candleTitle: 'Vela dos Anjos e da Virgem Maria',
    color: 'branco',
    colorLabel: 'Branco Solene',
    hexColor: '#f8fafc', // Branco reluzente
    glowColor: 'rgba(255, 255, 255, 0.85)',
    periodLabel: '20 a 24 de Dezembro (até 17h59)',
    biblicalFigure: 'A Virgem Maria Santíssima e o Arcanjo Gabriel',
    biblicalPassage: {
      reference: 'Lucas 1, 38',
      text: '«Disse então Maria: Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra. E o anjo ausentou-se dela.»',
    },
    theme: 'O Sim de Nazaré, a Paz Divina e a Espera do Menino Jesus',
    catechesis:
      'A quarta vela coroa as semanas de preparação celebrando o «Faça-se» de Maria Santíssima, a Arca da Nova Aliança que acolheu o Verbo no seu ventre imaculado. Todas as quatro velas agora cintilam em conjunto, anunciando que a longa noite da espera humana chegou ao seu termo: a Luz da Vida está prestes a raiar!',
    familyPrayer:
      'Ó Doce Mãe de Deus, Virgem do Silêncio e da Escuta: ensina nossa família a dizer com prontidão e fé o nosso «Sim» diário à vontade do Pai. Ao contemplarmos as quatro velas acesas na nossa Coroa, prepara o berço da nossa alma para receber o Menino Jesus que vem habitar conosco. Amém!',
    fraternalGesture:
      'Participar piedosamente do Sacramento da Reconciliação (Confissão) na Catedral antes da Vigília do Natal e rezar o Santo Terço em família junto ao Presépio.',
  },
  {
    week: 5,
    name: '5ª Vela: A Luz do Mundo (Vela de Cristo)',
    candleTitle: 'Vela Branca de Cristo (Manjedoura de Belém)',
    color: 'branco',
    colorLabel: 'Ouro e Branco Imperial',
    hexColor: '#ffffff',
    glowColor: 'rgba(254, 240, 138, 0.95)',
    periodLabel: '24 de Dezembro (noite) a 06 de Janeiro',
    biblicalFigure: 'O Verbo Encarnado: Nosso Senhor Jesus Cristo',
    biblicalPassage: {
      reference: 'João 1, 14',
      text: '«E o Verbo se fez carne e habitou entre nós, e vimos a sua glória, glória como a do Filho único do Pai, cheio de graça e de verdade.»',
    },
    theme: 'Natividade do Senhor: «Emanuel, Deus Conosco!»',
    catechesis:
      'A quinta vela, situada no centro sagrado da Coroa do Advento, é acesa solenemente na Noite Santa do Natal. Ela é a Vela de Cristo (Christ Candle), a Luz primordial que ilumina todo ser humano. Ela proclama que a promessa se cumpriu: Deus se fez criança para nos elevar ao Céu!',
    familyPrayer:
      'Menino Jesus, Divino Salvador da humanidade: nesta Noite Santa, colocamos nosso lar, nossa paróquia e nossa cidade aos pés da Tua manjedoura. Reina como Senhor absoluto dos nossos corações. Que a Tua luz celeste resplandeça em nós e guie nossos passos durante todo o Ano Novo que se aproxima. Glória a Deus nas alturas! Amém!',
    fraternalGesture:
      'Reunir toda a família ao redor da mesa natalina para entoar «Noite Feliz», abençoar a ceia fraterna e colocar a imagem do Menino Jesus no Presépio.',
  },
];

/**
 * Datas Chave do Advento e Natal de 2026 (Ano C - São Lucas)
 */
export const ADVENT_2026_DATES = {
  START_ADVENT_1: new Date('2026-11-29T00:00:00-03:00').getTime(),
  START_ADVENT_2: new Date('2026-12-06T00:00:00-03:00').getTime(),
  START_ADVENT_3: new Date('2026-12-13T00:00:00-03:00').getTime(), // Gaudete
  START_ADVENT_4: new Date('2026-12-20T00:00:00-03:00').getTime(),
  CHRISTMAS_EVE: new Date('2026-12-24T18:00:00-03:00').getTime(),
  CHRISTMAS_DAY: new Date('2026-12-25T00:00:00-03:00').getTime(),
  EPIPHANY_END: new Date('2027-01-06T23:59:59-03:00').getTime(),
};

/**
 * Calcula o estado atual da Coroa do Advento baseando-se na data informada ou em simulação manual
 */
export function calculateAdventState(
  targetDate: Date = new Date(),
  simulationOverride: AdventSimulationMode = 'auto'
): AdventSeasonState {
  let effectiveWeek = 0; // 0 = antes do Advento, 1 a 4 = semanas, 5 = Natal
  const nowTime = targetDate.getTime();

  if (simulationOverride === 'week-1') {
    effectiveWeek = 1;
  } else if (simulationOverride === 'week-2') {
    effectiveWeek = 2;
  } else if (simulationOverride === 'week-3') {
    effectiveWeek = 3;
  } else if (simulationOverride === 'week-4') {
    effectiveWeek = 4;
  } else if (simulationOverride === 'christmas') {
    effectiveWeek = 5;
  } else {
    // Modo automático por data de calendário
    if (nowTime >= ADVENT_2026_DATES.CHRISTMAS_EVE) {
      effectiveWeek = 5;
    } else if (nowTime >= ADVENT_2026_DATES.START_ADVENT_4) {
      effectiveWeek = 4;
    } else if (nowTime >= ADVENT_2026_DATES.START_ADVENT_3) {
      effectiveWeek = 3;
    } else if (nowTime >= ADVENT_2026_DATES.START_ADVENT_2) {
      effectiveWeek = 2;
    } else if (nowTime >= ADVENT_2026_DATES.START_ADVENT_1) {
      effectiveWeek = 1;
    } else {
      // Antes de 29/11/2026
      effectiveWeek = 0;
    }
  }

  // Contagem regressiva até a Noite de Natal (24/12/2026 18:00)
  const diffMs = ADVENT_2026_DATES.CHRISTMAS_EVE - nowTime;
  const daysUntilChristmas = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  // Determinar quais velas estão acesas
  // Se effectiveWeek === 0 (antes do advento), por padrão nenhuma vela está acesa no modo automático,
  // mas o fiel pode explorar clicando nelas!
  const candles: AdventCandle[] = BASE_ADVENT_CANDLES.map((base) => {
    let isLit = false;
    let isCurrentWeek = false;

    if (effectiveWeek === 5) {
      // No Natal, todas as 5 velas estão acesas!
      isLit = true;
      isCurrentWeek = base.week === 5;
    } else if (effectiveWeek > 0) {
      // Nas semanas 1 a 4, as velas dominicais menores ou iguais à semana atual acendem.
      // A 5ª vela (Cristo) só acende na semana 5 (Natal).
      if (base.week <= effectiveWeek && base.week < 5) {
        isLit = true;
      }
      isCurrentWeek = base.week === effectiveWeek;
    }

    return {
      ...base,
      isLit,
      isCurrentWeek,
    };
  });

  // Determinar rótulo do tempo e cor litúrgica principal correspondente
  let seasonLabel = 'Tempo do Advento (Preparação do Natal)';
  let liturgicalColor: 'roxo' | 'vermelho' | 'rosa' | 'branco' = 'roxo';

  switch (effectiveWeek) {
    case 1:
      seasonLabel = '1º Domingo do Advento • Ano C';
      liturgicalColor = 'roxo';
      break;
    case 2:
      seasonLabel = '2º Domingo do Advento • Ano C';
      liturgicalColor = 'vermelho';
      break;
    case 3:
      seasonLabel = '3º Domingo do Advento (Gaudete) • Ano C';
      liturgicalColor = 'rosa';
      break;
    case 4:
      seasonLabel = '4º Domingo do Advento • Ano C';
      liturgicalColor = 'branco';
      break;
    case 5:
      seasonLabel = 'Solenidade da Natividade do Senhor • Santo Natal';
      liturgicalColor = 'branco';
      break;
    default:
      seasonLabel = 'Rumo ao 1º Domingo do Advento (29/11/2026)';
      liturgicalColor = 'roxo';
      break;
  }

  // Vela ativa principal
  const activeCandleIndex = effectiveWeek > 0 ? Math.min(effectiveWeek - 1, 4) : 0;
  const activeCandle = candles[activeCandleIndex];

  return {
    currentWeek: effectiveWeek,
    seasonLabel,
    isAdventSeason: effectiveWeek >= 1 && effectiveWeek <= 4,
    isChristmas: effectiveWeek === 5,
    liturgicalColor,
    daysUntilChristmas,
    candles,
    activeCandle,
    simulationMode: simulationOverride,
  };
}

/**
 * Obtém o tema CSS litúrgico completo baseado na cor da semana do Advento
 */
export function getAdventLiturgicalTheme(state: AdventSeasonState): LiturgicalColorTheme {
  return getLiturgicalColorTheme(state.liturgicalColor);
}
