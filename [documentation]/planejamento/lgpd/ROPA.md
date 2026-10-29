# Registro das Operações de Tratamento de Dados Pessoais (ROPA)

**Projeto**: Ecclesiam App (Paróquia Piloto: Catedral de Colatina / Diocese de Colatina)  
**Marco Legal**: Artigo 37 da Lei nº 13.709/2018 (LGPD) e Guia Orientativo da ANPD para Agentes de Tratamento de Pequeno Porte e Entidades Religiosas  
**Versão**: v1.0 (Oficial)  
**Data de Emissão**: 23/10/2026  
**Periodicidade de Revisão**: Semestral (Próxima: 23/04/2027)  

---

## 1. Identificação Geral

| Papel | Entidade / Responsável | Contato |
| :--- | :--- | :--- |
| **Controlador dos Dados** | Paróquia Sagrado Coração de Jesus — Catedral de Colatina (Mitra Diocesana) | Centro, Colatina - ES |
| **Encarregado pelo Tratamento (DPO)** | Assessoria Canônica & Governança de Dados (Res. ANPD 18/2024) | `privacidade@catedraldecolatina.org.br` |
| **Operador Tecnológico Principal** | Start Agência Digital / Ecclesiam App | Suporte Técnico de Infraestrutura |

---

## 2. Inventário Consolidado de Operações de Tratamento (Art. 37 da LGPD)

### Tabela 1: Operações como Controlador Principal

| ID | Nome da Atividade | Finalidade Específica | Base Legal | Categorias de Titulares | Categorias de Dados | Compartilhamento / Operadores | Transferência Internacional | Retenção / Descarte | Medidas de Segurança | RIPD |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :---: | :--- | :--- | :---: |
| **A001** | **Atendimentos Pastorais e Confissões** | Agendamento e realização de confissões, bênçãos e aconselhamento com o clero. | **Art. 11, II, "d"** c/c **Art. 7º, V** | Fiéis da paróquia (adultos, idosos, jovens) | Nome, WhatsApp, e-mail, data, tipo de atendimento e notas espirituais. | Supabase Inc. (banco), Resend Inc. (e-mail transacional) | **Sim** (EUA - AWS us-east-1) | 90 dias para notas espirituais; 1 ano para registro geral (anonimização). | RLS estrito, TLS 1.3, RPC sem vazamento de PII em horários ocupados. | [RIPD-01](./RIPD/ripd-pastoral-appointments.md) |
| **A002** | **Inscrições Sacramentais & Catequese** | Preparação e admissão aos sacramentos (Batismo, Primeira Comunhão, Crisma, Matrimônio). | **Art. 14** c/c **Art. 11, II, "d"** e **Lei 15.211/2025** | Crianças (< 12 anos), adolescentes (12-18 anos) e responsáveis legais | Nome dos pais, nome da criança, nascimento, filiação e certidões anexadas. | Supabase Inc. (Storage privado de documentos) | **Sim** (EUA - AWS) | 180 dias para certidões digitais no Storage (Hard Delete); perpétuo em Livro Físico (Cânon 535). | Bucket estritamente privado, RLS, criptografia AES-256 em repouso. | [RIPD-02](./RIPD/ripd-sacramental-minors.md) |
| **A003** | **Pastoral do Dízimo ("Sou do Sagrado")** | Sustentação do templo, evangelização, obras sociais e prestação de contas pastoral. | **Art. 7º, IX** c/c **Art. 7º, V** | Fiéis dizimistas adultos e idosos | Nome completo, nascimento, telefone, endereço, forma de contribuição e dia. | Theos Sistemas Paroquiais (ERP diocesano) e Supabase Inc. | **Sim** (Supabase EUA) | Vínculo ativo + 5 anos após última doação (CTN Arts. 173-174). | Tabela protegida por RLS; acesso restrito à tesouraria paroquial. | N/A ([LIA aprovado](./lia/lia-a003-dizimo.md)) |
| **A004** | **Lideranças Comunitárias (CPC)** | Divulgação dos coordenadores das 14 comunidades (CEBs) para contato dos fiéis do bairro. | **Art. 7º, I** (Consentimento) ou **Art. 7º, IX** | Coordenadores leigos do conselho paroquial | Nome, função na comunidade e link para WhatsApp | Vercel Inc. (portal público) e Meta (wa.me) | **Sim** (Vercel Edge / Meta) | Duração do mandato da diretoria do CPC (2 a 3 anos). | Painel administrativo com controle de permissões. | N/A |
| **A005** | **Assistente IA Paroquial (RAG)** | Pesquisa semântica de normas diocesanas e auxílio na redação de avisos pelo clero. | **Art. 7º, IX** (Legítimo Interesse) | Documentos institucionais da diocese e autoridades eclesiais | Vetores de embeddings numéricos e fragmentos de PDFs públicos | Google LLC (Google Cloud / Gemini API) | **Sim** (EUA - Google AI) | Vigência do documento institucional na paróquia. | Base vetorial sem dados de fiéis; RLS por paróquia; proibição de treino público. | N/A |
| **A006** | **Mensageria Transacional de E-mails** | Envio de confirmação e lembretes de agendamentos solicitados pelo paroquiano. | **Art. 7º, V** c/c **Art. 7º, IX** | Fiéis solicitantes de agendamento | Nome, e-mail e data do compromisso pastoral | Resend Inc. (provedor de mensageria) | **Sim** (EUA) | 30 dias nos logs de envio da Resend. | Chave secreta de API em backend serverless; corpo do e-mail sem dados confessionais. | N/A |
| **A007** | **Autenticação Administrativa (`/admin`)** | Controle de permissões e segurança para acesso de clérigos e secretários. | **Art. 11, II, "g"** c/c **Art. 7º, V** | Sacerdotes, vigários, secretários e administradores | E-mail corporativo, hash de senha, IP e data/hora do login | Supabase Inc. (Supabase Auth) | **Sim** (EUA) | Durante o exercício da função pastoral ou administrativa na paróquia. | Hash Argon2id irreversível, cookies `HttpOnly` com flag `Secure` e expiração JWT. | N/A |

---

## 3. Declaração Formal de Conformidade

O presente Registro das Operações de Tratamento de Dados Pessoais (ROPA) foi consolidado pelo Encarregado pelo Tratamento de Dados Pessoais da Paróquia Sagrado Coração de Jesus — Catedral de Colatina, certificando que todas as operações descritas possuem amparo legal regular e controles adequados de segurança da informação nos termos da Lei nº 13.709/2018 (LGPD).

**Data de Validação**: 23/10/2026  
**Encarregado pelo Tratamento de Dados (DPO)**: Setor de Governança de Dados da Catedral  
