'use client'

import { useEffect, useRef } from 'react'
import { SectionNumber } from '@/components/ui/section-number'
import { SectionGlow, DotGrid } from '@/components/ui/section-bg'

const STATS = [
  {
    display: '١٢٬٤٠٠',
    unit: 'ر.س',
    label: 'متوسط الإيرادات المسترجعة شهرياً لكل عيادة',
    countTo: 12400,
  },
  {
    display: '٣٤',
    unit: '٪',
    label: 'نسبة الرد على رسائل عَودة',
    countTo: 34,
  },
  {
    display: '٤',
    unit: 'أيام',
    label: 'لأول حجز موعد من لحظة إرسال الرسالة',
    countTo: 4,
  },
]

function StatRow({
  display,
  unit,
  label,
  countTo,
}: {
  display: string
  unit: string
  label: string
  countTo: number
}) {
  const numRef = useRef<HTMLSpanElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    const row = rowRef.current
    const num = numRef.current
    if (!row || !num) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !fired.current) {
          fired.current = true
          const t0 = performance.now()
          const dur = 1800
          const ease = (t: number) => 1 - Math.pow(1 - t, 3)

          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1)
            const cur = Math.round(ease(p) * countTo)
            num.textContent = new Intl.NumberFormat('ar-SA').format(cur)
            if (p < 1) requestAnimationFrame(tick)
            else num.textContent = display
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(row)
    return () => obs.disconnect()
  }, [countTo, display])

  return (
    <div
      ref={rowRef}
      className="relative flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 sm:gap-16 py-12 border-b border-line last:border-0"
    >
      {/* Subtle glow behind the number */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute start-0 top-1/2 -translate-y-1/2"
        style={{
          width: 200,
          height: 120,
          background: 'radial-gradient(ellipse, rgba(184,116,61,0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Number */}
      <div className="flex items-baseline gap-3 flex-shrink-0 relative">
        <span
          ref={numRef}
          className="font-fraunces font-semibold text-copper leading-none"
          style={{
            fontSize: 'clamp(4.5rem, 11vw, 8rem)',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
          aria-label={String(countTo)}
        >
          {display}
        </span>
        <span
          className="font-sans font-medium"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.75rem)', color: '#B8743D' }}
        >
          {unit}
        </span>
      </div>

      {/* Label */}
      <p
        className="text-mute sm:text-end relative"
        style={{ fontSize: 18, maxWidth: '36ch', lineHeight: 1.65 }}
      >
        {label}
      </p>
    </div>
  )
}

export function ResultsSection() {
  return (
    <section
      className="relative overflow-hidden py-20 px-6"
      style={{ background: 'var(--cream)' }}
      aria-labelledby="results-heading"
    >
      <DotGrid opacity={0.025} color="#B8743D" size={36} />
      <SectionGlow color="gold" position="top-right" size={700} opacity={0.05} />
      <SectionGlow color="sage" position="bottom-left" size={500} opacity={0.03} />

      <div className="max-w-content mx-auto relative z-10">
        <SectionNumber n={4} label="الأرقام" />

        {/* Eyebrow pill */}
        <div className="mb-6" dir="rtl">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase"
            style={{
              background: 'rgba(184,116,61,0.08)',
              color: '#B8743D',
              border: '1px solid rgba(184,116,61,0.16)',
            }}
          >
            نتائج مؤكدة
          </span>
        </div>

        <h2
          id="results-heading"
          className="font-sans font-bold text-ink mb-8"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
          }}
          dir="rtl"
        >
          أرقام تتكلم عن نفسها
        </h2>

        <div>
          {STATS.map((s) => (
            <StatRow key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
