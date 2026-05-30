'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface Props {
  data: { month: string; revenue: number; visitCount: number }[]
}

const MONTH_AR: Record<string, string> = {
  '01': 'يناير',
  '02': 'فبراير',
  '03': 'مارس',
  '04': 'أبريل',
  '05': 'مايو',
  '06': 'يونيو',
  '07': 'يوليو',
  '08': 'أغسطس',
  '09': 'سبتمبر',
  '10': 'أكتوبر',
  '11': 'نوفمبر',
  '12': 'ديسمبر',
}

function formatMonth(m: string) {
  const mm = m.split('-')[1]
  return (mm ? MONTH_AR[mm] : undefined) ?? m
}

export function RevenueBarChart({ data }: Props) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: '#0F2922', border: '1px solid rgba(212,165,116,0.15)' }}
      dir="rtl"
    >
      <p className="text-[12px] font-medium mb-5" style={{ color: '#8A9B95' }}>
        الإيراد المسترجع — آخر ٦ أشهر
      </p>
      <div style={{ height: 180 }} dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fill: '#6B6359', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B6359', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: '#0A1F1C',
                border: '1px solid rgba(212,165,116,0.2)',
                borderRadius: 8,
                direction: 'rtl',
              }}
              labelFormatter={formatMonth}
              formatter={(value: number) => [`${value.toLocaleString()} ر.س`, 'الإيراد']}
            />
            <Bar dataKey="revenue" fill="#D4A574" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
