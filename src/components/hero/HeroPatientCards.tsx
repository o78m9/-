'use client'

import { motion, useReducedMotion } from 'framer-motion'

const PATIENTS = [
  {
    name: 'سارة المطيري',
    initial: 'س',
    time: 'منذ ٨ أشهر',
    msg: 'مرحباً سارة، نشتاق لابتسامتك! 😊',
    delay: 0,
    rotate: -3,
  },
  {
    name: 'أحمد الشمري',
    initial: 'أ',
    time: 'منذ ٦ أشهر',
    msg: 'موعدك الدوري اقترب — احجزي الآن',
    delay: 0.18,
    rotate: 1.5,
  },
  {
    name: 'نورة العتيبي',
    initial: 'ن',
    time: 'منذ ١٠ أشهر',
    msg: 'عرض خاص لعملائنا القدامى 🎁',
    delay: 0.34,
    rotate: -1,
  },
]

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 32, scale: 0.94 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22, delay },
  }),
}

export function HeroPatientCards() {
  const reduced = useReducedMotion()

  return (
    <div
      className="relative flex flex-col items-center justify-center h-full w-full py-16"
      dir="rtl"
      aria-hidden="true"
    >
      {/* Floating badge */}
      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2 z-20"
        initial={reduced ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold"
          style={{
            background: 'rgba(127,181,168,0.14)',
            border: '1px solid rgba(127,181,168,0.28)',
            color: '#7FB5A8',
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: '#7FB5A8', boxShadow: '0 0 6px #7FB5A8' }}
          />
          ١٢ مريض عادوا هذا الأسبوع
        </div>
      </motion.div>

      {/* Cards */}
      <div className="relative flex flex-col gap-4 w-full max-w-[320px] mt-12">
        {PATIENTS.map((p, i) => (
          <motion.div
            key={p.name}
            custom={reduced ? 0 : p.delay}
            variants={CARD_VARIANTS}
            initial="hidden"
            animate="visible"
            style={{ rotate: reduced ? 0 : p.rotate }}
            className="relative rounded-2xl p-4"
          >
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(20,43,39,0.85)',
                border: '1px solid rgba(212,165,116,0.15)',
                boxShadow:
                  i === 1
                    ? '0 8px 32px rgba(212,165,116,0.12), 0 2px 8px rgba(0,0,0,0.4)'
                    : '0 4px 16px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Header row */}
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                  style={{ background: 'rgba(212,165,116,0.15)', color: '#D4A574' }}
                >
                  {p.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate" style={{ color: '#F5EFE6' }}>
                    {p.name}
                  </div>
                  <div className="text-[11px]" style={{ color: '#5A6B65' }}>
                    {p.time}
                  </div>
                </div>
                {/* WhatsApp icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                    fill="#25D366"
                  />
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.304A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
                    stroke="#25D366"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Message bubble */}
              <div
                className="rounded-xl px-3 py-2 text-[12px] leading-[1.6]"
                style={{
                  background: 'rgba(37,211,102,0.08)',
                  border: '1px solid rgba(37,211,102,0.12)',
                  color: '#C8DDD8',
                }}
              >
                {p.msg}
              </div>

              {/* Sent indicator */}
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-[10px]" style={{ color: '#5A6B65' }}>
                  أُرسلت تلقائياً
                </span>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path
                    d="M1 5l3 3 9-8"
                    stroke="#7FB5A8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 5l3 3 5-8"
                    stroke="#7FB5A8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom label */}
      <motion.p
        className="mt-6 text-[11px] tracking-[0.1em] uppercase"
        style={{ color: '#3A4B45' }}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        رسائل حقيقية — ترسلها عَودة تلقائياً
      </motion.p>
    </div>
  )
}
