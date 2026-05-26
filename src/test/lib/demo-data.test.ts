import { describe, it, expect } from 'vitest'
import {
  DEMO_STATS,
  DEMO_CUSTOMERS,
  DEMO_SPARKLINES,
  DEMO_ACTIVITY,
  DEMO_CAMPAIGNS,
} from '@/lib/demo-data'

describe('DEMO_STATS', () => {
  it('total equals sum of segments', () => {
    const segmentSum =
      DEMO_STATS.vip +
      DEMO_STATS.active +
      DEMO_STATS['at-risk'] +
      DEMO_STATS.dormant +
      DEMO_STATS.lost
    expect(segmentSum).toBe(DEMO_STATS.total)
  })

  it('has non-negative revenue', () => {
    expect(DEMO_STATS.revenue).toBeGreaterThan(0)
  })

  it('recovered <= campaignsSent', () => {
    expect(DEMO_STATS.recovered).toBeLessThanOrEqual(DEMO_STATS.campaignsSent)
  })
})

describe('DEMO_CUSTOMERS', () => {
  it('has at least one customer', () => {
    expect(DEMO_CUSTOMERS.length).toBeGreaterThan(0)
  })

  it('every customer has required fields', () => {
    for (const c of DEMO_CUSTOMERS) {
      expect(c.id).toBeTruthy()
      expect(c.name).toBeTruthy()
      expect(c.phone).toBeTruthy()
      expect(['vip', 'active', 'at-risk', 'dormant', 'lost']).toContain(c.status)
    }
  })

  it('all IDs are unique', () => {
    const ids = DEMO_CUSTOMERS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('DEMO_SPARKLINES', () => {
  it('all series have 7 data points', () => {
    expect(DEMO_SPARKLINES.total).toHaveLength(7)
    expect(DEMO_SPARKLINES.active).toHaveLength(7)
    expect(DEMO_SPARKLINES.revenue).toHaveLength(7)
    expect(DEMO_SPARKLINES.atRisk).toHaveLength(7)
  })

  it('last total value matches DEMO_STATS.total', () => {
    const last = DEMO_SPARKLINES.total[DEMO_SPARKLINES.total.length - 1]
    expect(last).toBe(DEMO_STATS.total)
  })
})

describe('DEMO_ACTIVITY', () => {
  it('all items have valid type', () => {
    for (const item of DEMO_ACTIVITY) {
      expect(['message', 'reply', 'booking']).toContain(item.type)
    }
  })
})

describe('DEMO_CAMPAIGNS', () => {
  it('all campaigns have non-negative rates', () => {
    for (const c of DEMO_CAMPAIGNS) {
      expect(c.replies).toBeGreaterThanOrEqual(0)
      expect(c.bookings).toBeGreaterThanOrEqual(0)
      expect(c.bookings).toBeLessThanOrEqual(c.replies)
    }
  })
})
