'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Newspaper, 
  QrCode, 
  ArrowUpRight, 
  Sparkles,
  Clock,
  CheckCircle2,
  Church,
  Plus
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardHeader, CardTitle, Badge, Button } from '@/components/ui';

export default function AdminDashboardPage() {
  const [communityCount, setCommunityCount] = useState<number>(3);
  const [parishName, setParishName] = useState<string>('Catedral do Sagrado Coração de Jesus');
  const [pixKey, setPixKey] = useState<string>('secretaria@catedral.org.br');
  const [whatsapp, setWhatsapp] = useState<string>('(27) 99999-0000');

  const supabase = createClient();

  useEffect(() => {
    async function loadMetrics() {
      try {
        const { count } = await supabase
          .from('communities')
          .select('*', { count: 'exact', head: true });
        if (count !== null && count !== undefined) {
          setCommunityCount(count);
        }

        const { data: parishes } = await supabase
          .from('parishes')
          .select('name, pix_key, whatsapp_number')
          .limit(1);
        if (parishes && parishes[0]) {
          setParishName(parishes[0].name);
          if (parishes[0].pix_key) setPixKey(parishes[0].pix_key);
          if (parishes[0].whatsapp_number) setWhatsapp(parishes[0].whatsapp_number);
        }
      } catch (err) {
        console.warn('Erro ao carregar métricas:', err);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--dash-text-primary)]">
            Painel da Paróquia
          </h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gestão pastoral de conteúdos, celebrações e arrecadações via PIX.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/conteudo">
            <Button variant="primary" icon={<Newspaper className="w-4 h-4" />}>
              Novo Aviso
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas Principais (4 Colunas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Métrica 1: Comunidades (CEBs) */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[var(--dash-text-secondary)]">
              <span className="text-xs font-semibold uppercase tracking-wider">Rede Paroquial</span>
              <Church className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <p className="text-3xl font-extrabold mt-3 text-[var(--dash-text-primary)]">{communityCount}</p>
          </div>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Matriz e CEBs ativas
          </p>
        </Card>

        {/* Métrica 2: Missas Semanais */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[var(--dash-text-secondary)]">
              <span className="text-xs font-semibold uppercase tracking-wider">Missas Semanais</span>
              <Calendar className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <p className="text-3xl font-extrabold mt-3 text-[var(--dash-text-primary)]">14</p>
          </div>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sincronizados no portal
          </p>
        </Card>

        {/* Métrica 3: Avisos e Notícias */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[var(--dash-text-secondary)]">
              <span className="text-xs font-semibold uppercase tracking-wider">Avisos e Notícias</span>
              <Newspaper className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <p className="text-3xl font-extrabold mt-3 text-[var(--dash-text-primary)]">6</p>
          </div>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-2">
            2 avisos urgentes ativos
          </p>
        </Card>

        {/* Métrica 4: Dízimo / PIX */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[var(--dash-text-secondary)]">
              <span className="text-xs font-semibold uppercase tracking-wider">Dízimo / PIX (Mês)</span>
              <QrCode className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <p className="text-3xl font-extrabold mt-3 text-[var(--dash-text-primary)]">R$ 8.420,00</p>
          </div>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Direto na conta paroquial
          </p>
        </Card>
      </div>

      {/* Blocos de Ação Rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Celebrações Cadastradas */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2 text-[var(--dash-text-primary)]">
              <Clock className="w-4 h-4 text-[var(--primary)]" />
              Horários de Hoje
            </h2>
            <Link href="/admin/horarios" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              Gerenciar todos
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] text-sm">
              <div>
                <span className="font-semibold text-[var(--dash-text-primary)]">07:00</span>
                <p className="text-xs text-[var(--dash-text-secondary)]">Santa Missa Matriz</p>
              </div>
              <Badge variant="active">Confirmada</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] text-sm">
              <div>
                <span className="font-semibold text-[var(--dash-text-primary)]">15:00 às 17:00</span>
                <p className="text-xs text-[var(--dash-text-secondary)]">Atendimento de Confissões</p>
              </div>
              <Badge variant="ceb">Secretaria / Pe. Pároco</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] text-sm">
              <div>
                <span className="font-semibold text-[var(--dash-text-primary)]">19:30</span>
                <p className="text-xs text-[var(--dash-text-secondary)]">Santa Missa e Bênção do Santíssimo</p>
              </div>
              <Badge variant="active">Confirmada</Badge>
            </div>
          </div>
        </Card>

        {/* Status da Identidade White-Label */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2 text-[var(--dash-text-primary)]">
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              Identidade Visual & Theming
            </h2>
            <Link href="/admin/configuracoes" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              Editar Cores
            </Link>
          </div>

          <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
            Seu portal digital está ativo e configurado com as cores e o brasão paroquial. Todas as informações publicadas aqui são refletidas imediatamente para os fiéis.
          </p>

          <div className="p-4 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--dash-text-secondary)]">Paróquia Ativa:</span>
              <span className="font-bold text-[var(--dash-text-primary)] truncate max-w-[220px]">{parishName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--dash-text-secondary)]">Chave PIX Oficial:</span>
              <span className="font-mono font-bold text-[var(--primary)] truncate max-w-[220px]">{pixKey}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--dash-text-secondary)]">WhatsApp Pastoral:</span>
              <span className="font-semibold text-[var(--dash-text-primary)]">{whatsapp}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--dash-text-secondary)]">Transmissão ao Vivo:</span>
              <Badge variant="active">YouTube Conectado</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
