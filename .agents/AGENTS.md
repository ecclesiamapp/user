# Regras de Customização do Ecclesiam App

## Regra de Ouro do White-Label (Invisibilidade da Marca)
A marca "Ecclesiam" **NUNCA** deve aparecer em destaque para o usuário final (o fiel/paroquiano).
- Toda a interface do portal público (`/` e sub-rotas do fiel) deve exibir unicamente o nome, brasão, logotipo e cores configuradas da paróquia.
- A marca Ecclesiam existe exclusivamente nos bastidores administrativos da infraestrutura.

## Regra de Padding para Menus Dropdown (Selects)
Ao criar ou modificar elementos HTML `<select>` estilizados com Tailwind CSS, **SEMPRE** garanta um padding maior à direita para evitar que o ícone de seta nativo do navegador fique colado ou sobreponha o texto.

- **NÃO FAÇA:** Usar paddings simétricos horizontais como `px-3` ou `px-4`, e deixar o `<select>` sem `appearance-none` (o Safari ignora o padding).
- **FAÇA:** Adicione a classe `.dash-select` (definida em `globals.css`) que já aplica `appearance-none`, a setinha SVG customizada e o `padding-right` de 2.5rem (`pr-10`). Use apenas o padding esquerdo (`pl-3` ou `pl-4`).
- **Exemplo Incorreto:** `className="rounded-lg border px-3 py-1.5"`
- **Exemplo Correto:** `className="dash-select rounded-xl border pl-3.5 pr-10 py-2"`

## Protocolo Deploy (Build, Commit & Push)
Sempre que o usuário requisitar a execução do comando **"deploy"** ou **"Protocolo Deploy"** para salvar as alterações, certifique-se OBRIGATORIAMENTE de compilar o projeto e validar as integrações antes de fazer o commit/push:
1. **Validar (Build):** Execute `npm run build` ou `npx tsc --noEmit` localmente.
2. **Corrigir:** Se a compilação acusar algum erro de tipagem (`Type error`), corrija o código imediatamente e rode o build novamente até passar sem falhas.
3. **Auditoria de Integrações Cloud (Vercel & Supabase):** Execute `node .agents/skills/vercel/scripts/check_pre_push.js`. Garanta que todos os projetos Supabase vinculados à integração da Vercel (ex: `supabase-lime-queen` ou o projeto oficial) estejam em estado `ACTIVE_HEALTHY`. Projetos no plano gratuito que entram em pausa (`INACTIVE`/`PAUSED`) abortam o deploy na Vercel no primeiro segundo com erro `Resource provisioning failed`. Se algum projeto estiver inativo, reative-o imediatamente via MCP `restore_project` antes do push.
4. **Commit:** Após o sucesso, faça o staging (`git add .`) e o commit (`git commit -m "..."`).
5. **Push:** Envie as alterações para o repositório remoto (`git push`).

