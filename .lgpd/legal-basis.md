# Bases Legais por Atividade de Tratamento — Ecclesiam App

**Projeto**: Ecclesiam App (Paróquia Piloto Catedral de Colatina)  
**Versão**: v1.0  
**Data**: 23/10/2026  
**Enquadramento Normativo**: Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), Estatuto da Criança e do Adolescente Digital (Lei nº 15.211/2025) e Resoluções da ANPD  

---

## 🗂️ Matriz Resumida de Bases Legais

| Atividade | Hipótese Legal Principal | Artigo da LGPD / Norma | Requer LIA? | Requer Consentimento? |
| :--- | :--- | :---: | :---: | :---: |
| **A001 — Atendimentos Pastorais e Confissões** | Exercício regular de atividades por organização religiosa | **Art. 11, II, "d"** c/c **Art. 7º, V** | Proibido (dado sensível) | Não (procedimento a pedido do fiel) |
| **A002 — Inscrições Sacramentais & Catequese** | Proteção da Infância & Exercício Eclesial | **Art. 14** c/c **Art. 11, II, "d"** e **Lei 15.211/2025** | Não | **SIM** (consentimento parental destacado) |
| **A003 — Pastoral do Dízimo ("Sou do Sagrado")** | Legítimo Interesse & Procedimentos do Fiel | **Art. 7º, IX** c/c **Art. 7º, V** | **SIM** ([Ver LIA](./lia/lia-a003-dizimo.md)) | Opcional (comunicação ativa) |
| **A004 — Lideranças Comunitárias & CPC** | Consentimento de Divulgação Institucional | **Art. 7º, I** (ou **Art. 7º, IX**) | Opcional | **SIM** (termo de anuência de contato) |
| **A005 — Inteligência Artificial Paroquial (RAG)** | Legítimo Interesse da Gestão Institucional | **Art. 7º, IX** | Mitigado | Não |
| **A006 — Mensageria & Notificações** | Execução de Procedimentos a Pedido do Titular | **Art. 7º, V** c/c **Art. 7º, IX** | Dispensado | Não |
| **A007 — Autenticação Administrativa (`/admin`)** | Segurança da Informação & Proteção a Fraudes | **Art. 11, II, "g"** c/c **Art. 7º, V** | Dispensado | Não |

---

## 📖 Detalhamento das Bases Legais por Atividade

### Atividade A001 — Agendamento de Atendimentos Pastorais e Confissões

* **Finalidade (Art. 6º, I)**: Organização da agenda pastoral dos sacerdotes para ministração de sacramentos (Confissão), aconselhamento espiritual e bênçãos, com comunicação prévia de data/hora ao solicitante.
* **Dados Pessoais Tratados**: Nome do paroquiano, telefone celular/WhatsApp, e-mail (opcional), comunidade e anotações pastorais (`notes`, `internal_notes`).
* **Dados Sensíveis (Art. 5º, II)**: **SIM** (Convicção religiosa e manifestações de foro íntimo ligadas ao sacramento da Penitência).
* **Base Legal Primária**: **Artigo 11, Inciso II, alínea "d" da LGPD**:
  > *"Tratamento indispensável para a realização de políticas públicas ou exercício regular de direitos, inclusive em contrato e em processo judicial, bem como para o cumprimento de obrigações decorrentes de disposições canônicas ou regulamentares aplicáveis a organizações religiosas sem fins lucrativos."*
* **Base Legal Concorrente**: **Artigo 7º, Inciso V da LGPD** (execução de procedimentos prévios a pedido expresso do titular ao agendar o horário).
* **Justificativa**: A confissão e o atendimento pastoral são o cerne da missão espiritual da Igreja Católica. A utilização do Art. 11, II, "d" ampara canonicamente a paróquia sem necessidade de consentimento frágil (que poderia ser revogado a qualquer momento). O legítimo interesse é expressamente proibido para dados sensíveis.
* **Salvaguardas de Sigilo Canônico**: Segredo inviolável da confissão sacramental (Cânon 983 do Código de Direito Canônico), protegido pela Constituição Federal (Art. 5º, XIV — sigilo profissional e ministerial).
* **Retenção & Descarte**: 90 dias para as anotações pastorais subjetivas; após este prazo, limpeza automática das notas com preservação de registros agregados apenas para controle quantitativo de atendimento da cúria.
* **Possibilidade de Revogação**: O titular pode cancelar o agendamento antes de sua ocorrência; após a realização, o registro de notas espirituais pode ser expurgado a pedido do titular (Art. 18, VI).

