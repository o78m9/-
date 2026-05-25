'use client'
import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'

interface CountUpProps {
  to: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function CountUp({ to, duration = 1.4, className, prefix = '', suffix = '', decimals = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        const formatted = decimals > 0
          ? value.toFixed(decimals)
          : Math.round(value).toLocaleString('en-US')
        el.textContent = prefix + formatted + suffix
      },
    })

    return () => controls.stop()
  }, [to, duration, prefix, suffix, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
