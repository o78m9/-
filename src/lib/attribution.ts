/**
 * Attribution model for Aooda's optional pay-for-results pricing tier.
 *
 * Source of truth: docs/ATTRIBUTION.md. Read it before changing any constant
 * here — billing disputes are decided by the literal terms in that doc.
 *
 * Hot path:
 *   1. Patient is sent a message (logMessage)
 *   2. Patient visits later (recordVisitForAttribution checks the message log)
 *   3. End of month: computeMonthlyAttribution sums attributable visits per clinic
 *   4. Statement: generateStatement produces clinic-facing breakdown
 *   5. Disputes: filed via /api/disputes, auto-approved, deducted from total
 */

import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

/** Window length in milliseconds. 14 calendar days, exactly. */
export const ATTRIBUTION_WINDOW_MS = 14 * 24 * 60 * 60 * 1000

/** Aooda revenue share on the Hybrid pricing tier. */
export const HYBRID_TAKE_RATE = 0.15

/** Auto-switch a clinic to Flat tier when their dispute rate over a month exceeds this. */
export const DISPUTE_RATE_AUTO_FLAT = 0.4

/** A patient counts as dormant for attribution purposes when their gap is at least this. */
export const DORMANT_DAYS = 90

export type AttributionDisputeReason =
  | 'patient called us directly — not because of message'
  | 'patient came in for emergency — already planned'
  | 'this is a duplicate visit entry'
  | 'wrong patient matched'
  | 'other (see notes)'

export const DISPUTE_REASONS: readonly AttributionDisputeReason[] = [
  'patient called us directly — not because of message',
  'patient came in for emergency — already planned',
  'this is a duplicate visit entry',
  'wrong patient matched',
  'other (see notes)',
]

export interface AttributableVisit {
  visitId: string
  customerId: string
  clinicId: string
  visitDate: Date
  amount: number
  messageId: string
  messageSentAt: Date
  templateSlug: string
}

export interface MonthlyStatement {
  clinicId: string
  month: string // YYYY-MM
  messagesSent: number
  attributablePatientsSent: number
  attributableVisits: AttributableVisit[]
  disputedVisitIds: string[]
  recoveredRevenue: number // sum of amount, AFTER dispute deductions
  aoodaRevenue: number // 15% of recoveredRevenue
  disputeRate: number // 0..1
  shouldAutoSwitchToFlat: boolean
}

/**
 * Is the given visit attributable to the given message under our rules?
 * Pure function, no DB calls. Used for unit testing the rule logic.
 */
export function isVisitAttributable(args: {
  visitDate: Date
  messageSentAt: Date | null
  messageStatus: string
  patientWasDormantAtSend: boolean | null
  visitWasWalkIn: boolean
}): boolean {
  if (!args.messageSentAt) return false
  if (args.messageStatus !== 'delivered' && args.messageStatus !== 'read') return false
  if (args.patientWasDormantAtSend === false) return false
  if (args.visitWasWalkIn) return false

  const sentMs = args.messageSentAt.getTime()
  const visitMs = args.visitDate.getTime()
  if (visitMs < sentMs) return false
  if (visitMs > sentMs + ATTRIBUTION_WINDOW_MS) return false

  return true
}

/**
 * Among multiple candidate messages for the same patient+visit, pick the most
 * recent one whose send time is on or before the visit. (One-message rule.)
 */
export function pickAttributingMessage<
  M extends { id: string; sentAt: Date | null; status: string },
>(messages: M[], visitDate: Date): M | null {
  const eligible = messages.filter(
    (m) => m.sentAt !== null && m.sentAt.getTime() <= visitDate.getTime(),
  )
  if (eligible.length === 0) return null
  eligible.sort((a, b) => {
    const at = a.sentAt?.getTime() ?? 0
    const bt = b.sentAt?.getTime() ?? 0
    return bt - at
  })
  return eligible[0] ?? null
}

/**
 * Apply Hybrid pricing to a list of attributable visits + dispute IDs.
 */
export function computeAoodaRevenue(args: {
  visits: AttributableVisit[]
  disputedVisitIds: string[]
}): { recoveredRevenue: number; aoodaRevenue: number; netVisits: AttributableVisit[] } {
  const disputedSet = new Set(args.disputedVisitIds)
  const netVisits = args.visits.filter((v) => !disputedSet.has(v.visitId))
  const recoveredRevenue = netVisits.reduce((sum, v) => sum + v.amount, 0)
  const aoodaRevenue = Math.round(recoveredRevenue * HYBRID_TAKE_RATE * 100) / 100
  return { recoveredRevenue, aoodaRevenue, netVisits }
}

/**
 * SQL: pull the candidate (visit × message) pairs for a clinic in a date range.
 * Returns raw rows; caller decides attribution per the rules above.
 */
export async function fetchAttributionCandidates(
  sql: NeonQueryFunction<false, false>,
  args: { clinicId: string; from: Date; to: Date },
): Promise<
  Array<{
    visit_id: string
    customer_id: string
    visit_date: Date
    amount: number
    message_id: string | null
    message_sent_at: Date | null
    message_status: string | null
    template_slug: string | null
    patient_was_dormant_at_send: boolean | null
    walk_in: boolean | null
  }>
