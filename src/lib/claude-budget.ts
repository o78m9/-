/**
 * APF-002 / APF-008 / PIR-007 fix: per-clinic daily Anthropic-token budget.
 *
 * Distributed counter via Upstash Redis (when configured), with a fail-closed
 * in-memory fallback for local dev. A single attacker today could burn ~$1K/day
 * against the shared Anthropic key via /api/import + /api/generate-message;
 * this caps that at CLAUDE_TOKENS_PER_CLINIC_PER_DAY (default 200_000).
 *
 * Key format: `claude-budget:<clinic_id>:<YYYY-MM-DD>` with 48h TTL so day-edge
 * spend rolls over cleanly without losing the previous day's count immediately.
 */

interface BudgetResult {
  ok: boolean
  spentToday: number
  cap: number
}

const DEFAULT_CAP_PER_DAY = 200_000

function todayKey(clinicId: string): string {
  const d = new Date().toISOString().slice(0, 10)
  return `claude-budget:${clinicId}:${d}`
}

function cap(): number {
  const env = Number(process.env.CLAUDE_TOKENS_PER_CLINIC_PER_DAY)
  return Number.isFinite(env) && env > 0 ? env : DEFAULT_CAP_PER_DAY
}

// In-memory fallback for local dev / when Upstash absent. Per-instance — NOT
// suitable for multi-region prod (fail-closed if Upstash missing in prod).
const _memStore = new Map<string, { spent: number; expiresAt: number }>()

function chargeMemory(key: string, tokens: number, limit: number): BudgetResult {
  const now = Date.now()
  const entry = _memStore.get(key)
  if (!entry || now > entry.expiresAt) {
    _memStore.set(key, { spent: tokens, expiresAt: now + 48 * 3600 * 1000 })
    return { ok: tokens <= limit, spentToday: tokens, cap: limit }
  }
  entry.spent += tokens
  return { ok: entry.spent <= limit, spentToday: entry.spent, cap: limit }
}

async function chargeUpstash(key: string, tokens: number, limit: number): Promise<BudgetResult> {
  const { Redis } = await import('@upstash/redis')
  const redis = Redis.fromEnv()
  const spent = await redis.incrby(key, tokens)
  if (spent === tokens) {
    // First increment of the day — set 48h TTL.
    await redis.expire(key, 48 * 3600)
  }
  return { ok: spent <= limit, spentToday: spent, cap: limit }
}

/**
 * Charge `tokens` against the clinic's daily Anthropic budget. Call BEFORE the
 * Anthropic API request so an attacker can't burn budget on a request that's
 * already over the cap.
 *
 * Returns `{ ok: false }` when the cap is exceeded — caller should 429.
 */
export async function chargeClinicTokens(clinicId: string, tokens: number): Promise<BudgetResult> {
  const key = todayKey(clinicId)
  const limit = cap()

  const upstashConfigured =
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

  if (upstashConfigured) {
    try {
      return await chargeUpstash(key, tokens, limit)
    } catch {
      // Redis failure on a cost-control path: fail closed in prod, allow in dev.
      if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
        return { ok: false, spentToday: limit + tokens, cap: limit }
      }
      return chargeMemory(key, tokens, limit)
    }
  }

  // No Upstash: fall back to in-memory in dev. In prod, refuse.
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return { ok: false, spentToday: limit + tokens, cap: limit }
  }
  return chargeMemory(key, tokens, limit)
}

/** Rough token estimate from input length. 1 token ≈ 4 chars for English/Arabic mixed text. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
