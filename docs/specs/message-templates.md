# Khaleeji Message Templates — Spec

> **Owner:** CMO (copy) + CCO (CS approves tone) + GC (PDPL line audit).
> **Status:** Draft for founder review AND for the clinic owner's veto at Day 0 (per `pilot-scoping.md §1` — "All outbound copy reviewed by the clinic owner BEFORE the first send wave. Owner has final veto on tone.").
> **Locked rule:** every outbound template ends with EXACTLY: `للإيقاف: اكتب "اوقف" أو STOP`
> **Length cap:** every full template (after worst-case substitution) ≤ 280 chars.
> **Voice:** Khaleeji modern. Zero buzzwords. Zero "AI". Zero "platform". Sounds like a clinic receptionist who actually remembers the patient.
> **Linked artifacts:** `docs/pilot-scoping.md §5` (objection map this responds to), `docs/specs/opt-out-handler.md` (the regex that recognizes the opt-out reply), `.claude/agents/abu-khalid.md` (objections #1, #3, #5 specifically).

---

## 1. Why three templates (not one)

`pilot-scoping.md §1` defines three message types in the pilot scope:

1. **Reactivation outreach** — the first contact to a dormant patient. The single most important message Aooda ever sends. If this template fails the abu-khalid persona test, nothing else matters.
2. **Follow-up after no-reply (3 days)** — gentler tone, different angle, only sent if the patient did not reply at all. Never sent to a patient who replied opt-out OR replied positively.
3. **Booking confirmation reply** — when the patient says "yes I want to book", this is the warm handoff back to the clinic receptionist. Not promotional; logistical.

The pilot does NOT send promotional messages, discount blasts, holiday wishes, or birthday greetings. These are all out of scope (`pilot-scoping.md §1 — Scope OUT`).

---

## 2. The exact opt-out footer (regulatory constant)

Every template ends with EXACTLY this line, character-for-character:

```
للإيقاف: اكتب "اوقف" أو STOP
```

**Why this exact wording (not a paraphrase):**

- It matches `opt-out-handler.md §3` regex tokens — the patient is shown the exact words the system listens for.
- The colon + quote marks help screen-reader bidi behave.
- "اكتب" (write) is more concrete than "أرسل" (send) and reads as instruction, not formality.
- The Latin "STOP" sits naturally after "أو" — patients reading via accessibility screen-readers and older patients alike land on at least one token they recognize.

**Bidi note for implementation:** the segment `"اوقف" أو STOP` must render with the Latin "STOP" left-to-right inside the right-to-left Arabic line. In the WhatsApp text payload this is handled by the platform's auto-bidi, but in any preview rendering inside Aooda's dashboard wrap the Latin token: `<span dir="ltr">STOP</span>` (per `arabic-khaleeji-critic` check 4).

---

## 3. Variable substitution engine — spec

All templates use this variable syntax. The engine performs strict substitution — unknown variables throw an error AT QUEUE time (not at send time), so a typo cannot ship.

| Variable                       | Type   | Source                                            | Fallback if missing                                                       | Max length contribution |
| ------------------------------ | ------ | ------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------- |
| `{{patient_name}}`             | string | `patient.name_ar` (first token only — first name) | Skip the greeting line; start with the body.                              | 20 chars                |
| `{{clinic_name}}`              | string | `clinic.name`                                     | **Hard-fail** — clinic name MUST exist; refuse to send.                   | 30 chars                |
| `{{last_visit_date_relative}}` | string | computed from `patient.last_visit_date`           | "من فترة" (generic)                                                       | 18 chars                |
| `{{booking_url}}`              | string | per-clinic short-link                             | Replace CTA line with a neutral "ردّ على هذي الرسالة وراح نرجع لك بموعد." | 22 chars                |

### 3.1 `{{patient_name}}` — first-name only

- Take the first whitespace-separated token from `patient.name_ar`.
- Cap at 20 chars (rare to exceed — most Arabic first names are 3–10 chars).
- If empty → omit the greeting line entirely; do NOT use "عزيزي/عزيزتي" (sounds press-release-y) or "صديقي" (over-familiar).
- Never use last name / family name — privacy-respectful and matches Khaleeji clinic-receptionist tone.

### 3.2 `{{clinic_name}}` — clinic display name

- Direct insertion from `clinic.name`.
- If the name is unusually long (>30 chars), the queue worker should flag it for the clinic owner during onboarding ("اسم العيادة طويل، تبي صيغة مختصرة؟") but does NOT auto-truncate.

### 3.3 `{{last_visit_date_relative}}` — Arabic-Indic date relative formatting

This is the trickiest variable. The goal: make the patient feel "the clinic remembers when I was here last", not "the system did a date diff".

**Algorithm:**

```
months_ago = floor((today - last_visit_date) / 30 days)

if months_ago < 6:   → "من شهور" (refuse — patient is not really dormant; should not be in cohort)
if 6 ≤ months_ago < 9:   → "من ستة شهور تقريباً"
if 9 ≤ months_ago < 12:  → "من تسعة شهور تقريباً"
if months_ago == 12:     → "من سنة"
if 12 < months_ago < 18: → "من سنة وشوي"
if months_ago == 18:     → "من سنة ونص"
if months_ago > 18:      → "من فترة"  (don't quantify too precisely — sounds stalker-ish)
```

**Numerals:** Arabic-Indic digits (٠–٩) where digits appear. But the algorithm above outputs Arabic words, not digits, deliberately — words land warmer than digits in this register. If a future template uses a numeric date directly, render with `٠١٢٣٤٥٦٧٨٩` per `arabic-khaleeji-critic` check 6.

**Privacy note:** the algorithm never reveals the exact date in the outbound message — only a fuzzy bucket. This is a deliberate privacy choice: a patient seeing "آخر زيارة في ٢٠٢٤-٠٨-١٢" feels surveilled; "من فترة" feels human.

### 3.4 `{{booking_url}}` — per-clinic short link

- Per-clinic constant URL configured at clinic onboarding.
- MUST be a short, branded link (e.g. clinic's existing booking system or `wa.me/<clinic-number>?text=...`).
- If absent → the entire CTA line is replaced with the natural-language fallback above. Never ship a placeholder URL.

---

## 4. Template 1 — Reactivation outreach

**When sent:** Day 4 / Day 7 / Day 11 of the pilot (per `pilot-scoping.md §4`), in three waves of 100 patients each.
**To whom:** A dormant patient who has not been contacted in this pilot before.
**Tone target:** clinic receptionist remembering a patient warmly. No urgency. No discount. No pressure.

**Template:**

```
السلام عليكم {{patient_name}}،
معاك {{clinic_name}}. شفنا في سجلاتنا إنك ما زرتنا {{last_visit_date_relative}} —
حبينا نطمن عليك. تبي تحجز موعد؟ ردّ بـ "نعم" ونرتبلك.
{{booking_url}}
للإيقاف: اكتب "اوقف" أو STOP
```

**Char budget calculation (worst-case substitution):**

| Segment                      | Max chars      |
| ---------------------------- | -------------- |
| Greeting + name + line break | ~30            |
| "معاك " + clinic_name + ". " | ~36            |
| Body sentence                | ~70            |
| Closing question             | ~38            |
| Booking URL line             | ~24            |
| Opt-out footer               | ~30            |
| Line breaks (5)              | 5              |
| **Total worst-case**         | **~233 chars** |

Well under the 280 cap. Comfortable for a longer clinic name + longer patient name.

**Without substitution (the literal template length, for `wc -c` sanity):**

```
السلام عليكم XXX،\nمعاك YYY. شفنا في سجلاتنا إنك ما زرتنا ZZZ —\nحبينا نطمن عليك. تبي تحجز موعد؟ ردّ بـ "نعم" ونرتبلك.\nUUU\nللإيقاف: اكتب "اوقف" أو STOP
```

≈ 195 chars literal + room for substitution.

**Abu-Khalid objections addressed (from `pilot-scoping.md §5` + `abu-khalid.md`):**

- **Objection #1** "المرضى ما يحبون رسائل آلية — يحسّونها spam" → The opening "معاك {{clinic_name}}" anchors the message in the clinic's identity, not Aooda's. No automated-system phrasing.
- **Objection #2** "كيف الرسائل تبان من العيادة مش من شركة مجهولة؟" → Message arrives from the clinic's own WhatsApp Business number (per `pilot-scoping.md §1`). The TEXT confirms this by naming the clinic right after the greeting.
- **Objection #3** "لو رسالة غلط أو محرجة، تضر أكثر من تنفع" → Owner approves THIS exact template before the first send wave. The template carries zero medical, zero diagnostic, zero billing content.
- **Objection #6 (abu-khalid)** "شو الفرق عن WhatsApp Business العادي؟" → The tone IS like a manual receptionist — that's the point. The differentiation is consistency at 300 patients, not novelty per message.

---

## 5. Template 2 — Follow-up (3 days after no reply)

**When sent:** Exactly 3 days after Template 1, if and only if `patient.reply_at IS NULL` AND `patient.opt_out_at IS NULL` AND `patient.booked_at IS NULL`. **Never** sent twice; if no reply to this one, the patient is dropped from the cohort silently (per `pilot-scoping.md §1` — "one follow-up if no reply after 5 days" — adjusted here to 3 days for a 30-day pilot window).
**Tone target:** softer, even less pressure. Different angle: "we're not chasing you, but the door is open."

**Template:**

```
{{patient_name}}، ما نبغى نزحمك.
بس حابين نقول لك من {{clinic_name}}: لو احتجت موعد أو حتى استشارة سريعة على واتساب،
احنا هنا.
{{booking_url}}
للإيقاف: اكتب "اوقف" أو STOP
```

**Char budget (worst case):** ~210 chars. Well under cap.

**Why this template is different from #1:**

- No reference to last visit date (`last_visit_date_relative` is deliberately omitted) — repeating the "you haven't been here in a while" beat starts to feel passive-aggressive.
- Opens with "ما نبغى نزحمك" ("we don't want to crowd you") — Khaleeji idiom that explicitly releases pressure. Disarms the spam objection on second touch.
- Offers a softer secondary path ("استشارة سريعة على واتساب") that requires zero commitment — designed to elicit any reply, which the clinic receptionist can then warm-up.
- Shorter than Template 1 — second-touch always shorter than first-touch is a learned rule from any retention-marketing playbook, and matches Khaleeji conversational rhythm.

**Abu-Khalid objections addressed:**

- **Objection #1** (spam) is rebutted more strongly here because the message itself acknowledges the meta-concern ("ما نبغى نزحمك").
- **Objection #7** (abu-khalid #7 — "كيف أعرف إنه شغّال؟") — the follow-up CTA gives the patient a low-commitment way to engage, which produces the reply-rate evidence Abu-Khalid wants.

---

## 6. Template 3 — Booking confirmation reply

**When sent:** Within minutes of the receptionist (NOT Aooda — `pilot-scoping.md §1`) confirming a booking inside the dashboard. Aooda sends this as a final logistical message.
**Tone target:** purely transactional. Cordial. Short.

**Template:**

```
تم حجز موعدك في {{clinic_name}} — تفاصيل الموعد راح توصلك من الاستقبال خلال اليوم.
شكراً {{patient_name}} 🌿
للإيقاف: اكتب "اوقف" أو STOP
```

**Char budget (worst case):** ~155 chars. Comfortably under.

**Notes:**

- The 🌿 emoji is a deliberate single visual touch. It echoes Aooda's brand sage/leaf token without saying "Aooda" anywhere. ONE emoji only — `arabic-khaleeji-critic` is generally emoji-light, but a single botanical at the end of a confirmation feels human, not buzzwordy. **If founder rejects → drop it, no other change needed.**
- The actual appointment time/date comes from the receptionist via the existing clinic flow — Aooda does NOT auto-populate it. This avoids the failure mode where Aooda has stale time-zone data or the receptionist updated the slot manually.
- Even on a confirmation message, the opt-out footer is included. PDPL Art. 9 — withdrawal must remain available at every outbound surface, including a happy-path message. This is a deliberate symmetric rule, not a copy-paste artifact.

**Abu-Khalid objections addressed:**

- **Objection #7** "كيف أعرف إنه شغّال؟" → This message is the second proof-point (after the patient replied positively) that the loop closes. Receptionist sees the booking; patient sees the confirmation; everyone has the same story.
- **Objection #3** (embarrassing wrong message) → Confirmation messages reference NO clinical detail. The only personalization is the patient name and clinic name. Zero risk of medical leak.

---

## 7. What these templates intentionally do NOT contain

- No "AI" / "ذكاء اصطناعي" / "automated" / "powered by" anywhere.
- No "limited time offer" / "خصم" / urgency framing.
- No clinic logo / image / sticker — text only. Images on WhatsApp Business trigger different deliverability paths and Meta policy reviews; the pilot stays on the simplest plane.
- No multi-language toggle — Arabic only. The opt-out footer's Latin "STOP" is the only Latin in the entire message.
- No reference to specific past treatment (per `patient-tracking-schema.md §4` — diagnosis / treatment are not even in the database, so they cannot leak into a template).
- No "we missed you 💔" / over-emotional framing — Khaleeji clinic register stays warm-but-professional.
- No "click here" / English CTA verbs — Arabic CTA only.

---

## 8. Self-audit vs. arabic-khaleeji-critic 7-check rubric

| Check                                               | Result | Evidence                                                                                                    |
| --------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| 1. Khaleeji register, not MSA stiffness             | PASS   | "معاك", "تبي تحجز", "ما نبغى نزحمك", "هنا" — all Khaleeji forms. No "لديك" / "نتشرف بـ" / "يسرّنا".         |
| 2. Banned buzzwords — zero tolerance                | PASS   | No "AI", no "ذكاء اصطناعي", no "منصة", no "ثورة", no "تجربة فريدة".                                         |
| 3. Opt-out string exact                             | PASS   | All three templates end with the regulatory-constant line, character-for-character.                         |
| 4. RTL + bidi isolation for embedded Latin          | PASS   | Only Latin token is "STOP" — bidi isolation flagged in §2 for dashboard preview.                            |
| 5. No press-release tone                            | PASS   | No "نحن نقدم" / "يسرّنا الإعلان" / "في إطار التزامنا". Direct second-person voice throughout.               |
| 6. Numerals — Arabic-Indic where brand calls for it | PASS   | Date relative phrases use Arabic words, not numerals (§3.3). No Western digits in body copy.                |
| 7. No pilot-status inflation                        | PASS   | No "عشرات العيادات" / "آلاف المرضى" anywhere. Templates are 1:1 patient communication, no marketing claims. |

**Self-verdict: PASS.**

## 9. Self-audit vs. pdpl-compliance-critic (relevant checks)

| Check                               | Result | Evidence                                                                                                                                                |
| ----------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2. Opt-out language + handler + SLA | PASS   | §2 exact-match string aligns with `opt-out-handler.md §3` regex.                                                                                        |
| 7. No health-data drift             | PASS   | §7 explicit "no clinical detail" + `patient-tracking-schema.md §4` prohibition list ensures the variables fed into templates contain no sensitive data. |

---

## 10. Open questions for founder

1. **Confirmation emoji (🌿) in Template 3** — keep or drop? Default: drop if founder is even slightly unsure. Templates 1 + 2 are emoji-free regardless.
2. **Booking URL fallback** — current fallback is "ردّ على هذي الرسالة" which routes to the clinic's WhatsApp inbox. Alternative: provide every clinic a `wa.me/` deep-link at onboarding so URL is always present. Engineering decision.
3. **Time-of-day send window** — out of this spec, but worth noting: founder + clinic owner should agree to send only between 10:00–18:00 KSA on Sun–Thu. Never Friday. The send-queue should enforce this.
4. **Owner-approved A/B variants** — if the owner edits a template at Day 0, do we lock the edit as a clinic-specific override or treat it as a global v1.1? Recommendation: lock per-clinic, surface a "your version differs from default" diff in the dashboard.
