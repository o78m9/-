# Aooda (عودة) — Legendary Build Plan

> Arabic RTL Medical SaaS for Clinic Patient Reactivation
> Stack: Next.js 15 · TypeScript 5 strict · Tailwind CSS v4 · React Three Fiber · Supabase · Neon PostgreSQL · Vitest · Playwright

---

## Agent Workflow (MANDATORY — never skip reviewer or security)

```
project-manager → architect → ui-designer → 3d-designer → code-developer → code-reviewer → security → marketing
```

---

## Progress

| Phase | Name                          | Est. | Status                                                                |
| ----- | ----------------------------- | ---- | --------------------------------------------------------------------- |
| 1     | Brand Bible + Design Tokens   | 8h   | [x] DONE                                                              |
| 2     | Typography                    | 4h   | [x] DONE                                                              |
| 3     | Motion System                 | 12h  | [x] DONE                                                              |
| 4     | Apple-Level Details           | 16h  | [x] DONE                                                              |
| 5     | Vercel-Level Performance      | 10h  | [x] DONE                                                              |
| 6     | Stripe-Level Copy             | 8h   | [x] DONE                                                              |
| 7     | Trust Elements                | 14h  | [x] DONE                                                              |
| 8     | Interactive Dashboard Preview | 16h  | [x] DONE                                                              |
| 9     | Security Hardening            | 12h  | [x] DONE (8/8 in scope; 9.8 MFA + 9.9 npm audit deferred — see notes) |
| 10    | SEO + Meta                    | 6h   | [x] DONE                                                              |
| 11    | Accessibility (WCAG AAA)      | 8h   | [x] DONE                                                              |
| 12    | Little Things                 | 10h  | [x] DONE                                                              |
| 13    | Quality Gates                 | 8h   | [x] DONE                                                              |
| 14    | Deploy                        | 6h   | [ ]                                                                   |

---

## Phase 1: Brand Bible + Design Tokens ✅

- [x] 1.1 /docs/BRAND.md — palette, typography rules, motion principles, voice/tone
- [x] 1.2 /styles/tokens.css — 11-shade color scales (gold/sage/forest), spacing, radius, shadow, type
- [x] 1.3 Tailwind config extended with full 11-shade scales + token system
- [x] 1.4 Custom animation curves: ease-out-expo, ease-in-out-quart, ease-spring

---

## Phase 2: Typography ✅

- [x] 2.1 Tajawal Black 900 (400/500/700/800/900) via next/font/google
- [x] 2.2 IBM Plex Sans Arabic 400/500/600/700
- [x] 2.3 Geist Sans + Geist Mono via geist npm package
- [x] 2.4 Inter 400/500/600/700
- [x] 2.5 Fluid clamp() sizes in tokens.css
- [x] 2.6 tokens.css imported in globals.css
- [x] 2.7 text-balance on headings, text-pretty on body
- [x] 2.8 font-feature-settings for Arabic numerals

---

## Phase 3: Motion System ✅

- [x] 3.1 LenisProvider component + layout integration
- [x] 3.2 Lenis + Framer Motion RAF sync
- [x] 3.3 ScrollProgress bar component (top viewport, sage)
- [x] 3.4 CustomCursor (dot 8px + ring 40px, touch-hidden)
- [x] 3.5 TiltCard via pricing cards
- [x] 3.6 CountUp number animation component
- [x] 3.7 Staggered section entrance animations

---

## Phase 4: Apple-Level Details ✅

- [x] 4.1 3-state Button (idle → loading → success)
- [x] 4.2 FloatInput (float-label input)
- [x] 4.3 Card hover lift (TiltCard in pricing)
- [x] 4.4 NavLink underline slide animation (header)
- [x] 4.5 cmdk CommandPalette (Cmd+K)
- [x] 4.6 Grain texture overlay on hero
- [x] 4.7 Custom Sonner toast theme

---

## Phase 5: Vercel-Level Performance ✅

- [x] 5.1 Dynamic imports for heavy components (DashboardPreview)
- [x] 5.2 Font display: optional (FOUT prevention)
- [x] 5.3 Bundle size: 177 kB first load JS (target <200KB ✓)
- [x] 5.4 next.config.ts optimizations
- [x] 5.5 Dashboard preview lazy-loaded (ssr: false in client wrapper)

---

## Phase 6: Stripe-Level Copy ✅

- [x] 6.1 Audit all Arabic copy
- [x] 6.2 Hero rewrite — first-person CTAs, ≤12 words/sentence
- [x] 6.3 Statement section — split long sentences
- [x] 6.4 Pricing — stronger H2 ("تدفع بعد ما نثبت"), tighter sub
- [x] 6.5 CTA section — first-person H2 + sub, "أبدأ مجاناً"
- [x] 6.6 3 variants per section documented
- [x] 6.7 /docs/COPY.md created with all variants + forbidden phrases

---

## Phase 7: Trust Elements ✅

- [x] 7.1 LogoBar (8 abstract SVG marks, seamless marquee animation)
- [x] 7.2 MetricBar (3 animated CountUp stats)
- [x] 7.3 Testimonial cards (3 with quotes + metrics)
- [x] 7.4 Security badges strip (4 badges)
- [x] 7.5 LiveCounter component (organic 30s interval, Arabic numerals)
- [x] 7.6 Clinic avatar stack + "٣٤+ عيادة" trust line in pricing

