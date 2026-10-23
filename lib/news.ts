/**
 * Módulo de Notícias e Comunicação Paroquial (PASCOM)
 * Catedral do Sagrado Coração de Jesus - Colatina/ES
 */

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
  category: 'aviso' | 'noticia' | 'evento' | 'pastoral' | 'festa_padroeiro';
  categoryLabel: string;
  imageUrl: string;
  imageCaption?: string;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
  readTimeMinutes: number;
  communityName?: string;
}

export const NEWS_CATEGORIES = [
  { id: 'all', label: 'Todas as Notícias' },
  { id: 'aviso', label: 'Avisos da Semana' },
  { id: 'noticia', label: 'Notícias & Obras' },
  { id: 'evento', label: 'Eventos & Solenidades' },
  { id: 'pastoral', label: 'Vida Pastoral' },
  { id: 'festa_padroeiro', label: 'Festas & Padroeiros' },
] as const;

export const OFFICIAL_NEWS_DATA: NewsArticle[] = [
  {
    id: 'n-01',
    slug: 'acao-solidaria-festa-sagrado-coracao-2026',
    title: 'Ação Solidária e Programação Solene da Festa do Sagrado Coração de Jesus',
    subtitle: 'Novenas, carreatas e o tradicional almoço comunitário mobilizam toda a diocese',
    summary:
      'Confira a programação completa de Santas Missas, novenas com bispos convidados e a grande ação fraterna em prol das famílias assistidas pelos Vicentinos.',
    content: `
A Paróquia da Catedral do Sagrado Coração de Jesus se prepara com júbilo para vivenciar os festejos do seu excelso Padroeiro. Sob a coordenação do Pároco Pe. Irineu Claudino Sales e da Comissão Pastoral Paroquial, as festividades deste ano trazem o lema: *"Coração de Jesus, fornalha ardente de amor e solidariedade"*.

### Programação das Santas Missas e Novena Solene
A novena litúrgica ocorrerá diariamente na Catedral com a presença de sacerdotes da nossa Diocese e paróquias coirmãs:
* **Segunda a Sexta-feira:** 19h00 — Santa Missa Solene com pregação temática e bênção do Santíssimo Sacramento.
* **Sábados:** 18h00 — Santa Missa com bênção especial das famílias e juventude.
* **Domingos:** 07h00, 09h00 e 19h00 — Celebrações Eucarísticas na nave central.

### Almoço Comunitário e Arrecadação de Alimentos
No domingo festivo, após a Santa Missa das 09h presidida por Dom Lauro Sérgio Versiani Barbosa, acontecerá o tradicional almoço beneficente no pátio paroquial. Toda a renda obtida será revertida para as obras sociais da Paróquia e reforma dos espaços catequéticos das comunidades de periferia.

A Pastoral Social e a Conferência Vicentina também estarão recolhendo alimentos não perecíveis e materiais de higiene durante todas as celebrações. Participe com sua família e fortaleça nossa comunhão eclesial!
    `.trim(),
    category: 'festa_padroeiro',
    categoryLabel: 'Festa do Padroeiro',
    imageUrl: '/images/historia/catedral-interior.jpg',
    imageCaption: 'A imponente nave da Catedral em dia de celebração solene.',
    publishedAt: '14 de Outubro, 2026',
    authorName: 'PASCOM Catedral',
    authorRole: 'Pastoral da Comunicação',
    isUrgent: false,
    isFeatured: true,
    readTimeMinutes: 4,
    communityName: 'Matriz Catedral',
  },
  {
    id: 'n-02',
    slug: 'inscricoes-catequese-primeira-eucaristia-crisma-2027',
    title: 'Inscrições Abertas para a Catequese de Primeira Eucaristia e Crisma',
    subtitle: 'Iniciação cristã para crianças, adolescentes e adultos em todas as 12 comunidades',
    summary:
      'A Pastoral Catequética convoca os pais e catequizandos para o período oficial de inscrições. O processo pode ser realizado online ou na secretaria paroquial.',
    content: `
A Iniciação à Vida Cristã é o caminho luminoso pelo qual acolhemos o Evangelho e somos incorporados plenamente aos Sacramentos da Igreja. A Pastoral Catequética da Catedral comunica a abertura das inscrições para o itinerário formativo de 2027.

### Etapas e Faixas Etárias
1. **Eucaristia Infantil (1ª e 2ª Etapas):** Crianças a partir de 8 anos completos até o início do ano letivo.
2. **Crisma para Jovens:** Adolescentes a partir dos 14 anos, preparando o coração para a confirmação do Batismo e a efusão do Espírito Santo.
3. **Catequese e Crisma de Adultos:** Itinerário para homens e mulheres que desejam completar os sacramentos de Iniciação Cristã.

### Documentos Necessários
* Cópia da Certidão de Nascimento do catequizando.
* Lembrança do Batismo (se já for batizado).
* Comprovante de residência familiar em Colatina.
* Contato telefônico e autorização dos responsáveis.

As inscrições podem ser feitas diretamente pelo módulo de sacramentos do portal da Catedral ou na Secretaria Paroquial de segunda a sexta-feira.
    `.trim(),
    category: 'pastoral',
    categoryLabel: 'Catequese Paroquial',
    imageUrl: '/images/historia/altar-baldaquino.jpg',
    imageCaption: 'Presbitério da Catedral onde os sacramentos são celebrados.',
    publishedAt: '10 de Outubro, 2026',
    authorName: 'Coordenação Catequética',
    authorRole: 'Pastoral da Iniciação Cristã',
    isUrgent: false,
    isFeatured: false,
    readTimeMinutes: 3,
    communityName: 'Todas as CEBs',
  },
  {
    id: 'n-03',
    slug: 'folheto-liturgico-sou-do-sagrado-leituras-domingo',
    title: 'Sou do Sagrado Missa: Folheto Litúrgico com as Leituras do Domingo',
    subtitle: 'Baixe antecipadamente as leituras bíblicas, orações e cantos dominicais',
    summary:
      'Disponibilizado o libreto oficial das celebrações dominicais na Catedral e nas 12 comunidades. Acompanhe a Liturgia da Palavra pelo celular.',
    content: `
Para promover a participação ativa, consciente e frutuosa dos fiéis nas celebrações da Santa Missa, a equipe litúrgica da Catedral do Sagrado Coração de Jesus disponibiliza semanalmente a versão digital do folheto litúrgico **«Sou do Sagrado Missa»**.

### Conteúdo do Folheto
* Ritos Iniciais e Antífona de Entrada.
* Leituras bíblicas oficiais extraídas do Lecionário da CNBB (Primeira Leitura, Salmo Responsorial, Segunda Leitura e Evangelho).
* Oração dos Fiéis com intenções pela Igreja Universal, pela Diocese de Colatina e pelos enfermos.
* Rito da Comunhão e Bênção Final.

O folheto está otimizado para visualização leve em qualquer modelo de smartphone e pode ser baixado em PDF ou lido diretamente na tela do celular durante a Santa Missa.
    `.trim(),
    category: 'aviso',
    categoryLabel: 'Liturgia Dominical',
    imageUrl: '/images/historia/caminho-procissoes.jpg',
    imageCaption: 'Piso processional da nave central da Catedral.',
    publishedAt: '08 de Outubro, 2026',
    authorName: 'Equipe de Liturgia',
    authorRole: 'Pastoral Litúrgica',
    isUrgent: false,
    isFeatured: false,
    readTimeMinutes: 2,
    communityName: 'Matriz Catedral',
  },
  {
    id: 'n-04',
    slug: 'restauro-vitrais-centenarios-catedral-colatina',
    title: 'Adequação Litúrgica e Preservação dos Vitrais Artísticos da Catedral',
    subtitle: 'Obras de conservação preventiva do patrimônio histórico e sacro tombado por lei',
    summary:
      'Equipe de especialistas conclui revisão técnica nos vitrais da Casa Conrado e na iluminação sacra do baldaquino dos 7 dons.',
    content: `
A Catedral do Sagrado Coração de Jesus é um dos maiores tesouros sacros e arquitetônicos do estado do Espírito Santo. Tombada como Patrimônio Histórico, Artístico e Cultural do município de Colatina (Lei nº 5.246/2006), a igreja passou por mais uma etapa do seu plano contínuo de preservação e adequação litúrgica.

### Os Vitrais Históricos
Produzidos na década de 1960 e 1970 pela renomada Casa Conrado, os vitrais representam cenas comoventes dos Evangelhos e a mística do Sagrado Coração. A manutenção preventiva garantiu a limpeza dos vidros alemães, a vedação dos perfis de chumbo contra infiltrações de água de chuva e o reforço estrutural dos arcos.

*"A beleza material do templo é um convite permanente à oração e à contemplação do Mistério Divino. Cuidar desta casa é zelar pela memória viva dos pioneiros e oferecer aos nossos filhos um santuário de paz"*, destacou o Pároco Pe. Irineu Claudino Sales.

Agradecemos a todos os dizimistas e benfeitores que, através do portal **«Sou do Sagrado»**, tornam possível a manutenção perpétua da nossa amada Catedral.
    `.trim(),
    category: 'noticia',
    categoryLabel: 'Patrimônio & Obras',
    imageUrl: '/images/historia/catedral-vitrais.jpg',
    imageCaption: 'A luz solar filtrada pelos vitrais sacros restaurados.',
    publishedAt: '03 de Outubro, 2026',
    authorName: 'Conselho de Obras e Patrimônio',
    authorRole: 'Administração Paroquial',
    isUrgent: false,
    isFeatured: false,
    readTimeMinutes: 4,
    communityName: 'Matriz Catedral',
  },
  {
    id: 'n-05',
    slug: 'assembleia-paroquial-12-cebs-natal-2026',
    title: 'Assembleia Paroquial com as 12 Comunidades Rumo à Novena de Natal',
    subtitle: 'Coordenadores de CEBs e lideranças pastorais alinham a grande vigília de fim de ano',
    summary:
      'Encontro sinodal reuniu representantes de todas as comunidades para organizar os círculos bíblicos nos bairros e a Missa da Noite de Natal na Matriz.',
    content: `
Em comunhão com as diretrizes diocesanas emanadas por Dom Lauro Sérgio Versiani Barbosa, a Paróquia da Catedral reuniu os coordenadores e ministros das 12 Comunidades Eclesiais de Base para a Assembleia Pastoral de Planejamento do Tempo do Advento e Natal de 2026.

### Foco nos Grupos de Reflexão nos Bairros
O ponto central do encontro foi a dinamização das novenas de Natal em família. O livreto de orações será partilhado em dezenas de círculos bíblicos nos bairros de Colatina, promovendo a fraternidade, a partilha da Palavra e a arrecadação de cestas natalinas para os mais necessitados.

### Grade de Celebrações de Fim de Ano
Ficou definida a escala oficial das celebrações:
* **Missa da Vigília de Natal (Missa da Noite):** 24 de Dezembro às 20h00 na Catedral, com bênção do presépio monumental.
* **Missa do Dia de Natal:** 25 de Dezembro às 09h00 e 19h00.
* **Solenidade de Santa Maria Mãe de Deus:** 31 de Dezembro às 19h30 e 01 de Janeiro às 09h00 e 19h00.
    `.trim(),
    category: 'evento',
    categoryLabel: 'Assembleia & CEBs',
    imageUrl: '/images/historia/nave-revitalizada.jpg',
    imageCaption: 'Nave central preparada para as assembleias paroquiais.',
    publishedAt: '28 de Setembro, 2026',
    authorName: 'Coordenação Paroquial de Pastoral',
    authorRole: 'CPP Catedral',
    isUrgent: false,
    isFeatured: false,
    readTimeMinutes: 3,
    communityName: '12 Comunidades (CEBs)',
  },
  {
    id: 'n-06',
    slug: 'campanha-agasalho-alimentos-vicentinos-2026',
    title: 'Campanha de Arrecadação de Alimentos e Apoio às Famílias Vicentinas',
    subtitle: 'Gesto concreto de amor fraterno para mais de 120 famílias cadastradas na paróquia',
    summary:
      'Sociedade São Vicente de Paulo e Pastoral da Criança recebem doações de alimentos e agasalhos para assistência mensal aos lares necessitados.',
    content: `
A caridade cristã é o fruto mais autêntico da Eucaristia celebrada no Altar. A Conferência São Vicente de Paulo, que atua em íntima ligação com a Catedral de Colatina, reforça o pedido de solidariedade aos paroquianos e visitantes.

### O que doar?
* Alimentos não perecíveis (arroz, feijão, óleo, café, leite em pó e macarrão).
* Itens de higiene pessoal (sabonetes, creme dental, fraldas infantis e geriátricas).
* Cobertores e agasalhos em bom estado de conservação.

### Postos de Coleta
As doações podem ser entregues diariamente na Secretaria Paroquial da Catedral (Praça da Matriz) ou depositadas nos cestos de ofertório solene ao término de cada Santa Missa. Se você deseja fazer uma doação via PIX, utilize a chave oficial da paróquia com a descrição *"Caridade Vicentina"*.

*"Quem se compadece do pobre empresta ao Senhor, que lhe retribuirá o benefício." (Pr 19, 17)*
    `.trim(),
    category: 'pastoral',
    categoryLabel: 'Ação Fraterna & Caridade',
    imageUrl: '/images/historia/projeto-benedito-calixto.jpg',
    imageCaption: 'Catedral de Colatina, farol de fé e caridade no Rio Doce.',
    publishedAt: '20 de Setembro, 2026',
    authorName: 'Conferência Vicentina',
    authorRole: 'Pastoral Social',
    isUrgent: true,
    isFeatured: false,
    readTimeMinutes: 3,
    communityName: 'Matriz Catedral',
  },
];

export function getAllNews(): NewsArticle[] {
  return OFFICIAL_NEWS_DATA;
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return OFFICIAL_NEWS_DATA.find((item) => item.slug === slug);
}

export function getFeaturedNews(): NewsArticle {
  return OFFICIAL_NEWS_DATA.find((item) => item.isFeatured) || OFFICIAL_NEWS_DATA[0];
}

export function getRelatedNews(currentSlug: string, limit: number = 3): NewsArticle[] {
  return OFFICIAL_NEWS_DATA.filter((item) => item.slug !== currentSlug).slice(0, limit);
}
