import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Catedral do Sagrado Coração de Jesus',
    short_name: 'Catedral',
    description: 'Portal oficial da Catedral do Sagrado Coração de Jesus • Diocese de Colatina',
    start_url: '/',
    display: 'standalone',
    background_color: '#120D0C',
    theme_color: '#8B1E22',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
