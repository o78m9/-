import { describe, it, expect } from 'vitest'
import { formatPrice, PLANS_BASE_JOD, CURRENCIES } from '@/lib/pricing'

describe('PLANS_BASE_JOD', () => {
  it('trial is free', () => {
    expect(PLANS_BASE_JOD.trial).toBe(0)
  })

  it('growth < pro', () => {
    expect(PLANS_BASE_JOD.growth).toBeLessThan(PLANS_BASE_JOD.pro)
  })
})

describe('CURRENCIES', () => {
  it('has SAR, JOD, AED', () => {
    expect(CURRENCIES).toHaveProperty('SAR')
    expect(CURRENCIES).toHaveProperty('JOD')
    expect(CURRENCIES).toHaveProperty('AED')
  })

  it('JOD rate is 1 (base currency)', () => {
    expect(CURRENCIES.JOD.rate).toBe(1)
  })
})

describe('formatPrice', () => {
  it('returns string', () => {
    expect(typeof formatPrice(250, 'JOD')).toBe('string')
  })

  it('converts JOD base correctly', () => {
    const result = formatPrice(100, 'JOD')
    expect(result).toContain('100')
  })

  it('converts SAR with correct rate', () => {
    const result = formatPrice(100, 'SAR')
    expect(result).toContain('530')
  })

  it('handles zero amount', () => {
    const result = formatPrice(0, 'JOD')
    expect(result).toContain('0')
  })
})
