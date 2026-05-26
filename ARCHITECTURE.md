# Architecture

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/
│   │   ├── booking/              # Lead capture webhook
│   │   ├── customers/            # Patient CRUD
│   │   ├── generate-message/     # Claude message generation
│   │   ├── health/               # Health check endpoint
│   │   └── import/               # CSV import
│   ├── campaigns/                # Campaign list + wizard
│   ├── dashboard/                # Protected dashboard
│   ├── login/ signup/            # Auth pages
│   └── page.tsx                  # Landing page
│
├── features/                     # Feature-sliced modules
│   ├── auth/
│   │   ├── lib/{client,server}.ts  # Supabase clients
│   │   ├── hooks/use-user.ts       # Client-side auth state
│   │   └── index.ts               # Public API
│   ├── booking/
│   │   └── lib/validation.ts       # Pure form validation
│   └── capture/
│       └── lib/schema.ts          # Zod capture schema
│
├── shared/
│   └── lib/
│       ├── db.ts                  # Neon SQL client
│       └── stats.ts               # aggregateStats()
│
├── components/
│   ├── ui/                        # Shared primitives (Button, Sparkline, etc.)
│   ├── landing/                   # Landing page sections
│   ├── campaign/                  # Campaign wizard steps
│   ├── BookingModal.tsx           # Lead capture modal
│   ├── QuickForm.tsx              # Patient capture form
│   └── dashboard.tsx              # Dashboard client
│
├── lib/                           # Legacy + re-export shims
│   ├── utils.ts                   # cn() Tailwind utility
│   ├── demo-data.ts               # All demo data
│   ├── claude.ts                  # Claude API wrapper
│   └── [others]                   # Re-export shims pointing to features/
│
├── hooks/                         # Re-export shims (pointing to features/)
└── test/                          # Vitest unit tests
```

## Migration Status (Strangler Fig)

The codebase is mid-migration from a flat `src/lib/` structure to feature slices.

**Migrated (canonical location is `features/` or `shared/`):**

- `src/lib/supabase/` → re-exports from `src/features/auth/lib/`
- `src/hooks/use-user.ts` → re-exports from `src/features/auth/hooks/`
- `src/lib/booking-validation.ts` → re-exports from `src/features/booking/lib/`
- `src/lib/capture-schema.ts` → re-exports from `src/features/capture/lib/`
- `src/lib/db.ts` → re-exports from `src/shared/lib/`
- `src/lib/stats.ts` → re-exports from `src/shared/lib/`

**Not yet migrated (high consumer count — >10 files would need updating):**

- `src/lib/utils.ts` (cn function, used everywhere)
- `src/lib/demo-data.ts` (demo data, used in 8+ components)

## Auth Flow

```
Request /dashboard/*
  ↓
middleware.ts
  ├─ cookie awdah-demo-mode=true → allow (demo bypass)
  ├─ SUPABASE env not set → allow (dev without .env.local)
  └─ supabase.auth.getUser() → user? → allow : redirect /login?next=/dashboard
```

Demo mode state is mirrored to cookie by `DashboardClient.toggleDemo()` so middleware can read it on the next request.

## Campaign Flow

```
/campaigns/new → CampaignWizard
  Step 1: Select segment (vip/active/at-risk/dormant/lost)
  Step 2: Select message template
  Step 3: Generate messages (POST /api/generate-message → Claude)
  Step 4: Schedule (now or later)
  Step 5: Review + confirm
  → handleSend() → SendProgress (demo: animated timeline)
```

## Data Layer

- **Auth**: Supabase (`@supabase/ssr` — cookie-based sessions, SSR safe)
- **Customer data**: Neon PostgreSQL via `@neondatabase/serverless`
- **Message generation**: Anthropic Claude API
- **Demo mode**: Static in-memory data from `src/lib/demo-data.ts`

## Key Design Decisions

See `docs/adr/` for detailed ADRs.

- **No ORM**: Raw SQL via Neon's tagged template literals — keeps queries readable and avoids schema drift
- **Demo bypass in middleware**: Allows the product to be demo'd without Supabase credentials, lowering barrier for evaluators
- **Strangler Fig migration**: Old import paths kept as re-export shims so the migration can happen incrementally without breaking changes
- **`noUncheckedIndexedAccess`**: Forces array access safety; the 6 fixes needed were all real potential runtime errors

## Testing

```bash
npm test              # Vitest unit tests (38 cases, ~1s)
npm run test:e2e      # Playwright (requires npm run dev running)
npm run test:coverage # Coverage report in coverage/
```

Unit tests cover: form validation, Zod schemas, data aggregation, utility functions.
E2e tests cover: booking CTA flow, modal lifecycle, form validation UI.

## Bundle Size

No route chunk exceeds 200KB gzipped. Largest first-load is `/dashboard` at ~110KB gzipped (includes Framer Motion + Recharts).

Run `npm run analyze` to open the Webpack bundle visualizer.
