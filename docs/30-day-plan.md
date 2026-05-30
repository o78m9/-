# Aooda — 30-Day Plan

**Period:** 2026-05-30 → 2026-06-29
**Founder:** Solo. **Stage:** Pre-revenue, pilot kit shipped.
**Single north-star:** **One Riyadh dental clinic signed on the pilot agreement AND at least one dormant patient walked back through the door, attributable to an Aooda WhatsApp message, by 2026-06-29.**

---

## 1. The bet

The pilot kit (`docs/pilot-scoping.md`, `docs/pilot-agreement.md`, `docs/landing-pilot-block.md`) is no longer the constraint — **distribution and regulatory trust are**. This month proves that a solo founder with a high-trust Arabic offer (15% cap / 3,000 SAR / 30 days) can convert one Abu-Khalid persona owner from a cold list into a signed pilot inside 30 days, while the WhatsApp Business API + SDAIA registration lines clear in parallel. If by Day 30 we have zero LOIs, zero signatures, and zero patient-returned evidence, the product is not the problem — the GTM motion needs a structural change (channel, ICP, or pricing), not another polish cycle.

## 2. North-star metric + 3 supporting KPIs

- **North-star:** 1 signed pilot agreement + ≥1 returned dormant patient verified by the clinic owner by 2026-06-29.
- **Supporting 1 (outbound activity — CRO):** ≥120 qualified ICP clinic owners contacted across all channels by Day 21 (≈40/week sustained).
- **Supporting 2 (legal/compliance — GC):** SDAIA registration **filed** (not approved — filed is the gate) AND PDPL data-flow disclosure published on `/privacy` by Day 14.
- **Supporting 3 (product readiness — CTO):** WhatsApp Business API integration in a **demonstrable** state (either Meta-approved on Aooda's own number OR a fully-rehearsed "use clinic's existing approved number" handoff playbook) by Day 21.

## 3. Weekly milestones (board-aligned)

### Week 1 (2026-05-30 → 2026-06-05) — "Set the table"

- **Theme:** Founder becomes credible. Paperwork enters every queue.
- **Founder MUST do (top 5):**
  1. Publish real founder name + headshot + LinkedIn URL on `/about` and update `<<FOUNDER_NAME>>` / `<<FOUNDER_DIRECT_CONTACT>>` everywhere in `landing-pilot-block.md`.
  2. File SDAIA registration application (online portal) — even if approval takes weeks, the **filing receipt** is the trust artifact.
  3. Submit WhatsApp Business API verification with Meta (Business Manager → BSP route via 360dialog or Twilio).
  4. Build the 60-clinic Tier-1 target list (Riyadh dental, 2–4 chairs, owner-operated) in a tracking sheet — name, owner name, phone, source, status.
  5. Run 10 cold outreach attempts (script from `docs/pilot-scoping.md §5`) by EOW to calibrate the script with real reactions.
- **Background unblocks (parallel):**
  - Lawyer engagement: brief a Saudi-licensed attorney to review `pilot-agreement.md` (1-2h paid consult, budget ≤1,500 SAR).
  - Privacy policy update on `aooda.com/privacy` — fill in storage region, sub-processors (Meta, Neon, Anthropic).
  - Tracking spreadsheet template (per-patient row schema, from `pilot-scoping.md §7`).
- **End-of-week gate:** SDAIA filing receipt in hand + Meta BAPI application submitted + founder photo live on `/about` + 10 cold contacts logged. **If 0 of these by Sun 2026-06-07 morning, Week 2 plan changes.**

### Week 2 (2026-06-06 → 2026-06-12) — "Sell + setup in parallel"

- **Theme:** Volume outreach. First meetings booked. Lawyer redlines back.
- **Founder MUST do (top 5):**
  1. 40 net-new clinic contacts (calls + WhatsApp DMs) across Sun–Thu. Use either/or close from `pilot-scoping.md §5`.
  2. Book ≥3 in-person clinic visits for Week 3 (Tue/Wed/Thu — never Fri).
  3. Incorporate lawyer redlines into `pilot-agreement.md` — produce v1.0 print-ready PDF (Arabic + English summary cover sheet).
  4. Draft 3 Arabic Khaleeji sample message templates (reactivation, follow-up, booking confirmation) and dry-run them on 5 friendly readers for tone check.
  5. Build opt-out auto-handler MVP (regex match `إيقاف` / `اوقف` / `STOP` → flag + confirm reply within 60 min).
- **Background unblocks (parallel):**
  - Meta BAPI verification — respond to any Meta document requests within 24h of receipt.
  - LinkedIn presence: founder posts 2 honest build-in-public updates (no buzzwords, Arabic preferred).
  - Identify 1-2 "warm intro" routes (former colleague, university classmate, family connection in healthcare) — these convert 4-6× cold.
- **End-of-week gate:** ≥40 contacts logged + ≥3 in-person clinic visits booked + signed lawyer-reviewed pilot agreement PDF ready to print. **If <2 visits booked, switch Week 3 outreach to warm-intro-only mode and consider price softening (drop cap to 2,000 SAR for the first signer).**

### Week 3 (2026-06-13 → 2026-06-19) — "Land the signature"

- **Theme:** Convert. Founder lives in clinics, not at the laptop.
- **Founder MUST do (top 5):**
  1. Run ≥3 in-person clinic kickoff visits with printed agreement + product walkthrough on receptionist's laptop (`pilot-scoping.md §4` Day-0 protocol).
  2. Close ≥1 signature OR ≥2 LOIs (verbal "yes" + WhatsApp confirmation message — enough to start data prep).
  3. For the signer: execute Day 0 protocol — CSV export with receptionist on-screen, 300-patient cohort identification, owner spot-checks 10 random names.
  4. Get owner-approved 3 message samples (no send until owner says "روح").
  5. Establish weekly check-in slot (Tue 10am WhatsApp voice call, per scoping doc).
- **Background unblocks (parallel):**
  - WhatsApp BAPI status check; if Aooda's own number not yet approved, finalize the "clinic's existing number via shared session" handoff playbook (the ICP filter already requires owner has a >6-month-old Business API number).
  - Continue 20 net-new contacts to keep the pipeline warm for Week 4 fallback.
- **End-of-week gate:** 1 signed agreement OR 2 documented LOIs. **If 0 of either by Thu 2026-06-18 EOD, escalate: founder takes Friday (off-day) to call every "maybe" from Weeks 1-2 personally — last chance window.**

### Week 4 (2026-06-20 → 2026-06-29, 10 days) — "Deliver + publish"

- **Theme:** Make a patient return. Capture the story. Publish.
- **Founder MUST do (top 5):**
  1. Send wave 1 (100 patients) on Day 22; monitor replies hourly Day 22–24.
  2. Hit 7-day TTV milestone: first patient walks into clinic by Day 27. If yes → screenshot to owner + LinkedIn post. If no → call owner same day, diagnose together.
  3. Send wave 2 (next 100) Day 25; wave 3 (final 100) Day 28.
  4. Lock metrics on Day 29; draft 1-page Arabic case study PDF.
  5. Owner sign-off on case study + Block 1-4 of `landing-pilot-block.md` → ship to production.
- **Background unblocks (parallel):**
  - Reply triage: respond to every `إيقاف` within 60 min; log opt-out rate live.
  - Case-study PDF design (sage/gold brand tokens, print-ready).
  - Founder LinkedIn + WhatsApp Status announcement drafts queued.
- **End-of-week gate (Day 30 = 2026-06-29):** ≥1 patient verified returned by owner + case-study PDF approved + at least Block 1 + Block 2 + Block 3 of `landing-pilot-block.md` live on production with real numbers, no placeholders. **If 0 returned patients, publish the honest "what we learned" memo internally and trigger a Day-30+1 strategic offsite (solo, 4 hours, written) before any next-month commit.**

## 4. Daily plan — Week 1 (high-resolution, KSA work-week Sun–Thu)

Note: KSA work-week is Sunday–Thursday. Friday is rest day (no customer calls, no scheduled work). Saturday = buffer / personal catch-up / one strategic session if needed. Plan starts mid-week intentionally to use the weekend for setup before outreach begins Sunday.

| Day | Date       | Founder primary action                                                                          | Founder secondary                                                                                           | Parallel/async                                                       |
| --- | ---------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Sat | 2026-05-30 | Update `/about` with real name + headshot + LinkedIn URL; deploy.                               | Fill `<<FOUNDER_NAME>>`/`<<FOUNDER_DIRECT_CONTACT>>` placeholders in `landing-pilot-block.md` source files. | Outreach script print-out from `pilot-scoping.md §5`.                |
| Sun | 2026-05-31 | Build Tier-1 target list: 60 Riyadh dental clinics (Google Maps + Snapchat + Instagram scrape). | Open SDAIA portal; gather docs (CR, founder ID, data-flow description).                                     | Email lawyer for redline consult — book 1h slot in Week 2.           |
| Mon | 2026-06-01 | File SDAIA application — submit, save receipt PDF.                                              | Submit Meta BAPI verification via BSP (360dialog or Twilio); upload business docs.                          | Draft privacy policy update copy for `/privacy`.                     |
| Tue | 2026-06-02 | First 10 cold outreach attempts (WhatsApp + call) on Tier-1 list, 9am–12pm window.              | Log every reaction verbatim in tracking sheet; refine script same day.                                      | Build tracking spreadsheet template (per-patient schema).            |
| Wed | 2026-06-03 | Next 10 outreach attempts, 9am–12pm. Aim for first "willing to meet" reply.                     | Update outreach script based on Tue+Wed reactions (which line lands, which dies).                           | Privacy policy update deployed to production.                        |
| Thu | 2026-06-04 | Last 10 outreach for the week (30 total); push 2 strongest leads toward a Week-3 visit booking. | Build opt-out handler regex spec; sketch in `src/` as TODO.                                                 | Weekly retro: 30-min written self-review (what worked, what to cut). |
| Fri | 2026-06-05 | **Rest day. No customer touchpoints.**                                                          | Optional: 30-min reading (Khaleeji copy, competitor PDPL pages).                                            | None scheduled.                                                      |

## 5. C-level standups — what each function owns this month

### CEO (founder hat)

- **Owns:** The one-sentence north-star + the boundary on what gets cut. Owns the "is the product the problem or the GTM" call.
- **KPIs:** 1 signed pilot. 1 returned patient. ≥3 in-person clinic visits.
- **Decisions to make this month (with deadlines):**
  - Day 7: Is the SDAIA-filed + Meta-submitted dual-track on time, or do we drop a deliverable?
  - Day 14: If <2 visits booked, do we drop the cap to 2,000 SAR for the first signer?
  - Day 18: If 0 LOIs, do we shift Week 4 from "sell + deliver" to "second-cycle outreach with warm intros only"?
  - Day 30: Is next month "sign 3 more pilots" or "deliver the first pilot to publishable case-study quality and pause acquisition"?

### CMO

- **Owns:** Founder-reveal copy, landing pilot-block staging, outbound messaging tone.
- **Deliverables this month:**
  - `/about` updated with real name + photo + LinkedIn (Day 1).
  - Privacy policy with PDPL disclosure + sub-processors named (Day 4).
  - All four landing-pilot blocks staged with placeholders, ready to flip to live values on signing day.
  - 2 founder LinkedIn build-in-public posts in Arabic (Days 7 and 21).
  - End-of-month case-study draft + WhatsApp Status announcement copy.
- **KPIs:** 0 forbidden buzzwords ("AI", "ذكاء اصطناعي") on landing pilot block; 100% Khaleeji on outbound; landing pilot block ships within 48h of signature.

### CRO (revenue / sales)

- **Owns:** Clinic outreach pipeline, LOI → contract conversion.
- **Targets:**
  - Outbound contacts: ≥120 by Day 21 (30 / 40 / 30 / 20 by week).
  - Meetings booked: ≥6 in-person clinic visits.
  - LOIs (verbal yes + WhatsApp confirmation): ≥2.
  - Signed pilots: 1.
- **Working assumption:** 120 contacts → 8 meetings → 2 LOIs → 1 signature. If conversion drops below this at any stage, the leakage is upstream of the stage that missed — diagnose the prior step first.

### CTO

- **Owns:** WhatsApp Business API connection state, production stability, opt-out handler.
- **Critical path:**
  - Day 1: Meta BAPI verification submitted (BSP route — 360dialog or Twilio).
  - Day 7: Opt-out handler regex MVP (`إيقاف` / `اوقف` / `STOP` → flag, confirm reply, 60-min SLA).
  - Day 14: Either Aooda BAPI approved OR documented fallback playbook for "use clinic's existing number via session handoff".
  - Day 21: Send-queue worker handles waves of 100, hourly reply polling, audit log of every send.
  - Day 30: Zero unhandled exceptions in production during pilot wave-1.
- **Constraint:** Meta BAPI is 5–15 business days; can extend to 4+ weeks if documents bounce. Plan must NOT depend on Aooda's own BAPI approval.

### General Counsel

- **Owns:** SDAIA filing, PDPL compliance posture, contract templates.
- **Critical path:**
  - Day 1: SDAIA portal submission, receipt saved.
  - Day 4: `/privacy` updated with PDPL data-flow disclosure, storage region, sub-processors.
  - Day 7: Saudi-licensed lawyer consult booked (≤1,500 SAR budget) — focus on `pilot-agreement.md` redlines, specifically §4 (PDPL), §6 (CITC complaints), §10 (jurisdiction).
  - Day 11: Lawyer redlines incorporated; agreement v1.0 PDF print-ready.
  - Day 30: SDAIA application either in "under review" or "approved" — not "not filed" under any circumstance.
- **Disclaimer:** This row is not legal advice; it sequences the founder's calls to qualified counsel.

### CFO

- **Owns:** Cash plan, burn, fundraising readiness call (this month = explicit "no raise").
- **Monthly burn estimate (SAR, bootstrapped):**
  - Domain + hosting (Vercel + Neon free tiers): ~150 SAR
  - Anthropic API: ~300 SAR
  - Lawyer consult: ~1,500 SAR (one-time)
  - SDAIA filing fee (if any): ~500 SAR (TBD on portal)
  - Meta BAPI / BSP messaging credits: ~600 SAR setup + ~0.20 SAR per session message
  - Founder transport (Riyadh clinic visits): ~800 SAR
  - Print + case-study handover materials: ~200 SAR
  - **Total expected burn: 3,500–4,500 SAR for the month.**
- **Revenue model:** Pilot = 0 SAR upfront + 15% capped at 3,000 SAR (per `pilot-scoping.md §1`). Expected month-end cash-in: 0–3,000 SAR (revenue is on the recovered visits, not month-end).
- **Cash trigger:** If founder personal runway < 6 months at month-end, freeze all non-pilot spend (no new tools, no design polish, no marketing experiments). If < 3 months, founder takes a part-time consulting gig to extend runway — this is a pre-decision, not a Day-30 panic call.
- **No fundraise this month.** Pre-revenue + 0 signed pilots = no story. Revisit after 1 signed + 1 returned patient.

### CCO (customer success — pilot delivery)

- **Owns:** Pilot onboarding flow, weekly check-ins, case-study capture.
- **Time-to-Value target:** First reactivated patient walks into the clinic within **7 days** of Day 0 send wave (per `pilot-scoping.md §3`).
- **Cadence:**
  - Day 0 kickoff (in-person, 60 min, exchange direct WhatsApp numbers).
  - Day 7 TTV checkpoint (founder personally watches replies hourly Day 4–6).
  - Day 15 mid-pilot review (numbers + "is anything broken in the clinic because of this?").
  - Day 28 metric lockdown.
  - Day 30 in-person case-study handover + invoice + handwritten thank-you.
- **Complaint escalation:** Any patient complaint → founder calls owner same hour. >3 complaints in 7-day window → pause all sending.

### CPO

- **Owns:** Product gaps that block pilot delivery. Roadmap cut authority.
- **Must-ship by Day 14:**
  - Opt-out auto-handler (`إيقاف` / `اوقف` / `STOP` → 60-min deletion + confirm reply).
  - Per-patient tracking sheet schema live in production (phone / last visit / sent date / reply / opt-out / booked / attended / paid).
  - Weekly 1-page PDF generator (Arabic, sage/gold tokens, owner-readable on phone).
- **Nice-to-have (explicit cut):**
  - Dashboard analytics page rebuild → CUT. Use weekly 1-page PDF instead (per `pilot-scoping.md §1`).
  - Multi-branch support → CUT.
  - Stripe billing → CUT (one invoice, done manually).
  - PMS integrations → CUT (CSV-only).
  - 3D hero scene further polish → CUT (already 7.6/10 design avg, ROI on more polish is zero this month).

## 6. The clinic pipeline — outreach plan

- **Target ICP recap (from `docs/pilot-scoping.md §2`):** Riyadh dental, 2–4 chairs, 1,000–2,500 active patients, owner-operator, existing WhatsApp Business number >6 months old, owner replies to WhatsApp in hours not days.
- **Channel mix (weekly quota):**
  - WhatsApp Business DM (cold) → 20/week (primary — meets buyer where they live).
  - Phone calls (Sun/Mon/Tue 9am–12pm) → 12/week (mid-tier; depends on Saudi receptionist gatekeeping).
  - LinkedIn DM (founder → clinic owner) → 5/week (low-yield, but social proof).
  - Warm intros (family/colleagues/university) → 3/week (highest yield — 4-6× cold rate).
  - **Total: ~40/week sustained Weeks 1–3, taper Week 4 as delivery takes over.**
- **Conversion funnel (working assumption):**
  - 120 contacts → 8 in-person clinic visits (≈7% meeting rate)
  - 8 visits → 2 LOIs / verbal yeses (25%)
  - 2 LOIs → 1 signed agreement (50%)
- **Math reality check:** If clinic meeting rate is <5% after Week 1, the script is wrong. If LOI conversion is <20% after a visit, the offer (not the script) is wrong — that's a price-cap drop call for the CEO.
- **Script repurpose:** `docs/pilot-scoping.md §5` — opening (15s), hook (30s), offer (60s), top-5 objection handlers, either/or close. Founder reads it 3 times before Week 1 Day 1.

## 7. Risk register

| Risk                                               | Likelihood | Impact | Owner | Mitigation                                                                                                                             |
| -------------------------------------------------- | ---------- | ------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------- |
| WhatsApp BAPI rejected/delayed past Day 21         | M          | H      | CTO   | Use clinic's existing approved number via session handoff; ICP already filters for >6-mo-old BAPI numbers (`pilot-scoping.md §2`).     |
| SDAIA application rejected or stuck                | M          | H      | GC    | "Filed" is the gate, not "approved". Receipt PDF + `/privacy` disclosure = trust artifact. Lawyer briefed on appeal path.              |
| Zero LOIs by Day 14                                | M          | H      | CRO   | Pre-committed pivot: drop cap to 2,000 SAR for the first signer; shift to warm-intro-only outreach Week 3.                             |
| Zero in-person visits booked by Day 12             | M          | H      | CRO   | Founder physically walks into 3 clinics unannounced on Day 13 (Saturday is OK for "drop-in" without scheduled meeting).                |
| Founder burnout (solo, no cofounder)               | M          | H      | CEO   | Friday is locked rest day. Max 1 strategic session on Saturday. Daily 15-min standup template (§12) prevents drift.                    |
| Pilot clinic backs out post-sign                   | M          | M      | CCO   | Day 0 protocol exchanges direct WhatsApp numbers; weekly check-in is contractual; Day 7 TTV is the lock-in moment.                     |
| Cash runway shortfall (founder personal)           | L          | H      | CFO   | Trigger at <6 months: freeze non-pilot spend. <3 months: part-time consulting gig. Pre-committed, not a panic call.                    |
| Patient complaint cascade in pilot wave-1          | L          | H      | CCO   | Wave 1 capped at 100 patients (not 300); founder watches replies hourly Day 4–6; pause-trigger at 3 complaints/7d.                     |
| Lawyer redlines reveal fatal contract gap          | L          | H      | GC    | Buffer time in Week 2 to incorporate; if a clause cannot ship by Day 14, pause sign attempts and re-route Week 3.                      |
| Meta BAPI documents request loop                   | M          | M      | CTO   | 24h response SLA on Meta inbound; pre-prepared CR + ID + business address pack.                                                        |
| Founder identity reveal triggers cultural pushback | L          | M      | CMO   | Honest disclaimer ("first documented pilot, no inflated numbers") sets the tone. Khaleeji-only copy.                                   |
| Negative LinkedIn post from a contacted clinic     | L          | M      | CEO   | Outreach uses owner's name + clinic name only when public; honest no-pressure tone in `pilot-scoping.md §5` reduces this to near-zero. |

## 8. Decision gates (when to change the plan)

- **Gate 1 (Day 7 = 2026-06-05):** SDAIA filing receipt in hand + Meta BAPI submitted + ≥10 contacts logged. **If 2 of 3 fail:** drop Week 2 outreach quota from 40 to 25 and reallocate to closing the failed gate. **If 3 of 3 fail:** founder takes a full Saturday strategic offsite — the problem is sequencing, not effort.
- **Gate 2 (Day 14 = 2026-06-12):** ≥2 in-person clinic visits booked for Week 3 + lawyer-reviewed agreement v1.0 ready. **If <2 visits:** drop cap to 2,000 SAR for first signer (pre-committed CEO call), switch outreach to warm-intros only.
- **Gate 3 (Day 21 = 2026-06-19):** ≥1 signed agreement OR ≥2 LOIs. **If 0 of either:** Week 4 pivots from "deliver + publish" to "second-cycle outreach with the warmest 20 contacts only" + founder writes the honest "structural change needed" memo.
- **Gate 4 (Day 30 = 2026-06-29):** ≥1 returned patient verified by owner + case study draft signed off + landing pilot block live OR honest "what we learned" memo published internally. Either outcome triggers a next-month plan revision.

## 9. What gets CUT if the month is behind

Pre-committed cuts so the founder doesn't lose cycles debating them mid-month. **If behind on the north-star by Day 14, the following are dropped in this order without further deliberation:**

1. **3D hero scene further polish** — design avg is already 7.6/10. Zero ROI on more polish before there's a customer. Cut immediately.
2. **Dark mode** (ROADMAP Phase 2 item) — irrelevant to pilot clinic owner who uses one device, one mode, one moment. Cut.
3. **Test coverage push to >80%** — current coverage is sufficient for pilot scope. Defer to next month or post-pilot. Cut.
4. **OG images / `next/og` polish** — share previews don't sign clinics. Cut.
5. **LinkedIn warm intro outreach to non-Saudi network** — Riyadh-only this month, no exceptions. Cut.
6. **Building Aooda's own WhatsApp BAPI in time for Wave-1** — IF Meta hasn't approved by Day 18, immediately switch to the clinic's existing number via session handoff. Stop refreshing the Meta status page.
7. **Stripe billing integration** (ROADMAP Phase 4) — manual invoice for the pilot. Cut.
8. **Multi-branch / multi-tenant architecture** — solving a Day-90 problem on Day 15. Cut.
9. **Case-study sub-page (Block 5 of `landing-pilot-block.md`)** — Blocks 1–4 are sufficient for end-of-month publish; Block 5 ships in Phase 2 anyway. Cut from this month if behind.
10. **Founder Twitter/X presence** — LinkedIn + WhatsApp Status only. Cut.

## 10. Out-of-scope this month (don't even think about it)

- **Fundraising.** Pre-revenue + 0 signed customers = no narrative. Revisit after 1 signed pilot + 1 returned patient OR after Month 2.
- **Hiring (any role, any contract type).** Solo founder. Adding anyone now multiplies coordination cost without multiplying output. Even a part-time VA = no.
- **Jeddah / Khobar expansion.** Riyadh-only this month — same time zone, same dialect, in-person reachable.
- **Cosmetic dermatology / beauty / physio verticals.** Dental-only this month per ICP.
- **Stripe / billing automation.** Manual invoice for one pilot is faster than building the integration.
- **English-language landing page revisions.** Arabic-only audience this month.
- **Mobile app (React Native).** ROADMAP Phase 4. Out.
- **Marketplace listings (G2, Capterra, etc.).** Pre-PMF noise. Out.
- **Investor coffee chats "just to network".** Time sink with zero pilot leverage. Out.
- **Polishing the demo dashboard further.** It's already 8.5/10 code ceiling. Marginal returns are zero.

## 11. Tooling / artifacts checklist

- [ ] SDAIA portal account (founder ID, CR document, business address)
- [ ] Meta Business Manager + BSP account (360dialog or Twilio)
- [ ] WhatsApp Business app (founder's personal direct line to clinic owners)
- [ ] Riyadh-dental Tier-1 target list spreadsheet (60 clinics, 8 columns minimum)
- [ ] Per-patient tracking sheet template (Google Sheets, shared edit with each signed clinic)
- [ ] `pilot-agreement.md` → print-ready PDF (Arabic) v1.0 with lawyer redlines
- [ ] `/privacy` page updated with PDPL disclosure + sub-processors
- [ ] `/about` page with real founder name + photo + LinkedIn URL
- [ ] LinkedIn account (founder, Arabic-primary headline)
- [ ] Lawyer relationship (Saudi-licensed, 1h consult booked Week 2)
- [ ] Opt-out auto-handler deployed to production
- [ ] Weekly 1-page PDF generator (Arabic, brand tokens)
- [ ] Case-study PDF template (1-page Arabic, print-ready)
- [ ] Sentry + PostHog env vars confirmed in Vercel prod
- [ ] Tracking spreadsheet for outreach pipeline (contacts → meetings → LOIs → signs)
- [ ] Personal bank account ready to accept SAR pilot revenue + issue tax-compliant invoice (VAT 15%)
- [ ] Calendar blocked Sun–Thu mornings for outreach; Fri = rest; Sat = buffer

## 12. Daily 15-min standup template

Founder writes this every morning Sun–Thu before the first outreach call. Stays in a single rolling file (e.g., `docs/standup.md`):

```
Date: YYYY-MM-DD
Yesterday: [3 bullets max — what shipped, not what was attempted]
Today: [3 bullets max — the ONE primary action + 2 secondary]
Blocker: [one sentence, or "none"]
Metric: [contacts logged / meetings booked / LOIs / signed — running tally]
Mood (1-5): [honest number, no commentary needed]
```

**Rules:**

- Written, not mental. Written prevents drift.
- Max 15 min. If it takes longer, the day is already broken.
- Friday: skip entirely (rest day).
- Saturday: optional, only if running a strategic session.
- End-of-week: 30-min written retro (what worked, what to cut from next week).
- End-of-month: 4-hour strategic offsite (solo, written, no laptop except for this doc).

## 13. End-of-month publication plan

- **Landing pilot block deployment sequence (per `docs/landing-pilot-block.md`):**
  - Block 1 (`testimonials.tsx` body) — ships within 48h of owner case-study sign-off.
  - Block 2 (`metric-bar.tsx` `TRUST_POINTS`) — ships same day as Block 1.
  - Block 3 (hero supporting line) — ships same day as Block 1.
  - Block 4 (`cta.tsx` trust line) — ships same day as Block 1.
  - Block 5 (case-study sub-page) — deferred to Month 2 unless time permits.
- **Case-study writeup:**
  - 1-page Arabic PDF, print-ready (brand sage + gold tokens, IBM Plex Arabic).
  - 3 metrics: patients returned, reply rate, opt-out rate. **No revenue figure** (per `pilot-scoping.md §3`).
  - Owner photo IF approved; otherwise name + clinic + city.
  - 60-second WhatsApp video testimonial requested Day +1 (gold-standard proof).
- **Founder announcements:**
  - LinkedIn post (Arabic, honest, no buzzwords): "أول تجربة موثّقة — عيادة وحدة، X مريض رجعوا، الرقم من سجلات العيادة."
  - WhatsApp Status (visible to the contact list built from Weeks 1–3 outreach — even non-converts will see proof).
  - **No Twitter/X** — out of scope.
- **Founder reveal landing update:**
  - `/about` already updated Week 1 with real name + photo + LinkedIn.
  - End-of-month: add a 1-paragraph "what I learned in 30 days" note + link to case study.
- **What does NOT publish:** Revenue. SDAIA approval status (only "filed"). Anything implying multiple pilots. Anything in MSA tone — Khaleeji only.

---

> End of plan. Total estimated reading time: 15 minutes. Re-read at every weekly gate. The board signs off; the founder executes.
