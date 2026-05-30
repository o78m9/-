import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Origin-based CSRF guard for state-changing requests.
 *
 * Defence-in-depth on top of SameSite cookies + nonce CSP:
 * - Reject any non-safe method whose Origin/Referer is not same-origin.
 * - Safe methods (GET/HEAD/OPTIONS) bypass.
 * - Same-origin determined from the request's own Host header (Vercel sets
 *   x-forwarded-host on edge). Optional ALLOWED_ORIGINS env adds extras.
 * - Missing Origin AND Referer on a mutation = reject (cannot prove caller).
 */

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

function selfOrigin(req: NextRequest): string {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? ''
  const proto = req.headers.get('x-forwarded-proto') ?? 'https'
  return `${proto}://${host}`
}

function allowedOrigins(req: NextRequest): Set<string> {
  const set = new Set<string>([selfOrigin(req)])
  const extra = process.env.ALLOWED_ORIGINS
  if (extra) {
    for (const o of extra.split(',')) {
      const trimmed = o.trim()
      if (trimmed) set.add(trimmed)
    }
  }
  return set
}

export function csrfCheck(req: NextRequest): NextResponse | null {
  if (SAFE_METHODS.has(req.method)) return null

  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  const allowed = allowedOrigins(req)

  if (origin) {
    if (!allowed.has(origin)) {
      return NextResponse.json({ error: 'CSRF: origin not allowed' }, { status: 403 })
    }
    return null
  }

  if (referer) {
    try {
      const refOrigin = new URL(referer).origin
      if (!allowed.has(refOrigin)) {
        return NextResponse.json({ error: 'CSRF: referer not allowed' }, { status: 403 })
      }
      return null
    } catch {
      return NextResponse.json({ error: 'CSRF: invalid referer' }, { status: 403 })
    }
  }

  return NextResponse.json({ error: 'CSRF: missing origin' }, { status: 403 })
}
