import { describe, it, expect } from 'vitest'
import {
  TEMPLATES,
  selectTemplate,
  getTemplate,
  validateTemplateVariables,
  renderTemplate,
  cleanCustomMessage,
  type TemplateSelectionContext,
} from '@/lib/whatsapp-templates'

function ctx(partial: Partial<TemplateSelectionContext> = {}): TemplateSelectionContext {
  return {
    daysSinceLastVisit: null,
    isBirthdayThisWeek: false,
    hasRecentVisit: false,
    visitWasYesterdayOr2DaysAgo: false,
    hasOptedOut: false,
    hasReplyKeywordPending: false,
    clinicHasActiveOffer: false,
    totalSpentJOD: 0,
    ...partial,
  }
}

describe('whatsapp-templates registry', () => {
  it('has 8 templates', () => {
    expect(TEMPLATES.length).toBe(8)
  })

  it('every template has a unique slug', () => {
    const slugs = TEMPLATES.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('every template body contains at least one {{1}} placeholder', () => {
    for (const t of TEMPLATES) {
      expect(t.body).toMatch(/\{\{1\}\}/)
    }
  })

  it('every template body contains the opt-out instruction', () => {
    for (const t of TEMPLATES) {
      // opt_out_confirm itself is the confirmation, not the request — accept either marker
      const hasOptOut = /إيقاف|تفعيل/.test(t.body)
      expect(hasOptOut, `template ${t.slug} missing opt-out language`).toBe(true)
    }
  })
})

describe('selectTemplate', () => {
  it('returns null when patient has opted out and no reply pending', () => {
    expect(selectTemplate(ctx({ hasOptedOut: true, daysSinceLastVisit: 200 }))).toBeNull()
  })

  it('returns opt_out_confirm when reply keyword pending (highest priority)', () => {
    const t = selectTemplate(ctx({ hasReplyKeywordPending: true, daysSinceLastVisit: 200 }))
    expect(t?.slug).toBe('opt_out_confirm_v1')
  })

  it('returns post_visit_followup for 2-day-ago visit', () => {
    const t = selectTemplate(ctx({ visitWasYesterdayOr2DaysAgo: true, daysSinceLastVisit: 2 }))
    expect(t?.slug).toBe('post_visit_followup_v1')
  })

  it('returns satisfaction_survey 2-4 days after visit when no post-visit followup', () => {
    const t = selectTemplate(ctx({ daysSinceLastVisit: 3 }))
    expect(t?.slug).toBe('satisfaction_survey_v1')
  })

  it('returns birthday template when birthday this week (priority 20)', () => {
    const t = selectTemplate(ctx({ isBirthdayThisWeek: true, daysSinceLastVisit: 200 }))
    expect(t?.slug).toBe('birthday_v1')
  })

  it('prefers offer template over plain recall when offer active', () => {
    const t = selectTemplate(ctx({ daysSinceLastVisit: 120, clinicHasActiveOffer: true }))
    expect(t?.slug).toBe('recall_with_offer_v1')
  })

  it('returns plain recall_dormant for 90+ day dormant when no offer', () => {
    const t = selectTemplate(ctx({ daysSinceLastVisit: 120 }))
    expect(t?.slug).toBe('recall_dormant_v1')
  })

  it('returns null when daysSinceLastVisit < 90 and nothing else applies', () => {
    expect(selectTemplate(ctx({ daysSinceLastVisit: 30 }))).toBeNull()
  })
})

describe('validateTemplateVariables', () => {
  it('accepts well-formed variables', () => {
    const t = getTemplate('recall_dormant_v1')
    const v = validateTemplateVariables(t, { 1: 'أحمد', 2: 'ستة أشهر', 3: 'عيادة الياسمين' })
    expect(v).toEqual({ 1: 'أحمد', 2: 'ستة أشهر', 3: 'عيادة الياسمين' })
  })

  it('rejects empty first name', () => {
    const t = getTemplate('recall_dormant_v1')
    expect(() => validateTemplateVariables(t, { 1: '', 2: 'x', 3: 'y' })).toThrow()
  })

  it('rejects discount > 30 on recall_with_offer', () => {
    const t = getTemplate('recall_with_offer_v1')
    expect(() =>
      validateTemplateVariables(t, { 1: 'أحمد', 2: 'عيادة', 3: 'سنة', 4: 50, 5: 'تنظيف' }),
    ).toThrow()
  })
})

describe('renderTemplate', () => {
  it('substitutes all placeholders', () => {
    const t = getTemplate('recall_dormant_v1')
    const out = renderTemplate(t, { 1: 'أحمد', 2: 'ستة أشهر', 3: 'عيادة الياسمين' })
    expect(out).toContain('مرحباً أحمد')
    expect(out).toContain('ستة أشهر')
    expect(out).toContain('عيادة الياسمين')
    expect(out).not.toMatch(/\{\{\d+\}\}/)
  })
})

describe('cleanCustomMessage', () => {
  it('accepts a clean clinic message', () => {
    const r = cleanCustomMessage('نشكركم على زيارتكم. نتمنى لكم الصحة الدائمة.')
    expect(r.ok).toBe(true)
  })

  it('rejects messages mentioning prescription', () => {
    const r = cleanCustomMessage('نقدم لكم وصفة دواء خاصة.')
    expect(r.ok).toBe(false)
  })

  it('rejects messages with URLs', () => {
    const r = cleanCustomMessage('زورونا على https://example.com اليوم.')
    expect(r.ok).toBe(false)
  })

  it('rejects messages too short', () => {
    const r = cleanCustomMessage('قصير')
    expect(r.ok).toBe(false)
  })

  it('rejects messages mentioning Claude or AI', () => {
    const r1 = cleanCustomMessage('هذه رسالة من Claude لكم')
    const r2 = cleanCustomMessage('نستخدم ذكاء اصطناعي لخدمتكم بأفضل شكل ممكن')
    expect(r1.ok).toBe(false)
    expect(r2.ok).toBe(false)
  })

  it('strips dangerous characters', () => {
    const r = cleanCustomMessage('رسالة طيبة `وكلمة` آمنة لكم جميعاً اليوم')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.cleaned).not.toContain('`')
  })
})
