# Guia de Anonimização, Pseudonimização e Métricas Paroquiais — Ecclesiam App

**Projeto**: Ecclesiam App (Paróquia Piloto: Catedral de Colatina / Diocese de Colatina)  
**Versão**: v1.0  
**Data**: 23/10/2026  
**Marco Legal**: Artigos 5º (XI e XII), 12, 13 (§ 4º) e 16 (IV) da Lei nº 13.709/2018 (LGPD)  
**Finalidade**: Definir as regras de transformação de dados pessoais para geração de estatísticas da cúria, relatórios do Conselho Econômico (CAEP) e proteção de bases históricas.  

---

## 🧭 1. Distinção Legal Fundamental

| Critério | Anonimização (Art. 5º, XI da LGPD) | Pseudonimização (Art. 13, § 4º da LGPD) |
| :--- | :--- | :--- |
| **Definição** | Utilização de meios técnicos razoáveis e disponíveis para que o dado perca a possibilidade de associação direta ou indireta a um indivíduo. | Tratamento por meio do qual um dado não mais possa ser atribuído a um titular senão com o uso de informação adicional mantida separadamente. |
| **Reversibilidade** | **Irreversível** (considerando tempo, custo e tecnologia razoáveis). | **Reversível** (mediante acesso à chave ou cofre de segregação). |
| **Status perante a LGPD** | **FORA DO ESCOPO DA LGPD** (Artigo 12 — o dado anonimizado deixa de ser dado pessoal). | **CONTINUA SENDO DADO PESSOAL** (sujeito a todas as regras e obrigações da LGPD). |
| **Aplicação no Ecclesiam** | Estatísticas públicas de sacramentos, relatórios anuais da Diocese, painel público das 12 CEBs. | Identificadores internos (`id`, tokens JWT), logs de auditoria e tabelas de staging. |

---

## 🛡️ 2. Regras de *k-Anonymity* ($k \ge 5$) para Relatórios Paroquiais

Para garantir que relatórios de arrecadação do dízimo e frequência litúrgica nunca permitam a re-identificação indireta de paroquianos (ataques de correlação ou *singling out*):

1. **Agrupamento Mínimo ($k \ge 5$)**:
   * Qualquer agregação demográfica (por exemplo: dizimistas por bairro, faixa etária ou comunidade rural) somente pode ser exibida se houver no mínimo **5 indivíduos** compartilhando os mesmos atributos.
   * Se uma comunidade rural possuir menos de 5 dizimistas em determinada faixa etária, os dados devem ser agregados à categoria genérica *"Comunidades Rurais — Geral"* ou suprimidos da visualização gráfica.
2. **Generalização de Atributos**:
   * **Data de Nascimento**: Transformada em **Faixas Etárias** (ex: `18-29 anos`, `30-49 anos`, `50-64 anos`, `65+ anos`).
   * **Endereço Residencial**: Generalizado para **Bairro** ou **Comunidade**, suprimindo-se expressamente logradouro, número predial e complemento.
   * **Valores de Contribuição do Dízimo**: Exibidos exclusivamente em faixas salariais ou totais agregados da comunidade (proibida a emissão de listas públicas com valores individualizados associados a nomes).

---

## 🛠️ 3. Receitas Técnicas de Anonimização em SQL (Supabase Postgres)

### Receita 1: Anonimização de Atendimentos Pastorais Expirados (> 1 ano)
Quando um registro de atendimento pastoral ultrapassa o período de guarda ativa, o nome e contato são desvinculados irreversivelmente, preservando apenas o valor estatístico do ministério sacerdotal:

```sql
-- Procedure para anonimização de atendimentos pastorais antigos
CREATE OR REPLACE FUNCTION public.anonymize_expired_pastoral_appointments()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
BEGIN
  UPDATE public.pastoral_appointments
  SET
    parishioner_name = 'Fiel Anônimo #' || substr(md5(id::text), 1, 6),
    parishioner_phone = '00000000000',
    parishioner_email = NULL,
    notes = NULL,
    internal_notes = NULL,
    updated_at = now()
  WHERE appointment_date < (CURRENT_DATE - INTERVAL '1 year')
    AND parishioner_name NOT LIKE 'Fiel Anônimo #%';
    
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
```

### Receita 2: Extração de Métricas de Dízimo para o CAEP (Livre de PII)
View analítica segura para prestação de contas que não expõe dados pessoais de doadores:

```sql
-- View analítica anonimizada para prestação de contas do dízimo
CREATE OR REPLACE VIEW public.vw_tithe_community_metrics AS
SELECT
  c.name AS community_name,
  to_char(t.created_at, 'YYYY-MM') AS reference_month,
  t.preferred_payment_method,
  COUNT(t.id) AS total_contributors,
  -- Aplicação de k-anonymity: se houver menos de 5 registros, mascara a contagem
  CASE 
    WHEN COUNT(t.id) < 5 THEN '< 5'
    ELSE COUNT(t.id)::text
  END AS safe_contributors_display
FROM public.tithe_registrations t
JOIN public.communities c ON c.id = t.community_id
GROUP BY c.name, to_char(t.created_at, 'YYYY-MM'), t.preferred_payment_method;
```

---

## 🚫 4. Anti-Padrões Proibidos na Paróquia

* ❌ **"Remover apenas o nome"**: Manter CPF, endereço e telefone acreditando que a base está anonimizada. É pseudonimização, não anonimização.
* ❌ **Publicação de Listas de Dizimistas no Mural**: É expressamente vedado afixar no mural da igreja ou boletim paroquial listas com nomes e valores doados de fiéis.
* ❌ **Compartilhamento de Fichas de Catequese**: Envio de planilhas de turmas da catequese em grupos abertos de WhatsApp de pais sem consentimento prévio e canal restrito.
