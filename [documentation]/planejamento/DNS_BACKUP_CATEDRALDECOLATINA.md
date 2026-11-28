# 🛡️ Backup e Mapeamento Integral da Zona DNS: catedraldecolatina.org.br

> **Data da Extração:** 27 de Novembro de 2026 — 20:39 (Horário Local)  
> **Fonte:** Registro.br (Usuário `CACOL663`) & Servidores Autoritativos Locaweb  
> **Titular:** MDC - Paróquia Sagrado Coração de Jesus - Catedral (CNPJ: 31.800.170/0002-65)  
> **Status:** Mapeamento de Segurança Pré-Go Live com Preservação Integral de E-mails

---

## 1. Servidores DNS Autoritativos Atuais (Registro.br)
* **DNS 1:** `ns1.locaweb.com.br`
* **DNS 2:** `ns2.locaweb.com.br`

---

## 2. Apontamentos do Site Antigo / Domínio Raiz
| Tipo | Nome | Valor / Destino | TTL | Status / Observação |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (`catedraldecolatina.org.br`) | `191.252.51.206` | 3600 | IP Hospedagem Atual Locaweb (Site Antigo) |
| **CNAME** | `www` | `catedraldecolatina.org.br.` | 3600 | Aponta para o domínio raiz |

---

## 3. Registros de E-mail Paroquial (CRÍTICOS — PRESERVAÇÃO OBRIGATÓRIA)
> ⚠️ **Atenção:** Estes registros garantem o funcionamento contínuo do e-mail da secretaria, pároco e clero da Catedral. Nunca devem ser deletados.

| Tipo | Nome | Prioridade / Valor | Descrição |
| :--- | :--- | :--- | :--- |
| **MX** | `@` | `10 mx.core.locaweb.com.br.` | Servidor MX Primário Locaweb |
| **MX** | `@` | `20 mx.a.locaweb.com.br.` | Servidor MX Secundário Locaweb |
| **MX** | `@` | `20 mx.b.locaweb.com.br.` | Servidor MX Secundário Locaweb |
| **MX** | `@` | `20 mx.jk.locaweb.com.br.` | Servidor MX Secundário Locaweb |

---

## 4. Registros de Autenticação, SPF e Validação (TXT)
| Tipo | Nome | Valor | Finalidade |
| :--- | :--- | :--- | :--- |
| **TXT** | `@` | `v=spf1 include:_spf.locaweb.com.br -all` | SPF Antispam Oficial Locaweb (Evita que e-mails caiam no lixo) |
| **TXT** | `@` | `google-site-verification=7jwap_oSDXjKrDcNbj3g5FHRNCQB9XFWfRdwQCiDKbY` | Verificação de Propriedade no Google Search Console |

---

## 5. Subdomínios e Serviços de Webmail / Correio Eletrônico
| Subdomínio | Tipo | Destino | Observação |
| :--- | :--- | :--- | :--- |
| `webmail` | **CNAME** | `webmail.ita.locamail.com.br.` | Interface Webmail dos funcionários |
| `mail` | **CNAME** | `mail.ita.locamail.com.br.` | Acesso a clientes de e-mail (Outlook/Thunderbird) |
| `pop` | **CNAME** | `mail.ita.locamail.com.br.` | Protocolo POP3 |
| `smtp` | **CNAME** | `mail.ita.locamail.com.br.` | Envio SMTP |
| `imap` | **CNAME** | `mail.ita.locamail.com.br.` | Protocolo IMAP |
| `autodiscover` | **CNAME** | `autodiscover.email.locaweb.com.br.` | Configuração automática de contas de e-mail |
| `ftp` | **CNAME** | `catedraldecolatina.org.br.` | Acesso FTP legado |

---

## 6. Estratégia de Migração para Cloudflare (TASK-12)
Ao cadastrar o domínio na Cloudflare:
1. Replicar 100% dos registros acima na zona Cloudflare.
2. Garantir que os registros de e-mail (`MX`, `TXT`, `mail`, `pop`, `smtp`, `imap`, `webmail`) fiquem em **DNS Only (Nuvem Cinza)** para não interceptar tráfego de e-mail.
3. Para o site novo:
   * Criar `portal.catedraldecolatina.org.br` (`CNAME` -> `cname.vercel-dns.com`) com **Nuvem Laranja (Proxy)**.
   * Manter `@` e `www` apontando para `191.252.51.206` até o momento oficial da virada.
