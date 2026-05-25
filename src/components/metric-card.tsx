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
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
    >
      <Card className="p-5 h-full flex flex-col justify-between gap-3 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <p className="text-xs text-gray-500 leading-tight">{label}</p>
          {trend !== undefined && (
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium font-metric',
                trendPositive ? 'text-emerald-600' : 'text-red-500'
              )}
            >
              {trendPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-2">
          <CountUp
            to={value}
            prefix={prefix}
            suffix={suffix}
            className="font-metric text-3xl font-bold text-gray-900 leading-none"
            duration={1.2}
          />
        </div>

        <Sparkline data={sparkData} color={color} height={40} />
      </Card>
    </motion.div>
  )
}
