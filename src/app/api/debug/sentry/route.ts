/**
 * Dev-only Sentry server probe.
 *
 * Returns 404 in production so this surface vanishes from prod builds entirely.
 * In dev, POST /api/debug/sentry captures a message via the server SDK and a
 * fake exception so we can confirm sentry.server.config.ts is wired.
 */
import * as Sentry from '@sentry/nextjs'
import { type NextRequest, NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 })
  }

  const limited = await rateLimit(req, LIMITS.api)
  if (limited) return limited

  Sentry.captureMessage('sentry-debug:server-message', 'info')

  try {
    throw new Error('sentry-debug:server-exception')
  } catch (e) {
    Sentry.captureException(e)
  }

  // Flush so the event actually leaves the server process before the request ends.
  await Sentry.flush(2000)

  return NextResponse.json({ ok: true })
}
