#!/usr/bin/env node
/**
 * Action #7 — Scan audit_log for any sign of RTA-002 exploitation.
 *
 * Looks for cross-clinic activity by a single user in the last N days.
 * A user who legitimately switches clinics is rare; one who writes to
 * multiple clinic_ids in a short window is suspicious.
 *
 * Required env:
 *   DATABASE_URL — Neon connection string
 *
 * Flags:
 *   --days=30                — lookback window (default 30)
 *   --report=<path>          — JSON report path
 *
 * Exit codes:
 *   0  — clean
 *   2  — suspicious activity found (notify cs-ciso + cs-gc within 72h)
 */

import { neon } from '@neondatabase/serverless'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, dflt) => {
  const a = args.find((x) => x.startsWith(`--${name}=`))
  return a ? a.slice(`--${name}=`.length) : dflt
}
const days = Number(flag('days', '30'))
const reportPath = flag('report', 'docs/security/redteam-app/audit-scan-report.json')

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.error('FATAL: DATABASE_URL not set.')
  process.exit(64)
}
const sql = neon(dbUrl)

async function main() {
  const since = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString()

  // 1. Users who touched >1 clinic in the window.
  const multiClinic = await sql`
    SELECT
      user_id,
      ARRAY_AGG(DISTINCT clinic_id) AS clinics,
      COUNT(*)::int AS actions,
      MIN(created_at) AS first_action,
      MAX(created_at) AS last_action
    FROM audit_log
    WHERE created_at >= ${since}
      AND user_id IS NOT NULL
      AND clinic_id IS NOT NULL
    GROUP BY user_id
    HAVING COUNT(DISTINCT clinic_id) > 1
    ORDER BY COUNT(DISTINCT clinic_id) DESC, COUNT(*) DESC
  `

  // 2. Writes (customer.create / customer.update / customer.import) by user
  //    cross-referenced to the user's app_metadata clinic at the time isn't
  //    possible from logs alone — that requires joining Supabase user state.
  //    Flag aggressively for human review.

  // 3. Velocity check: any user with >100 actions across multiple clinics in <1h
  const burst = await sql`
    WITH windows AS (
      SELECT
        user_id,
        clinic_id,
        DATE_TRUNC('hour', created_at) AS bucket,
        COUNT(*)::int AS actions
      FROM audit_log
      WHERE created_at >= ${since}
        AND user_id IS NOT NULL
        AND clinic_id IS NOT NULL
      GROUP BY 1, 2, 3
    )
    SELECT user_id, bucket, ARRAY_AGG(clinic_id) AS clinics, SUM(actions)::int AS total
    FROM windows
    GROUP BY user_id, bucket
    HAVING COUNT(DISTINCT clinic_id) > 1 AND SUM(actions) > 50
    ORDER BY total DESC
  `

  const report = {
    generated_at: new Date().toISOString(),
    window_days: days,
    since,
    multi_clinic_users: multiClinic,
    burst_anomalies: burst,
    suspicious: multiClinic.length > 0 || burst.length > 0,
  }

  const out = resolve(process.cwd(), reportPath)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, JSON.stringify(report, null, 2), 'utf8')
  console.log(`[audit-scan] report → ${out}`)
  console.log(
    `[audit-scan] multi_clinic_users=${multiClinic.length} burst_anomalies=${burst.length}`,
  )

  if (report.suspicious) {
    console.warn('[audit-scan] SUSPICIOUS ACTIVITY FOUND — escalate to cs-ciso + cs-gc within 72h.')
    process.exit(2)
  }
}

main().catch((e) => {
  console.error(`[audit-scan] FATAL: ${e.stack || e.message}`)
  process.exit(1)
})
