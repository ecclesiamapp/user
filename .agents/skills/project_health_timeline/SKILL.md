---
name: Avaliação de Saúde do Prazo & Relatório Situacional
description: Avalia a saúde do cronograma em relação aos marcos litúrgicos do PLANO_DESENVOLVIMENTO_NATAL_2026.md, mapeia pendências técnicas e pergunta ao dev o tempo disponível na sessão para sugerir a melhor rota de trabalho. Acionada por "relatorio de pendencia", "relatorio situacional", "pendencias", "saude do projeto" ou "status do projeto".
---

# ⏱️ Avaliação de Saúde do Prazo & Relatório Situacional — Ecclesiam App

Esta skill gerencia a saúde dos prazos, marcos dominicais e direcionamento cirúrgico de sessões de desenvolvimento do **Ecclesiam App & Catedral de Colatina**.

---

## 🎯 Gatilhos de Ativação
A IA deve acionar esta skill **imediatamente** sempre que o usuário digitar expressões como:
- `relatorio de pendencia` / `relatório de pendências`
- `relatorio situacional` / `relatório situacional`
- `pendencias` / `pendências`
- `saude do prazo` / `saúde do projeto`
- `status do projeto` / `como estamos de prazo?`

---

## 🧭 Fonte Oficial de Verdade (SSOT de Prazos)
O documento canônico de referência é:
👉 [`[documentation]/planejamento/PLANO_DESENVOLVIMENTO_NATAL_2026.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/PLANO_DESENVOLVIMENTO_NATAL_2026.md)

Com os 4 Marcos Dominicais Litúrgicos:
1. **01/11/2026 (Solenidade de Todos os Santos):** Go-Live Fase 1 — Portal Oficial da Matriz.
2. **22/11/2026 (Solenidade de Cristo Rei):** Go-Live Fase 2 — Mini-sites das 12 CEBs & Folhetos de Missa.
3. **06/12/2026 (2º Domingo do Advento):** Go-Live Fase 3 — Secretaria On-line & Agendamentos.
4. **25/12/2026 (Natividade do Senhor):** Solenidade do Natal — Consolidação Plena & PWA nos Celulares.

---

## ⚡ Protocolo de Execução Obrigatório (Passo a Passo)

Sempre que a skill for acionada, execute os passos abaixo rigorosamente em ordem:

### 1. Diagnóstico Automatizado
Execute o script auxiliar de cálculo:
```bash
node .agents/skills/project_health_timeline/scripts/check_health.js
```
Capture o JSON com os dias restantes, status do Git e trilhas sugeridas.

### 2. Apresentação do Relatório Situacional
Emita uma resposta estruturada contendo:
- **Badge e Classificação de Saúde:**
  - 🟢 **Excelente / No Prazo:** Mais de 12 dias para o marco e sem bloqueios impeditivos.
  - 🟡 **Atenção / Ritmo Médio:** Entre 6 e 12 dias restantes; foco nas tarefas essenciais.
  - 🔴 **Crítico / Risco Iminente:** Menos de 5 dias restantes com itens bloqueantes pendentes.
- **Painel do Marco Ativo:** Nome da fase, data limite, evento litúrgico e dias restantes.
- **Status do Repositório Git:** Se há arquivos modificados ou novos aguardando commit/push.
- **Pendências Prioritárias da Sprint Ativa:** O que já está concluído vs. o que falta para fechar a fase.

### 3. Pergunta Interativa de Timeboxing (MANDATÓRIA)
Ao final do relatório situacional, **OBRIGATORIAMENTE** utilize a ferramenta `ask_question` para perguntar ao desenvolvedor quanto tempo ele possui disponível na sessão atual:
- **Opções:**
  1. `30 minutos (Pequenos ajustes, testes rápidos ou Protocolo Deploy)`
  2. `1 hora (Implementação focal de 1 recurso ou formulário)`
  3. `2 horas (Sprint técnica mais profunda ou avanço de módulo)`
  4. `Livre / Maratona (Concluir múltiplos itens e avançar no marco)`

### 4. Rota Cirúrgica Personalizada
Assim que o desenvolvedor responder com a sua disponibilidade de tempo, o agente deve:
1. Apresentar a **Trilha Cirúrgica** exata para aquele bloco de tempo.
2. Propor o início imediato da primeira tarefa da trilha sem rodeios.
