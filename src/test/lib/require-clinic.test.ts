import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'

const CLINIC_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const CLINIC_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'

type FakeUser = {
  id: string
  app_metadata?: Record<string, unknown> | null
  user_metadata?: Record<string, unknown> | null
} | null

const state: { user: FakeUser } = { user: null }

vi.mock('@/features/auth/lib/server', () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({ data: { user: state.user }, error: null }),
    },
  }),
}))

const sentryCalls: Array<{ type: 'message' | 'exception'; arg: unknown; opts?: unknown }> = []
vi.mock('@sentry/nextjs', () => ({
  captureMessage: (msg: string, opts: unknown) => {
    sentryCalls.push({ type: 'message', arg: msg, opts })
  },
  captureException: (e: unknown, opts: unknown) => {
    sentryCalls.push({ type: 'exception', arg: e, opts })
  },
}))

import { requireClinic, isClinicError } from '@/features/auth/lib/require-clinic'

function mkReq(path = '/api/customers'): NextRequest {
  return {
    headers: new Headers(),
    nextUrl: { pathname: path },
  } as unknown as NextRequest
}

describe('requireClinic (RTA-002)', () => {
  const ORIGINAL = { ...process.env }
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    delete process.env.CLINIC_METADATA_FALLBACK_UNTIL
    state.user = null
    sentryCalls.length = 0
  })
  afterEach(() => {
    process.env = { ...ORIGINAL }
  })

  it('resolves from app_metadata when present', async () => {
    state.user = { id: 'u1', app_metadata: { clinic_id: CLINIC_A } }
    const ctx = await requireClinic(mkReq())
    expect(isClinicError(ctx)).toBe(false)
    if (!isClinicError(ctx)) {
      expect(ctx.clinicId).toBe(CLINIC_A)
      expect(ctx.source).toBe('app_metadata')
    }
  })

  it('falls back to user_metadata when app_metadata empty (with sentry warn)', async () => {
    state.user = { id: 'u2', app_metadata: {}, user_metadata: { clinic_id: CLINIC_A } }
    const ctx = await requireClinic(mkReq())
    expect(isClinicError(ctx)).toBe(false)
    if (!isClinicError(ctx)) {
      expect(ctx.source).toBe('user_metadata_fallback')
    }
    expect(sentryCalls.some((c) => c.arg === 'clinic-metadata-fallback')).toBe(true)
  })

  it('TRIP-WIRE: divergent app vs user metadata returns 403', async () => {
    state.user = {
      id: 'u3',
      app_metadata: { clinic_id: CLINIC_A },
      user_metadata: { clinic_id: CLINIC_B },
    }
    const ctx = await requireClinic(mkReq())
    expect(isClinicError(ctx)).toBe(true)
    expect(sentryCalls.some((c) => c.arg === 'rta-002-tripwire')).toBe(true)
  })

  it('TRIP-WIRE: requested clinic_id mismatch returns 403', async () => {
    state.user = { id: 'u4', app_metadata: { clinic_id: CLINIC_A } }
    const ctx = await requireClinic(mkReq(), { requestedClinicId: CLINIC_B })
    expect(isClinicError(ctx)).toBe(true)
    expect(sentryCalls.some((c) => c.arg === 'rta-002-tripwire')).toBe(true)
  })

  it('accepts matching requested clinic_id', async () => {
    state.user = { id: 'u5', app_metadata: { clinic_id: CLINIC_A } }
    const ctx = await requireClinic(mkReq(), { requestedClinicId: CLINIC_A })
    expect(isClinicError(ctx)).toBe(false)
  })

  it('rejects non-UUID requested clinic_id', async () => {
    state.user = { id: 'u6', app_metadata: { clinic_id: CLINIC_A } }
    const ctx = await requireClinic(mkReq(), { requestedClinicId: 'not-a-uuid' })
    expect(isClinicError(ctx)).toBe(true)
  })

  it('401 when no authenticated user and Supabase configured', async () => {
    state.user = null
    const ctx = await requireClinic(mkReq(), { allowEnvDemo: false })
    expect(isClinicError(ctx)).toBe(true)
  })

  it('403 when authenticated but no clinic anywhere', async () => {
    state.user = { id: 'u7', app_metadata: {}, user_metadata: {} }
    const ctx = await requireClinic(mkReq())
    expect(isClinicError(ctx)).toBe(true)
  })

  it('fallback rejected after CLINIC_METADATA_FALLBACK_UNTIL passes', async () => {
    process.env.CLINIC_METADATA_FALLBACK_UNTIL = '2000-01-01T00:00:00Z'
    state.user = { id: 'u8', app_metadata: {}, user_metadata: { clinic_id: CLINIC_A } }
    const ctx = await requireClinic(mkReq())
    expect(isClinicError(ctx)).toBe(true)
    expect(sentryCalls.some((c) => c.arg === 'rta-002-tripwire')).toBe(true)
  })

  it('uses env demo clinic when Supabase not configured', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    process.env.NEXT_PUBLIC_DEMO_CLINIC_ID = CLINIC_A
    const ctx = await requireClinic(mkReq())
    expect(isClinicError(ctx)).toBe(false)
    if (!isClinicError(ctx)) {
      expect(ctx.source).toBe('env_demo')
      expect(ctx.userId).toBeNull()
    }
  })
})
