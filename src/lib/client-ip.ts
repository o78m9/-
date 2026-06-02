import type { NextRequest } from 'next/server'

/**
 * Trust-aware client IP resolver.
 *
 * Why this exists (RTA-008):
 *   `x-forwarded-for` is set by ANY upstream that talks to the runtime.
 *   On Vercel the platform sets `x-vercel-forwarded-for` (set ONLY by the
 *   Vercel edge — not forgeable by the client). On any non-Vercel runtime
 *   or any deployment without a trusted proxy, the client can rotate
 *   `x-forwarded-for` to bypass per-IP rate limits.
 *
 *   Resolution order:
 *     1. `x-vercel-forwarded-for` (Vercel edge — trustworthy)
 *     2. `x-real-ip`              (proxied platforms that strip XFF)
 *     3. `x-forwarded-for`        (only if `TRUST_X_FORWARDED_FOR=1` env)
 *     4. literal "unknown"
 *
 *   The XFF path is OFF by default. Operators on non-Vercel hosts must
 *   opt in explicitly after verifying their upstream strips client-set
 *   XFF headers.
 */
export function getClientIp(req: NextRequest): string {
  const vercel = req.headers.get('x-vercel-forwarded-for')
  if (vercel) return vercel.split(',')[0]?.trim() || 'unknown'

  const real = req.headers.get('x-real-ip')
  if (real) return real

  if (process.env.TRUST_X_FORWARDED_FOR === '1') {
    const xff = req.headers.get('x-forwarded-for')
    if (xff) return xff.split(',')[0]?.trim() || 'unknown'
  }

  return 'unknown'
}
