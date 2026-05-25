'use client'
import { motion } from 'framer-motion'
import { MessageSquare, Calendar, Reply } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { type ActivityItem } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

const TYPE_CONFIG = {
  message: {
    icon: MessageSquare,
    bg: 'bg-teal-50',
    color: 'text-teal-700',
    border: 'border-teal-100',
  },
  reply: {
    icon: Reply,
    bg: 'bg-slate-50',
    color: 'text-slate-600',
    border: 'border-slate-100',
  },
  booking: {
    icon: Calendar,
    bg: 'bg-amber-50',
    color: 'text-amber-700',
    border: 'border-amber-100',
  },
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card className="h-full flex flex-col border-slate-100 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">النشاط الأخير</h3>
        <span className="label-caption">{items.length} حدث</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
        {items.map((item, i) => {
          const cfg = TYPE_CONFIG[item.type]

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.4 + i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50/80 transition-colors"
            >
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border', cfg.bg, cfg.border)}>
                <cfg.icon size={12} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{item.text}</p>
              </div>
              <span className="font-metric text-[11px] text-slate-400 shrink-0 mt-0.5">{item.time}</span>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
