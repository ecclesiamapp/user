# 🟢 Protocolo Start - Ecclesiam App

Este documento define as diretrizes obrigatórias que o agente de IA deve executar sempre que o usuário iniciar uma nova sessão ou solicitar explicitamente a execução do **"Protocolo Start"**.

---

## 🛠️ Fluxo de Execução Obrigatório

Quando este protocolo for acionado, o agente deve seguir rigorosamente a seguinte ordem de passos:

### 01. Iniciar o Servidor Local de Desenvolvimento e o Monitoramento Anti-Monolito
Antes de qualquer outra verificação ou análise, o agente deve garantir que o servidor de desenvolvimento local está rodando de forma isolada.
* **Ação**: Executar o comando `npm run dev` em segundo plano (especificando a porta `-p 3000` ou `-p 3001` caso necessário para evitar conflitos de porta).
* **Verificação**: Confirmar que o processo foi iniciado com sucesso e aguardar a mensagem `✓ Ready`.
* **Link de Acesso Local**: [http://localhost:3000](http://localhost:3000) (ou [http://127.0.0.1:3000](http://127.0.0.1:3000))

---

### 02. Verificar Sincronização Git (Local vs. Online)
O agente deve verificar a sincronização do repositório local com o repositório remoto para evitar conflitos de código ou perda de trabalho.

1. **Executar Verificação**:
   * Rodar um `git fetch` em segundo plano para obter o estado mais recente do servidor sem alterar os arquivos locais.
   * Rodar um `git status` ou comparar o commit local com a branch de upstream (`git status -uno` ou similar).
2. **Critério Crítico**:
   * **Se houver atualizações pendentes no remoto (atrás do remoto):** O agente deve informar a quantidade/detalhes dos commits remotos pendentes e perguntar: *"Deseja fazer o **git pull** para atualizar seu repositório local?"*.
   * **Se houver commits locais pendentes de envio (à frente do remoto):** O agente deve informar sobre os commits locais e perguntar: *"Deseja fazer o **git push** para subir as alterações locais?"*.
   * **Se houver arquivos modificados localmente não comitados:** O agente deve listar os arquivos modificados e perguntar qual ação tomar.
   * **Se estiver 100% sincronizado:** Informar que o repositório está atualizado e prosseguir.

---

### 03. Análise de Continuidade da Sessão Anterior
Após garantir a sincronização do repositório, o agente deve mapear o contexto exato de onde o desenvolvimento parou.

1. **Identificar Arquivos Afetados**:
   * Rodar `git log -n 3 --stat` para ver quais foram os últimos arquivos alterados e comitados na sessão recente.
   * Se aplicável, olhar o status do repositório para ver quais arquivos foram editados recentemente.
2. **Consultar Fontes de Contexto**:
   * Ler e analisar o documento principal `[documentation]/MANIFESTO_ECCLESIAM.md` para garantir aderência à Fonte Única da Verdade (SSOT), filosofia White-Label e foco do MVP.
   * Consultar notas de continuidade ou pendências ativas se disponíveis.
3. **Apresentar Diagnóstico**:
   * Apresentar um resumo claro de onde o projeto parou e o status das entregas.

---

### 04. Gerente de Projeto & Varredura do Plano de Ação
O agente deve executar a varredura automática do cronograma e pendências para definir o próximo alvo de trabalho:
1. **Execução**: Rodar `node .agents/skills/project_manager/scripts/scan_plan.js`.
2. **Card Executivo**: Apresentar no chat o Card Executivo da próxima tarefa prioritária contendo:
   * **ID & Título da Tarefa** (ex: `[TASK-19]: Treinamento Lideranças das 12 CEBs`).
   * **Fase e Marco Litúrgico Relacionado**.
   * **Justificativa e Arquivos Afetados**.
   * **Tempo Estimado de Implementação**.

---

### 05. Convocação Opcional do Squad Multi-Agente (Quando Julgar Necessário)
Ao final do diagnóstico do Protocolo Start (ou a qualquer momento em que uma tarefa complexa exigir rigor especializado), o desenvolvedor pode convocar os **19 Agentes Especialistas** da skill `multi_agent_team`.

O agente deve apresentar ativamente a pergunta:
> *"💡 Deseja convocar o Squad Multi-Agente (`/team` ou `/autopilot`) para esta tarefa ou seguir no modo padrão?"*

---

## 🤖 Comandos para Acionar as Funcionalidades Multi-Agente

Você pode utilizar os seguintes comandos rápidos e palavras-chave a qualquer momento:

| Comando / Gatilho | O que faz | Exemplo de Uso |
| :--- | :--- | :--- |
| **`/team <papeis> "<tarefa>"`** | Convoca especialistas específicos para trabalhar juntos na tarefa | `/team architect,executor,security-reviewer "Criar tabela de dizimistas e RLS"` |
| **`convocar time de <papeis>`** | Forma verbal do comando de squad | `convocar time de designer,executor para ajustar o modal de horários` |
| **`/autopilot "<tarefa>"`** | O orquestrador analisa a demanda e monta sozinho o trio ideal (Planejar ➔ Executar ➔ Verificar) | `/autopilot "Resolver TASK-19 e validar build"` |
| **`/especialista <papel>`** | Aciona um único especialista pontual para consultoria ou revisão | `/especialista security-reviewer "Auditar RLS da tabela galleries"` |
| **`listar especialistas`** ou **`/team --list`** | Exibe todos os 19 especialistas e seus respectivos pods no chat | `listar especialistas` |

---

## 🏛️ Catálogo dos 4 Pods e seus 19 Especialistas

### 1. 🧠 Pod: Análise e Estratégia
* **`architect`**: Arquitetura de software, patterns estruturais, desacoplamento e escalabilidade.
* **`debugger`**: Investigação profunda de causa-raiz de bugs, exceções de runtime e gargalos.
* **`tracer`**: Rastreamento de fluxo de execução, ciclo de vida de dados e efeitos colaterais.
* **`explore`**: Mapeamento exploratório do repositório, pacotes npm e integrações desconhecidas.
* **`document-specialist`**: Sincronização rigorosa do SSOT (`[documentation]/`), manuais e documentações.
* **`scientist`**: Otimização de performance algorítmica, benchmarks e estruturas de dados complexas.

### 2. ⚡ Pod: Execução e Engenharia
* **`executor`**: Implementação cirúrgica de código, escrita de regras de negócio e resolução de issues.
* **`code-simplifier`**: Aplicação de regras anti-monólito, redução de linhas, extração de subcomponentes e DRY.
* **`git-master`**: Gestão de branches, rebase, commits atômicos padronizados e integridade do repositório.
* **`designer`**: Design de UI/UX, paleta Pe. Alex Nogueira, Dark Mode, microinterações e Tailwind.
* **`writer`**: Microcopy pastoral, mensagens de validação, termos litúrgicos e redação técnica.

### 3. 🛡️ Pod: Qualidade, QA e Segurança
* **`qa-tester`**: Cobertura de cenários de teste, simulações de fluxo de paroquiano e edge cases.
* **`code-reviewer`**: Revisão estrita de PRs e diffs, detecção de anti-patterns e clareza de código.
* **`security-reviewer`**: Auditoria de RLS no Supabase, isolamento multi-tenant por `parish_id` e sanitização.
* **`verifier`**: Verificação estrita de compilação Next.js (`npm run build`), TypeScript e 0 warnings.
* **`critic`**: Análise adversarial: procura ativamente falhas, premissas frágeis e riscos não previstos.

### 4. 📋 Pod: Produto e Orquestração
* **`planner`**: Decomposição de metas épicas em planos de ação atômicos e cronológicos.
* **`analyst`**: Validação de requisitos de negócio, impacto no paroquiano e necessidades do clero.
* **`autopilot`**: Orquestração autônoma contínua: Planejamento ➔ Execução ➔ Crítica ➔ Verificação.

---

## 🎯 Exemplos Práticos de Combinações no Ecclesiam App

* **Nova Migration ou Modelagem SQL:**
  ```text
  /team architect,security-reviewer,executor "Criar tabela pastoral_appointments com RLS multi-tenant"
  ```
* **Nova Interface de Usuário (Design System):**
  ```text
  /team designer,executor,critic "Criar modal de agendamento paroquial com paleta Pe. Alex Nogueira"
  ```
* **Refatoração Anti-Monólito (>350 linhas):**
  ```text
  /team code-simplifier,executor,verifier "Refatorar GalleryFormModal extraindo componentes e hooks"
  ```
* **Resolução Rápida com Autopilot:**
  ```text
  /autopilot "Corrigir erro de tipagem no ScheduleItem e rodar npm run build"
  ```

---

## 📝 Como Acionar este Protocolo
Para ativar este protocolo no início de qualquer sessão, envie a mensagem:
> *"Executar o protocolo start"* ou simplesmente *"protocolo start"*
