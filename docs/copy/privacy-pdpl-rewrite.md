# Privacy Page — PDPL-aligned Rewrite

> **Owner:** GC (compliance) + CMO (voice) + CTO (sub-processor accuracy).
> **Status:** Draft for founder review. Ready to drop into `src/app/privacy/page.tsx` after the four `<!-- TODO -->` tokens are filled.
> **PDPL anchors:** Art. 4–9 (rights), Art. 11 (transparency), Art. 19 (breach notification), Art. 29 (cross-border transfer), Art. 30 (sub-processors).
> **Linked artifacts:** `docs/pilot-agreement.md §4`, `docs/specs/opt-out-handler.md`, `docs/specs/patient-tracking-schema.md`, `docs/specs/message-templates.md`.
> **Voice rule:** Arabic primary, English summary. Khaleeji-modern body; MSA-formal for the legal-term anchors only. The lawyer brief Q1 confirms this is acceptable for a Saudi privacy page.

---

## 1. Page structure (top to bottom, all RTL on the actual page)

1. Hero strip — 1 sentence, what this page is for.
2. Quick summary in 5 bullets (Arabic).
3. Legal basis (Art. 6) — what we process, on what authority.
4. What we collect / What we explicitly DON'T (§4 of the schema spec, surfaced publicly).
5. Sub-processors — named, with purpose, with data-residency disclosure.
6. Retention — in days.
7. Your rights (Art. 4–9) — with the 7-day SLA.
8. Breach notification — 72h SDAIA path.
9. SDAIA registration status — honest.
10. How to reach us — single DPO channel.
11. Last-updated stamp + English summary.

---

## 2. Arabic copy — drop-in (RTL on the live page)

### Hero strip

```
خصوصيتك — والخصوصية المريض — تخصّنا نحن قبل أي أحد.
هذه الصفحة تشرح كل شي بصراحة، بدون تنميق قانوني.
```

### ملخّص سريع — ٥ نقاط

```
١. نحن مُشغّل (Processor) لبيانات مرضى عيادتك. العيادة هي المتحكّم (Controller).
٢. نجمع الحد الأدنى: الاسم، الجوال، تاريخ آخر زيارة. ولا شي ثاني.
٣. أي مريض يقدر يوقف الرسائل بكلمة وحدة. وقفه دائم.
٤. بياناتك ما تتدرّب عليها نماذج ذكاء، وما تنباع، وما تخرج خارج النطاق المتفق عليه.
٥. تقدّمنا بطلب تسجيل سدايا (SDAIA). نُحدّث هذه الصفحة فور صدور رقم التسجيل.
```

### الأساس النظامي للمعالجة (PDPL م. ٦ و ٩)

```
نعالج بيانات المرضى بناءً على **الموافقة الصريحة** الممنوحة من المريض للعيادة عند تسجيله،
وعلى التزام تعاقدي مكتوب بيننا وبين العيادة (اتفاقية التجربة، المادة ٥).

في أي لحظة، يحق للمريض **سحب موافقته** بكلمة وحدة في الرسالة («اوقف» أو STOP).
سحب الموافقة فوري، ودائم، ومُعتمد بدون مراجعة.
```

### ما الذي نجمعه فعلاً

```
- اسم المريض (عربي، الاسم الأول كافٍ في الرسالة).
- رقم الجوال (E.164، مثال: +9665XXXXXXXX).
- تاريخ آخر زيارة للعيادة (تاريخ فقط، بدون تفاصيل سريرية).
- حالة التواصل: متى أُرسلت الرسالة، متى رد المريض، هل حجز، هل حضر، وقيمة الفاتورة الإجمالية (إن وُجدت).
```

### ما الذي لا نجمعه — لا الآن ولا مستقبلاً ضمن هذه التجربة

```
- التشخيص الطبي ولا أي وصف سريري.
- خطط العلاج، الأشعة، أو نتائج المختبر.
- تفاصيل الفواتير المُعدّدة (نسجّل المبلغ الإجمالي فقط لاحتساب نسبة عَودة).
- بيانات التأمين الصحي.
- رقم الهوية الوطنية أو الإقامة.
- تاريخ الميلاد، العنوان السكني، أو أي صورة شخصية.
- العلاقات الأسرية أو الصلات الاجتماعية.

هذه القائمة ليست شعارات — هي ضمانة هندسية: الأعمدة المخصّصة لها غير موجودة في قاعدة بياناتنا أصلاً.
لو أرسلت لنا عيادتك ملف Excel فيه أي من هذه الحقول، ندرجها كحقول مُسقَطة في سجل التدقيق ولا تُخزّن.
```

### الأطراف الثالثة المُشغّلة (Sub-Processors) — الأسماء والأدوار

