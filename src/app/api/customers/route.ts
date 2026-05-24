import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  const { name, phone, visit_type, notes, clinic_id } = await req.json()

  if (!name || !phone || !clinic_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]

  const existing = await sql`
    SELECT id FROM customers WHERE phone = ${phone} AND clinic_id = ${clinic_id}
  `

  if (existing.length > 0) {
    const id = existing[0].id as string
    await sql`UPDATE customers SET last_visit = ${today}, status = 'active' WHERE id = ${id}`
    await sql`INSERT INTO visits (customer_id, date, service, notes) VALUES (${id}, ${today}, ${visit_type}, ${notes || null})`
    return NextResponse.json({ id, updated: true })
  }

  const inserted = await sql`
    INSERT INTO customers (clinic_id, name, phone, first_visit, last_visit, status, notes)
    VALUES (${clinic_id}, ${name}, ${phone}, ${today}, ${today}, 'active', ${notes || null})
    RETURNING id
  `
  const id = inserted[0].id as string
  await sql`INSERT INTO visits (customer_id, date, service, notes) VALUES (${id}, ${today}, ${visit_type}, ${notes || null})`

  return NextResponse.json({ id, created: true })
}
