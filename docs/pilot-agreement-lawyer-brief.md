# Pilot Agreement — Brief for Saudi-Licensed Counsel

> **Owner:** GC (founder hat) → Saudi-licensed lawyer.
> **Purpose:** Get the `docs/pilot-agreement.md` v1.0 cleaned in ONE 60–90 minute paid consult.
> **Engagement budget:** ~1,500 SAR. Confirm with counsel before booking.
> **Bring to the meeting:** printed copy of `pilot-agreement.md` (the current annotated draft, with `<!-- TODO(legal-clarity) -->` comments highlighted), this brief, the founder's CR / business documents, the buyer-side PDPL summary from `docs/copy/privacy-pdpl-rewrite.md`.

---

## Cover sheet — Arabic + English

### عربي

```
هذا العقد هو:
- اتفاقية تجربة (Pilot) لمدة ٣٠ يوماً بين شركة عَودة وعيادة أسنان في الرياض.
- صفحة واحدة، وملحق واحد (لائحة معالجة البيانات).
- بهيكل تسعير: صفر مقدماً + ١٥٪ من الإيراد المسترجع + سقف ٣,٠٠٠ ر.س.

هذا العقد ليس:
- عقد ترخيص دائم.
- عقد خدمات احترافية (consulting).
- ضمان نتائج لعدد محدد من المرضى العائدين.
- موافقة على نشر اسم العيادة بدون توقيع لاحق منفصل (المادة ٨).
- بديل عن DPA منفصل لاحقاً عند الانتقال للحجم الكامل.

المطلوب من المستشار:
- مراجعة سريعة، ٦ أسئلة محددة (أدناه)، وردود قانونية تطبيقية.
- ليست مراجعة كاملة معمّقة — هذه مسودة عمل، نحتاجها قابلة للتوقيع في غضون أسبوع.
- توقيتنا: نريد العقد جاهز للطباعة قبل ٢٠٢٦-٠٦-١٢ (نهاية الأسبوع الثاني من الخطة).
```

### English

```
This contract IS:
- A 30-day pilot agreement between Aooda and a single Riyadh dental clinic.
- One page plus one annex (data-processing schedule).
- Pricing: zero upfront + 15% of recovered revenue + 3,000 SAR cap.

This contract is NOT:
- A perpetual license.
- A professional-services consulting engagement.
- A guarantee of any specific number of returned patients.
- Consent to publish the clinic's name without a separate later signature (clause 8).
- A substitute for a full DPA at scale (we'll draft one when post-pilot volumes warrant).

What we need from counsel:
- A quick review, focused answers to the 6 specific questions below, application-grade redlines.
- NOT a full legal-opinion deep review — this is a working draft we need signable within a week.
- Timeline: contract print-ready by 2026-06-12 (end of Week 2 of the founder's 30-day plan).
```

---

## The 6 questions for counsel (≤ 60–90 min session target)

Each question maps to one or more `<!-- TODO(legal-clarity) -->` annotations now inline in `docs/pilot-agreement.md`. Counsel can read the inline annotation for full context.

### Question 1 — Jurisdiction + dispute path

**The clause (§10):**

> "تخضع هذه الاتفاقية لأنظمة المملكة العربية السعودية. في حال وجود نزاع، يحاول الطرفان حله ودياً خلال 30 يوماً. إن تعذّر، يُحال النزاع إلى المحكمة التجارية بمدينة الرياض."

**Why it matters:** Saudi commercial code default vs. explicit. Silence on the specific applicable laws may leave ambiguity. The clinic could argue dispute belongs in their local commercial chamber if their place of registration differs.

**Proposed default if we are uncertain:** Add "حصراً" (exclusively) before "المحكمة التجارية بالرياض"; enumerate applicable laws (PDPL, نظام التجارة الإلكترونية, نظام الشركات).

**Specifically ask counsel:**

- Is "أنظمة المملكة" sufficient, or should we list specific laws?
- Should we add an exclusive-jurisdiction clause?
- For a contract of this small value (≤3,000 SAR), is SCCA arbitration or CRCICA faster/cheaper than court for either party?
- If the clinic is registered outside Riyadh (e.g. Jeddah), does this clause still hold?

---

### Question 2 — Indemnification scope ("نتحمّله نحن مباشرةً")

**The clause (§6):**

> "شكوى تتعلق بخلل تقني في الإرسال أو تسريب بيانات من جانب المنصة → مسؤولية عَودة."

**Why it matters:** This is a near-unbounded indemnity. A single CITC complaint that escalates could expose Aooda to fines far exceeding the 3,000 SAR contract value. Saudi PDPL fines can reach 5M SAR per violation (Art. 35–36). A solo-founder bootstrap cannot absorb that.

**Proposed default if we are uncertain:** Cap indemnification at a multiple of contract value (e.g. 3× or 5×). Carve out gross negligence (uncapped) vs. ordinary fault (capped). Add a "subject to applicable law" clause so we don't waive consumer-protection rights.

**Specifically ask counsel:**

