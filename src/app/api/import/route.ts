import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cleanImportData } from '@/lib/claude'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  const { rawText, clinic_id, confirm } = await req.json()

  if (!rawText || !clinic_id) {
    return NextResponse.json({ error: 'Missing rawText or clinic_id' }, { status: 400 })
  }

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
