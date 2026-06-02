import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { RoiReportClient } from '@/components/roi-report/RoiReportClient'
import { DEMO_ROI_DATA, type RoiReportData } from '@/components/roi-report/demo-roi-data'
import { createClient } from '@/features/auth/lib/server'
import { withClinic } from '@/shared/lib/db'

// Strict YYYY-MM validation — mirrors the API route guard.
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/

async function fetchRoiData(clinicId: string, month: string): Promise<RoiReportData> {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set')
  const parts = month.split('-')
  const yyyy = Number(parts[0])
  const mm = Number(parts[1])
  const monthStart = new Date(yyyy, mm - 1, 1).toISOString()
  const monthEnd = new Date(yyyy, mm, 0, 23, 59, 59).toISOString()
  const prevStart = new Date(yyyy, mm - 2, 1).toISOString()
  const prevEnd = new Date(yyyy, mm - 1, 0, 23, 59, 59).toISOString()

  // CTO + CISO fix: route queries through withClinic() for RLS scoping.
  const [current, previous, unreached, segments, trend, top, clinicRow] = await withClinic<
    [
      Array<{ count: number; revenue: number }>,
      Array<{ count: number; revenue: number }>,
      Array<{ count: number; avg_spend: number }>,
      Array<{ status: string; count: number }>,
      Array<{ month: string; revenue: number; visit_count: number }>,
      Array<{ last_visit: string; total_spent: number; status: string }>,
      Array<{ name: string }>,
    ]
  >(clinicId, (sql) => [
    sql`SELECT COUNT(*)::int AS count, COALESCE(SUM(total_spent),0)::numeric AS revenue FROM customers WHERE clinic_id=${clinicId} AND last_visit>=${monthStart} AND last_visit<=${monthEnd} AND EXISTS(SELECT 1 FROM visits v WHERE v.customer_id=customers.id AND v.date<${monthStart})`,
    sql`SELECT COUNT(*)::int AS count, COALESCE(SUM(total_spent),0)::numeric AS revenue FROM customers WHERE clinic_id=${clinicId} AND last_visit>=${prevStart} AND last_visit<=${prevEnd} AND EXISTS(SELECT 1 FROM visits v WHERE v.customer_id=customers.id AND v.date<${prevStart})`,
    sql`SELECT COUNT(*)::int AS count, COALESCE(AVG(total_spent),0)::numeric AS avg_spend FROM customers WHERE clinic_id=${clinicId} AND status IN ('dormant','lost') AND (last_visit IS NULL OR last_visit<${monthStart})`,
    sql`SELECT status, COUNT(*)::int AS count FROM customers WHERE clinic_id=${clinicId} GROUP BY status`,
    sql`SELECT TO_CHAR(DATE_TRUNC('month',v.date),'YYYY-MM') AS month, COALESCE(SUM(v.amount),0)::numeric AS revenue, COUNT(DISTINCT v.customer_id)::int AS visit_count FROM visits v JOIN customers c ON c.id=v.customer_id WHERE c.clinic_id=${clinicId} AND v.date>=NOW()-INTERVAL '6 months' GROUP BY 1 ORDER BY 1`,
    // RTA-005 fix (was REGRESSION here): drop name entirely. The API route does
    // not return names; this server page must match. Bucket spend to nearest 100
    // for re-identification resistance. k-anonymity enforced after the query.
    sql`SELECT last_visit, total_spent, status FROM customers WHERE clinic_id=${clinicId} AND last_visit>=${monthStart} AND last_visit<=${monthEnd} ORDER BY total_spent DESC LIMIT 10`,
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
    segmentBreakdown: segments.map((r) => ({
      status: r.status,
      count: r.count,
    })),
    revenueTrend: trend.map((r) => ({
      month: r.month,
      revenue: Number(r.revenue),
      visitCount: r.visit_count,
    })),
    // RTA-005 k-anonymity gate. Match the API route exactly.
    topReactivated:
      c.count >= 5
        ? top.map((r, idx) => ({
            rank: idx + 1,
            lastVisit: r.last_visit,
            totalSpent: Math.round(Number(r.total_spent) / 100) * 100,
            status: r.status,
          }))
        : [],
    topReactivatedSuppressed: c.count < 5,
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

  // CTO fix: this server page was MISSING auth + IDOR guard. Previously read
  // user_metadata.clinic_id directly — that was the RTA-002 pattern. Now uses
  // app_metadata via the same resolver as /dashboard. No fallback to demo env
  // for authenticated users without app_metadata.clinic_id; render empty state.
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

      const app = (user.app_metadata as { clinic_id?: unknown } | null)?.clinic_id
      if (typeof app === 'string' && app.length > 0) {
        clinicId = app
      } else {
        // Authenticated but no app_metadata clinic — show demo until backfill runs.
        return (
          <Suspense>
            <RoiReportClient data={DEMO_ROI_DATA} />
          </Suspense>
        )
      }
    } catch {
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
