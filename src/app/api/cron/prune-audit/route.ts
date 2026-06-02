import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { timingSafeEqual } from 'node:crypto'

/**
 * PDPL 12-month retention enforcement for audit_log.
 * Scheduled via Vercel Cron (see vercel.json).
 *
 * Auth: requires the secret `CRON_SECRET` env var as `Authorization: Bearer <secret>`.
 * Vercel Cron automatically sends this header when configured at the project level.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// RTA-004 fix: constant-time compare to defeat timing side-channel on shared secret.
function safeAuthEq(provided: string | null, expected: string): boolean {
  if (!provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function GET(req: NextRequest) {
  // CPS-003 fix: bind to the Vercel Cron channel. Vercel auto-injects
  // `x-vercel-cron: 1` on platform cron invocations and edge-strips any
  // client-supplied copy. Combined with the bearer check this requires both
  // (a) possession of CRON_SECRET AND (b) the request originating from
  // Vercel Cron — blocks external replay of leaked secrets.
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

  const sql = neon(dbUrl)
  const deleted = await sql`
    DELETE FROM audit_log WHERE created_at < now() - interval '12 months'
    RETURNING id
  `

  return NextResponse.json({ pruned: deleted.length })
}
