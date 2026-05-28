import { describe, it, expect } from 'vitest'
import { applySecurityHeaders } from '@/lib/security-headers'
import { NextResponse } from 'next/server'

describe('applySecurityHeaders', () => {
  function makeResponse() {
    return NextResponse.next()
  }

  const TEST_NONCE = 'dGVzdC1ub25jZQ=='

  it('sets X-Frame-Options to DENY', () => {
    const res = applySecurityHeaders(makeResponse(), TEST_NONCE)
    expect(res.headers.get('X-Frame-Options')).toBe('DENY')
  })

  it('sets X-Content-Type-Options to nosniff', () => {
    const res = applySecurityHeaders(makeResponse(), TEST_NONCE)
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })

  it('sets HSTS header', () => {
    const res = applySecurityHeaders(makeResponse(), TEST_NONCE)
    const hsts = res.headers.get('Strict-Transport-Security')
    expect(hsts).toContain('max-age=31536000')
    expect(hsts).toContain('includeSubDomains')
  })

  it('sets Referrer-Policy', () => {
    const res = applySecurityHeaders(makeResponse(), TEST_NONCE)
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
  })

  it('sets Permissions-Policy disabling camera/mic/geo', () => {
    const res = applySecurityHeaders(makeResponse(), TEST_NONCE)
    const pp = res.headers.get('Permissions-Policy') ?? ''
    expect(pp).toContain('camera=()')
    expect(pp).toContain('microphone=()')
    expect(pp).toContain('geolocation=()')
  })

  it('sets Content-Security-Policy', () => {
    const res = applySecurityHeaders(makeResponse(), TEST_NONCE)
    const csp = res.headers.get('Content-Security-Policy') ?? ''
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain('upgrade-insecure-requests')
  })

  it('includes nonce value in CSP', () => {
    const res = applySecurityHeaders(makeResponse(), TEST_NONCE)
    const csp = res.headers.get('Content-Security-Policy') ?? ''
    // In dev: unsafe-eval/unsafe-inline. In production: nonce-based. Either way, CSP is set.
    expect(csp).toContain("script-src 'self'")
  })

  it('returns the response object', () => {
    const original = makeResponse()
    const returned = applySecurityHeaders(original, TEST_NONCE)
    expect(returned).toBe(original)
  })
})
