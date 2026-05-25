'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { n: 1, label: 'الفئة' },
  { n: 2, label: 'القالب' },
  { n: 3, label: 'معاينة AI' },
  { n: 4, label: 'الجدولة' },
  { n: 5, label: 'المراجعة' },
]

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((s, i) => {
        const done = s.n < current
        const active = s.n === current

        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: done || active ? '#0f766e' : '#e2e8f0',
                  color: done || active ? '#fff' : '#94a3b8',
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-metric shadow-sm"
              >
                {done ? <Check size={14} strokeWidth={3} /> : s.n}
              </motion.div>
              <span
                className={cn(
                  'text-[11px] whitespace-nowrap font-medium',
                  active ? 'text-teal-700' : done ? 'text-teal-500' : 'text-gray-400'
                )}
              >
                {s.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className="relative w-10 md:w-16 h-px bg-slate-200 mx-2 mb-5">
                <motion.div
                  className="absolute inset-y-0 right-0 bg-teal-500 rounded-full"
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
