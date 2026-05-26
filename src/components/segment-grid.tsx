'use client'
import { motion } from 'framer-motion'
import { Star, Users, Clock, UserX, AlertCircle, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CountUp } from '@/components/count-up'
import { cn } from '@/lib/utils'

interface Segment {
  key: string
  label: string
  sublabel: string
  icon: LucideIcon
  cardBg: string
  cardBorder: string
  iconBg: string
  iconColor: string
  numColor: string
}

const SEGMENTS: Segment[] = [
  {
    key: 'vip',
    label: 'VIP',
    sublabel: 'الأكثر قيمة',
    icon: Star,
    cardBg: 'bg-amber-50',
    cardBorder: 'border-amber-200/70',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    numColor: 'text-amber-900',
  },
  {
    key: 'active',
    label: 'نشطون',
    sublabel: 'زاروا مؤخراً',
    icon: Users,
    cardBg: 'bg-teal-50',
    cardBorder: 'border-teal-200/70',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
    numColor: 'text-teal-900',
  },
  {
    key: 'at-risk',
    label: 'يحتاجون تواصل',
    sublabel: 'لم يزوروا مؤخراً',
    icon: AlertCircle,
    cardBg: 'bg-slate-50',
    cardBorder: 'border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    numColor: 'text-slate-800',
  },
  {
    key: 'dormant',
    label: 'خاملون',
    sublabel: 'غائبون فترة',
    icon: Clock,
    cardBg: 'bg-stone-50',
    cardBorder: 'border-stone-200',
    iconBg: 'bg-stone-100',
    iconColor: 'text-stone-600',
    numColor: 'text-stone-800',
  },
  {
    key: 'lost',
    label: 'مفقودون',
    sublabel: 'يحتاجون إعادة تفعيل',
    icon: UserX,
    cardBg: 'bg-slate-100',
    cardBorder: 'border-slate-300/60',
    iconBg: 'bg-slate-200',
    iconColor: 'text-slate-500',
    numColor: 'text-slate-700',
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
          >
            <Card
              className={cn(
                'p-5 cursor-default border shadow-sm transition-shadow duration-200 hover:shadow-md',
                seg.cardBg,
                seg.cardBorder,
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center mb-4',
                  seg.iconBg,
                )}
              >
                <seg.icon size={15} className={seg.iconColor} />
              </div>

              <CountUp
                to={count}
                className={cn(
                  'font-metric text-metric-md font-bold leading-none block',
                  seg.numColor,
                )}
                duration={1.0}
              />

              <p
                className={cn(
                  'text-sm font-medium mt-2 tracking-tight',
                  seg.numColor.replace('900', '800').replace('800', '700'),
                )}
              >
                {seg.label}
              </p>

              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-400">{seg.sublabel}</p>
                <span className="font-metric text-xs text-slate-400">{pct}%</span>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
