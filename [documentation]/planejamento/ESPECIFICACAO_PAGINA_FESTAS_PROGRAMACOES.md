# 📋 Especificação Técnica: Grandes Festas, Solenidades & Programações Litúrgicas Especiais
> **Módulo:** Festas Pontuais, Semana Santa, Padroeiros & Solenidades da Catedral e das 12 CEBs  
> **Status:** Aprovado via `/grill-me` (22/10/2026)  
> **Referência:** Decisões Arquiteturais Alinhadas com o Desenvolvedor  

---

## 🎯 1. Visão Geral & Problema a Resolver

As paróquias católicas vivem em ritmo litúrgico dinâmico, marcado por **grandes celebrações e festas pontuais ao longo de todo o ano**:
1. **Festas de Padroeiros Paroquiais:** Solenidade do Sagrado Coração de Jesus (Padroeiro Principal) e Festa da Co-Padroeira (próxima grande festividade da Catedral).
2. **Grandes Solenidades do Calendário Universal:** Semana Santa / Tríduo Pascal (Domingo de Ramos, Quinta-feira Santa, Sexta-feira da Paixão, Vigília Pascal e Páscoa), Corpus Christi (tapetes e procissões) e Novena/Festa de Natal.
3. **Festas de Padroeiros das 12 Comunidades (CEBs):** Festa de São Francisco de Assis, Tríduo de Santa Luzia, Novena de Nossa Senhora do Perpétuo Socorro, Festa de São Pedro, etc.

Atualmente, essas programações ricas eram divulgadas apenas em cartazes impressos ou posts isolados de redes sociais que se perdiam com facilidade.

**Objetivo do Módulo:** Criar um sistema completo de **Landing Pages Dinâmicas de Festas (`/programacao/[slug]`)** alimentadas por um **Construtor Visual no Painel Administrativo (`/admin/programacao`)**, com banner de contagem regressiva na Home, alertas na página de horários, compartilhamento rápido no WhatsApp e integração direta com os mini-sites das 12 CEBs.

---

## 🌐 2. Experiência do Fiel (Portal Público)

### 2.1 Estrutura de URLs
* **URL Canônica da Festa:** `/programacao/[slug]` (ex: `/programacao/festa-copadroeira-2026`, `/programacao/semana-santa-2027`, `/programacao/festa-sagrado-coracao-2027`).
* **Diretório Geral de Programações:** `/programacao` (listagem de festas vigentes e acervo das edições anteriores).

### 2.2 Anatomia da Landing Page da Festa
A página de cada festa é projetada no padrão *Mobile-First Extremo* com estética sacra premium:

1. **Topo / Hero Monumental:**
   * Cartaz oficial da festa em alta resolução (com suporte a visualização ampliada/lightbox).
   * Selo litúrgico temático da festividade.
   * Título Solene (ex: *Festa da Co-Padroeira 2026 • Catedral de Colatina*).
   * Tema e Lema canônico da festa (ex: *"Com Maria, peregrinos da oração e da esperança"*).
   * Período de realização com destaque (ex: *18 a 27 de Outubro de 2026*).
   * Botão de Rota GPS para o local do evento (Matriz ou comunidade da CEB no Google Maps e Waze).
   * Botão rápido: *"Compartilhar Programação no WhatsApp"*.
   * Botão de download do Cartaz Oficial em PDF / Imagem.

2. **Linha do Tempo (Timeline) Interativa Dia a Dia:**
   * **Seletor de Datas em Abas Horizontais com Swipe:** Permite navegar facilmente entre os dias (ex: *Qui 18/10*, *Sex 19/10*, *Sáb 20/10*, *Dom 21/10*).
   * **Card Detalhado de Cada Dia:**
     * **Título do Dia:** (ex: *1º Dia da Novena • Noite das Famílias*).
     * **Horário e Tipo de Celebração:** (ex: *19:30h — Santa Missa Solene*).
     * **Sacerdote Celebrante:** Nome e foto/avatar do padre celebrante ou pregador convidado.
     * **Comunidade / Pastoral Responsável:** (ex: *Liturgia: Pastoral Familiar e ECC*).
     * **Gesto Concreto / Doação do Dia:** (ex: *Arrecadação de 1kg de alimento para as famílias assistidas pelos Vicentinos*).
     * **Programação Cultural / Festiva:** Horários de barracas, quermesse, cantina, leilão e apresentações musicais católicas.

3. **Integração com Mini-Sites das 12 Comunidades (`/comunidades/[slug]`):**
   * Quando uma festa estiver vinculada a uma CEB (ex: Comunidade São Francisco), a própria página daquela comunidade exibirá um card de destaque da festa com contagem regressiva e acesso direto à programação completa da comunidade.

