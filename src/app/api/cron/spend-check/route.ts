/**
 * COO automation — every 15 min: scan audit_log for the last day, aggregate
 * estInputTokens by clinic, page on threshold breaches.
 *
 * Auth: same pattern as prune-audit (x-vercel-cron header + CRON_SECRET bearer).
 *
 * Output: emits one Sentry breadcrumb per clinic over 50% of cap, one Sentry
 * error per clinic over 80%. At 100% the per-clinic claude-budget already
 * returns 429 — this cron is the observability layer above that.
 */
import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { timingSafeEqual } from 'node:crypto'
import * as Sentry from '@sentry/nextjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_CAP = 25_000

function safeAuthEq(provided: string | null, expected: string): boolean {
  if (!provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function GET(req: NextRequest) {
  // CPS-003 same pattern: require x-vercel-cron header + CRON_SECRET bearer.
  const isVercelCron = req.headers.get('x-vercel-cron') === '1'
  const isDev = process.env.VERCEL_ENV !== 'production' && process.env.NODE_ENV !== 'production'
  if (!isVercelCron && !isDev) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret || !safeAuthEq(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 })
  }

  const cap = Number(process.env.CLAUDE_TOKENS_PER_CLINIC_PER_DAY) || DEFAULT_CAP
  const warnAt = Math.floor(cap * 0.5)
  const errorAt = Math.floor(cap * 0.8)

  const sql = neon(dbUrl)
  // SUM(estInputTokens) from audit metadata + count of message.generate calls.
  const rows = (await sql`
    SELECT
      clinic_id,
      COUNT(*) FILTER (WHERE action IN ('customer.import', 'customer.import.applied'))::int AS imports,
      COUNT(*) FILTER (WHERE action = 'message.generate')::int AS generations,
      COALESCE(SUM((metadata ->> 'estInputTokens')::int), 0)::int AS est_tokens
    FROM audit_log
    WHERE created_at > now() - interval '1 day'
      AND clinic_id IS NOT NULL
      AND action IN ('customer.import', 'customer.import.applied', 'message.generate')
    GROUP BY clinic_id
  `) as Array<{ clinic_id: string; imports: number; generations: number; est_tokens: number }>

  const overWarn: typeof rows = []
  const overError: typeof rows = []

  for (const row of rows) {
    if (row.est_tokens >= errorAt) {
      overError.push(row)
      Sentry.captureMessage('claude-budget-near-cap', {
        level: 'error',
        tags: { component: 'spend-check', clinic_id: row.clinic_id },
        extra: { ...row, cap, percent: Math.round((row.est_tokens / cap) * 100) },
      })
    } else if (row.est_tokens >= warnAt) {
      overWarn.push(row)
      Sentry.captureMessage('claude-budget-50-percent', {
        level: 'warning',
        tags: { component: 'spend-check', clinic_id: row.clinic_id },
        extra: { ...row, cap, percent: Math.round((row.est_tokens / cap) * 100) },
      })
    }
  }

  await Sentry.flush(2000)

  return NextResponse.json({
    scannedClinics: rows.length,
    overWarn: overWarn.length,
    overError: overError.length,
    cap,
  })
}
