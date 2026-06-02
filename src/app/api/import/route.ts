import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cleanImportData } from '@/lib/claude'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { ImportSchema } from '@/lib/schemas'
import { logAudit } from '@/lib/audit'
import { chargeClinicTokens, estimateTokens } from '@/lib/claude-budget'
import { requireClinic, isClinicError } from '@/features/auth/lib/require-clinic'

const sql = neon(process.env.DATABASE_URL ?? '')

// Maximum records Claude may return — prevents DoS via giant import
const MAX_IMPORT_RECORDS = 500

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.import)
  if (limited) return limited

  const parsed = ImportSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { rawText, clinic_id, confirm } = parsed.data

  // AUB-001 / RTA-002 fix: swap to requireClinic() with trip-wires.
  const ctx = await requireClinic(req, { requestedClinicId: clinic_id })
  if (isClinicError(ctx)) return ctx

  // APF-002 / PIR-007 fix: per-clinic Anthropic token budget.
  const estIn = estimateTokens(rawText)
  const budget = await chargeClinicTokens(ctx.clinicId, estIn)
  if (!budget.ok) {
    return NextResponse.json(
      { error: 'Daily AI quota exceeded for this clinic', spentToday: budget.spentToday },
      { status: 429, headers: { 'Retry-After': '3600' } },
    )
  }

  // APF-007 fix: audit BEFORE the confirm short-circuit so preview-mode is also tracked.
  await logAudit(req, {
    userId: ctx.userId,
    clinicId: clinic_id,
    action: 'customer.import',
    resource: 'customer',
    metadata: { mode: confirm ? 'apply' : 'preview', estInputTokens: estIn },
  })

  const cleaned = await cleanImportData(rawText)

  // Enforce record cap — defence against prompt injection producing massive arrays
  const safeRecords = cleaned.slice(0, MAX_IMPORT_RECORDS)

  if (!confirm) {
    return NextResponse.json({ preview: safeRecords, count: safeRecords.length })
  }

  let imported = 0
  for (const c of safeRecords) {
    // Only insert records that passed validation inside cleanImportData
    if (!c.name || !c.phone) continue
    await sql`
      INSERT INTO customers (clinic_id, name, phone, first_visit, last_visit, notes, status, total_spent)
      VALUES (${clinic_id}, ${c.name}, ${c.phone}, ${c.last_visit || null}, ${c.last_visit || null}, ${c.notes || null}, 'active', 0)
      ON CONFLICT (phone, clinic_id) DO UPDATE SET
        last_visit = EXCLUDED.last_visit,
        notes = COALESCE(EXCLUDED.notes, customers.notes)
    `
    imported++
  }

  await logAudit(req, {
    userId: ctx.userId,
    clinicId: clinic_id,
    action: 'customer.import.applied',
    resource: 'customer',
    metadata: { imported, requested: safeRecords.length },
  })
  return NextResponse.json({ imported })
}
