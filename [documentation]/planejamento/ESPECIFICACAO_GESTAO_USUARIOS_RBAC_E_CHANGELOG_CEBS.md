# 🛡️ Especificação Técnica: Gestão de Usuários, RBAC Multi-Comunidades & Changelog Fraterno (TASK-43)

## 📌 Contexto & Decisões de Arquitetura (Alinhamento /grill-me)
Para garantir a paz e a harmonia pastoral entre a Paróquia Matriz e as 12 Comunidades Eclesiais de Base (CEBs), foi estabelecida a seguinte governança canônica e tecnológica:

1. **Multi-Comunidades Tenant Switcher:**
   - O painel da Paróquia possui visão mestre, mas permite alternar para o contexto dedicado de qualquer uma das 12 capelas via seletor global no topo (`AdminCommunitySwitcher`).
   - Quando uma capela está selecionada, um banner contextual dourado sinaliza que as edições serão aplicadas na LP daquela comunidade.

2. **Sidebar Adaptativa Canônica:**
   - Usuários com papel de **Coordenador de CEB** visualizam uma sidebar estritamente enxuta e travada na sua capela.
   - Itens globais da Matriz (Folhetos, Mensagens do Pároco, Assistente IA, Hub de Marca) são ocultados para manter o foco pastoral.

3. **Governança por Módulos Ativáveis:**
   - A Paróquia concede permissões granulares por checkboxes no perfil do coordenador:
     - `lp_geral`: Informações da Landing Page e Fotos
     - `cpc`: Conselho Pastoral Comunitário
     - `avisos`: Mural de Comunicados da Capela
     - `pastorais`: Pastorais e Grupos de Reflexão
     - `horarios`: Horários de Santa Missa e Celebrações da Palavra
     - `dizimo`: Dízimo e Chave PIX da Capela
     - `galerias`: Galerias de Fotos e Memória

4. **Fluxo de Auto-Cadastro & Aprovação:**
   - Lideranças que solicitam acesso entram no status `pendente`.
   - A Secretaria Paroquial ou o Pároco avalia a solicitação em `/admin/usuarios` na aba *Solicitações Pendentes*, definindo o cargo, a capela e os módulos permitidos antes da liberação.

5. **Prevenção de Atrito & Changelog Fraterno:**
   - Quando a Matriz edita dados de uma comunidade, é emitida uma "Nota Pastoral / Justificativa" que gera um Banner de Alerta destacado (`CommunityPastoralNoticeBanner`) no topo do painel do coordenador ("Confirmar Leitura e Ciência").
   - A Matriz possui a aba *Auditoria & Changelog Fraterno* para acompanhar em tempo real as movimentações das 12 CEBs.

---

## 🏛️ Modelagem de Dados no Supabase

### Tabela `public.user_profiles`
- `id` (UUID, PK)
- `user_id` (UUID, FK auth.users)
- `name` (TEXT)
- `email` (TEXT, UNIQUE)
- `phone` (TEXT)
- `role` (`paroco`, `vigario`, `secretaria`, `pascom`, `coordenador_ceb`)
- `community_id` (UUID, FK communities)
- `status` (`pendente`, `ativo`, `bloqueado`)
- `allowed_modules` (JSONB)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### Tabela `public.community_activity_logs`
- `id` (UUID, PK)
- `community_id` (UUID, FK communities)
- `user_id` (UUID, FK auth.users)
- `author_name` (TEXT)
- `author_role` (`paroquia`, `coordenador`)
- `action_type` (TEXT)
- `pastoral_note` (TEXT)
- `changes_summary` (TEXT)
- `is_read_by_community` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMPTZ)
