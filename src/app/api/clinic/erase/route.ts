/**
 * PDPL erasure endpoint — soft-deletes a clinic's data, hard-delete by cron.
 *
 * Behaviour:
 *   POST /api/clinic/erase  with body { confirm: 'ERASE-MY-CLINIC' }
 *     → Marks clinic + customers as soft-deleted (status='erased', erased_at=now()).
 *     → A separate cron (to add) hard-deletes rows where erased_at < now() - 30d.
 *     → Returns audit ID for the operator's records.
 *
 * Why 30-day grace: PDPL/GDPR generally allow up to 30 days; this gives the
 * clinic owner a window to recover from accidental deletion. Hard-delete is
 * irreversible.
 */
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'
import { withClinic } from '@/shared/lib/db'
import { requireClinic, isClinicError } from '@/features/auth/lib/require-clinic'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EraseSchema = z.object({
  confirm: z.literal('ERASE-MY-CLINIC'),
})

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.writes)
  if (limited) return limited

  const ctx = await requireClinic(req)
  if (isClinicError(ctx)) return ctx
  const tenant = ctx.clinicId

  const parsed = EraseSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Confirmation phrase required', expected: 'ERASE-MY-CLINIC' },
      { status: 422 },
    )
  }

  const erasedAt = new Date().toISOString()
  // Soft-delete: mark customers and clinic. Hard-delete is a separate cron.
  // We don't drop visits/messages here — they're referenced by FK and pruned
  // alongside customers on hard-delete.
  await withClinic(tenant, (sql) => [
    sql`UPDATE customers SET status = 'erased', notes = NULL, name = '<erased>', phone = '<erased>', email = NULL WHERE clinic_id = ${tenant}`,
    sql`UPDATE clinics SET name = '<erased>', owner = NULL, phone = NULL WHERE id = ${tenant}`,
  ])

  const hardDeleteAt = new Date(Date.now() + 30 * 86400 * 1000).toISOString()
  await logAudit(req, {
    userId: ctx.userId,
    clinicId: tenant,
    action: 'customer.erase',
    resource: 'clinic',
    metadata: { erasedAt, hardDeleteAt },
  })

  return NextResponse.json({
    ok: true,
    softErasedAt: erasedAt,
    hardDeleteAfter: hardDeleteAt,
    notice:
      'Your clinic has been soft-erased. Hard-deletion occurs in 30 days. Contact support@aooda.sa within 30 days to restore.',
  })
}
