# ⛪ Especificação Técnica: Simulador de Tempos Litúrgicos com Fallback Canônico

**Módulo:** Painel Administrativo (`/admin/aparencia`)  
**Data de Criação:** 22 de Outubro de 2026  
**Status:** Em Implementação (Aprovado via `/grill-me`)  
**Repositório Oficial:** `c:\Users\Start\ecclesiam-app\`  

---

## 📌 1. Visão Geral & Propósito Pastoral

Na Igreja Católica Romana, o Ano Litúrgico percorre diferentes tempos canônicos expressos pelas cores dos paramentos e do presbitério:
1. **Verde:** Tempo Comum (34 Semanas de perseverança e esperança).
2. **Roxo:** Tempo do Advento e Quaresma (preparação, penitência e oração).
3. **Branco / Dourado:** Tempo do Natal, Tempo Pascal e Grandes Solenidades do Senhor e da Virgem Maria.
4. **Vermelho:** Domingo de Ramos, Pentecostes e Festas dos Santos Mártires.
5. **Rosa:** Domingos da Alegria (*Gaudete* no Advento e *Laetare* na Quaresma).

O **Ecclesiam App** possui tematização litúrgica automatizada integrada ao calendário oficial da CNBB. Para que os párocos, secretários paroquiais e coordenadores da PASCOM possam **inspecionar e demonstrar** antecipadamente como o aplicativo se apresentará em cada solenidade, os botões do **Ciclo Canônico de Cores Litúrgicas** tornam-se interativos para simulação visual.

---

## 🛡️ 2. Regra de Ouro do Fallback Canônico (Proteção de Fidelidade Litúrgica)

No rito católico, a paróquia **nunca** deve exibir um tempo litúrgico em desacordo com o dia real do calendário da Igreja. Portanto, aplica-se uma salvaguarda estrita:

1. **Simulação Efêmera:**
   - O clique em qualquer uma das 5 cores litúrgicas ativa o **Modo de Simulação Litúrgica**, alterando as cores de destaque e menus do painel temporariamente.
   - Exibe um Banner no Topo: *"Modo de Simulação Litúrgica Ativo — Visualizando: [Tempo Simulado]"* com botão de restauração imediata.
2. **Fallback Automático ao Sair da Página:**
   - Se o usuário tentar navegar para outra tela (`/admin`, `/admin/marca`, etc.) ou fechar/recarregar a página enquanto estiver simulando um tempo litúrgico não correspondente ao dia de hoje:
     - O sistema **reverte instantaneamente** o tema para a liturgia oficial do dia.
     - Dispara um **Modal de Confirmação Canônica**:  
       *"Modo de Simulação Litúrgica Encerrado: O tema retornou automaticamente para o Tempo Litúrgico Oficial de Hoje ([Cor/Tempo do Dia]) para garantir a fidelidade litúrgica da Igreja."*
   - O banco de dados nunca salva cores simuladas; apenas o tempo litúrgico canônico é preservado.

---

## 🧩 3. Arquitetura dos Componentes

1. **`AdminAppearanceContext.tsx`:**
   - Guarda `canonicalLiturgy` (liturgia oficial de hoje via API) e `simulatedColor` (cor ativa temporária).
   - Fornece `previewColor(color, tempo, celebracao)`, `resetToCanonical()` e estado `isSimulating`.
   - Monitora mudanças de rota (`usePathname`) para disparar o fallback automático e acionar o modal de aviso.
2. **`app/admin/aparencia/page.tsx`:**
   - Transforma os 5 cards do Ciclo Canônico em botões interativos (`cursor-pointer`, badge "Simulando", anel de brilho na cor litúrgica).
   - Renderiza o Banner de Alerta Superior com botão *"Restaurar Liturgia de Hoje"*.
   - Renderiza o Modal Solene de Fallback Canônico.
3. **`AdminSidebar.tsx`:**
   - Adota dinamicamente a cor litúrgica ativa (seja ela a canônica do dia ou a simulada).
