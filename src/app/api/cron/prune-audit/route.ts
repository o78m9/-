import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

/**
 * PDPL 12-month retention enforcement for audit_log.
 * Scheduled via Vercel Cron (see vercel.json).
 *
 * Auth: requires the secret `CRON_SECRET` env var as `Authorization: Bearer <secret>`.
 * Vercel Cron automatically sends this header when configured at the project level.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret || auth !== `Bearer ${secret}`) {
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
