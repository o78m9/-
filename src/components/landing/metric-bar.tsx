'use client'

import { motion } from 'framer-motion'
import { CountUp } from '@/components/ui/count-up'

const METRICS = [
  {
    value: 2300,
    suffix: '+',
    label: 'عيادة تثق بنا',
    sublabel: 'في ٨ مدن سعودية',
  },
  {
    value: 87,
    suffix: '٪',
    label: 'معدل إعادة التفاعل',
    sublabel: 'مرضى نائمون يعودون',
  },
  {
    value: 12,
    suffix: ' يوم',
    label: 'متوسط وقت العودة',
    sublabel: 'من أول رسالة',
  },
]

function fade(i: number) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }
}

export function MetricBar() {
  return (
    <section className="py-16 bg-forest-950" aria-label="إحصائيات">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-x-reverse divide-sage-900">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              {...fade(i)}
              className="flex flex-col items-center text-center px-8 py-2"
            >
              <div
                className="text-5xl md:text-6xl font-black mb-2"
                style={{
                  background: 'linear-gradient(135deg, #D4A574 0%, #C08840 50%, #7FB5A8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-tajawal)',
                  letterSpacing: '-0.03em',
                }}
              >
                <CountUp end={metric.value} suffix={metric.suffix} arabicNumerals />
              </div>
              <p className="text-hero-text font-semibold text-[1rem] mb-1">{metric.label}</p>
              <p className="text-hero-muted text-sm">{metric.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
