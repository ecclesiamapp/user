import React from 'react';
import { Plus, Church, MapPin, Phone, User, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ComunidadesAdminPage() {
  const sampleCommunities = [
    {
      id: '1',
      name: 'Igreja Matriz - Catedral do Sagrado Coração de Jesus',
      patron_saint: 'Sagrado Coração de Jesus',
      is_headquarters: true,
      neighborhood: 'Centro',
      city: 'Colatina',
      contact_name: 'Secretaria Geral',
      contact_phone: '(27) 99999-0000',
      masses_count: 8,
      is_active: true,
    },
    {
      id: '2',
      name: 'Comunidade São Pedro e São Paulo',
      patron_saint: 'São Pedro e São Paulo',
      is_headquarters: false,
      neighborhood: 'Bairro Vila Nova',
      city: 'Colatina',
      contact_name: 'Antônio Carlos (Coordenador)',
      contact_phone: '(27) 98888-1111',
      masses_count: 2,
      is_active: true,
    },
    {
      id: '3',
      name: 'Comunidade Santo Antônio',
      patron_saint: 'Santo Antônio de Pádua',
      is_headquarters: false,
      neighborhood: 'Córrego das Flores (Zona Rural)',
      city: 'Colatina',
      contact_name: 'Dona Maria de Lourdes',
      contact_phone: '(27) 97777-2222',
      masses_count: 1,
      is_active: true,
    },
    {
      id: '4',
      name: 'Comunidade Santa Teresinha',
      patron_saint: 'Santa Teresinha do Menino Jesus',
      is_headquarters: false,
      neighborhood: 'Bairro Bela Vista',
      city: 'Colatina',
      contact_name: 'Marcos Vinícius',
      contact_phone: '(27) 96666-3333',
      masses_count: 2,
      is_active: true,
    },
    {
      id: '5',
      name: 'Comunidade Nossa Senhora de Fátima',
      patron_saint: 'Nossa Senhora do Rosário de Fátima',
      is_headquarters: false,
      neighborhood: 'Distrito de São Salvador',
      city: 'Colatina',
      contact_name: 'José Ferreira',
      contact_phone: '(27) 95555-4444',
      masses_count: 1,
      is_active: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Comunidades Eclesiais de Base (CEBs)</h1>
          <p className="text-sm text-[var(--dash-text-secondary)] mt-1">
            Gerencie a rede paroquial: Igreja Matriz, capelas e comunidades urbanas e rurais.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          Nova Comunidade (CEB)
        </button>
      </div>

      {/* Grid de Cards de Comunidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sampleCommunities.map((community) => (
          <div
            key={community.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
              community.is_headquarters
                ? 'bg-[var(--dash-surface)] border-amber-500/40 ring-1 ring-amber-500/20'
                : 'bg-[var(--dash-surface)] border-[var(--dash-border)] hover:border-[var(--primary)]/40'
            }`}
          >
            <div className="space-y-3">
              {/* Badge e Status */}
              <div className="flex items-center justify-between">
                {community.is_headquarters ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs uppercase tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Igreja Matriz (Sede)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--dash-surface-secondary)] text-[var(--dash-text-secondary)] font-semibold text-xs">
                    <Church className="w-3 h-3" />
                    CEB / Capela
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ativa
                </span>
              </div>

              {/* Título e Padroeiro */}
              <div>
                <h2 className="text-base font-bold leading-snug line-clamp-1">{community.name}</h2>
                <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                  Padroeiro: <span className="font-semibold text-[var(--dash-text-primary)]">{community.patron_saint}</span>
                </p>
              </div>

              {/* Informações de Localização e Contato */}
              <div className="pt-2 border-t border-[var(--dash-border)] space-y-1.5 text-xs text-[var(--dash-text-secondary)]">
                <p className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--primary)]" />
                  <span>{community.neighborhood}, {community.city}</span>
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-secondary)]" />
                  <span>{community.contact_name}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[var(--dash-text-secondary)]" />
                  <span>{community.contact_phone}</span>
                </p>
              </div>
            </div>

            {/* Rodapé do Card */}
            <div className="pt-3 border-t border-[var(--dash-border)] flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--primary)]">
                {community.masses_count} {community.masses_count === 1 ? 'Horário' : 'Horários'}
              </span>

              <Link
                href={`/admin/horarios?community_id=${community.id}`}
                className="inline-flex items-center gap-1 text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] font-semibold transition-colors"
              >
                <span>Ver celebrações</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
