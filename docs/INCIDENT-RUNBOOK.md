# Aooda Incident Runbook

> Founder + on-call reference for production incidents. Single source of truth for
> severity, escalation, kill-switches, and customer communications.
> Aligned with PDPL (Jordan/Saudi) and GDPR 72-hour breach-notice clocks.

---

## 1. Severity ladder

| Severity | Trigger examples                                                                                                                                                 | First action                                                                                                            | SLA                                                             |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **P0**   | Cross-tenant data leak. Auth bypass to admin. Real PII visible in Sentry without redaction. Anthropic spend > 100% of monthly cap. Domain hijack / DNS takeover. | (1) flip `FEATURE_AI_GENERATION=false` if cost-related; (2) page founder + CISO; (3) freeze deploys; (4) start IR clock | hotfix < 24 h; status-page notice < 1 h; customer notice < 24 h |
| **P1**   | Stored XSS in dashboard. SQLi behind auth. Cross-tenant via app-layer bug. Service entirely down. Sentry burst >100 errors/min from one route.                   | Page founder; freeze deploys; status-page notice < 4 h                                                                  | fix < 7 d; customer notice if PII involved                      |
| **P2**   | Reflected XSS. Missing security header. Info disclosure (commit SHA, stack trace). Sentry burst <100/min. Anthropic spend > 80% cap.                             | Open issue; investigate during business hours                                                                           | fix < 30 d                                                      |
| **P3**   | Verbose errors. Defence-in-depth gap. UX bug not blocking flow.                                                                                                  | Backlog                                                                                                                 | backlog                                                         |

---

## 2. Kill-switches (operator-side, 1 minute each)

| Switch                     | Where                                                                | Effect                                                                     |
| -------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Disable AI generation      | Vercel → Env → `FEATURE_AI_GENERATION=false` → redeploy              | `/api/generate-message` + `/api/import` return 503                         |
| Disable demo cookie path   | Vercel → Env → unset `COOKIE_SIGNING_SECRET`                         | `/dashboard/demo` access via demo cookie blocked (production fails closed) |
| Disable preview deploys    | Vercel → Settings → Git → toggle off auto-deploy                     | Stops attacker-controlled fork PRs from spinning up live previews          |
| Maintenance mode (custom)  | Vercel → Env → `MAINTENANCE_MODE=true` (not yet wired — TODO)        | Returns 503 from middleware for all routes                                 |
| Take down DNS              | Cloudflare / GoDaddy → flip `aooda.sa` A records to maintenance page | Last-resort, costs minutes of downtime                                     |
| Rotate `CRON_SECRET`       | Vercel → Env → new value → redeploy                                  | Stops external `/api/cron/*` replay                                        |
| Rotate `ANTHROPIC_API_KEY` | Anthropic console → revoke → mint new → Vercel env update            | Stops leaked-key Anthropic spend                                           |
| Rotate Neon password       | Neon console → role → reset → Vercel env update                      | Stops leaked-DB-URL access                                                 |

**Document every switch flip in `docs/security/incidents/YYYY-MM-DD.md` with timestamp + reason.**

---

## 3. Decision tree (P0 customer report at 3 am)

```
1. Customer says "all my data is gone" / "I see another clinic's data" / "billing wrong"
   ↓
2. Verify scope: ask for screenshot + clinic ID + time window
   ↓
3. Open Sentry → filter by clinic_id → check tripwire events
   - rta-002-tripwire?               → cross-tenant attempt detected, audit log it
   - claude-budget-near-cap?         → cost-related, not data-loss
   - require-clinic 401/403 spike?   → mass-auth issue (likely middleware misconfig)
   ↓
4. Check audit_log for the affected clinic_id in the time window:
   SELECT * FROM audit_log
   WHERE clinic_id = '<id>'
   AND created_at > now() - interval '2 hours'
   ORDER BY created_at DESC;
   ↓
5. If cross-tenant write detected → P0
   - Freeze deploys: vercel-cli `vercel rollback`
   - Identify attacker user_id from audit row
   - Revoke their Supabase session: dashboard → Auth → Users → revoke
   - Hotfix path: revert latest merge to main, redeploy
   - Notify affected clinic owners within 24h (PDPL/GDPR 72h floor)
   ↓
6. If data-loss without cross-tenant signal → check Neon PITR
   - Neon console → Branches → restore Point In Time to 30 min before report
   - Apply on a new branch first → verify → swap connection string
   ↓
7. Post-mortem ≤ 7 d. Add regression test for the failure mode.
```

