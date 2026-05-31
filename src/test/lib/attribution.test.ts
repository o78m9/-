import { describe, it, expect } from 'vitest'
import {
  ATTRIBUTION_WINDOW_MS,
  HYBRID_TAKE_RATE,
  DISPUTE_RATE_AUTO_FLAT,
  isVisitAttributable,
  pickAttributingMessage,
  computeAoodaRevenue,
  reduceCandidatesToAttributable,
} from '@/lib/attribution'

const SEND = new Date('2026-05-01T10:00:00Z')
const DAY = 24 * 60 * 60 * 1000

describe('constants', () => {
  it('window is exactly 14 days', () => {
    expect(ATTRIBUTION_WINDOW_MS).toBe(14 * DAY)
  })
  it('take rate is 15%', () => {
    expect(HYBRID_TAKE_RATE).toBe(0.15)
  })
  it('auto-flat at 40% dispute rate', () => {
    expect(DISPUTE_RATE_AUTO_FLAT).toBe(0.4)
  })
})

describe('isVisitAttributable', () => {
  const base = {
    messageSentAt: SEND,
    messageStatus: 'delivered',
    patientWasDormantAtSend: true,
    visitWasWalkIn: false,
  }

  it('attributes a visit 5 days after a delivered message to a dormant patient', () => {
    expect(isVisitAttributable({ ...base, visitDate: new Date(SEND.getTime() + 5 * DAY) })).toBe(
      true,
    )
  })

  it('attributes a visit exactly at the 14-day boundary', () => {
    expect(isVisitAttributable({ ...base, visitDate: new Date(SEND.getTime() + 14 * DAY) })).toBe(
      true,
    )
  })

  it('does NOT attribute a visit 15 days after', () => {
    expect(isVisitAttributable({ ...base, visitDate: new Date(SEND.getTime() + 15 * DAY) })).toBe(
      false,
    )
  })

  it('does NOT attribute a visit BEFORE the message', () => {
    expect(isVisitAttributable({ ...base, visitDate: new Date(SEND.getTime() - 1 * DAY) })).toBe(
      false,
    )
  })

  it('does NOT attribute when message status is not delivered', () => {
    expect(
      isVisitAttributable({
        ...base,
        visitDate: new Date(SEND.getTime() + 5 * DAY),
        messageStatus: 'sent',
      }),
    ).toBe(false)
    expect(
      isVisitAttributable({
        ...base,
        visitDate: new Date(SEND.getTime() + 5 * DAY),
        messageStatus: 'failed',
      }),
    ).toBe(false)
  })

  it('does NOT attribute when patient was not dormant at send time', () => {
    expect(
      isVisitAttributable({
        ...base,
        visitDate: new Date(SEND.getTime() + 5 * DAY),
        patientWasDormantAtSend: false,
      }),
    ).toBe(false)
  })

  it('does NOT attribute walk-in visits', () => {
    expect(
      isVisitAttributable({
        ...base,
        visitDate: new Date(SEND.getTime() + 5 * DAY),
        visitWasWalkIn: true,
      }),
    ).toBe(false)
  })

  it('does NOT attribute when message was never sent', () => {
    expect(
      isVisitAttributable({
        ...base,
        visitDate: new Date(SEND.getTime() + 5 * DAY),
        messageSentAt: null,
      }),
    ).toBe(false)
  })
})

describe('pickAttributingMessage (one-message rule)', () => {
  const visit = new Date('2026-05-10T10:00:00Z')

  it('returns the most recent message before the visit', () => {
    const m1 = { id: 'm1', sentAt: new Date('2026-05-01T10:00:00Z'), status: 'delivered' }
    const m2 = { id: 'm2', sentAt: new Date('2026-05-07T10:00:00Z'), status: 'delivered' }
    const m3 = { id: 'm3', sentAt: new Date('2026-05-09T10:00:00Z'), status: 'delivered' }
    expect(pickAttributingMessage([m1, m2, m3], visit)?.id).toBe('m3')
  })

  it('ignores messages sent AFTER the visit', () => {
    const m1 = { id: 'm1', sentAt: new Date('2026-05-01T10:00:00Z'), status: 'delivered' }
    const m2 = { id: 'm2', sentAt: new Date('2026-05-15T10:00:00Z'), status: 'delivered' }
    expect(pickAttributingMessage([m1, m2], visit)?.id).toBe('m1')
  })

  it('returns null when no message before the visit', () => {
    const m = { id: 'm', sentAt: new Date('2026-06-01T10:00:00Z'), status: 'delivered' }
    expect(pickAttributingMessage([m], visit)).toBeNull()
  })

  it('returns null when empty input', () => {
    expect(pickAttributingMessage([], visit)).toBeNull()
  })
})

