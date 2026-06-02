import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * HMAC-signed cookie value (RTA-001 fix, hardened per WAP-001 / CPS-009).
 *
 * Format: `<payload>.<expiry_unix>.<hex_hmac>`
 *  - payload: opaque string (e.g. "true" for demo flag)
 *  - expiry_unix: seconds since epoch; rejected after this
 *  - hex_hmac: HMAC_SHA256(secret, `${payload}.${expiry_unix}`)
 *
 * Why not a session JWT: this cookie is a single-bit capability ("demo on/off")
 * not a session. HMAC is the minimum primitive that proves server origin and
 * resists tampering.
 *
 * Secret: `COOKIE_SIGNING_SECRET` is REQUIRED in every env except `test`.
 * No dev fallback that accepts unsigned values — that path was a preview-deploy
 * auth bypass (WAP-001 / CPS-009).
 */

const SECRET_ENV = 'COOKIE_SIGNING_SECRET'

function secret(): string | null {
  return process.env[SECRET_ENV] || null
}

function isTestEnv(): boolean {
  return process.env.NODE_ENV === 'test' || process.env.VITEST === 'true'
}

function hmac(value: string, key: string): string {
  return createHmac('sha256', key).update(value).digest('hex')
}

function constantTimeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

/**
 * Sign a payload. Returns the value to set in the cookie.
 *
 * @param payload short opaque string (no dots)
 * @param ttlSec seconds until expiry (default 7d)
 */
export function signCookieValue(payload: string, ttlSec = 7 * 24 * 3600): string {
  if (payload.includes('.')) throw new Error('payload must not contain "."')
  const key = secret()
  if (!key) {
    if (isTestEnv()) {
      // Tests run without a real secret; produce a deterministic value that the
      // matching verifier (also in test mode) will reject — keeps tests honest.
      return payload
    }
    throw new Error(`${SECRET_ENV} must be set (non-test env)`)
  }
  const exp = Math.floor(Date.now() / 1000) + ttlSec
  const base = `${payload}.${exp}`
  return `${base}.${hmac(base, key)}`
}

/**
 * Verify a signed cookie value.
 *
 * @returns the payload if valid, or null if missing/tampered/expired/unsigned.
 *
 * WAP-001 / CPS-009 fix: never accept unsigned values. Missing secret in any
 * non-test env returns null (fail closed). Previously the dev fallback returned
 * the raw payload, which allowed `Cookie: __Host-awdah-demo=true` to unlock
 * /dashboard/* on preview deploys with NODE_ENV != 'production'.
 */
export function verifyCookieValue(value: string | undefined | null): string | null {
  if (!value) return null
  const key = secret()
  if (!key) {
    // Fail closed: no secret => no validation possible => reject.
    return null
  }
  const parts = value.split('.')
  if (parts.length !== 3) return null
  const [payload, expStr, mac] = parts
  if (!payload || !expStr || !mac) return null
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null
  const expected = hmac(`${payload}.${expStr}`, key)
  if (!constantTimeEq(mac, expected)) return null
  return payload
}
