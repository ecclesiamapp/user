'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  MessageCircle, 
  Check, 
  XCircle,
  Baby,
  HeartHandshake,
  Flame,
  BookOpen,
  Heart,
  ChevronRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { SacramentalRegistration, SacramentType, RegistrationStatus } from '@/types';
import { Card, Badge, Button, Input, Select } from '@/components/ui';
import { RegistrationDetailModal } from './RegistrationDetailModal';

export function SacramentsManagerTab() {
  const [registrations, setRegistrations] = useState<SacramentalRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReg, setSelectedReg] = useState<SacramentalRegistration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filtros
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sacramental_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRegistrations(data as SacramentalRegistration[]);
      }
    } catch (err) {
      console.error('Erro ao carregar inscrições:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickApprove = async (id: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('sacramental_registrations')
        .update({
          status: 'aprovado',
          reviewed_by: 'Secretária Paroquial',
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        alert('Erro ao aprovar: ' + error.message);
      } else {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'aprovado' } : r))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtragem
  const filtered = registrations.filter((item) => {
    if (filterType !== 'all' && item.sacrament_type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchApplicant = item.applicant_name.toLowerCase().includes(q);
      const matchCandidate = item.candidate_name?.toLowerCase().includes(q);
      const matchPhone = item.applicant_phone.includes(q);
      if (!matchApplicant && !matchCandidate && !matchPhone) return false;
    }
    return true;
  });

  // Métricas
  const countPending = registrations.filter((r) => r.status === 'pendente' || r.status === 'em_analise').length;
  const countDocsPending = registrations.filter((r) => r.status === 'documentacao_pendente').length;
  const countApproved = registrations.filter((r) => r.status === 'aprovado' || r.status === 'concluido').length;

  const getSacramentIcon = (type: SacramentType) => {
    switch (type) {
      case 'batismo': return Baby;
      case 'eucaristia': return BookOpen;
      case 'crisma': return Flame;
      case 'noivos': return HeartHandshake;
      case 'gestantes': return Heart;
      default: return FileText;
    }
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'aprovado':
      case 'concluido':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">Aprovado</Badge>;
      case 'documentacao_pendente':
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30">Docs Pendentes</Badge>;
      case 'em_analise':
        return <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/30">Em Análise</Badge>;
      case 'cancelado':
        return <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/30">Cancelado</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-600 border border-slate-500/30">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
              Novas Inscrições
            </span>
            <div className="text-2xl font-black text-amber-500 mt-1">{countPending}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
              Documentação Pendente
            </span>
            <div className="text-2xl font-black text-rose-500 mt-1">{countDocsPending}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)]">
              Aprovadas / Concluídas
            </span>
            <div className="text-2xl font-black text-emerald-500 mt-1">{countApproved}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="p-4 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[var(--dash-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            id="search_sacraments"
            placeholder="Buscar por candidato ou solicitante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Select
            id="filter_sacrament_type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-44 text-xs"
          >
            <option value="all">Todos os Sacramentos</option>
            <option value="batismo">Batismo Infantil</option>
            <option value="eucaristia">Primeira Eucaristia</option>
            <option value="crisma">Crisma (Confirmação)</option>
            <option value="noivos">Curso de Noivos</option>
            <option value="gestantes">Curso de Gestantes</option>
          </Select>

          <Select
            id="filter_sacrament_status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-40 text-xs"
          >
            <option value="all">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="documentacao_pendente">Docs Pendentes</option>
            <option value="aprovado">Aprovado</option>
            <option value="concluido">Concluído</option>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Lista de Registros */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[var(--dash-text-secondary)]">
          Carregando pedidos de inscrição sacramental...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center space-y-3 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)]">
          <FileText className="w-10 h-10 mx-auto text-[var(--dash-text-muted)] opacity-40" />
          <h3 className="font-bold text-sm text-[var(--dash-text-primary)]">
            Nenhuma inscrição encontrada
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] max-w-sm mx-auto">
            Não há solicitações sacramentais correspondentes aos filtros aplicados.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const Icon = getSacramentIcon(item.sacrament_type);
            const isUpdating = updatingId === item.id;
            const cleanPhone = item.applicant_phone.replace(/\D/g, '');
            const waLink = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
              `Paz e Bem, ${item.applicant_name}! Aqui é da Secretaria da Catedral de Colatina referente à inscrição sacramental (${item.sacrament_type.toUpperCase()}).`
            )}`;

            return (
              <Card
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--dash-border-hover)] transition-all shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 font-bold text-sm">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--primary)]">
                          SAC-{item.id.slice(0, 6).toUpperCase()}
                        </span>
                        <h4 className="font-bold text-sm text-[var(--dash-text-primary)]">
                          {item.candidate_name || item.applicant_name}
                        </h4>
                        {getStatusBadge(item.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--dash-text-secondary)] mt-0.5">
                        <span className="font-semibold capitalize text-[var(--dash-text-primary)]">
                          {item.sacrament_type}
                        </span>
                        <span>•</span>
                        <span>Solicitante: {item.applicant_name} ({item.applicant_role || 'Próprio'})</span>
                        <span>•</span>
                        <span>{item.applicant_phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 transition-colors text-xs font-semibold flex items-center gap-1.5"
                      title="Abrir WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    {item.status !== 'aprovado' && item.status !== 'concluido' && (
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleQuickApprove(item.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl flex items-center gap-1 min-h-[36px]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovar</span>
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedReg(item);
                        setIsModalOpen(true);
                      }}
                      className="text-xs rounded-xl flex items-center gap-1.5 min-h-[36px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Ficha</span>
                    </Button>
                  </div>
                </div>

                {/* Nota Interna se existir */}
                {item.internal_notes && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-bold">Nota da Secretaria: </span>
                    {item.internal_notes}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes da Inscrição */}
      <RegistrationDetailModal
        registration={selectedReg}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReg(null);
        }}
        onUpdated={(updated) => {
          setRegistrations((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
          );
        }}
      />
    </div>
  );
}
