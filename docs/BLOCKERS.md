# Blockers & Future Phases Roadmap

Last updated: 2026-05-28
Phases 0-2 complete. Phases 3-17 remain for future sessions.

---

## Phase 3 — Layout Rhythm & Spacing Audit

**Agent:** ui-ux-designer + code-reviewer

- Audit all page sections for consistent vertical rhythm (8px grid)
- Verify max-content width applied consistently
- Check all gap/padding tokens use design system values
- Ensure RTL logical properties (ps-/pe-) used everywhere, no mr-/ml-

---

## Phase 4 — Product Surface Rebuild

**Agent:** ui-ux-designer + code-developer

- Rebuild `product-mockup.tsx` with animated state transitions
- Add realistic Arabic customer data to all mockups
- WhatsApp-style message bubble component with read receipts
- Animate KPI counter on scroll-into-view

---

## Phase 5 — Copy Upgrade

**Agent:** content-writer + arabic-localization-expert

- Audit all Arabic copy for colloquial Jordanian dialect
- Hero headline A/B variants (2 options per section)
- Micro-copy: button labels, error states, empty states
- CTA copy optimization for conversion
- Review all English fallbacks removed (Arabic-only product)

---

## Phase 6 — WhatsApp & SMS Integration Stubs

**Agent:** integration-specialist + api-designer
**Blocker:** Needs Meta Business API credentials

- Create API route stubs: `POST /api/campaigns/send`
- WhatsApp Business Cloud API client wrapper
- SMS fallback via Twilio (stub)
- Message template approval workflow stub
- Webhook handler for delivery receipts

---

## Phase 7 — Database Schema Review

**Agent:** database-architect
**Blocker:** Needs Neon DATABASE_URL in Vercel

- Review `schema.sql` for missing indexes
- Add `campaigns` table with proper FK constraints
- Add `messages` table with status enum
- Add `analytics_events` table
- Generate migration files with rollback
- Seed script with realistic Arabic clinic data (50 customers, 3 campaigns)

---

## Phase 8 — Security Hardening

**Agent:** cybersecurity-expert + compliance-officer

- Audit CSP headers in middleware.ts
- Add rate limiting to all auth routes
- Review Supabase RLS policies
- Add input sanitization on all API routes
- HIPAA considerations for medical data (if applicable)
- Remove console.log statements from production code
- Audit for secret leakage in client bundles

---

## Phase 9 — Performance Optimization

**Agent:** performance-engineer
**Blocker:** Needs live prod URL for Lighthouse

- Lighthouse 95+ on all 4 categories
- Bundle analysis: split vendor chunks
- Image optimization: convert any remaining PNG→WebP
- Font subsetting for Arabic (wght:400,600,700 only)
- Preload critical CSS
- Remove unused Tailwind classes
- Target: First Load JS < 150kB

---

## Phase 10 — Accessibility Audit

**Agent:** accessibility-expert

- Screen reader test with NVDA (Arabic RTL)
- Keyboard navigation: all interactive elements reachable
- Focus trap in modals
- ARIA labels on all icon-only buttons
- Color contrast: WCAG AA minimum (4.5:1 for small text)
- Skip-to-main link on all pages
- Announce dynamic content changes to screen readers

---

## Phase 11 — SEO & Meta

**Agent:** seo-specialist

- Arabic OG tags on all pages
- JSON-LD schema (LocalBusiness for clinic)
- Sitemap.xml generation
- robots.txt
- Canonical URLs
- Review all `<title>` and `<meta description>` tags
- Arabic keyword research integration

---

## Phase 12 — Detail Polish

**Agent:** ui-ux-designer + motion-designer

- Loading skeleton states for all data-driven sections
- Empty state illustrations (Arabic context-appropriate)
- Error boundary UI with retry buttons
- Toast notification system (success/error/info)
- Micro-interactions: button press states, hover transitions
- Smooth page transitions between routes

---

## Phase 13 — Full Test Suite

**Agent:** qa-tester

- Playwright E2E: happy path (signup → dashboard → campaign → send)
  **Blocker:** Needs browser runtime + Supabase test environment
- Add tests for: auth flow, campaign creation, customer import
- Increase Vitest unit test coverage to 90%+
- Test RTL rendering with Hebrew/Arabic text edge cases
- Performance regression tests

---

## Phase 14 — GitHub Actions CI Gate

**Agent:** devops-engineer
**Blocker:** Needs GitHub repo secrets configured

- Add `.github/workflows/ci.yml`
- Steps: install → typecheck → lint → test → build
- Block merge on any failure
- Add deploy preview on PR via Vercel

---

## Phase 15 — Monitoring & Observability

**Agent:** devops-engineer + performance-engineer
**Blocker:** Needs Vercel env vars + BetterStack account

- Configure BetterStack uptime monitor on /api/health
- Configure Sentry alerts: error rate > 1%, p95 latency > 3s
- Set up PostHog funnel: landing → signup → first campaign
- Add `onRequestError` to `src/instrumentation.ts` for server error capture
- Add `global-error.tsx` for React render error capture

---

## Phase 16 — Brand & Marketing Assets

**Agent:** brand-strategist + illustrator + video-script-writer
**Blocker:** Requires human (photographer/videographer)

- Logo finalization (SVG, all sizes)
- OG image for social sharing (1200×630)
- Clinic testimonial video script
- Demo walkthrough video script
- Pitch deck template

---

## Phase 17 — Final Verification & Launch

**Agent:** project-manager + qa-tester + cybersecurity-expert
**Blocker:** All above phases must complete first

- Full manual QA pass on prod URL
- Security headers audit (securityheaders.com score A+)
- Legal pages: Privacy Policy, Terms of Service
  **Blocker:** Requires lawyer review
- Lighthouse final run: 95+ all categories
- Load test: 100 concurrent users
- Soft launch: invite 5 beta clinics

---

## Environment Variables Required (Manual Steps)

Set in Vercel dashboard before phases 7, 13, 15 can run:

| Variable                        | Required For              |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Auth, dashboard           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth, dashboard           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-side queries       |
| `DATABASE_URL`                  | Neon PostgreSQL           |
| `ANTHROPIC_API_KEY`             | AI campaign generation    |
| `NEXT_PUBLIC_POSTHOG_KEY`       | Analytics (optional)      |
| `NEXT_PUBLIC_SENTRY_DSN`        | Error tracking (optional) |
| `SENTRY_ORG`                    | Sentry source maps        |
| `SENTRY_PROJECT`                | Sentry source maps        |
| `SENTRY_AUTH_TOKEN`             | Sentry source maps        |

---

## Technical Debt (Carry Forward)

| Item                          | File                     | Risk                            |
| ----------------------------- | ------------------------ | ------------------------------- |
| `onRequestError` hook missing | `src/instrumentation.ts` | Server errors skip Sentry       |
| `global-error.tsx` missing    | —                        | React render errors skip Sentry |
| `legacyCookie` in middleware  | `middleware.ts`          | Remove after transition         |
| npm audit: 6 HIGH in Next.js  | package-lock.json        | Upstream, unfixable             |
