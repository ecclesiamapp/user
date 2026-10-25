'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  MessageCircle, 
  FileText, 
  User, 
  Building2,
  Calendar
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { CertificateRequest, CertificateType, CertificateStatus } from '@/types';
import { Card, Badge, Button, Input } from '@/components/ui';
import { CertificateDetailModal } from './CertificateDetailModal';

export function CertificatesManagerTab() {
  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRequest, setSelectedRequest] = useState<CertificateRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Filtros
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificate_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRequests(data as CertificateRequest[]);
      }
    } catch (err) {
      console.error('Erro ao carregar solicitações de certidões:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (req: CertificateRequest) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleUpdate = (updated: CertificateRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const filteredRequests = requests.filter((r) => {
    if (filterType !== 'all' && r.certificate_type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHolder = r.holder_name.toLowerCase().includes(q);
      const matchApplicant = r.applicant_name.toLowerCase().includes(q);
      if (!matchHolder && !matchApplicant) return false;
    }
    return true;
  });

  const getStatusBadge = (status: CertificateStatus) => {
    switch (status) {
      case 'localizado':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Localizado</Badge>;
      case 'pronto_para_retirada':
        return <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20">Pronto p/ Retirada</Badge>;
      case 'emitido':
      case 'entregue':
        return <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20">Entregue</Badge>;
      case 'em_busca':
        return <Badge className="bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">Em Busca</Badge>;
      case 'nao_localizado':
        return <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20">Não Localizado</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-base font-bold text-[var(--dash-text-primary)]">
              Pedidos de Certidões & Documentos
            </h2>
            <Badge variant="matriz" className="text-xs">
              {filteredRequests.length} solicitações
            </Badge>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-1.5 text-xs rounded-xl cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--dash-border)]">
          {/* Tipo de Certidão */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
              Tipo de Documento
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-1.5 text-xs text-[var(--dash-text-primary)] cursor-pointer"
            >
              <option value="all">Todos os Documentos</option>
              <option value="batismo">Certidão de Batismo</option>
              <option value="crisma">Certidão de Crisma</option>
              <option value="matrimonio">Certidão de Matrimônio</option>
              <option value="transferencia">Transferência de Noivos</option>
              <option value="outros">Outros Documentos</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
              Status do Pedido
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] pl-3.5 pr-10 py-1.5 text-xs text-[var(--dash-text-primary)] cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="em_busca">Em Busca nos Livros</option>
              <option value="localizado">Localizado</option>
              <option value="pronto_para_retirada">Pronto para Retirada</option>
              <option value="entregue">Entregue</option>
              <option value="nao_localizado">Não Localizado</option>
            </select>
          </div>

          {/* Busca */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--dash-text-secondary)] mb-1">
              Buscar Titular ou Solicitante
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--dash-text-muted)]" />
              <Input
                type="text"
                placeholder="Nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Lista */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[var(--dash-text-secondary)] space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[var(--primary)]" />
          <p>Carregando solicitações de certidões...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="p-10 text-center space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-[var(--dash-text-muted)]" />
          <h3 className="text-sm font-bold text-[var(--dash-text-primary)]">
            Nenhuma solicitação encontrada
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] max-w-sm mx-auto">
            Não há pedidos registrados com os filtros atuais.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredRequests.map((req) => (
            <Card
              key={req.id}
              className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[var(--dash-border-hover)] transition-all"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(req.status)}
                  <Badge variant="matriz" className="text-[10px] uppercase font-bold tracking-wider">
                    {req.certificate_type}
                  </Badge>
                  <span className="text-xs text-[var(--dash-text-muted)] font-mono">
                    CERT-2026-{req.id.slice(0, 6).toUpperCase()}
                  </span>
                  <span className="text-xs text-[var(--dash-text-muted)]">
                    • {new Date(req.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[var(--dash-text-primary)] leading-tight">
                    Titular: {req.holder_name}
                  </h4>
                  <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                    Solicitante: <strong className="text-[var(--dash-text-primary)]">{req.applicant_name}</strong> • WhatsApp: {req.applicant_phone}
                  </p>
                  {(req.book_number || req.entry_number) && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      📖 Livro: {req.book_number || '-'} | Folha: {req.page_number || '-'} | Termo: {req.entry_number || '-'}
                    </p>
                  )}
                </div>
              </div>

              {/* Botão de Ver Ficha */}
              <div className="shrink-0 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDetail(req)}
                  className="gap-1.5 text-xs rounded-xl cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Ficha & Tombo</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Conferência */}
      <CertificateDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
