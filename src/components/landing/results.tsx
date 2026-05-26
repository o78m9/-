'use client'

import { useEffect, useRef } from 'react'
import { SectionNumber } from '@/components/ui/section-number'

const STATS = [
  {
    display: '١٢,٤٠٠',
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
        if (entry.isIntersecting && !fired.current) {
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
      className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 sm:gap-16 py-10 border-b border-line last:border-0"
    >
      {/* Number */}
      <div className="flex items-baseline gap-3 flex-shrink-0">
        <span
          ref={numRef}
          className="font-fraunces font-[600] text-copper leading-none"
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
          className="font-sans font-[500] text-copper/70"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.75rem)' }}
        >
          {unit}
        </span>
      </div>

      {/* Label */}
      <p
        className="text-mute sm:text-end"
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
      className="py-28 px-6"
      style={{ background: 'var(--cream)' }}
      aria-labelledby="results-heading"
    >
      <div className="max-w-content mx-auto">
        <SectionNumber n={4} label="الأرقام" />

        <h2
          id="results-heading"
          className="font-sans font-[700] text-ink mb-16"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
          }}
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
