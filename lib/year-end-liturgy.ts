/**
 * Grade Litúrgica Especial de Fim de Ano & Solenidade do Natal
 * Paróquia da Catedral do Sagrado Coração de Jesus • Diocese de Colatina
 */

export interface YearEndEvent {
  id: string;
  category: 'novena' | 'vigilia_natal' | 'dia_natal' | 'ano_novo';
  categoryLabel: string;
  title: string;
  dateLabel: string;
  time: string;
  location: string;
  isHeadquarters: boolean;
  celebrant?: string;
  description: string;
  isHighlight?: boolean;
  type: 'missa' | 'celebracao_palavra' | 'novena';
}

export const YEAR_END_CATEGORIES = [
  { id: 'all', label: 'Toda a Programação' },
  { id: 'novena', label: 'Novena de Natal (15 a 23/12)' },
  { id: 'vigilia_natal', label: 'Vigília & Noite Santa (24/12)' },
  { id: 'dia_natal', label: 'Natividade do Senhor (25/12)' },
  { id: 'ano_novo', label: 'Ano Novo & Te Deum (31/12 e 01/01)' },
] as const;

export const YEAR_END_EVENTS: YearEndEvent[] = [
  // 1. NOVENA DE NATAL
  {
    id: 'ye-novena-catedral',
    category: 'novena',
    categoryLabel: 'Novena de Natal',
    title: 'Novena Solene de Natal na Catedral',
    dateLabel: '15 a 23 de Dezembro (Diariamente)',
    time: '19:30',
    location: 'Catedral Sagrado Coração de Jesus (Sede)',
    isHeadquarters: true,
    celebrant: 'Pe. Irineu Claudino Sales & Sacerdotes Convidados',
    description: 'Encontro diário de reflexão bíblica, oração com as famílias e bênção solene do presépio.',
    isHighlight: false,
    type: 'missa',
  },
  {
    id: 'ye-novena-cebs',
    category: 'novena',
    categoryLabel: 'Novena de Natal',
    title: 'Círculos Bíblicos da Novena nos Lares das 12 CEBs',
    dateLabel: '15 a 23 de Dezembro (Segunda a Sexta)',
    time: '19:30',
    location: 'Nas 12 Comunidades Eclesiais de Base',
    isHeadquarters: false,
    celebrant: 'Coordenações Comunitárias & Grupos de Reflexão',
    description: 'Reunião das famílias e vizinhos nos bairros em torno da Palavra de Deus e partilha fraterna.',
    isHighlight: false,
    type: 'celebracao_palavra',
  },

  // 2. VIGÍLIA DE NATAL (24/12)
  {
    id: 'ye-galo-catedral',
    category: 'vigilia_natal',
    categoryLabel: 'Missa da Noite Santa',
    title: 'Santa Missa da Vigília do Natal (Missa do Galo)',
    dateLabel: 'Quinta-feira, 24 de Dezembro',
    time: '19:30',
    location: 'Catedral Sagrado Coração de Jesus (Altar Principal)',
    isHeadquarters: true,
    celebrant: 'Dom Lauro Sérgio Versiani Barbosa & Pe. Irineu Claudino Sales',
    description: 'Celebração solene da Natividade com canto das Kalendas, coro paroquial e entronização do Menino Jesus.',
    isHighlight: true,
    type: 'missa',
  },
  {
    id: 'ye-vigilia-perpetuo',
    category: 'vigilia_natal',
    categoryLabel: 'Vigília de Natal',
    title: 'Santa Missa da Vigília do Natal',
    dateLabel: 'Quinta-feira, 24 de Dezembro',
    time: '18:00',
    location: 'Comunidade Perpétuo Socorro (Bairro Perpétuo Socorro)',
    isHeadquarters: false,
    celebrant: 'Pe. Deivid',
    description: 'Santa Missa vespertina com bênção especial das crianças e famílias da comunidade.',
    isHighlight: false,
    type: 'missa',
  },
  {
    id: 'ye-vigilia-sagrada-fam',
    category: 'vigilia_natal',
    categoryLabel: 'Vigília de Natal',
    title: 'Santa Missa da Vigília da Sagrada Família',
    dateLabel: 'Quinta-feira, 24 de Dezembro',
    time: '18:00',
    location: 'Comunidade Sagrada Família (Bairro Maria Ismênia)',
    isHeadquarters: false,
    celebrant: 'Pe. Ernandes',
    description: 'Missa da Noite Santa com a Pastoral Familiar e acolhimento dos devotos.',
    isHighlight: false,
    type: 'missa',
  },
  {
    id: 'ye-vigilia-sao-pedro',
    category: 'vigilia_natal',
    categoryLabel: 'Vigília de Natal',
    title: 'Santa Missa da Vigília na Comunidade São Pedro',
    dateLabel: 'Quinta-feira, 24 de Dezembro',
    time: '19:30',
    location: 'Comunidade São Pedro (Bairro Tropical)',
    isHeadquarters: false,
    celebrant: 'Padre Convidado da Diocese',
    description: 'Celebração da Vigília Dominical da Natividade do Senhor com a juventude local.',
    isHighlight: false,
    type: 'missa',
  },

  // 3. DIA DO NATAL (25/12)
  {
    id: 'ye-natal-catedral-manha',
    category: 'dia_natal',
    categoryLabel: 'Dia de Natal',
    title: 'Santa Missa Solene do Dia de Natal (Missa da Aurora)',
    dateLabel: 'Sexta-feira, 25 de Dezembro',
    time: '09:00',
    location: 'Catedral Sagrado Coração de Jesus (Sede)',
    isHeadquarters: true,
    celebrant: 'Dom Lauro Sérgio Versiani Barbosa',
    description: 'Missa Solene da Natividade com bênção apostólica a todo o povo de Deus de Colatina.',
    isHighlight: true,
    type: 'missa',
  },
  {
    id: 'ye-natal-catedral-noite',
    category: 'dia_natal',
    categoryLabel: 'Dia de Natal',
    title: 'Santa Missa da Noite do Natal do Senhor',
    dateLabel: 'Sexta-feira, 25 de Dezembro',
    time: '19:00',
    location: 'Catedral Sagrado Coração de Jesus (Sede)',
    isHeadquarters: true,
    celebrant: 'Pe. Irineu Claudino Sales (Pároco)',
    description: 'Celebração festiva de encerramento do dia do Natal com acolhimento aos peregrinos e visitantes.',
    isHighlight: false,
    type: 'missa',
  },
  {
    id: 'ye-natal-santa-luzia',
    category: 'dia_natal',
    categoryLabel: 'Dia de Natal',
    title: 'Santa Missa do Dia de Natal em Santa Luzia',
    dateLabel: 'Sexta-feira, 25 de Dezembro',
    time: '09:30',
    location: 'Comunidade Santa Luzia (Alto Vila Nova)',
    isHeadquarters: false,
    celebrant: 'Pe. Deivid',
    description: 'Celebração da Natividade do Menino Jesus com louvor e confraternização comunitária.',
    isHighlight: false,
    type: 'missa',
  },
  {
    id: 'ye-natal-penha',
    category: 'dia_natal',
    categoryLabel: 'Dia de Natal',
    title: 'Santa Missa do Natal na Comunidade Nossa Senhora da Penha',
    dateLabel: 'Sexta-feira, 25 de Dezembro',
    time: '17:00',
    location: 'Comunidade Nossa Senhora da Penha (Moacir Brotas)',
    isHeadquarters: false,
    celebrant: 'Pe. Ernandes',
    description: 'Santa Missa em honra à Natividade e consagração das famílias capixabas à Virgem Mãe.',
    isHighlight: false,
    type: 'missa',
  },

  // 4. ANO NOVO & TE DEUM (31/12 & 01/01)
  {
    id: 'ye-tedeum-catedral',
    category: 'ano_novo',
    categoryLabel: 'Ação de Graças',
    title: 'Missa Solene em Ação de Graças (Te Deum)',
    dateLabel: 'Quinta-feira, 31 de Dezembro',
    time: '19:30',
    location: 'Catedral Sagrado Coração de Jesus (Sede)',
    isHeadquarters: true,
    celebrant: 'Pe. Irineu Claudino Sales & Padres Vigários',
    description: 'Solene cântico do Te Deum de gratidão pelas bênçãos do ano findo e Bênção com o Santíssimo Sacramento.',
    isHighlight: true,
    type: 'missa',
  },
  {
    id: 'ye-paz-catedral',
    category: 'ano_novo',
    categoryLabel: 'Dia Mundial da Paz',
    title: 'Solenidade de Santa Maria, Mãe de Deus',
    dateLabel: 'Sexta-feira, 01 de Janeiro',
    time: '09:00 e 19:00',
    location: 'Catedral Sagrado Coração de Jesus (Sede)',
    isHeadquarters: true,
    celebrant: 'Dom Lauro Sérgio Versiani Barbosa & Sacerdotes',
    description: 'Missa Solene pelo 59º Dia Mundial da Paz e bênção do novo ano civil para todas as famílias.',
    isHighlight: true,
    type: 'missa',
  },
  {
    id: 'ye-ano-novo-expedito',
    category: 'ano_novo',
    categoryLabel: 'Santa Maria Mãe de Deus',
    title: 'Santa Missa da Mãe de Deus em Santo Expedito',
    dateLabel: 'Sexta-feira, 01 de Janeiro',
    time: '19:30',
    location: 'Comunidade Santo Expedito (Jardim Planalto)',
    isHeadquarters: false,
    celebrant: 'Pe. Deivid',
    description: 'Primeira Missa do ano com envio pastoral das lideranças e bênção dos planos do novo ciclo.',
    isHighlight: false,
    type: 'missa',
  },
];
