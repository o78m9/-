import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { createClient } from '@/features/auth/lib/server'

// Strict YYYY-MM validation — rejects anything that is not a real calendar month.
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/

// UUID v4 format used for clinic IDs.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.api)
  if (limited) return limited

  const { searchParams } = req.nextUrl
  const monthParam = searchParams.get('month') // YYYY-MM
  const clinicIdParam = searchParams.get('clinic_id')

  // --- Input validation: month ---
  // Must be absent (use current month) or a valid YYYY-MM string.
  if (monthParam !== null && !MONTH_RE.test(monthParam)) {
    return NextResponse.json({ error: 'Invalid month parameter' }, { status: 400 })
  }

  // --- Input validation: month must not be in the future ---
  const now = new Date()
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  if (monthParam && monthParam > currentYM) {
    return NextResponse.json({ error: 'month cannot be in the future' }, { status: 400 })
  }

  // --- Input validation: clinic_id must be a UUID if provided ---
  if (clinicIdParam !== null && !UUID_RE.test(clinicIdParam)) {
    return NextResponse.json({ error: 'Invalid clinic_id' }, { status: 400 })
  }

  // Auth + IDOR guard
  let clinicId: string | null = clinicIdParam
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const metaClinicId = user.user_metadata?.clinic_id as string | undefined
      if (metaClinicId) {
        if (clinicIdParam && clinicIdParam !== metaClinicId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        clinicId = metaClinicId
      }
    } else if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    // Supabase not configured — local dev
  }

  if (!clinicId) {
    clinicId = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID ?? null
  }
  if (!clinicId) {
    return NextResponse.json({ error: 'clinic_id required' }, { status: 400 })
  }

  // Final guard: clinicId resolved from env or session must also be a UUID.
  if (!UUID_RE.test(clinicId)) {
    return NextResponse.json({ error: 'clinic_id required' }, { status: 400 })
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
  const sql = neon(process.env.DATABASE_URL)

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
    const [current, previous, unreached, segments, trend, top, clinicRow] = await Promise.all([
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
      // Top reactivated patients — return only the first word of the name to
      // minimise PII exposure in the aggregate report response.
      sql`
        SELECT
          SPLIT_PART(name, ' ', 1) AS name,
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
      topReactivated: (
        top as Array<{ name: string; last_visit: string; total_spent: number; status: string }>
      ).map((r) => ({
        name: r.name,
        lastVisit: r.last_visit,
        totalSpent: Number(r.total_spent),
        status: r.status,
      })),
    })
  } catch (err) {
    console.error('[roi-report]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
