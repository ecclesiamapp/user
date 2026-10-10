# ⏱️ Especificação da Skill: Avaliação de Saúde do Prazo & Relatório Situacional

> **Nome da Skill:** `project_health_timeline`  
> **Caminho:** `.agents/skills/project_health_timeline/`  
> **Data de Criação:** 09/10/2026  
> **Fonte Oficial de Verdade (SSOT):** [`[documentation]/planejamento/PLANO_DESENVOLVIMENTO_NATAL_2026.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/PLANO_DESENVOLVIMENTO_NATAL_2026.md)  
> **Alinhamento:** Sessão interativa via `/grill-me`

---

## 🎯 1. Objetivo da Skill
Avaliar de forma contínua a saúde do cronograma de desenvolvimento do **Ecclesiam App & Catedral de Colatina**, comparando o momento atual com os 4 marcos litúrgicos do Plano Mestre de Natal de 2026. Além de emitir o diagnóstico situacional, a skill pergunta ativamente a carga horária disponível na sessão para orientar o desenvolvedor com a trilha cirúrgica de maior impacto.

---

## ⚡ 2. Gatilhos de Acionamento
- `relatorio de pendencia` / `relatório de pendências`
- `relatorio situacional` / `relatório situacional`
- `pendencias` / `pendências`
- `saude do projeto` / `saúde do prazo`
- `status do projeto`

---

## 🧭 3. Marcos Litúrgicos de Referência (Natal 2026)

| Fase | Data Alvo | Evento Litúrgico | Escopo de Entrega |
| :--- | :---: | :--- | :--- |
| **Fase 1** | **01/11/2026** | Solenidade de Todos os Santos | Portal da Matriz no ar, Domínio Oficial, Palavra do Pároco na Home, Central do Dízimo (Theòs) + QR Code PIX, Clero (4 padres), Capacitação 1 da secretária (4h). |
| **Fase 2** | **22/11/2026** | Solenidade de Cristo Rei | Mini-sites das 12 CEBs & Grupo Santa Rita com rotas GPS, Folhetos em PDF («Sou do Sagrado Missa»), Liturgia CNBB, Capacitação 2 das CEBs (4h). |
| **Fase 3** | **06/12/2026** | 2º Domingo do Advento | Secretaria On-line completa, agendamento de confissões com os 4 sacerdotes, fichas de batismo/catequese/noivos, e-mails via Resend. |
| **Fase 4** | **25/12/2026** | Solenidade do Natal | Grade de fim de ano (Missa do Galo), campanha PWA nos celulares, formalização do setup piloto e início do plano mensal. |

---

## 🛠️ 4. Arquitetura da Skill

```
.agents/skills/project_health_timeline/
├── SKILL.md                          # Instruções da skill e prompt operacional
└── scripts/
    └── check_health.js               # Script Node.js de cálculo de datas, Git e trilhas
```

---

## 📋 5. Dinâmica Interativa (Timeboxing)
Ao acionar os gatilhos:
1. O agente executa `node .agents/skills/project_health_timeline/scripts/check_health.js`.
2. Emite o relatório situacional completo com métricas de dias restantes, pendências da sprint e integridade do Git.
3. Pergunta interativamente via `ask_question`: **"Quanto tempo temos para a sessão de hoje?"**
   - `30 minutos (Pequenos ajustes, testes rápidos ou Protocolo Deploy)`
   - `1 hora (Implementação focal de 1 recurso ou formulário)`
   - `2 horas (Sprint técnica mais profunda ou avanço de módulo)`
   - `Livre / Maratona (Concluir múltiplos itens e avançar no marco)`
4. Após a resposta, entrega o plano de execução imediato e inicia a tarefa.
