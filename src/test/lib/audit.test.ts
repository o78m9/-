import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { NextRequest } from 'next/server'

function mockRequest(headers: Record<string, string>): NextRequest {
  return {
    headers: { get: (k: string) => headers[k.toLowerCase()] ?? null },
  } as unknown as NextRequest
}

describe('logAudit', () => {
  const ORIGINAL_DB_URL = process.env.DATABASE_URL

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    if (ORIGINAL_DB_URL === undefined) delete process.env.DATABASE_URL
    else process.env.DATABASE_URL = ORIGINAL_DB_URL
  })

  it('returns silently when DATABASE_URL is unset', async () => {
    delete process.env.DATABASE_URL
    const { logAudit } = await import('@/lib/audit')
    const req = mockRequest({})
    await expect(
      logAudit(req, { action: 'booking.submit', resource: 'booking' }),
    ).resolves.toBeUndefined()
  })

  it('swallows db errors instead of throwing', async () => {
    process.env.DATABASE_URL = 'postgres://invalid:invalid@127.0.0.1:1/none'
    vi.doMock('@neondatabase/serverless', () => ({
      neon: () => async () => {
        throw new Error('connection refused')
      },
    }))
    const { logAudit } = await import('@/lib/audit')
    const req = mockRequest({ 'x-forwarded-for': '8.8.8.8', 'user-agent': 'Mozilla' })
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    await expect(
      logAudit(req, { action: 'customer.create', resource: 'customer' }),
    ).resolves.toBeUndefined()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('passes ip, ua, action, resource into SQL', async () => {
    process.env.DATABASE_URL = 'postgres://x'
    const captured: unknown[][] = []
    vi.doMock('@neondatabase/serverless', () => ({
      neon:
        () =>
        async (_strings: TemplateStringsArray, ...values: unknown[]) => {
          captured.push(values)
          return []
        },
    }))
    const { logAudit } = await import('@/lib/audit')
    const req = mockRequest({ 'x-forwarded-for': '1.1.1.1', 'user-agent': 'AwdahUA/1.0' })
    await logAudit(req, {
      userId: 'u-1',
      clinicId: 'c-1',
      action: 'customer.create',
      resource: 'customer',
      resourceId: 'cust-99',
      metadata: { foo: 'bar' },
    })
    expect(captured.length).toBe(1)
    const args = captured[0]
    expect(args).toBeDefined()
    if (!args) throw new Error('unreachable')
    expect(args).toContain('u-1')
    expect(args).toContain('c-1')
    expect(args).toContain('customer.create')
    expect(args).toContain('customer')
    expect(args).toContain('cust-99')
    expect(args).toContain('1.1.1.1')
    expect(args).toContain('AwdahUA/1.0')
    expect(args).toContain(JSON.stringify({ foo: 'bar' }))
  })
})
