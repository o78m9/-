import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { RoiReportQuerySchema } from '@/lib/schemas'
import { withClinic } from '@/shared/lib/db'
import { requireClinic, isClinicError } from '@/features/auth/lib/require-clinic'

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.api)
  if (limited) return limited

  const { searchParams } = req.nextUrl
  const parsed = RoiReportQuerySchema.safeParse({
    month: searchParams.get('month'),
    clinic_id: searchParams.get('clinic_id'),
  })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const monthParam = parsed.data.month ?? null
  const clinicIdParam = parsed.data.clinic_id ?? null

  // --- month must not be in the future ---
  const now = new Date()
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  if (monthParam && monthParam > currentYM) {
    return NextResponse.json({ error: 'month cannot be in the future' }, { status: 400 })
  }

  // APF-001 / AUB-001 / RTA-002 fix: requireClinic() now the single source of truth.
  // Closes the IDOR where empty user_metadata.clinic_id silently disabled the guard.
  const ctx = await requireClinic(req, { requestedClinicId: clinicIdParam })
  if (isClinicError(ctx)) return ctx
  const clinicId = ctx.clinicId

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  // Resolve month range
  const reportDate = monthParam ? new Date(`${monthParam}-01`) : now
  const monthStart = new Date(reportDate.getFullYear(), reportDate.getMonth(), 1).toISOString()
  const monthEnd = new Date(
    reportDate.getFullYear(),
    reportDate.getMonth() + 1,
    0,
    23,
    59,
    59,
  ).toISOString()
  const prevStart = new Date(reportDate.getFullYear(), reportDate.getMonth() - 1, 1).toISOString()
  const prevEnd = new Date(
    reportDate.getFullYear(),
    reportDate.getMonth(),
    0,
    23,
    59,
    59,
  ).toISOString()

  try {
    // CTO + CISO fix: wrap all queries in withClinic() so RLS policies (migration 004)
    // resolve to this tenant. Previously Promise.all over `neon()` ran each query in
    // its own HTTP request — no Postgres session, no SET LOCAL possible.
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
      // Current month reactivations
      sql`
        SELECT COUNT(*)::int AS count, COALESCE(SUM(total_spent), 0)::numeric AS revenue
        FROM customers
        WHERE clinic_id = ${clinicId}
          AND last_visit >= ${monthStart}
          AND last_visit <= ${monthEnd}
          AND EXISTS (
            SELECT 1 FROM visits v
            WHERE v.customer_id = customers.id
              AND v.date < ${monthStart}
          )
      `,
      // Previous month reactivations
      sql`
        SELECT COUNT(*)::int AS count, COALESCE(SUM(total_spent), 0)::numeric AS revenue
        FROM customers
        WHERE clinic_id = ${clinicId}
          AND last_visit >= ${prevStart}
          AND last_visit <= ${prevEnd}
          AND EXISTS (
            SELECT 1 FROM visits v
            WHERE v.customer_id = customers.id
              AND v.date < ${prevStart}
          )
      `,
      // Unreached dormant patients
      sql`
        SELECT COUNT(*)::int AS count, COALESCE(AVG(total_spent), 0)::numeric AS avg_spend
        FROM customers
        WHERE clinic_id = ${clinicId}
          AND status IN ('dormant', 'lost')
          AND (last_visit IS NULL OR last_visit < ${monthStart})
      `,
      // Segment breakdown
      sql`
        SELECT status, COUNT(*)::int AS count
        FROM customers
        WHERE clinic_id = ${clinicId}
        GROUP BY status
      `,
      // 6-month revenue trend
      sql`
        SELECT
          TO_CHAR(DATE_TRUNC('month', v.date), 'YYYY-MM') AS month,
          COALESCE(SUM(v.amount), 0)::numeric AS revenue,
          COUNT(DISTINCT v.customer_id)::int AS visit_count
        FROM visits v
        JOIN customers c ON c.id = v.customer_id
        WHERE c.clinic_id = ${clinicId}
          AND v.date >= NOW() - INTERVAL '6 months'
        GROUP BY 1
        ORDER BY 1
      `,
      // RTA-005 fix: first_name + last_visit + total_spent forms a quasi-
      // identifier that can re-identify with an external phonebook. Drop the
      // name entirely and bucket spend to the nearest 100 to limit
      // re-identification. k-anonymity (k>=5) is enforced after the query.
      sql`
        SELECT
          last_visit,
          total_spent,
          status
        FROM customers
        WHERE clinic_id = ${clinicId}
          AND last_visit >= ${monthStart}
          AND last_visit <= ${monthEnd}
        ORDER BY total_spent DESC
        LIMIT 10
      `,
      // Clinic name
      sql`SELECT name FROM clinics WHERE id = ${clinicId} LIMIT 1`,
    ])

    const unreachedRow = unreached[0] ?? { count: 0, avg_spend: 0 }
    const currentRow = current[0] ?? { count: 0, revenue: 0 }
    const previousRow = previous[0] ?? { count: 0, revenue: 0 }

    return NextResponse.json({
      reportMonth:
        monthParam ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      clinicName: clinicRow[0]?.name ?? 'العيادة',
      current: {
        reactivatedCount: currentRow.count,
        revenueRecovered: Number(currentRow.revenue),
        unreachedCount: unreachedRow.count,
        costOfInaction: Math.round(unreachedRow.count * Number(unreachedRow.avg_spend)),
      },
      previous: {
        reactivatedCount: previousRow.count,
        revenueRecovered: Number(previousRow.revenue),
      },
      segmentBreakdown: (segments as Array<{ status: string; count: number }>).map((r) => ({
        status: r.status,
        count: r.count,
      })),
      revenueTrend: (trend as Array<{ month: string; revenue: number; visit_count: number }>).map(
        (r) => ({
          month: r.month,
          revenue: Number(r.revenue),
          visitCount: r.visit_count,
        }),
      ),
      // RTA-005 k-anonymity gate. Only release per-row data when there are
      // at least 5 reactivations in the window — otherwise re-identification
      // is trivial from a single row.
      topReactivated:
        currentRow.count >= 5
          ? (top as Array<{ last_visit: string; total_spent: number; status: string }>).map(
              (r, idx) => ({
                rank: idx + 1,
                lastVisit: r.last_visit,
                totalSpent: Math.round(Number(r.total_spent) / 100) * 100,
                status: r.status,
              }),
            )
          : [],
      topReactivatedSuppressed: currentRow.count < 5,
    })
  } catch (err) {
    console.error('[roi-report]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
