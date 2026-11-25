# 🛡️ Guia Oficial de Apontamento DNS & Escudo Cloudflare (TASK-12)
## Catedral do Sagrado Coração de Jesus — Diocese de Colatina
> **Domínio Oficial:** `catedraldecolatina.org.br`  
> **Destino:** Vercel Inc. (Infraestrutura Oficial Ecclesiam App)  
> **Segurança:** Cloudflare Free Tier (Proxy Ativo + SSL Full Strict + WAF Anti-Bot)  
> **Data:** 24 de Novembro de 2026

---

### 1. Instruções para a Mitra Diocesana / Registro.br (Mudança de Nameservers)

Para ativar a proteção DDoS gratuita e o CDN da Cloudflare sem custo, solicite ao responsável técnico do domínio `catedraldecolatina.org.br` no **Registro.br**:

1. Acessar o painel do domínio no Registro.br.
2. Na seção **DNS**, alterar os Servidores DNS para:
   * **Master (DNS 1):** `dns1.cloudflare.com` *(ou os nomes atribuídos na conta Cloudflare do projeto)*
   * **Slave 1 (DNS 2):** `dns2.cloudflare.com`

---

### 2. Tabela de Registros DNS Obrigatórios (No Painel Cloudflare)

| Tipo | Nome (Host) | Conteúdo / Destino | Proxy Status (Nuvem) | TTL | Finalidade |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **A** | `@` *(raiz)* | `76.76.21.21` | 🟠 **Proxied (Laranja)** | Auto | Apontamento da raiz para o Edge Global da Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com` | 🟠 **Proxied (Laranja)** | Auto | Redirecionamento canônico www ➔ raiz |
| **CNAME** | `app` | `cname.vercel-dns.com` | 🟠 **Proxied (Laranja)** | Auto | Acesso direto PWA / Mobile |
| **TXT** | `@` | `_vercel=...` *(código de verificação fornecido no Vercel Project Domains)* | ⚪ DNS Only | Auto | Verificação de propriedade SSL na Vercel |

---

### 3. Configurações de Segurança Obrigatórias no Painel Cloudflare

#### 🔒 A. Criptografia & SSL/TLS:
* **Modo de Criptografia:** **Full (Strict)** — Garante criptografia de ponta a ponta entre o navegador do fiel, o proxy da Cloudflare e o servidor da Vercel.
* **Always Use HTTPS:** **Ativado (On)** — Força redirecionamento automático de qualquer tráfego HTTP para HTTPS.
* **Minimum TLS Version:** **TLS 1.2** — Bloqueia protocolos antigos e inseguros.
* **Automatic HTTPS Rewrites:** **Ativado (On)** — Corrige links mistos automaticamente.

#### 🛡️ B. Firewall / WAF (Web Application Firewall) & Proteção Anti-Bot:
1. **Bot Fight Mode:** **Ativado (On)** — Bloqueia automaticamente scrapers maliciosos e bots de brute-force conhecidos antes mesmo de tocarem na aplicação.
2. **Regra de Rate Limiting (Proteção contra Inundação de API):**
   * **Expressão:** `http.request.uri.path contains "/api/secretaria/" or http.request.uri.path contains "/api/auth/"`
   * **Limite:** 20 requisições por minuto por IP.
   * **Ação:** Bloquear por 10 minutos (Block for 10 minutes) ou Desafio Interativo (Managed Challenge).
3. **Bloqueio Geográfico (Opcional recomendado):**
   * Como a Catedral opera em Colatina/ES, desafiar com CAPTCHA acessos de países conhecidos por redes zumbis de bots de varredura (ex.: Rússia, China, Bielorrússia) que tentam acessar `/api/**` ou `/admin/**`.

---

### 4. Checklist de Homologação Pós-Virada DNS:
- [ ] Testar `https://catedraldecolatina.org.br` no navegador e conferir se o certificado SSL exibe a autoridade Cloudflare.
- [ ] Testar redirecionamento de `http://` para `https://`.
- [ ] Confirmar se o status do domínio no painel da Vercel está com badge verde `Valid Configuration`.
- [ ] Executar o teste de envio de Intenção de Missa e Agendamento para validar que os cabeçalhos `x-forwarded-for` estão passando os IPs reais dos fiéis.
