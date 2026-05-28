'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

function Particle({ x, y, color, size }: { x: number; y: number; color: string; size: number }) {
  const angle = Math.random() * Math.PI * 2
  const distance = 80 + Math.random() * 200
  const tx = Math.cos(angle) * distance
  const ty = Math.sin(angle) * distance - 100

  return (
    <motion.div
      aria-hidden="true"
      initial={{ x, y, opacity: 1, scale: 0 }}
      animate={{
        x: x + tx,
        y: y + ty,
        opacity: 0,
        scale: [0, 1.5, 0],
        rotate: Math.random() * 720 - 360,
      }}
      transition={{ duration: 1.2 + Math.random() * 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        width: size,
        height: size,
        borderRadius: Math.random() > 0.5 ? '50%' : 4,
        background: color,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  )
}

const COLORS = ['#D4A574', '#7FB5A8', '#F5EFE6', '#C08840', '#5EA090', '#DCA654', '#8AC5BC']

export function EasterEgg() {
  const [particles, setParticles] = useState<React.ReactNode[]>([])
  const [showMsg, setShowMsg] = useState(false)

  useEffect(() => {
    let seq = 0
    function onKey(e: KeyboardEvent) {
      const expected = KONAMI[seq]
      if (e.key === expected) {
        seq++
        if (seq === KONAMI.length) {
          seq = 0
          fire()
        }
      } else {
        seq = e.key === KONAMI[0] ? 1 : 0
      }
    }

    function fire() {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const newParticles = Array.from({ length: 60 }).map((_, i) => (
        <Particle
          key={`${Date.now()}-${i}`}
          x={cx}
          y={cy}
          color={COLORS[i % COLORS.length] ?? '#D4A574'}
          size={6 + Math.random() * 10}
        />
      ))
      setParticles(newParticles)
      setShowMsg(true)
      setTimeout(() => {
        setParticles([])
        setShowMsg(false)
      }, 3000)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {particles}
      <AnimatePresence>
        {showMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 text-center"
            style={{ transform: 'translate(-50%, -50%)', zIndex: 99998 }}
            role="status"
            aria-live="assertive"
          >
            <div
              className="px-8 py-6 rounded-2xl text-center"
              style={{
                background: '#0D2A24',
                border: '1px solid rgba(212,165,116,0.3)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              }}
            >
              <p
                className="text-4xl mb-2"
                style={{ fontFamily: 'var(--font-tajawal)', color: '#D4A574', fontWeight: 900 }}
              >
                اكتشفت السر!
              </p>
              <p style={{ color: '#8A9B95', fontSize: '0.875rem' }}>أنت مميز. شكراً لفضولك.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
