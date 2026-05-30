'use client'

import { motion } from 'framer-motion'

const TECH_BADGES = [
  { label: 'WhatsApp Business API', sub: 'قناة التواصل' },
  { label: 'Claude AI', sub: 'كتابة الرسائل' },
  { label: 'Anthropic', sub: 'محرك الذكاء' },
  { label: 'Next.js', sub: 'البنية التقنية' },
  { label: 'Vercel', sub: 'البنية السحابية' },
  { label: 'WhatsApp Business API', sub: 'قناة التواصل' },
  { label: 'Claude AI', sub: 'كتابة الرسائل' },
  { label: 'Anthropic', sub: 'محرك الذكاء' },
]

const DUPLICATED = [...TECH_BADGES, ...TECH_BADGES]

export function LogoBar() {
  return (
    <section
      aria-label="التقنيات المستخدمة"
      className="border-y border-line/50 bg-paper/70 py-8 overflow-hidden"
    >
      <div className="max-w-content mx-auto px-6 mb-6">
        <p className="text-center text-[0.6875rem] font-medium tracking-widest uppercase text-mute/60">
          يعمل بتقنية
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex shrink-0 items-center gap-8 px-6"
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
          aria-hidden="true"
        >
          {DUPLICATED.map((badge, i) => (
            <div
              key={i}
              className="flex flex-col items-center shrink-0 px-5 py-2.5 rounded-xl border border-copper/10 dark:border-gold-500/15 bg-copper/5 dark:bg-gold-500/5"
              style={{ minWidth: 140 }}
            >
              <span className="text-[13px] font-semibold tracking-tight text-mute/80 dark:text-gold-300">
                {badge.label}
              </span>
              <span className="text-[10px] font-medium tracking-wide mt-0.5 text-mute/60 dark:text-gold-500/60">
                {badge.sub}
              </span>
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex shrink-0 items-center gap-8 px-6"
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
          aria-hidden="true"
        >
          {DUPLICATED.map((badge, i) => (
            <div
              key={`b${i}`}
              className="flex flex-col items-center shrink-0 px-5 py-2.5 rounded-xl border border-copper/10 dark:border-gold-500/15 bg-copper/5 dark:bg-gold-500/5"
              style={{ minWidth: 140 }}
            >
              <span className="text-[13px] font-semibold tracking-tight text-mute/80 dark:text-gold-300">
                {badge.label}
              </span>
              <span className="text-[10px] font-medium tracking-wide mt-0.5 text-mute/60 dark:text-gold-500/60">
                {badge.sub}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-20 z-10 bg-gradient-to-l from-paper via-paper/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 end-0 w-20 z-10 bg-gradient-to-r from-paper via-paper/50 to-transparent" />
      </div>
    </section>
  )
}
