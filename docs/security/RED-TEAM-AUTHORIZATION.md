# Red Team Authorization

> Signed authorization for the `red-team-attacker` agent. Single source of truth for what is in scope. No session may run without a valid (unexpired) authorization below.

## Authorized scopes

| ID             | Environment | Hosts                    | Methods   | Rate limit | Valid from | Valid until |
| -------------- | ----------- | ------------------------ | --------- | ---------- | ---------- | ----------- |
| LOCAL-001      | local dev   | `localhost`, `127.0.0.1` | \*        | 5 req/sec  | 2026-06-01 | 2027-06-01  |
| STAGING-001    | staging     | `staging.aooda.com`      | \*        | 2 req/sec  | 2026-06-01 | 2026-09-01  |
| PROD-RECON-001 | prod recon  | `aooda.com`              | GET, HEAD | 1 req/sec  | 2026-06-01 | 2026-09-01  |

## Forbidden across all scopes

- Any write/mutation to prod
- DoS / volumetric attacks
- Touching real patient PII
- Lateral movement (Vercel/Supabase/Neon platforms themselves)
- Persistence (backdoors, implanted accounts)
- Bypassing WAF deliberately
- Social engineering humans
- Generating weaponized exploits for external use
- Deleting evidence

## Operator handshake required

Every session: operator names themselves, the scope ID, and the session reason in `docs/security/redteam-app/session.log` before any live request.

## Emergency contact

- **CISO escalation (P0):** owner — Omar Awad (omar.ib.awad@gmail.com)
- **15-minute SLA** for P0 findings during business hours
- **Kill switch:** `node tests/redteam-app/lib/safe_curl.mjs --abort`

## Tool integrity

The agent must validate, at session start, that `tests/redteam-app/lib/safe_curl.mjs` matches the SHA-256 below. Mismatch = abort.

- `safe_curl.mjs` SHA-256: `d8632b935726546099c6a9f11e0b4f3121a652ec29c1fe30e252556fc45c7b32`
- Pinned: 2026-06-01 — see `docs/security/redteam-app/integrity.json`

## Signature

| Role    | Name      | Date       | Signature                |
| ------- | --------- | ---------- | ------------------------ |
| Founder | Omar Awad | 2026-06-01 | `omar.ib.awad@gmail.com` |

---

**Renewal:** required every 90 days OR on scope change. Expired auth → agent refuses all live actions.
