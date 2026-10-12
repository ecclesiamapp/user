---
name: multi_agent_team
description: "Orquestrador multi-agente inspirado no oh-my-claudecode. Concede ao agente o poder de convocar 19 especialistas distribuídos em 4 pods (Análise & Estratégia, Execução & Engenharia, Qualidade & Segurança, Produto & Orquestração). Triggers: 'team', '/team', 'time de agentes', 'especialista', 'autopilot', 'revisão por pares', 'oh-my-claudecode'."
metadata:
  author: Yeachan-Heo / Antigravity Adapter
  version: "1.0.0"
---

# 🤖 Multi-Agent Specialist Squad (Inspirado no oh-my-claudecode)

Esta skill transforma o agente em uma orquestração de **19 especialistas de elite** capazes de trabalhar colaborativamente em qualquer tarefa de engenharia de software, arquitetura ou produto.

---

## 🏛️ Os 4 Pods e seus 19 Especialistas

### 1. 🧠 Pod: Análise e Estratégia
* **`architect`**: Desenho de arquitetura, padrões estruturais, separação de camadas e escalabilidade.
* **`debugger`**: Investigação de causa-raiz, logs profundos, exceções de runtime e memory leaks.
* **`tracer`**: Rastreamento de fluxo de chamadas, ciclo de vida de dados e efeitos colaterais.
* **`explore`**: Mapeamento exploratório de pastas, novas libs e dependências desconhecidas.
* **`document-specialist`**: Manutenção do SSOT (`DOCUMENTATION.md`), manuais e especificações técnicas.
* **`scientist`**: Otimização de performance algorítmica, benchmarks e estruturas de dados complexas.

### 2. ⚡ Pod: Execução e Engenharia
* **`executor`**: Implementação cirúrgica de código, commits limpos e resolução de tarefas.
* **`code-simplifier`**: Aplicação de regras anti-monólito, redução de linhas, extração de subcomponentes e DRY.
* **`git-master`**: Controle de branches, rebase, convenções de commits e integridade do repositório.
* **`designer`**: Especialista em UX/UI, harmonia de cores, Dark Mode, microinterações e Tailwind.
* **`writer`**: Comunicação assertiva, microcopy pastoral e mensagens de interface.

### 3. 🛡️ Pod: Qualidade, QA e Segurança
* **`qa-tester`**: Cobertura de cenários de teste, edge cases e validação comportamental.
* **`code-reviewer`**: Revisão estrita de PRs e diffs, detecção de anti-patterns e clareza de código.
* **`security-reviewer`**: Auditoria de RLS no Supabase, segurança de tokens, sanitização e vazamento de chaves.
* **`verifier`**: Verificação de aceitação técnica (compilação TypeScript `npm run build` e 0 falhas).
* **`critic`**: Análise adversarial: caça ativamente furos lógicos, riscos não previstos e fragilidades.

### 4. 📋 Pod: Produto e Orquestração
* **`planner`**: Quebra de metas épicas em tarefas atômicas e sequenciais.
* **`analyst`**: Validação de valor de negócio, requisitos de usuário e impacto no cliente.
* **`autopilot`**: Execução contínua em esteira: Planejamento ➔ Execução ➔ Crítica ➔ Verificação.

---

## 💻 Comandos e Utilização

### Listar todos os Especialistas
```powershell
node .agents/skills/multi_agent_team/scripts/dispatch_team.js --list
```

### Convocar um Time Específico (`/team`)
Exemplo: convocar Arquiteto + Executor + Revisor de Segurança para criar uma nova migration:
```powershell
node .agents/skills/multi_agent_team/scripts/dispatch_team.js --team architect,executor,security-reviewer "Criar tabela de dizimistas e políticas RLS"
```

### Modo Autopilot Autônomo
O motor detecta a natureza da demanda e monta automaticamente o trio ideal de especialistas:
```powershell
node .agents/skills/multi_agent_team/scripts/dispatch_team.js --autopilot "Corrigir quebra de layout na página inicial"
```
