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
      className="w-full rounded-2xl overflow-hidden bg-white"
      style={{
        boxShadow:
          '0 4px 6px -1px rgba(0,0,0,0.04), 0 12px 40px -8px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)',
      }}
    >
      {/* Browser chrome */}
      <div className="bg-[#F5F4F1] border-b border-[#E8E6E0] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="w-3 h-3 rounded-full bg-[#E8E6E0]" />
          <div className="w-3 h-3 rounded-full bg-[#E8E6E0]" />
          <div className="w-3 h-3 rounded-full bg-[#E8E6E0]" />
        </div>
        <div className="flex-1 bg-[#E8E6E0] rounded-md h-5 max-w-[180px]" />
      </div>

      {/* Content */}
      <div className={`bg-[#FAFAF7] ${isLarge ? 'p-6' : 'p-5'}`}>
        {/* Topbar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0F4C44]" aria-hidden="true" />
            <span className={`font-bold text-[#0F4C44] ${isLarge ? 'text-sm' : 'text-[12px]'}`}>
              عَودة
            </span>
          </div>
          <div className="flex gap-2" aria-hidden="true">
            <div className="w-14 h-2 rounded bg-[#E8E6E0]" />
            <div className="w-10 h-2 rounded bg-[#E8E6E0]" />
            <div className="w-10 h-2 rounded bg-[#E8E6E0]" />
          </div>
        </div>

        {/* Revenue card */}
        <div
          className="bg-white border border-[#E8E6E0] rounded-xl mb-3"
          style={{ padding: isLarge ? '20px' : '16px' }}
        >
          <p className="text-[8px] text-[#5C5C5C] uppercase tracking-[0.06em] mb-2">
            الإيرادات المسترجعة
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className={`font-bold text-[#B8761A] leading-none font-metric ${isLarge ? 'text-[40px]' : 'text-[32px]'}`}
            >
              8,400
            </span>
            <span className={`text-[#5C5C5C] font-metric ${isLarge ? 'text-lg' : 'text-sm'}`}>
              ر.س
            </span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-green-700 font-medium font-metric">+23%</span>
            <span className="text-[10px] text-[#5C5C5C]">مقارنة بالشهر السابق</span>
          </div>

          {/* Recharts bar chart */}
          <div style={{ height: isLarge ? 56 : 44 }} aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA} barCategoryGap="28%">
                <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                  {BAR_DATA.map((_, i) => (
                    <Cell key={i} fill={i === BAR_DATA.length - 1 ? '#0F4C44' : '#E8E6E0'} />
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
              className="bg-white border border-[#E8E6E0] rounded-lg"
              style={{ padding: isLarge ? '12px' : '10px' }}
            >
              <p className="text-[7px] text-[#5C5C5C] uppercase tracking-[0.05em] mb-1">{l}</p>
              <p
                className={`font-bold text-[#0A0A0A] leading-none font-metric ${isLarge ? 'text-xl' : 'text-[17px]'}`}
              >
                {n}
              </p>
            </div>
          ))}
        </div>

        {/* Segment tags */}
        <div className="flex gap-1.5">
          {[
            { l: 'VIP', c: 'bg-[#FDF6EC] text-[#B8761A] border-[#F0DFB8]' },
            { l: 'نشطون', c: 'bg-[#E6F0EE] text-[#0F4C44] border-[#C2D9D5]' },
            { l: 'خاملون', c: 'bg-[#F5F4F1] text-[#5C5C5C] border-[#E8E6E0]' },
          ].map(({ l, c }) => (
            <span key={l} className={`text-[7px] font-medium px-2 py-0.5 rounded-full border ${c}`}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
