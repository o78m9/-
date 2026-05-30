# Aooda Legal Library — Master Index

## إخلاء مسؤولية / Disclaimer

**عربي:** هذه المكتبة مرجع أولي. النصوص القانونية الواردة في الملفات لم يقم بقراءتها محامٍ بشري بشكل شخصي. الامتثال الحقيقي يتطلب مراجعة من مستشار قانوني مرخّص للنص الرسمي في الجريدة الرسمية لكل ولاية قضائية. لا يُعتمد على هذه المكتبة كرأي قانوني.

**English:** This library is a STARTING reference for Aooda country agents. Article text in these files has NOT been personally read by a human lawyer. Real compliance requires licensed counsel review of the actual official gazette text in each jurisdiction. Do not rely on this library as legal opinion or as the sole source for any merchant-facing commitment.

---

## Country libraries

| Country   | Statute count | Owner agent        | Index                                  | Last refresh |
| --------- | ------------- | ------------------ | -------------------------------------- | ------------ |
| KSA       | 5             | masoud-saudi-legal | [ksa/INDEX.md](./ksa/INDEX.md)         | 2026-05-30   |
| UAE       | 5             | khaled-uae-legal   | [uae/INDEX.md](./uae/INDEX.md)         | 2026-05-30   |
| Kuwait    | 3             | fahad-kuwait-legal | [kuwait/INDEX.md](./kuwait/INDEX.md)   | 2026-05-30   |
| Qatar     | 4             | jassim-qatar-legal | [qatar/INDEX.md](./qatar/INDEX.md)     | 2026-05-30   |
| Bahrain   | 3             | isa-bahrain-legal  | [bahrain/INDEX.md](./bahrain/INDEX.md) | 2026-05-30   |
| Oman      | 4             | saeed-oman-legal   | [oman/INDEX.md](./oman/INDEX.md)       | 2026-05-30   |
| Jordan    | 3             | samer-jordan-legal | [jordan/INDEX.md](./jordan/INDEX.md)   | 2026-05-30   |
| **Total** | **27**        | —                  | —                                      | —            |

## Cross-jurisdiction themes

### Consent + opt-out (direct marketing)

Every jurisdiction in this library treats prior consent + an opt-out mechanism in every commercial message as mandatory. Aooda's product must enforce:

1. Opt-in proof captured per data subject (timestamp, channel, scope).
2. Opt-out keyword / link in every outbound message.
3. Cross-channel opt-out propagation within ≤ 24 hours.
4. Persistent opt-out memory across campaigns and merchants.

### Cross-border data transfer

Every jurisdiction restricts cross-border flow of personal data (especially sensitive). Aooda's current stack (Vercel + Neon + Anthropic + OpenAI) flows data outside every Arab jurisdiction listed. Every merchant onboarding requires either (a) data-residency-in-jurisdiction OR (b) papered transfer mechanism (adequacy, SCCs/BCRs, derogations).

### Breach notification

KSA, UAE-mainland (pending regs), UAE-DIFC, UAE-ADGM, Qatar, Bahrain, Oman, Jordan all expect a 72-hour controller-to-regulator window. Aooda as processor must notify the merchant within ≤ 24 hours of detection.

### DPO appointment

KSA, UAE-DIFC, UAE-ADGM, Qatar-QFC, Oman, Jordan trigger DPO on: large-scale sensitive processing OR systematic monitoring. Aooda's product = systematic monitoring → DPO likely required wherever Aooda is the controller.

## WebFetch attempt log (2026-05-30)

| URL                                                | Status                                          | Extracted Y/N |
| -------------------------------------------------- | ----------------------------------------------- | ------------- |
| sdaia.gov.sa/...PersonalDataEnglish.pdf            | Socket closed                                   | N             |
| u.ae/...data-protection-laws                       | ECONNREFUSED                                    | N             |
| citra.gov.kw/...data_privacy_protection_regulation | 404                                             | N             |
| ncsa.gov.qa/en/legislation                         | Empty content                                   | N             |
| pdpa.bh                                            | ECONNREFUSED                                    | N             |
| mtcit.gov.om/...NID=339                            | Redirect → prod.mtcit, then generic portal page | N             |
| pm.gov.jo                                          | Wrong content (homepage)                        | N             |
| difc.ae/...law-no-5-2020                           | 403                                             | N             |
| laws.boe.gov.sa/...                                | ECONNREFUSED                                    | N             |
| prod.mtcit.gov.om/...                              | Generic portal                                  | N             |
| lob.gov.jo                                         | 404                                             | N             |
| sdaia.gov.sa/...PersonalDataProtection.aspx        | Socket closed                                   | N             |
| adgm.com/...data-protection-regulations-2021       | 404                                             | N             |
| tdra.gov.ae/...regulatory-policies-frameworks      | ECONNREFUSED                                    | N             |

**Verbatim statute text was NOT successfully fetched for any URL.** Every law file in this library is `[CITED FROM MEMORY — VERIFY]`. The honest scaffold value is structural: each agent now has a per-jurisdiction file path and template to populate with verified verbatim text in the next pass.

## Honest verdict on load-bearing

This library is **scaffolding, not load-bearing.** It gives country agents a navigable map of statutes, articles, regulators, and Aooda-relevant themes. It does NOT carry verified verbatim article text. Before any merchant signs, before any privacy notice goes public, and before any country agent opines on compliance:

1. WebFetch must be retried (or replaced with manual fetch / counsel-supplied gazette text).
2. Licensed local counsel in each jurisdiction must review the actual statutes for currency.
3. Each law file's `[CITED FROM MEMORY — VERIFY]` markers must be cleared file-by-file.

## Next-pass priorities

1. KSA PDPL Executive Regulations (2024) — verbatim verification urgent (cross-border regime materially changed; memory may be stale).
2. UAE Federal PDPL Executive Regulations — still pending publicly; track and add when issued.
3. Jordan PDPL implementing regulations — track 2024-2025 issuance.
4. Oman PDPL Executive Regulations (34/2024) — verify verbatim.
5. Sectoral health regulations across all 7 jurisdictions — not yet in library; add when Aooda enters health vertical.

## Last updated

2026-05-30 by builder-agent.
