# Mapa de Dados (Data Mapping) — Ecclesiam App

**Projeto**: Ecclesiam App (Paróquia Piloto: Catedral de Colatina / Diocese de Colatina)  
**Versão**: v1.0  
**Data**: 23/10/2026  
**Owner Global**: Encarregado de Proteção de Dados (DPO) / Gestão Paroquial  
**Normas de Referência**: Lei nº 13.709/2018 (LGPD), Lei nº 15.211/2025 (ECA Digital) e Resoluções CD/ANPD nº 2/2022, 15/2024, 18/2024 e 19/2024  

---

## 🧭 Resumo do Inventário de Tratamento

* **Total de Atividades Mapeadas**: 7 atividades
* **Atividades com Dados Pessoais Sensíveis (Art. 5º, II e Art. 11)**: 2 atividades (`A001`, `A002`)
* **Atividades Envolvendo Menores de Idade (Art. 14 LGPD + ECA Digital)**: 1 atividade crítica (`A002`)
* **Atividades Classificadas como Alto Risco (Res. ANPD nº 2/2022)**: 2 atividades (`A001`, `A002` — exigem Relatório de Impacto à Proteção de Dados / RIPD)
* **Operadores e Fornecedores Terceiros com Transferência Internacional**: Supabase Inc. (EUA), Vercel Inc. (EUA), Resend Inc. (EUA), Google LLC (EUA)

---

## 🗂️ Atividades de Tratamento de Dados Pessoais

### A001 — Agendamento de Atendimentos Pastorais e Confissões

| Atributo | Especificação Técnica e Jurídica |
| :--- | :--- |
| **Identificador / Slug** | `a001-pastoral-appointments` |
| **Descrição** | Agendamento on-line de horários para Confissões, Direção Espiritual, Aconselhamento Pastoral e Bênçãos com os padres. |
| **Finalidade Específica (Art. 6º, I)** | Viabilizar a organização da agenda pastoral do clero e comunicação de data/horário com o fiel solicitante. |
| **Base Legal Sugerida** | Art. 11, II, alínea "d" da LGPD (tratamento de dados sensíveis no exercício regular de direitos por organização religiosa/sem fins lucrativos e com fins legítimos) c/c Art. 7º, V (execução de compromisso solene a pedido do titular). |
| **Categorias de Titulares** | Fiéis da paróquia (adultos, jovens e idosos). |
| **Dados Pessoais Sensíveis?** | **SIM** — Dados relativos à convicção religiosa e foro íntimo/espiritual (`appointment_type` = confissão, direção espiritual; relatos livres em `notes` e `internal_notes`). |
| **Categorias de Dados** | Nome completo (`parishioner_name`), celular/WhatsApp (`parishioner_phone`), e-mail (`parishioner_email`), comunidade de origem, data e horário do atendimento, notas descritivas. |
| **Origem / Fonte** | Coletado diretamente do titular via formulário web em `/secretaria` ou presencialmente na secretaria paroquial. |
| **Sistemas & Armazenamento** | Tabela `public.pastoral_appointments` (Supabase Postgres), função RPC `get_booked_appointment_slots`. |
| **Compartilhamento Externo** | Operador de banco de dados (Supabase Inc.) e operador de e-mail transacional (Resend Inc.). |
| **Transferência Internacional** | **Sim** — Servidores da AWS US-East-1 (Supabase) e Resend US. |
| **Política de Retenção** | 90 dias após a data do atendimento para as notas confidenciais e relatos descritivos; expurgo automático de detalhes íntimos mantendo apenas métricas anonimizadas para relatórios anuais da cúria. |
| **Medidas de Segurança** | Row Level Security (RLS) multi-tenant por paróquia, leitura restrita a membros autenticados, HTTPS/TLS 1.3, RPC sem vazamento de PII. |
| **Classificação de Alto Risco?** | **SIM** (Convicção religiosa + foro íntimo + escala paroquial). |
| **Necessidade de RIPD?** | **Sim** (RIPD `ripd-pastoral-appointments` obrigatório sob Art. 38 da LGPD). |
| **Owner** | Pároco e Secretaria Paroquial. |

