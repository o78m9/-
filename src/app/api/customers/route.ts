import { type NextRequest, NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { CustomerCreateSchema } from '@/lib/schemas'
import { logAudit } from '@/lib/audit'
import { withClinic } from '@/shared/lib/db'
import { requireClinic, isClinicError } from '@/features/auth/lib/require-clinic'

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.api)
  if (limited) return limited

  const parsed = CustomerCreateSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { name, phone, visit_type, notes, clinic_id } = parsed.data

  // AUB-001 / RTA-002 fix: requireClinic() reads app_metadata (admin-only writable),
  // trip-wires fire on divergence or request-supplied mismatch.
  const ctx = await requireClinic(req, { requestedClinicId: clinic_id })
  if (isClinicError(ctx)) return ctx

  // CISO defense-in-depth: use ctx.clinicId (server-resolved) NOT body clinic_id
  // even though the trip-wire enforces equality today. If a future code path
  // ever skips requestedClinicId, this prevents AUB-001 from re-opening silently.
  const tenant = ctx.clinicId

  const today = new Date().toISOString().split('T')[0]

  // APF-004 fix: atomic upsert closes the (phone, clinic_id) race.
  // CTE bundles the customer upsert + visit insert into one transaction step
  // so the RLS-scoped withClinic() wrapper covers both writes.
  const [rows] = await withClinic<[Array<{ id: string; inserted: boolean }>]>(tenant, (sql) => [
    sql`
      WITH upserted AS (
        INSERT INTO customers (clinic_id, name, phone, first_visit, last_visit, status, notes)
        VALUES (${tenant}, ${name}, ${phone}, ${today}, ${today}, 'active', ${notes || null})
        ON CONFLICT (phone, clinic_id) DO UPDATE SET
          last_visit = EXCLUDED.last_visit,
          status     = 'active',
          notes      = COALESCE(EXCLUDED.notes, customers.notes)
        RETURNING id, (xmax = 0) AS inserted
      ),
      visit AS (
        INSERT INTO visits (customer_id, date, service, notes)
        SELECT id, ${today}, ${visit_type}, ${notes || null} FROM upserted
        RETURNING customer_id
      )
      SELECT u.id, u.inserted FROM upserted u
    `,
  ])

  const row = rows[0]
  if (!row) return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
  const id = row.id
  const inserted = row.inserted

  await logAudit(req, {
    userId: ctx.userId,
    clinicId: tenant,
    action: inserted ? 'customer.create' : 'customer.update',
    resource: 'customer',
    resourceId: id,
    metadata: { visit_type: visit_type ?? null },
  })
  return NextResponse.json({ id, ...(inserted ? { created: true } : { updated: true }) })
}