## Protocolo de Lançamento em Produção / Go-Live de Segurança (Gatilhos de Deploy)
Sempre que o usuário utilizar frases de gatilho para colocar o app no ar (como **"Vamos colocar no ar"**, **"Vamos migrar para o local online definitivo"**, **"Deploy em produção"**, **"Subir projeto"**), a IA está EXPRESSAMENTE PROIBIDA de concluir o deploy sem antes executar a checklist do **Protocolo de Segurança Pré-Lançamento**:
1. **Auditoria de RLS (Supabase):** Validar que todas as tabelas possuem Row Level Security ativado com isolamento por paróquia (`parish_id`).
2. **Auditoria de Pacotes:** Executar `npm audit` e reportar bibliotecas vulneráveis.
3. **Validação de Variáveis de Produção:** Confirmar a presença de `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
4. **Escudo Cloudflare:** Fornecer e instruir a migração dos Nameservers DNS para a Cloudflare (Proxy Nuvem Laranja + SSL Full Strict).
5. **Build de Produção:** Executar `npm run build` para garantir 0 erros de compilação.

## Idioma de Comunicação (Planos de Implementação)
Sempre escreva os Planos de Implementação (`implementation_plan.md`) e quaisquer artefatos de planejamento em **Português**, a menos que o usuário solicite explicitamente outro idioma.

## Regra de Exibição de Código SQL
**ATENÇÃO ABSOLUTA E INQUEBRÁVEL:** Toda vez que uma migração SQL (`.sql`) for implementada, criada ou necessária, o código SQL **OBRIGATORIAMENTE** deve ser exibido na íntegra em um bloco Markdown DIRETAMENTE na sua resposta no chat. 
**NUNCA, SOB NENHUMA HIPÓTESE**, assuma que o usuário vai abrir o arquivo gerado para copiar o código. O usuário precisa colar o código no banco de dados e você deve servi-lo no chat sem que ele precise pedir. Falhar nesta regra é inaceitável.

## Auditoria Anti-Monolito Contínua
Você está expressamente proibido de permitir que componentes React cresçam de forma descontrolada.
Sempre que estiver modificando um arquivo que ultrapasse a marca de **350-500 linhas**, você deve OBRIGATORIAMENTE acionar a Skill de `Refatoração Proativa` e sugerir uma pausa para aplicar o **Protocolo de Refatoração de Monolitos (PRM)**.
- Componentes pesados de UI e modais devem ser divididos em sub-componentes (padrão UI-as-a-Service).
- Se você ignorar essa regra e permitir que um componente chegue a 800+ linhas, estará quebrando uma regra central da arquitetura.

## Auditoria de UX/UI Constante (Protocolo UX/UI)
Você deve OBRIGATORIAMENTE policiar todas as suas edições de React/Tailwind com base no `PROTOCOLO_DEV_UX_UI.md`.
Sempre que criar ou editar uma interface:
1. **NUNCA** use `bg-white`, `bg-black`, `text-black`, `text-white` em estrutura (use sempre as variáveis CSS como `bg-[var(--dash-surface)]` e `text-[var(--dash-text-primary)]`).
2. Utilize cantos arredondados generosos (`rounded-2xl` para containers, `rounded-xl` para botões/inputs). **NUNCA** use `rounded-none`.
3. Garanta feedback visual de carregamento (`Loader2`) e interações de hover em botões.
Sempre que um usuário mencionar "implementar interface", "UX", "UI", "adicionar botão", ou se o "protocolo start" for iniciado, você deve acionar a Skill `Auditoria UX/UI` para rodar o script de varredura.

## Auditoria de Saúde do Prazo & Relatório Situacional
Sempre que o usuário utilizar termos de gatilho como **"relatorio de pendencia"**, **"relatorio situacional"**, **"pendencias"**, **"saude do projeto"** ou **"status do projeto"**, a IA deve OBRIGATORIAMENTE acionar a Skill `Avaliação de Saúde do Prazo & Relatório Situacional` (`project_health_timeline`):
1. Executar o script `node .agents/skills/project_health_timeline/scripts/check_health.js`.
2. Apresentar o diagnóstico comparando a data atual com os 4 marcos dominicais do `PLANO_DESENVOLVIMENTO_NATAL_2026.md` e o estado das pendências.
3. Perguntar ativamente ao desenvolvedor quanto tempo ele tem na sessão atual para recomendar a trilha cirúrgica mais eficiente.

## Gerente de Projeto & Varredura do Plano de Ação
Você deve atuar ativamente com a Skill `Gerente de Projeto (Project Manager)` (`project_manager`):
1. **No Protocolo Start:** OBRIGATORIAMENTE executar a **Etapa 4** rodando `node .agents/skills/project_manager/scripts/scan_plan.js` para varrer o `PLANO_DE_ACAO_DETALHADO.md` e entregar o Card Executivo da próxima tarefa. Em seguida, executar a **Etapa 5** perguntando se o desenvolvedor deseja convocar o Squad Multi-Agente (`/team` ou `/autopilot`) para a tarefa.
2. **A Cada Etapa Concluída:** Ao finalizar qualquer entrega de código (ou quando o usuário perguntar "próximo passo", "etapa concluída", "o que vem agora?"), marcar a tarefa como concluída (`--complete <TASK-ID>`) e apresentar o Card Executivo do próximo passo com justificativa, arquivos envolvidos e tempo estimado.

## Squad Multi-Agente Sob Demanda (multi_agent_team)
Sempre que o usuário utilizar comandos ou termos de convocação multi-agente, a IA deve OBRIGATORIAMENTE acionar a Skill `multi_agent_team`:
1. **Comandos Reconhecidos:**
   - `/team <papeis> "<tarefa>"` ou `convocar time de <papeis>` ➔ executa `node .agents/skills/multi_agent_team/scripts/dispatch_team.js --team <papeis> "<tarefa>"`.
   - `/autopilot "<tarefa>"` ou `modo autopilot` ➔ executa `node .agents/skills/multi_agent_team/scripts/dispatch_team.js --autopilot "<tarefa>"`.
   - `/especialista <papel>` ou `chamar especialista <papel>` ➔ aciona a persona de especialista solicitada.
   - `listar especialistas` ou `/team --list` ➔ executa `node .agents/skills/multi_agent_team/scripts/dispatch_team.js --list`.
2. **Operação das Personas:** Após o disparo da squad, o agente deve incorporar ativamente os pontos de vista e o rigor dos papéis convocados durante a análise, codificação e verificação.

## Diretriz Mandatória: Mobile-First Extremo & Hiper-Desempenho (Low-End Devices)
O portal público do Ecclesiam App será acessado majoritariamente (> 85%) por smartphones, muitos deles aparelhos de entrada ou modelos antigos pertencentes a paroquianos e fiéis idosos. Por determinação expressa do desenvolvedor:
1. **Diagramação e CSS Mobile-First:** Todo componente, tela, menu e formulário DEVE ser projetado prioritariamente para telas verticais pequenas (`360px` a `414px`) e apenas expandido progressivamente para desktop.
   - Alvos de toque (*touch targets*) mínimos de `44px x 44px` ou `min-h-[44px]` em todos os botões e links clicáveis.
   - Textos confortáveis para fiéis de qualquer faixa etária (nunca abaixo de 14px em corpo e 12px em legendas).
   - Zero vazamento ou rolagem horizontal acidental (`overflow-x-hidden`).
2. **Hiper-Desempenho e Leveza para Aparelhos Antigos (Low-End Devices):**
   - Evitar processamento excessivo de JavaScript no cliente e bibliotecas de animação desnecessárias (usar transições CSS nativas com aceleração por hardware).
   - Mídias compactadas: imagens sempre em `.webp`, com carregamento preguiçoso (`loading="lazy"`).
   - Vídeos e iframes: Carregamento sob demanda (*lazy/on-demand*); no mobile, nunca travar a renderização com loops pesados de alta resolução quando a conexão 3G/4G ou CPU do aparelho for modesta.
   - Árvore DOM enxuta e pré-renderização estática prioritária.

## Sugestão Proativa de Auditoria Visual Humana (Pausa para Inspeção do Dev)
Sempre que uma nova tela, subpágina pública ou componente de interface significativo for criado ou refatorado, a IA deve sugerir ativamente uma **Auditoria Visual Humana** ao desenvolvedor:
1. Fornecer o link local direto e clicável (ex: `http://localhost:3000/...`).
2. Entregar uma micro-checklist rápida com 3 a 4 pontos-chave para o dev inspecionar no navegador (ex: diagramação em 375px/mobile, harmonia das cores catedral, contraste Dark Mode e alvos de clique).
3. Perguntar expressamente se o dev aprova o resultado visual ou se prefere realizar algum polimento estético antes de saltar para a próxima tarefa de código.

## Nomenclatura Litúrgica Católica Obrigatória (Proibição do Termo "Culto")
No catolicismo romano, **NUNCA** se utiliza a palavra "culto" para designar os encontros de oração e celebrações comunitárias. 
- **Termos Canônicos Oficiais:** **"Santa Missa"** (ou "Missas") e **"Celebração da Palavra"** (ou "Celebrações").
- A IA está expressamente proibida de usar a palavra "culto" ou "cultos" em qualquer título, menu, card, formulário ou documentação do Ecclesiam App.