---

### A002 — Inscrições Sacramentais e Catequese Comunitária

| Atributo | Especificação Técnica e Jurídica |
| :--- | :--- |
| **Identificador / Slug** | `a002-sacramental-registrations` |
| **Descrição** | Inscrição, triagem de requisitos e documentação para Batismo, Primeira Eucaristia, Crisma e Preparação Matrimonial. |
| **Finalidade Específica (Art. 6º, I)** | Registro e controle prévio para admissão aos sacramentos da Igreja Católica e preparação catequética. |
| **Base Legal Sugerida** | **Art. 14 da LGPD** (consentimento específico e em destaque dado por pelo menos um dos pais ou responsável legal, atendendo ao melhor interesse do menor) c/c Art. 11, II, "d" (atividades legítimas da Igreja Católica). |
| **Categorias de Titulares** | Pais/mães/responsáveis legais (adultos) e **crianças e adolescentes (menores de 18 anos)** candidatos aos sacramentos. |
| **ECA Digital (Lei nº 15.211/2025)** | **APLICÁVEL** — Exige verificação e declaração de representação parental, proibição de perfilamento comportamental e proteção reforçada de imagens e documentos dos menores. |
| **Dados Pessoais Sensíveis?** | **SIM** — Dados de convicção religiosa e recepção de sacramentos canônicos. |
| **Categorias de Dados** | Nome do responsável (`applicant_name`), contato (`applicant_phone`, `applicant_email`), grau de parentesco (`applicant_role`), nome da criança/candidato (`candidate_name`), data de nascimento do menor (`candidate_birth_date`), filiação e URLs de certidões/documentos (`documents_urls`). |
| **Origem / Fonte** | Coletado do pai, mãe ou responsável legal via formulário web `/secretaria` ou secretaria paroquial. |
| **Sistemas & Armazenamento** | Tabela `public.sacramental_registrations` (Postgres) e bucket de Storage privado do Supabase. |
| **Compartilhamento Externo** | Supabase Inc. (hospedagem e armazenamento seguro de documentos) e Resend Inc. |
| **Transferência Internacional** | **Sim** — AWS US (Supabase). |
| **Política de Retenção** | Documentos de identificação (certidões anexadas em PDF/imagem) descartados do Storage após 180 dias da emissão da lembrança/registro paroquial; assentamento do sacramento mantido de forma perpétua nos Livros de Tombo Físicos conforme o Código de Direito Canônico. |
| **Medidas de Segurança** | RLS estrito (somente equipe administrativa autenticada acessa dados e documentos anexos), criptografia AES-256 no Storage, TLS 1.3. |
| **Classificação de Alto Risco?** | **SIM** (Tratamento intensivo de dados de crianças/adolescentes com documentos pessoais sensíveis anexados). |
| **Necessidade de RIPD?** | **Sim** (RIPD `ripd-sacramental-minors` obrigatório sob Art. 38 da LGPD). |
| **Owner** | Coordenação Paroquial da Catequese e Secretaria Paroquial. |

---

### A003 — Cadastro e Adesão à Pastoral do Dízimo ("Sou do Sagrado")

