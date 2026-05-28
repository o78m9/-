'use client'

import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let ticking = false

    function update() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      if (bar) bar.style.transform = `scaleX(${progress})`
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        insetInlineStart: 0,
        insetInlineEnd: 0,
        height: '3px',
        background: 'linear-gradient(to left, #7FB5A8, #D4A574)',
        transformOrigin: 'inline-start center',
        transform: 'scaleX(0)',
        zIndex: 9999,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    />
  )
}
