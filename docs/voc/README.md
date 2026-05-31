# Voice of Customer — Aooda

> Weekly synthesis of what customers + prospects are actually saying, across every channel (WhatsApp, sales calls, support tickets, NPS, audit_log behavior signals, public reviews).

## Run cadence

- Sunday mornings — produce the week-ending-Saturday report
- File output: `docs/voc/YYYY-WW.md`
- Agent: `voice-of-customer` (see `.claude/agents/voice-of-customer.md`)

## Quote bank

`docs/voc/quote-bank.md` — append-only collection of verbatim customer quotes. Used as raw material for landing copy, sales pitch, case studies. NEVER edit a quote — only add notes.

## Theme history

`docs/voc/theme-history.md` — 12-month rolling history of the dominant weekly themes. Used to detect trend shifts (e.g. pricing pain spiking, onboarding friction declining).

## Inputs the agent reads

1. WhatsApp Business export — clinic-side conversation history (Aooda's WA support number)
2. Support tickets — any structured ticketing system
3. Sales calls — `docs/sales-calls/` if maintained
4. NPS responses — verbatim comments
5. Audit log behavior signals — `audit_log` queried for usage patterns (via Bash: `node scripts/audit-summary.mjs --week`)
6. Public reviews — store, Trustpilot, G2 (Arabic + English)
7. Discovery interviews — `docs/discovery/interview-*.md` files

## Output structure

See agent definition. Per-week report includes:

- TL;DR (3 bullets)
- Top 5 dominant themes with verbatim quotes
- Churn-signal alerts
- Feature request list (raw)
- Praise (for marketing use, permission-checked)
- Sample size + confidence

## Privacy

- Strip patient names; aggregate clinic-side only
- PDPL-compliant — no raw patient PII in reports
- Quote bank entries with quotee permission flag (Y/N/ask)
