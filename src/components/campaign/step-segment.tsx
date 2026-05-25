'use client'
import { motion } from 'framer-motion'
import { Star, Users, AlertTriangle, Clock, UserX, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const SEGMENTS = [
  {
    key: 'vip',
    label: 'VIP',
    desc: 'عملاء أوفياء وقيمة عالية',
    icon: Star,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    selectedBg: 'bg-amber-50/60',
    selectedBorder: 'border-amber-500',
    recommended: false,
  },
  {
    key: 'active',
    label: 'نشطين',
    desc: 'زاروا خلال الـ 3 أشهر الأخيرة',
    icon: Users,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    selectedBg: 'bg-emerald-50/60',
    selectedBorder: 'border-emerald-500',
    recommended: false,
  },
  {
    key: 'at-risk',
    label: 'في خطر',
    desc: 'غائبون منذ 3–6 أشهر',
    icon: AlertTriangle,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    selectedBg: 'bg-orange-50/60',
    selectedBorder: 'border-orange-500',
    recommended: false,
  },
  {
    key: 'dormant',
    label: 'خاملين',
    desc: 'غائبون منذ 6–12 شهراً',
    icon: Clock,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    selectedBg: 'bg-teal-50/60',
    selectedBorder: 'border-teal-600',
    recommended: true,
  },
  {
    key: 'lost',
    label: 'مفقودين',
    desc: 'لم يزوروا منذ أكثر من سنة',
    icon: UserX,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    selectedBg: 'bg-slate-50/60',
    selectedBorder: 'border-slate-500',
    recommended: false,
  },
]

interface StepSegmentProps {
  selected: string | null
  counts: Record<string, number>
  onSelect: (key: string) => void
}

export function StepSegment({ selected, counts, onSelect }: StepSegmentProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">اختر فئة العملاء</h2>
      <p className="text-sm text-gray-500 mb-6">ستُرسَل الحملة لجميع العملاء في الفئة المختارة</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {SEGMENTS.map((seg, i) => {
          const isSelected = selected === seg.key
          const count = counts[seg.key] ?? 0

          return (
            <motion.button
              key={seg.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.07 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(seg.key)}
              className={cn(
                'relative text-right p-5 rounded-xl border-2 transition-all duration-150 cursor-pointer w-full',
                isSelected
                  ? `${seg.selectedBorder} ${seg.selectedBg} shadow-md`
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              )}
            >
              {seg.recommended && !isSelected && (
                <Badge variant="default" className="absolute top-3 left-3 text-[10px] px-1.5 py-0">
                  موصى به
                </Badge>
              )}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 left-3 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center shadow-sm"
                >
                  <Check size={11} className="text-white" strokeWidth={3} />
                </motion.div>
              )}

              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', seg.iconBg)}>
                <seg.icon size={20} className={seg.iconColor} />
              </div>

              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{seg.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{seg.desc}</p>
                </div>
                <div className="text-left shrink-0">
                  <p className="font-metric text-2xl font-bold text-gray-900 leading-none">{count}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">عميل</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
