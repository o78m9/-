'use client'

import { motion } from 'framer-motion'
import { SectionGlow } from '@/components/ui/section-bg'

function FADE(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.65, delay, ease: 'easeOut' as const },
  }
}

function PatientGrid() {
  // 8×4 = 32 cells. 60% active (sage), 40% dormant.
  const cells = Array.from({ length: 32 }, (_, i) => i < 20)

  return (
    <div>
      <div
        className="grid gap-2 mb-5"
        style={{ gridTemplateColumns: 'repeat(8, minmax(0,1fr))', maxWidth: 224 }}
      >
        {cells.map((active, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded"
            style={{
              background: active ? 'rgba(127,181,168,0.5)' : 'rgba(127,181,168,0.07)',
              border: active ? 'none' : '1px solid rgba(127,181,168,0.14)',
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.03, duration: 0.35, ease: 'backOut' }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2" dir="rtl">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(127,181,168,0.5)' }} />
          <span style={{ color: '#8A9B95', fontSize: 12 }}>
            عملاء نشطون <span style={{ color: '#7FB5A8', fontWeight: 600 }}>٦٠٪</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{
              border: '1px solid rgba(127,181,168,0.25)',
              background: 'rgba(127,181,168,0.07)',
            }}
          />
          <span style={{ color: '#8A9B95', fontSize: 12 }}>
            عملاء خاملون — <span style={{ color: '#D4A574', fontWeight: 600 }}>٤٠٪ ينتظرون</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export function StatementSection() {
  return (
    <section
      className="relative overflow-hidden py-32 px-6"
      style={{ background: 'var(--paper)' }}
      aria-labelledby="statement-heading"
    >
      <SectionGlow color="gold" position="top-left" size={600} opacity={0.04} />
      <SectionGlow color="sage" position="bottom-right" size={500} opacity={0.035} />

      {/* Decorative watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-1/2 start-1/2 font-sans font-black leading-none"
        style={{
          fontSize: 'clamp(8rem, 22vw, 18rem)',
          transform: 'translate(-20%, -60%)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(184,116,61,0.06)',
          letterSpacing: '-0.05em',
          zIndex: 0,
          whiteSpace: 'nowrap',
        }}
      >
        ٤٠٪
      </div>

      <div className="max-w-content mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center" dir="rtl">
          {/* Right column (RTL = visually right) — text */}
          <div>
            {/* Eyebrow */}
            <motion.div {...FADE(0)} className="mb-8">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase"
                style={{
                  background: 'rgba(184,116,61,0.09)',
                  color: '#B8743D',
                  border: '1px solid rgba(184,116,61,0.18)',
                }}
              >
                المشكلة
              </span>
            </motion.div>

            <motion.p
              id="statement-heading"
              className="font-sans font-bold text-ink leading-[1.2]"
              style={{
                fontSize: 'clamp(1.9rem, 4vw, 3.2rem)',
                letterSpacing: '-0.028em',
                maxWidth: '24ch',
              }}
              {...FADE(0.1)}
            >
              كل عميل ما رجع لـ{' '}
              <span
                className="font-fraunces font-semibold text-copper"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                ٩
              </span>{' '}
              أشهر، خسارة{' '}
              <span
                className="font-fraunces font-semibold text-copper"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                ١٫٨٠٠
              </span>{' '}
              ر.س.
              <br />
              اضرب هذا بـ{' '}
              <span
                className="font-fraunces font-semibold text-copper"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                ١٠٠
              </span>{' '}
              عميل.
            </motion.p>

            <motion.p
              className="mt-8 text-mute leading-relaxed"
              style={{ fontSize: 17, maxWidth: '40ch' }}
              {...FADE(0.2)}
            >
              هذا اللي نحن نرجّعه — تلقائياً. بدون جهد يدوي. مبني لعيادات الأسنان في الخليج والأردن.
            </motion.p>

            <motion.p
              className="mt-5"
              style={{ fontSize: 13, color: '#9A9089', letterSpacing: '0.01em' }}
              {...FADE(0.28)}
            >
              المصدر: دراسة على ٢٠٠+ عيادة في منطقة الخليج
            </motion.p>
          </div>

          {/* Left column (RTL = visually left) — visual */}
          <motion.div className="flex flex-col items-center lg:items-start gap-10" {...FADE(0.15)}>
            {/* Patient grid */}
            <div className="relative" dir="rtl">
              <p
                className="mb-4 text-[12px] font-semibold tracking-[0.1em] uppercase"
                style={{ color: '#9A9089' }}
              >
                توزيع عملاء عيادة نموذجية
              </p>
              <PatientGrid />
            </div>

            {/* Stat pill */}
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl"
              style={{
                background: 'rgba(184,116,61,0.06)',
                border: '1px solid rgba(184,116,61,0.14)',
              }}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5, ease: 'backOut' }}
              dir="rtl"
            >
              <span
                className="font-fraunces font-semibold text-copper"
                style={{
                  fontSize: 36,
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ١٨٠ ألف
              </span>
              <div>
                <p style={{ color: '#6B6359', fontSize: 13, lineHeight: 1.4 }}>
                  ريال سعودي
                  <br />
                  <span style={{ color: '#9A9089', fontSize: 12 }}>خسارة سنوية لعيادة متوسطة</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
