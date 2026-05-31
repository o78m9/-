# Aooda Attribution Model v1 (2026-05-31)

> Spec for: how Aooda decides which returning-patient visits to claim credit for, and how that credit converts to revenue under the optional pay-for-results pricing tier.
>
> Driver: founder-concern C2 (pay-for-results is a billing-dispute trap if attribution is fuzzy). This doc removes the fuzziness by defining the rules in advance.

## Pricing tiers (recap from POSITIONING.md)

| Tier   | What                                                                 | Who picks it                                  |
| ------ | -------------------------------------------------------------------- | --------------------------------------------- |
| Pilot  | Free 60 days, all features, no pricing                               | Every new clinic                              |
| Flat   | 50 JOD/mo after pilot, predictable, no attribution disputes possible | Default after pilot                           |
| Hybrid | 25 JOD/mo + 15% of attributed recovered revenue                      | Clinics that want lower fixed + upside-shared |

Attribution math below applies ONLY to the Hybrid tier. Flat tier customers never see an attribution dispute because there's nothing to attribute.

## Definitions (frozen — disputes resolve to these literal terms)

| Term                       | Definition                                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Attributable patient**   | Patient flagged `dormant` (no visit ≥90 days) on the date Aooda first sends them a message for the current clinic                                                                          |
| **Attribution window**     | 14 calendar days starting at message send timestamp, ending at message send timestamp + 14 days (clinic timezone)                                                                          |
| **Attributable visit**     | A `visits` row whose `customer_id` was an attributable patient AND `visits.date >= message.sent_at` AND `visits.date <= message.sent_at + 14 days`                                         |
| **First-attribution rule** | Each attributable visit is credited to **only one** Aooda message — the most recent message sent to that patient before the visit, within the window. No double-counting across templates. |
| **Recovered revenue**      | Sum of `visits.amount` for attributable visits during the billing month                                                                                                                    |
| **Aooda revenue (Hybrid)** | 15% × recovered revenue, billed monthly in arrears                                                                                                                                         |
| **Disputed visit**         | Clinic-flagged visit they assert was not driven by Aooda — see Dispute Process below                                                                                                       |

## The window

14 days. Not 30, not 60. Rationale:

- Shorter window = fewer ambiguous claims (patient who would have come back anyway gets less mistakenly attributed).
- Long enough to cover the typical "I'll book next week" delay in healthcare.
- Easy to explain: "If the patient visits in two weeks of our message, we get credit. Otherwise no."

Visits outside the window are NEVER attributed, even if the patient is the same.

## The one-message rule (anti-double-attribution)

If we send 3 messages to the same patient (e.g. recall → offer → birthday) within 14 days and they visit, only the MOST RECENT message before the visit gets credit. Not all three. The Message table includes a `superseded_by` field so we can audit chain decisions.

## What Aooda will NEVER claim

- Visits booked through Aooda's own quick-reply button BUT scheduled before the message was sent (race condition / clock skew)
- Visits to a different clinic in the same chain (clinic_id scoping is strict)
- Walk-in visits with no appointment record (clinic must explicitly tag walk-ins as `walk_in = true` in their visits log; default false)
- Visits where the patient was NOT dormant at message send time
- Visits where the message status is not `delivered` per BSP webhook (message never reached the phone = no credit)

## Dispute process (asymmetric — clinic-friendly)

Clinic can dispute any attributed visit during the same billing month. Process:

1. Clinic opens dispute via dashboard, selects visit, picks reason from fixed list (see below). Free-text optional.
2. Aooda automatically removes the visit from the recovered-revenue total for that month.
3. Aooda logs the dispute in `attribution_disputes` table with clinic_id, visit_id, reason, decided_at.
4. No back-and-forth, no negotiation, no email chain. Clinic says no, it's no.
5. We use disputes as a learning signal — if a clinic disputes >40% of attributions, the model is broken FOR THEM and we should switch them to Flat tier proactively.

Reasons (frozen list):

- "patient called us directly — not because of message"
- "patient came in for emergency — already planned"
- "this is a duplicate visit entry"
- "wrong patient matched"
- "other (see notes)"

Why asymmetric: chasing 5 JOD per visit destroys the relationship. Better to lose a few visits and keep the clinic happy. 15% take rate already prices in a ~30% dispute buffer.

## Edge cases

