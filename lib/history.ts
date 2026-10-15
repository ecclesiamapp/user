/**
 * Dados Históricos Oficiais da Catedral do Sagrado Coração de Jesus de Colatina
 * Fonte: Documentação Paroquial, Arquivo Diocesano e Linha de Sucessão Apostólica
 */

export interface HistoricalMilestone {
  id: string;
  year: string;
  era: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'cross' | 'church' | 'scroll' | 'sparkles' | 'crown' | 'bell';
  highlight?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface BishopSuccession {
  id: string;
  orderNumber: number;
  orderLabel: string;
  name: string;
  title: string;
  period: string;
  motto: string;
  mottoTranslation: string;
  summary: string;
  achievements: string[];
  isCurrent?: boolean;
}

export interface PastorSuccession {
  id: string;
  name: string;
  role: string;
  period: string;
  description: string;
  isCurrent?: boolean;
}

export interface SacredHeritageItem {
  id: string;
  title: string;
  category: string;
  description: string;
  theologicalMeaning: string;
  icon: 'chair' | 'sun' | 'flame' | 'bell' | 'shield' | 'scroll';
  imageUrl?: string;
  imageCaption?: string;
}

export const CATHEDRAL_HISTORICAL_MILESTONES: HistoricalMilestone[] = [
  {
    id: 'm-1928',
    year: '1928',
    era: 'Origens & Fundação',
    title: 'Criação da Paróquia Sagrado Coração de Jesus',
    subtitle: 'Os primeiros missionários no vale do Rio Doce',
    description:
      'Com o florescimento do povoado de Colatina às margens do Rio Doce, é canonicamente erigida a Paróquia Sagrado Coração de Jesus. Os primeiros freis capuchinhos e padres missionários ergueram a primeira igreja matriz, tornando-se o coração espiritual da comunidade.',
    iconName: 'cross',
    highlight: 'Marco fundador da presença católica em Colatina.',
  },
  {
    id: 'm-1952',
    year: '1952',
    era: 'Construção do Templo',
    title: 'A Nova Matriz por Benedito Calixto Neto',
    subtitle: 'O mesmo arquiteto do Santuário Nacional de Aparecida',
    description:
      'Após o desabamento da antiga matriz em 1949 por fortes chuvas, a pedra fundamental do atual templo foi lançada em 20 de junho de 1952. O projeto monumental foi assinado pelo renomado arquiteto paulista Benedito Calixto Neto, erguendo duas torres imponentes e uma nave majestosa com arcos plenos.',
    iconName: 'church',
    highlight: 'Projeto neoclássico e neorromânico concebido pelo mesmo projetista da Basílica de Aparecida/SP.',
    imageUrl: '/images/historia/projeto-benedito-calixto.jpg',
    imageCaption: 'Projeto original de 1952 desenhado pelo arquiteto Benedito Calixto Neto.',
  },
  {
    id: 'm-1970',
    year: '1970',
    era: 'Arte Sacra',
    title: 'Instalação dos Magníficos Vitrais e Sinos',
    subtitle: 'Catequese viva através da luz e do bronze',
    description:
      'O templo recebe os célebres vitrais artísticos de tradição alemã e da Casa Conrado, transformando a nave em um dos mais impressionantes conjuntos de arte vitralista do Brasil. O campanário abriga sinos de bronze batizados em 1960, sendo o maior de uma tonelada, além do relógio de quatro faces na torre de 47 metros.',
    iconName: 'bell',
    highlight: 'Vitrais reconhecidos como patrimônio artístico, sacro e cultural do Espírito Santo.',
    imageUrl: '/images/historia/catedral-vitrais.jpg',
    imageCaption: 'A luz solar filtrada pelos vitrais sacros da Catedral do Sagrado Coração.',
  },
  {
    id: 'm-1990',
    year: '1990',
    era: 'Elevação Canônica',
    title: 'Criação da Diocese de Colatina e Elevação a Catedral',
    subtitle: 'O Papa São João Paulo II institui a Igreja-Mãe',
    description:
      'Em 23 de abril de 1990, por meio da Bula Papal "Ex Munere Caritatis" de São João Paulo II, é criada a Diocese de Colatina, desmembrada da Arquidiocese de Vitória. A Matriz do Sagrado Coração é solenemente elevada à dignidade de Catedral Diocesana, recebendo a Cátedra Episcopal.',
    iconName: 'crown',
    highlight: 'Elevação da Matriz a Igreja-Mãe de 17 municípios capixabas.',
    imageUrl: '/images/historia/catedral-interior.jpg',
    imageCaption: 'A imponente nave da Catedral Sagrado Coração de Jesus de Colatina.',
  },
  {
    id: 'm-2006',
    year: '2006',
    era: 'Tombamento Histórico',
    title: 'Patrimônio Histórico, Artístico e Cultural',
    subtitle: 'Reconhecimento oficial pela Lei Municipal nº 5.246/2006',
    description:
      'O templo da Catedral e seu conjunto arquitetônico são oficialmente declarados Patrimônio Histórico, Artístico e Cultural do município de Colatina, assegurando a preservação perpétua de suas fachadas, torres, arcos e entorno.',
    iconName: 'scroll',
    highlight: 'Catedral consagrada como patrimônio histórico e identidade viva do povo colatinense.',
  },
  {
    id: 'm-2022',
    year: '2022',
    era: 'Adequação Litúrgica & Futuro',
    title: 'Revitalização do Presbitério & Era Digital',
    subtitle: 'Baldaquino dos 7 Dons, acústica e acolhida pastoral',
    description:
      'A Catedral passa por um minucioso restauro litúrgico: ganha o baldaquino heptagonal com os 7 dons do Espírito Santo sobre o Altar, o piso processional de círculos e losangos, painéis acústicos e, no centenário de evangelização, abre suas portas para a presença digital das 12 CEBs.',
    iconName: 'sparkles',
    highlight: 'Beleza sagrada atemporal unida à comunhão das novas gerações de fiéis.',
    imageUrl: '/images/historia/nave-revitalizada.jpg',
    imageCaption: 'Vista da nave central e presbitério após o projeto de adequação litúrgica.',
  },
];

export const BISHOPS_SUCCESSION: BishopSuccession[] = [
  {
    id: 'b-dom-geraldo',
    orderNumber: 1,
    orderLabel: '1º Bispo Diocesano',
    name: 'Dom Geraldo Lyrio Rocha',
    title: 'Bispo de Colatina (1990 – 2002)',
    period: '1990 – 2002',
    motto: 'Opus Justitiae Pax',
    mottoTranslation: 'A paz é fruto da justiça (Is 32, 17)',
    summary:
      'Primeiro bispo da Diocese de Colatina, nomeado pelo Papa São João Paulo II. Instalou a diocese, estruturou os conselhos pastorais e ordenou os primeiros padres diocesanos.',
    achievements: [
      'Instalação solene da Cátedra e da Cúria Diocesana em 1990',
      'Criação do Seminário Diocesano Maria Mãe da Igreja',
      'Posteriormente foi Arcebispo de Mariana e Presidente da CNBB',
    ],
    isCurrent: false,
  },
  {
    id: 'b-dom-decio',
    orderNumber: 2,
    orderLabel: '2º Bispo Diocesano',
    name: 'Dom Décio Sossai Zandonade, SDB',
    title: 'Bispo de Colatina (2003 – 2014)',
    period: '2003 – 2014',
    motto: 'Domine, Ut Videam',
    mottoTranslation: 'Senhor, que eu veja! (Lc 18, 41)',
    summary:
      'Bispo salesiano com forte carisma vocacional e juvenil. Impulsionou intensamente a juventude, a catequese paroquial e a devoção a Nossa Senhora da Saúde.',
    achievements: [
      'Elevação do Santuário Diocesano de Nossa Senhora da Saúde em Ibiraçu',
      'Grande incentivo às vocações sacerdotais e religiosas',
      'Dinamização das pastorais sociais e caritativas em toda a diocese',
    ],
    isCurrent: false,
  },
  {
    id: 'b-dom-wladimir',
    orderNumber: 3,
    orderLabel: '3º Bispo Diocesano',
    name: 'Dom Joaquim Wladimir Lopes Dias',
    title: 'Bispo de Colatina (2015 – 2021)',
    period: '2015 – 2021',
    motto: 'Caritas in Veritate',
    mottoTranslation: 'A caridade na verdade (Ef 4, 15)',
    summary:
      'Dedicou seu ministério episcopal à proximidade com os párocos, formação doutrinal sólida dos fiéis e celebração dos 30 anos de criação da Diocese de Colatina.',
    achievements: [
      'Iniciativa da grande obra de adequação litúrgica da Catedral',
      'Fortalecimento da comunhão presbiteral e visitas pastorais nas paróquias',
      'Conduziu a Igreja Diocesana com serenidade durante o período da pandemia',
    ],
    isCurrent: false,
  },
  {
    id: 'b-dom-lauro',
    orderNumber: 4,
    orderLabel: '4º Bispo Diocesano (Atual)',
    name: 'Dom Lauro Sérgio Versiani Barbosa',
    title: 'Bispo Diocesano de Colatina (2022 – presente)',
    period: '2022 – Presente',
    motto: 'Caritas Christi Urget Nos',
    mottoTranslation: 'O amor de Cristo nos impele (2Cor 5, 14)',
    summary:
      'Atual pastor da Diocese de Colatina. Conduz o povo de Deus com ardor missionário, foco na sinodalidade, escuta das comunidades e testemunho do Evangelho junto aos mais necessitados.',
    achievements: [
      'Posse canônica na Catedral do Sagrado Coração em 02 de fevereiro de 2022',
      'Implementação do processo sinodal nas 12 comunidades e paróquias',
      'Intensa presença pastoral celebrativa e caritativa junto ao povo de Deus',
    ],
    isCurrent: true,
  },
];

export const PARISH_PRIESTS_SUCCESSION: PastorSuccession[] = [
  {
    id: 'p-irineu',
    name: 'Pe. Irineu Claudino Sales',
    role: 'Pároco e Cura da Catedral',
    period: '2021 – Presente',
    description:
      'Atual pároco responsável pela condução espiritual e administrativa da Paróquia Sagrado Coração de Jesus. Conhecido pelo acolhimento fraterno aos fiéis, zelo litúrgico solene e impulso à evangelização das 12 CEBs.',
    isCurrent: true,
  },
  {
    id: 'p-valter',
    name: 'Pe. Valter Rohr',
    role: 'Pároco Emérito',
    period: 'Período Histórico',
    description:
      'Marcou época na vida eclesial de Colatina por seu coração acolhedor, formação de lideranças leigas e dedicação incansável às famílias e aos doentes.',
    isCurrent: false,
  },
  {
    id: 'p-rubens',
    name: 'Monsenhor Rubens Duque',
    role: 'Pároco Construtor',
    period: 'Período Histórico',
    description:
      'Figura de proa na história da fé colatinense. Liderou a mobilização de fé e comunidade para a concretização material e espiritual do templo da Catedral.',
    isCurrent: false,
  },
  {
    id: 'p-vidigal',
    name: 'Pe. José Geraldo Vidigal',
    role: 'Pároco da Memória Pastoral',
    period: 'Período Histórico',
    description:
      'Sacerdote de profunda oração e caridade, dedicou anos fecundos à formação sacramental e pastoral dos paroquianos de Colatina.',
    isCurrent: false,
  },
];

export const SACRED_HERITAGE_ITEMS: SacredHeritageItem[] = [
  {
    id: 'h-projeto',
    title: 'Planta de Benedito Calixto Neto',
    category: 'Arquitetura de 1952',
    description:
      'Projeto assinado pelo mesmo arquiteto da Basílica de Aparecida/SP. Destaca arcos plenos, nave ampla e duas torres imponentes com relógio de quatro faces.',
    theologicalMeaning:
      'A igreja de pedras visíveis expressa a dignidade da Igreja espiritual de Pedras Vivas, chamada a ser farol da verdade divina na cidade.',
    icon: 'scroll',
    imageUrl: '/images/historia/projeto-benedito-calixto.jpg',
    imageCaption: 'Desenho arquitetônico original da Catedral assinado em 1952.',
  },
  {
    id: 'h-vitrais',
    title: 'Os Vitrais Sagrados',
    category: 'Patrimônio Sacro & Luz',
    description:
      'Produzidos com maestria artística pela Casa Conrado e restaurados pela Kingdom. Filtram a luz em tons rubis, dourados e azuis, narrando a Paixão e o Sagrado Coração.',
    theologicalMeaning:
      'Uma Bíblia aberta em cores e luz celestial. A luz que atravessa os vitrais representa a Graça Divina que ilumina e transfigura a vida dos fiéis.',
    icon: 'sun',
    imageUrl: '/images/historia/catedral-vitrais.jpg',
    imageCaption: 'Vitrais sacros originais iluminando a nave da Catedral de Colatina.',
  },
  {
    id: 'h-altar',
    title: 'O Altar e o Baldaquino dos 7 Dons',
    category: 'Centro da Liturgia Eucarística',
    description:
      'Mesa de pedra maciça consagrada, coroada por um elegante baldaquino heptagonal com os sete dons do Espírito Santo e piso em quatro círculos orgânicos.',
    theologicalMeaning:
      'O Altar é o próprio Cristo Vivo. O baldaquino evoca a proteção do Espírito Santo, enquanto os círculos lembram que a Eucaristia deve ir aos quatro cantos do mundo.',
    icon: 'flame',
    imageUrl: '/images/historia/altar-baldaquino.jpg',
    imageCaption: 'Baldaquino heptagonal e Altar consagrado da Catedral.',
  },
  {
    id: 'h-caminho',
    title: 'Caminho das Procissões',
    category: 'Piso em Mosaico Litúrgico',
    description:
      'Inspirado nos labirintos sagrados das basílicas medievais, possui 8 círculos e 7 losangos em granito nobre que conduzem da porta principal ao Altar.',
    theologicalMeaning:
      'O número 8 representa a Ressurreição (o Oitavo Dia da Nova Criação) e o número 7 a plenitude do Espírito Santo, guiando a caminhada do cristão rumo ao Céu.',
    icon: 'shield',
    imageUrl: '/images/historia/caminho-procissoes.jpg',
    imageCaption: 'Piso processional com geometria sagrada e sentido catequético.',
  },
  {
    id: 'h-catedra',
    title: 'A Cátedra & Nave Monumental',
    category: 'Símbolo Episcopal & Assembléia',
    description:
      'A cátedra no presbitério assinala a autoridade docente do Bispo. A ampla nave com painéis acústicos acolhe calorosamente o povo de Deus.',
    theologicalMeaning:
      'A Cátedra é o sinal da unidade diocesana com os Apóstolos e com o Sucessor de Pedro em Roma. A nave expressa a Igreja como Corpo Místico de Cristo.',
    icon: 'chair',
    imageUrl: '/images/historia/catedral-interior.jpg',
    imageCaption: 'Nave central e perspectiva em direção ao presbitério da Catedral.',
  },
  {
    id: 'h-sinos',
    title: 'O Campanário e Sinos de Bronze',
    category: 'A Voz de Deus na Cidade',
    description:
      'Torre sineira com 47 metros de altura, relógio de quatro faces e três sinos fundidos em bronze batizados em 1960 (o maior pesando cerca de 1 tonelada).',
    theologicalMeaning:
      'A voz da Igreja que convoca a comunidade colatinense para as Santas Missas, a oração do Angelus e o louvor perpétuo a Deus.',
    icon: 'bell',
    imageUrl: '/images/historia/nave-revitalizada.jpg',
    imageCaption: 'Harmonia acústica e monumentalidade do templo erguido em Colatina.',
  },
];
