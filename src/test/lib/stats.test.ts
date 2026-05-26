import { describe, it, expect } from 'vitest'
import { aggregateStats } from '@/lib/stats'

describe('aggregateStats()', () => {
  it('returns zeros for empty input', () => {
    const result = aggregateStats([])
    expect(result).toEqual({ total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 })
  })

  it('counts total correctly', () => {
    const rows = [{ status: 'vip' }, { status: 'active' }, { status: 'dormant' }]
    expect(aggregateStats(rows).total).toBe(3)
  })

  it('counts each status correctly', () => {
    const rows = [
      { status: 'vip' },
      { status: 'vip' },
      { status: 'active' },
      { status: 'at-risk' },
      { status: 'dormant' },
      { status: 'lost' },
    ]
    const result = aggregateStats(rows)
    expect(result.vip).toBe(2)
    expect(result.active).toBe(1)
    expect(result['at-risk']).toBe(1)
    expect(result.dormant).toBe(1)
    expect(result.lost).toBe(1)
    expect(result.total).toBe(6)
  })

  it('ignores unknown statuses in segment counts', () => {
    const rows = [{ status: 'unknown' }, { status: 'vip' }]
    const result = aggregateStats(rows)
    // total should still count unknown rows
    expect(result.total).toBe(2)
    expect(result.vip).toBe(1)
  })
})
