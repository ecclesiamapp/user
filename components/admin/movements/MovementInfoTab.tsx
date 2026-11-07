'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Edit2,
  Save,
  Loader2,
} from 'lucide-react';
import { ParishMovement } from '@/types/movements';
import { createClient } from '@/utils/supabase/client';

interface MovementInfoTabProps {
  movements: ParishMovement[];
  onReload: () => Promise<void>;
}

export function MovementInfoTab({ movements, onReload }: MovementInfoTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Edit fields
  const [patronSaint, setPatronSaint] = useState('');
  const [carisma, setCarisma] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [coordinatingTeam, setCoordinatingTeam] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleStartEdit = (mov: ParishMovement) => {
    setEditingId(mov.id);
    setPatronSaint(mov.patron_saint || '');
    setCarisma(mov.carisma || '');
    setDirectorName(mov.spiritual_director_name || '');
    setCoordinatingTeam(mov.coordinating_team || '');
    setWhatsapp(mov.contact_whatsapp || '');
    setSchedule(mov.meeting_schedule || '');
  };

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('parish_movements')
        .update({
          patron_saint: patronSaint.trim() || null,
          carisma: carisma.trim() || null,
          spiritual_director_name: directorName.trim() || null,
          coordinating_team: coordinatingTeam.trim() || null,
          contact_whatsapp: whatsapp.trim() || null,
          meeting_schedule: schedule.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        setFeedback(`Erro ao salvar: ${error.message}`);
      } else {
        setFeedback('Informações do movimento atualizadas com sucesso!');
        setEditingId(null);
        await onReload();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha';
      setFeedback(`Erro: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <div className="p-3.5 rounded-xl bg-[#22262B] border border-[#C8A463]/40 text-xs text-[#FAF6F0] flex items-center justify-between">
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-[#FFCC36] hover:underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {movements.map((mov) => {
          const isEditing = editingId === mov.id;

          return (
            <div
              key={mov.id}
              className="rounded-2xl bg-[#1B1E22] border border-[#C8A463]/25 flex flex-col justify-between overflow-hidden shadow-lg p-5 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-[#C8A463]/20 border border-[#C8A463]/40 flex items-center justify-center text-[#FFCC36] text-lg font-serif font-black">
                    {mov.acronym}
                  </span>
                  <Link
                    href={`/movimentos/${mov.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] text-[#FFCC36] hover:underline"
                  >
                    <span>Ver no Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-[#FAF6F0]">{mov.name}</h3>
                  <p className="text-xs text-[#C8A463] mt-0.5">
                    Patrono: {mov.patron_saint || 'Padroeiro Diocesano'}
                  </p>
                </div>

                {isEditing ? (
                  <div className="space-y-2.5 pt-2 border-t border-[#C8A463]/15 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#FFCC36]">
                        Patrono(a)
                      </label>
                      <input
                        type="text"
                        value={patronSaint}
                        onChange={(e) => setPatronSaint(e.target.value)}
                        className="w-full rounded-lg bg-[#22262B] border border-[#C8A463]/30 px-2 py-1.5 text-xs text-[#FAF6F0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#FFCC36]">
                        Carisma / Lema
                      </label>
                      <textarea
                        rows={2}
                        value={carisma}
                        onChange={(e) => setCarisma(e.target.value)}
                        className="w-full rounded-lg bg-[#22262B] border border-[#C8A463]/30 px-2 py-1.5 text-xs text-[#FAF6F0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#FFCC36]">
                        Diretor Espiritual
                      </label>
                      <input
                        type="text"
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                        className="w-full rounded-lg bg-[#22262B] border border-[#C8A463]/30 px-2 py-1.5 text-xs text-[#FAF6F0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#FFCC36]">
                        Coordenação Geral
                      </label>
                      <input
                        type="text"
                        value={coordinatingTeam}
                        onChange={(e) => setCoordinatingTeam(e.target.value)}
                        className="w-full rounded-lg bg-[#22262B] border border-[#C8A463]/30 px-2 py-1.5 text-xs text-[#FAF6F0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#FFCC36]">
                        WhatsApp Coordenação
                      </label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full rounded-lg bg-[#22262B] border border-[#C8A463]/30 px-2 py-1.5 text-xs text-[#FAF6F0]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-[#C8A463]/15 text-xs text-[#FAF6F0]/80">
                    <p className="line-clamp-2 italic text-[11px]">&ldquo;{mov.carisma}&rdquo;</p>
                    <div className="text-[11px] text-[#FAF6F0]/60 space-y-1">
                      <p>
                        <strong>Diretor:</strong> {mov.spiritual_director_name}
                      </p>
                      <p>
                        <strong>Coordenação:</strong> {mov.coordinating_team}
                      </p>
                      <p>
                        <strong>WhatsApp:</strong> {mov.contact_whatsapp || 'Não informado'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#C8A463]/15 flex items-center justify-end gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#FAF6F0]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSaveEdit(mov.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C8A463] text-[#2D1A16] font-bold text-xs uppercase"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Salvar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(mov)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C8A463]/30 hover:bg-[var(--dash-surface)]/5 text-xs font-semibold text-[#FFCC36]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar Dados
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
