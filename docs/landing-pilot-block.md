# Landing Pilot Block — Drop-In Copy

> **When to ship:** the same day the first pilot clinic signs the case-study consent (Clause 8 of `pilot-agreement.md`).
> **Founder must fill** every `<<PLACEHOLDER>>` before publishing. Do NOT publish with placeholders visible.

---

## Block 1 — `testimonials.tsx` body (replaces the pre-launch placeholder)

Drop-in copy. Same component shell, replace the inner `<motion.div>` content + header eyebrow + transparency note.

**Eyebrow (replaces `مرحلة الإطلاق التجريبي`):**

```
أول تجربة موثّقة
```

**H2 (replaces `شهادات حقيقية — قريباً`):**

```
عيادة وحدة. نتيجة وحدة. باسمها وصاحبها.
```

**Quote block (RTL, replaces the placeholder paragraph):**

```
"كنت أتوقع رسائل تطفّش الناس. طلعت رسالة طبيعية من رقم العيادة نفسها،
كأنها من موظفة الاستقبال. <<N_PATIENTS>> مريض من اللي اختفوا رجعوا
خلال <<DAYS>> يوم — بدون ما أدفع ريال قبل ما أشوف النتيجة."
```

**Attribution line (under the quote, smaller text):**

```
<<OWNER_NAME>> · <<ROLE_AR>> · <<CLINIC_NAME>> — <<CITY>>
```

> Example for `<<ROLE_AR>>`: "صاحب العيادة" / "المدير الطبي" / "مديرة العيادة" — match Khaleeji form to gender.

**Outcome stat card (sits beside the quote, replacing the booking CTA column):**

```
<<N_PATIENTS>> مريض غايب رجعوا
في <<DAYS>> يوم — تجربة <<CLINIC_NAME>>
```

**Sub-line under the stat:**

```
الرقم مأكّد من صاحب العيادة. نقدر نوصّلك فيه مباشرة.
```

**CTA button (replaces "احجز ديمو"):**

```
كلّم <<OWNER_NAME>> مباشرة
```

> Link target: `mailto:<<OWNER_DIRECT_CONTACT>>?subject=استفسار%20عن%20تجربة%20عَودة` OR a Calendly/WhatsApp deeplink the owner agreed to in writing. NEVER a generic founder inbox — buyer wants peer-to-peer.

**Secondary CTA (small text, under the primary):**

```
أو احجز ديمو ١٥ دقيقة — بدون التزام
```

**Bottom honest disclaimer (replaces the "no fabricated names" line):**

```
هذي تجربتنا الأولى الموثّقة. ما عندنا "٣٤ عيادة" ولا أرقام مكبّرة —
عندنا عيادة وحدة وافقت تحط اسمها، وصاحبها مستعد يكلّمك.
```

---

## Block 2 — `metric-bar.tsx` (replaces the `TRUST_POINTS` array)

Three cards. Same component shell, swap the array. Keep the existing motion/layout.

```ts
const TRUST_POINTS = [
  {
    title: '<<N_PATIENTS>> مريض رجعوا في <<DAYS>> يوم',
    body: 'تجربة موثّقة مع <<CLINIC_NAME>>. الرقم من سجلات العيادة، مش تقديري.',
  },
  {
    title: 'بياناتك على نظام PDPL',
    body: 'نلتزم بمتطلبات نظام حماية البيانات الشخصية (PDPL). تقدّمنا بطلب تسجيل سدايا (SDAIA).',
  },
  {
    title: 'تحدث مع <<FOUNDER_NAME>> مباشرة',
    body: 'ما عندنا فريق مبيعات. تكلّم المؤسس على <<FOUNDER_DIRECT_CONTACT>> — ويرد عليك بنفسه.',
  },
]
```

> **Card 2 wording is locked** — it matches `src/app/about/page.tsx` line 193 verbatim so the compliance story stays identical across pages. Do not paraphrase.
> **Card 3** must be a real channel the founder reads daily (his WhatsApp or personal email) — not `info@`, not `contact@`.

---

## Block 3 — Hero supporting line (replaces the `TODO(brand)` ratio area in `hero.tsx`)

Replaces the line at hero.tsx ~line 152–157 (the two `<p>` blocks under the CTAs).

**Primary supporting line (gold-ish text, ~13px):**

```
في تجربتنا الأولى مع <<CLINIC_NAME>>،
رجع <<N_PATIENTS>> مريض غايب خلال <<DAYS>> يوم.
```

**Secondary line (mute text, ~11px, with anchor):**

```
تجربة وحدة موثّقة — ما نعمّم النتيجة. <a href="#testimonials">شوف التفاصيل</a>
```

> Optional sub-page link target: `/case-studies/<<CLINIC_SLUG>>` (see Block 5).

**If pilot wants a deeper anchor on the hero**, add a third line (still honest, still single-clinic):

