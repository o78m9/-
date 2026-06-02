# Aooda Security Policy

## Reporting a vulnerability

Email **security@aooda.sa** with a clear description of the issue. We prefer reports in Arabic or English. PGP key on request.

We try to acknowledge within **24 hours** and provide a remediation timeline within **5 business days**.

## Scope

In scope:

- `aooda.sa` and any official subdomain
- `iota-liard.vercel.app` (current production deployment behind authentication)
- The Aooda dashboard, API, and WhatsApp re-engagement features
- The Aooda mobile app (when it ships)

Out of scope:

- Third-party services we integrate with (report directly to Vercel, Supabase, Neon, Anthropic, Sentry, Upstash, PostHog, Meta)
- Denial-of-service attacks
- Physical attacks or social engineering against employees or customers
- Issues requiring physical access to a user's device
- Reports about missing best practices (HSTS preload, weak ciphers) without an exploit chain

## Safe harbour

We will not pursue legal action against researchers who:

1. Act in good faith and avoid privacy violations, destruction of data, or disruption of service
2. Stop and report immediately if they encounter real patient PII
3. Do not exploit findings beyond what is necessary to demonstrate the issue
4. Give us **90 days** to remediate before public disclosure
5. Comply with applicable laws (Jordan PDPL, Saudi PDPL, GCC data-protection statutes)

## Disclosure timeline

- **Day 0:** report received
- **Day 1:** acknowledgement
- **Day 5:** triage + severity + plan
- **Day 30:** target patch for P0/P1
- **Day 90:** public disclosure window opens unless mutually extended

## Rewards

We do not currently run a paid bug-bounty program. We will:

- Acknowledge you publicly on `https://aooda.sa/security-thanks` (with your consent)
- Send you Aooda merchandise where possible
- Provide a written reference for your CV

## Severity matrix

| Level | Examples                                                                | Internal SLA                                          |
| ----- | ----------------------------------------------------------------------- | ----------------------------------------------------- |
| P0    | Cross-tenant data exposure, RCE, auth bypass to admin, real PII leak    | Hotfix < 24 h, public disclosure waits for our notice |
| P1    | Stored XSS in the dashboard, SQLi behind auth, IDOR on PII, secret leak | < 7 d                                                 |
| P2    | Reflected XSS, missing security header, info disclosure                 | < 30 d                                                |
| P3    | Verbose errors, defence-in-depth gaps                                   | Backlog                                               |

## Compliance posture

Aooda is operated from Amman, Jordan with deployments in EU regions for non-MENA traffic. We aim to comply with:

- **Jordan PDPL** (Personal Data Protection Law)
- **Saudi PDPL** (data residency where applicable)
- **GDPR Art. 28** as a sub-processor for clinics serving EU residents
- **Track to SOC 2 Type 1** in the first 12 months after general availability

For Data Processing Agreements or sub-processor lists, contact **legal@aooda.sa**.

## Past advisories

Tracked in `docs/security/redteam-app/` (pentest sessions) and `docs/DECISIONS.md` (architecture-level fixes).

---

This policy is published at:

- https://aooda.sa/SECURITY.md
- https://github.com/o78m9/-/blob/main/SECURITY.md
- https://aooda.sa/.well-known/security.txt (machine-readable summary)

**Last updated:** 2026-06-02
