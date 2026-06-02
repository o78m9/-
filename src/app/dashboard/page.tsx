import { withClinic } from '@/shared/lib/db'
import { DashboardClient } from '@/components/dashboard'
import { createClient } from '@/lib/supabase/server'
import { aggregateStats } from '@/lib/stats'

// AUB-003 fix: dashboard MUST scope to the authenticated user's clinic_id,
// resolved from app_metadata via the same priority rules as requireClinic().
// The previous implementation hard-coded NEXT_PUBLIC_DEMO_CLINIC_ID for every
// tenant, leaking the demo clinic's 50 patients to every paying clinic.

type CustomerRow = {
  id: string
  name: string
  phone: string
  status: string
  last_visit?: string | null
  total_spent?: number
}

async function resolveClinicIdForUser(
  user: { app_metadata?: unknown } | null,
): Promise<string | null> {
  if (!user) return process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || null
  // AUB-003 fix: read app_metadata only (admin-only writable, trustworthy).
  // user_metadata is forgeable per RTA-002 and must not gate display.
  const app = (user.app_metadata as { clinic_id?: unknown } | null)?.clinic_id
  if (typeof app === 'string' && app.length > 0) return app
  // Authenticated but no clinic context — render empty state.
  // Users predating the app_metadata backfill will see an empty dashboard until
  // scripts/backfill-clinic-app-metadata.mjs runs in their cohort.
  return null
}

async function getServerData(clinicId: string | null) {
  const empty = {
    stats: { total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 },
    customers: [] as CustomerRow[],
  }

  if (!clinicId) return empty

  try {
    // CTO + CISO fix: route DB queries through withClinic() so RLS policies
    // see the right tenant via SET LOCAL app.clinic_id.
    const [statRows, customerRows] = await withClinic<[Array<{ status: string }>, CustomerRow[]]>(
      clinicId,
      (sql) => [
        sql`SELECT status FROM customers WHERE clinic_id = ${clinicId}`,
        sql`SELECT id, name, phone, status, last_visit, total_spent FROM customers WHERE clinic_id = ${clinicId} ORDER BY last_visit DESC NULLS LAST LIMIT 50`,
      ],
    )
    const stats = aggregateStats(statRows)
    return { stats, customers: customerRows }
  } catch {
    return empty
  }
}

export default async function DashboardPage() {
  let stats = { total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 }
  let customers: CustomerRow[] = []
  let user = null
  let clinicId: string | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
    clinicId = await resolveClinicIdForUser(user)
    const serverData = await getServerData(clinicId)
    stats = serverData.stats
    customers = serverData.customers
  } catch {
    // Supabase not configured or DB unavailable — render in demo mode
  }

  return (
    <DashboardClient
      realStats={stats}
      realCustomers={customers}
      hasClinicId={!!clinicId}
      isAuthenticated={!!user}
    />
  )
}