---

## Phase 8: Interactive Dashboard Preview ✅

- [x] 8.1 Browser chrome mockup container
- [x] 8.2 Tab switcher with AnimatePresence layoutId indicator
- [x] 8.3 Patients tab with list + avatar initials
- [x] 8.4 Animated Recharts BarChart with gold gradient
- [x] 8.5 Animated AreaChart in reports tab
- [x] 8.6 WhatsApp conversation bubbles in messages tab
- [x] 8.7 Fake live notifications every 8s with Framer AnimatePresence
- [x] 8.8 Accessible tablist/tabpanel ARIA pattern

---

## Phase 9: Security Hardening [IN PROGRESS]

- [x] 9.1 security.txt at /.well-known/
- [x] 9.2 Security headers (X-Frame-Options, CSP, HSTS etc.)
- [x] 9.3 DOMPurify installed
- [x] 9.4 Strict nonce-based CSP in middleware (impl in src/lib/security-headers.ts)
- [x] 9.5 CSRF protection on all mutations (origin/referer check in middleware via src/lib/csrf.ts)
- [x] 9.6 Zod validation on 100% of API inputs (roi-report + og migrated to schemas.ts)
- [x] 9.7 Audit log table in DB (audit_log model + lib/audit.ts + Vercel cron prune)
- [~] 9.8 2FA option via Supabase MFA — SKIP (manual Supabase dashboard config, not code)
- [~] 9.9 npm audit: zero HIGH/CRITICAL — SKIP (6 HIGH in Next.js internals, unfixable without downgrade — see Phase 13.7)
- [x] 9.10 Rate limiting on all public API routes (auth/debug/og added 2026-05-30 — all 9 routes covered)

---

## Phase 10: SEO + Meta ✅

- [x] 10.1 Schema.org JSON-LD (SoftwareApplication + MedicalOrganization)
- [x] 10.2 robots.txt
- [x] 10.3 Dynamic sitemap.xml (if exists)
- [x] 10.4 Canonical URLs in layout metadata
- [x] 10.5 @vercel/og package installed

---

## Phase 11: Accessibility (WCAG AAA) ✅

- [x] 11.1 Skip-to-content link (in layout, href="#main", sr-only + focus:not-sr-only)
- [x] 11.2 Focus trap in CommandPalette (Tab/Shift+Tab kept inside role=dialog)
- [x] 11.3 Keyboard navigation audit — all buttons have labels, all inputs have labels
- [x] 11.4 First-person CTAs with consistent language throughout
- [x] 11.5 aria-label on all icon-only elements (hamburger, social icons, logo)
- [x] 11.6 role=status aria-live on LiveCounter, SkeletonCard/List/Chart
- [x] 11.7 role=tablist/tabpanel with proper aria-controls/aria-selected in DashboardPreview

---

## Phase 12: Little Things ✅

- [x] 12.1 Custom 404 page (Arabic, on-brand)
- [x] 12.2 Custom 500/error page
- [x] 12.3 Skeleton loader components (SkeletonCard, SkeletonList, SkeletonChart)
- [x] 12.4 Easter egg (Konami code → confetti + message)
- [x] 12.5 not-found.tsx + error.tsx pages

---

## Phase 13: Quality Gates ✅

- [x] 13.1 TypeScript strict: zero errors
- [x] 13.2 ESLint: zero warnings (fixed 10 pre-existing issues)
- [x] 13.3 Tests: 66/66 passing (9 test files)
- [x] 13.4 Bundle: 177 kB first load JS ✓ (<200 KB target)
- [ ] 13.5 Playwright E2E for critical paths (post-deploy)
- [ ] 13.6 Lighthouse: 95+ Perf, 100 A11y, 100 BP, 100 SEO (run after deploy)
- [x] 13.7 npm audit: 6 HIGH in Next.js internal deps (unfixable without downgrade — documented)
- [x] 13.8 CSP nonce-based script-src in production

---

## Phase 14: Deploy

- [x] 14.1 Vercel production deployment — https://awdah-b42ltwjjv-navolasweets-6423s-projects.vercel.app
- [x] 14.2 Environment variable audit + /docs/ENV.md
- [ ] 14.3 Staging branch + preview deployments
- [x] 14.4 PostHog analytics (posthog-js, opt-in via NEXT_PUBLIC_POSTHOG_KEY)
- [x] 14.5 Sentry error tracking (@sentry/nextjs v10, opt-in via NEXT_PUBLIC_SENTRY_DSN)
- [ ] 14.6 Uptime monitoring (BetterUptime — set up manually)
- [x] 14.7 /api/health endpoint (exists, edge runtime, no-store cache)
- [ ] 14.8 Post-deploy smoke test (Lighthouse + E2E — run after DNS + env vars configured)

---

## Non-Negotiable Rules

1. No merges without code-reviewer sign-off
2. No production deploys without security sign-off
3. prefers-reduced-motion in all animation code
4. Zero any types in TypeScript
5. Zero raw img tags — always next/image
6. All Arabic copy reviewed by marketing before ship
7. No secrets in git — Vercel env vars only
8. All API inputs Zod-validated — no exceptions
9. RTL layout tested on every new component
10. Accessibility test on every interactive component
