import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cleanImportData } from '@/lib/claude'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { ImportSchema } from '@/lib/schemas'

const sql = neon(process.env.DATABASE_URL ?? '')

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, LIMITS.import)
  if (limited) return limited

  const parsed = ImportSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { rawText, clinic_id, confirm } = parsed.data

  const cleaned = await cleanImportData(rawText)

  if (!confirm) {
    return NextResponse.json({ preview: cleaned, count: cleaned.length })
  }

  let imported = 0
  for (const c of cleaned) {
    await sql`
      INSERT INTO customers (clinic_id, name, phone, first_visit, last_visit, notes, status, total_spent)
      VALUES (${clinic_id}, ${c.name}, ${c.phone}, ${c.last_visit || null}, ${c.last_visit || null}, ${c.notes || null}, 'active', 0)
      ON CONFLICT (phone, clinic_id) DO UPDATE SET
        last_visit = EXCLUDED.last_visit,
        notes = COALESCE(EXCLUDED.notes, customers.notes)
    `
    imported++
  }

  return NextResponse.json({ imported })
}
