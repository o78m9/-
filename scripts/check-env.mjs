#!/usr/bin/env node
/**
 * CPS-012 / APP-MISCONF-001 fix: build-time assertion that all production-
 * required env vars are present BEFORE `next build` runs.
 *
 * Wire into package.json: "build": "node scripts/check-env.mjs && next build"
 *
 * Behaviour:
 *   - VERCEL_ENV=production AND any required var missing → exit 2 (build fails)
 *   - VERCEL_ENV=preview AND any preview-required var missing → exit 2
 *   - Otherwise warnings only
 */

const RULES = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', reason: 'middleware auth gate', envs: ['production', 'preview'] },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', reason: 'middleware auth gate', envs: ['production', 'preview'] },
  { name: 'DATABASE_URL', reason: 'Neon connection', envs: ['production', 'preview'] },
  { name: 'ANTHROPIC_API_KEY', reason: 'AI generation + import cleaning', envs: ['production', 'preview'] },
  { name: 'CRON_SECRET', reason: '/api/cron/prune-audit auth', envs: ['production'] },
  { name: 'COOKIE_SIGNING_SECRET', reason: 'demo cookie HMAC', envs: ['production', 'preview'] },
  { name: 'UPSTASH_REDIS_REST_URL', reason: 'distributed rate-limit + budget', envs: ['production'] },
  { name: 'UPSTASH_REDIS_REST_TOKEN', reason: 'distributed rate-limit + budget', envs: ['production'] },
]

const env = process.env.VERCEL_ENV ?? 'development'
const isCi = env !== 'development'

const missing = RULES.filter((r) => r.envs.includes(env) && !process.env[r.name])

if (missing.length > 0) {
  console.error(`[check-env] ${missing.length} required env var(s) missing for VERCEL_ENV=${env}:`)
  for (const r of missing) {
    console.error(`  - ${r.name}  — ${r.reason}`)
  }
  if (isCi) {
    console.error('[check-env] Build aborted.')
    process.exit(2)
  }
}

if (env === 'production' && process.env.NEXT_PUBLIC_DEMO_CLINIC_ID) {
  console.error(
    '[check-env] WARNING: NEXT_PUBLIC_DEMO_CLINIC_ID is set in production. Unset it in the Vercel dashboard (CPS-002).',
  )
  if (process.env.STRICT_CHECK_ENV === '1') process.exit(2)
}

console.log(`[check-env] ✓ env check passed for VERCEL_ENV=${env}`)
