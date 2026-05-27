# Awdah Roadmap

## Phase 1 — Foundation (DONE ✅)

- [x] Next.js 15 + TypeScript + Tailwind v4
- [x] Supabase auth + Neon PostgreSQL
- [x] Landing page (all sections)
- [x] Campaign wizard (5-step AI flow)
- [x] Customer import (CSV + QR + form)
- [x] Demo mode (no credentials)
- [x] 38 unit tests + e2e
- [x] Feature-sliced architecture
- [x] Strict TypeScript
- [x] ESLint + Prettier + Husky

## Phase 2 — Quality & Security (CURRENT 🔨)

Target: Lighthouse >95, Security A+, Coverage >80%

- [ ] 3D hero scene (React Three Fiber + drei)
- [ ] Dark mode (system + manual toggle)
- [ ] Security headers (CSP, HSTS, X-Frame, Permissions-Policy)
- [ ] Rate limiting (upstash/ratelimit on all API routes)
- [ ] Input sanitization on all API endpoints
- [ ] Pino structured logging
- [ ] Web Vitals reporting
- [ ] Pagination on customer list (cursor-based)
- [ ] Test coverage >80% (add API route + component tests)
- [ ] CustomerTable.tsx audit (dead code cleanup)
- [ ] WCAG AA accessibility pass
- [ ] OG images (next/og)

## Phase 3 — Analytics & Growth

- [ ] Campaign analytics (open rate, click rate, ROI)
- [ ] Customer lifetime value scoring
- [ ] Automated re-activation triggers (cron)
- [ ] Multi-branch support (clinic_id scoping)
- [ ] Stripe billing integration
- [ ] Admin panel

## Phase 4 — Scale & Mobile

- [ ] WhatsApp Business API integration
- [ ] Push notifications
- [ ] React Native mobile app
- [ ] Multi-tenant architecture
- [ ] CDN + edge caching

## Milestones

| Milestone        | Target     | Gate                               |
| ---------------- | ---------- | ---------------------------------- |
| Phase 2 complete | 2026-06-10 | All quality gates pass             |
| Beta launch      | 2026-07-01 | 5 pilot clinics                    |
| Public launch    | 2026-09-01 | Stripe live, WhatsApp API approved |