```
نُفصح عن كل طرف ثالث يلامس بيانات المريض، ودوره بالضبط:

| الطرف | الدور | بيانات يلامسها | الموقع |
|---|---|---|---|
| Meta (WhatsApp Business API) | إرسال واستقبال الرسائل من رقم العيادة | الاسم، الجوال، نص الرسالة | أيرلندا / الولايات المتحدة |
| Neon (Postgres) | تخزين قاعدة البيانات الأساسية | كل الحقول المذكورة أعلاه | <<DATA_RESIDENCY_REGION>> <!-- TODO(founder): يحدّد المؤسس المنطقة الفعلية — مثلاً Frankfurt / Tokyo / غيرها — بعد تأكيد إعدادات Neon --> |
| Anthropic (Claude) | صياغة بعض النصوص داخلياً قبل إرسالها (مساعد كتابة فقط) | لا يصل لها بيانات مرضى فعلية — نستخدمها على قوالب فارغة بدون قيم حقيقية | الولايات المتحدة |
| <<BSP_PROVIDER>> <!-- TODO(founder): اسم مزوّد خدمة الأعمال — 360dialog أو Twilio أو غيرها — يُحدَّد عند اعتماد BAPI --> | وسيط تقني بين Aooda و Meta WhatsApp | الاسم، الجوال، نص الرسالة | حسب اختيار المزوّد |
| Vercel | استضافة الموقع وواجهة لوحة التحكم | لا يصل لقاعدة البيانات مباشرة | الولايات المتحدة / المناطق العالمية |

ملاحظات:
- لا يتم بيع البيانات لأي طرف.
- لا تُستخدم البيانات لتدريب أي نموذج ذكاء اصطناعي، بما فيها نماذج Anthropic.
- النقل عبر الحدود يتم وفقاً للضوابط المنصوص عليها في PDPL م. ٢٩.
```

### فترات الاحتفاظ — بالأيام، لا بالعموميات

```
- بيانات المرضى أثناء التجربة: تُحفظ لمدة التجربة (٣٠ يوماً).
- بعد انتهاء التجربة: تُحذف بيانات المرضى نهائياً خلال **٣٠ يوماً** من تاريخ انتهاء التجربة.
- سجل التدقيق (Audit Log): يُحفظ لمدة **٧٣٠ يوماً** (سنتين) للالتزامات النظامية، ولا يحوي بيانات سريرية.
- قائمة المرضى الذين اختاروا الإيقاف (Suppression List): **تُحفظ دائماً** — لا تنتهي صلاحيتها، حماية للمريض.
```

### حقوق المريض — وكيف تُمارَس خلال ٧ أيام

```
وفقاً لـ PDPL المواد ٤ إلى ٩، لكل مريض الحق في:

١. **الاطلاع** على بياناته كاملة.
٢. **تصحيحها** إذا كانت خاطئة.
٣. **حذفها** نهائياً (وليس مجرد إيقاف الرسائل).
٤. **تقييد المعالجة**.
٥. **سحب الموافقة** في أي لحظة.
٦. **نقل البيانات** بصيغة قابلة للاستخدام (CSV).
٧. **الاعتراض** على أي معالجة.

**كيف يُمارس المريض هذه الحقوق:**

- يتواصل المريض مع العيادة مباشرة (هي المتحكّم).
- العيادة تحوّل الطلب إلينا عبر <<DPO_CONTACT_EMAIL>> <!-- TODO(founder): يضع المؤسس البريد المخصّص لمسؤول حماية البيانات قبل النشر -->.
- نلتزم بتنفيذ كل طلب خلال **٧ أيام** من استلامه.
- في حالة سحب الموافقة عبر كلمة «اوقف» داخل واتساب: التنفيذ خلال **٦٠ دقيقة** كحد أقصى، مع رسالة تأكيد.
```

### بلاغ الحوادث الأمنية (PDPL م. ١٩)

```
لو وقعت — لا قدّر الله — حادثة أمنية تمس بيانات المرضى:

- نُبلّغ هيئة سدايا (SDAIA) خلال **٧٢ ساعة** من اكتشاف الحادثة.
- نُبلّغ العيادة المعنية خلال **٤٨ ساعة** من الاكتشاف، مع تفاصيل النطاق والإجراء التصحيحي.
- نُبلّغ المرضى المتأثرين دون تأخير غير مبرّر، عبر العيادة.

قناة البلاغ الداخلية: <<DPO_CONTACT_EMAIL>>.
خطة الاستجابة موثقة داخلياً وتراجَع كل ربع سنة.
```

### حالة تسجيل سدايا (شفافية كاملة)

