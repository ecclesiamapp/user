# 🔒 Protocolo de Segurança e Proteção de Dados - Ecclesiam App

Este documento estabelece as diretrizes inegociáveis de segurança cibernética, proteção de dados (LGPD) e isolamento multi-tenant para o **Ecclesiam App**.

---

## 1. 🛡️ Isolamento Multi-Tenant e Row Level Security (RLS) no Supabase

Como o Ecclesiam App é uma plataforma SaaS White-Label onde centenas de paróquias compartilham a mesma infraestrutura de banco de dados PostgreSQL, a violação de isolamento entre paróquias é um risco crítico inaceitável.

### Regras Inquebráveis:
1. **RLS Ativo por Padrão:** TODA tabela criada no banco de dados deve ter `ALTER TABLE nome_da_tabela ENABLE ROW LEVEL SECURITY;` imediatamente aplicado.
2. **Coluna de Paróquia Obrigatória (`parish_id`):** Todas as tabelas vinculadas a dados paroquiais (notícias, horários de missas, doações de dízimo, intenções de missa, configurações de tema) devem conter a coluna `parish_id` referenciando a tabela de paróquias.
3. **Políticas de Acesso Granulares:**
   * **Leitura Pública:** Restrita a dados explicitamente públicos (ex: avisos publicados, horários de missas ativos, templates de paróquias ativas).
   * **Administração Paroquial:** Apenas usuários autenticados vinculados àquela paróquia (`auth.uid() in (select user_id from parish_members where parish_id = ...)`) com role de secretário ou pároco podem criar, editar ou excluir registros.
   * **Super Admin da Ecclesiam:** Acesso restrito a relatórios agregados e gerenciamento de contratos/tenants, protegido por role `super_admin`.

---

## 2. 💳 Segurança no Módulo de Doações e Dízimo via PIX

O fluxo financeiro paroquial lida com valores sagrados de doações dos fiéis e dízimos comunitários.
1. **Proteção de Webhooks de Pagamento:**
   * Endpoints de webhook (ex: confirmação de liquidação de PIX) DEVEM validar rigorosamente as assinaturas criptográficas ou tokens de segurança enviados pelo gateway/banco parceiro antes de atualizar o status da doação.
   * Qualquer requisição com payload inválido ou assinatura divergente deve ser imediatamente rejeitada com status HTTP 401/403 e registrada em log de auditoria.
2. **Sem Armazenamento de Dados Sensíveis de Cartão:**
   * A plataforma não armazena dados de cartão de crédito. Operações financeiras são delegadas inteiramente a gateways homologados pelo Banco Central.
3. **Imutabilidade de Registros de Arrecadação:**
   * Transações PIX confirmadas não podem ser alteradas ou excluídas via interface comum, apenas estornadas ou conciliadas via trilha de auditoria contábil.

---

## 3. 🔐 Proteção de Variáveis de Ambiente e Chaves de API

1. **Nunca commitar chaves de produção:**
   * O arquivo `.env.local` está no `.gitignore`.
   * Chaves com privilégio elevado (`SUPABASE_SERVICE_ROLE_KEY`) **JAMAIS** devem ser expostas no código cliente (Next.js client-side components) e devem ser manipuladas unicamente em Server Actions, Route Handlers ou scripts administrativos protegidos.
   * Apenas variáveis com prefixo `NEXT_PUBLIC_` podem ser expostas ao navegador, restritas à URL do Supabase e à chave anônima pública (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).

---

## 4. ☁️ Infraestrutura, DNS e Proteção Cloudflare (Produção)

Antes do go-live definitivo de qualquer paróquia ou domínio principal:
1. **Proxy Cloudflare Ativo (Nuvem Laranja):** Oculta os IPs de origem dos servidores e protege contra ataques volumétricos DDoS.
2. **SSL/TLS Full (Strict):** Criptografia total fim-a-fim entre o navegador do fiel, o proxy e a infraestrutura de hospedagem (Vercel/Supabase).
3. **WAF e Bot Fight Mode:** Mitigação de scrapers automatizados e robôs maliciosos.

---

## 5. 📋 Checklist de Auditoria Periódica

- [ ] Todas as tabelas do Supabase possuem RLS ativado com políticas validadas.
- [ ] Nenhum arquivo `.env` ou credencial privada foi commitado no histórico Git.
- [ ] As consultas públicas retornam apenas dados permitidos da paróquia solicitada via slug/domínio.
- [ ] Todas as entradas de formulários públicos passam por sanitização e validação de schema (ex: Zod).
