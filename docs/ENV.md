# Environment Variables

Complete reference for every `process.env.*` variable referenced anywhere in the
codebase (audited Phase 14.2). All variables required for production unless
explicitly marked optional; absent optional vars degrade gracefully.

Conventions:

- **Public** = prefixed `NEXT_PUBLIC_*`. Bundled into the client JS — never put
  a secret here.
- **Server** = read only on the server (API routes, RSC, middleware, instrumentation).
- **Sensitive** = mark the variable as Sensitive in Vercel; do not log; never
  expose to the browser.

---

## Required in production

| Variable                        | Scope  | Sensitive | Used in                                                                                                                                                                         | Example                                                        |
| ------------------------------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Public | No        | `middleware.ts`, `src/features/auth/lib/{client,server}.ts`, gating in `api/customers`, `api/import`, `api/generate-message`, `api/roi-report`, `dashboard/roi-report/page.tsx` | `https://abcd1234.supabase.co`                                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | No        | `middleware.ts`, `src/features/auth/lib/{client,server}.ts`, `api/customers`, `api/import`, `api/generate-message`                                                              | `eyJhbGciOi...` (anon JWT, safe to expose)                     |
| `DATABASE_URL`                  | Server | Yes       | `src/shared/lib/db.ts`, `src/lib/supabase.ts`, `api/roi-report`, `api/customers`, `api/import`, `dashboard/roi-report/page.tsx`                                                 | `postgresql://user:pass@ep-x.neon.tech/neondb?sslmode=require` |
| `ANTHROPIC_API_KEY`             | Server | Yes       | `api/generate-message` (read implicitly by `new Anthropic()` from `@anthropic-ai/sdk`)                                                                                          | `sk-ant-api03-...`                                             |

## Required in CI (not at runtime)

| Variable            | Scope | Sensitive | Used in                             | Example            |
| ------------------- | ----- | --------- | ----------------------------------- | ------------------ |
| `SENTRY_AUTH_TOKEN` | Build | Yes       | `next.config.js` (sourcemap upload) | `sntrys_eyJ...`    |
| `SENTRY_ORG`        | Build | No        | `next.config.js`                    | `aooda`            |
| `SENTRY_PROJECT`    | Build | No        | `next.config.js`                    | `ai-customer-base` |

If `SENTRY_AUTH_TOKEN` is unset, sourcemap upload is disabled gracefully —
the build still succeeds, but Sentry stack traces will be minified.

## Optional (degrade gracefully if absent)

| Variable                     | Scope  | Sensitive | Default                       | Used in                                                                                                                                                                                                | Example                                 |
| ---------------------------- | ------ | --------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN`     | Public | No        | —                             | `sentry.{client,server,edge}.config.ts` — error tracking disabled if absent                                                                                                                            | `https://abc@o123.ingest.sentry.io/456` |
| `NEXT_PUBLIC_POSTHOG_KEY`    | Public | No        | —                             | `src/components/analytics/posthog-provider.tsx` — analytics disabled if absent                                                                                                                         | `phc_xxxxxxxxxxxxxx`                    |
| `NEXT_PUBLIC_POSTHOG_HOST`   | Public | No        | `https://app.posthog.com`     | `src/components/analytics/posthog-provider.tsx`                                                                                                                                                        | `https://eu.posthog.com`                |
| `NEXT_PUBLIC_DEMO_CLINIC_ID` | Public | No        | `''`                          | `api/roi-report`, `api/customers`, `api/import`, several pages (`/capture`, `/qr`, `/import`, `/campaigns/new`, `/dashboard`, `/dashboard/roi-report`) — enables real data on demo routes without auth | `00000000-0000-0000-0000-000000000001`  |
| `UPSTASH_REDIS_REST_URL`     | Server | Yes       | — (in-memory fallback)        | `src/lib/rate-limit.ts` — enables distributed rate limiting                                                                                                                                            | `https://us1-xxx.upstash.io`            |
| `UPSTASH_REDIS_REST_TOKEN`   | Server | Yes       | — (in-memory fallback)        | `src/lib/rate-limit.ts`                                                                                                                                                                                | `AY...`                                 |
| `LOG_LEVEL`                  | Server | No        | `debug` (dev) / `info` (prod) | `src/lib/logger.ts` — Pino log level                                                                                                                                                                   | `info`                                  |

