import { type NextRequest, NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { signCookieValue } from '@/lib/signed-cookie'

/**
 * RTA-001 — server-issued, HMAC-signed demo cookie.
 *
 * Client-side `document.cookie = '__Host-awdah-demo=true'` (the old pattern)
 * cannot satisfy the signed-cookie verifier. This endpoint mints the value
 * server-side and returns it via Set-Cookie so the secret never leaves the
 * server boundary.
 *
 * POST                 → mint a signed cookie, 24h TTL
 * POST { off: true }   → clear the cookie
 *
 * Always returns JSON; the Set-Cookie header carries the capability.
 */
export const runtime = 'nodejs'

const COOKIE_NAME = '__Host-awdah-demo'
const TTL_SECONDS = 24 * 3600

function commonCookieAttrs(): string {
  // __Host- prefix requires: Secure, Path=/, no Domain. SameSite=Strict added
  // for defence-in-depth against cross-site cookie use.
  return 'Path=/; Secure; SameSite=Strict; HttpOnly'
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.auth)
  if (limited) return limited

  let off = false
  try {
    const body = (await req.json()) as { off?: boolean } | null
    off = !!body?.off
  } catch {
    // empty body → treat as enable
  }

  const res = NextResponse.json({ ok: true, demo: !off })

  if (off) {
    res.headers.set('Set-Cookie', `${COOKIE_NAME}=; ${commonCookieAttrs()}; Max-Age=0`)
    return res
  }

  let value: string
  try {
    value = signCookieValue('true', TTL_SECONDS)
  } catch {
    return NextResponse.json(
      { error: 'Demo unavailable: signing secret not configured' },
      { status: 503 },
    )
  }

  res.headers.set(
    'Set-Cookie',
    `${COOKIE_NAME}=${value}; ${commonCookieAttrs()}; Max-Age=${TTL_SECONDS}`,
  )
  return res
}
