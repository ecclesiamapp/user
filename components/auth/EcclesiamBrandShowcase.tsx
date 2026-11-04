'use client';

import React from 'react';
import { ShieldCheck, Lock, Building2, CheckCircle2, Sparkles, Globe } from 'lucide-react';

export function EcclesiamBrandShowcase() {
  const securityPillars = [
    {
      icon: Building2,
      title: 'Arquitetura Multi-Paróquia Isolada',
      description:
        'Cada paróquia contratante opera em ambiente exclusivo (Tenant Isolation), identificando automaticamente seu painel pelo e-mail credenciado.',
    },
    {
      icon: ShieldCheck,
      title: 'Governança Canônica & RBAC',
      description:
        'Controle granular de permissões para Párocos, Vigários, Secretarias Paroquiais, PASCOM e Coordenadores de Comunidades.',
    },
    {
      icon: Lock,
      title: 'Blindagem LGPD & Trilha de Auditoria',
      description:
        'Proteção contra força bruta, sessões criptografadas e registro imutável de acessos em conformidade com a Lei 13.709/2018.',
    },
  ];

  return (
    <div
      className="relative hidden lg:flex lg:w-[50%] xl:w-[52%] flex-col justify-between p-10 xl:p-14 overflow-hidden select-none border-r"
      style={{
        background: 'linear-gradient(145deg, #07090E 0%, #0D131F 52%, #131B2E 100%)',
        borderColor: 'rgba(200, 164, 99, 0.22)',
        color: '#F4EFE6',
      }}
    >
      {/* Iluminação Atmosférica Dourada e Azul Profundo */}
      <div
        className="pointer-events-none absolute -top-28 -left-28 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: '#C8A463' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: '#1E40AF' }}
      />

      {/* Topo: Identidade Oficial do SaaS Ecclesiam */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              borderColor: 'rgba(200, 164, 99, 0.55)',
              color: '#E5C158',
            }}
          >
            <span className="font-cinzel text-2xl font-extrabold tracking-tighter">E</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-cinzel text-xl font-extrabold tracking-[0.16em] uppercase"
                style={{ color: '#FAF6F0' }}
              >
                ECCLESIAM
              </span>
              <span
                className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor: 'rgba(200, 164, 99, 0.14)',
                  borderColor: 'rgba(200, 164, 99, 0.4)',
                  color: '#E5C158',
                }}
              >
                SaaS Cloud
              </span>
            </div>
            <p className="text-xs tracking-wide" style={{ color: '#94A3B8' }}>
              Plataforma de Governança, Liturgia & Comunicação Eclesial
            </p>
          </div>
        </div>

        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            color: '#34D399',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Infraestrutura Ativa</span>
        </div>
      </div>

      {/* Centro: Proposta de Valor & Pilares de Segurança */}
      <div className="relative z-10 space-y-8 my-auto py-8 max-w-xl">
        <div className="space-y-3">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-widest"
            style={{
              backgroundColor: 'rgba(200, 164, 99, 0.12)',
              borderColor: 'rgba(200, 164, 99, 0.35)',
              color: '#E5C158',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal Exclusivo para Paróquias Clientes</span>
          </div>

          <h1
            className="font-cinzel text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight"
            style={{ color: '#FAF6F0' }}
          >
            Gestão Pastoral Moderna com Precisão Canônica.
          </h1>

          <p className="text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>
            Acesse o painel administrativo da sua paróquia utilizando seu e-mail credenciado. O sistema identifica automaticamente sua instituição e carrega seus módulos autorizados.
          </p>
        </div>

        <div className="space-y-3.5">
          {securityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-4 rounded-2xl border flex items-start gap-3.5 transition-all"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.68)',
                  borderColor: 'rgba(148, 163, 184, 0.16)',
                }}
              >
                <div
                  className="p-2.5 rounded-xl shrink-0 border"
                  style={{
                    backgroundColor: 'rgba(200, 164, 99, 0.12)',
                    borderColor: 'rgba(200, 164, 99, 0.3)',
                    color: '#E5C158',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold" style={{ color: '#F8FAFC' }}>
                    {pillar.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rodapé Institucional do SaaS */}
      <div
        className="relative z-10 pt-5 border-t flex items-center justify-between text-xs"
        style={{
          borderColor: 'rgba(148, 163, 184, 0.14)',
          color: '#64748B',
        }}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" style={{ color: '#C8A463' }} />
          <span>ecclesiamapp.com.br • Ambiente Seguro TLS 1.3</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: '#94A3B8' }}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Isolamento Multi-Tenant Ativo</span>
        </div>
      </div>
    </div>
  );
}