| Atributo | Especificação Técnica e Jurídica |
| :--- | :--- |
| **Identificador / Slug** | `a003-tithe-registrations` |
| **Descrição** | Cadastro voluntário de fiéis dizimistas para envio de chave Pix, emissão de envelopes e registro de contribuição eclesial. |
| **Finalidade Específica (Art. 6º, I)** | Manutenção da vida litúrgica, caritativa e missionária da paróquia e das 12 comunidades conforme o preceito do dízimo. |
| **Base Legal Sugerida** | Art. 7º, IX da LGPD (Legítimo Interesse da entidade religiosa para gestão de sua comunidade de fé e manutenção do templo) c/c Art. 7º, V (execução de compromisso associativo a pedido do fiel). |
| **Categorias de Titulares** | Fiéis dizimistas adultos e idosos. |
| **Dados Pessoais Sensíveis?** | Não diretamente, mas infere convicção religiosa e compromisso comunitário católico. |
| **Categorias de Dados** | Nome completo (`full_name`), telefone celular (`phone`), e-mail (`email`), data de nascimento (`birth_date`), endereço residencial completo (`address`, `neighborhood`), método de pagamento preferencial (`preferred_payment_method`), dia de devolução (`preferred_day`). |
| **Origem / Fonte** | Coletado do próprio titular no portal `/dizimo` ou em fichas físicas recolhidas nas celebrações. |
| **Sistemas & Armazenamento** | Tabela `public.tithe_registrations` (Supabase Postgres) e sincronização com ERP paroquial. |
| **Compartilhamento Externo** | Theos Sistemas Paroquiais (sistema ERP eclesial da Diocese de Colatina) e Supabase Inc. |
| **Transferência Internacional** | **Sim** — Supabase Inc. (AWS US). |
| **Política de Retenção** | Durante o período de vínculo ativo como dizimista; 5 anos após a última contribuição registrada para conformidade fiscal/tributária de entidades confessionais imunes (Art. 16, I da LGPD). |
| **Medidas de Segurança** | RLS com inserção pública e leitura restrita aos agentes da Pastoral do Dízimo autenticados. |
| **Classificação de Alto Risco?** | **Não** (cadastro cadastral padrão para fins institucionais). |
| **Necessidade de RIPD?** | N/A |
| **Owner** | Coordenação da Pastoral do Dízimo e Tesouraria Paroquial. |

---

### A004 — Divulgação de Lideranças Comunitárias e Conselhos (CPC)

| Atributo | Especificação Técnica e Jurídica |
| :--- | :--- |
| **Identificador / Slug** | `a004-community-leaders` |
| **Descrição** | Exibição pública dos nomes de coordenadores e contatos do CPC nas páginas das 12 comunidades rurais e urbanas. |
| **Finalidade Específica (Art. 6º, I)** | Facilitar o contato direto dos moradores dos bairros e localidades com os responsáveis pela comunidade local. |
| **Base Legal Sugerida** | Art. 7º, I da LGPD (Consentimento formal e prévio da liderança leiga para divulgação institucional de contato) ou Art. 7º, IX (Legítimo Interesse com número corporativo/pastoral). |
| **Categorias de Titulares** | Coordenadores e lideranças leigas das CEBs (adultos). |
| **Dados Pessoais Sensíveis?** | Não. |
| **Categorias de Dados** | Nome da liderança, função no conselho (Coordenador, Vice, Liturgia, Dízimo, Obras), telefone/WhatsApp de contato. |
| **Origem / Fonte** | Informado formalmente pela coordenação comunitária na eleição do CPC. |
| **Sistemas & Armazenamento** | Tabela `public.communities` (Supabase Postgres), mini-sites `/comunidades/[slug]`. |
| **Compartilhamento Externo** | Vercel Inc. (portal público) e Meta Platforms Inc. (API de redirecionamento `wa.me`). |
| **Transferência Internacional** | Sim — Vercel Edge / Meta. |
| **Política de Retenção** | Vinculada à vigência do mandato comunitário (típico de 2 a 3 anos); atualização ou remoção imediata após a troca de gestão. |
| **Medidas de Segurança** | Controle de edição restrito aos coordenadores e secretários logados no `/admin`. |
| **Classificação de Alto Risco?** | **Não**. |
| **Necessidade de RIPD?** | N/A |
| **Owner** | Coordenação Paroquial das Comunidades e PASCOM. |

---

### A005 — Inteligência Artificial Paroquial & Assistente RAG

