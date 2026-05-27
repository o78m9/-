# عَودة — AI Customer Activation System

> **40% of clinic patients stop coming back — not because they're unhappy, but because no one reached out.**
> Awdah fixes that with one-click AI campaigns in Arabic.

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4)](https://tailwindcss.com)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](./coverage)
[![Tests](https://img.shields.io/badge/tests-65%20passing-brightgreen)](./src/test)

---

## What It Does

Awdah is a SaaS platform for Arabic-market clinics that:

1. **Identifies dormant patients** — segments by last visit, spend, and status
2. **Generates personalised Arabic messages** — Claude AI writes WhatsApp messages in Jordanian dialect
3. **Sends re-activation campaigns** — schedule and track results in one dashboard
4. **Captures new walk-ins** — QR code form, CSV import, or booking modal

**Zero monthly fee in month 1. Pay only from recovered revenue.**

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/yourusername/awdah.git
cd awdah
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Fill in your keys (see Environment Variables below)

# 3. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo mode works without any credentials** — click "عرض تجريبي" on the dashboard.

---

## Stack

| Layer     | Technology                                    |
| --------- | --------------------------------------------- |
| Framework | Next.js 15 + React 19 + TypeScript 5          |
| Styling   | Tailwind CSS v4 + shadcn/ui                   |
| 3D        | React Three Fiber + drei + postprocessing     |
| Auth      | Supabase SSR + NextAuth v5                    |
| Database  | Neon PostgreSQL + Prisma ORM                  |
| AI        | Anthropic Claude (message generation)         |
| Testing   | Vitest + Playwright (65 tests, 100% coverage) |
| Deploy    | Vercel + Neon                                 |

---

## Environment Variables

| Variable                        | Required | Description                           |
| ------------------------------- | -------- | ------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Auth     | Supabase project URL                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth     | Supabase anon key                     |
| `DATABASE_URL`                  | Data     | Neon PostgreSQL connection string     |
| `ANTHROPIC_API_KEY`             | AI       | Claude API key for message generation |
| `AUTH_SECRET`                   | NextAuth | `openssl rand -base64 32`             |
| `NEXT_PUBLIC_DEMO_CLINIC_ID`    | Optional | Clinic ID for demo mode               |

---

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run test         # Run 65 unit tests
npm run test:coverage # Coverage report (100% stmts)
npm run test:e2e     # Playwright end-to-end tests
npm run lint         # ESLint + TypeScript check
npm run format       # Prettier format
```

---

## Architecture

```
src/
├── app/            # Next.js 15 App Router pages + API routes
├── features/       # Feature-sliced modules (auth, booking, capture)
├── shared/         # Cross-feature utilities (db, stats)
├── components/     # UI components
│   ├── ui/         # shadcn/ui primitives
│   ├── landing/    # Landing page sections (incl. 3D hero)
│   └── campaign/   # Campaign wizard steps
└── lib/            # Utilities (rate-limit, security-headers, logger)
```

Full architecture → [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Security

- **Headers**: X-Frame-Options, HSTS, CSP, Permissions-Policy, Referrer-Policy
- **Rate limiting**: All API routes protected (10 req/min on AI, 60 req/min on data)
- **Input validation**: Zod schemas on all API endpoints
- **Auth**: Supabase SSR cookie sessions (HttpOnly, SameSite=Lax)
- **Secrets**: Zero hardcoded values, all via env vars

---

## Deploy to Vercel

```bash
npx vercel --prod
```

Set environment variables in Vercel dashboard. Database: [Neon](https://neon.tech) free tier.

---

## License

MIT — built for Arabic-market healthcare businesses.