---

### Atividade A002 — Inscrições Sacramentais e Catequese Comunitária

* **Finalidade (Art. 6º, I)**: Triagem preparatória, controle de frequência e registro canônico para recepção dos sacramentos da iniciação cristã (Batismo, Primeira Comunhão, Crisma e Matrimônio).
* **Dados Pessoais Tratados**: Nome do responsável, contato, nome do menor/candidato, data de nascimento, filiação e documentos anexos (certidões de nascimento, comprovantes).
* **Dados Sensíveis & Menores**: **SIM** (Dado sensível de convicção religiosa + **crianças e adolescentes menores de 18 anos**).
* **Base Legal Primária**: **Artigo 14, caput e § 1º da LGPD**:
  > *"O tratamento de dados pessoais de crianças e de adolescentes deverá ser realizado em seu melhor interesse (...) com o consentimento específico e em destaque dado por pelo menos um dos pais ou pelo responsável legal."*
* **Base Legal Específica para Menores**: **Lei nº 15.211/2025 (ECA Digital)**:
  * Vedação absoluta de perfilamento comportamental, marketing direcionado ou uso comercial de dados de catequizandos.
  * Preservação da intimidade e dignidade do menor na coleta de dados biográficos.
* **Base Legal Institucional**: **Artigo 11, Inciso II, alínea "d" da LGPD** (exercício legítimo de ritos confessionais pela Igreja Católica).
* **Justificativa**: O ordenamento jurídico brasileiro exige consentimento parental qualificado para tratamento de dados infantis. Como a catequese prepara crianças para a Primeira Eucaristia, a paróquia atua no melhor interesse educacional e moral do menor com autorização dos pais.
* **Retenção & Descarte**: Documentos anexados em formato digital (certidões no Supabase Storage) serão eliminados em até 180 dias após a celebração litúrgica; o registro do sacramento é arquivado de modo perpétuo no Livro de Tombo Físico da Paróquia (exigência histórica do Direito Canônico).
* **Possibilidade de Revogação**: Revogação de comunicações digitais a qualquer tempo; eliminação de arquivos digitais após a celebração.

---

### Atividade A003 — Cadastro e Adesão à Pastoral do Dízimo ("Sou do Sagrado")

