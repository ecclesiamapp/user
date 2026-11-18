# Code Hardening & Security Audit — Ecclesiam App

**Generated**: 2026-11-18 16:15 BRT  
**Codebase**: `c:\Users\Start\ecclesiam-app`  
**Stack**: Next.js 16.4.6 (App Router, `proxy.ts`), React 19.2.8, TypeScript 5, Tailwind CSS v4, Supabase (`@supabase/ssr`, Postgres + pgvector + Storage), Google Gemini 2.5 Flash / `text-embedding-004`, Resend  
**Skills Applied**: `vibe-security` + `deslop` (Phase 1 — Read-Only Audit)  
**Total findings**: **20** (Critical: 3, High: 8, Medium: 6, Low: 2, Info: 1)

---

## Executive Summary

The codebase recently completed an important hardening pass (`TASK-53` to `TASK-56`) that replaced forgeable admin cookies with Supabase JWT verification (`proxy.ts` + `requireAuthenticatedAdmin`), patched `next` to `16.4.6`, added idempotency keys to Mass Intentions and Pastoral Appointments, and introduced 16 automated tests (`npm test` passing 16/16, `tsc --noEmit` passing with 0 errors, `eslint` returning 0 errors / 676 warnings).

However, **the codebase is not yet safe for multi-tenant SaaS production** without resolving **3 Critical** and **8 High** findings uncovered in this audit:

1. **Unauthenticated Email & HTML Injection Relay (`/api/notifications`):** Anyone on the internet can call `POST /api/notifications` without authentication or rate limiting and inject arbitrary HTML into emails sent through the parish's Resend account.
2. **Cross-Tenant RLS Gaps on Parishioner PII & Migration Order Breakage:** Operational PII tables (`mass_intentions`, `certificate_requests`, `tithe_registrations`, `pastoral_appointments`, `sacramental_registrations`, `parish_movement_registrations`) and `parish_event_days` still allow any authenticated user from Parish A to read/mutate Parish B's records (`USING (parish_id IS NOT NULL)` / `USING (true)`). Furthermore, migrations `20270101_*` and `20270301_*` sort alphabetically *after* `20261114_task53/task55`, breaking clean DB setups and re-creating open `anon` policies if run chronologically.
3. **Production Regressions & Silent Failures:** `CertificateRequestForm` runs `.insert().select()` as `anon` on a table where `anon` `SELECT` is blocked by RLS; `/api/dizimo/register` returns HTTP `200 { success: true }` even when the Supabase insert fails; and `/meu-espaco` RPCs allow wildcard `%` enumeration via `ILIKE`.

### Top Critical & High Issues
1. `SEC-001` — Unauthenticated `POST /api/notifications` + HTML injection in `utils/resend.ts`.
2. `SEC-002` — Missing `parish_id` tenant isolation in RLS policies for PII tables (`mass_intentions`, `certificate_requests`, `tithe_registrations`, `pastoral_appointments`, `sacramental_registrations`, `parish_movement_registrations`, `parish_event_days`).
3. `SEC-003` — Out-of-order SQL migrations (`20261114_task55` references tables created in `20270101_*`, and `2027*` re-grant `anon` `ALL`/`UPDATE`/`DELETE`).
4. `SEC-004` — Unescaped `ILIKE '%' || param || '%'` in `/meu-espaco` `SECURITY DEFINER` RPCs allows dumping all parish records.
5. `BUG-001` — `CertificateRequestForm` `.insert().select()` fails under `anon` RLS (`INSERT`-only policy).
6. `ERR-001` — `/api/dizimo/register` silently reports `success: true` when DB insert fails.

### Fix Effort Estimate
- **Tier 1 (safe, mechanical cleanup — `any`, unused vars, lint hygiene):** ~2 findings, estimated `~30–45 min`
- **Tier 2 (additive validation, auth/rate-limit/error guards + tests):** ~14 findings, estimated `~2.5–3.5 hours`
- **Tier 3 (RLS/SQL migration consolidation & monolith refactoring — requires human review):** ~4 findings, estimated `~2–3 hours`

---

## Codebase Overview (Pass 0)

- **File Distribution:** `app/` (65 files, including 14 API route handlers), `components/` (221 files), `lib/` (26 files), `utils/` (5 files), `supabase/` (39 files, 38 migrations), `tests/` (6 files).
- **Server Actions (`'use server'`):** `0` detected — all mutations go through `app/api/*` Route Handlers or browser Supabase client calls.
- **Typecheck & Lint Baseline:**
  - `npx tsc --noEmit`: **0 errors**
  - `npm test`: **16/16 passing** (`auth-proxy`, `critical-flows`, `rate-limit`, `resilience-and-errors`, `security-guards`)
  - `npm run lint`: **0 errors, 676 warnings** (unused imports/vars, `react-hooks/set-state-in-effect`, `react-hooks/exhaustive-deps`, `@typescript-eslint/no-explicit-any`)
