#!/usr/bin/env node
/**
 * PDPL 12-month retention enforcement for audit_log.
 * Schedule via cron (Vercel Cron, GitHub Actions, etc):
 *   0 3 * * 0  node scripts/prune-audit-log.mjs
 */
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

const sql = neon(url)
const result = await sql`
  DELETE FROM audit_log WHERE created_at < now() - interval '12 months'
  RETURNING id
`
console.log(`✅ Pruned ${result.length} audit_log rows older than 12 months`)