- Under Saudi law, can an indemnity clause cap liability at a multiple of the contract value? Is this enforceable against a clinic counterparty?
- Are there mandatory-rule exceptions (e.g. data subject rights, willful misconduct) that survive any cap?
- Should the clause explicitly mention insurance — do we need errors-and-omissions coverage before pilot 1?

---

### Question 3 — Publication rights (§8 — "حق النشر بعد التجربة")

**The clause (§8):**

> "بشرط الموافقة الكتابية الصريحة من العيادة بعد انتهاء التجربة، يحق لعَودة نشر: اسم العيادة، عدد المرضى المُسترجعين، نسبة النمو، اقتباس قصير..."

**Why it matters:** "نسبة النمو" is undefined. The clinic could argue any published number misrepresents their true business — opening a defamation / commercial-disparagement path.

**Proposed default if we are uncertain:** Replace "نسبة النمو" with an explicit enumeration: (a) count of returned patients, (b) reply rate, (c) opt-out rate. No revenue, no percentage of total clinic revenue, no comparisons to "before" baselines. Add: clinic has 7-day pre-publication review with redline rights.

**Specifically ask counsel:**

- Is the post-publication withdrawal right (current §8 ¶3, "وتلتزم عَودة بإزالة المحتوى خلال 7 أيام") enforceable as a hard takedown obligation?
- Are there clauses we should add to prevent the clinic later claiming we misrepresented their data, after they signed off?
- For social-media publication (LinkedIn, WhatsApp Status — not the website), is the same consent scope sufficient, or do we need a separate channel-by-channel consent?

---

### Question 4 — Data controller / processor split (§4 + roles + retention)

**The clauses (§4 + Annex A + the cover-page role line — currently mis-labeled per inline TODO):**

> "العيادة هي المُعالِج (Data Controller). عَودة مُشغّل (Data Processor) فقط..."

**Why it matters:** The Arabic terms are mismatched (المُعالِج literally means "processor", not "controller"). PDPL article terminology drift here would fail an audit. Also: §4's 30-day retention vs. §9's 30-day deletion vs. `docs/specs/patient-tracking-schema.md §5`'s audit-log 730-day retention — verify the three are reconcilable for a regulator.

**Proposed default if we are uncertain:** Use SDAIA's official Arabic terminology: "صاحب البيانات" (data subject), "متحكّم" (controller), "معالج" (processor). State retention in three explicit lines: (a) live patient data — 30 days after pilot end → hard delete, (b) audit log of system events — 730 days, (c) opt-out / suppression list — permanent.

**Specifically ask counsel:**

- Confirm correct Arabic legal terms per SDAIA's published guidance / executive regulations.
- Is the 30-day live + 730-day audit + permanent suppression structure defensible? Is 730 days an appropriate minimum for Saudi commercial record-keeping rules?
- Should the contract require the clinic to provide written DPO contact, or is a single contact email sufficient at pilot scale?

---

### Question 5 — Patient consent verification (§5)

**The clause (§5 ¶1):**

> "العيادة مسؤولة عن التأكد من أن كل مريض في القائمة قد وافق سابقاً على استقبال رسائل تواصل من العيادة (موافقة عامة عند التسجيل تكفي)."

**Why it matters:** "Moافقة عامة عند التسجيل تكفي" places the legal weight entirely on the clinic and assumes a registration-time consent extends to outbound marketing reactivation messages. Under PDPL Art. 7, consent for one processing purpose may NOT automatically extend to a materially different one. If a patient complains, the clinic AND Aooda could be exposed.

**Proposed default if we are uncertain:** Add an attestation paragraph the clinic owner signs separately: "أُقرّ بأن كل المرضى في القائمة المرفقة قد منحوا موافقة صريحة ومحدّدة على استقبال رسائل تواصل غير طبية من العيادة، وأتحمّل المسؤولية القانونية عن هذا الإقرار." Require the clinic to retain proof of consent at their end (registration form scan, signed consent line in PMS, etc.).

**Specifically ask counsel:**

- Under PDPL Art. 7, does a generic "consent to clinic contact" granted at registration legally cover later reactivation messages?
- If not, what minimum form of separate / refreshed consent satisfies PDPL while remaining practical for a clinic that has 1,400 patient records and cannot get them to re-sign?
- Does the clinic-side attestation in this contract sufficiently insulate Aooda from a direct PDPL inquiry, or does Aooda also need its own due-diligence step?

---

### Question 6 — Termination + data deletion path (§9)

**The clauses (§9 + Annex A "الحذف عند الإنهاء"):**

> "تُحذف جميع بيانات المرضى من أنظمتها خلال 30 يوماً كحد أقصى."

> Annex A: "تُقدَّم العيادة شهادة حذف موقّعة من عَودة خلال 30 يوماً من تاريخ الإنهاء."

**Why it matters:** Three internal inconsistencies (`docs/pilot-scoping.md` mentions 48h; `pilot-agreement.md §9` mentions 30 days; the patient-tracking schema and privacy rewrite reconcile to 30 days). Counsel needs to confirm 30 days is defensible AND that the deletion certificate language is meaningful (i.e. can be audit-tested).

