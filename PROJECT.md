# Awdah — AI Customer Activation System

## Vision

Turn every Arabic-market clinic and small business into a retention machine. Awdah uses AI to identify dormant customers, generate personalised Arabic WhatsApp messages, and track re-activation results — all in a single dashboard.

## Problem

80% of clinic revenue comes from repeat customers. Most clinics lose 30–40% of patients to silence — no follow-up, no re-engagement, no system. Manual outreach is slow and impersonal. Awdah fixes this with one-click AI campaigns.

## Target Users

| Persona           | Description                                         | Pain                                         |
| ----------------- | --------------------------------------------------- | -------------------------------------------- |
| Clinic Owner      | Runs dental/beauty/physio clinic, 200–2000 patients | No time to follow up manually                |
| Receptionist      | Manages bookings and patient list                   | Imports from Excel, chases patients by phone |
| Marketing Manager | Runs campaigns for multi-branch clinics             | No segmentation tool, no ROI tracking        |

## Core Features

### Shipped ✅

- Landing page (editorial Arabic/English design)
- Customer database (import CSV, capture form, QR code)
- AI campaign wizard (segment → message → schedule → send)
- Claude-powered Arabic message generation
- Demo mode (zero credentials required)
- Supabase auth (login / signup / protected routes)
- Health endpoint + bundle analyzer
- 38 unit tests + 6 e2e Playwright tests

### Building 🔨

- 3D interactive hero scene (React Three Fiber)
- Dark mode
- Observability (Pino logging, Web Vitals, error tracking)
- Rate limiting on all API routes
- Pagination on customer list
- Security headers (A+ rating)
- Test coverage >80%
- Performance: Lighthouse >95 all categories

### Planned 📋

- WhatsApp Business API integration
- Analytics dashboard (campaign open rates, ROI)
- Multi-branch support
- Subscription billing (Stripe)
- Mobile app (React Native)

## Success Metrics

- Lighthouse: >95 all categories
- Test coverage: >80%
- Security headers: A+ on securityheaders.com
- Core Web Vitals: all green
- 60fps on mid-range mobile
- Zero TypeScript errors
- Zero ESLint errors
- Zero npm audit HIGH/CRITICAL
