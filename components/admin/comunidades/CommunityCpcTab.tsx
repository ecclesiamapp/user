'use client';

import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Check, User, Phone, Mail, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CommunityLeader } from '@/types';
import { Button, Input } from '@/components/ui';
import { ImageUploaderField } from '@/components/admin/shared/ImageUploaderField';

interface CommunityCpcTabProps {
  leaders: CommunityLeader[];
  onChange: (leaders: CommunityLeader[]) => void;
}

export function CommunityCpcTab({ leaders = [], onChange }: CommunityCpcTabProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Formulário do membro em edição/adição
  const [name, setName] = useState('');
  const [role, setRole] = useState('Coordenador(a) do CPC');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const rolePresets = [
    'Pároco Orientador',
    'Vigário Paroquial',
    'Coordenador(a) do CPC',
    'Vice-Coordenador(a)',
    'Tesoureiro(a) do CPC',
    'Secretário(a) do CPC',
    'Coordenador(a) de Liturgia',
    'Coordenador(a) da Catequese',
    'Coordenador(a) do Dízimo',
    'Conselheiro(a) Pastoral',
  ];

  const handleStartAdd = () => {
    setName('');
    setRole('Coordenador(a) do CPC');
    setPhone('');
    setEmail('');
    setPhotoUrl('');
    setBio('');
    setEditingIndex(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (idx: number) => {
    const leader = leaders[idx];
    if (!leader) return;
    setName(leader.name || '');
    setRole(leader.role || 'Coordenador(a) do CPC');
    setPhone(leader.phone || '');
    setEmail(leader.email || '');
    setPhotoUrl(leader.photo_url || leader.image || '');
    setBio(leader.bio || '');
    setEditingIndex(idx);
    setIsAddingNew(false);
  };

  const handleSaveMember = () => {
    if (!name.trim()) return;

    const newLeader: CommunityLeader = {
      name: name.trim(),
      role: role.trim() || 'Membro do CPC',
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      photo_url: photoUrl.trim() || undefined,
      image: photoUrl.trim() || undefined,
      bio: bio.trim() || undefined,
    };

    if (editingIndex !== null) {
      const updated = [...leaders];
      updated[editingIndex] = newLeader;
      onChange(updated);
      setEditingIndex(null);
    } else {
      onChange([...leaders, newLeader]);
      setIsAddingNew(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingIndex(null);
  };

  const handleRemove = (idx: number) => {
    const updated = leaders.filter((_, i) => i !== idx);
    onChange(updated);
    if (editingIndex === idx) {
      setEditingIndex(null);
      setIsAddingNew(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--dash-border)]">
        <div>
          <h3 className="text-sm font-bold text-[var(--dash-text-primary)] flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span>Conselho Pastoral Comunitário (CPC)</span>
          </h3>
          <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
            Cadastre as lideranças leigas e orientadores espirituais da comunidade.
          </p>
        </div>

        {!isAddingNew && editingIndex === null && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleStartAdd}
            icon={<Plus className="w-4 h-4 text-amber-500" />}
          >
            Adicionar Líder do CPC
          </Button>
        )}
      </div>

      {/* Formulário de Adição/Edição de Líder */}
      {(isAddingNew || editingIndex !== null) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{editingIndex !== null ? 'Editar Membro do CPC' : 'Novo Membro do CPC'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome Completo *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maria Auxiliadora Gomes"
            />

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
                Função / Cargo no CPC
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2 text-xs focus:ring-2 focus:ring-[var(--primary)] outline-hidden"
              >
                {rolePresets.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="WhatsApp / Telefone de Contato"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(27) 99876-5432"
            />

            <Input
              label="E-mail Institucional ou Pessoal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@catedraldecolatina.org.br"
            />
          </div>

          {/* Upload de Foto do Líder */}
          <ImageUploaderField
            label="Foto de Perfil do Membro (Circular / 1:1)"
            value={photoUrl}
            onChange={setPhotoUrl}
            folder="liderancas"
            aspectRatio={1}
            placeholder="Foto com enquadramento no rosto"
          />

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--dash-text-secondary)]">
              Breve Biografia / Missão Pastoral
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Membro atuante há mais de 10 anos, coordena círculos bíblicos e o apostolado..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-secondary)] focus:ring-2 focus:ring-[var(--primary)] outline-hidden resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--dash-border)]">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveMember}
              disabled={!name.trim()}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Salvar Membro
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Membros Cadastrados */}
      {leaders.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--dash-border)] text-xs text-[var(--dash-text-secondary)] space-y-2">
          <Users className="w-8 h-8 mx-auto text-[var(--dash-text-secondary)]/50" />
          <p className="font-semibold">Nenhum membro do CPC cadastrado para esta comunidade.</p>
          <p className="text-[11px]">
            Cadastre os conselheiros para exibição solene no Card 4 e no modal de contatos dos fiéis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] flex items-center justify-between gap-3 shadow-xs hover:border-[var(--dash-border-hover,rgba(255,255,255,0.2))] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-500/40 bg-[var(--dash-surface-secondary)] shrink-0">
                  {leader.photo_url || leader.image ? (
                    <img
                      src={leader.photo_url || leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-500">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                    {leader.name}
                  </h4>
                  <span className="block text-[11px] font-semibold text-amber-500 truncate">
                    {leader.role}
                  </span>
                  {leader.phone && (
                    <span className="block text-[10px] text-[var(--dash-text-secondary)] font-mono truncate">
                      {leader.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEdit(idx)}
                  className="p-2 rounded-lg text-[var(--dash-text-secondary)] hover:text-amber-500 hover:bg-amber-500/10 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                  title="Editar membro"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-2 rounded-lg text-[var(--dash-text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                  title="Excluir membro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
