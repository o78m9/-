'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi } from 'lucide-react'

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

function toAr(n: number) {
  return n.toString().replace(/\d/g, (d) => ARABIC_DIGITS[parseInt(d)] ?? d)
}

// Simulates a real-ish counter that slowly increments
function getBaseCount() {
  const seed = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) // changes daily
  return 38 + (seed % 24)
}

export function LiveCounter() {
  const [count, setCount] = useState(getBaseCount)
  const [key, setKey] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Increment every 30s ±15s to feel organic
    function schedule() {
      const delay = 30000 + (Math.random() - 0.5) * 15000
      intervalRef.current = setTimeout(() => {
        setCount((c) => {
          const next = c + (Math.random() > 0.7 ? 2 : 1)
          return Math.min(next, 99)
        })
        setKey((k) => k + 1)
        schedule()
      }, delay)
    }

    schedule()
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [])

  return (
    <div
      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full"
      style={{
        background: 'rgba(127,181,168,0.08)',
        border: '1px solid rgba(127,181,168,0.2)',
      }}
      role="status"
      aria-live="polite"
      aria-label={`${count} مريض عادوا خلال آخر ٢٤ ساعة`}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <div
          className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-pulse"
          aria-hidden="true"
          style={{ background: '#7FB5A8' }}
        />
        <Wifi className="w-3.5 h-3.5" style={{ color: '#7FB5A8' }} aria-hidden="true" />
      </div>
      <span className="text-[0.875rem]" style={{ color: '#F5EFE6' }}>
        <AnimatePresence mode="wait">
          <motion.strong
            key={key}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
            style={{ color: '#D4A574', fontFamily: 'var(--font-tajawal)', fontWeight: 900 }}
          >
            {toAr(count)}
          </motion.strong>
        </AnimatePresence>{' '}
        مريضاً عادوا خلال آخر ٢٤ ساعة
      </span>
    </div>
  )
}
