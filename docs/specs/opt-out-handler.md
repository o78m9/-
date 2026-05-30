# Opt-Out Auto-Handler — Spec

> **Owner:** CTO (eng) — implements; GC — signs off on legal basis copy.
> **Status:** Draft for founder review. NOT YET shipped to `src/`.
> **PDPL anchors:** Art. 6 (consent), Art. 9 (withdrawal of consent), Art. 19 (breach notification cross-ref), Art. 30 (sub-processors).
> **Linked artifacts:** `docs/pilot-scoping.md §1` (opt-out flow), `docs/pilot-agreement.md §5`, `docs/specs/message-templates.md` (every template ends with the opt-out string), `docs/copy/privacy-pdpl-rewrite.md` (public-facing patient-rights section).

---

## 1. Purpose

When any patient replies with an opt-out word on the clinic's WhatsApp Business number that Aooda is co-sending from, the system MUST:

1. Recognize the opt-out intent within seconds.
2. Permanently suppress that phone from all future Aooda-initiated outbound on that clinic, forever.
3. Send a single confirmation reply within 60 minutes.
4. Log the event to an immutable audit trail.
5. Surface it on the clinic owner's weekly 1-page PDF so the owner sees the opt-out rate publicly (per `pilot-scoping.md §3` — opt-out rate is the published anti-vanity metric).

The opt-out handler is the **single most-important compliance surface** Aooda owns. If it fails silently once, the entire pilot's trust posture collapses, and a SDAIA/CITC complaint is one screenshot away.

---

## 2. Legal basis

- **PDPL Art. 6** — Processing requires a lawful basis. For outbound marketing/reactivation, the basis is **explicit consent**, given by the patient at clinic registration AND renewed by the patient's continued non-objection at first contact.
- **PDPL Art. 9** — The data subject has the right to **withdraw consent at any time**. Withdrawal must be as easy as granting it. A single Arabic word ("اوقف") satisfies the "as easy as granting" test.
- **Suppression must be permanent** for that phone × clinic pair. A subsequent re-opt-in requires a fresh, documented affirmative consent step (which the pilot does NOT support — only the clinic itself can re-onboard the patient via in-clinic interaction). Aooda will NEVER auto-re-add a number that has ever opted out.

---

## 3. Regex pattern (the trigger)

```ts
;/اوقف|إيقاف|STOP|stop|Stop/
```

**Why this exact pattern:**

| Token   | Why included                                                                                                                                 |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `اوقف`  | Common Khaleeji imperative without hamza — the most natural way Abu-Khalid's patient would write it.                                         |
| `إيقاف` | MSA noun form — what literate older patients use; also matches the docs/pilot-agreement §5 wording.                                          |
| `STOP`  | All-caps English — Meta's WhatsApp Business Solution guidelines recommend STOP as a universal stop keyword; bilingual patients reach for it. |
| `stop`  | Lowercase — autocorrect-aware.                                                                                                               |
| `Stop`  | Title-case — autocorrect-aware.                                                                                                              |

**What this pattern intentionally does NOT cover (deferred to v2 with the same effect, just a longer regex):**

- `أوقف` (with hamza on the alif) — added as v1.1 same-day extension. See "TODO" §10.
- `وقّف` / `وقف` — common but ambiguous (could mean "stop the dental treatment"). Flag for human review instead of auto-suppress.
- Punctuation variants — handled in the matcher wrapping (`§5 below`), not in the regex itself.

**Matching MUST be applied:**

- Case-insensitive on Latin characters (the `i` flag is implicit in the alternation since `STOP|stop|Stop` covers the three common cases — but the implementation MUST also lowercase incoming text before testing the Latin part).
- After Arabic normalization (NFKC) — to collapse compatibility characters before matching.
- Against the **trimmed message body** — strip leading/trailing whitespace.
- Against the **first 40 characters** of the inbound message body, NOT a substring scan of the full text — this avoids false positives where "STOP" appears inside an unrelated sentence ("don't stopwatch me" / "the stop sign"). See §8 test case 6.

---

## 4. State machine

