# 🚀 Guia Prático: Publicando a Apresentação em startagenciadigital.com.br/portal_catedral

A estrutura local do site já foi **criada, configurada e versionada** na pasta:
📂 **`C:\Users\Start\startagenciadigital-web`**

---

## 📁 Estrutura de Arquivos Pronta

```text
c:\Users\Start\startagenciadigital-web\
├── index.html                    <-- Home institucional elegante da Start Agência Digital
├── logo_start_agencia.png        <-- Logotipo oficial em alta definição
├── vercel.json                   <-- Configuração de cleanUrls (rotas limpas sem .html)
├── .gitignore                    <-- Ignora temporários e metadados da Vercel
└── portal_catedral/
    ├── index.html                <-- Apresentação completa com os 19 slides (Catedral + 11 CEBs)
    └── logo_start_agencia.png    <-- Logotipo da agência para o slide final 19
```

---

## 🧭 Passo a Passo para Colocar no Ar

### 1️⃣ Passo 1: Criar o Repositório no GitHub
1. Acesse o [GitHub](https://github.com/new).
2. Crie um novo repositório:
   * **Repository name:** `startagenciadigital-web` (ou nome de sua preferência).
   * **Visibility:** `Public` ou `Private` (a Vercel funciona com ambos).
   * **Importante:** Deixe as caixas *Add a README file*, *.gitignore* e *license* **desmarcadas** (já criamos tudo localmente).
3. Copie o comando de push do GitHub ou use os comandos abaixo:

Abra o terminal PowerShell e execute:
```powershell
cd C:\Users\Start\startagenciadigital-web
git remote add origin https://github.com/<SEU_USUARIO_OU_ORG>/startagenciadigital-web.git
git push -u origin main
```
*(Substitua `<SEU_USUARIO_OU_ORG>` pela sua conta ou organização do GitHub, ex: `startagenciadigital`).*

---

### 2️⃣ Passo 2: Importar e Fazer o Deploy na Vercel
1. Acesse seu painel na [Vercel](https://vercel.com/dashboard).
2. Clique no botão **"Add New..."** (canto superior direito) → **"Project"**.
3. Na lista de repositórios do GitHub, localize **`startagenciadigital-web`** e clique em **"Import"**.
4. Nas configurações do projeto:
   * **Framework Preset:** `Other` (já vem automático).
   * **Root Directory:** `./`
   * Não precisa alterar variáveis de ambiente nem comando de build.
5. Clique em **"Deploy"**.
6. Em cerca de 15 segundos, o site estará no ar com uma URL provisória gratuita (ex: `https://startagenciadigital-web.vercel.app`).
   * Você já pode testar: `https://startagenciadigital-web.vercel.app/portal_catedral`.

---

### 3️⃣ Passo 3: Conectar o Domínio `startagenciadigital.com.br`
1. No painel do seu projeto recém-criado na Vercel:
   * Acesse a aba **Settings** → **Domains**.
   * No campo de texto, digite: `startagenciadigital.com.br` e clique em **Add**.
   * A Vercel perguntará se deseja adicionar também o redirecionamento automático para `www.startagenciadigital.com.br` (Recomendado marcar Sim).
2. A Vercel mostrará o status **Invalid Configuration** e fornecerá exatamente os dados de DNS que você precisa inserir no seu registrador.

---

### 4️⃣ Passo 4: Configurar o DNS (Ex: no Registro.br)
Acesse a plataforma onde o domínio foi contratado (geralmente [Registro.br](https://registro.br)):
1. Faça login e clique sobre o domínio `startagenciadigital.com.br`.
2. Role até a seção **DNS** e clique em **Editar Zona** (ou **Configurar Endereçamento** se estiver no modo básico).
3. Adicione os dois registros fornecidos pela Vercel:

| Tipo | Nome / Entrada | Valor / Destino |
| :--- | :--- | :--- |
| **A** | `@` *(ou em branco)* | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

4. Clique em **Salvar**.

---

## ⚡ Resultado Final
* **Home da Agência:** `https://startagenciadigital.com.br`
* **Apresentação Executiva da Catedral:** **`https://startagenciadigital.com.br/portal_catedral`**
* Certificado de segurança SSL/HTTPS emitido automaticamente com cadeado verde.
* Se futuramente você editar qualquer slide no arquivo `index.html` da pasta `portal_catedral/` e der um `git push`, a Vercel atualiza tudo no ar automaticamente em menos de 1 minuto!
