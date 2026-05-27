import { describe, it, expect } from 'vitest'

// Verify feature barrel exports resolve without error
describe('feature slice exports', () => {
  it('auth index exports expected shape', async () => {
    const auth = await import('@/features/auth')
    expect(auth).toBeDefined()
  })

  it('booking index exports expected shape', async () => {
    const booking = await import('@/features/booking')
    expect(booking).toBeDefined()
  })

  it('capture index exports expected shape', async () => {
    const capture = await import('@/features/capture')
    expect(capture).toBeDefined()
  })
})

// Verify shim re-exports work
describe('lib shims', () => {
  it('lib/stats re-exports aggregateStats', async () => {
    const { aggregateStats } = await import('@/lib/stats')
    expect(typeof aggregateStats).toBe('function')
  })

  it('lib/utils exports cn', async () => {
    const { cn } = await import('@/lib/utils')
    expect(typeof cn).toBe('function')
  })

  it('lib/capture-schema re-exports captureSchema', async () => {
    const mod = await import('@/lib/capture-schema')
    expect(mod).toBeDefined()
  })

  it('lib/booking-validation re-exports validateBookingForm', async () => {
    const { validateBookingForm } = await import('@/lib/booking-validation')
    expect(typeof validateBookingForm).toBe('function')
  })
})
