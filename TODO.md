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

| Phase | Name                          | Est. | Status          |
| ----- | ----------------------------- | ---- | --------------- |
| 1     | Brand Bible + Design Tokens   | 8h   | [x] DONE        |
| 2     | Typography                    | 4h   | [x] DONE        |
| 3     | Motion System                 | 12h  | [~] IN PROGRESS |
| 4     | Apple-Level Details           | 16h  | [ ]             |
| 5     | Vercel-Level Performance      | 10h  | [ ]             |
| 6     | Stripe-Level Copy             | 8h   | [ ]             |
| 7     | Trust Elements                | 14h  | [ ]             |
| 8     | Interactive Dashboard Preview | 16h  | [ ]             |
| 9     | Security Hardening            | 12h  | [ ]             |
| 10    | SEO + Meta                    | 6h   | [ ]             |
| 11    | Accessibility (WCAG AAA)      | 8h   | [ ]             |
| 12    | Little Things                 | 10h  | [ ]             |
| 13    | Quality Gates                 | 8h   | [ ]             |
| 14    | Deploy                        | 6h   | [ ]             |

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
- [ ] 2.7 text-balance on headings, text-pretty on body
- [ ] 2.8 font-feature-settings for Arabic numerals

---

## Phase 3: Motion System [IN PROGRESS]

- [ ] 3.1 LenisProvider component + layout integration
- [ ] 3.2 Lenis + Framer Motion RAF sync
- [ ] 3.3 ScrollProgress bar component (top viewport, sage)
- [ ] 3.4 CustomCursor (dot 8px + ring 40px, touch-hidden)
- [ ] 3.5 Verify TiltCard exists and works
- [ ] 3.6 CountUp number animation component
- [ ] 3.7 Page transition via View Transition API

---

## Phase 4: Apple-Level Details

- [ ] 4.1 3-state Button (idle → loading → success)
- [ ] 4.2 FloatInput (float-label input)
- [ ] 4.3 FloatTextarea
- [ ] 4.4 Card hover lift
- [ ] 4.5 NavLink underline slide animation
- [ ] 4.6 plaiceholder blurhash on images
- [ ] 4.7 cmdk CommandPalette (Cmd+K)
- [ ] 4.8 useKeyboardShortcuts hook

---

## Phase 5: Vercel-Level Performance

- [ ] 5.1 Replace all raw img with next/image
- [ ] 5.2 Font display: optional (FOUT prevention)
- [ ] 5.3 Dynamic imports for heavy components
- [ ] 5.4 Edge runtime on stateless API routes
- [ ] 5.5 Streaming SSR for dashboard
- [ ] 5.6 Bundle analyzer + <200KB first load JS target
- [ ] 5.7 next.config.ts optimizations
- [ ] 5.8 Lighthouse 95+ on all metrics

---

## Phase 6: Stripe-Level Copy

- [ ] 6.1 Audit all Arabic copy
- [ ] 6.2 Rewrite hero (max 12 words/sentence, active voice)
- [ ] 6.3 Rewrite features copy (3 variants each)
- [ ] 6.4 First-person CTAs: أبدأ مجاناً / أجرّب الآن
- [ ] 6.5 Rewrite pricing copy
- [ ] 6.6 Power stats inline with copy
- [ ] 6.7 Create /docs/COPY.md

---

## Phase 7: Trust Elements

- [ ] 7.1 LogoBar (6 clinic logos, hover color)
- [ ] 7.2 MetricBar (3 animated stats)
- [ ] 7.3 Video testimonial cards + lightbox
- [ ] 7.4 Case study cards (before/after)
- [ ] 7.5 Security badges strip
- [ ] 7.6 Live reactivation counter (30s polling)
- [ ] 7.7 /api/live-stats endpoint

---

## Phase 8: Interactive Dashboard Preview

- [ ] 8.1 Browser chrome mockup container
- [ ] 8.2 Tab switcher (المرضى / الرسائل / التقارير)
- [ ] 8.3 Patients tab with list
- [ ] 8.4 Animated Recharts bar chart
- [ ] 8.5 Animated line chart
- [ ] 8.6 KPI cards with sparklines
- [ ] 8.7 WhatsApp message bubbles
- [ ] 8.8 Messages tab
- [ ] 8.9 Fake live notifications every 8s
- [ ] 8.10 Reports tab

---

## Phase 9: Security Hardening

- [ ] 9.1 Strict nonce-based CSP in middleware
- [ ] 9.2 CSRF protection on all mutations
- [ ] 9.3 Zod validation on 100% of API inputs
- [ ] 9.4 DOMPurify for dangerouslySetInnerHTML
- [ ] 9.5 Audit log table in DB
- [ ] 9.6 2FA option via Supabase MFA
- [ ] 9.7 security.txt at /.well-known/
- [ ] 9.8 npm audit: zero HIGH/CRITICAL
- [ ] 9.9 Security headers
- [ ] 9.10 Rate limiting on all public API routes

---

## Phase 10: SEO + Meta

- [ ] 10.1 @vercel/og OG image endpoint
- [ ] 10.2 Twitter card meta tags
- [ ] 10.3 Schema.org JSON-LD
- [ ] 10.4 hreflang ar/en
- [ ] 10.5 robots.txt
- [ ] 10.6 Dynamic sitemap.xml
- [ ] 10.7 Canonical URLs

---

## Phase 11: Accessibility (WCAG AAA)

- [ ] 11.1 Semantic HTML audit
- [ ] 11.2 Skip-to-content link
- [ ] 11.3 Focus trap in all modals
- [ ] 11.4 axe-core: zero violations
- [ ] 11.5 ARIA live regions
- [ ] 11.6 Keyboard navigation audit
- [ ] 11.7 Color contrast audit (7:1)
- [ ] 11.8 aria-label on icon-only buttons

---

## Phase 12: Little Things

- [ ] 12.1 Complete favicon set (16/32/180/192/512px)
- [ ] 12.2 Custom 404 page (Arabic, on-brand)
- [ ] 12.3 Custom 500/error page
- [ ] 12.4 Skeleton loader components
- [ ] 12.5 Empty state illustrations
- [ ] 12.6 Custom Sonner toast theme
- [ ] 12.7 Easter egg (Konami code → confetti)

---

## Phase 13: Quality Gates

- [ ] 13.1 TypeScript strict: zero errors
- [ ] 13.2 ESLint: zero warnings
- [ ] 13.3 Test coverage >80% stmts/funcs, >75% branches
- [ ] 13.4 Playwright E2E for critical paths
- [ ] 13.5 Lighthouse: 95+ Perf, 100 A11y, 100 BP, 100 SEO
- [ ] 13.6 LCP <1.5s, CLS <0.05, INP <200ms
- [ ] 13.7 Cross-browser testing
- [ ] 13.8 npm audit: zero HIGH/CRITICAL
- [ ] 13.9 Bundle: first load JS <200KB

---

## Phase 14: Deploy

- [ ] 14.1 Vercel production deployment
- [ ] 14.2 Environment variable audit + /docs/ENV.md
- [ ] 14.3 Staging branch + preview deployments
- [ ] 14.4 PostHog analytics
- [ ] 14.5 Sentry error tracking
- [ ] 14.6 Uptime monitoring
- [ ] 14.7 /api/health endpoint
- [ ] 14.8 Post-deploy smoke test

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
