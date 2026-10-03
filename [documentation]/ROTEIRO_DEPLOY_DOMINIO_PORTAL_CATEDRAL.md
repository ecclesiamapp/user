# 🚀 Roteiro de Implementação: Publicação da Apresentação da Catedral em startagenciadigital.com.br/portal_catedral

Este documento é a especificação e guia de execução para a publicação online da **Apresentação Executiva da Catedral do Sagrado Coração de Jesus** no domínio da **Start Agência Digital** (`https://startagenciadigital.com.br/portal_catedral`).

---

## 📌 Sumário Executivo

* **Domínio Oficial:** `startagenciadigital.com.br`
* **Slug Alvo da Apresentação:** `/portal_catedral`
* **URL Final de Produção:** `https://startagenciadigital.com.br/portal_catedral`
* **URL da Home da Agência:** `https://startagenciadigital.com.br`
* **Infraestrutura:** Vercel (Edge Network Global com SSL automático)
* **Controle de Versão:** GitHub (`startagenciadigital-web`)
* **Registrador de Domínio:** Registro.br (ou provedor DNS ativo)
* **Diretório Local Preparado:** `C:\Users\Start\startagenciadigital-web\`

---

## 🏛️ Estado Atual da Preparação Local

A estrutura local já foi totalmente gerada, testada e versionada no Git local em:
📂 `C:\Users\Start\startagenciadigital-web\`

### Estrutura de Arquivos no Disco:
```text
C:\Users\Start\startagenciadigital-web\
├── index.html                    <-- Home institucional moderna da Start Agência Digital
├── logo_start_agencia.png        <-- Logotipo oficial em alta resolução
├── vercel.json                   <-- Configuração de cleanUrls (elimina .html da URL)
├── .gitignore                    <-- Ignora arquivos de build e cache
├── README.md                     <-- Instruções do repositório
└── portal_catedral/
    ├── index.html                <-- Apresentação completa com os 19 slides (Catedral + 11 CEBs)
    └── logo_start_agencia.png    <-- Logotipo da agência renderizado no Slide 19
```

---

## 📋 Checklist de Execução Futura (Passo a Passo)

Quando você decidir ativar a publicação online, siga estas 4 etapas sequenciais:

---

### ETAPA 1: Subir o Repositório para o GitHub

1. Acesse **[github.com/new](https://github.com/new)**.
2. Preencha as informações:
   * **Owner:** Selecione sua conta pessoal ou a organização `startagenciadigital`.
   * **Repository name:** `startagenciadigital-web`
   * **Description:** *Site institucional da Start Agência Digital e apresentação executiva da Catedral de Colatina.*
   * **Visibility:** Escolha `Public` ou `Private` (ambas funcionam na Vercel).
   * ⚠️ **Atenção:** **NÃO** marque as caixas de "Add a README file", ".gitignore" ou "license" (o projeto já está 100% versionado localmente).
3. Clique em **"Create repository"**.
4. No terminal PowerShell, execute os comandos:
   ```powershell
   cd C:\Users\Start\startagenciadigital-web
   git remote add origin https://github.com/startagenciadigital/startagenciadigital-web.git
   git push -u origin main
   ```
   *(Caso utilize seu usuário pessoal do GitHub em vez da organização, ajuste a URL do comando acima).*

---

### ETAPA 2: Importar e Fazer Deploy na Vercel

1. Acesse o painel da **[Vercel](https://vercel.com/dashboard)**.
2. Clique no botão azul **"Add New..."** no canto superior direito e selecione **"Project"**.
3. Na lista de repositórios do GitHub, localize **`startagenciadigital-web`** e clique em **"Import"**.
4. Verifique as configurações:
   * **Framework Preset:** `Other` (já identificado automaticamente).
   * **Root Directory:** `./`
   * **Build and Output Settings:** Deixe os valores padrões (não precisa mexer).
   * **Environment Variables:** Nenhuma variável é necessária (o site é 100% estático e ultrarrápido).
5. Clique em **"Deploy"**.
6. Aguarde ~15 a 30 segundos. A Vercel gerará o link provisório do projeto (exemplo: `https://startagenciadigital-web.vercel.app`).
7. **Validação Preliminar:** Acesse `https://startagenciadigital-web.vercel.app/portal_catedral` e confira a apresentação funcionando perfeitamente online.