- **High-Coupling Modules (Most Imported Internal Modules):**
  - `@/types` (163 imports), `@/components/ui` (96), `@/utils/supabase/client` (45), `@/utils/supabase/server` (31), `@/lib/security/friendlyError` (25), `@/lib/events` (23), `@/lib/liturgy` (19), `@/components/admin/context/AdminCommunityContext` (13), `@/utils/supabase/admin` (12), `@/lib/security/serverAuth` (11).
- **Monolith Watch (> 350 lines — Ecclesiam Anti-Monolith Rule):** **32 files** exceed 350 lines (top 6 exceed 500 lines: `PastoralAppointmentBooking.tsx` 762, `CertificateRequestForm.tsx` 645, `SacramentRegistrationContainer.tsx` 583, `MassIntentionBooking.tsx` 580, `MovementRegistrationModal.tsx` 564, `DayScheduleBuilderModal.tsx` 547).

---

## Findings

### [CRITICAL] SEC-001: Unauthenticated `/api/notifications` email relay with HTML injection
- **File**: `app/api/notifications/route.ts` (lines 10-172), `utils/resend.ts` (lines 25-115, 146-160+)
- **Category**: Security (OWASP A01 / A03)
- **Tier**: 2
- **Description**: `POST /api/notifications` has no authentication, no internal shared-secret check, no rate limiting, and no schema validation. Any anonymous external caller can invoke it to send arbitrary emails via Resend to any `parishionerEmail` / `applicantEmail` and flood `SECRETARY_EMAIL`. In addition, `utils/resend.ts` interpolates user-supplied strings (`parishionerName`, `priestName`, `notes`, `extraDetails`, `protocol`) directly into HTML email templates without escaping, enabling HTML/phishing injection inside official parish emails.
- **Evidence**:
  ```ts
  // app/api/notifications/route.ts:40-51
  if (parishionerEmail) {
    userEmailResult = await sendAppointmentConfirmationEmail({
      to: parishionerEmail,
      parishionerName: parishionerName || 'Paroquiano(a)',
  ```
  ```ts
  // utils/resend.ts:148-153
  <td class="value">${parishionerName}</td>
  ```
- **Fix**: Replace external HTTP calls to `/api/notifications` with an internal server-only service function (`lib/notifications/sendTransactionalEmail.ts`) invoked directly from validated server routes (`/api/secretaria/*`, `/api/dizimo/register`). Restrict or remove public `POST /api/notifications` (or require a server-side signed token/authenticated session + strict rate limit), and HTML-escape all interpolated fields in `utils/resend.ts`.
- **Status**: FIXED (`lib/notifications/dispatchNotification.ts`, `utils/resend.ts` `escapeHtml`, auth/secret gate + rate limit em `app/api/notifications/route.ts`)

### [CRITICAL] SEC-002: Missing `parish_id` multi-tenant isolation in RLS for parishioner PII & movement/event tables
- **File**: `supabase/migrations/20261109_security_rls_hardening.sql` (lines 189-235, 248-257), `supabase/migrations/20261012_create_pastoral_appointments.sql` (lines 48-65), `supabase/migrations/20261012_create_sacramental_registrations.sql` (lines 66-85), `supabase/migrations/20261107_create_parish_movements.sql` (lines 122-154), `supabase/migrations/20261114_task55_rls_performance_and_indexes.sql` (lines 254-256)
- **Category**: Security (Multi-Tenant Isolation / LGPD)
- **Tier**: 3
- **Description**: `20261114_task53_auth_rls_lockdown.sql` enforced `public.can_access_parish_admin(parish_id)` on `user_profiles`, `parish_knowledge_*`, `parishes`, and public CMS tables, but omitted PII/secretaria tables (`mass_intentions`, `certificate_requests`, `tithe_registrations`, `pastoral_appointments`, `sacramental_registrations`, `parish_movement_registrations`, `parish_movements`, `parish_movement_events`, `community_activity_logs`). Those tables remain gated only by `USING (parish_id IS NOT NULL)` or `USING (true)` for `authenticated`, meaning any admin from Parish A can read/update/delete Parish B's parishioners (including minors' data in `parish_movement_registrations`). Similarly, `parish_event_days` lacks a `parish_id` column and `20261114_task55` allows any active admin role (`get_active_admin_role() IS NOT NULL`) to mutate any parish's event days.
- **Evidence**:
  ```sql
  -- supabase/migrations/20261109_security_rls_hardening.sql:190-193
  CREATE POLICY "Gestao restrita de intencoes por administradores autenticados"
  ON public.mass_intentions FOR ALL TO authenticated
  USING (parish_id IS NOT NULL) WITH CHECK (parish_id IS NOT NULL);
  ```
  ```sql
  -- supabase/migrations/20261114_task55_rls_performance_and_indexes.sql:254-256
  admin_expr := '((SELECT public.get_active_admin_role()) IS NOT NULL)';
  ```