| Atributo | Especificação Técnica e Jurídica |
| :--- | :--- |
| **Identificador / Slug** | `a005-ai-assistant-rag` |
| **Descrição** | Busca semântica e assistente conversacional no `/admin/assistente-ia` baseado no acervo documental da paróquia. |
| **Finalidade Específica (Art. 6º, I)** | Auxiliar o clero e secretários na localização ágil de diretrizes canônicas, decretos e redação de avisos litúrgicos. |
| **Base Legal Sugerida** | Art. 7º, IX da LGPD (Legítimo Interesse da entidade na modernização e eficiência de suas operações pastorais). |
| **Categorias de Titulares** | Clérigos, autoridades e paroquianos citados em documentos institucionais públicos ou históricos da diocese. |
| **Dados Pessoais Sensíveis?** | Apenas dados institucionais e eclesiais presentes nas diretrizes da cúria (proibido o upload de fichas de fiéis ou confissões). |
| **Categorias de Dados** | Trechos textuais de PDFs paroquiais e representações vetoriais (embeddings numéricos com 768 dimensões). |
| **Origem / Fonte** | Upload exclusivo de administradores paroquiais no painel de controle. |
| **Sistemas & Armazenamento** | Tabelas `public.parish_knowledge_documents` e `parish_knowledge_embeddings` (Supabase Postgres com `pgvector`). |
| **Compartilhamento Externo** | Google LLC (Google Cloud / Gemini API para geração de embeddings e inferência). |
| **Transferência Internacional** | **Sim** — Google Cloud US. |
| **Política de Retenção** | Permanente enquanto o documento diocesano for vigente; deleção sincronizada em cascata quando o documento for excluído no `/admin`. |
| **Medidas de Segurança** | Proteção estrita por RLS via `parish_id`, isolamento dos prompts com proibição canônica de alucinações e garantia contratual de não-treinamento de modelos públicos. |
| **Classificação de Alto Risco?** | **Médio** (uso de IA generativa sobre acervo institucional, mas restrita a ambiente administrativo logado). |
| **Necessidade de RIPD?** | N/A (mitigado pelo isolamento técnico e ausência de dados pessoais de fiéis na base vetorial). |
| **Owner** | Administrador de TI e Pároco. |

---

### A006 — Mensageria Pastoral e Notificações Transacionais

| Atributo | Especificação Técnica e Jurídica |
| :--- | :--- |
| **Identificador / Slug** | `a006-pastoral-notifications` |
| **Descrição** | Disparo de mensagens transacionais por e-mail informando confirmações de agendamentos e status de sacramentos. |
| **Finalidade Específica (Art. 6º, I)** | Manter o fiel informado sobre o andamento de sua solicitação na secretaria paroquial. |
| **Base Legal Sugerida** | Art. 7º, V da LGPD (execução de procedimentos a pedido do titular) c/c Art. 7º, IX (legítimo interesse na comunicação pastoral). |
| **Categorias de Titulares** | Fiéis solicitantes de agendamentos e sacramentos. |
| **Dados Pessoais Sensíveis?** | Não (o corpo do e-mail não detalha motivos espirituais de confissão, apenas data, local e horário). |
| **Categorias de Dados** | Nome do destinatário, endereço de e-mail, data, hora e tipo de evento. |
| **Origem / Fonte** | Extraído das tabelas de agendamentos e inscrições sacramentais. |
| **Sistemas & Armazenamento** | Rota Next.js `/api/notifications`, Resend Dashboard e logs de tráfego. |
| **Compartilhamento Externo** | Resend Inc. (provedor de infraestrutura de e-mails). |
| **Transferência Internacional** | **Sim** — Servidores da Resend nos Estados Unidos. |
| **Política de Retenção** | Histórico de entrega e status de envio retido por 30 dias na plataforma Resend. |
| **Medidas de Segurança** | Autenticação via chaves de API secretas (`RESEND_API_KEY`) trafegando exclusivamente em backend Serverless seguro, sem exposição no cliente. |
| **Classificação de Alto Risco?** | **Não**. |
| **Necessidade de RIPD?** | N/A |
| **Owner** | Secretaria Paroquial e PASCOM. |

---

### A007 — Gestão de Acessos Administrativos ao Painel (`/admin`)

