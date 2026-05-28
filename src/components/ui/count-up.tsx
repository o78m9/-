'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  arabicNumerals?: boolean
  className?: string
}

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

function toArabicNumerals(n: number): string {
  return n.toString().replace(/\d/g, (d) => ARABIC_DIGITS[parseInt(d)] ?? d)
}

export function CountUp({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  arabicNumerals = true,
  className,
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setCount(end)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !started.current) {
          started.current = true
          observer.disconnect()

          const startTime = performance.now()

          function easeOutExpo(t: number) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
          }

          function step(now: number) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easedProgress = easeOutExpo(progress)
            setCount(Math.round(easedProgress * end))

            if (progress < 1) requestAnimationFrame(step)
          }

          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  const display = arabicNumerals ? toArabicNumerals(count) : count.toLocaleString()

  return (
    <span ref={ref} className={className} aria-label={`${end}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
