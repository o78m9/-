'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف مطلوب'),
  visit_type: z.string().min(1, 'اختر نوع الزيارة'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const VISIT_TYPES = [
  'كشف وتشخيص',
  'تنظيف وتلميع',
  'حشو',
  'خلع',
  'تقويم',
  'تركيبات ثابتة',
  'زراعة',
  'تجميل أسنان',
  'علاج عصب',
  'أخرى',
]

export default function QuickForm({ clinicId }: { clinicId: string }) {
  const [loading, setLoading] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    // Reject honeypot-filled submissions silently
    if (honeypotRef.current?.value) return

    setLoading(true)
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, clinic_id: clinicId }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `HTTP ${res.status}`)
      }

      toast.success('تم التسجيل بنجاح', {
        description: 'سنتواصل معك قريباً',
      })
      reset()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطأ غير متوقع'
      toast.error('خطأ في الحفظ', { description: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Honeypot — hidden from real users, filled by bots */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute w-0 h-0 opacity-0 pointer-events-none overflow-hidden"
        autoComplete="off"
      />

      <div>
        <label htmlFor="qf-name" className="block text-sm font-medium mb-1">
          الاسم الكامل
        </label>
        <input
          id="qf-name"
          {...register('name')}
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 transition-colors"
          placeholder="محمد أحمد"
          autoFocus
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1" role="alert">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="qf-phone" className="block text-sm font-medium mb-1">
          رقم الهاتف
        </label>
        <input
          id="qf-phone"
          {...register('phone')}
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 transition-colors"
          placeholder="0791234567"
          type="tel"
          dir="ltr"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1" role="alert">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="qf-visit" className="block text-sm font-medium mb-1">
          نوع الزيارة
        </label>
        <select
          id="qf-visit"
          {...register('visit_type')}
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 bg-white transition-colors"
        >
          <option value="">اختر...</option>
          {VISIT_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.visit_type && (
          <p className="text-red-500 text-xs mt-1" role="alert">{errors.visit_type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="qf-notes" className="block text-sm font-medium mb-1">
          ملاحظة (اختياري)
        </label>
        <input
          id="qf-notes"
          {...register('notes')}
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/40 focus:border-teal-600 transition-colors"
          placeholder="..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-teal-700 text-white py-3 rounded-lg font-medium text-sm hover:bg-teal-800 disabled:opacity-60 transition-colors mt-2 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? 'جاري الحفظ...' : 'حفظ وتسجيل'}
      </button>
    </form>
  )
}
