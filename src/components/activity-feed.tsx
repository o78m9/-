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
    color: 'text-teal-600',
    border: 'border-teal-100',
  },
  reply: {
    icon: Reply,
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  booking: {
    icon: Calendar,
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    border: 'border-blue-100',
  },
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">النشاط الأخير</h3>
        <span className="text-xs text-gray-400 font-metric">{items.length} حدث</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
        {items.map((item, i) => {
          const cfg = TYPE_CONFIG[item.type]

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.4 + i * 0.06 }}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border', cfg.bg, cfg.border)}>
                <cfg.icon size={13} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500 truncate">{item.text}</p>
              </div>
              <span className="text-[11px] text-gray-400 font-metric shrink-0 mt-0.5">{item.time}</span>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
