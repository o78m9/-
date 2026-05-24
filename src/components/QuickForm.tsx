'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, clinic_id: clinicId }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        reset()
      }, 2500)
    } catch {
      alert('خطأ في الحفظ، حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-3">✅</div>
        <p className="text-lg font-semibold text-green-700">شكراً لك!</p>
        <p className="text-sm text-gray-500 mt-1">تم تسجيل بياناتك بنجاح</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
        <input
          {...register('name')}
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="محمد أحمد"
          autoFocus
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
        <input
          {...register('phone')}
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0791234567"
          type="tel"
          dir="ltr"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">نوع الزيارة</label>
        <select
          {...register('visit_type')}
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">اختر...</option>
          {VISIT_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.visit_type && <p className="text-red-500 text-xs mt-1">{errors.visit_type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ملاحظة (اختياري)</label>
        <input
          {...register('notes')}
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
      >
        {loading ? 'جاري الحفظ...' : 'حفظ وتسجيل'}
      </button>
    </form>
  )
}
