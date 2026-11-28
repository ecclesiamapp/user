import { NextResponse } from 'next/server';

export interface YouTubeLiveItem {
  id: string;
  title: string;
  publishedAt: string;
  formattedDate: string;
  badge: string;
  isLive?: boolean;
}

export interface YouTubeLiveResponse {
  isLive: boolean;
  channelName: string;
  channelUrl: string;
  activeVideo: YouTubeLiveItem;
  recentVideos: YouTubeLiveItem[];
}

const CATHEDRAL_CHANNEL_ID = 'UCwYADFZQkm2AAJTSaeaN41A';
const CATHEDRAL_CHANNEL_URL = 'https://www.youtube.com/@catedraldecolatina';
const CATHEDRAL_CHANNEL_NAME = 'Catedral de Colatina';

// Fallback estático seguro caso o feed externo oscile
const FALLBACK_VIDEOS: YouTubeLiveItem[] = [
  {
    id: '8CYXvaIz-xM',
    title: 'Festa de Nossa Senhora das Graças',
    publishedAt: new Date().toISOString(),
    formattedDate: 'Hoje',
    badge: 'Mais Recente',
    isLive: false,
  },
  {
    id: 'JVcI2l7ooa0',
    title: 'Santa Missa em Seu Lar',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    formattedDate: 'Santa Missa',
    badge: 'Missa Diária',
    isLive: false,
  },
  {
    id: 'Oce2n8VPb9g',
    title: 'Santa Missa em Seu Lar',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    formattedDate: 'Santa Missa',
    badge: 'Missa',
    isLive: false,
  },
];

function formatDateLabel(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  } catch {
    return 'Recente';
  }
}

function getBadgeForTitle(title: string, index: number): string {
  if (index === 0) return 'Mais Recente';
  const lower = title.toLowerCase();
  if (lower.includes('festa') || lower.includes('solenidade')) return 'Solene';
  if (lower.includes('domingo') || lower.includes('dominical')) return 'Dominical';
  if (lower.includes('lar') || lower.includes('diária') || lower.includes('diaria')) return 'Diária';
  return 'Celebração';
}

export async function GET() {
  try {
    // 1. Buscar Feed RSS oficial de vídeos do canal
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CATHEDRAL_CHANNEL_ID}`;
    const res = await fetch(feedUrl, {
      next: { revalidate: 300 }, // Cache inteligente de 5 minutos
      headers: {
        'User-Agent': 'EcclesiamApp/1.0 (Liturgical Feeds Service)',
      },
    });

    if (!res.ok) {
      throw new Error(`Feed do YouTube retornou status ${res.status}`);
    }

    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);

    if (entries.length === 0) {
      throw new Error('Nenhuma entrada de vídeo encontrada no feed');
    }

    const parsedVideos: YouTubeLiveItem[] = entries.slice(0, 4).map((entry, index) => {
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

      const id = idMatch ? idMatch[1].trim() : FALLBACK_VIDEOS[0].id;
      const title = titleMatch ? titleMatch[1].trim() : 'Santa Missa na Catedral';
      const publishedAt = publishedMatch ? publishedMatch[1].trim() : new Date().toISOString();

      return {
        id,
        title,
        publishedAt,
        formattedDate: formatDateLabel(publishedAt),
        badge: getBadgeForTitle(title, index),
        isLive: false,
      };
    });

    // 2. Verificar se há transmissão ao vivo no momento (verificação leve)
    let isLiveNow = false;
    try {
      const liveCheckRes = await fetch(
        `https://www.youtube.com/channel/${CATHEDRAL_CHANNEL_ID}/live`,
        {
          method: 'GET',
          next: { revalidate: 180 },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        }
      );
      if (liveCheckRes.ok) {
        const liveHtml = await liveCheckRes.text();
        // Quando há live ativa, o YouTube injeta canonical com /watch?v= e o status "LIVE_STREAM_OFFLINE" não está ativo
        const isLiveIndicator =
          liveHtml.includes('"isLive":true') ||
          liveHtml.includes('"status":"LIVE"') ||
          (liveHtml.includes('{"text":"Ao vivo"}') && !liveHtml.includes('{"text":"Transmitido ao vivo há'));

        if (isLiveIndicator) {
          isLiveNow = true;
          // Extrair o videoId da live ativa se possível
          const liveIdMatch = liveHtml.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
          if (liveIdMatch && liveIdMatch[1]) {
            parsedVideos[0].id = liveIdMatch[1];
            parsedVideos[0].isLive = true;
            parsedVideos[0].badge = 'AO VIVO';
          }
        }
      }
    } catch {
      // Ignora falha de checagem da live e segue com o vídeo mais recente do feed
    }

    const payload: YouTubeLiveResponse = {
      isLive: isLiveNow,
      channelName: CATHEDRAL_CHANNEL_NAME,
      channelUrl: CATHEDRAL_CHANNEL_URL,
      activeVideo: parsedVideos[0],
      recentVideos: parsedVideos,
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.warn('Usando fallback para transmissões do YouTube:', error);
    const fallbackPayload: YouTubeLiveResponse = {
      isLive: false,
      channelName: CATHEDRAL_CHANNEL_NAME,
      channelUrl: CATHEDRAL_CHANNEL_URL,
      activeVideo: FALLBACK_VIDEOS[0],
      recentVideos: FALLBACK_VIDEOS,
    };
    return NextResponse.json(fallbackPayload);
  }
}
