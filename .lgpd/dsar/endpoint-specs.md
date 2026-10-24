# Especificação Técnica de Endpoints DSAR — Ecclesiam App

**Módulo**: API de Atendimento aos Direitos do Titular (Next.js App Router)  
**Marco Legal**: Artigos 18 e 19 da LGPD  

---

## 1. Rota de Submissão de Pedido: `POST /api/dsar/request`

Permite ao fiel abrir uma solicitação formal de direitos (acesso, correção, portabilidade, eliminação ou revogação de consentimento).

* **Método**: `POST`
* **Acesso**: Público (com verificação de captcha/anti-bot e envio de token de confirmação por e-mail).
* **Payload da Requisição**:

```json
{
  "parish_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "full_name": "João da Silva",
  "email": "joao.silva@exemplo.com.br",
  "phone": "27999998888",
  "request_type": "erasure", // "access" | "correction" | "erasure" | "portability" | "consent_revocation"
  "details": "Solicito a exclusão dos meus dados da Pastoral do Dízimo e cancelamento de mensagens."
}
```

* **Resposta de Sucesso (`201 Created`)**:

```json
{
  "ticket_id": "DSAR-2026-0042",
  "status": "pending_verification",
  "message": "Solicitação registrada. Enviamos um código de confirmação para o seu e-mail para validar sua identidade.",
  "sla_deadline": "2026-11-07T23:59:59Z"
}
```

---

## 2. Rota de Exportação de Dados (Portabilidade): `GET /api/dsar/export`

Gera um arquivo estruturado com todos os dados pessoais atrelados ao titular solicitante.

* **Método**: `GET`
* **Autenticação**: Bearer Token de validação OTP ou sessão autenticada.
* **Formato**: `application/json` ou `text/csv`.
* **Payload de Retorno**:

```json
{
  "titular": {
    "nome": "João da Silva",
    "email": "joao.silva@exemplo.com.br",
    "telefone": "27999998888"
  },
  "historico_atendimentos": [
    {
      "data": "2026-09-10",
      "tipo": "atendimento_padre",
      "status": "concluido"
    }
  ],
  "dizimo": {
    "comunidade": "Comunidade São João Batista",
    "data_adesao": "2026-02-15",
    "status": "ativo"
  },
  "metadados_exportacao": {
    "gerado_em": "2026-10-23T23:15:00Z",
    "controlador": "Paróquia Sagrado Coração de Jesus - Catedral de Colatina",
    "hash_integridade": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}
```

---

## 3. Rota de Eliminação de Dados: `POST /api/dsar/erasure`

Executa a sanitização e descarte conforme a Tabela de Temporalidade.

* **Método**: `POST`
* **Acesso**: Restrito ao Encarregado (DPO) e Administradores após deferimento do pedido.
* **Ação Executada no Banco**:
  1. Remove do Supabase Storage arquivos de certidões/fotos vinculados ao solicitante.
  2. Substitui dados de contato nas tabelas de agendamentos e dízimo por `NULL` ou máscaras anonimizadas.
  3. Gera registro imutável no log de auditoria com hash do descarte para comprovação perante a ANPD.