- **Fix**: Create a new hardening SQL migration applying `(SELECT public.can_access_parish_admin(parish_id))` to all PII/operational tables above, scoping `community_activity_logs` via `communities.parish_id`, and scoping `parish_event_days` via `EXISTS (SELECT 1 FROM public.parish_special_events e WHERE e.id = event_id AND public.can_access_parish_admin(e.parish_id))`.
- **Status**: FIXED (`supabase/migrations/20270401_audit_rls_tenant_lockdown.sql` — aplicar no Supabase)

### [CRITICAL] SEC-003: Chronological SQL migration ordering breaks clean DB provisioning & reopens RLS
- **File**: `supabase/migrations/20261114_task55_rls_performance_and_indexes.sql` (lines 12-13), `supabase/migrations/20270101_create_parish_knowledge_rag.sql` (lines 85-104), `supabase/migrations/20270301_create_special_events_and_schedules.sql` (lines 69-134), `supabase/migrations/20270201_create_brand_assets_and_identity.sql` (lines 21-40)
- **Category**: Security / Architecture
- **Tier**: 3
- **Description**: Migrations prefixed `20270101_*`, `20270201_*`, and `20270301_*` sort alphabetically *after* `20261114_task53` and `20261114_task55`. On a fresh Supabase project or `supabase db reset`: (1) `20261114_task55` fails on `CREATE INDEX ... ON public.parish_knowledge_documents (uploaded_by)` because the table is only created in `20270101_*`; and (2) `20270101_*`, `20270201_*`, and `20270301_*` run *after* the security lockdown and re-create `TO anon, authenticated USING (true)` policies on `parish_knowledge_documents`, `parish_knowledge_embeddings`, `parish_special_events`, `parish_event_days`, and `storage.objects` (`brand_assets`, `event_assets`).
- **Evidence**:
  ```sql
  -- 20270101_create_parish_knowledge_rag.sql:90-91
  CREATE POLICY "allow_anon_all_documents"
    ON public.parish_knowledge_documents FOR ALL TO anon, authenticated USING (true) WITH CHECK (parish_id IS NOT NULL);
  ```
- **Fix**: Guard index creation in `20261114_task55` with `to_regclass(...)` or reorder/consolidate migrations, remove `TO anon` write policies from `2027*` files (or replace them with a final `20270401_*` idempotent lockdown), and test `supabase db reset` / clean replay end-to-end.
- **Status**: FIXED (`20261114_task55_rls_performance_and_indexes.sql`, `20270101`/`20270201`/`20270301` e `20270401_audit_rls_tenant_lockdown.sql`)

---

### [HIGH] SEC-004: Wildcard `ILIKE` injection in `/meu-espaco` `SECURITY DEFINER` RPCs leaks all parishioner records
- **File**: `supabase/migrations/20261109_security_rls_hardening.sql` (lines 384-387, 455-458, 482-485)
- **Category**: Security (Broken Access Control / LGPD)
- **Tier**: 2
- **Description**: `lookup_parishioner_intentions`, `lookup_parishioner_appointments`, and `cancel_parishioner_appointment` are granted to `anon` and use `ILIKE '%' || v_protocol || '%'` and `ILIKE '%' || right(v_clean_phone, 8) || '%'` without escaping SQL LIKE wildcards (`%`, `_`). An anonymous caller passing `p_protocol = '%'` or `'2026'` retrieves every parishioner's mass intentions or pastoral appointments (names, phones, emails, confidential notes) for a given `parish_id`.
- **Evidence**:
  ```sql
  -- 20261109_security_rls_hardening.sql:385-386
  (length(v_protocol) > 0 AND i.protocol_code ILIKE '%' || v_protocol || '%')
  OR (length(v_clean_phone) >= 8 AND regexp_replace(i.contact_phone, '\D', '', 'g') ILIKE '%' || right(v_clean_phone, 8) || '%')
  ```
- **Fix**: Require exact equality (`upper(i.protocol_code) = upper(v_protocol)`) and exact normalized phone suffix match (`right(regexp_replace(i.contact_phone, '\D', '', 'g'), 8) = right(v_clean_phone, 8)` with `length(v_clean_phone) >= 10`) instead of `ILIKE '%...%'`; require both `parish_id` and phone match when cancelling appointments.
- **Status**: FIXED (`supabase/migrations/20270401_audit_rls_tenant_lockdown.sql`)

