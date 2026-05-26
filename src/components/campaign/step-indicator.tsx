'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { n: 1, label: 'الفئة' },
  { n: 2, label: 'القالب' },
  { n: 3, label: 'معاينة' },
  { n: 4, label: 'الجدولة' },
  { n: 5, label: 'المراجعة' },
]

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((s, i) => {
        const done   = s.n < current
        const active = s.n === current

        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              {/* Circle */}
              <motion.div
                animate={{
                  backgroundColor: done ? '#0f766e' : active ? '#0f766e' : '#F1F5F9',
                  color: done || active ? '#fff' : '#94a3b8',
                  scale: active ? 1.12 : 1,
                  boxShadow: active ? '0 0 0 4px rgba(15,118,110,0.12)' : '0 0 0 0px transparent',
                }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-metric shadow-sm"
              >
                {done ? <Check size={13} strokeWidth={3} /> : (
                  <span>{String(s.n).padStart(2, '0')}</span>
                )}
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{
                  color: active ? '#0f766e' : done ? '#0d9488' : '#94a3b8',
                  fontWeight: active ? 600 : 400,
                }}
                transition={{ duration: 0.2 }}
                className="text-[11px] whitespace-nowrap font-metric tracking-wide"
              >
                {s.label}
              </motion.span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="relative w-8 md:w-14 h-px bg-slate-200 mx-1 mb-5 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 start-0 bg-brand-600 rounded-full"
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
