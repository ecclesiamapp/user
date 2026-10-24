# Política de Retenção, Ciclo de Vida e Descarte Seguro de Dados — Ecclesiam App

**Projeto**: Ecclesiam App (Paróquia Piloto: Catedral de Colatina / Diocese de Colatina)  
**Versão**: v1.0  
**Data**: 23/10/2026  
**Enquadramento Normativo**: Artigos 15, 16 e 18 da Lei nº 13.709/2018 (LGPD), Marco Civil da Internet (Lei nº 12.965/2014) e Código Tributário Nacional (Lei nº 5.172/1966)  
**Owner**: Encarregado de Proteção de Dados (DPO) & Conselho Paroquial para Assuntos Econômicos (CAEP)  

---

## 🧭 1. Princípios de Governança de Dados

A retenção de dados pessoais no **Ecclesiam App** obedece estritamente aos princípios da **Necessidade** e da **Minimização** (Art. 6º, III da LGPD). Os dados pessoais somente permanecem armazenados pelo período necessário ao alcance de suas finalidades específicas ou para o estrito cumprimento de obrigações legais, regulatórias e canônicas.

### Hierarquia de Obrigações de Guarda
```
Retenção Legal / Canônica Obrigatória > Necessidade Pastoral Contratual > Vontade do Titular (Art. 18, VI)
```
Quando o titular solicita a eliminação de seus dados (Art. 18, VI da LGPD), mas há obrigação legal ou regulatória de conservação (ex: obrigações contábeis ou registros de conexão do Marco Civil), os dados não são eliminados imediatamente; eles são **bloqueados** (isolados do uso pastoral comum) e mantidos até o término do prazo prescricional legal, sendo expurgados em seguida.

---

## 📊 2. Tabela de Temporalidade e Retenção por Módulo

| Módulo / Tabela | Dados Coletados | Prazo de Retenção | Base Legal da Retenção | Ação de Término (*Post-Retention Action*) |
| :--- | :--- | :---: | :--- | :--- |
| **Atendimentos Pastorais (Confissões e Bênçãos)**<br>`pastoral_appointments` | • Notas espirituais subjetivas (`notes`, `internal_notes`) | **90 dias** após a data da realização | Minimização (Art. 6º, III) e Proteção de Dados Sensíveis (Art. 11) | **Sanitização de Campo**<br>(Atualização para `NULL` nas notas, preservando apenas data e padre). |
| **Atendimentos Pastorais (Histórico Geral)**<br>`pastoral_appointments` | • Nome do fiel, telefone e data de agendamento | **1 ano** após o atendimento | Legítimo interesse na gestão de agenda e histórico da secretaria | **Anonimização**<br>(Substituição do nome por identificador anônimo para estatísticas). |
| **Inscrições Sacramentais (Documentos Digitais)**<br>`sacramental_registrations` | • Uploads de Certidões de Nascimento, RG e comprovantes de residência no Supabase Storage | **180 dias** após a celebração litúrgica | Minimização e proteção da infância (Art. 14 LGPD + ECA Digital) | **Hard Delete**<br>(Exclusão física irreversível do arquivo do bucket de Storage). |
| **Inscrições Sacramentais (Assentamento Histórico)**<br>`sacramental_registrations` | • Registro formal de Batismo, Primeira Eucaristia e Crisma | **Perpétuo** (Livros de Tombo Físicos) / **5 anos** no sistema digital | Cânon 535 do Código de Direito Canônico c/c Art. 16, I da LGPD | **Bloqueio e Arquivamento**<br>(Acesso restrito ao pároco para emissão de certidões). |
| **Pastoral do Dízimo ("Sou do Sagrado")**<br>`tithe_registrations` | • Cadastro do dizimista, endereço e preferências de doação | Durante o vínculo ativo + **5 anos** após a última contribuição | Prescrição tributária e fiscal de entidades imunes (CTN Arts. 173-174) | **Anonimização Cadastral**<br>(Manutenção do registro contábil com desvinculação de dados pessoais). |
| **Lideranças Comunitárias das CEBs**<br>`communities` | • Nome de coordenadores do CPC e telefone WhatsApp | Vigência do mandato da diretoria (**2 a 3 anos**) | Consentimento e finalidade institucional (Art. 7º, I e IX) | **Hard Delete / Substituição**<br>(Remoção imediata após a eleição e posse do novo CPC). |
| **Assistente IA e RAG Institucional**<br>`parish_knowledge_*` | • Vetores e fragmentos de documentos PDF diocesanos | Vigência do documento institucional na diocese | Legítimo interesse na gestão do conhecimento | **Hard Delete em Cascata**<br>(Exclusão imediata dos vetores ao remover o PDF do sistema). |
| **Logs de Sessão e Acesso Administrativo**<br>`auth.users` / Logs Supabase | • Endereço IP, data, hora e credenciais de login | **6 meses a 1 ano** | Marco Civil da Internet (Lei nº 12.965/2014 Arts. 13 e 15) | **Purga Automática de Logs**<br>(Descarte rotativo após 365 dias). |
| **Logs de Disparo de E-mails Transacionais**<br>Plataforma Resend | • Endereço de e-mail e status de entrega | **30 dias** | Auditoria operacional transitória | **Hard Delete Automático**<br>(Gerenciado pela política padrão da Resend). |

