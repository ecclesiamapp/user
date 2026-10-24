# Conformidade com a Lei nº 15.211/2025 (ECA Digital) & Art. 14 da LGPD

**Projeto**: Ecclesiam App (Paróquia Piloto: Catedral de Colatina)  
**Marco Legal**: Lei nº 15.211/2025 (Estatuto da Criança e do Adolescente Digital - ECA Digital, em vigor desde 17/03/2026) c/c Artigo 14 da Lei nº 13.709/2018 (LGPD)  
**Data da Avaliação**: 23/10/2026  
**Versão**: 1.0  
**Status**: Conforme / Implementado  

---

## 🧭 1. Escopo de Aplicabilidade Paroquial

A Lei nº 15.211/2025 (ECA Digital) e o Artigo 14 da LGPD aplicam-se a qualquer ambiente ou aplicação acessada por crianças (até 12 anos incompletos) ou adolescentes (entre 12 e 18 anos). No âmbito da Paróquia da Catedral e suas 12 comunidades, as atividades alcançadas são:

1. **Pastoral Catequética (Iniciação Cristã / Primeira Eucaristia e Crisma)**
2. **Pastoral do Batismo (Batismo Infantil)**
3. **Pastoral dos Coroinhas e Cerimoniários Mirins**
4. **Grupos de Jovens e Adolescentes**

---

## 🛡️ 2. Mecanismos Mandatórios e Salvaguardas Implementadas

### A. Vinculação Obrigatória ao Responsável Legal (Art. 24 da Lei 15.211/2025)
* O cadastro ou inscrição de crianças e adolescentes de **até 16 anos** é terminantemente vedado de forma individualizada ou desacompanhada.
* O formulário da Secretaria On-line exige a identificação formal prévia do pai, mãe ou responsável legal (`applicant_name`, `applicant_phone`, `applicant_role` e e-mail).
* A inscrição vincula diretamente o catequizando ao responsável, que assume a responsabilidade pela veracidade das informações apresentadas.

### B. Consentimento Parental Específico e em Destaque (Art. 14, § 1º da LGPD)
* O formulário de inscrição em sacramentos exige a marcação de checkbox mandatório e destacado:
  > *"Declaro, sob as penas da lei, ser pai, mãe ou responsável legal pela criança/adolescente acima inscrito(a), e consinto expressamente com o tratamento dos dados estritamente para fins de catequese e preparação aos sacramentos da Igreja Católica, ciente dos termos da Política de Privacidade e do ECA Digital (Lei 15.211/2025)."*

### C. Vedação Absoluta de Perfilamento Publicitário (Arts. 22 e 26 da Lei 15.211/2025)
* A plataforma **Ecclesiam App** não executa, sob nenhuma hipótese, perfilamento comportamental, rastreamento mercadológico, telemetria de anúncios ou direcionamento publicitário sobre dados de crianças e adolescentes.
* Dados de menores jamais são alimentados em ferramentas de CRM comercial ou compartilhados com parceiros comissionados.

### D. Proteção Especial de Imagens e Fotografias Litúrgicas
* Fotografias de celebrações de Primeira Eucaristia ou Missas com coroinhas publicadas na galeria paroquial ou redes sociais da PASCOM devem respeitar a dignidade da criança, priorizando registros comunitários e planos gerais, vedada a exposição vexatória ou identificação nominal sem termo formal de cessão de uso de imagem assinado pelos pais.

### E. Limpeza e Descarte Seguro de Certidões de Nascimento no Storage
* Documentos de certidão de nascimento e identificação civil anexados digitalmente no ato da inscrição são mantidos no Supabase Storage em bucket privado com acesso restrito à secretaria.
* Conforme a Política de Retenção ([`.lgpd/retention-policy.md`](./retention-policy.md)), tais arquivos digitais são eliminados definitivamente (*Hard Delete*) após **180 dias** da recepção do sacramento, permanecendo unicamente o registro formal no Livro de Tombo físico da paróquia.

---

## 📋 3. Matriz de Conformidade com o ECA Digital

| Obrigação da Lei 15.211/2025 | Status | Evidência Técnica no Ecclesiam App |
| :--- | :---: | :--- |
| **Vinculação a Responsável Legal (< 16 anos)** | ✅ Conforme | Tabela `sacramental_registrations` vincula `applicant` (adulto) ao `candidate` (menor). |
| **Proibição de Perfilamento Comercial** | ✅ Conforme | Ausência de pixels de tracking (Meta/Google Ads) e ausência de algoritmos de recomendação comercial. |
| **Verificação de Idade** | ✅ Conforme | Exigência da data de nascimento com cálculo de maioridade e consentimento parental. |
| **Vedação de Loot Boxes / Gamificação Tóxica** | ✅ Conforme | Inexistente (sistema 100% institucional e litúrgico). |
| **Canais Acessíveis em Português Simples** | ✅ Conforme | Página `/privacidade` redigida em linguagem clara e acessível para famílias e jovens. |
| **Canal de Denúncias e Descarte Imediato** | ✅ Conforme | Canal do DPO (`privacidade@catedraldecolatina.org.br`) para requisições de exclusão parental em até 15 dias. |