| Atributo | Especificação Técnica e Jurídica |
| :--- | :--- |
| **Identificador / Slug** | `a007-admin-authentication` |
| **Descrição** | Autenticação, emissão de tokens de sessão e controle de permissões de acesso ao painel de controle do Ecclesiam App. |
| **Finalidade Específica (Art. 6º, I)** | Garantir a segurança, autenticidade e inviolabilidade dos dados administrativos da paróquia. |
| **Base Legal Sugerida** | Art. 7º, V da LGPD (cumprimento de dever funcional/colaboração institucional) c/c Art. 7º, IX (segurança da informação e prevenção a fraudes - Art. 11, II, "g"). |
| **Categorias de Titulares** | Clérigos (pároco, vigários), funcionários da secretaria e coordenadores pastorais habilitados. |
| **Dados Pessoais Sensíveis?** | Não. |
| **Categorias de Dados** | E-mail de login, hash criptográfico de senha (gerenciado por algoritmo resistente Argon2id), endereço IP de acesso, data/hora do login. |
| **Origem / Fonte** | Cadastro inicial realizado pelo Administrador Geral do Ecclesiam App. |
| **Sistemas & Armazenamento** | Esquema interno `auth.users` do Supabase, cookies seguros `sb-access-token` via `@supabase/ssr`. |
| **Compartilhamento Externo** | Supabase Inc. |
| **Transferência Internacional** | **Sim** — Supabase US. |
| **Política de Retenção** | Mantido enquanto o usuário exercer atividade administrativa na paróquia; revogação de acessos imediatamente após o término do vínculo pastoral ou funcional. |
| **Medidas de Segurança** | Senhas com hash criptográfico irreversível, cookies `HttpOnly` com flag `Secure` e `SameSite=Lax`, expiração automática de sessão JWT. |
| **Classificação de Alto Risco?** | **Não**. |
| **Necessidade de RIPD?** | N/A |
| **Owner** | Administrador Geral de TI. |

---

## 🛡️ Matriz de Risco e Submissão ao RIPD (Resolução ANPD nº 2/2022 Art. 4º)

De acordo com a Resolução CD/ANPD nº 2/2022 (Guia para Agentes de Tratamento de Pequeno Porte e Organizações Religiosas), o tratamento de dados pessoais é considerado de **alto risco** quando preencher cumulativamente pelo menos um critério geral e um critério específico:

| Atividade | Critério Geral (Escala / Abrangência) | Critério Específico (Sensibilidade / Vulnerabilidade) | Enquadramento | Exigência Formal |
| :--- | :--- | :--- | :---: | :---: |
| **A001 — Atendimentos Pastorais** | Abrangência paroquial contínua de milhares de fiéis | **Dados Sensíveis (Art. 11)** — Convicção religiosa e relatos íntimos espirituais | 🔴 **ALTO RISCO** | **Elaboração de RIPD (`ripd-pastoral-appointments`)** |
| **A002 — Inscrições Sacramentais** | Abrangência paroquial contínua das 12 CEBs | **Dados de Crianças e Adolescentes (Art. 14 + ECA Digital)** | 🔴 **ALTO RISCO** | **Elaboração de RIPD (`ripd-sacramental-minors`)** |
| **A003 — Dizimistas** | Base associativa paroquial | Dados cadastrais e financeiros comuns | 🟢 Risco Regular | Dispensado de RIPD (exige ROPA e transparência) |
| **A004 — Lideranças CPC** | 12 comunidades locais | Dados de contato institucionais | 🟢 Risco Baixo | Anuência do titular |
| **A005 — IA Paroquial RAG** | Uso restrito no `/admin` | Acervo institucional público/canônico | 🟢 Risco Baixo | Mitigado por prompt de segurança |
| **A006 — Mensageria** | Transacional sob demanda | Metadados de notificação | 🟢 Risco Baixo | Dispensado de RIPD |
| **A007 — Autenticação `/admin`** | Equipe interna restrita | Credenciais corporativas | 🟢 Risco Baixo | Boas práticas de segurança |
