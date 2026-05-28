# Architecture Decisions

## 2026-05-28

### BUG-1: Dashboard Demo Route

**Decision:** Create `/dashboard/demo` as a fully public route (no auth) with rich mock data.

**Why:** `/dashboard` auth-gates via middleware. "الدخول" from header sends visitors to auth wall. Demo route lets anyone see the product immediately.

**How:** New `src/app/dashboard/demo/page.tsx` `'use client'`. Middleware config excludes `/dashboard/demo`. Header "الدخول" rewired to `/dashboard/demo`.

---

### BUG-2: How It Works Redesign

**Decision:** Option B — dense full-width cards, 12-col internal grid.

**Why:** Option A leaves dead center space. Option B fills width naturally with rich mockup per step.

**Implementation:** Each step = wide card. Right col: huge Arabic number (gold gradient). Center: title + desc + 3 bullet points. Left col: rich animated mockup. Ambient floating particles behind each card.

---

### BUG-3: Hero 3D Upgrade

**Decision:** Multi-layer: 3 orbital rings (InstancedMesh), Fresnel glow core, returning-particle Bezier trails, post-processing (Bloom + ChromaticAberration + Vignette + Noise).

**Performance:** Mobile → 30 particles, DPR cap 2, RAF pause on tab hidden, prefers-reduced-motion → static.

---

## 2026-05-28

### PHASE-14: Deploy

**Decision:** PostHog + Sentry both opt-in via env var (absent = disabled, no runtime cost). Sentry Replay excluded — adds ~60 kB to shared bundle. First Load JS: 173 kB (target <200 kB ✓).

**Vercel:** Deployed to `awdah` project (navolasweets-6423s-projects). Production URL: https://awdah-b42ltwjjv-navolasweets-6423s-projects.vercel.app

**Remaining manual steps:** set Vercel env vars (Supabase, Neon, Anthropic, PostHog, Sentry), configure uptime monitor, run Lighthouse post-DNS.

---

### BUG-4: Dashboard Crash in Prod (CRITICAL)

**Root cause:** `supabase.auth.getUser()` throws when `NEXT_PUBLIC_SUPABASE_URL` is empty in prod. Middleware skips auth check when Supabase not configured, letting users reach `/dashboard`. Page had no try/catch — unhandled exception hit `error.tsx`.

**Fix:** Wrapped entire `getServerData()` + `createClient()` + `auth.getUser()` in try/catch in `src/app/dashboard/page.tsx`. Catch path → `user = null` → `isAuthenticated=false` → demo mode. Never crashes.

---

### BUG-5: Silver/Gray Color Violation

**Root cause:** `comparison.tsx` used full light-theme (bg-stone-100, bg-white, text-stone-\*). `product-mockup.tsx` used bg-white/#FAFAF7. `how-it-works.tsx` TypingDots used bg-white.

**Fix:** Rewrote all to brand tokens only. comparison.tsx now: bg-[#0A1F1C] section, bg-[#142B27] table, gold/sage/cream text. product-mockup.tsx: dark glass theme. TypingDots: rgba(26,51,45,0.95).

---

### BUG-6: Hero 3D Degraded — Rebuild

**Decision:** Delete old scene, create `src/components/hero/HeroScene.tsx` from spec.

**Components:** CoreOrb (MeshDistortMaterial, breathe + backside glow), OrbitRings (3× InstancedMesh, different tilt/speed), ReturnFlow (8 Bezier-path particles + Trail + light spike on arrival), ParallaxRig (mouse lerp).

**Post-FX:** Desktop: Bloom + ChromaticAberration + Vignette + Noise. Mobile: Bloom only. prefers-reduced-motion: StaticScene (no animation). DPR capped at devicePixelRatio. Performance min 0.5.
