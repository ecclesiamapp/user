import React from 'react';
import { Save, Palette, Phone, MapPin, QrCode } from 'lucide-react';

export default function ConfiguracoesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Identidade Visual e Informações</h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Personalize a aparência do portal público da sua paróquia (100% White-Label).
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm">
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identidade e Cores */}
        <div className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--primary)]" />
            Cores e Marca Paroquial
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block font-medium mb-1.5">Nome Oficial da Paróquia</label>
              <input
                type="text"
                defaultValue="Catedral do Sagrado Coração de Jesus"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1.5">Diocese / Arquidiocese</label>
              <input
                type="text"
                defaultValue="Diocese de Colatina"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1.5">Cor Litúrgica / Primária do Portal</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  defaultValue="#1e3a8a"
                  className="w-12 h-10 rounded-xl cursor-pointer border border-[var(--dash-border)] p-1 bg-[var(--dash-surface-secondary)]"
                />
                <span className="font-mono text-xs text-[var(--dash-text-secondary)]">#1E3A8A (Azul Catedral)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contato e Secretaria */}
        <div className="p-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Phone className="w-4 h-4 text-[var(--primary)]" />
            Contato da Secretaria e PIX
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block font-medium mb-1.5">WhatsApp da Secretaria</label>
              <input
                type="text"
                defaultValue="(27) 99999-0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1.5">Chave PIX Oficial</label>
              <input
                type="text"
                defaultValue="secretaria@catedral.org.br"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1.5">Tipo de Chave PIX</label>
              <select className="dash-select w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-secondary)] text-[var(--dash-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                <option value="email">E-mail</option>
                <option value="cnpj">CNPJ</option>
                <option value="phone">Telefone</option>
                <option value="random">Chave Aleatória</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
