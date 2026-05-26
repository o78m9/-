export interface BookingForm {
  name: string
  clinic: string
  whatsapp: string
  country: string
  preferredTime: string
  message: string
}

export type BookingErrors = Partial<BookingForm>

export function validateBookingForm(form: BookingForm): BookingErrors {
  const errors: BookingErrors = {}

  if (!form.name.trim()) errors.name = 'الاسم مطلوب'
  if (!form.clinic.trim()) errors.clinic = 'اسم العيادة مطلوب'

  if (!form.whatsapp.trim()) {
    errors.whatsapp = 'رقم الواتساب مطلوب'
  } else if (!/^\+\d{7,15}$/.test(form.whatsapp.trim())) {
    errors.whatsapp = 'أدخل رقماً دولياً صحيحاً (مثال: +966XXXXXXXXX)'
  }

  if (!form.country) errors.country = 'اختر الموقع'
  if (!form.preferredTime) errors.preferredTime = 'اختر وقتاً مفضلاً'

  return errors
}

export function isBookingValid(form: BookingForm): boolean {
  return Object.keys(validateBookingForm(form)).length === 0
}