4. **Gatilhos de Notificação no Portal:**
   * **Na Home (`/`):** Banner hero no topo com contagem regressiva (*"Faltam 3 dias para a Festa da Co-Padroeira • Confira a programação"*).
   * **Na Página de Horários (`/horarios`):** Alerta fixo no topo: *"⚠️ Horários especiais em vigor devido à festividade. Clique aqui para conferir a grade oficial da festa."*

---

## 🛠️ 3. Painel Administrativo (`/admin/programacao`)

### 3.1 Construtor Visual Modular (Schedule Builder)
A secretária ou equipe da PASCOM não precisa digitar HTML ou formatações complexas:
1. **Dados Gerais da Festa:**
   * Título da Festa e Slug automático.
   * Tipo da Festa: `copadroeira` | `padroeiro_matriz` | `liturgico_global` (Semana Santa, Corpus Christi, Natal) | `padroeiro_ceb` (Festa de Comunidade).
   * Comunidade Vinculada: Seleção entre as 12 CEBs ou Matriz Sagrado Coração.
   * Tema, Lema e Texto Pastoral de Abertura.
   * Datas: Início e Encerramento.
   * Upload de Cartaz/Banner para o Supabase Storage (`event_assets`).
   * Status: `rascunho`, `destaque_ativo` (com contagem regressiva), `encerrado`.
2. **Construtor Dia a Dia:**
   * Botão intuitivo: **"+ Adicionar Dia na Programação"**.
   * Em cada dia:
     * Data e Nome do Dia (ex: *"Missa dos Enfermos"*, *"Tríduo - 2º Dia"*).
     * Lista de Atividades com Horário, Celebrante, Pastoral Convidada e Gesto Concreto.
     * Detalhes sociais (barraquinhas, shows, quermesse).
   * **Simulador Live Preview ao Vivo:** Visualização lado a lado de como o card vai aparecer na tela do celular do fiel antes de publicar.

---

## 🗄️ 4. Modelagem de Dados no Supabase

### 4.1 Tabela `public.parish_special_events` (Festas e Solenidades)
```sql
CREATE TABLE IF NOT EXISTS public.parish_special_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id uuid NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL,
  event_type text NOT NULL CHECK (
    event_type IN ('copadroeira', 'padroeiro_matriz', 'liturgico_global', 'padroeiro_ceb', 'solenidade_especial')
  ),
  theme text,
  motto text,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  banner_url text,
  poster_pdf_url text,
  is_featured_home boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'destaque_ativo' CHECK (
    status IN ('rascunho', 'destaque_ativo', 'encerrado')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_event_slug_per_parish UNIQUE (parish_id, slug)
);
```

### 4.2 Tabela `public.parish_event_days` (Dias e Itens da Programação)
```sql
CREATE TABLE IF NOT EXISTS public.parish_event_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.parish_special_events(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  day_title text NOT NULL,
  day_subtitle text,
  liturgical_color text DEFAULT 'branco',
  celebrant_name text,
  gesture_of_charity text,
  responsible_group text,
  social_attractions text,
  schedule_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_index integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

---

## ⏱️ 5. Quebra em Tarefas & Estimativa de Tempo de Execução

Conforme a diretriz mandatória de previsibilidade:

| Task ID | Descrição Cirúrgica | Arquivos Afetados | ⏱️ Tempo Estimado |
|:---:|---|---|:---:|
| **TASK-45** | **Modelagem Supabase & Storage:** Criação das tabelas `parish_special_events`, `parish_event_days`, bucket `event_assets` e políticas RLS seguras. | `supabase/migrations/20270301_create_special_events_and_schedules.sql` | `~35 minutos` |
| **TASK-46** | **Dashboard Administrativo (`/admin/programacao`):** Construtor visual de programação dia a dia com upload de cartaz e prévia ao vivo. | `app/admin/programacao/page.tsx`, `components/admin/programacao/` | `~60 minutos` |
| **TASK-47** | **Landing Page Pública da Festa (`/programacao/[slug]`):** Hero monumental, linha do tempo por abas com swipe, rota GPS e download do cartaz. | `app/programacao/[slug]/page.tsx`, `components/programacao/` | `~50 minutos` |
| **TASK-48** | **Integração de Banners & Divulgação:** Banner de contagem regressiva na Home da Catedral, destaque na LP da CEB correspondente e alerta em `/horarios`. | `app/page.tsx`, `app/horarios/page.tsx`, `app/comunidades/[slug]/page.tsx` | `~40 minutos` |
