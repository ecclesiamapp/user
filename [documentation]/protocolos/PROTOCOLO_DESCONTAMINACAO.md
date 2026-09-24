# 🧼 Protocolo de Descontaminação Acidental - Ecclesiam App

Este protocolo define os passos rápidos e definitivos para limpar e restabelecer o ambiente local caso ocorra uma **contaminação de cookies, tokens de autenticação ou sessões do Supabase** entre o **Ecclesiam App** e outras aplicações locais (como PlataformaShop).

---

## 🚨 Sinais de Contaminação
Você precisará executar este protocolo se observar:
1. **Loop Infinito de Redirecionamento**: O navegador fica alternando rapidamente entre `/admin/login` e `/admin/dashboard`.
2. **Erro `Failed to fetch` ou Sessão Fantasma**: O console do navegador exibe erros persistentes de autenticação ao tentar carregar dados da paróquia.
3. **Queda de Sessão Cruzada**: Fazer login em um app local desloga você de outro ou mistura perfis.

---

## 🛠️ Passo a Passo para Descontaminação

### Passo 01: Limpar o Armazenamento do Navegador (Client-side)
Como os navegadores compartilham cookies e LocalStorage entre portas sob o mesmo domínio `localhost`, limpe os dados salvos:

1. Acesse o endereço com problema (ex: `http://localhost:3000` ou `http://localhost:3001`).
2. Abra as Ferramentas do Desenvolvedor (**F12** ou `Ctrl + Shift + I`).
3. Vá para a aba **Application** (ou *Aplicativo* / *Armazenamento*).
4. No menu lateral esquerdo, clique no item **Storage** (ícone de banco de dados).
5. Clique no botão **`Clear site data`** (ou *Limpar dados do site*).
6. Feche a aba do navegador.

---

### Passo 02: Limpar o Cache do Compilador Next.js
Se o erro de roteamento persistir:

1. No terminal do Ecclesiam App, pare o servidor com **`Ctrl + C`**.
2. Remova a pasta de cache do Next.js:
   ```bash
   rmdir /s /q .next
   # Ou no PowerShell:
   # Remove-Item -Recurse -Force .next
   ```
3. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

### Passo 03: Usar Portas ou Hostnames Isolados
Para evitar conflito com outros projetos simultâneos:
* **Ecclesiam App**: Rodar preferencialmente em porta dedicada (ex: `npm run dev -- -p 3000` ou `-p 3001`).
* Testar em janela anônima para validar o isolamento de cookies e sessão.
