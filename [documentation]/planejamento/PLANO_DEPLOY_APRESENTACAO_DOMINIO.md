# Plano de Implementação: Publicação da Apresentação em startagenciadigital.com.br/portal_catedral

## 🎯 Objetivo
Colocar a apresentação executiva da Catedral de Colatina online, acessível publicamente no endereço:
**`https://startagenciadigital.com.br/portal_catedral`**
utilizando GitHub para versionamento, Vercel para hospedagem global de alta velocidade (Edge Network + SSL automático) e a zona DNS do domínio `startagenciadigital.com.br`.

---

## 🏗️ Arquitetura da Solução

Para que a rota `/portal_catedral` funcione de forma limpa, elegante e sem expor extensões como `.html`, utilizaremos a estrutura padrão de pastas estáticas suportada nativamente pela Vercel:

```text
repositório (ex: site-startagenciadigital)
├── index.html                    <-- Home institucional da Start Agência Digital (ou página de boas-vindas)
├── portal_catedral/
│   ├── index.html                <-- Apresentação completa dos 19 slides (renomeada de apresentacao_catedral_pe_irineu.html)
│   └── logo_start_agencia.png    <-- Imagem do logotipo da Start Agência Digital
└── vercel.json                   <-- Configuração de cleanUrls e redirecionamentos amigáveis
```

---

## 📋 Passo a Passo Executivo

### Fase 1: Preparação do Pacote Web Local
1. Criar a pasta do projeto da agência: `c:\Users\Start\startagenciadigital-web` (ou nome de sua preferência).
2. Criar a subpasta `portal_catedral/`.
3. Copiar `apresentacao_catedral_pe_irineu.html` para `portal_catedral/index.html`.
4. Copiar `logo_start_agencia.png` para dentro de `portal_catedral/`.
5. Criar um `index.html` moderno e minimalista na raiz para quem acessar apenas `startagenciadigital.com.br`.
6. Criar `vercel.json` com:
   ```json
   {
     "cleanUrls": true,
     "trailingSlash": false
   }
   ```

### Fase 2: Versionamento no GitHub
1. Inicializar o repositório git local (`git init`).
2. Criar o repositório remoto no GitHub (ex: `https://github.com/startagenciadigital/startagenciadigital-web` ou sob sua conta pessoal).
3. Fazer o commit e push da branch `main`:
   ```bash
   git add .
   git commit -m "feat: estrutura inicial com apresentacao catedral em /portal_catedral"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/startagenciadigital-web.git
   git push -u origin main
   ```

### Fase 3: Conexão e Deploy na Vercel
1. Acessar o painel da [Vercel](https://vercel.com).
2. Clicar em **"Add New..."** → **"Project"**.
3. Selecionar o repositório `startagenciadigital-web` do GitHub.
4. Clicar em **"Deploy"** (Deploy em segundos, gerando uma URL `.vercel.app`).
5. Testar o acesso provisório: `https://<projeto>.vercel.app/portal_catedral`.

### Fase 4: Configuração do Domínio `startagenciadigital.com.br`
1. No painel do projeto na Vercel:
   * Ir em **Settings** → **Domains**.
   * Adicionar `startagenciadigital.com.br` e `www.startagenciadigital.com.br`.
2. A Vercel fornecerá os registros DNS exatos necessários:
   * **Registro Tipo A:**
     * Nome/Host: `@` (ou vazio)
     * Valor/Destino: `76.76.21.21`
   * **Registro Tipo CNAME (para o www):**
     * Nome/Host: `www`
     * Valor/Destino: `cname.vercel-dns.com`
3. Acessar o painel onde o domínio está registrado (geralmente [Registro.br](https://registro.br)):
   * Ir na aba **DNS** → **Editar Zona**.
   * Inserir os registros A e CNAME informados pela Vercel.
4. Salvar. A propagação do DNS no Registro.br costuma levar de 5 a 30 minutos.
5. A Vercel emitirá automaticamente o certificado SSL (cadeado verde/HTTPS).

---

## 🛡️ Vantagens Desta Abordagem
1. **URL de Prestígio:** Você apresentará para o Pe. Irineu em um link oficial da sua agência (`startagenciadigital.com.br/portal_catedral`).
2. **Carregamento Instantâneo:** Hospedado na CDN mundial da Vercel com cache em São Paulo.
3. **Controle Total:** Se você atualizar qualquer slide, basta alterar o arquivo e fazer `git push` — a Vercel atualiza o link em menos de 1 minuto.
4. **Isolamento de Segurança:** Mantém a apresentação independente do código-fonte do SaaS `ecclesiam-app`, protegendo as chaves de API e banco de dados.

---

## ❓ Decisão do Usuário
Deseja que criemos e configuremos a pasta local `c:\Users\Start\startagenciadigital-web` agora com todos os arquivos prontos para você conectar ao GitHub e Vercel?
