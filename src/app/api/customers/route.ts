import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { name, phone, visit_type, notes, clinic_id } = await req.json()

  if (!name || !phone || !clinic_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('phone', phone)
    .eq('clinic_id', clinic_id)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('customers')
      .update({ last_visit: today, status: 'active' })
      .eq('id', existing.id)

    await supabase.from('visits').insert({
      customer_id: existing.id,
      date: today,
      service: visit_type,
      notes: notes || null,
    })

    return NextResponse.json({ id: existing.id, updated: true })
  }

  const { data: customer, error } = await supabase
    .from('customers')
    .insert({
      clinic_id,
      name,
      phone,
      first_visit: today,
      last_visit: today,
      status: 'active',
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('visits').insert({
    customer_id: customer.id,
    date: today,
    service: visit_type,
    notes: notes || null,
  })

  return NextResponse.json({ id: customer.id, created: true })
}
