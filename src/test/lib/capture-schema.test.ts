import { describe, it, expect } from 'vitest'
import { captureSchema } from '@/lib/capture-schema'

describe('captureSchema', () => {
  it('accepts valid data', () => {
    const result = captureSchema.safeParse({
      name: 'أحمد علي',
      phone: '0791234567',
      visit_type: 'كشف وتشخيص',
    })
    expect(result.success).toBe(true)
  })

  it('accepts optional notes', () => {
    const result = captureSchema.safeParse({
      name: 'أحمد علي',
      phone: '0791234567',
      visit_type: 'حشو',
      notes: 'ملاحظة',
    })
    expect(result.success).toBe(true)
  })

  it('rejects name shorter than 2 chars', () => {
    const result = captureSchema.safeParse({
      name: 'أ',
      phone: '0791234567',
      visit_type: 'حشو',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const nameError = result.error.issues.find((i) => i.path.includes('name'))
      expect(nameError?.message).toBe('الاسم مطلوب')
    }
  })

  it('rejects phone shorter than 10 chars', () => {
    const result = captureSchema.safeParse({
      name: 'أحمد علي',
      phone: '0791',
      visit_type: 'حشو',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const phoneError = result.error.issues.find((i) => i.path.includes('phone'))
      expect(phoneError?.message).toBe('رقم الهاتف مطلوب')
    }
  })

  it('rejects empty visit_type', () => {
    const result = captureSchema.safeParse({
      name: 'أحمد علي',
      phone: '0791234567',
      visit_type: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const vtError = result.error.issues.find((i) => i.path.includes('visit_type'))
      expect(vtError?.message).toBe('اختر نوع الزيارة')
    }
  })

  it('notes is optional and defaults to undefined', () => {
    const result = captureSchema.safeParse({
      name: 'أحمد علي',
      phone: '0791234567',
      visit_type: 'حشو',
    })
    if (result.success) {
      expect(result.data.notes).toBeUndefined()
    }
  })
})