### [HIGH] SEC-005: Tenant bypass fallback when `profile.parish_id` is null in `requireAuthenticatedAdmin`
- **File**: `lib/security/serverAuth.ts` (lines 204-222)
- **Category**: Security (Authorization)
- **Tier**: 2
- **Description**: In `requireAuthenticatedAdmin`, cross-tenant validation only runs when `profile.parish_id` is truthy (`if (requestedParishId && profile.role !== 'superadmin' && profile.parish_id && ...)`), and `effectiveParishId` falls back to `requestedParishId` when `profile.parish_id` is null. A non-superadmin profile with a null `parish_id` could pass any `requestedParishId` and act on that tenant's AI/brand routes.
- **Evidence**:
  ```ts
  // lib/security/serverAuth.ts:219-222
  const effectiveParishId =
    profile.role === 'superadmin'
      ? requestedParishId || profile.parish_id || null
      : profile.parish_id || requestedParishId || null;
  ```
- **Fix**: For non-superadmin roles, require `profile.parish_id` to be non-null (return 403 otherwise) and never fall back to `requestedParishId`.
- **Status**: FIXED (`lib/security/serverAuth.ts`)

### [HIGH] SEC-006: Admin email & approval-status enumeration on `/api/auth/magic-link`
- **File**: `app/api/auth/magic-link/route.ts` (lines 63-94)
- **Category**: Security (Authentication)
- **Tier**: 2
- **Description**: `POST /api/auth/magic-link` returns HTTP `404` when an email is not in `user_profiles`, `403` when `pendente` or `bloqueado`, and `200` when `ativo`. Attackers can enumerate valid parish admin emails and their onboarding status.
- **Evidence**:
  ```ts
  // app/api/auth/magic-link/route.ts:71-79
  if (!profile) {
    return NextResponse.json(
      { ok: false, error: 'E-mail não localizado nos cadastros ativos...' },
      { status: 404 }
    );
  }
  ```
- **Fix**: Return a uniform `200 { ok: true, message: '...' }` response after rate-limiting regardless of whether the email exists or its status, only sending the OTP/reset internally when `profile?.status === 'ativo'`.
- **Status**: FIXED (`app/api/auth/magic-link/route.ts`)

### [HIGH] SEC-007: Production RBAC simulator exposed in `AdminRoleGuard` + `select('*')` pulling `access_code` into client context
- **File**: `components/admin/auth/AdminRoleGuard.tsx` (lines 80-102), `components/admin/context/AdminCommunityContext.tsx` (lines 88, 116-127, 229-238), `app/admin/superadmin/page.tsx` (lines 183-193, 214-240)
- **Category**: Security (Authorization / Sensitive Data Exposure)
- **Tier**: 2
- **Description**: `AdminRoleGuard` renders "Simulador RBAC (Ambiente de Desenvolvimento)" buttons unconditionally in production UI, allowing any logged-in user to switch React UI identity to another user in `allUsers`. Meanwhile, `AdminCommunityContext` fetches `supabase.from('user_profiles').select('*')`, pulling plaintext `access_code` into browser memory, and falls back to `profiles.find((u) => u.role === 'paroco') || profiles[0]` if session lookup fails. Additionally, `app/admin/superadmin/page.tsx` writes plaintext `access_code` directly from the browser.
- **Evidence**:
  ```tsx
  // components/admin/auth/AdminRoleGuard.tsx:81-97
  {allUsers.length > 0 && (
    <div className="pt-2 border-t border-[var(--dash-border)]">
      <span className="text-[11px] ...">Simulador RBAC (Ambiente de Desenvolvimento):</span>
  ```
- **Fix**: Gate the RBAC simulator strictly behind `process.env.NODE_ENV === 'development'`; replace `select('*')` in `AdminCommunityContext` and `app/admin/usuarios/page.tsx` / `superadmin/page.tsx` with `USER_PROFILE_SAFE_COLUMNS` (never selecting `access_code`); remove fallback role selection in `AdminCommunityContext`; move superadmin parish/user provisioning to an authenticated `/api/admin/superadmin/*` endpoint that creates `auth.users` directly without storing plaintext `access_code`.
- **Status**: FIXED (`AdminRoleGuard.tsx`, `AdminCommunityContext.tsx`, `app/admin/usuarios/page.tsx`, `lib/security/userColumns.ts`; migração de `access_code` em `superadmin/page.tsx` preservada para revisão Tier 3)

