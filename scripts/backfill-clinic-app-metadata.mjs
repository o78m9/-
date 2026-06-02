#!/usr/bin/env node
/**
 * Action #2 — Backfill user.app_metadata.clinic_id for existing users.
 *
 * Why: RTA-002 fix moves the authoritative clinic_id from user_metadata
 * (user-writable) to app_metadata (admin-only writable). Existing users
 * currently have it only in user_metadata. Without this backfill, the
 * cutover would 403 every authenticated user.
 *
 * Behaviour:
 *   - Idempotent. Re-runs are safe.
 *   - Reads every user via Supabase Admin API (paginated).
 *   - For each user with user_metadata.clinic_id set:
 *       - If app_metadata.clinic_id already matches → SKIP
 *       - If app_metadata.clinic_id exists but differs → WARN + skip + record for human review
 *       - Else → update app_metadata.clinic_id = user_metadata.clinic_id
 *   - Users with no clinic_id anywhere → record as ORPHAN (likely need manual assignment).
 *   - Reports a summary that the CTO can verify before swap.
 *
 * Required env:
 *   SUPABASE_URL                 — project URL
 *   SUPABASE_SERVICE_ROLE_KEY    — service role (NEVER expose client-side)
 *
 * Flags:
 *   --dry-run                    — print plan, do not mutate. DEFAULT.
 *   --apply                      — actually write changes.
 *   --report=<path>              — write JSON report (default: docs/security/redteam-app/backfill-report.json)
 *
 * Usage:
 *   node scripts/backfill-clinic-app-metadata.mjs                   # dry-run
 *   node scripts/backfill-clinic-app-metadata.mjs --apply           # live
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const args = new Set(process.argv.slice(2))
const dryRun = !args.has('--apply')
const reportArg = [...args].find((a) => a.startsWith('--report='))
const reportPath = reportArg
  ? reportArg.slice('--report='.length)
  : 'docs/security/redteam-app/backfill-report.json'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('FATAL: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in env.')
  process.exit(64)
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const counters = {
  scanned: 0,
  already_correct: 0,
  backfilled: 0,
  divergent_skipped: 0,
  orphan: 0,
  invalid_uuid: 0,
  errors: 0,
}

const divergent = []
const orphans = []
const errors = []

async function adminFetch(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    throw new Error(`Admin API ${res.status} ${res.statusText} on ${path}`)
  }
  return res.json()
}

async function listUsers(page, perPage = 200) {
  return adminFetch(`/auth/v1/admin/users?page=${page}&per_page=${perPage}`)
}

async function updateAppMetadata(userId, appMetadata) {
  return adminFetch(`/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ app_metadata: appMetadata }),
  })
}

async function main() {
  console.log(`[backfill] mode=${dryRun ? 'DRY-RUN' : 'APPLY'}  url=${SUPABASE_URL}`)
  let page = 1
  while (true) {
    const result = await listUsers(page)
    const users = result.users ?? []
    if (users.length === 0) break

    for (const u of users) {
      counters.scanned++
      const userClinic = u.user_metadata?.clinic_id
      const appClinic = u.app_metadata?.clinic_id

      if (typeof userClinic !== 'string' && typeof appClinic !== 'string') {
        counters.orphan++
        orphans.push({ id: u.id, email: u.email ?? null })
        continue
      }

      if (typeof appClinic === 'string') {
        if (typeof userClinic === 'string' && appClinic !== userClinic) {
          counters.divergent_skipped++
          divergent.push({
            id: u.id,
            email: u.email ?? null,
            app: appClinic,
            user: userClinic,
          })
          continue
        }
        counters.already_correct++
        continue
      }

      if (!UUID_RE.test(userClinic)) {
        counters.invalid_uuid++
        errors.push({ id: u.id, email: u.email ?? null, value: userClinic })
        continue
      }

      if (dryRun) {
        counters.backfilled++
        continue
      }

      try {
        await updateAppMetadata(u.id, { ...u.app_metadata, clinic_id: userClinic })
        counters.backfilled++
      } catch (err) {
        counters.errors++
        errors.push({ id: u.id, email: u.email ?? null, error: String(err) })
      }
    }

    page++
    if (!result.next_page) break
  }

  const summary = {
    mode: dryRun ? 'dry-run' : 'apply',
    generated_at: new Date().toISOString(),
    counters,
    divergent,
    orphans,
    errors,
  }

  const out = resolve(process.cwd(), reportPath)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, JSON.stringify(summary, null, 2), 'utf8')
  console.log(`[backfill] report → ${out}`)
  console.log(JSON.stringify(counters, null, 2))

  if (divergent.length > 0) {
    console.warn(`[backfill] ${divergent.length} DIVERGENT user(s) — human review required.`)
    process.exit(3)
  }
  if (errors.length > 0) {
    console.warn(`[backfill] ${errors.length} error(s) — see report.`)
    process.exit(4)
  }
}

main().catch((e) => {
  console.error(`[backfill] FATAL: ${e.stack || e.message}`)
  process.exit(1)
})
