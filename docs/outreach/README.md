# Outreach — Tier 1 Target List

> **Owner:** CRO (founder hat). **Status:** Template + instructions. Founder fills with real clinic data.
> **Goal of this list:** 60 ICP-qualified Riyadh dental clinics by end of Week 1 (per `docs/30-day-plan.md §3`).
> **Linked artifacts:** `docs/pilot-scoping.md §2` (ICP), `docs/specs/outreach-pipeline-schema.md` (the state machine these rows move through).

---

## 1. Files in this folder

- `tier1-target-list.template.csv` — column shape + 5 invented placeholder rows. **Every row in the template is marked `<<… placeholder>>` — do not confuse with real data.** Delete those 5 rows before adding real clinics; keep the header.
- `README.md` — this file.

---

## 2. Column reference

| Column             | What goes in                                                                                                                                                                                                                | Example                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `clinic_name`      | Full registered Arabic clinic name.                                                                                                                                                                                         | `عيادة الابتسامة المتميزة`                                           |
| `district_riyadh`  | Neighborhood (حي) in Riyadh. Used for geographic clustering of visits.                                                                                                                                                      | `العليا`, `الملقا`, `حطين`, `النخيل`, `الورود`, `الياسمين`           |
| `owner_name`       | Owner / managing dentist name. If unknown after 1st research pass, leave blank — `cold` status is fine.                                                                                                                     | `د. أحمد القحطاني`                                                   |
| `owner_phone_e164` | E.164 format with `+9665` prefix. **Never** record without explicit consent path — the number itself is sourced from PUBLIC channels only (Google Maps, clinic website, public Instagram).                                  | `+9665XXXXXXXX`                                                      |
| `source`           | Where you found the clinic. One of: `Google Maps`, `Snapchat`, `Instagram`, `Referral`, `Walk-by`.                                                                                                                          | `Google Maps`                                                        |
| `tech_signal`      | Quick read on how WhatsApp-ready the clinic is. `high` = visible WhatsApp Business catalog + active responses to public reviews. `med` = WhatsApp number listed, no other signals. `low` = no public WhatsApp / phone only. | `high`                                                               |
| `status`           | One of: `cold`, `contacted`, `replied`, `meeting_booked`, `visited`, `loi`, `signed`, `declined`, `nurture`. Matches the state machine in `docs/specs/outreach-pipeline-schema.md §3`.                                      | `cold`                                                               |
| `notes_date`       | Free-text notes + the date of the last action. Keep dated entries newest-first separated by `\|`.                                                                                                                           | `2026-06-02 — ردّ على واتساب، يطلب اجتماع \| 2026-05-31 — أول رسالة` |

---

## 3. ICP qualification (from `pilot-scoping.md §2`)

A clinic only earns a row in this CSV if it passes ALL these filters:

- ✅ Located in **Riyadh** (Jeddah / Khobar = Tier 2 list, do not mix).
- ✅ **Dental** — general + cosmetic. NOT orthodontic-only, NOT pediatric-only, NOT a hospital dental department.
- ✅ Estimated **2–4 chairs** (call the clinic and ask, or infer from photos + parking + team size on Instagram).
- ✅ Owner-operator likely (single name on Google + Instagram, not a brand chain).
- ✅ Has a public WhatsApp Business number — confirmable on Google Maps listing or website.
- ✅ Clinic has been operating > 12 months (a brand-new clinic has no dormant patient base).
- ✅ Estimated 1,000+ patient records — inferred from review count (≥80 Google reviews ≈ proxy for 800+ patients) OR from total Instagram follower count.

A clinic that fails any of these is NOT added to this list. There are not 60 perfect Riyadh clinics — there are ~150 that pass the filter and the founder picks the top 60 by tech signal + district proximity.

---

## 4. Anti-signals (clinics to AVOID — do NOT add even if they would expand the list)

From `pilot-scoping.md §2` "Anti-signals":

- ❌ **Multi-branch chains.** Examples (representative — verify each independently): any clinic listing 3+ branches on its website. Slow approvals, corporate marketing team, will demand custom features.
- ❌ **Hospital-affiliated dental units.** They use the hospital's CRM and procurement. Sales cycle is 6+ months.
- ❌ **>10 chairs.** Too large; the owner is not personally involved in operations.
- ❌ **Clinics with active negative-review patterns** (visible in Google review responses). Reactivation messages will land on already-angry patients and the pilot will look like Aooda's failure, not the clinic's.
- ❌ **Clinics that openly advertise heavy discounting.** They are likely cycling through patients, not retaining them — the reactivation premise is weaker.
- ❌ **Brand-new clinics (< 12 months operating).** No dormant base.
- ❌ Clinics where the only contact path is a centralized call center.

