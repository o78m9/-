# اللائحة التنفيذية لنظام حماية البيانات الشخصية / PDPL Executive Regulations

**Country:** Kingdom of Saudi Arabia (KSA)
**Statute number:** SDAIA Resolution issuing Executive Regulations to PDPL, 2024
**Date of issuance:** September 2023 (final form); operative alongside PDPL grace period ending Sept 2024
**Date in force:** 14 September 2024 (effective enforcement)
**Regulator/Authority:** SDAIA — https://sdaia.gov.sa
**Aooda relevance:** HIGH — operationalises every PDPL obligation Aooda must implement; the law without the regs is non-operational.

## Official source

- **Primary URL:** https://sdaia.gov.sa/en/SDAIA/about/Pages/PersonalDataProtection.aspx
- **Source language:** Arabic + English
- **Source verified:** [CITED FROM MEMORY — VERIFY] WebFetch failed 2026-05-30.

## Summary (≤ 200 words)

The Executive Regulations operationalise the PDPL: they detail consent forms, sensitive data handling, the controller register, DPIA triggers, breach notification format and timing, data subject request workflows (30-day response window, free of charge for the first request), and the cross-border transfer risk assessment methodology. They replaced the prior National Data Bank registration with a record-of-processing-activities (ROPA) obligation, and clarified that processors must keep their own ROPA. A separate set of regulations governs cross-border transfers ("Regulation on Personal Data Transfer Outside the Kingdom") — including SDAIA's adequacy whitelist, binding common rules, and standard contractual clauses. Data Protection Officer (DPO) appointment is required for: large-scale sensitive processing, large-scale monitoring, or processing as a core activity.

## Articles relevant to Aooda

### Article on Consent (Executive Regs)

**Text (English summary):**

> Consent must be specific, informed, freely given, documented, and withdrawable. Pre-ticked boxes, bundled consents, and silence do not constitute consent. Consent records must be kept for the duration of processing plus retention period.

**Aooda impact:** Aooda's onboarding must capture proof-of-consent metadata per data subject (timestamp, channel, scope, version of privacy notice consented to).

**Compliance gap:** No consent ledger exists.

### Article on ROPA (Records of Processing Activity)

**Text (English summary):**

> Both controllers and processors must maintain a register of processing activities, including: purpose, categories of data subjects and personal data, recipients, cross-border transfers, retention periods, technical and organisational measures.

**Aooda impact:** Aooda as processor must maintain its own ROPA.

**Compliance gap:** No ROPA exists. Must be created before first KSA merchant goes live.

### Article on DPO

**Text (English summary):**

> A DPO is mandatory where the controller/processor's core activity involves: (i) large-scale processing of sensitive data, or (ii) regular and systematic monitoring of data subjects on a large scale, or (iii) processing by a public entity.

**Aooda impact:** Aooda's customer-base AI = systematic monitoring at scale → DPO likely required for KSA operations.

### Article on Cross-Border Transfer Risk Assessment

**Text (English summary):**

> Before any export of personal data, the controller must conduct a transfer risk assessment evaluating: nature of data, country of destination, recipient's safeguards, enforceable rights of data subjects. SDAIA publishes a list of adequate jurisdictions.

**Aooda impact:** Every Aooda merchant + every Aooda subprocessor (Vercel, Neon, Anthropic, OpenAI, etc.) needs a TRA.

## Penalties

Same as parent PDPL (SAR 5M admin, SAR 3M + 2yr criminal for sensitive data disclosure).

## Last updated

2026-05-30 by builder-agent (memory scaffold; needs verification).

---

**Honesty note:** Article-level structure in this file is `[CITED FROM MEMORY — VERIFY]`. The 2024 Executive Regulations should be read in Arabic by licensed counsel; English translations in circulation are unofficial.
