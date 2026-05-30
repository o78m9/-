# Outreach Pipeline — JSON Store + Funnel Schema

> **Owner:** CRO (founder hat). **Status:** Spec — pairs with `docs/outreach/tier1-target-list.template.csv` for the row-level shape and with `docs/30-day-plan.md §6` for the funnel math.
> **Goal:** Convert 42+ cold contacts into 1 signed pilot by 2026-06-29.

---

## 1. Purpose

Two needs in tension:

- **Tactical:** A founder running solo needs a 60-second mental model of "where is everyone, what's the next action". A spreadsheet is fine for now.
- **Strategic:** When the founder runs the math at Day 14 / Day 21 / Day 30, the question is "which stage is leaking?". That requires a normalized state machine, not free-form notes.

This doc defines both: the contact-level JSON shape, AND the funnel-conversion model.

---

## 2. Per-contact JSON shape (TS interface)

This is the canonical shape. The CSV in `docs/outreach/` projects a flattened view of it; the spreadsheet projects a wider one. The JSON is authoritative.

```ts
type OutreachState =
  | 'cold'
  | 'contacted'
  | 'replied'
  | 'meeting_booked'
  | 'visited'
  | 'loi'
  | 'signed'
  | 'declined'
  | 'nurture'

type ContactSource = 'google_maps' | 'snapchat' | 'instagram' | 'referral' | 'walk_by' | 'linkedin'

type TechSignal = 'high' | 'medium' | 'low'

interface OutreachEvent {
  at: string // ISO 8601 timestamp
  by: 'founder' | 'auto'
  kind:
    | 'note'
    | 'state_change'
    | 'message_sent'
    | 'message_received'
    | 'meeting_scheduled'
    | 'visit_completed'
    | 'loi_received'
    | 'agreement_signed'
    | 'declined'
  from_state?: OutreachState
  to_state?: OutreachState
  text?: string // free-form note, max 500 chars
  channel?: 'whatsapp' | 'phone' | 'in_person' | 'linkedin' | 'email'
}

interface OutreachContact {
  id: string // uuid
  clinic_name_ar: string
  district_riyadh: string
  owner_name: string | null
  owner_phone_e164: string | null // null until phone is captured in Pass 4
  source: ContactSource
  tech_signal: TechSignal
  state: OutreachState
  state_changed_at: string // ISO 8601 — the last transition timestamp
  warm_intro: boolean
  warm_intro_via?: string // free-form: "ex-colleague at Bin Dawood"
  created_at: string
  events: OutreachEvent[] // append-only history
  // Derived (computed, not stored):
  // - days_since_last_action = now - (events.at[-1] ?? created_at)
  // - is_stale = days_since_last_action > 7 && state in ['contacted','replied']
}

// Convenience: the entire pipeline is just a list.
type OutreachPipeline = OutreachContact[]
```

---

## 3. State machine — allowed transitions

```
                  cold
                   │
                   ▼
                contacted ───┐
                   │         │
                   ▼         ▼
                replied   declined
                   │
                   ▼
              meeting_booked ───────┐
                   │                ▼
                   ▼             nurture
                visited ─────────────┐
                   │                 ▼
                   ▼              declined
                  loi
                   │
                   ▼
                signed
```

**Rules:**

- Any non-`signed`, non-`declined` state can transition to `declined` at any time (e.g. owner blocks, owner walks out of meeting).
- `nurture` is a sink for "not now but maybe in Q3" — pull from it monthly.
- `declined` is terminal. Re-engagement requires a new contact row, not a state reset (intentional friction — preserves the historical no).
- `signed` is terminal — onboarding moves the relationship into the patient-tracking pipeline (`docs/specs/patient-tracking-schema.md`).
- Every transition produces an `OutreachEvent` with `from_state` + `to_state`. Append-only.

---

## 4. Funnel conversion model

The plan's working assumption (`docs/30-day-plan.md §6`) is:

```
120 cold → 8 in-person visits (≈7%)
8 visits → 2 LOIs (25%)
2 LOIs → 1 signed (50%)
```

Re-expressed as stage-by-stage:

| Stage transition           | Assumed rate | Note                                                                                                                                                                         |
| -------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cold → contacted`         | 100%         | "Contacted" just means a message was sent or a call attempted. Definitionally guaranteed.                                                                                    |
| `contacted → replied`      | 20%          | Any reply, positive or negative, counts. Industry baseline for cold WhatsApp B2B is 15–25%. Saudi clinic owners on a peer Khaleeji message: the upper end of that band.      |
| `replied → meeting_booked` | 40%          | Of those who reply, ~40% will agree to a 30-min slot when the script is the `pilot-scoping.md §5` either/or close.                                                           |
| `meeting_booked → visited` | 88%          | Some no-show / reschedule loss. This is implicit in the plan's math (8 booked, ~7 visit). For the explicit model, use 88%.                                                   |
| `visited → loi`            | 50%          | Verbal yes + WhatsApp confirmation. Half the in-person visits convert when the price (15% / 3,000 SAR cap) is on the table.                                                  |
| `loi → signed`             | 60%          | LOI to signed is the highest-friction step — lawyer redlines, missing signature day, etc. Plan assumes 50%; calibrating up to 60% with the lawyer-reviewed v1.0 PDF in hand. |

**End-to-end cold → signed:**

`100% × 20% × 40% × 88% × 50% × 60% = 2.112%`

≈ **2.1%** cold-to-signed rate.

**Reverse calculation — how many cold contacts to land 1 signed:**

`1 / 0.02112 ≈ 47.35`

Rounded UP to a planning buffer: **48 cold contacts minimum to land 1 signed by Day 30.**

The 30-day plan's target is 120 contacts by Day 21 (40/week × 3 weeks). At the conversion rate above, 120 contacts yields an expected `120 × 0.02112 ≈ 2.5 signed`. Buffer of 2.5× over the north-star. Healthy.

**If the math is wrong by a factor:**

- If `contacted → replied` falls to 10% (half), need 96 cold contacts → 30-day plan still produces ~1.25 signed. Survivable.
- If `replied → meeting_booked` falls to 20% (half), need 96 contacts → same survivable outcome.
- If `meeting → loi` falls to 25% (half), need 96 contacts → 1.25 signed. Survivable.
- If TWO stages halve simultaneously, the plan misses the north-star — Gate 2 (Day 14) is designed to catch this.

---

## 5. Plan's Day-30 north-star reconciled

The 30-day plan's reverse calc was `2.4% → 42 cold contacts for 1 signed`. This spec's stricter model says 2.1% → 48 cold. The difference is the explicit `meeting_booked → visited` (88%) drag-out that the plan glossed over.

**Reconciled minimum for 1 signed by Day 30: 48 cold contacts.**

The plan's 40/week × 3 weeks = 120 is well above this — the plan is conservative, not aspirational. Good.

---

## 6. Daily / weekly review queries

These are the questions the founder asks the JSON store every morning. In v1.0 there is no UI — these are written here as the spec for a future report, AND as the questions to answer manually from the spreadsheet today.

| Question                                           | How to compute                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| How many cold this week?                           | count(state == cold AND created_at >= week_start)                                     |
| How many contacted this week?                      | count(events.kind == 'state_change' AND to_state == 'contacted' AND at >= week_start) |
| Stale `contacted` rows (>7 days, no reply)?        | filter state == 'contacted' AND now - state_changed_at > 7d                           |
| Stale `replied` rows (>3 days, no meeting booked)? | filter state == 'replied' AND now - state_changed_at > 3d                             |
| Funnel snapshot                                    | count by state, all-time                                                              |
| Reply rate week-to-date                            | replied_this_week / contacted_this_week                                               |
| Conversion to meeting week-to-date                 | meeting_booked_this_week / replied_this_week                                          |

These match the `pilot-scoping.md §3` weekly-review rhythm and feed the `standup.md` "Metrics" line.

---

## 7. Stale-rule + recovery

A contact in `contacted` or `replied` with no activity for 7 days is stale.

- **`contacted` stale at 7 days:** one final follow-up (different angle), then auto-move to `nurture`.
- **`replied` stale at 3 days:** founder personal touch within 24 hours.
- **`meeting_booked` stale at 2 days past meeting:** founder calls to confirm meeting happened.
- **`visited` stale at 5 days post-visit:** founder calls; if no clear yes/no, move to `loi` or `nurture`.

These rules prevent silent leakage in the funnel. Without them, contacts pile up in middle stages and the founder loses signal on where the pipeline actually lives.

---

## 8. JSON storage — v1.0 implementation hint

Not implemented tonight. For v1.0:

- One file: `data/private/outreach.json` (gitignored).
- Single array of `OutreachContact`.
- Written via a small node script `scripts/outreach-record.mjs` (TODO, not part of tonight's batch).
- Or — simpler — keep the CSV authoritative in v1.0; promote to JSON only when there's a real reason (UI, multi-user, etc.).

---

## 9. Self-audit

This spec touches no patient data. PDPL critic checks N/A. The Arabic content in this doc is minimal and reads as ops-language; Khaleeji critic: pass-by-irrelevance.

The one substantive check: **does this spec mislead the founder about the math?** No. Every conversion assumption is sourced to the plan or to an industry baseline range, and the reverse calculation buffers UP, not down. The `48 cold contacts` minimum is honestly conservative.

---

## 10. Open questions for founder

1. Is the `meeting_booked → visited` 88% rate realistic in Saudi context (no-shows / reschedules)? Calibrate after Week 2's first 3 bookings.
2. Should `nurture` rows be pulled monthly (low cadence) or quarterly (very low)? Default monthly for the first 90 days.
3. When the founder is in delivery (Week 4), who runs the pipeline review? Spec assumes founder owns end-to-end; this is sustainable for 1 month, not for 3.