> {
  const rows = await sql`
    SELECT
      v.id              AS visit_id,
      v.customer_id     AS customer_id,
      v.date            AS visit_date,
      COALESCE(v.amount, 0)::float AS amount,
      m.id              AS message_id,
      m.sent_at         AS message_sent_at,
      m.status          AS message_status,
      m.template_slug   AS template_slug,
      m.patient_was_dormant_at_send AS patient_was_dormant_at_send,
      false             AS walk_in
    FROM visits v
    JOIN customers c ON c.id = v.customer_id
    LEFT JOIN messages m
      ON m.customer_id = c.id
     AND m.clinic_id   = ${args.clinicId}
     AND m.sent_at <= v.date
     AND m.sent_at >= v.date - interval '14 days'
    WHERE c.clinic_id = ${args.clinicId}
      AND v.date >= ${args.from.toISOString()}
      AND v.date <= ${args.to.toISOString()}
    ORDER BY v.date ASC, m.sent_at DESC
  `
  return rows as unknown as Array<{
    visit_id: string
    customer_id: string
    visit_date: Date
    amount: number
    message_id: string | null
    message_sent_at: Date | null
    message_status: string | null
    template_slug: string | null
    patient_was_dormant_at_send: boolean | null
    walk_in: boolean | null
  }>
}

/**
 * Group raw candidate rows by visit and pick the attributing message per the
 * one-message rule. Then filter to only attributable visits.
 */
export function reduceCandidatesToAttributable(
  rows: Array<{
    visit_id: string
    customer_id: string
    visit_date: Date
    amount: number
    message_id: string | null
    message_sent_at: Date | null
    message_status: string | null
    template_slug: string | null
    patient_was_dormant_at_send: boolean | null
    walk_in: boolean | null
  }>,
  clinicId: string,
): AttributableVisit[] {
  const byVisit = new Map<string, typeof rows>()
  for (const r of rows) {
    const arr = byVisit.get(r.visit_id) ?? []
    arr.push(r)
    byVisit.set(r.visit_id, arr)
  }

  const attributable: AttributableVisit[] = []
  for (const [visitId, candidateRows] of byVisit) {
    const messages = candidateRows
      .filter(
        (r): r is typeof r & { message_id: string; message_sent_at: Date } =>
          r.message_id !== null && r.message_sent_at !== null,
      )
      .map((r) => ({
        id: r.message_id,
        sentAt: r.message_sent_at,
        status: r.message_status ?? 'unknown',
        templateSlug: r.template_slug ?? 'unknown',
        patientWasDormantAtSend: r.patient_was_dormant_at_send,
      }))

    const visit = candidateRows[0]
    if (!visit) continue
    const chosen = pickAttributingMessage(messages, new Date(visit.visit_date))
    if (!chosen || !chosen.sentAt) continue

    const ok = isVisitAttributable({
      visitDate: new Date(visit.visit_date),
      messageSentAt: chosen.sentAt,
      messageStatus: chosen.status,
      patientWasDormantAtSend: chosen.patientWasDormantAtSend ?? null,
      visitWasWalkIn: visit.walk_in ?? false,
    })
    if (!ok) continue

    attributable.push({
      visitId,
      customerId: visit.customer_id,
      clinicId,
      visitDate: new Date(visit.visit_date),
      amount: Number(visit.amount),
      messageId: chosen.id,
      messageSentAt: chosen.sentAt,
      templateSlug: chosen.templateSlug,
    })
  }
  return attributable
}

/**
 * Compute the monthly statement for a clinic.
 */
export async function computeMonthlyAttribution(args: {
  clinicId: string
  year: number
  month: number // 1-12
  databaseUrl: string
}): Promise<MonthlyStatement> {
  const sql = neon(args.databaseUrl)
  const from = new Date(Date.UTC(args.year, args.month - 1, 1))
  const to = new Date(Date.UTC(args.year, args.month, 0, 23, 59, 59))

  const candidates = await fetchAttributionCandidates(sql, { clinicId: args.clinicId, from, to })
  const attributableVisits = reduceCandidatesToAttributable(candidates, args.clinicId)

  const disputes = (await sql`
    SELECT visit_id FROM attribution_disputes
    WHERE clinic_id = ${args.clinicId}
      AND filed_at >= ${from.toISOString()}
      AND filed_at <= ${to.toISOString()}
  `) as unknown as Array<{ visit_id: string }>
  const disputedVisitIds = disputes.map((d) => d.visit_id)

  const { recoveredRevenue, aoodaRevenue, netVisits } = computeAoodaRevenue({
    visits: attributableVisits,
    disputedVisitIds,
  })

  const messagesSentRows = (await sql`
    SELECT COUNT(*)::int AS n, COUNT(DISTINCT customer_id)::int AS distinct_customers
    FROM messages
    WHERE clinic_id = ${args.clinicId}
      AND sent_at >= ${from.toISOString()}
      AND sent_at <= ${to.toISOString()}
  `) as unknown as Array<{ n: number; distinct_customers: number }>
  const stats = messagesSentRows[0] ?? { n: 0, distinct_customers: 0 }

  const disputeRate =
    attributableVisits.length === 0 ? 0 : disputedVisitIds.length / attributableVisits.length

  return {
    clinicId: args.clinicId,
    month: `${args.year}-${String(args.month).padStart(2, '0')}`,
    messagesSent: stats.n,
    attributablePatientsSent: stats.distinct_customers,
    attributableVisits: netVisits,
    disputedVisitIds,
    recoveredRevenue,
    aoodaRevenue,
    disputeRate,
    shouldAutoSwitchToFlat: disputeRate >= DISPUTE_RATE_AUTO_FLAT,
  }
}
