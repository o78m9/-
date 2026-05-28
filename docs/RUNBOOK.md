# Runbook — Aooda (عَودة)

Operational reference for developers and on-call engineers.

---

## Local Development

```bash
npm install
cp .env.example .env.local    # fill in required vars (see docs/ENV.md)
npm run dev                   # http://localhost:3000
```

### Without credentials

The app runs in demo mode if Supabase/Neon/Anthropic keys are absent:

- `/` — landing page, fully functional
- `/dashboard` — renders in demo mode (no crash)
- `/dashboard/demo` — always public, always demo data
- `/campaigns` — shows demo campaigns in localStorage demo mode

---

## Environment Variables

See `docs/ENV.md` for the full reference.

```bash
vercel env pull .env.local    # pull from Vercel (requires Vercel CLI)
```

---

## Build & Checks

```bash
npm run build        # production build
npx tsc --noEmit     # typecheck (must be 0 errors)
npm run lint         # ESLint (must be 0 warnings)
npm test             # Vitest unit tests (must be 66/66)
npm run test:e2e     # Playwright (needs running server on :3000)
```

All 4 must be green before deploying.

---

## Deploy

```bash
# Via Vercel CLI
npx vercel --prod

# Or push to main — Vercel auto-deploys from GitHub
git push origin main
```

---

## Health Check

`GET /api/health` — edge runtime, `Cache-Control: no-store`

```json
{ "status": "ok", "timestamp": "2026-05-28T...", "version": "0.1.0" }
```

BetterStack monitors this endpoint every 60s.

---

## Routes Reference

| Route             | Auth     | Notes                           |
| ----------------- | -------- | ------------------------------- |
| `/`               | None     | Landing page                    |
| `/about`          | None     | Dark-themed about               |
| `/dashboard`      | Optional | Demo mode if no Supabase        |
| `/dashboard/demo` | None     | Always public demo              |
| `/campaigns`      | None     | Shows demo in localStorage mode |
| `/campaigns/new`  | None     | Campaign creation flow          |
| `/capture`        | None     | Customer capture form           |
| `/login`          | None     | Supabase auth                   |
| `/signup`         | None     | Supabase auth                   |
| `/qr`             | None     | QR code generator               |
| `/import`         | None     | CSV import                      |
| `/api/health`     | None     | Edge runtime health check       |
| `/api/booking`    | None     | Booking form submission         |
| `/api/og`         | None     | OG image generation             |

---

## Monitoring & Alerts

| Tool        | Purpose        | Config                             |
| ----------- | -------------- | ---------------------------------- |
| Sentry      | Error tracking | `NEXT_PUBLIC_SENTRY_DSN`           |
| PostHog     | Analytics      | `NEXT_PUBLIC_POSTHOG_KEY`          |
| BetterStack | Uptime         | Manual setup, target `/api/health` |

Sentry is opt-in — absent DSN = no Sentry, zero bundle cost.

---

## Common Issues

### Dashboard shows "حدث خطأ غير متوقع"

- **Cause:** Supabase env vars not set in Vercel dashboard
- **Fix:** App now has try/catch — should render demo mode, not crash
- **If still crashing:** Check `src/app/dashboard/page.tsx` — wrap is comprehensive

### White/light pages in production

- **Cause:** Stone/slate color class introduced without color guard
- **Detection:** `node scripts/check-colors.mjs src/app/**/*.tsx`
- **Fix:** Replace with brand tokens (see docs/BRAND.md)

### Sentry sourcemaps not uploading

- **Cause:** `SENTRY_AUTH_TOKEN` not set
- **Effect:** Sentry still works, just no source maps
- **Fix:** Add token to Vercel env vars → redeploy

### 3D hero scene blank on mobile

- **Cause:** DPR or WebGL issue
- **Fix:** `isMobile` check in `HeroScene.tsx` already limits particles; prefers-reduced-motion shows static scene

---

## Database (Neon)

```bash
# Run migrations
DATABASE_URL=... npx prisma migrate deploy

# Seed with demo data
DATABASE_URL=... npx prisma db seed
```

Schema: `prisma/schema.prisma`
Migrations: `prisma/migrations/`

---

## Technical Debt

See `docs/AUDIT-REPORT.md` → Technical Debt Register.

Key items:

- `onRequestError` missing from `src/instrumentation.ts` (server errors may skip Sentry)
- `global-error.tsx` missing (React render errors skip Sentry)
- npm audit: 6 HIGH in Next.js internals (upstream, unfixable without downgrade)
