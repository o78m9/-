import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { CustomerCreateSchema } from '@/lib/schemas'
import { logAudit } from '@/lib/audit'
import { createClient } from '@/features/auth/lib/server'

const sql = neon(process.env.DATABASE_URL ?? '')

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.api)
  if (limited) return limited

  // Require authenticated session — prevent anonymous writes to any clinic
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow the public /capture form (QR code scan) only when Supabase is not configured
  // In production, Supabase MUST be configured so this branch is unreachable
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseConfigured && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = CustomerCreateSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { name, phone, visit_type, notes, clinic_id } = parsed.data

  // IDOR guard: when authenticated, verify the clinic belongs to this user
  // (Supabase user metadata or a clinics table lookup should be the authoritative check)
  // For now we enforce that the clinic_id matches the env-configured demo clinic or the
  // user's own clinic stored in their profile metadata.
  if (supabaseConfigured && user) {
    const userClinicId =
      (user.user_metadata?.clinic_id as string | undefined) ||
      process.env.NEXT_PUBLIC_DEMO_CLINIC_ID
    if (userClinicId && userClinicId !== clinic_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const existing = await sql`
    SELECT id FROM customers WHERE phone = ${phone} AND clinic_id = ${clinic_id}
  `

  if (existing.length > 0) {
    const row = existing[0]
    if (!row) return NextResponse.json({ error: 'Unexpected empty result' }, { status: 500 })
    const id = row.id as string
    await sql`UPDATE customers SET last_visit = ${today}, status = 'active' WHERE id = ${id}`
    await sql`INSERT INTO visits (customer_id, date, service, notes) VALUES (${id}, ${today}, ${visit_type}, ${notes || null})`
    await logAudit(req, {
      userId: user?.id ?? null,
      clinicId: clinic_id,
      action: 'customer.update',
      resource: 'customer',
      resourceId: id,
      metadata: { visit_type: visit_type ?? null },
    })
    return NextResponse.json({ id, updated: true })
  }

  const inserted = await sql`
    INSERT INTO customers (clinic_id, name, phone, first_visit, last_visit, status, notes)
    VALUES (${clinic_id}, ${name}, ${phone}, ${today}, ${today}, 'active', ${notes || null})
    RETURNING id
  `
  const insertedRow = inserted[0]
  if (!insertedRow) return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
  const id = insertedRow.id as string
  await sql`INSERT INTO visits (customer_id, date, service, notes) VALUES (${id}, ${today}, ${visit_type}, ${notes || null})`

  await logAudit(req, {
    userId: user?.id ?? null,
    clinicId: clinic_id,
    action: 'customer.create',
    resource: 'customer',
    resourceId: id,
    metadata: { visit_type: visit_type ?? null },
  })
  return NextResponse.json({ id, created: true })
}
