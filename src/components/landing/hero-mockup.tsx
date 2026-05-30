'use client'

import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const DATA = [
  { v: 2400 },
  { v: 3100 },
  { v: 2700 },
  { v: 4200 },
  { v: 5600 },
  { v: 4900 },
  { v: 6800 },
  { v: 7400 },
  { v: 8200 },
  { v: 9600 },
  { v: 8900 },
  { v: 12400 },
]

const CUSTOMERS = [
  { name: 'فاطمة الزهراني', last: '٨ أشهر', seg: 'VIP', segColor: '#92400E', segBg: '#FEF3C7' },
  { name: 'أحمد الغامدي', last: '٦ أشهر', seg: 'نشط', segColor: '#166534', segBg: '#DCFCE7' },
  { name: 'نورة السلمي', last: '١١ شهر', seg: 'خامل', segColor: '#6B6359', segBg: '#E8DFD0' },
]

export function HeroMockup() {
  return (
    <div
      className="w-full rounded-[20px] bg-paper border border-line overflow-hidden"
      style={{ boxShadow: '0 30px 60px -20px rgba(26,24,21,0.18), 0 0 0 1px rgba(26,24,21,0.04)' }}
    >
      {/* Top bar */}
      <div className="border-b border-line px-5 py-3 flex items-center justify-between bg-cream/60">
        <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-copper" aria-hidden="true" />
          <span className="font-sans font-[700] text-[13px] text-ink tracking-[-0.02em]">
            عَودة
          </span>
          <span className="text-[11px] text-mute">· لوحة التحكم</span>
        </div>
        <div className="flex items-center gap-4" aria-hidden="true">
          {['العملاء', 'الحملات', 'التقارير'].map((t) => (
            <span key={t} className="text-[11px] text-mute">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Chart row */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, alignItems: 'flex-start' }}>
          {/* Area chart — visual left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="font-fraunces font-[600] text-copper leading-none"
                style={{
                  fontSize: 28,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.01em',
                }}
              >
                ١٢,٤٠٠
              </span>
              <span className="text-[12px] text-mute">ر.س · هذا الشهر</span>
            </div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[11px] font-[500]" style={{ color: '#4A6B5C' }}>
                ↑ ٣٤٪
              </span>
              <span className="text-[11px] text-mute">مقارنة بالشهر السابق</span>
            </div>
            <div style={{ height: 52 }} aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
                  <defs>
                    <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B8743D" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#B8743D" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#1F3D36"
                    strokeWidth={2}
                    fill="url(#heroAreaGrad)"
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics — visual right */}
          <div
            style={{
              width: 130,
              paddingInlineStart: 16,
              borderInlineStart: '1px solid #E8DFD0',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {[
              { n: '٢٤٧', l: 'إجمالي' },
              { n: '٨٩', l: 'خاملون' },
              { n: '٣٤٪', l: 'معدل الرد' },
            ].map(({ n, l }) => (
              <div key={l}>
                <div
                  className="font-fraunces font-[500] text-copper leading-none mb-0.5"
                  style={{ fontSize: 20, fontVariantNumeric: 'tabular-nums' }}
                >
                  {n}
                </div>
                <div className="text-[10px] text-mute">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer rows */}
        <div className="border-t border-line pt-3 space-y-1">
          {CUSTOMERS.map(({ name, last, seg, segColor, segBg }) => (
            <div
              key={name}
              className="flex items-center justify-between py-1.5 rounded-lg px-1 hover:bg-cream/60 transition-colors duration-100"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-[600] text-mute"
                  style={{ background: '#E8DFD0' }}
                  aria-hidden="true"
                >
                  {name[0]}
                </div>
                <div>
                  <div className="text-[12px] font-[500] text-ink">{name}</div>
                  <div className="text-[10px] text-mute">آخر زيارة: {last}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-[500] px-2 py-0.5 rounded-full"
                  style={{ color: segColor, background: segBg }}
                >
                  {seg}
                </span>
                <button
                  className="text-[11px] font-[500] text-paper rounded-full"
                  style={{
                    background: '#B8743D',
                    paddingInline: '10px',
                    paddingBlock: '4px',
                  }}
                  type="button"
                  aria-label={`إرسال رسالة لـ${name}`}
                >
                  إرسال
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
