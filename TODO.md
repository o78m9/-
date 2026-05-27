# TODO — Phase 2: Quality & Security

Legend: [ ] todo | [x] done | [~] in-progress | [!] blocked

## Security (cybersecurity-expert)

- [ ] SEC-01: Add security headers middleware (CSP, HSTS, X-Frame-Options, Permissions-Policy, Referrer-Policy)
- [ ] SEC-02: Rate limit /api/customers, /api/import, /api/booking, /api/generate-message
- [ ] SEC-03: Sanitize all user inputs (DOMPurify or custom strip-tags)
- [ ] SEC-04: Fix demo cookie — add \_\_Host- prefix, SameSite=Strict
- [ ] SEC-05: Add CSRF protection on mutating API routes
- [ ] SEC-06: Audit npm deps (run npm audit, fix HIGH/CRITICAL)
- [ ] SEC-07: Remove any hardcoded secrets from code
- [ ] SEC-08: Add Content-Security-Policy report-only first, then enforce

## 3D Design (3d-designer)

- [ ] 3D-01: 3D hero scene — floating clinic data nodes with connection lines
- [ ] 3D-02: Add post-processing (bloom, vignette)
- [ ] 3D-03: Responsive canvas (mobile fallback to static image at <768px)
- [ ] 3D-04: Performance budget — <2MB total 3D assets, 60fps on mid-range

## UI/UX (ui-ux-designer)

- [ ] UI-01: Dark mode (CSS variables swap, system preference + manual toggle)
- [ ] UI-02: WCAG AA audit — fix all contrast failures
- [ ] UI-03: OG image generation with next/og
- [ ] UI-04: Skeleton loaders on dashboard data fetch
- [ ] UI-05: Add `aria-live` regions for toast notifications

## Developer (code-developer)

- [ ] DEV-01: Pino structured logging (replace console.warn/log in API routes)
- [ ] DEV-02: Web Vitals component (add to layout.tsx)
- [ ] DEV-03: Cursor-based pagination on /api/customers + CustomerList component
- [ ] DEV-04: Delete CustomerTable.tsx (confirmed dead code)
- [ ] DEV-05: React Query for dashboard data fetching
- [ ] DEV-06: Error boundary components
- [ ] DEV-07: next/og route for social sharing

## Testing (code-reviewer + code-developer)

- [ ] TEST-01: API route tests (api/customers, api/booking, api/import)
- [ ] TEST-02: Component tests (Dashboard, CampaignWizard, CustomerList)
- [ ] TEST-03: Auth flow tests (middleware, login, signup)
- [ ] TEST-04: Coverage threshold: lines >80, branches >75
- [ ] TEST-05: Fix e2e tests for new localhost:3001

## Observability

- [ ] OBS-01: Pino logger setup (src/lib/logger.ts)
- [ ] OBS-02: Web Vitals reporter (CLS, FID, LCP, FCP, TTFB)
- [ ] OBS-03: Health endpoint enhancement (DB ping, version)

## Marketing (marketing-specialist — last)

- [ ] MKT-01: Rewrite README.md to sell
- [ ] MKT-02: SEO meta tags on all pages
- [ ] MKT-03: robots.txt + sitemap.xml
- [ ] MKT-04: Social media copy draft
