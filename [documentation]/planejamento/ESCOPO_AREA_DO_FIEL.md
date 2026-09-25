# ⛪ Escopo de Arquitetura: Área Privada do Fiel ("Meu Espaço Paroquial")

> **Documento de Especificação Técnica e Funcional**  
> **Módulo:** Área do Fiel / Portal do Membro  
> **Status:** Aprovado via /grill-me  
> **Versão:** 1.0  
> **Data:** Setembro de 2026  

---

## 1. 📊 Avaliação de Limites e Escalabilidade (Supabase & Vercel)

### Supabase (Banco de Dados & Auth)
* **Capacidade de Usuários (Auth MAU):**
  * Plano Free: Até 50.000 usuários ativos/mês.
  * Plano Pro ($25/mês): Até 100.000 usuários ativos/mês inclusos.
  * *Diagnóstico:* Suporta com extrema folga a população de fiéis de qualquer paróquia ou diocese interiorana (Catedral de Colatina estimada em 15.000 fiéis).
* **Armazenamento de Dados:**
  * Cada cadastro de fiel (Nome, WhatsApp, CPF, Comunidade favorita, dados de dízimo) ocupa ~1 KB.
  * 100.000 fiéis cadastrados ocupam **apenas ~100 MB** (o plano Pro inclui 8.000 MB).
* **Alerta Crítico de Infraestrutura (SMTP Próprio):**
  * O servidor padrão de e-mail do Supabase no Free tem rate limit rígido de 30-60 envios/hora.
  * **Diretriz Mandatória:** Conectar um provedor transacional próprio (*Resend* ou *SendGrid*) no painel do Supabase (*Settings > Auth > SMTP*) para envio instantâneo de Magic Links / OTP de 6 dígitos sem risco de bloqueio em horários de pico de missas.

### Vercel (Hospedagem & Edge Frontend)
* **Banda & Tráfego:** 1 TB/mês no plano Pro suporta mais de 500.000 visitas mensais.
* **Escudo Cloudflare:** Com o proxy da Cloudflare ativo (Nuvem Laranja), 80%+ dos assets estáticos são servidos do cache de borda, poupando a cota da Vercel.
* **Sessões e SSR:** O pacote `@supabase/ssr` valida os cookies em milissegundos na Edge mais próxima do usuário (São Paulo / GRU1).

---

## 2. 🔐 Modelo de Autenticação Escolhido: Acesso sem Senha (Passwordless)

* **Método:** **Magic Link ou Código OTP de 6 Dígitos** enviado para o WhatsApp / E-mail do fiel.
* **Por que esta escolha?**
  * Elimina o atrito de esquecimento de senhas (problema recorrente para fiéis idosos ou com menor familiaridade tecnológica).
  * Cadastro instantâneo no primeiro acesso: digitou o WhatsApp/E-mail, recebeu o código e já está dentro do seu painel.

---

## 3. 📱 Os 4 Módulos Centrais do "Meu Espaço Paroquial"

### 3.1 Carteirinha Digital do Dizimista & Histórico de Partilha
* **Número de Dizimista:** Identificador único do fiel na secretaria paroquial.
* **Carteirinha Digital:** Cartão visual elegante com brasão da Catedral, nome do fiel e data de cadastro.
* **Histórico de Contribuições:** Lista transparente de doações e dízimos confirmados via PIX.
* **Dízimo com 1 Clique:** Botão direto que gera o QR Code PIX já associado ao CPF/Identificador do fiel.

### 3.2 Meus Agendamentos de Confissões e Atendimentos
* **Painel de Atendimentos:** Visualização clara das confissões e direções espirituais marcadas com os padres (Pe. Irineu, Pe. Deivid, Pe. Ernandes).
* **Status em Tempo Real:** `Pendente de Aprovação`, `Confirmado` ou `Realizado`.
* **Lembrete Automático:** Notificação com data, local (Secretaria da Catedral) e botão para cancelar com antecedência.

### 3.3 Minha Comunidade (CEB Favorita)
* **Vínculo Pastoral:** O fiel escolhe a sua capela habitual (ex: Matriz, Comunidade Perpétuo Socorro, Santa Luzia, etc.).
* **Feed Exclusivo:** O painel prioriza os horários de missas, tríduos e avisos daquela CEB específica.

### 3.4 Pedidos de Intenções de Santa Missa
* **Formulário Rápido de Intenção:** O fiel escolhe o motivo (Saúde dos Enfermos, Sufrágio de Falecidos, Ação de Graças, Aniversário) e a data da missa desejada.
* **Envio para o Livro do Altar:** As intenções aprovadas são impressas ou visualizadas diretamente pelos padres e ministros antes da celebração.

---

## 4. 🗄️ Modelagem de Dados Relacional (PostgreSQL / Supabase)

```sql
-- 1. Tabela de Perfil do Fiel (Membro)
CREATE TABLE IF NOT EXISTS public.parishioner_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    favorite_community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    document_cpf TEXT,
    tithing_number TEXT, -- Número de Dizimista
    birth_date DATE,
    address TEXT,
    is_tithing_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabela de Agendamentos de Confissões e Atendimentos
CREATE TABLE IF NOT EXISTS public.pastoral_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    clergy_id UUID NOT NULL REFERENCES public.clergy(id) ON DELETE CASCADE,
    parishioner_id UUID REFERENCES public.parishioner_profiles(id) ON DELETE SET NULL,
    parishioner_name TEXT NOT NULL,
    parishioner_whatsapp TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'confissao' CHECK (type IN ('confissao', 'direcao_espiritual', 'atendimento_geral', 'bencao')),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabela de Intenções de Santa Missa
CREATE TABLE IF NOT EXISTS public.mass_intentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parish_id UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
    community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
    parishioner_id UUID REFERENCES public.parishioner_profiles(id) ON DELETE SET NULL,
    target_name TEXT NOT NULL, -- Nome da pessoa ou família
    type TEXT NOT NULL DEFAULT 'falecimento' CHECK (type IN ('falecimento', 'saude', 'acao_de_gracas', 'aniversario', 'outros')),
    mass_date DATE NOT NULL,
    mass_time TIME,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'lida_no_altar')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
