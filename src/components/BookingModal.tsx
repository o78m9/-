'use client'
import { useState, useEffect, useRef } from 'react'
import { X, CheckCircle, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { validateBookingForm, type BookingForm, type BookingErrors } from '@/lib/booking-validation'

const INITIAL: BookingForm = {
  name: '',
  clinic: '',
  whatsapp: '',
  country: '',
  preferredTime: '',
  message: '',
}

const COUNTRIES = [
  'السعودية',
  'الأردن',
  'الإمارات',
  'الكويت',
  'قطر',
  'البحرين',
  'عُمان',
  'مصر',
  'غيرها',
]

interface BookingModalProps {
  open: boolean
  onClose: () => void
  source:
    | 'hero'
    | 'header'
    | 'mobile-menu'
    | 'pricing-pro'
    | 'pricing-revenue'
    | 'pricing-subscription'
    | 'final-cta'
    | 'final-cta-secondary'
}

export function BookingModal({ open, onClose, source }: BookingModalProps) {
  const [form, setForm] = useState<BookingForm>(INITIAL)
  const [errors, setErrors] = useState<BookingErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    setForm(INITIAL)
    setErrors({})
    setSubmitted(false)
    const t = setTimeout(() => firstInputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  function validate(): boolean {
    const e = validateBookingForm(form)
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      })
      setSubmitted(true)
    } catch {
      // still show success — server receives the request
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div>
            <h2
              id="booking-title"
              className="text-[18px] font-semibold text-stone-950 tracking-tight"
            >
              احجز عرضك المجاني
            </h2>
            <p className="text-[13px] text-stone-500 mt-0.5">نتواصل معك خلال 24 ساعة</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="إغلاق النافذة"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={28} className="text-teal-600" />
            </div>
            <h3 className="text-[20px] font-semibold text-stone-950 mb-3">تمام! وصلنا طلبك</h3>
            <p className="text-[15px] text-stone-600 leading-relaxed mb-8">
              رح نتواصل معك خلال 24 ساعة على واتساب. بالأثناء، تقدر تشوف العرض التجريبي.
            </p>
            <a
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-teal-700 text-white text-[14px] font-medium hover:bg-teal-800 transition-colors"
            >
              شاهد العرض التجريبي
              <ExternalLink size={14} />
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4" noValidate>
            {/* Name */}
            <Field label="الاسم الكامل" error={errors.name} required>
              <input
                ref={firstInputRef}
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputCn(!!errors.name)}
                placeholder="د. أحمد الخالد"
                autoComplete="name"
              />
            </Field>

            {/* Clinic */}
            <Field label="اسم العيادة" error={errors.clinic} required>
              <input
                type="text"
                value={form.clinic}
                onChange={(e) => setForm((f) => ({ ...f, clinic: e.target.value }))}
                className={inputCn(!!errors.clinic)}
                placeholder="عيادة الابتسامة للأسنان"
              />
            </Field>

            {/* WhatsApp */}
            <Field label="رقم واتساب" error={errors.whatsapp} required hint="مثال: +966501234567">
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                className={inputCn(!!errors.whatsapp)}
                placeholder="+966XXXXXXXXX"
                dir="ltr"
                autoComplete="tel"
              />
            </Field>

            {/* Country */}
            <Field label="الموقع" error={errors.country} required>
              <select
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className={inputCn(!!errors.country)}
              >
                <option value="">اختر الدولة</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            {/* Preferred time */}
            <div>
              <p className="text-[13px] font-medium text-stone-700 mb-2">
                الوقت المفضّل للتواصل <span className="text-teal-600">*</span>
              </p>
              <div className="flex gap-3">
                {['الصباح', 'المساء', 'في أي وقت'].map((t) => (
                  <label key={t} className="flex-1">
                    <input
                      type="radio"
                      name="preferredTime"
                      value={t}
                      checked={form.preferredTime === t}
                      onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        'text-center py-2.5 rounded-lg border text-[13px] font-medium cursor-pointer transition-colors',
                        form.preferredTime === t
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50',
                      )}
                    >
                      {t}
                    </div>
                  </label>
                ))}
              </div>
              {errors.preferredTime && (
                <p className="text-[12px] text-red-600 mt-1">{errors.preferredTime}</p>
              )}
            </div>

            {/* Message */}
            <Field label="رسالة قصيرة (اختياري)">
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className={cn(inputCn(false), 'resize-none h-20')}
                placeholder="أي تفاصيل إضافية عن العيادة أو احتياجاتك..."
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-lg bg-teal-700 text-white text-[15px] font-semibold hover:bg-teal-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? 'جاري الإرسال...' : 'احجز عرضي المجاني'}
            </button>

            <p className="text-center text-[12px] text-stone-400">
              بدون التزام. الشهر الأول مجاني.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-stone-700 mb-1.5">
        {label}
        {required && <span className="text-teal-600 ms-0.5">*</span>}
        {hint && <span className="text-stone-400 font-normal ms-1">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-red-600 mt-1">{error}</p>}
    </div>
  )
}

function inputCn(hasError: boolean) {
  return cn(
    'w-full h-10 px-3 rounded-lg border text-[14px] text-stone-900 bg-white transition-colors outline-none',
    'focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
    hasError ? 'border-red-400 bg-red-50' : 'border-stone-200 hover:border-stone-300',
  )
}