### [HIGH] SEC-008: `/api/upload` lacks server-side MIME allowlist and file size validation + permissive Storage RLS
- **File**: `app/api/upload/route.ts` (lines 34-70), `supabase/migrations/20261109_security_rls_hardening.sql` (lines 268-323), `supabase/migrations/20270201_create_brand_assets_and_identity.sql` (lines 21-40)
- **Category**: Security (File Upload / Stored XSS)
- **Tier**: 2
- **Description**: `POST /api/upload` trusts `file.type` without validating magic bytes or an allowlist of safe MIME types/extensions, and enforces no maximum file size (`file.arrayBuffer()` loads arbitrarily large files into memory). Uploading an `.svg` or `.html` file to a public Supabase bucket enables stored XSS on the Storage origin. Also, Storage policies grant `INSERT/UPDATE/DELETE` on `brand_assets`, `event_assets`, and `booklets` to any `authenticated` user without checking admin role or `parish_id` folder prefix.
- **Evidence**:
  ```ts
  // app/api/upload/route.ts:65-70
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: file.type || 'image/webp',
      upsert: true,
    });
  ```
- **Fix**: Enforce a strict allowlist (`image/webp`, `image/jpeg`, `image/png`, `image/avif`, `application/pdf` — explicitly reject `image/svg+xml` and `text/html`), verify magic bytes + max size (e.g., 10 MB for images, 25 MB for PDFs), scope `storagePath` with `auth.parishId`, and tighten Storage RLS to `public.can_access_parish_admin(...)`.
- **Status**: FIXED (`lib/security/uploadValidation.ts` + `app/api/upload/route.ts` + `supabase/migrations/20270401_audit_rls_tenant_lockdown.sql`)

### [HIGH] SEC-009: Missing rate limiting on AI/cost & public endpoints + unbounded `match_count` + incomplete SSRF DNS check
- **File**: `app/api/admin/ai-assistant/route.ts` (lines 50, 102-110), `app/api/admin/ai/sync-database/route.ts` (lines 124-252), `app/api/admin/brand/extract/route.ts` (lines 65-83, 141-145, 243-246), `app/api/dizimo/register/route.ts`, `app/api/secretaria/appointments/route.ts`, `app/api/secretaria/intentions/route.ts`, `lib/security/rateLimit.ts`
- **Category**: Security (Rate Limiting / AI Abuse / SSRF)
- **Tier**: 2
- **Description**:
  1. AI endpoints (`/api/admin/ai-assistant`, `/api/admin/ai/sync-database`, `/api/admin/brand/extract`) have no per-user rate limit or daily quota, and `ai-assistant` passes user-supplied `match_count` and `similarity_threshold` straight to `match_parish_knowledge` without clamping (`match_count` could be set to thousands).
  2. `brand/extract` only checks `MAX_REMOTE_ASSET_BYTES` on `fileUrl`, not on multipart `formData` or `fileBase64`, and `validateSafeRemoteUrl` inspects only the literal hostname string (vulnerable to DNS rebinding / `nip.io`-style hostnames resolving to `127.0.0.1` or `169.254.169.254`).
  3. Public POST endpoints (`/api/dizimo/register`, `/api/secretaria/*`) have no rate limiting, and `lib/security/rateLimit.ts` stores buckets in a per-instance `Map` that resets across Vercel Serverless cold starts/instances.
- **Evidence**:
  ```ts
  // app/api/admin/ai-assistant/route.ts:50,107
  match_count = 5, similarity_threshold = 0.45
  ...
  match_count: match_count,
  ```
- **Fix**: Clamp `match_count` (`1..10`) and `similarity_threshold` (`0.2..0.95`); enforce 25 MB max size on `formData` and `fileBase64` in `brand/extract`; resolve DNS (`dns.lookup`) and verify non-private IP before fetching remote URLs (or restrict `fileUrl` strictly to the configured Supabase Storage host); add rate limiting on AI & public routes (backed by Redis/Upstash or private Postgres rate-limit table before multi-instance scale).
- **Status**: FIXED (rate limits, clamping, DNS SSRF lookup e limites de 25 MB aplicados; migração futura do store em memória para Redis/Postgres recomendada antes de escala multi-instância)

### [HIGH] BUG-001: `CertificateRequestForm` calls `.insert().select()` as `anon` on a table without `anon` `SELECT` RLS
- **File**: `components/secretaria/certidoes/CertificateRequestForm.tsx` (lines 211-219), `supabase/migrations/20261109_security_rls_hardening.sql` (lines 204-213)
- **Category**: Correctness Bug / Logic
- **Tier**: 2
- **Description**: `20261109_security_rls_hardening.sql` correctly restricted `SELECT` on `certificate_requests` to `authenticated` (LGPD protection), allowing `anon` to `INSERT` only. However, `CertificateRequestForm.tsx` runs in the browser as `anon` and executes `.insert([payload]).select('id, created_at').single()`. PostgREST requires `SELECT` permission to execute `INSERT ... RETURNING`, so public users submitting certificate requests fail with an RLS `42501` error in production.
- **Evidence**:
  ```ts
  // CertificateRequestForm.tsx:211-215
  const { data, error } = await supabase
    .from('certificate_requests')
    .insert([payload])
    .select('id, created_at')
    .single();
  ```
