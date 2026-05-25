'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, MessageSquare, Calendar, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  id: number
  time: number
  icon: React.ElementType
  color: string
  bg: string
  text: string
}

const DEMO_EVENTS: TimelineEvent[] = [
  { id: 1, time: 3000, icon: MessageSquare, color: 'text-teal-600', bg: 'bg-teal-50', text: 'تم إرسال 5 رسائل بنجاح ✓' },
  { id: 2, time: 7000, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', text: '💬 أول رد! — سارة أبو شعر: "أوكي شكراً، بحجز قريب"' },
  { id: 3, time: 12000, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', text: '📅 حجز موعد — أحمد البكري (الخميس 3 م)' },
  { id: 4, time: 17000, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', text: '💬 محمد الخطيب: "عندكم وقت الأسبوع الجاي؟"' },
  { id: 5, time: 22000, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', text: '📅 حجز موعد — رنا الشيخ (الأحد 11 ص)' },
]

interface SendProgressProps {
  customerCount: number
  segment: string
  isDemoMode: boolean
}

export function SendProgress({ customerCount, segment, isDemoMode }: SendProgressProps) {
  const router = useRouter()
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isDone, setIsDone] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const total = isDemoMode ? 28000 : 2000

    // Progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + (isDemoMode ? 1 : 5)
        if (next >= 100) {
          clearInterval(interval)
          return 100
        }
        return next
      })
    }, total / 100)

    // Done state
    const doneTimer = setTimeout(() => setIsDone(true), total)

    // Demo events
    let eventTimers: ReturnType<typeof setTimeout>[] = []
    if (isDemoMode) {
      eventTimers = DEMO_EVENTS.map((ev) =>
        setTimeout(() => setEvents((prev) => [...prev, ev]), ev.time)
      )
    }

    return () => {
      clearInterval(interval)
      clearTimeout(doneTimer)
      eventTimers.forEach(clearTimeout)
    }
  }, [isDemoMode])

  if (isDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 250, damping: 15 }}
          className="w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center mx-auto mb-5"
        >
          <CheckCircle size={40} className="text-teal-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isDemoMode ? '🎉 نتائج مذهلة!' : 'تم إرسال الحملة!'}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {isDemoMode
              ? `3 مواعيد محجوزة من أصل ${customerCount} رسالة — 350 دينار إيرادات متوقعة`
              : `تم إرسال ${customerCount} رسالة بنجاح للعملاء`}
          </p>
        </motion.div>

        {isDemoMode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-3 gap-3 mb-7"
          >
            {[
              { label: 'رسائل أُرسلت', value: String(customerCount), icon: MessageSquare, color: 'text-teal-600' },
              { label: 'مواعيد محجوزة', value: '3', icon: Calendar, color: 'text-blue-600' },
              { label: 'إيرادات متوقعة', value: '350 JD', icon: TrendingUp, color: 'text-emerald-600' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <stat.icon size={18} className={cn('mx-auto mb-1.5', stat.color)} />
                <p className="font-metric text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        <Button onClick={() => router.push('/')} className="w-full sm:w-auto px-8">
          العودة للوحة التحكم
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="py-4">
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-teal-200 border-t-teal-600 rounded-full mx-auto mb-4"
          style={{ borderWidth: 3 }}
        />
        <h2 className="text-lg font-bold text-gray-900 mb-1">جاري إرسال الحملة...</h2>
        <p className="text-sm text-gray-500">{customerCount} رسالة مخصصة</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-teal-600 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="text-xs text-center text-gray-400 font-metric mb-6">{progress}%</p>

      {/* Live events */}
      {isDemoMode && (
        <div className="space-y-2">
          <AnimatePresence>
            {events.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('flex items-center gap-3 p-3 rounded-xl border', ev.bg, 'border-transparent')}
              >
                <ev.icon size={15} className={ev.color} />
                <p className="text-sm text-gray-700">{ev.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
