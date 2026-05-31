# Meta WhatsApp Business API Templates — Aooda v1

> Status: DRAFT for Meta submission. Submit via 360dialog / Twilio BSP. Each template requires manual approval per language. Expected approval time: 24h–14 days. Healthcare templates get extra scrutiny — keep tone neutral, no medical claims.
>
> Meta 2026-01-15 policy: no free-form generation. Every outbound non-session message must use one of these approved templates. AI personalization happens only via variable substitution inside the approved body.

## Submission checklist (per template)

- [ ] Category set correctly (Marketing / Utility / Authentication)
- [ ] Language: Arabic (Saudi Arabia primary; add Jordan / UAE / Kuwait / Qatar / Bahrain / Oman variants if regional dialect differs materially)
- [ ] Variables documented with sample values
- [ ] Quick-reply / CTA buttons configured
- [ ] Opt-out keyword "إيقاف" / "STOP" supported automatically
- [ ] No medical claims, no prescription language, no diagnosis terms
- [ ] No discount > 50% (Meta flags excessive promotion)
- [ ] No external short-links the first month (build domain trust first)
- [ ] No emojis in healthcare templates (Aooda house rule, also Meta-safer)

---

## 1. `recall_dormant_v1` (Utility)

**Purpose**: Patient hasn't visited in 90+ days. Soft reminder, no offer, no urgency.

**Category**: Utility (regular service reminder, not marketing — safer category)

**Header**: None (text-only template)

**Body**:

```
مرحباً {{1}}،

مرّت {{2}} منذ آخر زيارتك لـ{{3}}. نتمنى تكون بخير وبصحة جيدة.

لو تحب تحجز موعد متابعة، نحن هنا.

للرد بـ "إيقاف" لعدم استقبال رسائل لاحقاً.
```

**Variables**:

- `{{1}}` = patient first name (e.g. "أحمد")
- `{{2}}` = time since last visit, formatted naturally (e.g. "أربعة أشهر", "ستة أشهر", "سنة")
- `{{3}}` = clinic display name (e.g. "عيادة الياسمين للأسنان")

**Footer**: `Aooda · رسالة من عيادتك`

**Buttons**: Quick reply

- "أبي أحجز" (returns to clinic CRM as a booking intent)
- "ذكّروني لاحقاً" (snooze 60 days)

**Why this template works**: Service-tone language ("نتمنى تكون بخير") removes the marketing feel. No incentive = no Meta marketing-category friction. Soft CTA. The "إيقاف" keyword is explicit per TRC Jordan + KSA PDPL requirements.

---

## 2. `recall_with_offer_v1` (Marketing)

**Purpose**: Same as recall but with a clinic-defined offer. Higher friction with Meta; only use when clinic has a real promotion.

**Category**: Marketing

**Body**:

```
مرحباً {{1}}،

نتذكر زيارتك الأخيرة لـ{{2}} قبل {{3}}.

كعملاء كرام نعطيك خصم {{4}}% على {{5}} هذا الشهر.

لمعرفة التفاصيل، اضغط الزر.

للرد بـ "إيقاف" لعدم استقبال عروض لاحقاً.
```

**Variables**:

- `{{1}}` = patient first name
- `{{2}}` = clinic name
- `{{3}}` = time since last visit
- `{{4}}` = discount percent (integer, max 30 — Meta safer threshold)
- `{{5}}` = service category (e.g. "تنظيف الأسنان", "فحص دوري")

**Buttons**: URL button → clinic-specific landing page (must be HTTPS, domain pre-approved with Meta).

**Why care**: Healthcare + marketing + discount = highest Meta scrutiny. Submit this last, after `recall_dormant_v1` is approved and account has good standing.

---

## 3. `health_reminder_seasonal_v1` (Utility)

**Purpose**: Time-based service reminder (e.g. 6-month dental cleaning cadence).

**Category**: Utility

**Body**:

```
مرحباً {{1}}،

مرّت {{2}} منذ آخر فحص لك في {{3}}.

التوصية الطبية: فحص ونظافة كل 6 أشهر للحفاظ على صحة أسنانك.

نحب نذكّرك بحجز موعد متابعة.

للرد بـ "إيقاف" لعدم استقبال تذكيرات صحية لاحقاً.
```

**Variables**:

- `{{1}}` = patient first name
- `{{2}}` = time since last visit
- `{{3}}` = clinic name

**Buttons**: Quick reply ("أحجز", "ذكّروني الشهر القادم")

**Why this template works**: Frames as health advice not commerce. Lowest Meta friction. Highest open rate in tests of similar services.

---

## 4. `birthday_v1` (Marketing)

**Purpose**: Patient birthday — warm, low-pressure outreach. Optional discount.

**Category**: Marketing

**Body**:

```
كل عام وأنت بخير {{1}}!

من عيادة {{2}}، نتمنى لك سنة جديدة مليئة بالصحة والسعادة.

كهدية، خصم {{3}}% على أي خدمة هذا الأسبوع.

للرد بـ "إيقاف" لعدم استقبال رسائل لاحقاً.
```

**Variables**:

- `{{1}}` = patient first name
- `{{2}}` = clinic name
- `{{3}}` = birthday discount percent (default 15)

**Note**: Only send within 7 days of birthday. Track in audit_log.

---

## 5. `custom_clinic_message_v1` (Marketing)

**Purpose**: Clinic-authored message with Aooda providing structure + safety wrapping. Clinic writes the middle paragraph; Aooda enforces wrapper + opt-out.

**Category**: Marketing

**Body**:

```
مرحباً {{1}}،

{{2}}

من عيادة {{3}}.

للرد بـ "إيقاف" لعدم استقبال رسائل لاحقاً.
```

**Variables**:

- `{{1}}` = patient first name
- `{{2}}` = clinic-authored body text (max 800 chars, Aooda safety-checks: no medical claims, no prescription terms, no false urgency, no impersonation, no PII other than the recipient's first name)
- `{{3}}` = clinic name

**Why this template works**: Gives clinic flexibility without violating Meta rules. Aooda owns the rails; clinic owns the middle. Safety-check the {{2}} server-side via `cleanCustomMessage()` (to build).

---

## 6. `post_visit_followup_v1` (Utility)

**Purpose**: 24–72 hours after a visit — care-style follow-up.

**Category**: Utility

**Body**:

```
مرحباً {{1}}،

نتمنى تكون بخير بعد زيارتك لـ{{2}} يوم {{3}}.

لو احتجت أي استفسار أو موعد متابعة، نحن متاحون.

للرد بـ "إيقاف" لعدم استقبال رسائل المتابعة لاحقاً.
```

**Variables**:

- `{{1}}` = patient first name
- `{{2}}` = clinic name
- `{{3}}` = visit day (e.g. "الأحد الماضي" or "أمس")

**Why this template works**: Strongest trust-builder. High open rate (>80% in industry data). Sets up future reactivation: the patient hears from the clinic in a non-sales context first.

---

## 7. `satisfaction_survey_v1` (Utility)

**Purpose**: Post-visit NPS / single-question satisfaction.

**Category**: Utility

**Body**:

```
مرحباً {{1}}،

كيف كانت تجربتك في {{2}} يوم {{3}}؟

اختر تقييماً من 1 (سيء) إلى 5 (ممتاز).

للرد بـ "إيقاف" لعدم استقبال استبيانات لاحقاً.
```

**Variables**:

- `{{1}}` = patient first name
- `{{2}}` = clinic name
- `{{3}}` = visit day

**Buttons**: Quick reply with 5 options: ⭐ ⭐⭐ ⭐⭐⭐ ⭐⭐⭐⭐ ⭐⭐⭐⭐⭐ (Aooda house rule: no emojis, but Meta requires button labels — use "ممتاز / جيد جداً / جيد / مقبول / ضعيف" instead).

**Why this template works**: Generates clinic-side reviews for marketing. Feeds VoC aggregator. Catches dissatisfied patients early.

---

## 8. `opt_out_confirm_v1` (Utility)

**Purpose**: Auto-fired when patient replies "إيقاف" / "STOP". Confirms removal.

**Category**: Utility

**Body**:

```
شكراً {{1}}.

تم إيقاف الرسائل من عيادة {{2}}.

لن تستقبل أي رسائل أخرى ما لم تحجز زيارة جديدة بنفسك.

للعودة لاستقبال التذكيرات، أرسل كلمة "تفعيل".
```

**Variables**:

- `{{1}}` = patient first name (or "عزيزنا" if first name unknown)
- `{{2}}` = clinic name

**Why mandatory**: TRC Jordan + KSA PDPL + Meta ToS all require explicit confirmation of opt-out. Without this, every complaint is a regulatory bullet.

---

## Personalization rules (what Claude is allowed to vary)

For each template, the AI's job is:

1. **Pick the best template** for the patient's segment (dormant 90+, dormant 180+, new patient, recent visit, etc.)
2. **Fill variables** with appropriately-toned values:
   - First name → use first name only (not last name, not "السيد/السيدة")
   - Time-since-visit → human-friendly ("ستة أشهر" not "183 يوم")
   - Service category → use the clinic's actual nomenclature, not generic terms
3. **Refuse to send** if any variable is empty, malformed, or contains characters that would break Meta rendering

**Forbidden personalization**:

- Generating new sentences not in the template body
- Adding emojis beyond what the template defines
- Adding URLs not pre-approved
- Including medical advice
- Naming specific medications or treatments
- Mentioning prices outside the {{4}} discount variable

## How to submit

1. Open BSP console (360dialog / Twilio)
2. For each template above:
   - Create template, paste body, declare variables
   - Set category
   - Upload buttons
   - Submit for review
3. Expected timeline: utility 24-72h, marketing 5-14 days
4. If rejected, read rejection reason carefully — usually about category, claims, or button URLs
5. Resubmit with fix; do not flood with re-submissions (account standing penalty)

## What to do if rejected

| Rejection reason                          | Fix                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| "Promotional content in utility category" | Move to Marketing category, accept higher friction                                                      |
| "Medical claim"                           | Strip any word implying treatment efficacy ("علاج" → "زيارة"; "صحة الأسنان" is OK; "علاج اللثة" is not) |
| "URL not trusted"                         | Use clinic's own domain; warm it up with low-volume sends first                                         |
| "Variable misuse"                         | Variables must be data (name, date, percent) not full sentences                                         |
| "Tone too marketing"                      | Remove "خصم", "عرض", "مميز"; reframe as service reminder                                                |

## Linked code changes

These templates require corresponding changes in:

- `src/lib/whatsapp-templates.ts` (new) — registry of approved template IDs + variable validators
- `src/app/api/generate-message/route.ts` — replace free-form generation with template selection + variable filling
- `src/lib/claude.ts` — new function `selectTemplateAndFillVariables()`
- `prisma/schema.prisma` — new `Message` table tracking template_id, variables sent, opt-out status
- `supabase/migrations/003_message_log.sql` — DDL

See `docs/specs/template-based-generation.md` (to write in Block 2).
