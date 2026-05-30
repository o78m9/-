'use client'

import { motion } from 'framer-motion'

// Pre-launch transparency block — replaces fabricated metric counters.
// TODO(brand): once we have a signed pilot cohort with published, attributable
// numbers, restore a real metric bar with source links + effective date.
const TRUST_POINTS = [
  {
    title: 'مرحلة الإطلاق التجريبي',
    body: 'لم ننشر أرقام عيادات بعد. كل ما نقوله موثّق أو محذوف.',
  },
  {
    title: 'بياناتك في السعودية',
    body: 'تشفير كامل (TLS 1.3 + AES-256) — تستلم نسختك عند أي طلب.',
  },
  {
    title: 'أول مكالمة مع المؤسس',
    body: 'لا فريق مبيعات في هذه المرحلة — تواصل مباشر معك.',
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
    <section
      className="py-16 bg-cream/40 dark:bg-forest-950/10 border-y border-line dark:border-sage-800/10"
      aria-label="وعد الشفافية"
      dir="rtl"
    >
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-x-reverse divide-line dark:divide-sage-800/20">
          {TRUST_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              {...fade(i)}
              className="flex flex-col items-center text-center px-8 py-2"
            >
              <p
                className="font-semibold mb-2"
                style={{
                  fontSize: '1.125rem',
                  color: '#B8743D',
                  letterSpacing: '-0.01em',
                }}
              >
                {point.title}
              </p>
              <p className="text-mute text-sm leading-[1.65] max-w-[28ch]">{point.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