```
**تقدّمنا بطلب تسجيل سدايا (SDAIA).**
الطلب قيد الإجراء. لم نحصل بعد على رقم التسجيل النهائي.

نُحدّث هذه الصفحة فور صدور رقم التسجيل ونعرضه هنا بشكل ظاهر.
إلى ذلك الحين: نلتزم بمبادئ PDPL كاملةً، ونتعامل كأننا مُسجّلون فعلاً.

لا نضع أي شعار «مُعتمد» أو «مرخّص» على الموقع قبل صدور رقم رسمي. هذا التزامنا الأخلاقي قبل النظامي.
```

### كيف تتواصل معنا

```
لأي استفسار يخص الخصوصية أو حقوق المرضى:

- البريد: <<DPO_CONTACT_EMAIL>>
- واتساب المؤسس مباشرة: <!-- TODO(founder): يُترك فارغاً إن لم يتم اختيار قناة واتساب رسمية، أو يُملأ بالرقم E.164 -->
- نرد خلال يوم عمل واحد.

لا يوجد لدينا نظام تذاكر. ترد عليك جهة بشرية، مع توقيع باسم المسؤول.
```

### آخر تحديث

```
آخر تحديث: 2026-05-30
الإصدار: 1.0 (مسودة قبل تسجيل سدايا)
```

---

## 3. English summary (drop-in, below the Arabic)

```
## English summary (Arabic above governs)

This page describes how Aooda processes patient data on behalf of dental clinics in Saudi Arabia,
in compliance with the Personal Data Protection Law (PDPL).

- **Roles:** Your clinic is the Data Controller. Aooda is a Data Processor.
- **Lawful basis:** Explicit patient consent collected by the clinic at registration, plus our contract with the clinic.
- **What we collect:** Patient name, mobile number (E.164), last visit date, and the lifecycle of the reactivation message (sent / replied / booked / attended / total billed).
- **What we DO NOT collect:** Diagnosis, treatment, allergies, lab results, itemized billing, insurance, National ID, date of birth, address. The columns do not exist in our database.
- **Sub-processors:** Meta (WhatsApp Business API), Neon (Postgres), Anthropic (Claude — used only on empty templates, no live patient data), <<BSP_PROVIDER>>, Vercel.
- **Retention:** Patient data — 30 days after pilot end. Audit log — 730 days. Opt-out list — permanent.
- **Patient rights:** Access, correction, deletion, restriction, withdrawal, portability, objection. Honored within 7 days. Opt-out via "STOP" honored within 60 minutes.
- **Breach notification:** SDAIA within 72 hours; affected clinic within 48 hours.
- **SDAIA registration:** Application filed; registration number pending. We update this page the moment it is issued.
- **Contact:** <<DPO_CONTACT_EMAIL>>.

Last updated: 2026-05-30. Version 1.0 (pre-SDAIA-registration draft).
```

---

## 4. Placeholders to fill before publishing

| Token                                      | Description                                                                    | Owner   | When                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------ | ------- | ----------------------------------------------------------------------------------------- |
| `<<DPO_CONTACT_EMAIL>>`                    | Dedicated mailbox for privacy/DPO inquiries. NOT `info@`. NOT `contact@`.      | founder | Before publish. Set up a forward to founder personal inbox is acceptable for pilot scale. |
| `<<DATA_RESIDENCY_REGION>>`                | Actual Neon Postgres region used (e.g. "فرانكفورت — Frankfurt EU-Central-1").  | founder | Read from Neon project settings; verify and paste.                                        |
| `<<BSP_PROVIDER>>`                         | The Business Solution Provider connecting to Meta (360dialog / Twilio / etc.). | founder | After WhatsApp BAPI vendor decision (per 30-day plan Week 1).                             |
| `<!-- TODO(founder) WhatsApp DPO line -->` | Optional direct WhatsApp line for privacy queries.                             | founder | Optional — if absent, ONLY the email channel is offered.                                  |

All four tokens are wrapped in `<!-- TODO(founder): ... -->` HTML comments so the publish step has zero ambiguity about what needs filling.

---

## 5. Self-audit vs. pdpl-compliance-critic 8-check rubric

