import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { CustomerCreateSchema } from '@/lib/schemas'
import { logAudit } from '@/lib/audit'
import { requireClinic, isClinicError } from '@/features/auth/lib/require-clinic'

const sql = neon(process.env.DATABASE_URL ?? '')

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.api)
  if (limited) return limited

  const parsed = CustomerCreateSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { name, phone, visit_type, notes, clinic_id } = parsed.data

  // AUB-001 / RTA-002 fix: requireClinic() reads app_metadata (admin-only writable),
  // with the user_metadata fallback only honored until CLINIC_METADATA_FALLBACK_UNTIL.
  // Trip-wires fire if user_metadata.clinic_id diverges from app_metadata, or if the
  // request-supplied clinic_id mismatches the resolved value.
  const ctx = await requireClinic(req, { requestedClinicId: clinic_id })
  if (isClinicError(ctx)) return ctx

  const today = new Date().toISOString().split('T')[0]

  // APF-004 fix: atomic upsert closes the (phone, clinic_id) race.
  // `xmax = 0` distinguishes INSERT (true) from UPDATE (false) in the same round-trip.
  const upserted = await sql`
    INSERT INTO customers (clinic_id, name, phone, first_visit, last_visit, status, notes)
    VALUES (${clinic_id}, ${name}, ${phone}, ${today}, ${today}, 'active', ${notes || null})
    ON CONFLICT (phone, clinic_id) DO UPDATE SET
      last_visit = EXCLUDED.last_visit,
      status     = 'active',
      notes      = COALESCE(EXCLUDED.notes, customers.notes)
    RETURNING id, (xmax = 0) AS inserted
  `
  const row = upserted[0]
  if (!row) return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
  const id = row.id as string
  const inserted = row.inserted as boolean

  await sql`INSERT INTO visits (customer_id, date, service, notes) VALUES (${id}, ${today}, ${visit_type}, ${notes || null})`

  await logAudit(req, {
    userId: ctx.userId,
    clinicId: clinic_id,
    action: inserted ? 'customer.create' : 'customer.update',
    resource: 'customer',
    resourceId: id,
    metadata: { visit_type: visit_type ?? null },
  })
  return NextResponse.json({ id, ...(inserted ? { created: true } : { updated: true }) })
}
