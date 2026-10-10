---
name: Gerente de Projeto (Project Manager)
description: Gerente contínuo do projeto Ecclesiam App. Integrado ao Protocolo Start (Etapa 4) e acionado a cada etapa concluída ou por palavras-chave ("próximo passo", "etapa concluída", "o que vem agora?", "e agora?"). Escaneia o PLANO_DE_ACAO_DETALHADO.md e apresenta o Card Executivo da próxima tarefa prioritária.
---

# 👔 Gerente de Projeto (Project Manager) — Ecclesiam App

Esta skill atua como o **Orquestrador Oficial de Fluxo de Trabalho e Entregas** do **Ecclesiam App & Catedral de Colatina**. Ela monitora continuamente o plano de ação, marca tarefas concluídas e indica a próxima ação cirúrgica sem permitir que o projeto fique sem rumo.

---

## 🎯 Gatilhos de Ativação

A skill deve ser acionada nas seguintes situações:
1. **No Protocolo Start:** Como a **Etapa 4** obrigatória da inicialização da sessão.
2. **Ao Concluir Qualquer Tarefa:** Proativamente logo após implementar ou deployar uma funcionalidade.
3. **Por Palavras-Chave:**
   - `próximo passo` / `proximo passo` / `qual o proximo passo?`
   - `etapa concluída` / `tarefa concluída` / `finalizado`
   - `o que vem agora?` / `e agora?` / `qual a próxima tarefa?`

---

## 🧭 Fonte Viva de Verdade (SSOT de Tarefas)
👉 [`[documentation]/planejamento/PLANO_DE_ACAO_DETALHADO.md`](file:///c:/Users/Start/ecclesiam-app/%5Bdocumentation%5D/planejamento/PLANO_DE_ACAO_DETALHADO.md)

---

## ⚡ 1. Ativação no Protocolo Start (Etapa 4)
Após executar:
1. Etapa 1: Git (`git fetch origin && git status`)
2. Etapa 2: Servidor Local (`npm run dev`)
3. Etapa 3: Auditoria UX/UI (`node .agents/skills/ux_ui_auditor/scripts/audit_ux_ui.js`)

O agente DEVE executar a **Etapa 4 — Ativação do Gerente de Projeto**:
```bash
node .agents/skills/project_manager/scripts/scan_plan.js
```
Apresentar o painel executivo com o percentual de avanço de cada fase e entregar o **Card Executivo do Próximo Passo**.

---

## 🔁 2. Loop de Conclusão de Etapas (A Cada Entrega)

Sempre que uma tarefa for finalizada:
1. **Marcar como Concluída:**
   ```bash
   node .agents/skills/project_manager/scripts/scan_plan.js --complete TASK-XX
   ```
2. **Escanear o Próximo Passo Desbloqueado:**
   ```bash
   node .agents/skills/project_manager/scripts/scan_plan.js
   ```
3. **Emitir o Card Executivo do Próximo Passo:**
   Exibir obrigatoriamente neste formato padronizado:

```markdown
### 📌 Próximo Passo Recomendado: [TASK-ID] — Nome da Tarefa
* **Fase & Marco:** [Fase X — Evento Litúrgico e Data]
* **Categoria:** [Ex: Front-end, Back-end, Documentação, Segurança]
* **Objetivo Pastoral / Técnico:** [Explicação clara do porquê fazer agora]
* **Arquivos a Serem Modificados / Criados:**
  * [caminho/do/arquivo.tsx](file:///c:/Users/Start/ecclesiam-app/caminho/do/arquivo.tsx)
* **Tempo Estimado:** [X minutos]

Deseja que eu inicie esta implementação agora?
```