describe('computeAoodaRevenue', () => {
  const visits = [
    {
      visitId: 'v1',
      amount: 100,
      customerId: 'c1',
      clinicId: 'cl',
      visitDate: SEND,
      messageId: 'm1',
      messageSentAt: SEND,
      templateSlug: 'r',
    },
    {
      visitId: 'v2',
      amount: 200,
      customerId: 'c2',
      clinicId: 'cl',
      visitDate: SEND,
      messageId: 'm2',
      messageSentAt: SEND,
      templateSlug: 'r',
    },
    {
      visitId: 'v3',
      amount: 50,
      customerId: 'c3',
      clinicId: 'cl',
      visitDate: SEND,
      messageId: 'm3',
      messageSentAt: SEND,
      templateSlug: 'r',
    },
  ]

  it('takes 15% of total recovered revenue with no disputes', () => {
    const r = computeAoodaRevenue({ visits, disputedVisitIds: [] })
    expect(r.recoveredRevenue).toBe(350)
    expect(r.aoodaRevenue).toBe(52.5)
    expect(r.netVisits.length).toBe(3)
  })

  it('excludes disputed visits from both recovered and Aooda revenue', () => {
    const r = computeAoodaRevenue({ visits, disputedVisitIds: ['v2'] })
    expect(r.recoveredRevenue).toBe(150)
    expect(r.aoodaRevenue).toBe(22.5)
    expect(r.netVisits.length).toBe(2)
  })

  it('handles all-disputed case', () => {
    const r = computeAoodaRevenue({ visits, disputedVisitIds: ['v1', 'v2', 'v3'] })
    expect(r.recoveredRevenue).toBe(0)
    expect(r.aoodaRevenue).toBe(0)
  })
})

describe('reduceCandidatesToAttributable (integration)', () => {
  it('correctly applies one-message rule + window across multiple candidates', () => {
    const rows = [
      // visit v1 has two candidate messages — should pick the later one
      {
        visit_id: 'v1',
        customer_id: 'c1',
        visit_date: new Date('2026-05-10T10:00:00Z'),
        amount: 80,
        message_id: 'm1',
        message_sent_at: new Date('2026-05-01T10:00:00Z'),
        message_status: 'delivered',
        template_slug: 'recall_dormant_v1',
        patient_was_dormant_at_send: true,
        walk_in: false,
      },
      {
        visit_id: 'v1',
        customer_id: 'c1',
        visit_date: new Date('2026-05-10T10:00:00Z'),
        amount: 80,
        message_id: 'm2',
        message_sent_at: new Date('2026-05-08T10:00:00Z'),
        message_status: 'delivered',
        template_slug: 'recall_with_offer_v1',
        patient_was_dormant_at_send: true,
        walk_in: false,
      },
      // visit v2 has a failed message — should NOT attribute
      {
        visit_id: 'v2',
        customer_id: 'c2',
        visit_date: new Date('2026-05-12T10:00:00Z'),
        amount: 100,
        message_id: 'm3',
        message_sent_at: new Date('2026-05-05T10:00:00Z'),
        message_status: 'failed',
        template_slug: 'recall_dormant_v1',
        patient_was_dormant_at_send: true,
        walk_in: false,
      },
    ]
    const out = reduceCandidatesToAttributable(rows, 'clinicA')
    expect(out.length).toBe(1)
    expect(out[0]?.visitId).toBe('v1')
    expect(out[0]?.messageId).toBe('m2') // most recent eligible
    expect(out[0]?.templateSlug).toBe('recall_with_offer_v1')
  })
})
