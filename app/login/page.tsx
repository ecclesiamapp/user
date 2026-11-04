import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { EcclesiamBrandShowcase } from '@/components/auth/EcclesiamBrandShowcase';
import { EcclesiamLoginFormCard } from '@/components/auth/EcclesiamLoginFormCard';

export const metadata: Metadata = {
  title: 'Ecclesiam • Portal de Acesso das Paróquias',
  description:
    'Porta de entrada oficial das paróquias clientes do Ecclesiam App. Acesse o dashboard administrativo da sua paróquia com seu e-mail credenciado.',
};

export default function EcclesiamSaasLoginPage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row overflow-x-hidden"
      style={{
        backgroundColor: '#07090E',
        color: '#F8FAFC',
      }}
    >
      {/* Coluna Esquerda: Vitrine Institucional da Marca Ecclesiam SaaS */}
      <EcclesiamBrandShowcase />

      {/* Coluna Direita: Autenticação Multi-Paróquia */}
      <main
        className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 xl:p-12 relative"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(30, 41, 59, 0.45) 0%, #07090E 70%)',
        }}
      >
        <Suspense
          fallback={
            <div className="text-xs text-center py-12" style={{ color: '#94A3B8' }}>
              Carregando módulo de segurança Ecclesiam...
            </div>
          }
        >
          <EcclesiamLoginFormCard />
        </Suspense>
      </main>
    </div>
  );
}