```
ما دفعت العيادة ريال قبل ما يرجعوا. نفس الشي ينطبق عليك.
```

---

## Block 4 — `cta.tsx` trust line (replaces "نحن في مرحلة الإطلاق التجريبي")

The line at cta.tsx ~line 170.

**New trust line:**

```
تجربة موثّقة مع <<CLINIC_NAME>> · تقدر تكلّم صاحب العيادة قبل ما تقرّر · لا عقود · إلغاء في أي وقت
```

> Keep the divider dots (`·`) — they match the existing aesthetic.
> If the line wraps awkwardly on mobile, split into two `<p>`:
>
> ```
> تجربة موثّقة مع <<CLINIC_NAME>> — تكلّم صاحب العيادة قبل ما تقرّر
> لا عقود · إلغاء في أي وقت
> ```

---

## Block 5 — Optional case study sub-page outline (`/case-studies/<<CLINIC_SLUG>>`)

One-pager. Ship in Phase 2 (after Blocks 1–4 are live). Outline only — full copy gets drafted from the actual pilot data.

**Page sections (top to bottom, all RTL):**

1. **Eyebrow + H1**
   - Eyebrow: `دراسة حالة — أول تجربة عَودة`
   - H1: `كيف رجع <<N_PATIENTS>> مريض غايب لـ <<CLINIC_NAME>> في <<DAYS>> يوم`

2. **العيادة باختصار** (3 lines max)
   - اسم العيادة، المدينة، التخصص، حجم قاعدة المرضى الإجمالية (تقريبي، بموافقة صاحب العيادة).

3. **المشكلة قبل عَودة**
   - كم مريض كان "غايب" (آخر زيارة قبل 6 أشهر – سنة ونص).
   - شو جرّبت العيادة قبل (موظفة جزء وقت، رسائل SMS عامة، إلخ).

4. **كيف صار التواصل** (شفافية + امتثال)
   - الموافقة المسبقة كانت موجودة من تسجيل المريض الأصلي.
   - الرسالة طلعت من رقم WhatsApp Business تبع العيادة، باسمها.
   - كل رسالة فيها خيار "للإيقاف، أرسل STOP" — بدون استثناء.

5. **عيّنة من الرسالة** (مجهولة الهوية، بموافقة العيادة)
   - مربع نص يعرض الصياغة الفعلية، مع تشويش اسم المريض ورقمه.
   - تعليق صاحب العيادة: "ليش وافقت على هذي الصياغة بالذات."

6. **النتيجة** (تُعرض كبطاقات)
   - `<<N_PATIENTS>>` مريض رجعوا فعلياً خلال `<<DAYS>>` يوم.
   - `<<N_BOOKED>>` حجزوا موعد (لو الرقم متاح ومختلف).
   - `<<RESPONSE_RATE>>%` معدل رد (اختياري — فقط لو صاحب العيادة وافق).
   - **لا نعرض الإيراد بالريال** — حتى لو وافقت العيادة، الرقم حساس.

7. **اقتباس صاحب العيادة** (3–5 أسطر، بصوته هو)
   - يُكتب معه شخصياً، يراجعه ويوقع عليه قبل النشر (شرط Clause 8).

8. **شو كانت التكلفة الفعلية**
   - عَودة أخذت `<<AMOUNT>>` ر.س = 15% من الإيراد المسترجع، بسقف 3,000 ر.س.
   - العيادة دفعت بعد رجوع المرضى، مش قبل.

9. **تكلّم صاحب العيادة**
   - زر واحد: `كلّم <<OWNER_NAME>>` → `<<OWNER_DIRECT_CONTACT>>`.
   - تعليق: "وافق ياخذ مكالمة وحدة من كل عيادة جادة. اول-يجي-اول-يخدم."

10. **التزامنا للقارئ** (footer مصغّر)
    - رابط `pilot-agreement.md` (نسخة عامة، بدون أرقام العيادة).
    - رابط `aooda.com/privacy`.
    - عبارة: `تجربة واحدة موثّقة — لا نعمّم النتائج. تجربتك ممكن تختلف.`

---

## Placeholders that MUST be filled