```
   ┌───────────────────────────────┐
   │ inbound_message received      │
   │ (Meta webhook → /api/wa-inbound)│
   └───────────────────────────────┘
                  │
                  ▼
   ┌───────────────────────────────┐
   │ normalize(body):              │
   │  - trim                       │
   │  - NFKC                       │
   │  - take first 40 chars        │
   │  - lowercase Latin chars      │
   └───────────────────────────────┘
                  │
                  ▼
   ┌───────────────────────────────┐
   │ regex test                    │
   └───────────────────────────────┘
            │              │
        match            no-match
            │              │
            ▼              ▼
   ┌─────────────────┐  ┌──────────────────┐
   │ OPT_OUT branch  │  │ standard branch  │
   └─────────────────┘  │ (reply triage,   │
            │           │  booking, etc.)  │
            ▼           └──────────────────┘
   ┌─────────────────────────────────────────┐
   │ 1. write SUPPRESSION row                │
   │    (phone, clinic_id, ts, source_msg_id)│
   │ 2. set patient.opt_out_at = now()       │
   │ 3. cancel any scheduled future sends    │
   │    for (phone, clinic_id)               │
   │ 4. enqueue CONFIRMATION_REPLY job       │
   │    with SLA = 60 min                    │
   │ 5. append AUDIT_LOG entry               │
   │ 6. notify clinic-owner channel          │
   │    (NOT real-time; rolls into weekly    │
   │     PDF + dashboard counter)            │
   └─────────────────────────────────────────┘
                  │
                  ▼
   ┌─────────────────────────────────────────┐
   │ CONFIRMATION_REPLY worker fires         │
   │ within 60 min:                          │
   │   send WhatsApp message =               │
   │   "تم إيقاف الرسائل. شكراً لك."        │
   │ on success: mark suppression.confirmed  │
   │ on failure: retry 3× exp backoff;       │
   │   then log to dead-letter + alert       │
   └─────────────────────────────────────────┘
```

**Why a 60-minute SLA (not instant):**

- WhatsApp Business API rate limits + nightly send-window restrictions make "instant" brittle.
- 60 min is the cap published in `pilot-scoping.md §1` and `pilot-agreement.md §5` — public-facing commitment.
- 60 min comfortably allows a worker on a 5-min cadence to clear even a worst-case backlog.

---

## 5. Confirmation reply — exact text

```
تم إيقاف الرسائل. شكراً لك.
```

**Why this exact wording:**

- Khaleeji-neutral (does not sound like an automated MSA bot, does not sound overly familiar either).
- 7 words — does not look like a marketing message, so the patient does not feel "spammed by the unsubscribe."
- "شكراً لك" closes the relationship gracefully — important culturally; sudden silence after an opt-out feels rude.
- **No emojis, no clinic-branding, no further explanation.** Adding anything else is a soft-CTA and re-opens the consent question.
- **No "if this was a mistake, reply YES to resume"** anywhere — re-onboarding is in-clinic only, see §2.

The confirmation reply IS itself an outbound message, so it counts as a sent event in the audit log. It does NOT carry the standard opt-out footer (`للإيقاف: اكتب "اوقف" أو STOP`) — that would be tautological and would confuse the patient.

---

## 6. Permanent suppression — data model touch points

When the OPT_OUT branch fires:

- `patient.opt_out_at` ← `now()` (per `docs/specs/patient-tracking-schema.md`)
- `suppression` row inserted: `{ phone_e164, clinic_id, suppressed_at, source_message_id, source_text_first_40 }`
- A UNIQUE constraint on `(phone_e164, clinic_id)` in the `suppression` table prevents accidental reactivation.
- Outbound queue worker MUST check `suppression` table on EVERY send, not just on enqueue — defends against race where send was enqueued before opt-out arrived.

**Hard delete vs. suppression marker:**

- The patient row is NOT hard-deleted on opt-out. It is **flagged**. Hard delete happens at the pilot-end retention boundary (30 days post-pilot, per `pilot-scoping.md` + `pilot-agreement.md §4`).
- The reason: the clinic still owns the underlying patient record; Aooda flags only the "do not contact via Aooda" status. Hard-deleting the patient row would also hide booking outcomes that already happened — which is required for the final case-study reconciliation.
- A patient who exercises the **PDPL Art. 9 right to deletion** (not just opt-out) triggers a SEPARATE flow that DOES hard-delete the row within 7 days. That flow is documented in `docs/copy/privacy-pdpl-rewrite.md §rights`.

---

## 7. Audit log entry shape

Every opt-out produces one immutable row:

```json
{
  "audit_id": "uuid",
  "event": "opt_out",
  "phone_e164": "+9665XXXXXXXX",
  "clinic_id": "uuid",
  "received_at": "2026-06-15T08:23:11Z",
  "confirmed_at": "2026-06-15T08:24:05Z",
  "source_message_id": "wamid.HBg...",
  "source_text_first_40": "اوقف",
  "matched_pattern": "اوقف",
  "confirmation_text": "تم إيقاف الرسائل. شكراً لك.",
  "confirmation_status": "delivered"
}
```

**Audit log retention: 2 years** from the date of write. Rationale: legal record-keeping (per Saudi commercial code default minimum), defensible against a SDAIA / CITC inquiry, but bounded so we do not become a long-tail data hoarder. State this retention explicitly in `docs/copy/privacy-pdpl-rewrite.md` AND in `pilot-agreement.md §4` (currently inconsistent — see `pilot-agreement-lawyer-brief.md` Q4).

---

## 8. Test cases (≥6 required — providing 9)

| #   | Inbound text                | Expected match?              | Why                                                                                                                                                                                                                                                        |
| --- | --------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 1   | `اوقف`                      | YES                          | Exact match — primary Khaleeji token.                                                                                                                                                                                                                      |
| 2   | `STOP`                      | YES                          | Exact match — Latin caps.                                                                                                                                                                                                                                  |
| 3   | `stop`                      | YES                          | Lowercase variant.                                                                                                                                                                                                                                         |
| 4   | `إيقاف`                     | YES                          | MSA noun form.                                                                                                                                                                                                                                             |
| 5   | `اوقف الرسائل من فضلك`      | YES                          | Embedded in a sentence — but `اوقف` falls within first 40 chars, regex matches.                                                                                                                                                                            |
| 6   | `don't stopwatch me thanks` | NO                           | "stopwatch" contains "stop" but the matcher MUST be word-boundary aware on the Latin side. **Implementation note:** wrap the Latin tokens with `\b` boundary OR scan the lowercased first-40-chars for exact `stop` as a standalone word, not a substring. |
| 7   | `STOP.`                     | YES                          | Trailing punctuation — punctuation is stripped before regex test (see §3).                                                                                                                                                                                 |
| 8   | `أوقف`                      | NO in v1.0 — **YES in v1.1** | `أوقف` with hamza is a known common typo. v1.0 misses it; v1.1 same-day patch adds `                                                                                                                                                                       | أوقف` to the regex. See §10. |
| 9   | `Stop sending`              | YES                          | Title-case match + the regex hits `Stop` as a word.                                                                                                                                                                                                        |

**False-positive defense (the "stopwatch" defense):**

```ts
// Implementation outline — NOT the production code
function isOptOut(rawBody: string): boolean {
  const normalized = rawBody.trim().normalize('NFKC').slice(0, 40)
  // Arabic tokens — direct substring check is safe (no Arabic words contain "اوقف" as a non-word substring in this domain)
  if (/اوقف|إيقاف|أوقف/.test(normalized)) return true
  // Latin tokens — word-boundary required
  if (/\bSTOP\b/i.test(normalized)) return true
  return false
}
```

The `\b` boundary on the Latin side prevents `stopwatch` / `stopover` / `stopgap` from triggering.

---

## 9. Cross-process guardrails

- **Race against in-flight send:** Outbound queue worker MUST re-check `suppression` table within 5 seconds of `send()` call. If the row appeared between enqueue and send, the send is dropped silently AND a `near_miss_opt_out` audit row is written. Founder reviews this counter weekly — if non-zero, the worker poll interval needs tightening.
- **Clinic-side broadcasts:** Aooda's opt-out suppression applies ONLY to Aooda-initiated outbound. A clinic owner sending a manual WhatsApp message to a patient from the same number is OUTSIDE Aooda's control surface — the clinic owner is the data Controller for those, and the pilot-agreement §6 puts the responsibility on them. This boundary MUST be in the privacy page (`docs/copy/privacy-pdpl-rewrite.md`).
- **Re-pilot scenario:** If a clinic re-engages Aooda after a gap, the suppression table is preserved — opt-outs from the prior engagement remain in effect. No expiry.
- **Multi-clinic scenario (future):** Suppression is keyed by `(phone, clinic_id)`. A patient can be opted out from Clinic A and remain reachable via Clinic B — patients have separate consent relationships per clinic. The schema is multi-clinic-safe from day one.