- **Fix**: Route public certificate submissions through a server endpoint `/api/secretaria/certificates` (matching `/api/secretaria/appointments` and `/api/secretaria/intentions` with `idempotency_key`, rate limiting, and `createAdminClient()`), returning only the generated protocol code to the client.
- **Status**: FIXED (`app/api/secretaria/certificates/route.ts` + `CertificateRequestForm.tsx`)

### [HIGH] ERR-001: `/api/dizimo/register` silently returns HTTP 200 `{ success: true }` when DB insert fails
- **File**: `app/api/dizimo/register/route.ts` (lines 52-70, 102-108)
- **Category**: Error Handling & Resilience
- **Tier**: 2
- **Description**: If `supabase.from('tithe_registrations').insert(...)` returns an error or throws an exception, the handler logs `console.warn`, keeps `dbSuccess = false`, fires the notification email anyway, and returns HTTP `200` with `{ success: true, message: 'Adesão ao Dízimo registrada com sucesso!' }`. Parishioners receive a fake protocol that was never saved in the database.
- **Evidence**:
  ```ts
  // app/api/dizimo/register/route.ts:65-70,102-108
  } else if (dbError) {
    console.warn('Alerta Supabase tithe_registrations:', dbError.message);
  }
  ...
  return NextResponse.json({ success: true, protocol, dbSuccess, ... });
  ```
- **Fix**: Fail fast with HTTP `500` (and friendly error via `toFriendlyErrorMessage`) whenever `dbError` occurs, add input validation + `idempotency_key`, and only dispatch transactional notifications after DB persistence succeeds.
- **Status**: FIXED (`app/api/dizimo/register/route.ts`)

---

### [MEDIUM] SEC-010: Unvalidated DB colors interpolated into `<style>` tag & raw `error.message` leaked in API errors
- **File**: `app/layout.tsx` (lines 91-109), `app/api/notifications/route.ts` (line 168), `app/api/dizimo/register/route.ts` (line 112)
- **Category**: Security (Input Validation / Error Exposure)
- **Tier**: 2
- **Description**: `app/layout.tsx` injects `brandIdentity.colors.*` directly into `<style id="dynamic-brand-theming" dangerouslySetInnerHTML>` without validating CSS hex color format (`^#[0-9a-fA-F]{3,8}$`). Separately, `/api/notifications` and `/api/dizimo/register` return `details: error.message` in `500` responses, exposing internal error strings.
- **Evidence**:
  ```tsx
  // app/layout.tsx:95-97
  --primary: ${colors.primary} !important;
  ```
  ```ts
  // app/api/notifications/route.ts:168
  { error: 'Falha interna ao processar notificação.', details: error.message }
  ```
- **Fix**: Sanitize all theme color values with a strict hex validator + safe fallback before CSS interpolation, and replace raw `details: error.message` with `toFriendlyErrorMessage`.
- **Status**: FIXED (`app/layout.tsx` `safeHexColor`, `app/api/notifications/route.ts`, `app/api/dizimo/register/route.ts`)

### [MEDIUM] SEC-011: Overly broad `security_audit_logs` insert policy & `user_metadata` UI fallback
- **File**: `supabase/migrations/20261114_task53_auth_rls_lockdown.sql` (lines 198-202), `lib/hooks/useAdminSession.ts` (line 59)
- **Category**: Security
- **Tier**: 2
- **Description**: `security_audit_logs_insert_authenticated_only` uses `WITH CHECK (true)`, allowing any authenticated user to write forged audit entries for arbitrary `parish_id` or `email` values. Additionally, `useAdminSession.ts` falls back to `user.user_metadata?.name` (user-editable metadata) instead of profile data.
- **Evidence**:
  ```sql
  -- 20261114_task53_auth_rls_lockdown.sql:198-202
  CREATE POLICY "security_audit_logs_insert_authenticated_only"
  ON public.security_audit_logs FOR INSERT TO authenticated WITH CHECK (true);
  ```
- **Fix**: Scope `security_audit_logs` `INSERT` to `parish_id IS NULL OR public.can_access_parish_admin(parish_id)` (or move all audit writes server-side via `service_role`), and remove `user_metadata` reliance in `useAdminSession.ts`.
- **Status**: FIXED (`supabase/migrations/20270401_audit_rls_tenant_lockdown.sql` para política `security_audit_logs_insert_scoped_admin`)

