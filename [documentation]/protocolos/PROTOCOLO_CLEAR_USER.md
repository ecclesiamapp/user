# 🧹 Protocolo de Limpeza de Usuários de Teste - Ecclesiam App

Este protocolo define como realizar a limpeza em lote de usuários de teste criados no **Supabase Auth** durante a fase de desenvolvimento, mantendo protegida a conta principal de administrador da plataforma.

---

## Script Utilitário (`clear_users.ts`)

Quando for necessário expurgar usuários de teste, crie temporariamente o arquivo `clear_users.ts` na raiz do projeto:

```typescript
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Carrega as variáveis de ambiente locais
dotenv.config({ path: "./.env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltam variáveis de ambiente (NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY) no .env.local");
}

// Inicializa o cliente com Service Role para bypass do RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function clearTestUsers() {
  console.log("Buscando usuários cadastrados...");
  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    console.error("Erro ao buscar usuários:", error);
    return;
  }

  if (!users || users.users.length === 0) {
    console.log("Nenhum usuário encontrado para deletar.");
    return;
  }

  console.log(`Encontrados ${users.users.length} usuário(s). Deletando...`);

  // E-mails protegidos do dono do app / super admins da Ecclesiam
  const protectedEmails = [
    "admin@ecclesiam.com",
    "contato@ecclesiam.app"
  ];

  for (const user of users.users) {
    if (user.email && protectedEmails.includes(user.email)) {
      console.log(`[PULADO] E-mail: ${user.email} (Administrador Principal)`);
      continue;
    }

    console.log(`[DELETE] E-mail: ${user.email} | ID: ${user.id}`);
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error(`Erro ao deletar ${user.email}:`, deleteError);
    } else {
      console.log(`✓ Usuário ${user.email} deletado com sucesso.`);
    }
  }
  
  console.log("Limpeza de usuários concluída!");
}

clearTestUsers();
```

## Como Executar

Execute o comando no terminal na raiz do projeto:

```bash
npx tsx clear_users.ts
```

> **Aviso de Segurança**: NUNCA commite este arquivo no Git e NUNCA o execute apontando para credenciais de Produção. Após o uso em ambiente local/desenvolvimento, remova o arquivo `clear_users.ts`.
