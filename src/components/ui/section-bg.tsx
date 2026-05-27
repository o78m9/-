import type { CSSProperties } from 'react'

type GlowPos = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

export function SectionGlow({
  color = 'gold',
  position = 'top-right',
  size = 700,
  opacity = 0.07,
}: {
  color?: 'gold' | 'sage'
  position?: GlowPos
  size?: number
  opacity?: number
}) {
  const rgb = color === 'gold' ? '212,165,116' : '127,181,168'
  const pos: Record<GlowPos, CSSProperties> = {
    'top-left': { top: -size * 0.3, left: -size * 0.2 },
    'top-right': { top: -size * 0.3, right: -size * 0.2 },
    'bottom-left': { bottom: -size * 0.3, left: -size * 0.2 },
    'bottom-right': { bottom: -size * 0.3, right: -size * 0.2 },
    center: { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' },
  }
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(${rgb},${opacity}) 0%, transparent 70%)`,
        filter: 'blur(48px)',
        ...pos[position],
      }}
    />
  )
}

export function DotGrid({
  opacity = 0.035,
  color = '#6B6359',
  size = 28,
}: {
  opacity?: number
  color?: string
  size?: number
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    />
  )
}
