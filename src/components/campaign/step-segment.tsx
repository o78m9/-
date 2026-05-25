'use client'
import { motion } from 'framer-motion'
import { Star, Users, AlertCircle, Clock, UserX, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const SEGMENTS = [
  {
    key: 'vip',
    label: 'VIP',
    desc: 'الأكثر قيمة ووفاء للعيادة',
    icon: Star,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    selectedBg: 'bg-amber-50',
    selectedBorder: 'border-amber-400',
    recommended: false,
  },
  {
    key: 'active',
    label: 'نشطون',
    desc: 'زاروا خلال الـ 3 أشهر الأخيرة',
    icon: Users,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
    selectedBg: 'bg-teal-50',
    selectedBorder: 'border-teal-500',
    recommended: false,
  },
  {
    key: 'at-risk',
    label: 'يحتاجون تواصل',
    desc: 'غائبون منذ 3–6 أشهر',
    icon: AlertCircle,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    selectedBg: 'bg-slate-50',
    selectedBorder: 'border-slate-400',
    recommended: false,
  },
  {
    key: 'dormant',
    label: 'خاملون',
    desc: 'غائبون منذ 6–12 شهراً',
    icon: Clock,
    iconBg: 'bg-stone-100',
    iconColor: 'text-stone-600',
    selectedBg: 'bg-teal-50',
    selectedBorder: 'border-brand-600',
    recommended: true,
  },
  {
    key: 'lost',
    label: 'مفقودون',
    desc: 'لم يزوروا منذ أكثر من سنة',
    icon: UserX,
    iconBg: 'bg-slate-200',
    iconColor: 'text-slate-500',
    selectedBg: 'bg-slate-50',
    selectedBorder: 'border-slate-400',
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
      <h2 className="text-xl font-semibold text-slate-900 tracking-tight mb-1">اختر فئة العملاء</h2>
      <p className="text-sm text-slate-500 mb-7 leading-relaxed">
        كل عميل في الفئة سيستلم رسالة مخصصة بأسلوبه هو
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {SEGMENTS.map((seg, i) => {
          const isSelected = selected === seg.key
          const count = counts[seg.key] ?? 0

          return (
            <motion.button
              key={seg.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
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
                  الأفضل
                </Badge>
              )}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-3 left-3 w-5 h-5 rounded-full bg-brand-700 flex items-center justify-center shadow-sm"
                >
                  <Check size={11} className="text-white" strokeWidth={3} />
                </motion.div>
              )}

              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', seg.iconBg)}>
                <seg.icon size={18} className={seg.iconColor} />
              </div>

              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm tracking-tight">{seg.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{seg.desc}</p>
                </div>
                <div className="text-left shrink-0">
                  <p className="font-metric text-2xl font-bold text-slate-900 leading-none">{count}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">عميل</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
