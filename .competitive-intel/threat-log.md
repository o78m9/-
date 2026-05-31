# Competitive Threat Log — Append Only

> Permanent record of competitor moves that materially affect Aooda's position. Append entries chronologically; never edit or delete historic entries (correct via new entries instead).

## Format

```
## YYYY-MM-DD — [Competitor name] — [severity: low/medium/high/critical]

**What changed**: [terse description]
**Source**: [URL + access date]
**Impact on Aooda**: [our actual exposure]
**Recommended response**: [terse]
**Owner**: [who acts]
```

---

## 2026-05-31 — BASELINE ESTABLISHED — informational

**What changed**: First competitive intel snapshot taken. Baseline locked at `.competitive-intel/snapshots/2026-05-31.md`.

**Source**: `market-researcher` agent report dated 2026-05-30 (see `[[project-aooda-competition]]` memory).

**Impact on Aooda**: No changes yet — this is the baseline against which diffs are measured.

**Recommended response**: Daily intel runs start tomorrow. Watch Dentle WhatsApp announcement closely.

**Owner**: `competitive-intel-monitor` agent

---

## 2026-Q3 PROJECTED — Dentle (Jordan) — high (currently announced, not shipped)

**What changed**: Dentle (dentle.app) announced WhatsApp integration shipping in Q3 2026. Specific date unknown.

**Source**: dentle.app/changelog or roadmap (verify via daily intel run).

**Impact on Aooda**: Dentle is currently a high-threat in Jordan because they are Arabic-native + JOD-priced. Adding WhatsApp closes the last functional gap. Their advantage: existing customer base + subscription billing already set up.

**Recommended response**: Ship Jordan pilot launch BEFORE Dentle's WhatsApp goes live. Race their launch — if we have 5 case studies in market before they ship, we win the position. See `docs/RECRUITMENT.md`.

**Owner**: founder

---

(Append future entries below as `competitive-intel-monitor` agent runs daily.)
