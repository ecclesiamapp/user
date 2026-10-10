import { NextResponse } from 'next/server';

export interface LiturgiaApiResponse {
  data: string;
  liturgia: string;
  cor: string;
  dia?: string;
  oferendas?: string;
  comunhao?: string;
  primeiraLeitura?: {
    referencia: string;
    titulo?: string;
    texto: string;
  };
  salmo?: {
    referencia: string;
    refrao: string;
    texto: string;
  };
  segundaLeitura?: {
    referencia: string;
    titulo?: string;
    texto: string;
  } | string;
  evangelho?: {
    referencia: string;
    titulo?: string;
    texto: string;
  };
  antifonas?: {
    entrada?: string;
    comunhao?: string;
  };
}

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://liturgia.up.railway.app/', {
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache de 1 hora no servidor Next.js
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'EcclesiamApp/1.0 (Catedral de Colatina)',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Liturgia API responded with status: ${response.status}`);
    }

    const data: LiturgiaApiResponse = await response.json();

    // Normalização segura dos dados
    const hasSecondReading =
      typeof data.segundaLeitura === 'object' &&
      data.segundaLeitura !== null &&
      'texto' in data.segundaLeitura;

    const normalized = {
      isLive: true,
      data: data.data || new Date().toLocaleDateString('pt-BR'),
      celebrationTitle: data.liturgia || 'Tempo Comum • Liturgia da Palavra',
      colorName: data.cor || 'Verde',
      dia: data.dia || null,
      primeiraLeitura: data.primeiraLeitura || null,
      salmo: data.salmo || null,
      segundaLeitura: hasSecondReading ? data.segundaLeitura : null,
      evangelho: data.evangelho || null,
      antifonas: data.antifonas || null,
    };

    return NextResponse.json(normalized, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.warn('Falha ao obter liturgia da API externa, acionando fallback canônico:', error);

    const now = new Date();
    const fallback = {
      isLive: false,
      data: now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      celebrationTitle: 'Tempo Comum • Celebração da Eucaristia',
      colorName: 'Verde',
      dia: 'Deus eterno e todo-poderoso, aumentai em nós a fé, a esperança e a caridade; e, para alcançarmos o que prometeis, fazei-nos amar o que ordenais.',
      primeiraLeitura: {
        referencia: 'Gl 3, 7-14',
        titulo: 'Leitura da Carta de São Paulo aos Gálatas',
        texto: 'Irmãos: Ficai cientes que os que creem é que são verdadeiros filhos de Abraão. Pela fé recebemos a promessa do Espírito Santo em Cristo Jesus.',
      },
      salmo: {
        referencia: 'Sl 110(111)',
        refrao: 'O Senhor se lembra sempre da Aliança!',
        texto: 'Eu agradeço a Deus, de todo o coração, junto com todos os seus justos reunidos! Que grandiosas são as obras do Senhor, elas merecem todo o amor e admiração!',
      },
      segundaLeitura: null,
      evangelho: {
        referencia: 'Lc 11, 15-26',
        titulo: 'Proclamação do Evangelho de Jesus Cristo segundo Lucas',
        texto: 'Naquele tempo, Jesus estava expulsando um demônio. Mas se é pelo dedo de Deus que eu expulso os demônios, então chegou para vós o Reino de Deus. Quem não está comigo está contra mim.',
      },
      antifonas: {
        entrada: 'Ao vosso poder, Senhor, tudo está sujeito, e não há quem possa resistir à vossa vontade.',
        comunhao: 'O Senhor é bondoso para quem nele confia, para a alma que o procura.',
      },
    };

    return NextResponse.json(fallback, { status: 200 });
  }
}