---

## 5. Suggested research workflow

Goal: 60 qualified rows by end of Week 1. Estimated effort: 6–8 hours of focused founder time spread across Sat–Sun.

**Pass 1 — Geographic sweep (2 hours, Saturday).**

- Open Google Maps. Search "عيادة أسنان" filtered by each Riyadh district one at a time: العليا, الملقا, حطين, النخيل, الورود, الياسمين, الربيع, الصحافة, التعاون.
- For each clinic that passes the basic ICP filter (rough chair count, owner-feel, > 12 months operating), add to the CSV as `cold`.
- Capture `clinic_name`, `district_riyadh`, `source: Google Maps`, `tech_signal` inferred from listing quality.

**Pass 2 — Social signal pass (2 hours, Sunday).**

- For each cold row, check Snapchat (search the clinic name) and Instagram (search the clinic name + the owner's name).
- Verify owner is identifiable. Update `owner_name` if found.
- Update `tech_signal` based on social presence.
- Drop any row where the clinic looks like a chain or shows anti-signals you missed in Pass 1.

**Pass 3 — Warm intro overlay (1 hour, Sunday).**

- Cross-reference the list against the founder's personal network: former colleagues, university classmates, family connections.
- For any clinic where a warm intro path exists, prepend `WARM: ` to the `notes_date` field.
- Warm-intro clinics jump to the top of the outreach queue.

**Pass 4 — Phone-number capture (1 hour, Monday morning).**

- For top-30 of the 60 (by tech signal + warm intro), capture the public WhatsApp/phone number.
- Source ONLY from public surfaces: the clinic's website, their Google Maps listing, or their Instagram bio.
- E.164 normalize: prepend `+966`, strip leading 0 / spaces.
- Do NOT add a number that was obtained via any non-public path (DM, personal contact, leak).

---

## 6. PDPL note on this list

The clinic-owner phone numbers stored here are **B2B contact data**, not patient data. Different PDPL profile:

- Owners are public business contacts when their number is listed on a clinic's public surface.
- B2B cold outreach via WhatsApp is permissible under PDPL when (a) source is public, (b) message identifies sender, (c) opt-out is offered, (d) frequency is bounded.
- Aooda's outreach script (`pilot-scoping.md §5`) satisfies (a)-(c). Frequency is bounded by the 40/week quota in `30-day-plan.md §3`.
- This list is NOT integrated with the patient database. It lives in a separate spreadsheet, separate audit log.

If an owner replies "stop" or "وقّفوا" to a cold outreach message, the same opt-out mechanics from `opt-out-handler.md` apply: their phone is suppressed permanently from Aooda's B2B outreach. No re-attempts. Status moves to `declined`.

---

## 7. Operating the list (daily ritual)

- Open CSV at start of outreach session.
- Filter for `status: cold`.
- Work top-down by `tech_signal: high` first, then `med`, then `low`.
- After every contact action, update the row's `status` and append to `notes_date` (newest-first, `\|`-separated).
- Maximum 12 cold contacts per session (avoids Meta rate limits + sustains script quality).
- At end of session, save the CSV with the date in the filename: `tier1-target-list-2026-06-02.csv`. Keep history.

---

## 8. Privacy + ethics guardrails (read once, internalize)

- Never copy/paste a patient's name or phone from a clinic's public page. Aooda has no business with patient data until a clinic signs a pilot agreement.
- Never persist data scraped from a private channel. If a clinic's contact is only available behind a login, do not add it.
- If an owner reacts negatively to the first contact, move to `declined` immediately. Do not re-attempt under a different angle.
- This list is internal. Never publish it, never share with a partner, never quote from it externally. The clinic owners did not consent to being on a SaaS prospect list — they consented to being publicly findable as a business.

---

## 9. Open questions for founder

1. Confirm the 9-district sweep list — Pass 1 currently lists 9 districts. Add / remove based on founder's mental map of Riyadh affluence + dental clinic density.
2. Where should the canonical CSV live? Suggested: a `.gitignore`-d local file in `data/private/outreach/`, NOT in the repo. The template lives in `docs/outreach/` (public). The real list does not.
3. Should `owner_phone_e164` be stored hashed at-rest? For a 60-row list, plaintext is fine if the CSV is not in git. For 600+ rows or shared collaboration, switch to hashed + a separate decrypted view.
