import { describe, it, expect } from 'vitest'
import { csrfCheck } from '@/lib/csrf'
import type { NextRequest } from 'next/server'

function mockRequest(opts: {
  method?: string
  origin?: string | null
  referer?: string | null
  host?: string
  proto?: string
}): NextRequest {
  const headers = new Map<string, string>()
  if (opts.origin !== undefined && opts.origin !== null) headers.set('origin', opts.origin)
  if (opts.referer !== undefined && opts.referer !== null) headers.set('referer', opts.referer)
  headers.set('x-forwarded-host', opts.host ?? 'awdah.io')
  headers.set('x-forwarded-proto', opts.proto ?? 'https')

  return {
    method: opts.method ?? 'POST',
    headers: { get: (k: string) => headers.get(k.toLowerCase()) ?? null },
  } as unknown as NextRequest
}

describe('csrfCheck', () => {
  it('allows GET regardless of origin', () => {
    const req = mockRequest({ method: 'GET', origin: 'https://evil.com' })
    expect(csrfCheck(req)).toBeNull()
  })

  it('allows HEAD/OPTIONS regardless of origin', () => {
    expect(csrfCheck(mockRequest({ method: 'HEAD', origin: 'https://evil.com' }))).toBeNull()
    expect(csrfCheck(mockRequest({ method: 'OPTIONS', origin: 'https://evil.com' }))).toBeNull()
  })

  it('allows POST when Origin matches self', () => {
    const req = mockRequest({ method: 'POST', origin: 'https://awdah.io', host: 'awdah.io' })
    expect(csrfCheck(req)).toBeNull()
  })

  it('blocks POST when Origin is foreign', async () => {
    const req = mockRequest({ method: 'POST', origin: 'https://evil.com', host: 'awdah.io' })
    const res = csrfCheck(req)
    expect(res).not.toBeNull()
    expect(res?.status).toBe(403)
  })

  it('falls back to Referer when Origin missing — allows same origin', () => {
    const req = mockRequest({
      method: 'POST',
      origin: null,
      referer: 'https://awdah.io/dashboard',
      host: 'awdah.io',
    })
    expect(csrfCheck(req)).toBeNull()
  })

  it('falls back to Referer — blocks foreign', () => {
    const req = mockRequest({
      method: 'POST',
      origin: null,
      referer: 'https://evil.com/x',
      host: 'awdah.io',
    })
    const res = csrfCheck(req)
    expect(res).not.toBeNull()
    expect(res?.status).toBe(403)
  })

  it('blocks POST when both Origin and Referer are missing', () => {
    const req = mockRequest({ method: 'POST', origin: null, referer: null })
    const res = csrfCheck(req)
    expect(res).not.toBeNull()
    expect(res?.status).toBe(403)
  })

  it('rejects invalid Referer URLs', () => {
    const req = mockRequest({ method: 'POST', origin: null, referer: 'not-a-url' })
    const res = csrfCheck(req)
    expect(res).not.toBeNull()
    expect(res?.status).toBe(403)
  })
})
