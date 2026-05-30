import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cleanImportData } from '@/lib/claude'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { ImportSchema } from '@/lib/schemas'
import { logAudit } from '@/lib/audit'
import { createClient } from '@/features/auth/lib/server'

const sql = neon(process.env.DATABASE_URL ?? '')

// Maximum records Claude may return — prevents DoS via giant import
const MAX_IMPORT_RECORDS = 500

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.import)
  if (limited) return limited

  // Require authenticated session — import is a privileged action
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseConfigured && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = ImportSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { rawText, clinic_id, confirm } = parsed.data

  // IDOR guard: verify the caller owns this clinic
  if (supabaseConfigured && user) {
    const userClinicId =
      (user.user_metadata?.clinic_id as string | undefined) ||
      process.env.NEXT_PUBLIC_DEMO_CLINIC_ID
    if (userClinicId && userClinicId !== clinic_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

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
    userId: user?.id ?? null,
    clinicId: clinic_id,
    action: 'customer.import',
    resource: 'customer',
    metadata: { imported, requested: safeRecords.length },
  })
  return NextResponse.json({ imported })
}
