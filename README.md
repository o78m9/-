# عَودة — AI Clinic Reactivation Platform

Reactivate dormant clinic patients via personalized WhatsApp messages written by Claude AI.

## Quick Start

```bash
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable                        | Required    | Description                            |
| ------------------------------- | ----------- | -------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Auth only   | Supabase project URL                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth only   | Supabase anon key                      |
| `DATABASE_URL`                  | Real data   | Neon PostgreSQL connection string      |
| `ANTHROPIC_API_KEY`             | Message gen | Claude API key for generating messages |
| `NEXT_PUBLIC_DEMO_CLINIC_ID`    | Dev         | Load real data without auth in dev     |

**Without Supabase keys:** middleware skips auth, demo mode works fully.

## Scripts

```bash
npm run dev           # Development server
npm run build         # Production build
npm run lint          # ESLint
npm run format        # Prettier
npm run test          # Vitest unit tests
npm run test:coverage # Coverage report
npm run test:e2e      # Playwright e2e tests
npm run analyze       # Bundle size analysis (opens browser)
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for full structure.

**Key flows:**

- Landing → BookingModal → `/api/booking` (lead capture)
- QR / manual → QuickForm → `/api/customers` (patient capture)
- Campaign wizard → `/api/generate-message` (Claude) → WhatsApp
- `/dashboard` — protected by middleware; demo bypass via cookie

## Demo Mode

Toggle demo mode from the dashboard sidebar or the login page link. Sets `awdah-demo-mode=true` in both localStorage and a cookie — the cookie is read by `middleware.ts` to bypass auth for the dashboard.

## Health Check

```
GET /api/health
→ { status: "ok", timestamp: "...", version: "0.1.0" }
```

## Stack

- **Next.js 14** App Router, TypeScript strict
- **Supabase** (@supabase/ssr) for auth
- **Neon** for PostgreSQL (customer/visit data)
- **Claude API** for personalized message generation
- **Framer Motion** for animations
- **Tailwind CSS** + custom editorial palette

## صُنع في عمّان — Built in Amman
