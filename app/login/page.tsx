import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { EcclesiamLoginFormCard } from '@/components/auth/EcclesiamLoginFormCard';

export const metadata: Metadata = {
  title: 'Ecclesiam App • Portal de Acesso das Paróquias',
  description:
    'Porta de entrada oficial das paróquias clientes do Ecclesiam App. Acesse o painel administrativo da sua paróquia com seu e-mail credenciado.',
};

export default function EcclesiamSaasLoginPage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between overflow-x-hidden relative"
      style={{
        backgroundColor: '#F5EFE7',
        color: '#2D1A16',
        backgroundImage:
          'radial-gradient(ellipse at 50% 0%, rgba(139, 30, 34, 0.07) 0%, rgba(255, 168, 42, 0.05) 42%, rgba(245, 239, 231, 1) 80%)',
      }}
    >
      {/* Faixa Superior Litúrgica Dourada & Vinho Sagrado */}
      <div
        className="w-full h-1.5"
        style={{
          background: 'linear-gradient(90deg, #8B1E22 0%, #FFA82A 50%, #8B1E22 100%)',
        }}
      />

      {/* Container Central Limpo: Logo + Card de Acesso */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="text-xs text-center py-12 font-semibold" style={{ color: '#514D4B' }}>
              Carregando portal de acesso Ecclesiam App...
            </div>
          }
        >
          <EcclesiamLoginFormCard />
        </Suspense>
      </main>

      {/* Rodapé Minimalista */}
      <footer
        className="w-full py-4 px-4 text-center border-t text-[11px]"
        style={{
          borderColor: '#E8DFD3',
          backgroundColor: 'rgba(238, 227, 212, 0.45)',
          color: '#514D4B',
        }}
      >
        <span>
          Ecclesiam App • Plataforma de Governança & Comunicação Paroquial • Ambiente Seguro TLS
        </span>
      </footer>
    </div>
  );
}
