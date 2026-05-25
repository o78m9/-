'use client'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/count-up'
import { Sparkline } from '@/components/sparkline'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: number
  suffix?: string
  prefix?: string
  trend?: number
  sparkData: number[]
  color: string
  index?: number
}

export function MetricCard({ label, value, suffix, prefix, trend, sparkData, color, index = 0 }: MetricCardProps) {
  const trendPositive = (trend ?? 0) >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
    >
      <Card className="p-6 h-full flex flex-col justify-between gap-4 hover:shadow-md transition-shadow duration-200 border-slate-100 shadow-sm bg-white">
        {/* Label + trend */}
        <div className="flex items-start justify-between">
          <p className="label-caption">{label}</p>
          {trend !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium font-metric px-2 py-0.5 rounded-full',
                trendPositive
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 bg-slate-100'
              )}
            >
              {trendPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        {/* Big number */}
        <CountUp
          to={value}
          prefix={prefix}
          suffix={suffix}
          className="font-metric text-metric-md font-bold text-slate-900 leading-none"
          duration={1.2}
        />

        {/* Sparkline */}
        <Sparkline data={sparkData} color={color} height={44} />
      </Card>
    </motion.div>
  )
}
