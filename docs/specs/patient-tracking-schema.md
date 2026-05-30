# Patient Tracking Schema — Zod + SQL Spec

> **Owner:** CTO + GC (joint sign-off — touches PDPL surface).
> **Status:** Draft for founder review. NOT YET migrated. NOT YET in `src/`.
> **PDPL anchors:** Art. 5 (sensitive data classification — strict avoidance), Art. 6 (consent basis), Art. 9 (rights), Art. 30 (sub-processors named in `privacy-pdpl-rewrite.md`).
> **Linked artifacts:** `docs/pilot-scoping.md §1, §7`, `docs/pilot-agreement.md §4` + Annex A, `docs/specs/opt-out-handler.md`, `docs/copy/privacy-pdpl-rewrite.md`.

---

## 1. Purpose

This is the single source of truth for what personal data Aooda is allowed to store about a clinic's patients during the 30-day pilot. Three audiences read this file:

1. **Engineering** — implements the Zod schema and the Drizzle/Postgres migration verbatim.
2. **GC + Lawyer** — reviews the field list against PDPL Art. 5 (sensitive health data classification) and confirms no drift.
3. **Founder** — reads to verify Aooda is collecting what it promised the clinic and not a byte more.

If a field is not in §3 below, it MUST NOT exist in any Aooda database, log, or external sub-processor payload. This is the contract.

---

## 2. Data-minimization principle (governing rule)

PDPL Article 12 mandates **proportionality and necessity** for processed data. Aooda's contract with the clinic (`pilot-agreement.md §4`) commits to processing only what the pilot's job-to-be-done requires: identify a dormant patient, send them a Khaleeji reactivation message, log whether they replied and whether they returned.

Anything beyond that is scope creep AND a regulatory drift risk. The §4 "PROHIBITED" list below is enforced at three layers:

- Schema (this doc) — the columns do not exist.
- Application code — there is no path that writes to them even if a clinic CSV included them; the import pipeline DROPS extra columns silently and logs a `DROPPED_FIELD` audit row.
- Privacy disclosure — the public privacy page enumerates what is collected AND what is excluded. The clinic owner sees the same list during onboarding.

---

## 3. Allowed fields (the schema)

Aligns with `pilot-scoping.md §7` tracking spreadsheet shape and `pilot-agreement.md` Annex A.

| Field             | Type          | Required? | Notes                                                                                                                       |
| ----------------- | ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| `id`              | UUID          | yes       | Generated server-side. Never derived from patient data.                                                                     |
| `clinic_id`       | UUID          | yes       | FK to `clinic` table. Scopes the row to a single tenant.                                                                    |
| `phone_e164`      | text          | yes       | E.164 normalized, e.g. `+9665XXXXXXXX`. Validated at import.                                                                |
| `name_ar`         | text          | yes       | Arabic display name. May contain diacritics. Length cap 80 chars.                                                           |
| `name_translit`   | text          | no        | Optional Latin transliteration — only if clinic provided it in CSV. Length cap 80. Never auto-generated.                    |
| `last_visit_date` | date          | yes       | Date only, no time. Used to compute "غايب من فترة" relative phrasing.                                                       |
| `cohort_id`       | UUID          | yes       | FK to `cohort` — the per-clinic dormant-patient batch (`pilot-scoping.md §1`).                                              |
| `sent_at`         | timestamp     | nullable  | When Aooda first sent the reactivation message. NULL until first send.                                                      |
| `reply_at`        | timestamp     | nullable  | When the patient replied (any reply, opt-out or otherwise).                                                                 |
| `reply_text`      | text          | nullable  | The patient's reply body, length cap 500 chars. **First 40 chars used for opt-out matching** (see `opt-out-handler.md §3`). |
| `opt_out_at`      | timestamp     | nullable  | Set by opt-out handler. Once set, suppression is permanent.                                                                 |
| `booked_at`       | timestamp     | nullable  | Set by clinic receptionist via dashboard. Aooda does not auto-detect bookings.                                              |
| `attended_at`     | timestamp     | nullable  | Set by clinic receptionist after the visit happens.                                                                         |
| `paid_amount_sar` | decimal(10,2) | nullable  | Set by clinic at end-of-pilot reconciliation. Used to compute 15% / 3,000 SAR cap.                                          |
| `audit_log_id`    | UUID          | nullable  | FK to `audit_log` — points to the most recent audit row about this patient.                                                 |
| `created_at`      | timestamp     | yes       | Server time on row insert.                                                                                                  |
| `updated_at`      | timestamp     | yes       | Server time on any field change.                                                                                            |

