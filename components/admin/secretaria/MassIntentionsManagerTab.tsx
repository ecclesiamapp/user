'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  RefreshCw, 
  Calendar, 
  Clock, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  Filter, 
  Church, 
  User, 
  Check, 
  AlertCircle,
  Flame,
  ChevronRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { MassIntention, MassIntentionStatus, Community } from '@/types';
import { Card, Badge, Button, Input } from '@/components/ui';
import { MassIntentionsPrintModal } from './MassIntentionsPrintModal';

export function MassIntentionsManagerTab() {
  const [intentions, setIntentions] = useState<MassIntention[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filtros
  const todayStr = new Date().toISOString().split('T')[0];
  const [filterDate, setFilterDate] = useState<string>(todayStr);
  const [filterTime, setFilterTime] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCommunity, setFilterCommunity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal de Impressão
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printTime, setPrintTime] = useState<string>('18:00');

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Comunidades
      const { data: commsData } = await supabase
        .from('communities')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (commsData) setCommunities(commsData);

      // 2. Intenções
      const { data, error } = await supabase
        .from('mass_intentions')
        .select(`
          *,
          community:community_id (name)
        `)
        .order('celebration_date', { ascending: false })
        .order('celebration_time', { ascending: true });

      if (!error && data) {
        const formatted: MassIntention[] = data.map((item: any) => ({
          ...item,
          community_name: item.community?.name || 'Catedral Diocesana',
        }));
        setIntentions(formatted);
      }
    } catch (err) {
      console.error('Erro ao carregar intenções:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: MassIntentionStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('mass_intentions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (!error) {
        setIntentions((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Erro ao atualizar status da intenção:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendWhatsAppConfirmation = (intention: MassIntention) => {
    if (!intention.contact_phone) return;
    const cleanPhone = intention.contact_phone.replace(/\D/g, '');
    const recipientName = intention.offered_by || 'Estimado(a) Irmão(ã)';
    const formattedDate = new Date(intention.celebration_date + 'T12:00:00').toLocaleDateString('pt-BR');
    const msg = encodeURIComponent(
      `Paz e Bem, ${recipientName}! 🕊️\n\n` +
      `Confirmamos que a intenção para *${intention.intention_for}* foi acolhida com carinho e será proclamada no púlpito durante as intenções da Santa Missa do dia *${formattedDate}* às *${intention.celebration_time}h* (${intention.community_name || 'Catedral Diocesana'}).\n\n` +
      `Que o Sagrado Coração de Jesus derrame bênçãos sobre você e sua família!\n` +
      `_Secretaria da Catedral de Colatina_`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  // Filtragem
  const filteredIntentions = intentions.filter((item) => {
    if (filterDate && filterDate !== 'all' && item.celebration_date !== filterDate) return false;
    if (filterTime !== 'all' && item.celebration_time !== filterTime) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterCommunity !== 'all') {
      if (filterCommunity === 'matriz' && item.community_id) return false;
      if (filterCommunity !== 'matriz' && item.community_id !== filterCommunity) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFor = item.intention_for.toLowerCase().includes(q);
      const matchBy = item.offered_by ? item.offered_by.toLowerCase().includes(q) : false;
      const matchProtocol = item.protocol_code ? item.protocol_code.toLowerCase().includes(q) : false;
      if (!matchFor && !matchBy && !matchProtocol) return false;
    }
    return true;
  });

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'falecimento':
        return '🕊️ Pela(s) Alma(s) de:';
      case 'setimo_dia':
        return '🕯️ 7º Dia';
      case 'trigesimo_dia':
        return '✝️ 30º Dia';
      case 'acao_gracas':
        return '🌸 Ação de Graças';
      case 'saude':
        return '🌿 Saúde';
      case 'aniversario_vida':
        return '🎂 Aniversário';
      case 'aniversario_matrimonio':
        return '💍 Matrimônio';
      default:
        return '✨ Outros';
    }
  };

  const getStatusBadge = (status: MassIntentionStatus) => {
    switch (status) {
      case 'aprovada':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Aprovada</Badge>;
      case 'rezada':
        return <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20">Rezada</Badge>;
      case 'cancelada':
        return <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20">Cancelada</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Ações & Filtros */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-base font-bold text-[var(--dash-text-primary)]">
              Intenções para Santa Missa
            </h2>
            <Badge variant="matriz" className="text-xs">
              {filteredIntentions.length} intenções
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => {
                setPrintTime(filterTime !== 'all' ? filterTime : '18:00');
                setIsPrintModalOpen(true);
              }}
              className="gap-2 text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Lista para o Púlpito</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="gap-1.5 text-xs rounded-xl cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          </div>
        </div>

        {/* Linha de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-[var(--dash-border)]">
          {/* Data */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)]">
                Data da Missa
              </label>
              {filterDate ? (
                <button
                  type="button"
                  onClick={() => setFilterDate('')}
                  className="text-[10px] text-[var(--primary)] hover:underline font-medium cursor-pointer"
                >
                  Todas as datas
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setFilterDate(todayStr)}
                  className="text-[10px] text-[var(--primary)] hover:underline font-medium cursor-pointer"
                >
                  Voltar para hoje
                </button>
              )}
            </div>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          {/* Horário */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
              Horário
            </label>
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-1.5 text-xs text-[var(--dash-text-primary)] cursor-pointer"
            >
              <option value="all">Todos os Horários</option>
              <option value="07:00">07:00h</option>
              <option value="09:00">09:00h</option>
              <option value="18:00">18:00h</option>
              <option value="19:30">19:30h</option>
            </select>
          </div>

          {/* Comunidade */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
              Comunidade
            </label>
            <select
              value={filterCommunity}
              onChange={(e) => setFilterCommunity(e.target.value)}
              className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-1.5 text-xs text-[var(--dash-text-primary)] cursor-pointer"
            >
              <option value="all">Todas as Igrejas</option>
              <option value="matriz">Catedral Diocesana</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-1.5 text-xs text-[var(--dash-text-primary)] cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="aprovada">Aprovada</option>
              <option value="rezada">Proclamada no Púlpito / Rezada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {/* Busca */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
              Buscar Nomes / Solicitante
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--dash-text-muted)]" />
              <Input
                type="text"
                placeholder="Filtrar por nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Intenções */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[var(--dash-text-secondary)] space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[var(--primary)]" />
          <p>Carregando intenções paroquiais...</p>
        </div>
      ) : filteredIntentions.length === 0 ? (
        <Card className="p-10 text-center space-y-2">
          <Flame className="w-8 h-8 mx-auto text-[var(--dash-text-muted)]" />
          <h3 className="text-sm font-bold text-[var(--dash-text-primary)]">
            Nenhuma intenção encontrada
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] max-w-sm mx-auto">
            Não há registros de intenções com os filtros selecionados. Tente alterar a data ou o status.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredIntentions.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[var(--dash-border-hover)] transition-all"
            >
              {/* Informações da Intenção */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(item.status)}
                  <span className="text-[11px] font-semibold text-[var(--dash-text-secondary)] bg-[var(--dash-surface-secondary)] px-2 py-0.5 rounded-md border border-[var(--dash-border)]">
                    {getCategoryLabel(item.intention_type)}
                  </span>
                  {item.protocol_code && (
                    <span className="text-[10px] font-mono font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded border border-[var(--primary)]/20">
                      {item.protocol_code}
                    </span>
                  )}
                  {item.is_anonymous && (
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px]">
                      🔒 Sigilo no Púlpito
                    </Badge>
                  )}
                  <span className="text-xs font-bold text-[var(--primary)] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.celebration_date + 'T12:00:00').toLocaleDateString('pt-BR')} às {item.celebration_time}h
                  </span>
                  <span className="text-xs text-[var(--dash-text-muted)]">• {item.community_name}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[var(--dash-text-primary)] leading-tight">
                    {item.intention_for}
                  </h4>
                  <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                    Oferecido por: <strong className="text-[var(--dash-text-primary)]">{item.is_anonymous ? 'Anônimo (Sigilo no Púlpito)' : (item.offered_by || 'Fiel Anônimo')}</strong>
                    {item.contact_phone ? ` • Tel: ${item.contact_phone}` : ' • Tel: Não informado'}
                  </p>
                  {item.notes && (
                    <p className="text-[11px] text-[var(--dash-text-muted)] italic mt-1">
                      Obs: {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {item.contact_phone && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendWhatsAppConfirmation(item)}
                    className="h-8 gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:border-emerald-500/50 cursor-pointer"
                    title="Enviar confirmação WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </Button>
                )}

                {item.status !== 'aprovada' && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={updatingId === item.id}
                    onClick={() => handleUpdateStatus(item.id, 'aprovada')}
                    className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aprovar</span>
                  </Button>
                )}

                {item.status !== 'rezada' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={updatingId === item.id}
                    onClick={() => handleUpdateStatus(item.id, 'rezada')}
                    className="h-8 gap-1.5 text-xs text-blue-600 dark:text-blue-400 rounded-xl cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Rezada</span>
                  </Button>
                )}

                {item.status !== 'cancelada' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={updatingId === item.id}
                    onClick={() => handleUpdateStatus(item.id, 'cancelada')}
                    className="h-8 text-xs text-rose-500 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Impressão A4 */}
      <MassIntentionsPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        celebrationDate={filterDate}
        celebrationTime={printTime}
        communityName={
          filterCommunity === 'all' || filterCommunity === 'matriz'
            ? 'Catedral Diocesana'
            : communities.find((c) => c.id === filterCommunity)?.name || 'Catedral Diocesana'
        }
        intentions={intentions}
      />
    </div>
  );
}
