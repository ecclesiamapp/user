'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  QrCode, 
  Save, 
  Check, 
  Loader2, 
  ShieldCheck, 
  Info,
  ExternalLink
} from 'lucide-react';
import { Parish } from '@/types';
import { createClient } from '@/utils/supabase/client';

interface TitheSettingsTabProps {
  parish: Parish;
}

export function TitheSettingsTab({ parish }: TitheSettingsTabProps) {
  const [pixKey, setPixKey] = useState(parish.pix_key || '');
  const [pixKeyType, setPixKeyType] = useState<string>(parish.pix_key_type || 'email');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('parishes')
        .update({
          pix_key: pixKey.trim(),
          pix_key_type: pixKeyType,
          updated_at: new Date().toISOString(),
        })
        .eq('id', parish.id);

      if (!error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Erro ao atualizar configurações de PIX:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[var(--dash-border)] pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFA82A]/10 text-[#FFA82A] flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-cinzel text-base font-bold text-[var(--dash-text-primary)]">
              Chave PIX Oficial da Mitra Diocesana
            </h3>
            <p className="text-xs text-[var(--dash-text-secondary)]">
              Exibida na subpágina pública /dizimo para doações e ofertas espontâneas diretamente na conta paroquial da Mitra
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                Tipo de Chave
              </label>
              <select
                value={pixKeyType}
                onChange={(e) => setPixKeyType(e.target.value)}
                className="dash-select w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm text-[var(--dash-text-primary)] pl-3.5 pr-10 py-2.5 focus:outline-hidden focus:border-[#FFA82A]"
              >
                <option value="email">E-mail</option>
                <option value="cnpj">CNPJ</option>
                <option value="phone">Telefone</option>
                <option value="random">Chave Aleatória</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-[var(--dash-text-primary)] uppercase tracking-wider">
                Chave PIX
              </label>
              <input
                type="text"
                required
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="secretaria@catedraldecolatina.org.br"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-sm font-mono text-[var(--dash-text-primary)] focus:outline-hidden focus:border-[#FFA82A]"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--dash-surface-secondary)] border border-[var(--dash-border)] space-y-1 text-xs text-[var(--dash-text-secondary)]">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--dash-text-primary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Neutralidade Financeira e Segurança Canônica:</span>
            </div>
            <p className="leading-relaxed">
              O Ecclesiam App não transita, não custodia e não divide valores financeiros. Todos os depósitos são realizados de banco a banco diretamente para a conta da <strong>{parish.name}</strong>.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              {saved && (
                <>
                  <Check className="w-4 h-4" />
                  <span>Configurações atualizadas com sucesso!</span>
                </>
              )}
            </span>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B1E22] dark:bg-[#FFA82A] text-white dark:text-[#2D1A16] font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Salvar Chave</span>
            </button>
          </div>
        </form>
      </div>

      {/* Caixa Informativa sobre o Theòs */}
      <div className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FFA82A] uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Gestão Eclesial Oficial (Theòs Sistemas)</span>
        </div>
        <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
          Os novos dizimistas cadastrados através do portal público devem ser lançados manualmente pela equipe da secretaria no software Theòs para emissão do número de cadastro paroquial e inclusão no livro contábil da Mitra.
        </p>
      </div>
    </div>
  );
}
