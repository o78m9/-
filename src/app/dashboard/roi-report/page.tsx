import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { RoiReportClient } from '@/components/roi-report/RoiReportClient'
import { DEMO_ROI_DATA, type RoiReportData } from '@/components/roi-report/demo-roi-data'
import { createClient } from '@/features/auth/lib/server'
import { neon } from '@neondatabase/serverless'

// Strict YYYY-MM validation — mirrors the API route guard.
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/

async function fetchRoiData(clinicId: string, month: string): Promise<RoiReportData> {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set')
  const sql = neon(process.env.DATABASE_URL)
  const parts = month.split('-')
  const yyyy = Number(parts[0])
  const mm = Number(parts[1])
  const monthStart = new Date(yyyy, mm - 1, 1).toISOString()
  const monthEnd = new Date(yyyy, mm, 0, 23, 59, 59).toISOString()
  const prevStart = new Date(yyyy, mm - 2, 1).toISOString()
  const prevEnd = new Date(yyyy, mm - 1, 0, 23, 59, 59).toISOString()

  const [current, previous, unreached, segments, trend, top, clinicRow] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count, COALESCE(SUM(total_spent),0)::numeric AS revenue FROM customers WHERE clinic_id=${clinicId} AND last_visit>=${monthStart} AND last_visit<=${monthEnd} AND EXISTS(SELECT 1 FROM visits v WHERE v.customer_id=customers.id AND v.date<${monthStart})`,
    sql`SELECT COUNT(*)::int AS count, COALESCE(SUM(total_spent),0)::numeric AS revenue FROM customers WHERE clinic_id=${clinicId} AND last_visit>=${prevStart} AND last_visit<=${prevEnd} AND EXISTS(SELECT 1 FROM visits v WHERE v.customer_id=customers.id AND v.date<${prevStart})`,
    sql`SELECT COUNT(*)::int AS count, COALESCE(AVG(total_spent),0)::numeric AS avg_spend FROM customers WHERE clinic_id=${clinicId} AND status IN ('dormant','lost') AND (last_visit IS NULL OR last_visit<${monthStart})`,
    sql`SELECT status, COUNT(*)::int AS count FROM customers WHERE clinic_id=${clinicId} GROUP BY status`,
    sql`SELECT TO_CHAR(DATE_TRUNC('month',v.date),'YYYY-MM') AS month, COALESCE(SUM(v.amount),0)::numeric AS revenue, COUNT(DISTINCT v.customer_id)::int AS visit_count FROM visits v JOIN customers c ON c.id=v.customer_id WHERE c.clinic_id=${clinicId} AND v.date>=NOW()-INTERVAL '6 months' GROUP BY 1 ORDER BY 1`,
    sql`SELECT SPLIT_PART(name, ' ', 1) AS name, last_visit, total_spent, status FROM customers WHERE clinic_id=${clinicId} AND last_visit>=${monthStart} AND last_visit<=${monthEnd} ORDER BY total_spent DESC LIMIT 10`,
    sql`SELECT name FROM clinics WHERE id=${clinicId} LIMIT 1`,
  ])

  const c = current[0] ?? { count: 0, revenue: 0 }
  const p = previous[0] ?? { count: 0, revenue: 0 }
  const u = unreached[0] ?? { count: 0, avg_spend: 0 }

  return {
    reportMonth: month,
    clinicName: clinicRow[0]?.name ?? 'العيادة',
    current: {
      reactivatedCount: c.count,
      revenueRecovered: Number(c.revenue),
      unreachedCount: u.count,
      costOfInaction: Math.round(u.count * Number(u.avg_spend)),
    },
    previous: { reactivatedCount: p.count, revenueRecovered: Number(p.revenue) },
    segmentBreakdown: (segments as Array<{ status: string; count: number }>).map((r) => ({
      status: r.status,
      count: r.count,
    })),
    revenueTrend: (trend as Array<{ month: string; revenue: number; visit_count: number }>).map(
      (r) => ({ month: r.month, revenue: Number(r.revenue), visitCount: r.visit_count }),
    ),
    topReactivated: (
      top as Array<{ name: string; last_visit: string; total_spent: number; status: string }>
    ).map((r) => ({
      name: r.name,
      lastVisit: r.last_visit,
      totalSpent: Number(r.total_spent),
      status: r.status,
    })),
  }
}

export default async function RoiReportPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const params = await searchParams
  const now = new Date()
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // --- Input validation: month ---
  const rawMonth = params.month
  let month: string
  if (!rawMonth) {
    month = currentYM
  } else if (!MONTH_RE.test(rawMonth) || rawMonth > currentYM) {
    // Reject malformed or future month params — redirect to current month.
    redirect(`/dashboard/roi-report`)
  } else {
    month = rawMonth
  }

  // --- Authentication: require a logged-in user ---
  // Resolve clinicId from the authenticated session first; fall back to the
  // demo env var only when Supabase is not configured (local dev).
  let clinicId: string | null = null

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        redirect('/login')
      }

      /* eslint-disable-next-line no-restricted-syntax -- RTA-002 deferred swap, awaiting backfill (Action #2). Remove with Action #3. */
      clinicId = (user.user_metadata?.clinic_id as string | undefined) ?? null

      if (!clinicId) {
        // Authenticated but no clinic assigned — show demo rather than crash.
        return (
          <Suspense>
            <RoiReportClient data={DEMO_ROI_DATA} />
          </Suspense>
        )
      }
    } catch {
      // Supabase client error — treat as unauthenticated.
      redirect('/login')
    }
  } else {
    // Supabase not configured — local dev mode.
    clinicId = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID ?? null
  }

  let data: RoiReportData = DEMO_ROI_DATA
  if (clinicId && process.env.DATABASE_URL) {
    try {
      data = await fetchRoiData(clinicId, month)
    } catch {
      data = DEMO_ROI_DATA
    }
  }

  return (
    <Suspense>
      <RoiReportClient data={data} />
    </Suspense>
  )
}
