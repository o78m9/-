'use client'

import { motion } from 'framer-motion'
import { SectionGlow } from '@/components/ui/section-bg'

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

function FADE(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.65, delay, ease: EASE_OUT_EXPO },
  }
}

function PatientGrid() {
  // 8×4 = 32 cells. Illustrative visualization, not a measured ratio.
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

      {/* Legend — illustrative only, no fabricated percentage */}
      <div className="flex flex-col gap-2" dir="rtl">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(127,181,168,0.5)' }} />
          <span style={{ color: '#8A9B95', fontSize: 12 }}>عملاء نشطون</span>
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
            عملاء خاملون — <span style={{ color: '#D4A574', fontWeight: 600 }}>ينتظرون تذكير</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export function StatementSection() {
  return (
    <section
      className="relative overflow-hidden py-20 px-6 bg-paper"
      aria-labelledby="statement-heading"
    >
      <SectionGlow color="gold" position="top-left" size={600} opacity={0.04} />
      <SectionGlow color="sage" position="bottom-right" size={500} opacity={0.035} />

      <div className="max-w-content mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center" dir="rtl">
          {/* Right column (RTL = visually right) — text */}
          <div>
            {/* Eyebrow */}
            <motion.div {...FADE(0)} className="mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase bg-copper/9 text-copper dark:text-gold-300 border border-copper/18 dark:border-gold-500/20">
                المشكلة
              </span>
            </motion.div>

            {/* Headline — no fabricated SAR figures.
                TODO(brand): if pilot clinic data supports a per-patient loss range,
                cite source + sample size. Until then, qualitative framing only. */}
            <motion.p
              id="statement-heading"
              className="font-sans font-bold text-ink leading-[1.2]"
              style={{
                fontSize: 'clamp(1.9rem, 4vw, 3.2rem)',
                maxWidth: '26ch',
              }}
              {...FADE(0.1)}
            >
              كل عميل ما رجع، إيراد ضايع — وأنت ما تدري.
            </motion.p>

            <motion.p
              className="mt-8 text-mute leading-relaxed text-[17px] max-w-[42ch]"
              {...FADE(0.2)}
            >
              هذا اللي نحن نرجّعه — تلقائياً. بدون جهد يدوي. مبني لعيادات الأسنان والتجميل في الخليج
              والأردن.
            </motion.p>

            <motion.p
              className="mt-5 text-mute text-[13px] tracking-wide max-w-[42ch] leading-[1.7]"
              {...FADE(0.28)}
            >
              ملاحظة: حجم الخسارة يختلف من عيادة لأخرى بناءً على متوسط قيمة الزيارة وحجم قاعدة
              العملاء. نحسب التقدير الخاص بعيادتك ضمن الديمو.
            </motion.p>
          </div>

          {/* Left column (RTL = visually left) — visual */}
          <motion.div className="flex flex-col items-center lg:items-start gap-10" {...FADE(0.15)}>
            {/* Patient grid */}
            <div className="relative" dir="rtl">
              <p className="mb-4 text-mute text-[12px] font-semibold tracking-[0.1em] uppercase">
                توزيع توضيحي لقاعدة عملاء عيادة
              </p>
              <PatientGrid />
              <p className="mt-3 text-mute text-[11px] max-w-[26ch] leading-[1.6]">
                رسم توضيحي — النسب الفعلية لعيادتك تظهر في الديمو بعد رفع البيانات.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