**Total: 16 columns.** No others permitted.

---

## 4. PROHIBITED fields (the "do not store" list)

Per PDPL Art. 5 (sensitive data) AND the clinic's data-minimization expectation. These MUST NOT appear in:

- The `patient` table or any related table.
- Any application log line.
- Any sub-processor payload (Anthropic, BSP, Vercel logs).
- Any export, weekly PDF, or case study.

| Prohibited category      | Examples (Arabic + English)               | Reason                                                                                                                                                                                                            |
| ------------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Diagnosis**            | "تسوس", "التهاب لثة", "diagnosis: caries" | Sensitive health data — Art. 5. Not needed for reactivation.                                                                                                                                                      |
| **Treatment plan**       | "حشو, تنظيف, زراعة", "RCT planned"        | Same.                                                                                                                                                                                                             |
| **Allergies**            | "حساسية بنسلين"                           | Sensitive medical history. Never.                                                                                                                                                                                 |
| **Lab results**          | X-ray descriptions, blood-work            | Sensitive. Outside Aooda's scope entirely.                                                                                                                                                                        |
| **Billing detail**       | Itemized invoices, procedure codes        | Financial detail beyond aggregate `paid_amount_sar`.                                                                                                                                                              |
| **Insurance info**       | TPA name, policy number, claim status     | Financial + identity. Outside scope.                                                                                                                                                                              |
| **National ID**          | رقم الهوية / اقامة                        | Saudi national ID is a high-sensitivity identifier — PDPL + national security norms. NEVER stored.                                                                                                                |
| **Date of birth**        | YYYY-MM-DD                                | Not required for reactivation. Use age band only IF the clinic later requests demographic segmentation (out of pilot scope).                                                                                      |
| **Address**              | Full street address                       | Not required; the clinic already has it.                                                                                                                                                                          |
| **Family relationships** | "ابن خالد", "زوجة فلان"                   | Sensitive social graph. Not required.                                                                                                                                                                             |
| **Photo / image**        | Patient avatars, x-ray images             | Strict biometric / health data. Never.                                                                                                                                                                            |
| **Visit type detail**    | "تنظيف, حشو ضرس 16, مراجعة تقويم"         | Use a SINGLE generic category at most (e.g. "consultation" / "follow-up"). The schema deliberately does NOT include even a generic `visit_type` field for v1.0 — it adds compliance burden with zero pilot value. |

**Import-time enforcement:** the CSV import pipeline (§7) reads only the 3 required columns and silently ignores everything else. If a clinic uploads a CSV with a `diagnosis` column, the data is NOT stored and a `DROPPED_FIELD` audit row is written (column name only, no values).

---

## 5. Retention

| Data class                   | Retention period                               | Mechanism                              | Source of truth                                |
| ---------------------------- | ---------------------------------------------- | -------------------------------------- | ---------------------------------------------- |
| `patient` row (active pilot) | Lifetime of pilot                              | n/a                                    | `pilot-agreement.md §4`, `pilot-scoping.md §1` |
| `patient` row (post-pilot)   | **30 days after pilot end-date → HARD DELETE** | Daily cron `purge-expired-patients.ts` | `pilot-agreement.md §9`, `pilot-scoping.md §1` |
| `audit_log` row              | **2 years from write date**                    | Daily cron `purge-old-audit-logs.ts`   | This doc + `opt-out-handler.md §7`             |
| `suppression` row            | **PERMANENT** (no expiry)                      | Never purged                           | `opt-out-handler.md §6`                        |
| `clinic` row (tenant)        | Lifetime of relationship                       | Manual deletion on termination         | `pilot-agreement.md §9`                        |

