'use client'

import { motion } from 'framer-motion'

// Abstract geometric marks representing different clinic types
const MARKS = [
  <svg key="m1" width="52" height="32" viewBox="0 0 52 32" fill="none" aria-hidden="true">
    <circle cx="14" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="30" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  <svg key="m2" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
    <line
      x1="16"
      y1="7"
      x2="16"
      y2="25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="7"
      y1="16"
      x2="25"
      y2="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>,
  <svg key="m3" width="40" height="32" viewBox="0 0 40 32" fill="none" aria-hidden="true">
    <rect x="0" y="7" width="40" height="3" rx="1.5" fill="currentColor" />
    <rect x="5" y="15" width="30" height="3" rx="1.5" fill="currentColor" />
    <rect x="10" y="23" width="20" height="3" rx="1.5" fill="currentColor" />
  </svg>,
  <svg key="m4" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <polygon
      points="16,2 30,16 16,30 2,16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>,
  <svg key="m5" width="48" height="32" viewBox="0 0 48 32" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="44" height="24" rx="8" stroke="currentColor" strokeWidth="1.5" />
    <line
      x1="12"
      y1="16"
      x2="36"
      y2="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>,
  <svg key="m6" width="36" height="32" viewBox="0 0 36 32" fill="none" aria-hidden="true">
    <circle cx="18" cy="5" r="4" fill="currentColor" />
    <circle cx="5" cy="27" r="4" fill="currentColor" />
    <circle cx="31" cy="27" r="4" fill="currentColor" />
  </svg>,
  <svg key="m7" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  <svg key="m8" width="34" height="32" viewBox="0 0 34 32" fill="none" aria-hidden="true">
    <polygon
      points="17,2 32,12 26,29 8,29 2,12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>,
]

const DUPLICATED = [...MARKS, ...MARKS]

export function LogoBar() {
  return (
    <section
      aria-label="عيادات موثوقة"
      className="border-y border-line/50 bg-paper/70 py-8 overflow-hidden"
    >
      <div className="max-w-content mx-auto px-6 mb-6">
        <p className="text-center text-[0.6875rem] font-medium tracking-widest uppercase text-mute/60">
          يثق بنا أكثر من ٢٣٠٠ مدير عيادة في السعودية
        </p>
      </div>

      {/* Marquee */}
      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex shrink-0 items-center gap-12 px-6"
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          aria-hidden="true"
        >
          {DUPLICATED.map((mark, i) => (
            <div
              key={i}
              className="text-mute/40 hover:text-sage-400 transition-colors duration-300 shrink-0"
            >
              {mark}
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex shrink-0 items-center gap-12 px-6"
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          aria-hidden="true"
        >
          {DUPLICATED.map((mark, i) => (
            <div
              key={`b${i}`}
              className="text-mute/40 hover:text-sage-400 transition-colors duration-300 shrink-0"
            >
              {mark}
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