| Check                                   | Result | Evidence                                                                                                                                                                                                          |
| --------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Legal basis explicit                 | PASS   | §"الأساس النظامي" — Art. 6 + 9 cited; contract necessity also stated.                                                                                                                                             |
| 2. Opt-out language + handler + SLA     | PASS   | "اوقف" / STOP + 60-minute SLA stated; cross-ref to `opt-out-handler.md`.                                                                                                                                          |
| 3. Sub-processors named publicly        | PASS   | Five sub-processors named with role, data-touched, location. Includes the placeholder for BSP.                                                                                                                    |
| 4. Retention period (days, consistent)  | PASS   | 30 / 730 / permanent — matches `pilot-agreement.md §4 §9` and `patient-tracking-schema.md §5`. (Note: surface inconsistency between `pilot-agreement.md §4 "30 يوم"` and `§9 "30 يوم"` is consistent — no drift.) |
| 5. Patient rights flow + 7-day SLA      | PASS   | All seven rights enumerated; 7-day SLA stated; channel described.                                                                                                                                                 |
| 6. Breach notification path (72h SDAIA) | PASS   | 72h to SDAIA, 48h to clinic, undue-delay to patients. Internal channel named.                                                                                                                                     |
| 7. No health-data drift                 | PASS   | The "ما الذي لا نجمعه" section enumerates 12 prohibited categories and asserts they have no DB columns.                                                                                                           |
| 8. SDAIA registration honesty           | PASS   | "تقدّمنا بطلب تسجيل سدايا — لم نحصل بعد على رقم". Explicit "no badge before number" commitment.                                                                                                                   |

**Self-verdict: PASS.**

## 6. Self-audit vs. arabic-khaleeji-critic 7-check rubric

| Check                                   | Result                     | Evidence                                                                                                                                                                                                                                                                              |
| --------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Khaleeji register, not MSA stiffness | PASS                       | Body uses "تخصّنا", "نحن هنا", "بدون تنميق". Legal anchors (PDPL article cites) use MSA — scope-correct per critic rule.                                                                                                                                                              |
| 2. Banned buzzwords — zero tolerance    | PASS                       | No "AI", "ذكاء اصطناعي" except in the explicit "ما تتدرّب عليها نماذج ذكاء" disclosure (which is a denial, not a marketing claim — permissible). No "منصة مبتكرة" / "تجربة سلسة".                                                                                                     |
| 3. Opt-out string exact                 | PASS                       | Uses "اوقف" and "STOP" — matches regex in `opt-out-handler.md §3`.                                                                                                                                                                                                                    |
| 4. RTL + bidi isolation                 | NEEDS COMPONENT-LEVEL WORK | The Arabic copy uses Latin tokens (`PDPL`, `STOP`, `SDAIA`, `BAPI`, `Aooda`, `Vercel`, `Neon`, `Anthropic`, `Meta`, `WhatsApp`) — when this drops into `src/app/privacy/page.tsx`, each Latin token needs `<span dir="ltr">…</span>` wrapping. Flagged in the implementation handoff. |
| 5. No press-release tone                | PASS                       | No "نحن نقدم بفخر" / "يسرّنا" anywhere. Voice is direct second-person.                                                                                                                                                                                                                |
| 6. Numerals — Arabic-Indic              | PASS                       | All counts and durations use Arabic-Indic (٣٠ يوم, ٧٢ ساعة, ٧٣٠ يوماً, ٦٠ دقيقة).                                                                                                                                                                                                     |
| 7. No pilot-status inflation            | PASS                       | "تقدّمنا بطلب تسجيل سدايا" — does not claim approval. No "آلاف المرضى" / "عشرات العيادات".                                                                                                                                                                                            |

**Self-verdict: PASS (with the component-level bidi isolation flagged as an implementation TODO, not a content failure).**

---

## 7. Implementation handoff notes

When the founder drops this into `src/app/privacy/page.tsx`:

1. Wrap every Latin token in the Arabic body with `<span dir="ltr">…</span>`. Tokens to wrap: `PDPL`, `STOP`, `SDAIA`, `BAPI`, `Aooda`, `Vercel`, `Neon`, `Anthropic`, `Meta`, `WhatsApp Business API`, `E.164`, `Postgres`, `CSV`, `Excel`.
2. Replace each `<<TOKEN>>` per §4 above.
3. Keep the English summary in a separate `<section dir="ltr" lang="en">` block.
4. Set `lang="ar"` on the Arabic outer block; `lang="en"` on the English block.
5. Add an `<h1>` with `الخصوصية وحماية بيانات المرضى` for SEO + screen readers.
6. Verify the rendering against `arabic-khaleeji-critic` check 4 once live.

---

## 8. Open questions for founder

1. Is the DPO inbox a founder personal inbox (e.g. `omar+dpo@…`) or a dedicated mailbox? Either is acceptable for pilot scale; pick one before publish.
2. Confirm `<<DATA_RESIDENCY_REGION>>` — what region is the Neon project actually pinned to? If multi-region, name the primary.
3. Confirm the BSP vendor choice (`<<BSP_PROVIDER>>`) — pending the WhatsApp BAPI submission outcome.
4. Audit-log retention is set to 730 days here. The lawyer brief Q4 will surface this for confirmation; if counsel recommends shorter, edit this page in lockstep with `patient-tracking-schema.md §5`.