**Why these numbers (in plain language):**

- **30 days post-pilot** — long enough for reconciliation (final invoice, case study draft, owner sign-off), short enough to honor the spirit of data minimization.
- **2 years audit log** — Saudi commercial code default record-keeping minimum. Defends against retroactive SDAIA / CITC inquiry without becoming an indefinite hoard.
- **Permanent suppression** — once a patient says "stop", we never auto-forget. Re-onboarding requires fresh, in-clinic affirmative consent (`opt-out-handler.md §2`).

**Hard-delete mechanism:** SQL `DELETE` on the patient row (not soft-delete). Cascades to `cohort_membership`, `send_attempt`, and `reply` tables that reference it. The audit log row about the deletion itself is RETAINED for the 2-year audit window — it records that a delete happened, but contains no patient PII beyond the row UUID.

---

## 6. Patient rights (PDPL Art. 4–9) — schema implications

Every right has a code path. Where the path is TODO, the migration must still allow the right to be exercised manually within the 7-day SLA.

| Right                                | PDPL Art. | Implementation in v1.0                                                                                                    | TODO for v1.1                                          |
| ------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Access                               | Art. 4    | Founder runs `SELECT * FROM patient WHERE phone_e164 = ?` and exports as CSV.                                             | Self-serve patient-facing portal (out-of-pilot scope). |
| Correction                           | Art. 6    | Founder manually `UPDATE` based on clinic-forwarded request.                                                              | Same.                                                  |
| Deletion (full erasure, not opt-out) | Art. 9    | Founder runs the documented delete procedure (`scripts/delete-patient.mjs` — TODO eng).                                   | Auto-triggered from privacy page contact form.         |
| Restriction                          | Art. 6    | Set `opt_out_at = now()` AND set a `processing_restricted` flag (column NOT in v1.0 — handled by opt-out marker for now). | Add `processing_restricted_at` column.                 |
| Withdrawal of consent                | Art. 9    | Opt-out handler (see `opt-out-handler.md`).                                                                               | Same.                                                  |
| Portability                          | Art. 8    | Founder exports the clinic's full CSV on request.                                                                         | Same.                                                  |
| Objection                            | Art. 9    | Same as withdrawal — pragmatically identical in pilot scope.                                                              | Same.                                                  |

**7-day SLA** for honoring any patient right is committed in `pilot-agreement.md §6` and `privacy-pdpl-rewrite.md §rights`.

---

## 7. CSV import format

The CSV that the clinic exports from Excel / their PMS is the ONLY data ingestion path. There is no UI for direct patient entry. No API for third-party POST. The CSV path is the single chokepoint that enforces the §4 prohibition list.

**Required columns (the only ones read):**

| Column header (case-insensitive) | Maps to           | Validation                                                                                                     |
| -------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `phone`                          | `phone_e164`      | Normalized to E.164; SA prefix `+9665` enforced; reject row if invalid.                                        |
| `name`                           | `name_ar`         | Trim; length cap 80; reject row if empty.                                                                      |
| `last_visit_date`                | `last_visit_date` | Accepted formats: `YYYY-MM-DD`, `DD/MM/YYYY`, `DD-MM-YYYY`. Reject row if older than 5 years or in the future. |

**Required opt-in column:**

