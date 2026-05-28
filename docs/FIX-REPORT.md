# Fix Report — Production Crash 2026-05-28

## Root Cause

**File:** `src/components/landing/cta.tsx`  
**Line 1 (missing):** `'use client'`  
**Lines 130–134:** `onMouseEnter` / `onMouseLeave` passed to `BookingButton` (Client Component) from a Server Component

Next.js 15 enforces RSC boundary at runtime. Functions cannot cross the Server→Client boundary. This threw at every page render → HTTP 500.

## Files Changed

| File                                   | Change                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `src/components/landing/cta.tsx`       | Added `'use client'` directive — **PRIMARY FIX**                           |
| `src/app/error.tsx`                    | Added `Sentry.captureException(error)` call                                |
| `src/app/global-error.tsx`             | Created — Sentry-integrated React global error boundary                    |
| `src/components/ui/error-boundary.tsx` | Created — reusable class-based ErrorBoundary                               |
| `src/components/landing/hero.tsx`      | Wrapped `<HeroScene>` in `<ErrorBoundary>` with `<SceneSkeleton>` fallback |
| `src/instrumentation.ts`               | Added `onRequestError = Sentry.captureRequestError`                        |
| `next.config.js`                       | Removed deprecated `experimental.instrumentationHook`                      |
| `scripts/healthcheck.mjs`              | Created — post-deploy smoke test script                                    |
| `package.json`                         | Added `smoke` and `predeploy` scripts                                      |

## Verification

```bash
# Production build + start
npm run build && npm run start -- --port 3001

# Smoke test
node scripts/healthcheck.mjs http://localhost:3001
✅ Homepage: 200 OK
✅ Health API: 200 OK
✅ Dashboard: 200 OK
✅ Demo dashboard: 200 OK
✅ All smoke tests passed.

# TypeScript: 0 errors
npx tsc --noEmit

# ESLint: 0 warnings
npm run lint → ✔ No ESLint warnings or errors

# Unit tests: 66/66
npm test → Tests 66 passed (66)
```

## Deploy

Committed as `fix(crash): add use client to cta.tsx — resolves 500 on homepage`.
Pushed to `main` — Vercel auto-deploys via GitHub integration.

**Smoke test against production:**
Run `node scripts/healthcheck.mjs https://awdah-ochre.vercel.app` after deploy completes.

## Defenses Added

1. **ErrorBoundary on 3D hero** — if WebGL/Three.js fails, shows `<SceneSkeleton>` instead of crashing page
2. **global-error.tsx** — catches React render errors app-wide + sends to Sentry
3. **error.tsx** — now sends caught errors to Sentry
4. **onRequestError** in instrumentation.ts — captures server-side request errors in Sentry
5. **healthcheck.mjs** — `npm run smoke <url>` for instant post-deploy verification
6. **predeploy** script — runs build + tests before any deploy

## How To Prevent This Class of Bug

- Server Components MUST NOT pass functions as props to Client Components
- `next build` does NOT catch this — only runtime does
- Added to `RUNBOOK.md`: add `'use client'` whenever a component uses event handlers inline
- The forbidden-color lint-staged guard (`scripts/check-colors.mjs`) model can be extended to also grep for this pattern in future

## Agent Usage

| Agent                | Work                                             |
| -------------------- | ------------------------------------------------ |
| cybersecurity-expert | Step 1: repro + server log capture               |
| qa-tester            | Step 1: smoke test validation                    |
| code-developer       | Step 2: root cause hunt, Step 3: fix application |
| code-reviewer        | Step 3: reviewed cta.tsx fix + defensive layers  |
| 3d-designer          | Step 3: ErrorBoundary around HeroScene           |
| devops-engineer      | Step 4: healthcheck script, predeploy hook       |
| project-manager      | Step 6: CRASH-DIAGNOSIS.md + FIX-REPORT.md       |