| Placeholder                  | What goes here                                                                                                      | Source / how to verify                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `<<CLINIC_NAME>>`            | Full registered clinic name in Arabic.                                                                              | Pilot agreement section 1 (after founder fills it).                                                                                |
| `<<CITY>>`                   | Saudi city (الرياض، جدة، الدمام...).                                                                                | Owner confirms verbally.                                                                                                           |
| `<<OWNER_NAME>>`             | Clinic owner's name as they want it shown (with title if applicable: د. / أ.).                                      | Written confirmation via WhatsApp screenshot or signed Clause 8.                                                                   |
| `<<ROLE_AR>>`                | "صاحب العيادة" / "المدير الطبي" / "مديرة العيادة".                                                                  | Owner picks the label.                                                                                                             |
| `<<N_PATIENTS>>`             | Exact integer of patients who returned AND attended within the 30-day window.                                       | Pilot weekly report final tally + clinic confirmation. Per `pilot-scoping.md` line 108 — this is the headline metric, NOT revenue. |
| `<<DAYS>>`                   | Actual elapsed days when the count was locked (usually 30; sometimes 28 or 33 — use the real number).               | Pilot end-date minus start-date.                                                                                                   |
| `<<N_BOOKED>>`               | Integer of patients who booked but may not have attended yet. Optional.                                             | Weekly report. Omit the line if equal to `<<N_PATIENTS>>`.                                                                         |
| `<<RESPONSE_RATE>>`          | Reply rate as integer percent. Optional.                                                                            | Weekly report. Omit if owner uncomfortable.                                                                                        |
| `<<AMOUNT>>`                 | Riyal figure the clinic actually paid (15% of recovered revenue, capped at 3,000 ر.س).                              | Final invoice.                                                                                                                     |
| `<<OWNER_DIRECT_CONTACT>>`   | A REAL channel the owner agreed to in writing — their WhatsApp Business number, personal email, or a Calendly link. | Clause 8 sign-off — owner must explicitly opt-in to direct buyer contact.                                                          |
| `<<FOUNDER_NAME>>`           | Founder's name as he wants it shown.                                                                                | Founder fills personally.                                                                                                          |
| `<<FOUNDER_DIRECT_CONTACT>>` | Founder's WhatsApp number (with country code) or personal email. NOT `info@`.                                       | Founder fills personally.                                                                                                          |
| `<<CLINIC_SLUG>>`            | URL-safe slug for the case study page (e.g., `riyadh-dental-co`).                                                   | Founder picks; should be obvious from clinic name.                                                                                 |

---

## Where each block ships

| Block                 | File                                            | Approx. line                                                              | What it replaces                             |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| 1 (testimonials body) | `src/components/landing/testimonials.tsx`       | 46–48 (eyebrow), 49–54 (H2), 78–95 (quote + CTA column), 108 (disclaimer) | Pre-launch placeholder content               |
| 2 (metric bar)        | `src/components/landing/metric-bar.tsx`         | 8–21 (`TRUST_POINTS` array)                                               | `TRUST_POINTS` placeholder triplet           |
| 3 (hero supporting)   | `src/components/landing/hero.tsx`               | 152–157 (the two `<p>` social-proof lines)                                | `TODO(brand)` ratio area                     |
| 4 (CTA trust line)    | `src/components/landing/cta.tsx`                | 170 (the single `<p>` trust line)                                         | `نحن في مرحلة الإطلاق التجريبي · لا عقود...` |
| 5 (case study page)   | `src/app/case-studies/<<CLINIC_SLUG>>/page.tsx` | new file                                                                  | n/a — new route                              |

---

## Copy guardrails (carry-forward)

- **No fabricated ratios.** If the number is 12, write `12`. Not "كثير من المرضى"، not "أغلب من رجعوا". Real integer or no integer.
- **STOP opt-out reference stays visible** in any case study message sample — buyer's #5 objection ("لو مريض اشتكى") needs the answer baked into the proof, not hidden in FAQ.
- **Founder-direct contact must be a REAL channel** he reads daily. The whole premise of Block 2 Card 3 collapses if buyer emails it and gets silence for 48 hours.
- **Owner-direct contact must be opt-in in writing.** Clause 8 of `pilot-agreement.md` covers the case study itself but does NOT automatically authorize "كلّم صاحب العيادة" — get a separate WhatsApp confirmation from the owner saying he's okay receiving cold calls/messages from prospects. Save the screenshot.
- **Honest disclaimer must appear in Block 1 and Block 5:** `تجربة واحدة، لا نعمّم النتائج.` This is both a buyer-trust signal and a PDPL-misrepresentation shield — saves us from a "you implied this works for everyone" complaint.
- **Khaleeji only.** No `يرغبون`، use `يبون`. No `لقد عاد`، use `رجع`. No `عملاؤنا الكرام`، use `عملاؤك`. If a sentence reads like a press release, rewrite it.
- **No "AI" / "ذكاء اصطناعي" buzzwords** in this block. The proof IS the result, not the technology. The buyer doesn't care how it works once a peer says it worked.
- **Numbers are bold, prose is plain.** In the JSX, wrap `<<N_PATIENTS>>` and `<<DAYS>>` in a `<strong>` or styled span — the eye lands on the integer first.
- **Don't add a logo of the pilot clinic** unless they specifically provide a high-res asset AND sign off on its use. A name in text is enough.
- **One quote, one clinic.** Resist the temptation to add "and N other clinics agree" until you have N other signed clinics. The strength of this block is its singular honesty.
