/**
 * PDPL portability endpoint — exports all data for the caller's clinic as JSON.
 *
 * Auth: required (Supabase) + requireClinic() resolves the tenant.
 * Rate limit: LIMITS.import (5/min, failClosed) so we don't become a covert
 * Anthropic cost amplifier or a tenant DoS via repeated large dumps.
 * Audit: every call writes `customer.export` with row counts.
 */
import { type NextRequest, NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'
import { withClinic } from '@/shared/lib/db'
import { requireClinic, isClinicError } from '@/features/auth/lib/require-clinic'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.import)
  if (limited) return limited

  const ctx = await requireClinic(req)
  if (isClinicError(ctx)) return ctx
  const tenant = ctx.clinicId

  const [clinic, customers, visits, messages, attribution] = await withClinic<
    [
      Array<{ id: string; name: string; owner: string | null; phone: string | null }>,
      Array<{
        id: string
        name: string
        phone: string
        email: string | null
        first_visit: string | null
        last_visit: string | null
        total_spent: number | null
        status: string
        tags: string[] | null
        notes: string | null
      }>,
      Array<{
        id: string
        customer_id: string
        date: string
        service: string | null
        amount: number | null
        notes: string | null
      }>,
      Array<{
        id: string
        customer_id: string
        template_slug: string
        status: string
        sent_at: string | null
        delivered_at: string | null
        read_at: string | null
      }>,
      Array<{ id: string; visit_id: string; message_id: string | null; reason: string }>,
    ]
  >(tenant, (sql) => [
    sql`SELECT id, name, owner, phone FROM clinics WHERE id = ${tenant} LIMIT 1`,
    sql`SELECT id, name, phone, email, first_visit, last_visit, total_spent, status, tags, notes FROM customers WHERE clinic_id = ${tenant} ORDER BY created_at ASC`,
    sql`SELECT v.id, v.customer_id, v.date, v.service, v.amount, v.notes FROM visits v JOIN customers c ON c.id = v.customer_id WHERE c.clinic_id = ${tenant} ORDER BY v.date ASC`,
    sql`SELECT id, customer_id, template_slug, status, sent_at, delivered_at, read_at FROM messages WHERE clinic_id = ${tenant}::text ORDER BY created_at ASC`,
    sql`SELECT id, visit_id, message_id, reason FROM attribution_disputes WHERE clinic_id = ${tenant}::text ORDER BY filed_at ASC`,
  ])

  await logAudit(req, {
    userId: ctx.userId,
    clinicId: tenant,
    action: 'customer.export',
    resource: 'clinic',
    metadata: {
      customers: customers.length,
      visits: visits.length,
      messages: messages.length,
      attribution: attribution.length,
    },
  })

  return NextResponse.json(
    {
      exportVersion: '2026-06-02',
      generatedAt: new Date().toISOString(),
      clinic: clinic[0] ?? null,
      customers,
      visits,
      messages,
      attribution,
      compliance: {
        notice:
          'This export complies with Jordan PDPL Art. 11 portability and GDPR Art. 20. Retain for ≤30 days.',
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Disposition': `attachment; filename="aooda-export-${tenant}-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    },
  )
}
