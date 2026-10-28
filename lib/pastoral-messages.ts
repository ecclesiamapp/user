import { PastoralMessage } from '@/types';

export const OFFICIAL_CHRISTMAS_MESSAGES: PastoralMessage[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000010',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    author_type: 'bispo',
    author_name: 'Dom Lauro Sérgio Versiani Barbosa',
    author_title: 'Bispo Diocesano de Colatina',
    author_photo_url: '/images/pastores/dom-lauro-versiani.webp',
    title: 'Glória a Deus no Mais Alto dos Céus e Paz na Terra: Carta Pastoral do Advento e Natal',
    slug: 'carta-pastoral-natal-2026-dom-lauro',
    subtitle: '«O Verbo se fez carne e habitou entre nós (Jo 1, 14)» — O mistério do Deus próximo que renova a esperança dos lares e ilumina o Vale do Rio Doce.',
    content: `Amados diocesanos, sacerdotes, diáconos, religiosas e fiéis de toda a Diocese de Colatina e da nossa Paróquia Catedral do Sagrado Coração de Jesus:

Aproxima-se a Noite Santa na qual a Igreja inteira se prostra em adoração diante do Menino Deus deitado em uma manjedoura. O Natal não é uma mera recordação poética do passado, mas o acontecimento vivo da graça: o Deus Altíssimo desceu à nossa pequenez humana para nos elevar à Sua divindade.

Neste ano em que consolidamos nossa presença pastoral em cada comunidade urbana e rural, somos convidados pelo mistério da Encarnação a sermos instrumentos de verdadeira paz. O mundo clama por concórdia, justiça e fraternidade. Onde houver divisão, sejamos nós a ponte; onde houver solidão ou enfermidade, levemos o calor da presença e a caridade fraterna.

Dirijo meu olhar pastoral e afetuoso a todas as famílias: acolhei com alegria o Menino Jesus no presépio de vossos corações. Que a bênção de Deus Todo-Poderoso desça sobre vossos lares, proteja nossas crianças e console nossos enfermos.

Um Santo e Abençoado Natal a todos e um Ano Novo pleno de esperança e paz sob o olhar de Maria, Mãe de Deus e Senhora da Saúde!`,
    liturgical_season: 'Tempo do Advento & Solenidade do Natal',
    is_featured_home: true,
    is_active: true,
    published_at: '2026-11-29T08:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000011',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    author_type: 'paroco',
    author_name: 'Padre Irineu Claudino Sales',
    author_title: 'Pároco e Cura da Catedral de Colatina',
    author_photo_url: '/images/pastores/pe-irineu-claudino-sales.webp',
    title: 'A Luz da Manjedoura Ilumina Nossas Famílias: Mensagem do Pároco',
    slug: 'mensagem-natal-2026-pe-irineu-paroco',
    subtitle: '«Não tenhais medo! Eu vos anuncio uma grande alegria para todo o povo (Lc 2, 10)» — Que o Menino Jesus encontre pousada em cada coração e nas 12 CEBs da nossa Catedral.',
    content: `Queridos paroquianos da nossa amada Catedral do Sagrado Coração de Jesus e irmãos das 12 Comunidades Eclesiais de Base:

Chegamos ao ápice do ano pastoral com o coração transbordante de ação de graças. Olhando para trás, contemplamos os incontáveis passos dados na oração diária, nas Santas Missas celebradas com devoção em nossa Catedral, nos círculos bíblicos nos bairros e na assistência caridosa aos mais necessitados.

O Natal do Senhor nos recorda que Deus escolheu a simplicidade para nos amar. O Salvador não veio nos palácios da força, mas na ternura de uma criança envolta em panos. Por isso, a nossa paróquia se abre em festa para acolher cada irmão: os que vêm de perto e os que retornam ao seio familiar neste fim de ano.

Convido todos a participarem com fervor da nossa Novena de Natal e da Solene Missa da Vigília (Missa do Galo). Tragam seus filhos, idosos e amigos. Venham entronizar o Menino Jesus em família.

Em nome dos nossos padres vigários e de todas as lideranças pastorais, desejo a cada um de vocês um Natal santo, luminoso e repleto do Coração Imaculado de Maria e do Coração Sagrado de Jesus.`,
    liturgical_season: 'Tempo do Advento & Natal',
    is_featured_home: true,
    is_active: true,
    published_at: '2026-11-29T08:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    author_type: 'paroco',
    author_name: 'Padre Irineu Claudino Sales',
    author_title: 'Pároco e Cura da Catedral de Colatina',
    author_photo_url: '/images/pastores/pe-irineu-claudino-sales.webp',
    title: 'Uma Igreja em Saída nos Meios Digitais: Bem-vindos ao Novo Portal da Catedral!',
    slug: 'palavra-do-paroco-uma-igreja-em-saida-digital',
    subtitle: '«A beleza de nossa fé precisa resplandecer onde o povo está — e hoje, nossos lares e corações também se conectam pela tela do celular.»',
    content: 'Queridos paroquianos da Catedral do Sagrado Coração de Jesus e irmãos de todas as nossas 12 comunidades e núcleos de oração! É com imensa alegria pastoral e coração repleto de esperança que apresentamos este novo portal digital da nossa paróquia. O Papa Francisco constantemente nos convida a sermos uma "Igreja de Portas Abertas", acolhedora e próxima de cada família, enfermo e jovem.',
    liturgical_season: 'Comunicação Pastoral • Inauguração Digital',
    is_featured_home: false,
    is_active: true,
    published_at: '2026-10-07T10:00:00Z',
  },
];

export const fallbackFeaturedMessages: PastoralMessage[] = OFFICIAL_CHRISTMAS_MESSAGES.filter(
  (m) => m.is_featured_home
);
