'use client'
import { motion } from 'framer-motion'
import { Star, Users, AlertTriangle, Clock, UserX } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/count-up'
import { cn } from '@/lib/utils'

interface Segment {
  key: string
  label: string
  icon: React.ElementType
  color: string
  iconBg: string
  iconColor: string
}

const SEGMENTS: Segment[] = [
  {
    key: 'vip',
    label: 'VIP',
    icon: Star,
    color: 'border-amber-200',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    key: 'active',
    label: 'نشطين',
    icon: Users,
    color: 'border-emerald-200',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'at-risk',
    label: 'في خطر',
    icon: AlertTriangle,
    color: 'border-orange-200',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    key: 'dormant',
    label: 'خاملين',
    icon: Clock,
    color: 'border-red-200',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    key: 'lost',
    label: 'مفقودين',
    icon: UserX,
    color: 'border-slate-200',
    iconBg: 'bg-slate-50',
    iconColor: 'text-slate-500',
  },
]

interface SegmentGridProps {
  stats: Record<string, number>
}

export function SegmentGrid({ stats }: SegmentGridProps) {
  const total = stats.total || 1

  return (
    <div className="grid grid-cols-5 gap-3">
      {SEGMENTS.map((seg, i) => {
        const count = stats[seg.key] ?? 0
        const pct = Math.round((count / total) * 100)

        return (
          <motion.div
            key={seg.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.06 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
          >
            <Card className={cn('p-4 cursor-default border', seg.color, 'hover:shadow-md transition-shadow duration-200')}>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', seg.iconBg)}>
                <seg.icon size={16} className={seg.iconColor} />
              </div>
              <CountUp
                to={count}
                className="font-metric text-2xl font-bold text-gray-900 leading-none block"
                duration={1.0}
              />
              <p className="text-xs text-gray-500 mt-1">{seg.label}</p>
              <p className="text-xs font-metric text-gray-400 mt-0.5">{pct}%</p>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
