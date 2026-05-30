'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { status: string; count: number }[]
}

const LABELS: Record<string, string> = {
  active: 'نشط',
  dormant: 'خامل',
  vip: 'VIP',
  lost: 'مفقود',
}
const COLORS: Record<string, string> = {
  active: '#7FB5A8',
  dormant: '#D4A574',
  vip: '#C08840',
  lost: '#6B6359',
}

export function SegmentDonutChart({ data }: Props) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: '#0F2922', border: '1px solid rgba(212,165,116,0.15)' }}
      dir="rtl"
    >
      <p className="text-[12px] font-medium mb-4" style={{ color: '#8A9B95' }}>
        توزيع المرضى
      </p>
      <div className="flex items-center gap-6">
        <div style={{ width: 120, height: 120 }} dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={54}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status] ?? '#4A4440'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0A1F1C',
                  border: '1px solid rgba(212,165,116,0.2)',
                  borderRadius: 8,
                  direction: 'rtl',
                }}
                formatter={(value: number, _: unknown, props: { payload?: { status: string } }) => [
                  value.toLocaleString(),
                  LABELS[props?.payload?.status ?? ''] ?? '—',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.status} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: COLORS[entry.status] ?? '#4A4440' }}
              />
              <span className="text-[11px]" style={{ color: '#8A9B95' }}>
                {LABELS[entry.status] ?? '—'}
              </span>
              <span className="text-[11px] font-semibold" style={{ color: '#F5EFE6' }}>
                {entry.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
