'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(false)
  const hoveringRef = useRef(false)
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let rafId: number

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visibleRef.current) {
        visibleRef.current = true
        setVisible(true)
      }
      if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function animate() {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(animate)
    }

    function onMouseLeave() {
      visibleRef.current = false
      setVisible(false)
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as Element
      const isInteractive = !!target.closest(
        'a, button, [role="button"], input, textarea, select, [tabindex]',
      )
      if (isInteractive !== hoveringRef.current) {
        hoveringRef.current = isInteractive
        setHovering(isInteractive)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseleave', onMouseLeave)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#7FB5A8',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hovering ? 56 : 40,
          height: hovering ? 56 : 40,
          borderRadius: '50%',
          border: '1.5px solid rgba(212, 165, 116, 0.5)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition:
            'opacity 200ms, width 300ms cubic-bezier(0.16,1,0.3,1), height 300ms cubic-bezier(0.16,1,0.3,1)',
          willChange: 'transform',
        }}
      />
    </>
  )
}
