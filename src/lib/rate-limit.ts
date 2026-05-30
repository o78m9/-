import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// Distributed rate limiter using Upstash Redis when configured.
// Falls back to an in-memory Map for local dev / environments without Redis.
//
// IMPORTANT: The in-memory fallback is NOT suitable for multi-instance
// production deployments — each serverless instance has its own Map, so the
// effective limit per window is (max * instance_count).
// Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in your env to enable
// distributed rate limiting across all instances.
// ---------------------------------------------------------------------------

interface RateLimitOptions {
  windowMs: number
  max: number
}

// ---------------------------------------------------------------------------
// Upstash Redis distributed limiter (production-grade)
// ---------------------------------------------------------------------------
async function rateLimitUpstash(
  key: string,
  opts: RateLimitOptions,
): Promise<{ limited: boolean; remaining: number; resetAt: number }> {
  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')

  const redis = Redis.fromEnv()
  const windowSeconds = Math.ceil(opts.windowMs / 1000)
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(opts.max, `${windowSeconds} s`),
    analytics: false,
  })

  const { success, remaining, reset } = await limiter.limit(key)
  return { limited: !success, remaining, resetAt: reset }
}

// ---------------------------------------------------------------------------
// In-memory fallback limiter (dev / single-instance only)
// ---------------------------------------------------------------------------
const _memStore = new Map<string, { count: number; resetAt: number }>()

function rateLimitMemory(
  key: string,
  opts: RateLimitOptions,
): { limited: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = _memStore.get(key)

  if (!entry || now > entry.resetAt) {
    _memStore.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { limited: false, remaining: opts.max - 1, resetAt: now + opts.windowMs }
  }

  entry.count++
  const limited = entry.count > opts.max
  return {
    limited,
    remaining: Math.max(0, opts.max - entry.count),
    resetAt: entry.resetAt,
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function rateLimit(
  req: NextRequest,
  opts: RateLimitOptions,
): Promise<NextResponse | null> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const key = `rl:${req.nextUrl.pathname}:${ip}`

  let limited = false
  let _remaining = opts.max
  let resetAt = Date.now() + opts.windowMs

  try {
    const upstashConfigured =
      !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

    if (upstashConfigured) {
      const result = await rateLimitUpstash(key, opts)
      limited = result.limited
      _remaining = result.remaining
      resetAt = result.resetAt
    } else {
      const result = rateLimitMemory(key, opts)
      limited = result.limited
      _remaining = result.remaining
      resetAt = result.resetAt
    }
  } catch (err) {
    // If Redis is unavailable, fail open (allow request) rather than blocking all traffic.
    // Log the error so the team knows to investigate.
    console.error('[rate-limit] Redis error — failing open:', err)
    return null
  }

  if (limited) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(opts.max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
        },
      },
    )
  }

  return null
}

// Route-specific presets
export const LIMITS = {
  api: { windowMs: 60_000, max: 60 },
  ai: { windowMs: 60_000, max: 10 },
  import: { windowMs: 60_000, max: 5 },
  auth: { windowMs: 60_000, max: 20 },
} as const