**Proposed default if we are uncertain:** Tighten to: 48 hours to stop all sending (immediate), 7 days to provide CSV export + intermediate report, 30 days to complete hard-delete and issue signed certificate. State that audit-log records of the deletion ITSELF are retained 730 days (the deletion event must be auditable; the underlying patient data is gone).

**Specifically ask counsel:**

- Is 30 days an acceptable maximum for hard-delete after termination, or do PDPL / SDAIA guidance require shorter (e.g. without undue delay / 30 days max from request)?
- What language makes a "deletion certificate" legally meaningful — should it cite specific PDPL articles, name the systems verified, and be signed by a named individual?
- If the clinic later sues for incomplete deletion, what evidence chain protects Aooda?

---

## Logistics for the counsel engagement

| Item                       | Detail                                                                                                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format                     | 60–90 min remote video, OR 60 min in-person if available in Riyadh.                                                                                                    |
| Cost expectation           | 1,500 SAR for the session. If counsel quotes >2,500 SAR, get a 2nd quote first.                                                                                        |
| Deliverable from counsel   | Marked-up PDF of `pilot-agreement.md` with redlines + a 1-page memo with answers to the 6 questions above.                                                             |
| Founder follow-up          | Incorporate redlines into v1.0 within 24h of receipt; print 5 copies for first 5 in-person meetings (Week 3).                                                          |
| What we are NOT asking for | A full PDPL compliance audit. A SDAIA filing review (we already filed). A trademark / IP review (out of scope). A draft of a separate DPA for scale (post-pilot work). |
| Confidentiality            | Counsel signs a 1-page NDA before receiving any clinic identifying info. The clinic name redacted from the brief copy sent to counsel.                                 |

---

## Timeline

- **2026-06-01** (Mon, Week 1 Day 3): email lawyer + offer slots in Week 2.
- **2026-06-08–06-11** (Mon–Thu, Week 2): consult session. Bring this brief + printed agreement.
- **2026-06-11 EOD** (Thu): receive marked-up draft + 1-page memo.
- **2026-06-12 EOD** (Fri rest-day — only consume content): mentally process.
- **2026-06-13** (Sat, Week 3 Day 1): incorporate redlines → v1.0 print-ready.
- **2026-06-14 onward** (Sun, Week 3): first in-person clinic visits with v1.0 in hand.

---

## Self-audit vs. legal-clarity-critic 8-check rubric

This brief itself is the artifact the critic would evaluate. Applying the rubric to `pilot-agreement.md` AS-OF the inline `<!-- TODO(legal-clarity) -->` annotations made tonight:

| Check                                      | Result                             | Note                                                                                                      |
| ------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1. TODOs labeled & bracketed               | PASS                               | Every founder-fill is `<!-- TODO: ... -->`; every legal ambiguity is `<!-- TODO(legal-clarity): ... -->`. |
| 2. Parties named consistently              | PARTIAL → counsel Q4               | "المُعالِج"/"المُشغّل" labels reversed; Q4 fixes this.                                                    |
| 3. Jurisdiction + dispute path             | PARTIAL → counsel Q1               | Present but underspecified; Q1 fixes this.                                                                |
| 4. No inadvertent warranties               | PASS                               | No "guaranteed" / "ensures" / "100%" in the contract body.                                                |
| 5. Term + termination + data fate          | PARTIAL → counsel Q6               | Present, three internal-inconsistency points; Q6 fixes this.                                              |
| 6. Compensation unambiguous                | PARTIAL → counsel Q2 + inline TODO | "الإيراد المسترجع" definition needs sharpening; inline TODO added.                                        |
| 7. Confidentiality + publication symmetric | PARTIAL → counsel Q3               | Pre-publication consent right per §8 is symmetric; "نسبة النمو" wording too loose; Q3 fixes.              |
| 8. Founder-readable ≤10 min                | PASS                               | 10 clauses, ≤ 1 page main + 1 annex; ≤ 600 words on main.                                                 |

**Verdict on `pilot-agreement.md` BEFORE counsel session:** PARTIAL — 4 of 8 checks need the lawyer's specific input.

**Verdict on `pilot-agreement.md` AFTER counsel redlines incorporated:** Targeted to be READY-FOR-LAWYER → READY-FOR-PILOT.

---

## Open questions for founder (BEFORE booking counsel)

1. **Has counsel been identified?** Recommendation: ask any Saudi founder you know for a 1-line referral. Alternatively: SCBL (Saudi Bar) or the Riyadh Chamber of Commerce legal panel.
2. **Will the consult be billed by the hour or as a fixed package?** Fixed package preferred — ask for that quote first.
3. **Insurance** — does the founder personally hold an errors-and-omissions / professional indemnity policy? If not, this is the kind of question Q2 surfaces and the answer might be "yes, buy one before signing the first pilot." Budget impact: ~2,000–4,000 SAR/year, deferable until first signed clinic.
4. **Confidentiality on counsel side** — the brief assumes counsel signs an NDA. If the relationship is via a referral and trust is established, the founder may waive the NDA in exchange for faster response. Decide before sending.