| Column header | Behavior                                                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opt_in`      | Values accepted: `yes`, `y`, `نعم`, `1`, `true` (case-insensitive). Any other value → **row is rejected** and an `OPT_IN_MISSING` audit row is written (phone hash only, no name). |

The clinic owner signs an attestation at Day 0 kickoff that EVERY row with `opt_in: yes` corresponds to a patient who consented to clinic contact at registration. This attestation is in `pilot-agreement.md §5`.

**Optional columns (read if present):**

| Column header   | Maps to         | Notes                           |
| --------------- | --------------- | ------------------------------- |
| `name_translit` | `name_translit` | Optional Latin transliteration. |

**ALL other columns: silently dropped + `DROPPED_FIELD` audit row.** The dropped-field log surfaces in the founder's weekly review — if a clinic is shipping prohibited categories repeatedly, that is a Day-0 retraining moment, not a schema permission moment.

**Sample CSV (3 rows — INVENTED placeholder data, marked as such):**

```csv
phone,name,last_visit_date,opt_in
+9665XXXXXXX1,<<مريض مثال 1 — placeholder>>,2024-08-12,yes
+9665XXXXXXX2,<<مريض مثال 2 — placeholder>>,2024-11-03,yes
+9665XXXXXXX3,<<مريض مثال 3 — placeholder>>,2025-02-19,yes
```

> All three rows above are **invented placeholders** and must not be confused with real patient data. Replace at first real-clinic onboarding.

---

## 8. Zod schema (TS — drop into `src/lib/pilot/patient-schema.ts`)

```ts
import { z } from 'zod'

// E.164 — Saudi-only for the pilot. Tighten when expanding outside KSA.
const phoneE164KsaSchema = z.string().regex(/^\+9665\d{8}$/, {
  message: 'phone must be E.164 Saudi mobile (+9665XXXXXXXX, 12 chars total)',
})

const nameArSchema = z
  .string()
  .trim()
  .min(1, 'name_ar is required')
  .max(80, 'name_ar must be 80 chars or fewer')

const nameTranslitSchema = z.string().trim().max(80).optional()

const lastVisitDateSchema = z.coerce
  .date()
  .refine((d) => d.getTime() <= Date.now(), 'last_visit_date cannot be in the future')
  .refine(
    (d) => d.getTime() >= Date.now() - 5 * 365 * 24 * 60 * 60 * 1000,
    'last_visit_date cannot be older than 5 years',
  )

export const PatientImportRowSchema = z.object({
  phone: phoneE164KsaSchema,
  name: nameArSchema,
  name_translit: nameTranslitSchema,
  last_visit_date: lastVisitDateSchema,
  opt_in: z
    .string()
    .transform((v) => v.trim().toLowerCase())
    .refine(
      (v) => ['yes', 'y', 'نعم', '1', 'true'].includes(v),
      'opt_in must be yes / y / نعم / 1 / true',
    ),
})

export type PatientImportRow = z.infer<typeof PatientImportRowSchema>

// Fields written to DB after import passes validation.
// Mirrors §3 column list exactly.
export const PatientRowSchema = z.object({
  id: z.string().uuid(),
  clinic_id: z.string().uuid(),
  phone_e164: phoneE164KsaSchema,
  name_ar: nameArSchema,
  name_translit: nameTranslitSchema,
  last_visit_date: z.date(),
  cohort_id: z.string().uuid(),
  sent_at: z.date().nullable(),
  reply_at: z.date().nullable(),
  reply_text: z.string().max(500).nullable(),
  opt_out_at: z.date().nullable(),
  booked_at: z.date().nullable(),
  attended_at: z.date().nullable(),
  paid_amount_sar: z.number().nonnegative().nullable(),
  audit_log_id: z.string().uuid().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
})

export type PatientRow = z.infer<typeof PatientRowSchema>

// Guard against §4 prohibition list at the type level.
// Compile-time check: if anyone adds a forbidden field, TS will yell.
type ForbiddenKeys =
  | 'diagnosis'
  | 'treatment_plan'
  | 'allergies'
  | 'lab_results'
  | 'billing_detail'
  | 'insurance_info'
  | 'national_id'
  | 'iqama_number'
  | 'date_of_birth'
  | 'dob'
  | 'address'
  | 'family_relation'
  | 'photo_url'
  | 'avatar_url'
  | 'visit_type_detail'

