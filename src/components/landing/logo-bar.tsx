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
              className="flex flex-col items-center shrink-0 px-5 py-2.5 rounded-xl"
              style={{
                border: '1px solid rgba(184,116,61,0.12)',
                background: 'rgba(184,116,61,0.03)',
                minWidth: 140,
              }}
            >
              <span
                className="text-[13px] font-semibold tracking-tight"
                style={{ color: 'rgba(74,68,64,0.75)' }}
              >
                {badge.label}
              </span>
              <span
                className="text-[10px] font-medium tracking-wide mt-0.5"
                style={{ color: 'rgba(154,144,137,0.7)' }}
              >
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
              className="flex flex-col items-center shrink-0 px-5 py-2.5 rounded-xl"
              style={{
                border: '1px solid rgba(184,116,61,0.12)',
                background: 'rgba(184,116,61,0.03)',
                minWidth: 140,
              }}
            >
              <span
                className="text-[13px] font-semibold tracking-tight"
                style={{ color: 'rgba(74,68,64,0.75)' }}
              >
                {badge.label}
              </span>
              <span
                className="text-[10px] font-medium tracking-wide mt-0.5"
                style={{ color: 'rgba(154,144,137,0.7)' }}
              >
                {badge.sub}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Fade edges */}
        <div
          className="pointer-events-none absolute inset-y-0 start-0 w-20 z-10"
          style={{ background: 'linear-gradient(to left, transparent, #FFFCF580 70%, #FFFCF5)' }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 end-0 w-20 z-10"
          style={{ background: 'linear-gradient(to right, transparent, #FFFCF580 70%, #FFFCF5)' }}
        />
      </div>
    </section>
  )
}
