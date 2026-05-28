# Crash Diagnosis — 2026-05-28

## Symptom

Production homepage (`/`) and dashboard (`/dashboard`) returning HTTP 500.
Browser shows Arabic error page ("حدث خطأ غير متوقع").

## Reproduction

```bash
npm run build && npm run start -- --port 3001
curl -v http://localhost:3001/
# → HTTP/1.1 500 Internal Server Error
```

## Server Log (exact error)

```
⨯ Error: Event handlers cannot be passed to Client Component props.
  {source: ..., className: ..., onMouseEnter: function onMouseEnter, onMouseLeave: ..., style: ..., children: ...}
                                              ^^^^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
    at stringify (<anonymous>) {
  digest: '4044319376'
}
```

## Root Cause

**File:** `src/components/landing/cta.tsx`  
**Line:** 130–134

`FinalCTA` was a **Server Component** (missing `'use client'`) but passed `onMouseEnter` and `onMouseLeave` event handler functions as props to `BookingButton` (a Client Component).

Next.js 15 enforces the React Server Components boundary strictly at runtime — functions (event handlers) cannot be serialized across the Server→Client boundary. The serialization failure throws at page render time → 500.

## Why Build Passed But Runtime Failed

Next.js `next build` does NOT catch this violation at compile time. The RSC boundary check only occurs at runtime during server-side rendering. The build succeeds, but the first request that renders the component throws.

## Comparison: Other Server Components That Are Fine

- `comparison.tsx` — Server Component, no event handlers → OK
- `footer.tsx` — Server Component, no event handlers → OK
- `problem-solution.tsx` — Server Component, no event handlers → OK
- `cta.tsx` — Server Component, **HAS** `onMouseEnter`/`onMouseLeave` → **CRASH**

## Why Dashboard Also Crashed

The root layout (`app/layout.tsx`) renders all pages. When the homepage crashed, the error boundary caught it and displayed the error page. Dashboard was also affected because the crash happened during the initial page render of routes that include `FinalCTA` through shared layout.

## Fix Applied

Added `'use client'` directive to top of `src/components/landing/cta.tsx`.