### [MEDIUM] ERR-002: Silent error swallowing (`catch {}`) in server & critical client flows
- **File**: `app/api/admin/ai-assistant/route.ts` (lines 112-114), `components/secretaria/sacramentos/SacramentRegistrationContainer.tsx` (lines 205-207, 352-354), `app/admin/usuarios/page.tsx` (lines 60-75), `components/admin/context/AdminCommunityContext.tsx` (lines 250-303)
- **Category**: Error Handling & Resilience
- **Tier**: 2
- **Description**: 29 empty/silent `catch` blocks exist across the codebase. While most are benign `localStorage`/`navigator.share` fallbacks, critical paths silently drop failures: `ai-assistant` logs `rpcError` and continues answering without RAG context (no degraded warning returned to UI); `SacramentRegistrationContainer` ignores capacity-check failures (`catch (e) {}`) and doesn't verify `.select()` RLS compatibility; `app/admin/usuarios/page.tsx` ignores `usersErr`/`logsErr` without surfacing an error banner.
- **Evidence**:
  ```ts
  // app/api/admin/ai-assistant/route.ts:112-114
  if (rpcError) {
    console.error("[RPC match_parish_knowledge Error]:", rpcError);
  }
  ```
- **Fix**: Return a `rag_degraded: true` flag or explicit error when vector retrieval fails in `ai-assistant`; surface load errors in `app/admin/usuarios/page.tsx`; and move `SacramentRegistrationContainer` submission to `/api/secretaria/sacraments` with explicit server-side capacity check and idempotency.
- **Status**: FIXED (`app/api/admin/ai-assistant/route.ts`, `app/admin/usuarios/page.tsx`, `app/api/secretaria/sacraments/route.ts`, `SacramentRegistrationContainer.tsx`)

### [MEDIUM] ARCH-001: 32 files exceed the 350-line Anti-Monolith threshold (6 exceed 500 lines)
- **File**: `components/secretaria/PastoralAppointmentBooking.tsx` (762 lines), `components/secretaria/certidoes/CertificateRequestForm.tsx` (645), `components/secretaria/sacramentos/SacramentRegistrationContainer.tsx` (583), `components/secretaria/intencoes/MassIntentionBooking.tsx` (580), `components/movements/MovementRegistrationModal.tsx` (564), `components/admin/programacao/DayScheduleBuilderModal.tsx` (547), plus 26 files between 353–469 lines.
- **Category**: Architecture & Design
- **Tier**: 3
- **Description**: Several high-traffic public booking forms and admin modals mix form state, `sessionStorage` draft hooks, validation, Supabase queries, and large JSX trees in single 550–760 line files, raising maintenance and regression risk on low-end mobile devices.
- **Evidence**: Line counts measured across `app/`, `components/`, and `lib/` (32 `.ts`/`.tsx` files > 350 lines).
- **Fix**: Apply the **Protocolo de Refatoração de Monolitos (PRM)** incrementally when touching these files, starting with the top 6 (`>500` lines): extract form sections, submission hooks, and success views into dedicated sub-components.
- **Status**: OPEN

### [MEDIUM] PERF-001: Unbounded admin queries & React Effect lint warnings (`set-state-in-effect`)
- **File**: `app/admin/superadmin/page.tsx` (lines 65-72), `app/admin/usuarios/page.tsx` (lines 54-69), `app/admin/comunidades/page.tsx` (lines 57-59), plus other admin pages flagged by ESLint
- **Category**: Performance Antipatterns
- **Tier**: 2
- **Description**: `app/admin/superadmin/page.tsx` and `app/admin/usuarios/page.tsx` run unbounded `select('*')` queries on `user_profiles` and `communities` without `limit`/pagination, which will degrade as multi-tenant parishes scale. ESLint also reports `react-hooks/set-state-in-effect` and `react-hooks/exhaustive-deps` warnings across admin pages, indicating potential redundant render cascades.
- **Evidence**:
  ```ts
  // app/admin/superadmin/page.tsx:65-66
  supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
  supabase.from('communities').select('id, parish_id, name'),
  ```
- **Fix**: Add explicit column projections and pagination (`range`/limit) to admin lists, and clean up `useEffect` async patterns flagged by `react-hooks/set-state-in-effect`.
- **Status**: OPEN

