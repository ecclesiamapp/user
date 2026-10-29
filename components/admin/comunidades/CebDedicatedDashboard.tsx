'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Church, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  ExternalLink, 
  Edit3, 
  HeartHandshake, 
  Clock, 
  Sparkles,
  Phone,
  Newspaper,
  ShieldCheck
} from 'lucide-react';
import { Community } from '@/types';
import { Button, Card, Badge } from '@/components/ui';
import { CommunityPastoralNoticeBanner } from './CommunityPastoralNoticeBanner';
import { useAdminCommunity } from '@/components/admin/context/AdminCommunityContext';

interface CebDedicatedDashboardProps {
  community: Community;
  onEdit: (community: Community) => void;
  onToggleActive?: (id: string, currentStatus: boolean) => void;
}

export function CebDedicatedDashboard({
  community,
  onEdit,
}: CebDedicatedDashboardProps) {
  const { hasModulePermission, currentUser } = useAdminCommunity();

  const facadeImage = community.image_url || '/images/catedral-fachada.webp';
  const patronImage = community.patron_image_url || null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Banner de Nota Pastoral da Catedral para a Comunidade */}
      <CommunityPastoralNoticeBanner />

      {/* Hero da Comunidade: Foto, Identidade e Status */}
      <Card className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-surface)] overflow-hidden shadow-xl">
        <div className="relative h-44 sm:h-56 w-full bg-[var(--dash-surface-secondary)] overflow-hidden">
          <Image
            src={facadeImage}
            alt={community.name}
            fill
            className="object-cover opacity-85"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dash-surface)] via-black/40 to-black/20" />

          {/* Badges Flutuantes Superiores */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className="bg-[var(--primary)] text-white text-[10px] font-bold px-2 py-0.5 shadow-md">
                ⛪ CEB Ativa
              </Badge>
              {community.foundation_year && (
                <Badge variant="outline" className="text-[10px] bg-black/60 backdrop-blur-md text-amber-300 border-amber-400/40 font-semibold">
                  Fundada em {community.foundation_year}
                </Badge>
              )}
            </div>

            <Badge variant="outline" className="text-[10px] bg-black/60 backdrop-blur-md text-emerald-300 border-emerald-400/40 font-semibold">
              ● Painel da Comunidade
            </Badge>
          </div>

          {/* Identificação Inferior no Hero */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              {patronImage && (
                <div className="w-14 h-14 rounded-2xl border-2 border-white/80 overflow-hidden relative shadow-lg shrink-0 hidden sm:block">
                  <Image src={patronImage} alt="Padroeiro" fill className="object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  {community.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{community.neighborhood ? `${community.neighborhood}, ` : ''}{community.city} - {community.state}</span>
                </p>
              </div>
            </div>

            {/* Ações Primárias */}
            <div className="flex items-center gap-2">
              {community.slug && (
                <Link href={`/comunidades/${community.slug}`} target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-semibold bg-black/50 backdrop-blur-md border-white/30 text-white hover:bg-black/70 min-h-[38px] flex items-center gap-1.5 shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ver Landing Page</span>
                  </Button>
                </Link>
              )}

              {hasModulePermission('lp_geral') && (
                <Button
                  size="sm"
                  onClick={() => onEdit(community)}
                  className="rounded-xl text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white min-h-[38px] flex items-center gap-1.5 shadow-md"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Dados & Fachada</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Barra de Informações Rápidas */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[var(--dash-border)] bg-[var(--dash-surface-secondary)]/30 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] block">Padroeiro(a) & Solenidade</span>
              <span className="font-semibold text-[var(--dash-text-primary)]">
                {community.patron_saint || 'Padroeiro Comunitário'} {community.feast_day ? `(${community.feast_day})` : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] block">Coordenador da CEB</span>
              <span className="font-semibold text-[var(--dash-text-primary)]">
                {community.contact_name || currentUser?.name || 'Coordenação Ativa'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] block">Contato WhatsApp</span>
              <span className="font-semibold text-[var(--dash-text-primary)]">
                {community.contact_phone || currentUser?.phone || 'Secretaria da Catedral'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid de Gestão Modular da Comunidade (Alinhado às Permissões Canônicas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Horários de Celebração */}
        {hasModulePermission('horarios') && (
          <Card className="p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--primary)]/40 transition-all flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--dash-text-primary)]">
                Horários de Santa Missa & Palavra
              </h3>
              <p className="text-xs text-[var(--dash-text-muted)] leading-relaxed">
                Escala oficial de celebrações dominicais e semanais exibidas no mini-site e na agenda paroquial.
              </p>
            </div>
            <Link href="/admin/horarios">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl text-xs font-semibold border-[var(--dash-border)] hover:bg-[var(--dash-surface-secondary)] min-h-[38px] flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Gerenciar Horários da Comunidade</span>
              </Button>
            </Link>
          </Card>
        )}

        {/* Card 2: Mural de Avisos da Comunidade */}
        {hasModulePermission('avisos') && (
          <Card className="p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--primary)]/40 transition-all flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Newspaper className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--dash-text-primary)]">
                Mural de Avisos da Comunidade
              </h3>
              <p className="text-xs text-[var(--dash-text-muted)] leading-relaxed">
                Publique recados de mutirões, novenas, reuniões do CPC e comunicados aos fiéis da comunidade.
              </p>
            </div>
            <Link href="/admin/conteudo">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl text-xs font-semibold border-[var(--dash-border)] hover:bg-[var(--dash-surface-secondary)] min-h-[38px] flex items-center justify-center gap-1.5"
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Publicar Avisos Locais</span>
              </Button>
            </Link>
          </Card>
        )}

        {/* Card 3: Conselho Pastoral Comunitário (CPC) */}
        {hasModulePermission('cpc') && (
          <Card className="p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--primary)]/40 transition-all flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--dash-text-primary)]">
                Lideranças do CPC & Pastorais
              </h3>
              <p className="text-xs text-[var(--dash-text-muted)] leading-relaxed">
                Coordenação, tesouraria comunitária, secretário e ministros atuantes na comunidade.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(community)}
              className="w-full rounded-xl text-xs font-semibold border-[var(--dash-border)] hover:bg-[var(--dash-surface-secondary)] min-h-[38px] flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Editar Lideranças da Comunidade</span>
            </Button>
          </Card>
        )}

        {/* Card 4: Dízimo & Partilha Local */}
        {hasModulePermission('dizimo') && (
          <Card className="p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--primary)]/40 transition-all flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--dash-text-primary)]">
                Dízimo & Ofertas da Comunidade
              </h3>
              <p className="text-xs text-[var(--dash-text-muted)] leading-relaxed">
                {community.pix_key 
                  ? `Chave PIX local ativa: ${community.pix_key}`
                  : 'Configuração da chave PIX e orientações de partilha para as obras da comunidade.'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(community)}
              className="w-full rounded-xl text-xs font-semibold border-[var(--dash-border)] hover:bg-[var(--dash-surface-secondary)] min-h-[38px] flex items-center justify-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Configurar Chave PIX Local</span>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
