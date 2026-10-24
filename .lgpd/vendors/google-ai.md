# Avaliação de Operador: Google LLC / Gemini API (Art. 39 LGPD)

**Documento de Due Diligence Técnica e Jurídica**  
**Marco Legal**: Artigos 33, 39, 42 e 46 da Lei nº 13.709/2018 (LGPD)  

---

## 1. Ficha do Operador

* **Razão Social / Identificação**: Google LLC
* **Sede / Jurisdição**: Mountain View, Califórnia, Estados Unidos
* **País de Tratamento**: Estados Unidos
* **Finalidade**: Extração de embeddings vetoriais numéricos (`text-embedding-004`) e inferência de linguagem natural (Gemini 2.5 Flash) para o módulo `/admin/assistente-ia` (RAG paroquial).
* **Dados Compartilhados**:
  * Trechos textuais de documentos PDF pastorais e decretos diocesanos públicos/institucionais.
  * Prompts de busca digitados pelos secretários e padres.
* **Dados Pessoais de Fiéis Compartilhados?**: **NÃO**. Diretriz mandatória: O assistente atua exclusivamente sobre o acervo documental institucional cadastrado pelo clero no banco `parish_knowledge_documents`. Fichas de paroquianos, doações ou sacramentos jamais são enviadas à API do Gemini.
* **Garantia de Não-Treinamento de Modelos**: A API corporativa do Google Cloud / Google AI Studio garante contratualmente que prompts e dados enviados via API paga/comercial não são utilizados para treinar os modelos fundacionais públicos do Google.
* **Tier de Risco**: 🟡 **MÉDIO** (Uso de IA generativa sobre documentação institucional, sem ingestão de dados privados de pessoas físicas).
* **Owner Interno**: Administrador de IA e TI.
* **Última Revisão**: 23/10/2026.
* **Próxima Revisão**: 23/10/2027 (Anual).

---

## 2. Checklist de Due Diligence

### A. Contrato e Base Legal
- [x] Papel definido como **Operador** de computação de inteligência artificial.
- [x] Base legal: Art. 7º, IX da LGPD (legítimo interesse na eficiência da pesquisa documental paroquial).
- [x] Termos de processamento de dados (Google Cloud Data Processing and Security Terms — DPST) vigentes.

### B. Segurança e Privacidade
- [x] Criptografia de ponta a ponta em trânsito (HTTPS/TLS).
- [x] Chave de API mantida em segredo de backend em `.env.local` (`GEMINI_API_KEY`), sem vazamento para o navegador do cliente.
- [x] Certificações internacionais: ISO 27001, ISO 27017, ISO 27018, SOC 2 / SOC 3.

---

## 3. Veredito & Plano de Ação

* **Status**: 🟢 **APROVADO**
* **Recomendação**: Manter a trava de código no backend que impede o upload acidental de planilhas de fiéis ou registros de dízimo para o módulo RAG de inteligência artificial.
