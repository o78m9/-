'use client'
import { motion } from 'framer-motion'
import { Zap, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepScheduleProps {
  scheduleType: 'now' | 'later'
  scheduledAt: string
  onTypeChange: (t: 'now' | 'later') => void
  onDateChange: (d: string) => void
}

export function StepSchedule({ scheduleType, scheduledAt, onTypeChange, onDateChange }: StepScheduleProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">متى تريد الإرسال؟</h2>
      <p className="text-sm text-gray-500 mb-6">اختر وقت إرسال الحملة لأقصى تأثير</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Send Now */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          whileHover={{ y: -2, transition: { duration: 0.12 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTypeChange('now')}
          className={cn(
            'text-right p-6 rounded-xl border-2 transition-all duration-150 w-full',
            scheduleType === 'now'
              ? 'border-teal-600 bg-teal-50/60 shadow-md'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          )}
        >
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
            <Zap size={22} className="text-teal-600" />
          </div>
          <p className="font-bold text-gray-900 text-base mb-1">أرسل الآن</p>
          <p className="text-sm text-gray-500">تُرسَل الرسائل فوراً بعد التأكيد</p>
        </motion.button>

        {/* Schedule Later */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.07 }}
          whileHover={{ y: -2, transition: { duration: 0.12 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTypeChange('later')}
          className={cn(
            'text-right p-6 rounded-xl border-2 transition-all duration-150 w-full',
            scheduleType === 'later'
              ? 'border-teal-600 bg-teal-50/60 shadow-md'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          )}
        >
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
            <Clock size={22} className="text-slate-500" />
          </div>
          <p className="font-bold text-gray-900 text-base mb-1">جدولة لاحقاً</p>
          <p className="text-sm text-gray-500">حدد تاريخاً ووقتاً للإرسال</p>
        </motion.button>
      </div>

      {/* Date/time picker */}
      {scheduleType === 'later' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-4"
        >
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => onDateChange(e.target.value)}
            min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white font-metric"
          />
        </motion.div>
      )}

      {/* Smart recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200"
      >
        <span className="text-xl">💡</span>
        <div>
          <p className="text-sm font-medium text-amber-800">توصية ذكية</p>
          <p className="text-xs text-amber-700 mt-0.5">
            الأحد الساعة 10:00 صباحاً — أعلى معدل فتح رسائل WhatsApp للعيادات
          </p>
        </div>
      </motion.div>
    </div>
  )
}