---

## 10. Implementation TODO checklist (engineering — DO NOT WRITE TONIGHT)

This is the work order for when the founder reviews and approves. Estimated total effort: 4–6 hours of focused engineering for v1.0, +1 hour for v1.1.

- [ ] **TODO(eng):** Create `src/lib/whatsapp/opt-out-handler.ts` exposing `isOptOut(body: string): boolean` per §8 outline. Pure function, fully unit-testable.
- [ ] **TODO(eng):** Create `src/lib/whatsapp/suppression-store.ts` exposing `suppress({phone, clinicId, sourceMessageId, sourceText}): Promise<void>` and `isSuppressed({phone, clinicId}): Promise<boolean>`.
- [ ] **TODO(db):** Add `suppression` table migration — fields per §6, UNIQUE constraint `(phone_e164, clinic_id)`. Coordinate with `docs/specs/patient-tracking-schema.md`.
- [ ] **TODO(db):** Add `audit_log` table migration — fields per §7. INSERT-only — no UPDATE / DELETE grants on the role that runs the app.
- [ ] **TODO(eng):** Wire `isOptOut()` into the existing `/api/whatsapp/inbound` webhook handler (or create one if not present yet). On match → call `suppress()`, enqueue confirmation reply, write audit row.
- [ ] **TODO(eng):** Confirmation reply worker — pulls from queue, calls Meta API, retries 3× with exponential backoff (1m / 5m / 25m), then dead-letters + alerts founder via WhatsApp.
- [ ] **TODO(eng):** Outbound send worker — re-checks `suppression` table within 5s of send call; logs `near_miss_opt_out` audit row on any race-hit.
- [ ] **TODO(test):** 9 unit tests matching §8 exactly. Include `أوقف` as a failing-then-passing test pair across v1.0 → v1.1.
- [ ] **TODO(test):** One end-to-end test that simulates an inbound webhook with `اوقف`, verifies the suppression row appears, verifies the confirmation reply is queued, verifies a subsequent enqueue is blocked.
- [ ] **TODO(eng v1.1, same day):** Extend regex to include `أوقف`. Add to test #8. No other behavior change.
- [ ] **TODO(ops):** Weekly review checklist item — count `opt_out` events / count `near_miss_opt_out` events / confirm the 60-min SLA was met on 100% of confirmations.

---

## 11. What this spec does NOT cover (out-of-scope, see other docs)

- The opt-out footer text on outbound messages — see `docs/specs/message-templates.md`.
- The patient-rights flow for full PDPL Art. 9 deletion (not opt-out, but data erasure) — see `docs/copy/privacy-pdpl-rewrite.md §rights`.
- The complaint-escalation path for non-opt-out angry replies — see `docs/pilot-scoping.md §6`.
- The breach-notification SDAIA 72h path — see `docs/copy/privacy-pdpl-rewrite.md §breach`.

---

## 12. Self-audit vs. pdpl-compliance-critic 8-check rubric

| Check                               | Result           | Evidence in this doc                                                              |
| ----------------------------------- | ---------------- | --------------------------------------------------------------------------------- |
| 1. Legal basis explicit             | PASS             | §2 — Art. 6 + Art. 9 cited.                                                       |
| 2. Opt-out language + handler + SLA | PASS             | §3 (regex), §4 (state machine), §5 (confirmation text), 60-min SLA in §4 and §10. |
| 3. Sub-processors named publicly    | N/A here         | Covered in `docs/copy/privacy-pdpl-rewrite.md`.                                   |
| 4. Retention in days                | PASS             | §6 (patient row 30d), §7 (audit log 2y).                                          |
| 5. Patient rights flow + 7-day SLA  | PASS (cross-ref) | §6 cross-refs the full Art. 9 deletion flow to the privacy page.                  |
| 6. Breach notification path         | N/A here         | Cross-refed in §11.                                                               |
| 7. No health-data drift             | PASS             | No diagnosis / treatment / lab / billing field touched anywhere in this spec.     |
| 8. SDAIA registration honesty       | N/A here         | Covered in privacy page.                                                          |

**Self-verdict: PASS for in-scope checks. Ready for engineering build after founder review.**
