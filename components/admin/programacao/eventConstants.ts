export const EVENT_TYPES = [
  { value: 'copadroeira', label: 'Festa da Co-Padroeira', description: 'Festividade mariana e da padroeira secundária da paróquia' },
  { value: 'padroeiro_matriz', label: 'Padroeiro Principal (Matriz)', description: 'Solenidade do Sagrado Coração de Jesus' },
  { value: 'liturgico_global', label: 'Solenidade do Calendário Universal', description: 'Semana Santa, Corpus Christi, Natal, Pentecostes' },
  { value: 'padroeiro_ceb', label: 'Festa de Padroeiro de Comunidade (CEB)', description: 'Festa anual da comunidade (CEB) paroquial' },
  { value: 'solenidade_especial', label: 'Celebração ou Jubileu Especial', description: 'Ordinações, crisma paroquial, aniversários de dedicação' },
] as const;

import { EVENT_COLOR_PRESETS } from '@/lib/events';
export { EVENT_COLOR_PRESETS };

export const EVENT_STATUSES = [
  { value: 'destaque_ativo', label: 'Publicado & Ativo', color: 'emerald', description: 'Visível no portal e em destaque nos banners' },
  { value: 'rascunho', label: 'Rascunho Interno', color: 'amber', description: 'Apenas a secretaria e padres podem visualizar' },
  { value: 'encerrado', label: 'Festividade Encerrada', color: 'slate', description: 'Mantido no acervo histórico de celebrações' },
] as const;

export const LITURGICAL_COLORS = [
  { value: 'branco', label: 'Branco / Dourado', bgClass: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700/50', border: '#D4AF37' },
  { value: 'vermelho', label: 'Vermelho Solene', bgClass: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-700/50', border: '#DC2626' },
  { value: 'verde', label: 'Verde (Tempo Comum)', bgClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-700/50', border: '#16A34A' },
  { value: 'roxo', label: 'Roxo (Penitencial / Espera)', bgClass: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-700/50', border: '#9333EA' },
  { value: 'rosa', label: 'Rosa (Gaudete / Laetare)', bgClass: 'bg-pink-100 text-pink-900 border-pink-300 dark:bg-pink-950/40 dark:text-pink-200 dark:border-pink-700/50', border: '#EC4899' },
] as const;

export function getEventTypeBadge(type: string) {
  switch (type) {
    case 'copadroeira':
      return { label: 'Co-Padroeira', bg: 'bg-[#FFA82A]/15 text-[#FFCC36] border-[#FFA82A]/30' };
    case 'padroeiro_matriz':
      return { label: 'Padroeiro Matriz', bg: 'bg-[#8B1E22]/20 text-rose-300 border-[#8B1E22]/40' };
    case 'liturgico_global':
      return { label: 'Universal / Tríduo', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    case 'padroeiro_ceb':
      return { label: 'Festa da CEB', bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
    case 'solenidade_especial':
    default:
      return { label: 'Solenidade', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'destaque_ativo':
      return { label: 'Destaque Ativo', dot: 'bg-emerald-500', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'rascunho':
      return { label: 'Rascunho', dot: 'bg-amber-500', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    case 'encerrado':
    default:
      return { label: 'Encerrado', dot: 'bg-slate-500', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  }
}