* **Finalidade (Art. 6º, I)**: Gestão das contribuições de manutenção paroquial, envio de carnês, direcionamento de chaves Pix e comunicação pastoral de prestação de contas.
* **Dados Pessoais Tratados**: Nome completo, telefone, e-mail, data de nascimento, endereço residencial e preferência de pagamento.
* **Dados Sensíveis?**: Não sensíveis de forma direta (dados cadastrais comuns com vínculo devocional).
* **Base Legal Primária**: **Artigo 7º, Inciso IX da LGPD** (Legítimo Interesse da organização religiosa na promoção de suas atividades institucionais e sustentação do templo).
* **Base Legal Subsidiária**: **Artigo 7º, Inciso V da LGPD** (cumprimento de procedimentos solicitados pelo fiel ao aderir à campanha pastoral).
* **Documento de LIA Obrigatório**: Formalizado em [`.lgpd/lia/lia-a003-dizimo.md`](file:///c:/Users/Start/ecclesiam-app/.lgpd/lia/lia-a003-dizimo.md).
* **Justificativa**: O fiel que se cadastra como dizimista possui expectativa razoável de manter relacionamento com sua paróquia. O legítimo interesse permite a manutenção do cadastro sem a rigidez de renovações periódicas de consentimento, assegurando pleno direito de oposição (opt-out).
* **Retenção**: Vigência do vínculo comunitário + 5 anos após a última doação (prazo de prescrição tributária de imunidade de templos religiosos — Art. 16, I da LGPD).
* **Possibilidade de Revogação**: Sim. O fiel pode exercer seu direito de oposição (opt-out) a qualquer momento na secretaria.

---

### Atividade A004 — Divulgação de Lideranças Comunitárias e CPC

* **Finalidade (Art. 6º, I)**: Divulgação pública de canais de contato dos membros eleitos do Conselho Pastoral Comunitário nas páginas das 12 CEBs.
* **Dados Pessoais Tratados**: Nome e link de WhatsApp funcional/pessoal da liderança.
* **Dados Sensíveis?**: Não.
* **Base Legal Primária**: **Artigo 7º, Inciso I da LGPD** (Consentimento expresso do leigo ao assumir o múnus pastoral) ou **Artigo 7º, Inciso IX** (Legítimo interesse com número institucional/comunitário).
* **Justificativa**: A divulgação pública de telefones pessoais na internet pode expor o leigo a ligações inoportunas ou golpes. A base mais segura é o **Termo de Anuência e Consentimento Específico** colhido no ato da posse do CPC.
* **Retenção**: Limitada ao período do mandato do CPC (2 a 3 anos).
* **Possibilidade de Revogação**: A qualquer tempo, mediante solicitação do coordenador leigo.

---

### Atividade A005 — Inteligência Artificial Paroquial & Assistente RAG

* **Finalidade (Art. 6º, I)**: Indexação semântica e recuperação de informações institucionais para suporte a secretários e padres no painel administrativo `/admin/assistente-ia`.
* **Dados Pessoais Tratados**: Fragmentos textuais de documentos oficiais públicos da diocese e representações vetoriais numéricas.
* **Dados Sensíveis?**: Proibido o upload de documentos contendo dados pessoais de fiéis ou confissões.
* **Base Legal Primária**: **Artigo 7º, Inciso IX da LGPD** (Legítimo interesse do controlador na eficiência de sua governança interna).
* **Justificativa**: O assistente opera exclusivamente sobre material institucional previamente público (decretos, história, horários de celebração), não havendo tratamento invasivo de dados privados de indivíduos.
* **Retenção**: Permanente até a revogação ou atualização do documento institucional fonte.

---

### Atividade A006 — Mensageria Pastoral e Notificações Transacionais

* **Finalidade (Art. 6º, I)**: Disparo automatizado de e-mails transacionais informando status de agendamento pastoral e confirmações paroquiais.
* **Dados Pessoais Tratados**: Nome, e-mail, data e hora da celebração/atendimento.
* **Dados Sensíveis?**: Não.
* **Base Legal Primária**: **Artigo 7º, Inciso V da LGPD** (execução de procedimentos a pedido do titular) c/c **Artigo 7º, Inciso IX** (comunicação legítima indispensável ao serviço prestado).
* **Justificativa**: O envio de lembretes e confirmações atende ao interesse direto do fiel que solicitou o agendamento no portal.
* **Retenção**: 30 dias nos logs de mensageria da Resend.

---

### Atividade A007 — Gestão de Acessos Administrativos ao Painel (`/admin`)

* **Finalidade (Art. 6º, I)**: Autenticação de padres, secretários e coordenadores com perfil administrativo restrito.
* **Dados Pessoais Tratados**: E-mail, hash criptográfico de senha, logs de acesso e endereços IP.
* **Dados Sensíveis?**: Não.
* **Base Legal Primária**: **Artigo 11, Inciso II, alínea "g" da LGPD** (garantia da prevenção à fraude e à segurança do titular nos processos de identificação e autenticação de cadastro) c/c **Artigo 7º, Inciso V** (vínculo funcional eclesiástico ou contratual).
* **Justificativa**: A proteção de sistemas que guardam dados de fiéis é um dever de segurança imperativo imposto pelo Artigo 46 da LGPD. O controle de credenciais atende diretamente a esse dever legal e técnico.
* **Retenção**: Enquanto o usuário mantiver função administrativa ativa na paróquia.
