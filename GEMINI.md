# 🏛️ Regras e Diretrizes do Projeto: Ecclesiam App & Catedral de Colatina

## 📌 Diretriz Mandatória de Sincronização Local (Regra Permanente)

A partir de 01/10/2026, por determinação expressa do usuário:

1. **Sincronização Bidirecional Obrigatória:**
   Todo e qualquer estudo, pesquisa, especificação técnica, roteiro, escopo, planejamento, documento de precificação ou arquivo criado ou modificado neste projeto DEVE obrigatoriamente ter uma cópia atualizada no repositório local oficial:
   * **Caminho Local Oficial:** `C:\Users\Start\ecclesiam-app\[documentation]\`
   * **Subpasta de Planejamento:** `C:\Users\Start\ecclesiam-app\[documentation]\planejamento\`
   * **Pasta Raiz do Projeto Local:** `C:\Users\Start\ecclesiam-app\`
   * **Pasta de Trabalho do Google Drive:** `g:\Meu Drive\TRABALHOS\01 - NEGÓCIOS E PROJETOS ATIVOS\ECCLESIAN APP\AGENTE DE IA - ECCLESIAM\`

2. **Projetos e Módulos Abrangidos:**
   * **Ecclesiam App (EA):** Plataforma SaaS Multi-Paróquia (Front-end Next.js, Back-end Supabase, PWA, Mobile, precificação, roadmap e arquitetura).
   * **Catedral de Colatina (Paróquia Piloto):** Apresentações, propostas visuais, identidade, roteiro da reunião com Pe. Irineu e materiais pastorais.

3. **Comportamento do Agente:**
   * Sempre que um arquivo `.md`, `.html`, `.json`, `.png` ou código documental for criado ou editado no Google Drive, o agente deve sincronizá-lo imediatamente em `C:\Users\Start\ecclesiam-app\[documentation]\`.
   * Nunca deixar estudos ou documentações isolados em apenas um dos diretórios.

## ⏱️ Diretriz Mandatória: Estimativa de Tempo de Execução em Toda Task Sugerida
Por determinação expressa do desenvolvedor (22/10/2026):
- **TODA E QUALQUER TAREFA, TASK OU ETAPA SUGERIDA PELA IA DEVE OBRIGATORIAMENTE VIR ACOMPANHADA DO SEU TEMPO ESTIMADO DE EXECUÇÃO** (ex: `⏱️ Tempo Estimado: ~30 a 45 minutos`).
- O objetivo é dar previsibilidade ao desenvolvedor para que ele possa decidir se autoriza a execução imediata ou se posterga conforme o tempo que possui disponível na sessão de trabalho.
- Nenhuma task deve ser recomendada sem a indicação clara de tempo e a pergunta de validação: *"Você aprova a execução desta tarefa com base nesta estimativa de tempo?"*

## ⛪ Diretriz Mandatória: Precisão Litúrgica Católica (Altar, Presbitério e Púlpito)
Por determinação expressa do desenvolvedor (24/10/2026):
- **Altar:** É a mesa sagrada do sacrifício de Cristo situada no Presbitério. Sobre o Altar consagram-se unicamente o Corpo e Sangue de Cristo (Eucaristia). Folhas de papel, avisos ou listas de intenções **NUNCA** devem ser associadas a leituras ou impressos no Altar.
- **Presbitério:** Espaço sagrado elevado ("palco") onde ficam o Altar, a Sede dos ministros e o Púlpito/Ambão.
- **Púlpito (ou Ambão):** Lugar litúrgico próprio onde se proclama a Palavra de Deus, onde são lidas as **intenções da Santa Missa (antes da celebração)** e os **avisos paroquiais (após a Santa Missa / pós-comunhão)**.
- **Nomenclatura Canônica Obrigatória:** A IA está proibida de usar "Intenções no Altar" ou "Folha de Altar". Use sempre:
  - **"Intenções de Missa (Púlpito A4)"** ou **"Folha Litúrgica para o Púlpito (A4)"**
  - **"Proclamada no Púlpito"** ou **"Apresentada nas Intenções da Santa Missa"**
  - **"Sigilo no Púlpito"** (para intenções anônimas)

## ⛪ Diretriz Mandatória: Auditoria de Terminologia Canônica (Capela ➔ Comunidade, Matriz ➔ Catedral)
Por determinação expressa do desenvolvedor (28/10/2026):
- **{Capela} / {Capelas}:** Substituir sempre por **"Comunidade"** ou **"Comunidades Eclesiais de Base (CEBs)"**.
- **{Matriz} / {Igreja Matriz}:** Substituir sempre por **"Catedral"** ou **"Catedral Diocesana"** (Sede).
- **Skill Oficial Mandatória:** `canonical_terminology_auditor` (`.agents/skills/canonical_terminology_auditor/`).
- **Automação no Protocolo Deploy:** O script `node .agents/skills/canonical_terminology_auditor/scripts/audit_terminology.js --fix` roda automaticamente antes de qualquer build e git push.
- **Preservação Histórica e Técnica:** Marcos de fundação histórica (1928–1990) e variáveis técnicas de código (`variant="matriz"`, `is_headquarters`, etc.) são preservados.

## 💰 Diretriz Mandatória: Delimitação de Escopo com o THEOS (Proibição de Captação e Controle Contábil do Dízimo)
Por determinação expressa do desenvolvedor (28/10/2026):
- **O THEOS é o ERP Eclesial Oficial:** O controle contábil canônico, balanços, relatórios de arrecadação do dízimo, carnês, numeração de dizimistas e controle de caixa são executados EXCLUSIVAMENTE pelo sistema **THEOS**.
- **O Ecclesiam App NÃO faz captação nem controle do dízimo cadastrado:** O app opera estritamente no campo **pastoral, litúrgico, informativo e catequético** (dimensões bíblicas do dízimo, transparência visual de obras e divulgação da chave PIX oficial da paróquia).
- **Proibição de Cards e Dashboards Financeiros:** É terminantemente proibido exibir cards ou métricas com valores arrecadados (ex: 'DÍZIMO / PIX (MÊS) R$ 8.420,00') no dashboard do Ecclesiam App. No lugar de métricas financeiras, o dashboard deve exibir métricas estritamente pastorais e de atendimento (ex: 'Secretaria & Intenções', 'Rede Paroquial', 'Missas Semanais', 'Avisos e Notícias').

