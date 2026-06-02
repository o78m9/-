import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { signCookieValue, verifyCookieValue } from '@/lib/signed-cookie'

describe('signed-cookie (RTA-001)', () => {
  const ORIGINAL = { ...process.env }

  beforeEach(() => {
    process.env.COOKIE_SIGNING_SECRET = 'test-secret-must-be-long-enough-to-be-non-trivial'
    // Force non-prod path; NODE_ENV is read-only typed by @types/node so cast.
    ;(process.env as Record<string, string>).NODE_ENV = 'test'
  })
  afterEach(() => {
    process.env = { ...ORIGINAL }
  })

  it('round-trips a payload via HMAC', () => {
    const v = signCookieValue('true', 60)
    expect(v).toMatch(/^true\.\d+\.[0-9a-f]{64}$/)
    expect(verifyCookieValue(v)).toBe('true')
  })

  it('rejects a tampered MAC', () => {
    const v = signCookieValue('true', 60)
    const parts = v.split('.')
    parts[2] = '0'.repeat(64)
    expect(verifyCookieValue(parts.join('.'))).toBeNull()
  })

  it('rejects a tampered payload', () => {
    const v = signCookieValue('true', 60)
    const tampered = v.replace(/^true/, 'admin')
    expect(verifyCookieValue(tampered)).toBeNull()
  })

  it('rejects a plain unsigned "true" when secret is configured', () => {
    expect(verifyCookieValue('true')).toBeNull()
  })

  it('rejects an expired signature', () => {
    const v = signCookieValue('true', -1)
    expect(verifyCookieValue(v)).toBeNull()
  })

  it('rejects null/empty/malformed input', () => {
    expect(verifyCookieValue(null)).toBeNull()
    expect(verifyCookieValue(undefined)).toBeNull()
    expect(verifyCookieValue('')).toBeNull()
    expect(verifyCookieValue('only.two')).toBeNull()
  })

  it('refuses payload containing "." in signCookieValue', () => {
    expect(() => signCookieValue('bad.payload', 60)).toThrow(/must not contain/)
  })
})
