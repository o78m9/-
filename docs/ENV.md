# Environment Variables

All variables required for production. Absent optional vars degrade gracefully.

## Required

| Variable                        | Where                  | Description                                                    |
| ------------------------------- | ---------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Vercel env             | Supabase project URL (`https://xxx.supabase.co`)               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel env             | Supabase anon/public key — safe to expose                      |
| `DATABASE_URL`                  | Vercel env (sensitive) | Neon PostgreSQL connection string (pooled, `?sslmode=require`) |
| `ANTHROPIC_API_KEY`             | Vercel env (sensitive) | Claude API key for `/api/generate-message`                     |

## Optional

| Variable                     | Default                       | Description                                                                  |
| ---------------------------- | ----------------------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_DEMO_CLINIC_ID` | `''`                          | UUID of the demo clinic; enables real data on `/dashboard/demo` without auth |
| `LOG_LEVEL`                  | `debug` (dev) / `info` (prod) | Pino log level: `debug`, `info`, `warn`, `error`                             |
| `NEXT_PUBLIC_POSTHOG_KEY`    | —                             | PostHog project API key; analytics disabled if absent                        |
| `NEXT_PUBLIC_POSTHOG_HOST`   | `https://app.posthog.com`     | PostHog ingest host                                                          |
| `NEXT_PUBLIC_SENTRY_DSN`     | —                             | Sentry DSN; error tracking disabled if absent                                |
| `SENTRY_AUTH_TOKEN`          | —                             | Sentry auth token for sourcemap upload (CI only)                             |

## Vercel-injected (no action needed)

| Variable              | Description                                 |
| --------------------- | ------------------------------------------- |
| `npm_package_version` | Read by `/api/health` for version reporting |
| `VERCEL_URL`          | Current deployment URL                      |
| `VERCEL_ENV`          | `production` \| `preview` \| `development`  |

## Setup Steps

### 1. Supabase

1. Create project at supabase.com
2. Go to Settings → API → copy Project URL + anon key
3. Enable Email auth under Authentication → Providers

### 2. Neon

1. Create project at neon.tech
2. Copy connection string (pooled endpoint)
3. Run `npx prisma migrate deploy` against it

### 3. Anthropic

1. Generate key at console.anthropic.com
2. Add to Vercel as sensitive (server-only) env var

### 4. Vercel Deploy

```bash
vercel --prod
```

## Security Notes

- `DATABASE_URL` and `ANTHROPIC_API_KEY` must be **sensitive** in Vercel (not exposed to browser)
- `NEXT_PUBLIC_*` vars are bundled into client JS — never put secrets there
- Rotate keys if ever committed to git
