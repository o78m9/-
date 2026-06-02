import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getClientIp } from '@/lib/client-ip'
import type { NextRequest } from 'next/server'

function mkReq(headers: Record<string, string>): NextRequest {
  return { headers: new Headers(headers) } as unknown as NextRequest
}

describe('getClientIp (RTA-008)', () => {
  const ORIGINAL = { ...process.env }
  beforeEach(() => {
    delete process.env.TRUST_X_FORWARDED_FOR
  })
  afterEach(() => {
    process.env = { ...ORIGINAL }
  })

  it('prefers x-vercel-forwarded-for', () => {
    const req = mkReq({
      'x-vercel-forwarded-for': '5.5.5.5',
      'x-forwarded-for': '1.2.3.4',
      'x-real-ip': '9.9.9.9',
    })
    expect(getClientIp(req)).toBe('5.5.5.5')
  })

  it('falls back to x-real-ip when no vercel header', () => {
    const req = mkReq({ 'x-real-ip': '9.9.9.9', 'x-forwarded-for': '1.2.3.4' })
    expect(getClientIp(req)).toBe('9.9.9.9')
  })

  it('IGNORES x-forwarded-for by default (RTA-008 fix)', () => {
    const req = mkReq({ 'x-forwarded-for': '1.2.3.4' })
    expect(getClientIp(req)).toBe('unknown')
  })

  it('honours x-forwarded-for ONLY when TRUST_X_FORWARDED_FOR=1', () => {
    process.env.TRUST_X_FORWARDED_FOR = '1'
    const req = mkReq({ 'x-forwarded-for': '1.2.3.4' })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })

  it('returns first hop when XFF has multiple', () => {
    process.env.TRUST_X_FORWARDED_FOR = '1'
    const req = mkReq({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1, 10.0.0.2' })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })

  it('returns "unknown" when no usable header', () => {
    expect(getClientIp(mkReq({}))).toBe('unknown')
  })
})
