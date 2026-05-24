import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cleanImportData } from '@/lib/claude'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { rawText, clinic_id, confirm } = await req.json()

  if (!rawText || !clinic_id) {
    return NextResponse.json({ error: 'Missing rawText or clinic_id' }, { status: 400 })
  }

  const cleaned = await cleanImportData(rawText)

  if (!confirm) {
    return NextResponse.json({ preview: cleaned, count: cleaned.length })
  }

  const today = new Date().toISOString().split('T')[0]

  const rows = cleaned.map(c => ({
    clinic_id,
    name: c.name,
    phone: c.phone,
    first_visit: c.last_visit || today,
    last_visit: c.last_visit || null,
    notes: c.notes || null,
    status: 'active',
    total_spent: 0,
  }))

  const { error } = await supabase
    .from('customers')
    .upsert(rows, { onConflict: 'phone,clinic_id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ imported: rows.length })
}