| Case                                                                                | Handling                                                                      |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Patient visits 2 different clinics in the chain within window                       | Each visit attributed independently per clinic — clinics are siloed           |
| Message delivery fails (BSP error)                                                  | NOT attributable — must be `delivered`                                        |
| Patient replies "إيقاف" mid-window then visits                                      | NOT attributable — opt-out cancels future credit, prior credit stands         |
| Clinic deletes the message from BSP console                                         | Aooda's `messages` log is source of truth, NOT the BSP console                |
| Visit recorded retroactively (entered 5 days after it happened)                     | OK if entry date ≤ window end. Otherwise rejected.                            |
| Patient was dormant at send-time but had a visit between send and dashboard refresh | Source of truth = message.sent_at timestamp, NOT what the dashboard shows now |
| Daylight savings / clock skew                                                       | All timestamps stored UTC; window is exactly 14 × 24h = 336 hours             |
| Two messages to same patient on same day                                            | Treated as one logical send (deduplicate by patient_id + clinic_id + date)    |

## Billing cycle

- Calendar month, clinic local timezone, billed on day 5 of the next month
- Statement shows: total messages sent, total attributable patients, total visits within window, list of disputed visits, recovered revenue, Aooda revenue (15%)
- Clinic has 7 days to dispute additional visits after statement issued
- After day 12, statement is final, Stripe invoice issued for day 15
- Late payment: 7-day grace, then automatic switch to Flat tier (no service interruption — we keep sending, we just bill differently)

## Code paths required

| Path                                      | Purpose                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| `src/lib/message-log.ts`                  | logMessage(), markDelivered(), markOptOut()                                   |
| `src/lib/attribution.ts`                  | recordVisitForAttribution(), computeMonthlyAttribution(), generateStatement() |
| `prisma/schema.prisma`                    | Message, AttributionDispute models                                            |
| `supabase/migrations/003_message_log.sql` | DDL                                                                           |
| `/api/cron/monthly-attribution`           | runs day 5 of each month, computes prior-month statements                     |
| `/api/disputes`                           | POST endpoint for clinic to file a dispute                                    |
| Dashboard "Statement" page                | clinic-facing view of attributable visits + dispute UI                        |

## Test cases (mandatory before launch)

1. Patient dormant 100 days → message sent → patient visits day 5 → attributable ✓
2. Patient dormant 100 days → message sent → patient visits day 15 → NOT attributable ✓
3. Patient dormant 100 days → message sent → patient visits day -2 (already scheduled) → NOT attributable ✓
4. Patient dormant 100 days → message #1 day 0 → message #2 day 7 → visit day 10 → credited to message #2 only ✓
5. Patient dormant 50 days → message sent (should not have been sent; was not dormant by spec) → visit → NOT attributable (was not attributable at send time) ✓
6. Message delivery failed → patient happens to visit → NOT attributable ✓
7. Patient at clinic A and clinic B both sent messages → visits clinic A → only clinic A credited ✓
8. Clinic disputes 5 of 20 attributions → recovered revenue calculated on 15, statement reissued ✓

## Communication to clinics

Pitch this clearly in onboarding:

> "نحتسب لك زيارات المرضى النائمين خلال 14 يوم بعد إرسال رسالتنا. لو تشك إن أي زيارة ما كانت بسبب الرسالة، تضغط زر 'استبعاد' وتنشال على طول من الفاتورة. بدون نقاش، بدون إثبات."

That single sentence kills 90% of future disputes — clinic knows the rules in advance + knows the remedy is one click + knows we won't argue.

## What stops a 'dispute war'

- Asymmetric dispute UI (clinic always wins disputes, no escalation path)
- 15% take rate prices in expected dispute volume
- Auto-switch to Flat tier above 40% dispute rate (the Hybrid model is broken for that clinic; force them to a model that works)
- Statement transparency — clinic sees the visits and reasons before being charged
- Cooling-off: nothing is billed for 60 days

## Open questions for founder (decide before launch)

- Day 5 billing too aggressive for Jordan's payroll-cycle clinics? Consider day 10.
- Stripe MENA isn't fully launched — use HyperPay (KSA-based, supports JOD) or manual bank transfer for first 10 clinics?
- Should `walk_in = true` be the default? Some clinics don't tag walk-ins. If we default to false, we over-attribute. If we default to true, we under-attribute. Recommendation: start `false` (over-attribute slightly) since dispute UI is easy.
- Do we offer monthly statements via WhatsApp template (`statement_v1`) or only email? Recommendation: email primary, WA-link secondary.

## Related

- `docs/POSITIONING.md` — pricing tier definitions
- `docs/templates/meta-templates.md` — message delivery
- `[[project-aooda-build]]` — Phase 9 audit_log gives us the underlying event stream
- `pricing-optimizer` agent — for testing whether 15% is the right take rate
