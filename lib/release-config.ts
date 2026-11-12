/**
 * Configuração do Lançamento Escalonado: Catedral de Colatina
 * 
 * • Fase 1 (Natal 2026): Foco solene no Natal, Horários de Fim de Ano, Missa Ao Vivo, Mensagens do Clero e Dízimo PIX.
 * • Fase 2 (Janeiro 2027): Secretaria On-line (Intenções Púlpito A4), «Meu Espaço» (Login) e 12 Comunidades (CEBs).
 * • Fase 3 (Março 2027): Assistente IA Paroquial (RAG), Movimentos (ECC, EAC, EJC) e Notificações Push.
 */

export const CURRENT_RELEASE_PHASE: 1 | 2 | 3 = 1;

/**
 * Retorna se determinada fase já está liberada na interface pública
 */
export function isPhaseActive(minPhase: 1 | 2 | 3): boolean {
  return CURRENT_RELEASE_PHASE >= minPhase;
}
