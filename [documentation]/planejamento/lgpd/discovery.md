# Discovery Técnico LGPD — Ecclesiam App

**Data da Investigação**: 23/10/2026  
**Auditor**: Agente LGPD (Skill `lgpd-legacy-retrofit`)  
**Repositório**: `c:\Users\Start\ecclesiam-app`  

---

## 1. Mapeamento do Banco de Dados & Schemas (Supabase Postgres)

A análise das migrações SQL em [`supabase/migrations/`](file:///c:/Users/Start/ecclesiam-app/supabase/migrations) identificou 4 tabelas centrais que coletam e processam dados pessoais (PII), dados sensíveis e dados de crianças/adolescentes:

### A. Tabela `public.pastoral_appointments` (Migração `20261012_create_pastoral_appointments.sql`)
* **Finalidade**: Agendamento de atendimentos com padres e equipe pastoral da paróquia.
* **Dados Pessoais Identificáveis (PII)**:
  * `parishioner_name` (texto)
  * `parishioner_phone` (texto)
  * `parishioner_email` (texto opcional)
* **Dados Pessoais Sensíveis (Art. 5º, II e Art. 11 da LGPD)**:
  * `appointment_type`: Valores canônicos (`confissao`, `direcao_espiritual`, `pastoral_escuta`, `atendimento_padre`, `bencao`, `processo_matrimonial`). A natureza do sacramento da confissão e direção espiritual revela convicções religiosas e dados íntimos de foro interno/espiritual.
  * `notes` e `internal_notes`: Campos de texto livre onde fiéis ou secretários podem descrever situações familiares graves, pecados, crises de fé ou pedidos de oração.
* **Segurança Atual**: RLS habilitado com inserção pública (`anon`, `authenticated`) e leitura/edição restrita a usuários administrativos autenticados.
* **Alerta LGPD**: Ausência de política de retenção temporal (dados de confissões/agendamentos passados permanecem indefinidamente no banco).

---

### B. Tabela `public.sacramental_registrations` (Migração `20261012_create_sacramental_registrations.sql`)
* **Finalidade**: Inscrição e triagem da Secretaria On-line para sacramentos e catequese comunitária.
* **Dados Coletados**:
  * Solicitante: `applicant_name`, `applicant_phone`, `applicant_email`, `applicant_role` (`proprio`, `mae`, `pai`, `responsavel`, `noivo`, `noiva`).
  * Candidato: `candidate_name`, `candidate_birth_date`.
  * Detalhes complementares: `details` (JSONB) e `documents_urls` (JSONB com URLs de certidões de nascimento, comprovantes de residência e RG armazenados no Supabase Storage).
* **Dados de Crianças e Adolescentes (Art. 14 da LGPD + Lei nº 15.211/2025 - ECA Digital)**:
  * `sacrament_type`: `batismo`, `eucaristia` (Primeira Comunhão), `crisma`. A grande maioria dos candidatos nesses sacramentos são **menores de 18 anos**.
  * Requisito normativo: Consentimento específico e destacado de pelo menos um dos pais ou responsável legal com finalidade clara, além de guarda ultra-segura de documentos de identificação infantil.
* **Alerta LGPD**: O formulário web atual não solicita declaração explícita de guarda/pátrio poder nem colhe opt-in de consentimento destacado com base no Art. 14 da LGPD.

---

### C. Tabela `public.tithe_registrations` (Migração `20261014_create_tithe_registrations.sql`)
* **Finalidade**: Adesão da campanha de dizimistas da paróquia e comunidades ("Sou do Sagrado").
* **Dados Coletados**:
  * `full_name`, `phone`, `email`, `birth_date`, `address`, `neighborhood`.
  * Preferências de arrecadação: `preferred_payment_method` (`pix`, `envelope`, `transferencia`, `debito`, `secretaria`), `preferred_day`.
  * Status de integração: `status` com valor `cadastrado_theos`.
* **Alerta LGPD**:
  * Coleta de endereço completo residencial combinada com dados de contribuição religiosa.
  * O status `cadastrado_theos` indica compartilhamento manual ou automatizado de dados pessoais com terceiro (Theos Sistemas Paroquiais), exigindo previsão transparente na política e contrato/DPA de tratamento.

---

### D. Tabela `public.communities` & Lideranças do CPC (`20260924_create_cebs_hierarchy.sql`)
* **Finalidade**: Exibição dos membros do Conselho Pastoral Comunitário (CPC) e coordenadores nas LPs das 12 comunidades.
* **Dados Expostos**: Nomes de fiéis leigos e links de redirecionamento direto para conversa privada no WhatsApp.
* **Alerta LGPD**: A publicação de contatos pessoais de leigos em site público exige termo de anuência prévia para divulgação de dados institucionais ou uso de números corporativos/pastorais.

---

## 2. Investigação de Frontend, Formulários & Rastreamento

* **Formulários Públicos Identificados**:
  * Portal da Secretaria: `/secretaria` (agendamento com padres e inscrição sacramental).
  * Portal do Dízimo: `/dizimo` (cadastro e envio de dados cadastrais).
  * Mini-sites das Comunidades: `/comunidades/[slug]` (contato com coordenadores).
* **Conformidade de Consentimento**:
  * ❌ **Zero checkboxes de opt-in**: Nenhum dos formulários exige concordância ativa do titular com termos ou tratamento de dados.
  * ❌ **Ausência de Aviso de Privacidade no Rodapé**: Não há links para "Política de Privacidade" ou "Termos de Uso" no layout público principal (`app/layout.tsx`).
* **Cookies & Tracking**:
  * ✅ **Sem pixels intrusivos**: O projeto não utiliza Google Tag Manager, Meta Pixel ou scripts de terceiros de publicidade comportamental.
  * Cookies estritamente técnicos: Sessões de autenticação do Supabase SSR (`@supabase/ssr`).

---

## 3. Investigação de Fornecedores & Operadores Terceiros (Art. 39 da LGPD)

| Fornecedor / Serviço | Função no Ecclesiam App | Localização dos Servidores | Status Contratual / LGPD |
| :--- | :--- | :--- | :--- |
| **Supabase Inc.** | Banco de Dados PostgreSQL, Storage de Documentos e Autenticação | Estados Unidos (AWS) | Operador internacional. Ausência de DPA formal arquivado e de Cláusulas-Padrão BR (Res. CD/ANPD 19/2024). |
| **Vercel Inc.** | Hospedagem Serverless & Edge Network do Next.js | Global / Estados Unidos | Operador de trânsito e renderização. Ausência de DPA formal. |
| **Resend Inc.** | Disparo transacional de e-mails para fiéis e secretários | Estados Unidos | Operador de mensageria. Processa e-mails e nomes de fiéis. |
| **Google LLC (Gemini API)** | Embeddings e IA Paroquial do `/admin/assistente-ia` | Estados Unidos | Processa documentos institucionais da paróquia. Requer garantia de que dados diocesanos não treinam modelos públicos. |
| **Theos Sistemas** | Sistema ERP de gestão eclesial da diocese/paróquia | Brasil | Operador terceiro de dados de dízimo e finanças eclesiais. |

---

## 4. Governança, Encarregado (DPO) & Direitos dos Titulares (DSAR)

* **Encarregado (Art. 41 da LGPD & Resolução CD/ANPD nº 18/2024)**:
  * Não há nome ou e-mail de contato do DPO publicado no site oficial da paróquia.
* **Canal DSAR (Art. 18 da LGPD)**:
  * Não existe canal eletrônico dedicado para o fiel solicitar a confirmação de existência de dados, retificação ou exclusão (direito ao esquecimento) com cumprimento do prazo legal de até 15 dias (Art. 19, II da LGPD).
* **Runbook de Incidentes (Resolução CD/ANPD nº 15/2024)**:
  * Inexistência de procedimento documentado para notificação de vazamentos à ANPD e aos fiéis no prazo improrrogável de **3 dias úteis**.
