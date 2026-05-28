import { sql } from '@/lib/db'
import { DashboardClient } from '@/components/dashboard'
import { createClient } from '@/lib/supabase/server'
import { aggregateStats } from '@/lib/stats'

const CLINIC_ID = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || ''

async function getServerData() {
  const empty = {
    stats: { total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 },
    customers: [] as {
      id: string
      name: string
      phone: string
      status: string
      last_visit?: string | null
      total_spent?: number
    }[],
  }

  if (!CLINIC_ID || !sql) return empty

  try {
    const [statRows, customerRows] = await Promise.all([
      sql`SELECT status FROM customers WHERE clinic_id = ${CLINIC_ID}`,
      sql`SELECT id, name, phone, status, last_visit, total_spent FROM customers WHERE clinic_id = ${CLINIC_ID} ORDER BY last_visit DESC NULLS LAST LIMIT 50`,
    ])

    const stats = aggregateStats(statRows as { status: string }[])

    return { stats, customers: customerRows as typeof empty.customers }
  } catch {
    return empty
  }
}

export default async function DashboardPage() {
  let stats = { total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 }
  let customers: {
    id: string
    name: string
    phone: string
    status: string
    last_visit?: string | null
    total_spent?: number
  }[] = []
  let user = null

  try {
    const [serverData, supabase] = await Promise.all([getServerData(), createClient()])
    stats = serverData.stats
    customers = serverData.customers
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase not configured or DB unavailable — render in demo mode
  }

  return (
    <DashboardClient
      realStats={stats}
      realCustomers={customers}
      hasClinicId={!!CLINIC_ID}
      isAuthenticated={!!user}
    />
  )
}
