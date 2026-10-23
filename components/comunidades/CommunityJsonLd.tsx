import React from 'react';
import { Community } from '@/types';

interface CommunityJsonLdProps {
  community: Community;
  parishName?: string;
  baseUrl?: string;
}

export function CommunityJsonLd({
  community,
  parishName = 'Catedral do Sagrado Coração de Jesus',
  baseUrl = 'https://catedraldecolatina.com.br',
}: CommunityJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CatholicChurch',
    name: community.name,
    description: community.history || `Comunidade Eclesial de Base ${community.name}, vinculada à ${parishName}.`,
    url: `${baseUrl}/comunidades/${community.slug || ''}`,
    image: community.image_url || `${baseUrl}/images/historia/catedral-vitrais.jpg`,
    parentOrganization: {
      '@type': 'CatholicChurch',
      name: parishName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Colatina',
        addressRegion: 'ES',
        addressCountry: 'BR',
      },
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: community.address || 'Consultar secretaria',
      addressLocality: community.city || 'Colatina',
      addressRegion: community.state || 'ES',
      addressCountry: 'BR',
    },
    ...(community.latitude && community.longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: community.latitude,
            longitude: community.longitude,
          },
        }
      : {}),
    publicAccess: true,
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
