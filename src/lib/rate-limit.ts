import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// In-memory rate limiter (no Redis required in dev/demo)
// Replace with @upstash/ratelimit for production multi-instance deployments
const requestCounts = new Map<string, { count: number; resetAt: number }>()

interface RateLimitOptions {
  windowMs: number
  max: number
}

export function rateLimit(req: NextRequest, opts: RateLimitOptions): NextResponse | null {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const key = `${req.nextUrl.pathname}:${ip}`
  const now = Date.now()
  const entry = requestCounts.get(key)

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + opts.windowMs })
    return null
  }

  entry.count++

  if (entry.count > opts.max) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
          'X-RateLimit-Limit': String(opts.max),
          'X-RateLimit-Remaining': '0',
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