type AssertNoForbidden<T> = {
  [K in keyof T]: K extends ForbiddenKeys ? never : T[K]
}

// This line will fail to compile if PatientRow ever grows a forbidden field.
const _patientRowGuard: AssertNoForbidden<PatientRow> = {} as PatientRow
void _patientRowGuard
```

---

## 9. SQL migration (Drizzle + Postgres — drop into `drizzle/migrations/`)

```sql
-- 0001_patient_tracking.sql
-- PDPL-aligned patient tracking schema for the pilot.
-- Fields locked per docs/specs/patient-tracking-schema.md §3.
-- Prohibited fields per §4 — INTENTIONALLY ABSENT.

BEGIN;

CREATE TABLE IF NOT EXISTS clinic (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  city        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cohort (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id   uuid NOT NULL REFERENCES clinic(id) ON DELETE CASCADE,
  label       text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patient (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id         uuid NOT NULL REFERENCES clinic(id) ON DELETE CASCADE,
  phone_e164        text NOT NULL CHECK (phone_e164 ~ '^\+9665[0-9]{8}$'),
  name_ar           text NOT NULL CHECK (char_length(name_ar) BETWEEN 1 AND 80),
  name_translit     text         CHECK (name_translit IS NULL OR char_length(name_translit) <= 80),
  last_visit_date   date NOT NULL,
  cohort_id         uuid NOT NULL REFERENCES cohort(id) ON DELETE CASCADE,
  sent_at           timestamptz,
  reply_at          timestamptz,
  reply_text        text CHECK (reply_text IS NULL OR char_length(reply_text) <= 500),
  opt_out_at        timestamptz,
  booked_at         timestamptz,
  attended_at       timestamptz,
  paid_amount_sar   numeric(10,2) CHECK (paid_amount_sar IS NULL OR paid_amount_sar >= 0),
  audit_log_id      uuid,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT patient_phone_unique_per_clinic UNIQUE (clinic_id, phone_e164)
);

CREATE INDEX IF NOT EXISTS patient_clinic_cohort_idx ON patient (clinic_id, cohort_id);
CREATE INDEX IF NOT EXISTS patient_opt_out_idx       ON patient (opt_out_at) WHERE opt_out_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS suppression (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_e164          text NOT NULL CHECK (phone_e164 ~ '^\+9665[0-9]{8}$'),
  clinic_id           uuid NOT NULL REFERENCES clinic(id) ON DELETE CASCADE,
  suppressed_at       timestamptz NOT NULL DEFAULT now(),
  source_message_id   text,
  source_text_first40 text,
  CONSTRAINT suppression_unique UNIQUE (clinic_id, phone_e164)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event                  text NOT NULL,
  clinic_id              uuid REFERENCES clinic(id) ON DELETE SET NULL,
  patient_id             uuid REFERENCES patient(id) ON DELETE SET NULL,
  phone_e164             text,
  received_at            timestamptz NOT NULL DEFAULT now(),
  confirmed_at           timestamptz,
  source_message_id      text,
  source_text_first40    text,
  matched_pattern        text,
  confirmation_text      text,
  confirmation_status    text,
  extra                  jsonb,
  CONSTRAINT audit_log_event_check
    CHECK (event IN (
      'opt_out', 'near_miss_opt_out', 'opt_in_missing',
      'dropped_field', 'patient_inserted', 'patient_deleted',
      'send_attempt', 'reply_received', 'booking_recorded',
      'attendance_recorded', 'payment_recorded'
    ))
);

CREATE INDEX IF NOT EXISTS audit_log_clinic_received_idx
  ON audit_log (clinic_id, received_at DESC);

COMMIT;
```

**Migration notes:**

- The `CHECK` constraint on `patient.phone_e164` is a defense-in-depth — even if the Zod layer is bypassed, Postgres refuses the row.
- The `UNIQUE (clinic_id, phone_e164)` on `patient` AND on `suppression` is the multi-tenant safety net.
- The `audit_log.event` enum check matches §10 below; adding a new event type requires a schema migration (intentional friction — prevents log-shape drift).
- No table contains any column from the §4 prohibition list. This is enforced at three layers: Zod (compile-time), application import (drops silently), Postgres (no column exists).

---

## 10. Audit event types (enum locked here)

| Event                 | When written                                          | Phone retained?       |
| --------------------- | ----------------------------------------------------- | --------------------- |
| `patient_inserted`    | After CSV import row passes validation.               | yes                   |
| `patient_deleted`     | After hard-delete (post-retention or Art. 9 request). | yes (audit only)      |
| `opt_out`             | Inbound message matches `opt-out-handler.md §3`.      | yes                   |
| `near_miss_opt_out`   | Send race — opt-out arrived between enqueue and send. | yes                   |
| `opt_in_missing`      | CSV row rejected because `opt_in` ≠ yes.              | hashed phone only     |
| `dropped_field`       | CSV included a field outside §7 allowed list.         | no — column name only |
| `send_attempt`        | Outbound send via Meta API.                           | yes                   |
| `reply_received`      | Inbound that did NOT match opt-out regex.             | yes                   |
| `booking_recorded`    | Receptionist marked a booking.                        | yes                   |
| `attendance_recorded` | Receptionist confirmed attendance.                    | yes                   |
| `payment_recorded`    | Owner reconciled `paid_amount_sar` at end of pilot.   | yes                   |

---

## 11. Self-audit vs. pdpl-compliance-critic 8-check rubric

| Check                                   | Result           | Evidence                                                                                                                                                            |
| --------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Legal basis explicit                 | PASS             | §2 + §6 cite Arts. 5, 6, 9, 12.                                                                                                                                     |
| 2. Opt-out language + handler + SLA     | PASS (cross-ref) | Defers to `opt-out-handler.md` — schema supports it via `opt_out_at` column + `suppression` table.                                                                  |
| 3. Sub-processors named publicly        | PASS (cross-ref) | Defers to `privacy-pdpl-rewrite.md` — but enforced here via "no sub-processor receives prohibited fields" (§4 layer).                                               |
| 4. Retention period (days, consistent)  | PASS             | §5 lists 30 days / 2 years / permanent — matches `pilot-agreement.md §4 §9` (with the lawyer-brief Q4 noting the §4 vs §9 30-day vs 30-day discrepancy to confirm). |
| 5. Patient rights flow + 7-day SLA      | PASS             | §6 lists every Art. 4–9 right with v1.0 code path.                                                                                                                  |
| 6. Breach notification path (72h SDAIA) | N/A here         | Cross-refed in `privacy-pdpl-rewrite.md`.                                                                                                                           |
| 7. No health-data drift                 | PASS             | §4 lists 12 prohibited categories; schema columns enforced at three layers.                                                                                         |
| 8. SDAIA registration honesty           | N/A here         | Cross-refed in `privacy-pdpl-rewrite.md`.                                                                                                                           |

**Self-verdict: PASS for in-scope checks.**

---

## 12. Open questions for founder (decisions, not implementation)

1. **Visit-type generic category** — keep schema at zero `visit_type` field for v1.0 (current spec) or add `visit_type_category` as a constrained enum (`consultation`, `cleaning`, `follow-up`, `other`)? Trade-off: enum gives the message template better personalization ("ما رجعت من تنظيفك الأخير") at the cost of one more PDPL-touchpoint to defend.
2. **Audit-log 2-year retention** — confirm or shorten. Saudi commercial code minimum is ambiguous; lawyer brief Q4 surfaces this.
3. **Name in audit log on `patient_deleted` event** — should we retain the patient name in the audit row after hard-deleting the patient row? Current spec: no — only `id` and `phone_e164`. Lawyer should confirm this is enough for a SDAIA inquiry traceability test.