## Dev-only / build flags

| Variable   | Scope | Default        | Used in                                                               | Example      |
| ---------- | ----- | -------------- | --------------------------------------------------------------------- | ------------ |
| `ANALYZE`  | Build | `false`        | `next.config.js` (bundle analyzer)                                    | `true`       |
| `NODE_ENV` | Both  | set by Next.js | `src/lib/{logger,prisma,security-headers}.ts`, `posthog-provider.tsx` | `production` |

## Vercel/Next.js auto-injected (no action needed)

| Variable              | Used in                                            | Description                                |
| --------------------- | -------------------------------------------------- | ------------------------------------------ |
| `VERCEL_ENV`          | `sentry.{client,server,edge}.config.ts`            | `production` \| `preview` \| `development` |
| `VERCEL_URL`          | (reserved — currently unused, available if needed) | Current deployment URL                     |
| `NEXT_RUNTIME`        | `src/instrumentation.ts`                           | `nodejs` \| `edge`                         |
| `npm_package_version` | `src/app/api/health/route.ts`                      | App version reported by health endpoint    |
| `CI`                  | `playwright.config.ts`                             | Enables retries + serial workers in CI     |

---

## Setup

### 1. Supabase

1. Create project at [supabase.com](https://supabase.com).
2. Settings → API → copy **Project URL** + **anon public** key.
3. Authentication → Providers → enable Email.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 2. Neon Postgres

1. Create project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string. Append `?sslmode=require` if missing.
3. Set `DATABASE_URL`.
4. Run `npx prisma migrate deploy` against it.

### 3. Anthropic

1. Generate a key at [console.anthropic.com](https://console.anthropic.com).
2. Set `ANTHROPIC_API_KEY` in Vercel **as Sensitive** (server-only).

### 4. Sentry

1. Create project at [sentry.io](https://sentry.io).
2. Copy DSN → set `NEXT_PUBLIC_SENTRY_DSN`.
3. Org/project slugs → set `SENTRY_ORG`, `SENTRY_PROJECT`.
4. Create an internal integration with `project:releases` → set `SENTRY_AUTH_TOKEN`
   as a Sensitive build-time var (NOT runtime — CI/build only).

### 5. PostHog (analytics — optional)

1. Create project at [posthog.com](https://posthog.com).
2. Copy the project API key → set `NEXT_PUBLIC_POSTHOG_KEY`.
3. If using EU cloud, set `NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com`.

### 6. Upstash Redis (rate limiting — recommended for prod)

1. Create database at [upstash.com](https://upstash.com).
2. Copy REST URL + token → set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
   as Sensitive.
3. Without these, rate limiting falls back to a per-instance in-memory `Map` —
   effective limit becomes `(max × instance_count)`, which is unsafe for
   production traffic shaping.

### 7. Vercel deploy

```bash
vercel --prod
```

---

## Security notes

- **Sensitive at runtime**: `DATABASE_URL`, `ANTHROPIC_API_KEY`,
  `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
- **Sensitive at build time**: `SENTRY_AUTH_TOKEN`.
- **`NEXT_PUBLIC_*` vars are bundled into client JS** — never put a secret
  behind that prefix. The Supabase anon key is designed to be public; the JWT
  is signed and RLS enforces row-level access.
- The Sentry DSN is intentionally public (`NEXT_PUBLIC_SENTRY_DSN`) — that's
  the documented Sentry pattern and DSNs are not credentials.
- **PostHog key is public by design** — the `NEXT_PUBLIC_` prefix is correct.
  Treat it as a project identifier, not a secret.
- Rotate any key that has ever been committed to git history.
- `.env.local` is `.gitignore`d. Do not commit `.env*` files.
- In CI, all four secrets in `.github/workflows/ci.yml` use placeholder values
  (`placeholder_anthropic_key`, etc.) so real keys never flow through PRs from
  forks.

## Local development quickstart

Create `.env.local` (gitignored) at the repo root:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://YOUR.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional
NEXT_PUBLIC_DEMO_CLINIC_ID=00000000-0000-0000-0000-000000000001
NEXT_PUBLIC_SENTRY_DSN=https://abc@o123.ingest.sentry.io/456
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
LOG_LEVEL=debug
```