---

## 🛠️ 3. Mecanismos Técnicos de Eliminação no Banco de Dados

### Estratégia 1: Sanitização de Campos Sensíveis (Atendimentos Pastorais)
Após 90 dias da data do atendimento, as anotações espirituais que possam conter confissões ou situações familiares íntimas devem ser limpas automaticamente:

```sql
-- Expurgo automático de notas confidenciais após 90 dias
UPDATE public.pastoral_appointments
SET 
  notes = NULL,
  internal_notes = NULL,
  updated_at = now()
WHERE appointment_date < (CURRENT_DATE - INTERVAL '90 days')
  AND (notes IS NOT NULL OR internal_notes IS NOT NULL);
```

### Estratégia 2: Hard Delete de Arquivos no Supabase Storage (Documentos de Menores)
Documentos comprobatórios da catequese e batismo devem ser removidos do Storage privado após a consolidação paroquial:
1. Uma rotina identifica registros em `sacramental_registrations` onde `status = 'concluido'` com data superior a 180 dias.
2. Invoca-se a API do Supabase Storage (`supabase.storage.from('sacramental_docs').remove([...])`) para deletar os arquivos físicos.
3. O campo `documents_urls` é atualizado para `'[]'::jsonb` com a anotação interna: *"Documentos físicos validados e expurgados conforme a Política de Retenção LGPD"*.

### Estratégia 3: Anonimização de Dizimistas Inativos
Quando um fiel solicita sua saída da pastoral ou permanece sem contato por mais de 5 anos:
1. O nome é substituído por `"Dizimista Anônimo #" || id`.
2. Telefone, e-mail e endereço são sobrescritos com valores mascarados/nulos.
3. Os registros numéricos de contribuição financeira permanecem intactos para garantir o balanço patrimonial e prestação de contas da paróquia.

---

## 🛡️ 4. Fluxo de Atendimento ao Direito de Eliminação (Art. 18, VI)

Ao receber um pedido de exclusão ou "direito ao esquecimento" formulado por um fiel:

1. **Triagem de Retenção Legal**:
   * O fiel possui obrigações fiscais ou registros de doações recentes (< 5 anos)?
     * **Se NÃO**: Executa-se o *Hard Delete* completo em todas as tabelas.
     * **Se SIM**: Executa-se o *Bloqueio e Anonimização*: dados de contato e marketing são removidos imediatamente, preservando-se apenas os dados fiscais estritamente necessários até a prescrição.
2. **Emissão de Declaração de Descarte**:
   * O Encarregado (DPO) emite notificação eletrônica ao solicitante no prazo legal de até 15 dias confirmando o descarte realizado e/ou justificando a retenção legal de registros financeiros/canônicos específicos.
