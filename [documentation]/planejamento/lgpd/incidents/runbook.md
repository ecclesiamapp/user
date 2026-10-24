# Runbook de Resposta a Incidentes de Segurança da Informação (RCIS)

**Projeto**: Ecclesiam App (Paróquia Piloto: Catedral de Colatina)  
**Marco Normativo Mandatório**: Artigo 48 da Lei nº 13.709/2018 (LGPD) e **Resolução CD/ANPD nº 15/2024** (Regulamento de Comunicação de Incidentes de Segurança — RCIS)  
**Prazo Legal Improrrogável**: **3 dias úteis** a partir da data de conhecimento do incidente (para notificação à ANPD e aos fiéis titulares afetados)  
**Registro Permanente**: Todos os incidentes, independentemente de serem notificados ou não, devem constar no registro histórico por no mínimo **5 anos** (Art. 10 da Res. 15/2024).  

---

## 🚨 1. Critério de Notificação Obrigatória (Art. 5º da Res. 15/2024)

Um incidente de segurança deve ser obrigatoriamente comunicado à ANPD e aos titulares quando preencher cumulativamente os dois requisitos:

### Requisito A: Potencial de Risco ou Dano Relevante
Capacidade de afetar significativamente direitos fundamentais ou causar prejuízos morais, materiais ou constrangimento social aos fiéis.

### Requisito B: Envolvimento de pelo menos UMA das categorias protegidas:
1. **Dados pessoais sensíveis** (Art. 11 — convicção religiosa, relatos de confissão ou orientação espiritual no Ecclesiam).
2. **Dados de crianças, adolescentes ou idosos** (inscrições de catequese/batismo ou paroquianos idosos).
3. **Dados financeiros** (informações de arrecadação do dízimo, contas bancárias ou chaves Pix).
4. **Dados de autenticação em sistemas** (senhas administrativas, tokens de sessão JWT do Supabase).
5. **Dados protegidos por sigilo legal ou profissional** (segredo ministerial do sacerdócio católico).
6. **Dados tratados em larga escala**.

> ⚠️ Se o incidente envolver confissões (`pastoral_appointments`) ou documentos de catequese infantil (`sacramental_registrations`), a notificação é **MANDATÓRIA** em até **3 dias úteis**.

---

## ⏱️ 2. Linha do Tempo de Resposta (T+0h a T+72h)

```
[T+0h] Detecção & Registro do Timestamp Exato
  ↓ (0 a 4h)
[T+4h] Contenção Técnica Imediata & Isolamento no Supabase
  ↓ (4 a 24h)
[T+24h] Avaliação de Escopo, Volume e Risco (Art. 5º)
  ↓ (24 a 72h / 3 dias úteis)
[T+72h] Comunicação Formal à ANPD + Notificação aos Fiéis Afetados
  ↓
[Pós-Incidente] Análise Forense, Correção Definitiva e Relatório Complementar (até 20 dias úteis)
```

---

## 🛠️ 3. Ações Imediatas de Contenção Técnica (T+0h a T+4h)

Ao identificar qualquer suspeita de invasão, vazamento de API keys ou acesso não-autorizado:

1. **Girar Credenciais Imediatamente**:
   * Acessar o dashboard do Supabase e girar a `anon key` e a `service_role key`.
   * Atualizar os segredos na Vercel (`vercel env add`) e no arquivo local `.env.local`.
   * Forçar um novo deploy para propagar as novas chaves para o Edge Network.
2. **Revogar Sessões Ativas**:
   * Executar revogação de tokens no Supabase Auth (`supabase.auth.admin.signOut(userId)` para todas as contas de secretários e padres).
3. **Travar Buckets de Storage**:
   * Se houver suspeita de extração de documentos de batismo/catequese, desativar temporariamente as políticas de leitura no bucket `sacramental_docs`.
4. **Preservação de Evidências Forenses**:
   * É terminantemente proibido deletar logs de acesso do Supabase ou Vercel. Fazer download imediato dos logs brutos e dumps de conexões para perícia.

---

## 📋 4. Conteúdo Mandatório da Comunicação à ANPD (12 Itens do Art. 6º, § 2º)

A notificação formal via portal eletrônico da ANPD ([gov.br/anpd](https://www.gov.br/anpd)) deve conter expressamente:

1. Natureza e categoria dos dados pessoais afetados (ex: dados sensíveis de fé, nomes e certidões).
2. Número total de titulares afetados, **discriminando expressamente o número de crianças, adolescentes e idosos**.
3. Medidas técnicas e de segurança adotadas antes do incidente (ex: RLS, criptografia AES-256).
4. Medidas imediatas adotadas após o incidente para conter e mitigar o dano.
5. Riscos e possíveis impactos adversos aos titulares afetados.
6. Motivos da demora, caso a notificação ultrapasse o prazo de 3 dias úteis.
7. Data exata do incidente e data do efetivo conhecimento pela equipe técnica.
8. Dados de identificação e contato do Encarregado (DPO).
9. Identificação completa do controlador (Mitra Diocesana / Paróquia da Catedral).
10. Identificação dos operadores terceiros envolvidos (ex: Supabase, Vercel).
11. Descrição clara e detalhada do incidente com sua causa principal comprovada.
12. Total de titulares cujos dados são tratados nas atividades afetadas.

---

## 📢 5. Conteúdo Mandatório da Notificação aos Fiéis (7 Itens do Art. 9º)

A comunicação aos paroquianos deve ser feita em **linguagem simples, clara e acessível** (individualizada por e-mail ou WhatsApp oficial):

1. Descrição clara da natureza e categorias dos dados vazados.
2. Medidas de segurança técnicas adotadas para proteger as informações.
3. Riscos reais que o fiel pode enfrentar (ex: tentativas de golpe ou phishing).
4. Medidas adotadas pela paróquia para solucionar e estancar o problema.
5. Ações recomendadas ao fiel (ex: atenção redobrada a mensagens suspeitas no WhatsApp em nome do padre).
6. Data em que a paróquia tomou conhecimento da falha.
7. Canal direto de contato com o Encarregado (DPO) para dúvidas e orientações.

---

## 👥 6. Comitê de Resposta a Incidentes da Paróquia

* **Líder do Comitê**: Pároco da Catedral.
* **Coordenador Jurídico / DPO**: Encarregado de Proteção de Dados da Diocese/Paróquia.
* **Líder Técnico de Contenção**: Administrador do Ecclesiam App / Start Agência Digital.
* **Porta-Voz Pastoral**: Coordenação da Pastoral da Comunicação (PASCOM).