---

## 4. Customer-communication templates

### 4a. P0 breach notice (Arabic)

> **عاجل: حدث أمني يخص بياناتك في Aooda**
>
> اكتشفنا في {{TIME_DETECTED}} (بتوقيت عَمّان) حادثة أمنية أثّرت على بيانات
> عيادتك. ما حدث: {{ONE_LINE_DESCRIPTION}}.
>
> ما فعلناه: {{IMMEDIATE_ACTION}}. الخدمة {{STATUS}} الآن.
>
> ما نطلبه منك: {{ACTION_FOR_CUSTOMER — usually: changing the password and reviewing recent activity in the audit log}}.
>
> سنرسل تقريراً مفصّلاً خلال 7 أيام. للاستفسار العاجل: security@aooda.sa أو واتساب {{PHONE}}.
>
> فريق Aooda — تم الإرسال {{TIMESTAMP}}

### 4b. P0 breach notice (English)

> **Urgent: a security incident affected your Aooda data**
>
> At {{TIME_DETECTED}} (Amman time) we detected a security incident affecting
> your clinic's data. What happened: {{ONE_LINE_DESCRIPTION}}.
>
> What we did: {{IMMEDIATE_ACTION}}. The service is {{STATUS}} now.
>
> What we need from you: {{ACTION_FOR_CUSTOMER}}.
>
> A full report follows in ≤7 days. For urgent contact: security@aooda.sa or WhatsApp {{PHONE}}.
>
> Aooda team — sent {{TIMESTAMP}}

### 4c. Service-disruption notice (template)

> Aooda is experiencing partial degradation since {{START}}. Affected:
> {{FEATURE}}. Estimated restoration: {{ETA}}. Live status at {{STATUS_URL}}.
> No customer data is affected.

### 4d. Post-mortem template

Save to `docs/security/incidents/YYYY-MM-DD-{slug}.md`:

```markdown
# Incident YYYY-MM-DD: {one-line summary}

## Severity

P0 / P1 / P2

## Timeline (UTC)

- HH:MM — detected (signal source)
- HH:MM — paged / escalated
- HH:MM — containment action
- HH:MM — resolved
- HH:MM — customer notice sent

## What happened

Plain-language description.

## Root cause

Five-whys or fishbone. Code/config/process.

## Customer impact

Number of clinics, number of patient records, geographic distribution.

## What worked

Detection signals, automation, runbook.

## What didn't

Manual steps, missing alert, unclear severity.

## Action items (owner + due)

- [ ] Hotfix verified — @owner — YYYY-MM-DD
- [ ] Regression test — @owner — YYYY-MM-DD
- [ ] Runbook update — @owner — YYYY-MM-DD
- [ ] Detection improvement — @owner — YYYY-MM-DD
```

---

## 5. On-call rotation (pre-launch: founder only)

- **Primary:** founder, phone {{PHONE}}, WhatsApp {{WHATSAPP}}, email security@aooda.sa
- **Escalation backup (legal):** {{LAWYER_CONTACT}} — for regulatory notifications only
- **Cloud-platform-emergency contacts:**
  - Vercel: support@vercel.com (paid plan ticket)
  - Supabase: support@supabase.com
  - Neon: support@neon.tech
  - Anthropic: support@anthropic.com (billing emergencies)

---

## 6. Pre-launch go/no-go before lifting Deployment Protection

- [ ] All P0 fixes from latest pentest re-tested as not exploitable (see `RETEST-VERDICT.md`)
- [ ] BetterUptime monitor on `/api/health` live, SMS escalation tested
- [ ] `support@aooda.sa` inbox + auto-responder live
- [ ] PDPL export endpoint `/api/clinic/export` smoke-tested
- [ ] PDPL erase endpoint `/api/clinic/erase` smoke-tested
- [ ] Neon PITR restore drill performed and screenshotted
- [ ] `FEATURE_AI_GENERATION` env flag tested in production via Vercel env flip
- [ ] Anthropic daily spend alert wired (see `/api/cron/spend-check`)
- [ ] Status page live at `status.aooda.sa`
- [ ] Pilot agreement signed by clinic #1 with explicit RPO/RTO

---

**Last updated:** 2026-06-02 — autonomous session
**Owner:** founder
**Review cadence:** after every P0 + quarterly otherwise
