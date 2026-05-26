import { describe, it, expect } from 'vitest'
import { validateBookingForm, isBookingValid, type BookingForm } from '@/lib/booking-validation'

const VALID_FORM: BookingForm = {
  name: 'Dr. Ahmed',
  clinic: 'عيادة الابتسامة',
  whatsapp: '+966501234567',
  country: 'السعودية',
  preferredTime: 'الصباح',
  message: '',
}

describe('validateBookingForm()', () => {
  it('returns empty errors for a valid form', () => {
    expect(validateBookingForm(VALID_FORM)).toEqual({})
  })

  it('requires name', () => {
    const errors = validateBookingForm({ ...VALID_FORM, name: '  ' })
    expect(errors.name).toBe('الاسم مطلوب')
  })

  it('requires clinic', () => {
    const errors = validateBookingForm({ ...VALID_FORM, clinic: '' })
    expect(errors.clinic).toBe('اسم العيادة مطلوب')
  })

  it('requires whatsapp', () => {
    const errors = validateBookingForm({ ...VALID_FORM, whatsapp: '' })
    expect(errors.whatsapp).toBe('رقم الواتساب مطلوب')
  })

  it('rejects invalid whatsapp format', () => {
    const errors = validateBookingForm({ ...VALID_FORM, whatsapp: '0501234567' })
    expect(errors.whatsapp).toMatch(/دولياً/)
  })

  it('accepts whatsapp with 7-digit country code', () => {
    const errors = validateBookingForm({ ...VALID_FORM, whatsapp: '+96650123' })
    expect(errors.whatsapp).toBeUndefined()
  })

  it('rejects whatsapp longer than 15 digits after +', () => {
    const errors = validateBookingForm({ ...VALID_FORM, whatsapp: '+12345678901234567' })
    expect(errors.whatsapp).toMatch(/دولياً/)
  })

  it('requires country', () => {
    const errors = validateBookingForm({ ...VALID_FORM, country: '' })
    expect(errors.country).toBe('اختر الموقع')
  })

  it('requires preferredTime', () => {
    const errors = validateBookingForm({ ...VALID_FORM, preferredTime: '' })
    expect(errors.preferredTime).toBe('اختر وقتاً مفضلاً')
  })

  it('returns all errors at once for empty form', () => {
    const empty: BookingForm = {
      name: '',
      clinic: '',
      whatsapp: '',
      country: '',
      preferredTime: '',
      message: '',
    }
    const errors = validateBookingForm(empty)
    expect(Object.keys(errors)).toHaveLength(5) // name, clinic, whatsapp, country, preferredTime
  })

  it('message field is optional', () => {
    const errors = validateBookingForm({ ...VALID_FORM, message: '' })
    expect(errors.message).toBeUndefined()
  })
})

describe('isBookingValid()', () => {
  it('returns true for valid form', () => {
    expect(isBookingValid(VALID_FORM)).toBe(true)
  })

  it('returns false for invalid form', () => {
    expect(isBookingValid({ ...VALID_FORM, name: '' })).toBe(false)
  })
})
