'use client'

import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts'

const BAR_DATA = [
  { v: 28 },
  { v: 42 },
  { v: 35 },
  { v: 58 },
  { v: 52 },
  { v: 68 },
  { v: 62 },
  { v: 80 },
  { v: 76 },
  { v: 100 },
]

interface ProductMockupProps {
  scale?: 'default' | 'large'
}

export function ProductMockup({ scale = 'default' }: ProductMockupProps) {
  const isLarge = scale === 'large'

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#142B27',
        border: '1px solid rgba(127,181,168,0.15)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2), 0 12px 40px -8px rgba(0,0,0,0.35)',
      }}
    >
      {/* Browser chrome */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{
          background: '#0A1F1C',
          borderBottom: '1px solid rgba(127,181,168,0.1)',
        }}
      >
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(127,181,168,0.3)' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(127,181,168,0.3)' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(127,181,168,0.3)' }} />
        </div>
        <div
          className="flex-1 rounded-md h-5 max-w-[180px]"
          style={{ background: 'rgba(127,181,168,0.1)' }}
        />
      </div>

      {/* Content */}
      <div className={`${isLarge ? 'p-6' : 'p-5'}`} style={{ background: '#142B27' }}>
        {/* Topbar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#D4A574' }}
              aria-hidden="true"
            />
            <span
              className={`font-bold ${isLarge ? 'text-sm' : 'text-[12px]'}`}
              style={{ color: '#D4A574' }}
            >
              عَودة
            </span>
          </div>
          <div className="flex gap-2" aria-hidden="true">
            <div className="w-14 h-2 rounded" style={{ background: 'rgba(127,181,168,0.15)' }} />
            <div className="w-10 h-2 rounded" style={{ background: 'rgba(127,181,168,0.15)' }} />
            <div className="w-10 h-2 rounded" style={{ background: 'rgba(127,181,168,0.15)' }} />
          </div>
        </div>

        {/* Revenue card */}
        <div
          className="rounded-xl mb-3"
          style={{
            background: 'rgba(26,51,45,0.6)',
            border: '1px solid rgba(127,181,168,0.15)',
            padding: isLarge ? '20px' : '16px',
          }}
        >
          <p className="text-[8px] uppercase tracking-[0.06em] mb-2" style={{ color: '#8A9B95' }}>
            الإيرادات المسترجعة
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className={`font-bold leading-none font-metric ${isLarge ? 'text-[40px]' : 'text-[32px]'}`}
              style={{ color: '#D4A574' }}
            >
              8,400
            </span>
            <span
              className={`font-metric ${isLarge ? 'text-lg' : 'text-sm'}`}
              style={{ color: '#8A9B95' }}
            >
              ر.س
            </span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-medium font-metric" style={{ color: '#7FB5A8' }}>
              +23%
            </span>
            <span className="text-[10px]" style={{ color: '#8A9B95' }}>
              مقارنة بالشهر السابق
            </span>
          </div>

          {/* Recharts bar chart */}
          <div style={{ height: isLarge ? 56 : 44 }} aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA} barCategoryGap="28%">
                <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                  {BAR_DATA.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === BAR_DATA.length - 1 ? '#D4A574' : 'rgba(127,181,168,0.2)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { n: '247', l: 'إجمالي العملاء' },
            { n: '89', l: 'نشطون' },
            { n: '12', l: 'مواعيد' },
          ].map(({ n, l }) => (
            <div
              key={l}
              className="rounded-lg"
              style={{
                background: 'rgba(26,51,45,0.6)',
                border: '1px solid rgba(127,181,168,0.12)',
                padding: isLarge ? '12px' : '10px',
              }}
            >
              <p
                className="text-[7px] uppercase tracking-[0.05em] mb-1"
                style={{ color: '#8A9B95' }}
              >
                {l}
              </p>
              <p
                className={`font-bold leading-none font-metric ${isLarge ? 'text-xl' : 'text-[17px]'}`}
                style={{ color: '#F5EFE6' }}
              >
                {n}
              </p>
            </div>
          ))}
        </div>

        {/* Segment tags */}
        <div className="flex gap-1.5">
          {[
            {
              l: 'VIP',
              bg: 'rgba(212,165,116,0.15)',
              color: '#D4A574',
              border: 'rgba(212,165,116,0.3)',
            },
            {
              l: 'نشطون',
              bg: 'rgba(127,181,168,0.12)',
              color: '#7FB5A8',
              border: 'rgba(127,181,168,0.25)',
            },
            {
              l: 'خاملون',
              bg: 'rgba(138,155,149,0.1)',
              color: '#8A9B95',
              border: 'rgba(138,155,149,0.2)',
            },
          ].map(({ l, bg, color, border }) => (
            <span
              key={l}
              className="text-[7px] font-medium px-2 py-0.5 rounded-full border"
              style={{ background: bg, color, borderColor: border }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
