import { sql } from '@/lib/supabase'
import { DashboardClient } from '@/components/dashboard'

const CLINIC_ID = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || ''

async function getServerData() {
  const empty = {
    stats: { total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 },
    customers: [] as { id: string; name: string; phone: string; status: string; last_visit?: string | null; total_spent?: number }[],
  }

  if (!CLINIC_ID || !sql) return empty

  try {
    const [statRows, customerRows] = await Promise.all([
      sql`SELECT status FROM customers WHERE clinic_id = ${CLINIC_ID}`,
      sql`SELECT id, name, phone, status, last_visit, total_spent FROM customers WHERE clinic_id = ${CLINIC_ID} ORDER BY last_visit DESC NULLS LAST LIMIT 50`,
    ])

    const stats = { total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 }
    ;(statRows as { status: string }[]).forEach((r) => {
      stats.total++
      const k = r.status as keyof typeof stats
      if (k in stats) stats[k]++
    })

    return { stats, customers: customerRows as typeof empty.customers }
  } catch {
    return empty
  }
}

export default async function HomePage() {
  const { stats, customers } = await getServerData()

  return (
    <DashboardClient
      realStats={stats}
      realCustomers={customers}
      hasClinicId={!!CLINIC_ID}
    />
  )
}