---

### ETAPA 3: Vincular o Domínio `startagenciadigital.com.br` na Vercel

1. No painel do projeto recém-criado na Vercel:
   * Vá até a aba **Settings** (topo da página) → **Domains** (menu lateral).
2. No campo **Domain**, digite:
   `startagenciadigital.com.br`
3. Clique em **"Add"**.
4. A Vercel exibirá um modal recomendando adicionar também o redirecionamento com `www`:
   * Selecione a opção recomendada: **"Add startagenciadigital.com.br and redirect www.startagenciadigital.com.br to it"** (ou vice-versa).
5. O status aparecerá inicialmente como **"Invalid Configuration"** com os registros de DNS exatos a serem criados.

---

### ETAPA 4: Configuração dos Registros DNS no Provedor (ex: Registro.br)

1. Acesse a plataforma onde o domínio está registrado (geralmente [registro.br](https://registro.br)):
2. Faça login com sua conta e clique no domínio **`startagenciadigital.com.br`**.
3. Role até a seção **DNS** e clique em **Editar Zona** (ou **Configurar Endereçamento** se estiver usando o DNS básico do Registro.br).
4. Insira os dois registros DNS oficiais da Vercel:

| Tipo | Nome / Entrada (Host) | Valor / Destino (Dados) | Finalidade |
| :--- | :--- | :--- | :--- |
| **A** | `@` *(ou deixe vazio se o painel exigir)* | `76.76.21.21` | Aponta o domínio raiz para o IP Anycast da Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com` | Aponta o subdomínio www com redundância global |

5. Clique em **"Salvar Alterações"**.

> [!NOTE]
> **Tempo de Propagação do DNS:**
> No Registro.br, as atualizações de zona DNS ocorrem a cada 30 minutos (nos minutos 00 e 30 de cada hora). Assim que a zona propagar, a Vercel emitirá automaticamente o certificado SSL/HTTPS gratuito Let's Encrypt.

---

## 🌐 URLs Finais Ativas

Após a propagação, estarão disponíveis:
* 🏛️ **Apresentação Paroquial da Catedral:**
  👉 **`https://startagenciadigital.com.br/portal_catedral`**
* 🏢 **Portal Institucional da Start Agência Digital:**
  👉 **`https://startagenciadigital.com.br`**

---

## 🔄 Como Atualizar a Apresentação Futuramente

Se você fizer qualquer ajuste nos textos, fotos ou valores da apresentação no futuro:
1. Abra e edite o arquivo `C:\Users\Start\startagenciadigital-web\portal_catedral\index.html`.
2. No terminal, execute:
   ```powershell
   cd C:\Users\Start\startagenciadigital-web
   git add .
   git commit -m "update: atualiza dados da apresentacao da catedral"
   git push origin main
   ```
3. A Vercel detectará o push automaticamente e atualizará o site no ar em menos de **1 minuto**, sem downtime e sem você precisar configurar nada!

---

## 🛡️ Sincronização e Custódia do Documento
Este roteiro foi sincronizado de forma permanente nos seguintes locais do ecossistema:
1. `C:\Users\Start\ecclesiam-app\[documentation]\ROTEIRO_DEPLOY_DOMINIO_PORTAL_CATEDRAL.md`
2. `C:\Users\Start\ecclesiam-app\[documentation]\planejamento\ROTEIRO_DEPLOY_DOMINIO_PORTAL_CATEDRAL.md`
3. `C:\Users\Start\ecclesiam-app\ROTEIRO_DEPLOY_DOMINIO_PORTAL_CATEDRAL.md`
4. `C:\Users\Start\startagenciadigital-web\README.md`
5. `g:\Meu Drive\TRABALHOS\01 - NEGÓCIOS E PROJETOS ATIVOS\ECCLESIAN APP\AGENTE DE IA - ECCLESIAM\ROTEIRO_DEPLOY_DOMINIO_PORTAL_CATEDRAL.md`