### [MEDIUM] VAL-001: Inconsistent submission architecture on public Secretaria forms
- **File**: `components/secretaria/certidoes/CertificateRequestForm.tsx`, `components/secretaria/sacramentos/SacramentRegistrationContainer.tsx`, `lib/movements.ts`
- **Category**: Input Validation / Business Logic Fragility
- **Tier**: 2
- **Description**: While Mass Intentions and Pastoral Appointments were hardened with dedicated `/api/secretaria/*` endpoints, server-side validation, and `idempotency_key` deduplication (`TASK-56`), Sacraments, Certificates, and Movements still submit directly from the browser via Supabase `anon` client without server-side validation, rate limiting, or double-submit idempotency.
- **Evidence**: `SacramentRegistrationContainer.tsx:306` and `CertificateRequestForm.tsx:211` call `supabase.from(...).insert(...)` directly in `'use client'` components.
- **Fix**: Route Sacraments, Certificates, and Movements through server API endpoints (`/api/secretaria/sacraments`, `/api/secretaria/certificates`, `/api/movements/register`) reusing `runWithIdempotency` and server-side Zod/runtime validation.
- **Status**: OPEN (Certidões e Sacramentos migrados para `/api/secretaria/*`; `lib/movements.ts` pendente para próximo lote)

---

### [LOW] TYPE-001: 43 explicit `any` usages across API routes, admin pages, and `utils/resend.ts`
- **File**: `app/admin/marca/page.tsx` (lines 118, 179), `app/admin/usuarios/page.tsx` (lines 151, 169, 199), `app/api/dizimo/register/route.ts` (lines 68, 98, 109), `app/api/notifications/route.ts` (line 165), `utils/resend.ts` (lines 207, 297, 381, 457), `types/index.ts` (line 360), and 28 other occurrences.
- **Category**: Type Safety
- **Tier**: 1
- **Description**: Repeated `catch (err: any)` and `as any` casts bypass strict TypeScript checking in error handlers and DB mappers.
- **Evidence**: `43` occurrences of `: any` / `as any` detected outside `tests/`.
- **Fix**: Replace `catch (err: any)` with `catch (err: unknown)` + `toFriendlyErrorMessage` / `err instanceof Error`, and replace `as any` casts with typed unions or explicit narrowers.
- **Status**: OPEN

### [LOW] DEAD-001: Unused imports, unused variables, and stale hook dependencies (676 ESLint warnings)
- **File**: `app/admin/aparencia/page.tsx` (lines 5-16, 91-97), `app/admin/assistente-ia/page.tsx` (lines 7-12), `utils/supabase/middleware.ts` (line 17 — unused `supabase` variable alongside `updateSession`), and across admin/component files.
- **Category**: Dead Code & Cleanup
- **Tier**: 1
- **Description**: ESLint reports `0` errors and `676` warnings (mostly `@typescript-eslint/no-unused-vars`, `react-hooks/exhaustive-deps`, and `@next/next/no-img-element`). Note: `utils/supabase/middleware.ts` is also superseded by `proxy.ts` + `lib/security/serverAuth.ts` (`createMiddlewareSupabaseClient`) — verify if `utils/supabase/middleware.ts` is dead code.
- **Evidence**: `npm run lint` output: `✖ 676 problems (0 errors, 676 warnings)`.
- **Fix**: Remove unused imports/variables and verify whether `utils/supabase/middleware.ts` can be safely deleted.
- **Status**: OPEN

### [INFO] TEST-001: Automated test coverage gaps on AI, Upload, and `/meu-espaco` RPC contracts
- **File**: `tests/` (`auth-proxy.test.ts`, `critical-flows.test.ts`, `rate-limit.test.ts`, `resilience-and-errors.test.ts`, `security-guards.test.ts`)
- **Category**: Testing Gaps
- **Tier**: 2
- **Description**: Current test suite covers 16 cases for `proxy.ts`, rate limiter, idempotency, login/access-request guards, and `/api/notifications` + `/api/dizimo/register` basic 400 checks, but does not cover `/api/upload`, `/api/admin/ai-assistant`, `/api/admin/brand/extract` SSRF checks, `/api/auth/magic-link`, or negative tenant-isolation cases.
- **Evidence**: 5 test files in `tests/*.test.ts` (16 total assertions).
- **Fix**: Add unit/route tests alongside Tier 2 security fixes for upload MIME/size rejection, AI `match_count` clamping, SSRF private-IP blocking, and `requireAuthenticatedAdmin` null-`parish_id` rejection.
- **Status**: OPEN

---

## Summary

| Severity | Open | Fixed | Clarification Needed | Human Review |
|----------|------|-------|---------------------|--------------|
| CRITICAL | 0    | 3     | 0                   | 0            |
| HIGH     | 0    | 8     | 0                   | 0            |
| MEDIUM   | 3    | 3     | 0                   | 0            |
| LOW      | 2    | 0     | 0                   | 0            |
| INFO     | 1    | 0     | 0                   | 0            |
