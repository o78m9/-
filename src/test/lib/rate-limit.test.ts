import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import type { NextRequest } from 'next/server'

function mockRequest(path = '/api/test', ip = '127.0.0.1'): NextRequest {
    return {
          nextUrl: { pathname: path },
          headers: {
                  get: (key: string) => {
                            if (key === 'x-forwarded-for') return ip
                            return null
                  },
          },
    } as unknown as NextRequest
}

describe('rateLimit', () => {
    beforeEach(() => {
          vi.useFakeTimers()
    })

           it('returns null when under limit', async () => {
                 const req = mockRequest('/api/a', '1.2.3.4')
                 const result = await rateLimit(req, { windowMs: 60_000, max: 10 })
                 expect(result).toBeNull()
           })

           it('returns 429 after exceeding max requests', async () => {
                 const req = mockRequest('/api/b', '5.6.7.8')
                 const opts = { windowMs: 60_000, max: 2 }
                 await rateLimit(req, opts)
                 await rateLimit(req, opts)
                 const result = await rateLimit(req, opts)
                 expect(result).not.toBeNull()
                 expect(result?.status).toBe(429)
           })

           it('resets after window expires', async () => {
                 const req = mockRequest('/api/c', '9.9.9.9')
                 const opts = { windowMs: 1_000, max: 1 }
                 await rateLimit(req, opts)
                 const blocked = await rateLimit(req, opts)
                 expect(blocked?.status).toBe(429)
                 vi.advanceTimersByTime(2_000)
                 const after = await rateLimit(req, opts)
                 expect(after).toBeNull()
           })

           it('LIMITS presets are defined', () => {
                 expect(LIMITS.api.max).toBeGreaterThan(0)
                 expect(LIMITS.ai.max).toBeGreaterThan(0)
                 expect(LIMITS.import.max).toBeGreaterThan(0)
                 expect(LIMITS.auth.max).toBeGreaterThan(0)
           })

           it('isolates by IP and path', async () => {
                 const req1 = mockRequest('/api/d', '10.0.0.1')
                 const req2 = mockRequest('/api/d', '10.0.0.2')
                 const opts = { windowMs: 60_000, max: 1 }
                 await rateLimit(req1, opts)
                 const r1 = await rateLimit(req1, opts)
                 const r2 = await rateLimit(req2, opts)
                 expect(r1?.status).toBe(429)
                 expect(r2).toBeNull()
           })
})
