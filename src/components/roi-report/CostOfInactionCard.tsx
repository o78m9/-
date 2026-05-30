'use client'

import { AlertTriangle } from 'lucide-react'
import { CountUp } from '@/components/ui/count-up'

interface Props {
  unreachedCount: number
  costOfInaction: number
}

export function CostOfInactionCard({ unreachedCount, costOfInaction }: Props) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(193,123,78,0.08)', border: '1px solid rgba(193,123,78,0.25)' }}
      dir="rtl"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={15} style={{ color: '#C17B4E' }} />
        <p className="text-[12px] font-medium" style={{ color: '#C17B4E' }}>
          تكلفة التقاعس — مرضى لم يُتواصل معهم
        </p>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span
          className="font-black"
          style={{
            fontSize: 'clamp(1.8rem,3vw,2.4rem)',
            color: '#F5EFE6',
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-tajawal)',
          }}
        >
          <CountUp end={unreachedCount} arabicNumerals />
        </span>
        <span className="text-[13px]" style={{ color: '#8A9B95' }}>
          مريض خامل
        </span>
      </div>
      <p className="text-[11px] mb-4" style={{ color: '#8A9B95' }}>
        إيراد محتمل ضائع:{' '}
        <span className="font-semibold" style={{ color: '#C17B4E' }}>
          <CountUp end={costOfInaction} arabicNumerals /> ر.س
        </span>
      </p>
      <p className="text-[11px] leading-relaxed" style={{ color: '#6B6359' }}>
        هذا الرقم يمثل متوسط الإنفاق التاريخي للمرضى الخاملين — يمكن استرجاع جزء منه بحملة تنشيط.
      </p>
    </div>
  )
}
