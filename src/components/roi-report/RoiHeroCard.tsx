'use client'

import { CountUp } from '@/components/ui/count-up'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  current: number
  previous: number
  label: string
  sublabel?: string
  prefix?: string
  suffix?: string
}

export function RoiHeroCard({
  current,
  previous,
  label,
  sublabel,
  prefix = '',
  suffix = '',
}: Props) {
  const diff = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0
  const up = diff >= 0

  return (
    <div
      className="rounded-2xl p-6 flex flex-col"
      style={{ background: '#0F2922', border: '1px solid rgba(212,165,116,0.15)' }}
      dir="rtl"
    >
      <p className="text-[12px] font-medium mb-4" style={{ color: '#8A9B95' }}>
        {label}
      </p>
      <div className="flex items-baseline gap-1 mb-2">
        {prefix && (
          <span className="text-[14px]" style={{ color: '#D4A574' }}>
            {prefix}
          </span>
        )}
        <span
          className="font-black"
          style={{
            fontSize: 'clamp(2rem,4vw,3rem)',
            color: '#F5EFE6',
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-tajawal)',
          }}
        >
          <CountUp end={current} arabicNumerals />
        </span>
        {suffix && (
          <span className="text-[14px]" style={{ color: '#D4A574' }}>
            {suffix}
          </span>
        )}
      </div>
      {sublabel && (
        <p className="text-[11px] mb-3" style={{ color: '#8A9B95' }}>
          {sublabel}
        </p>
      )}
      {previous > 0 && (
        <div className="flex items-center gap-1.5 mt-auto">
          {up ? (
            <TrendingUp size={13} style={{ color: '#7FB5A8' }} />
          ) : (
            <TrendingDown size={13} style={{ color: '#C17B4E' }} />
          )}
          <span className="text-[11px] font-medium" style={{ color: up ? '#7FB5A8' : '#C17B4E' }}>
            {up ? '+' : ''}
            {diff}٪
          </span>
          <span className="text-[11px]" style={{ color: '#6B6359' }}>
            مقارنة بالشهر السابق
          </span>
        </div>
      )}
    </div>
  )
}
