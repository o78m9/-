'use client'
import { motion } from 'framer-motion'
import { Users, MessageSquare, Clock, Sparkles, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SEGMENT_LABELS: Record<string, string> = {
  vip: 'VIP',
  active: 'نشطين',
  'at-risk': 'في خطر',
  dormant: 'خاملين',
  lost: 'مفقودين',
}

const TEMPLATE_LABELS: Record<string, string> = {
  friendly: 'تذكير ودود',
  offer: 'عرض خاص',
  health: 'متابعة صحية',
  custom: 'رسالة مخصصة',
}

interface StepReviewProps {
  segment: string
  template: string
  scheduleType: 'now' | 'later'
  scheduledAt: string
  customerCount: number
  isSending: boolean
  onSend: () => void
  isDemoMode: boolean
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2.5 text-gray-500">
        <Icon size={15} />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

export function StepReview({
  segment,
  template,
  scheduleType,
  scheduledAt,
  customerCount,
  isSending,
  onSend,
  isDemoMode,
}: StepReviewProps) {
  const scheduleLabel =
    scheduleType === 'now'
      ? 'إرسال فوري'
      : scheduledAt
        ? new Date(scheduledAt).toLocaleString('ar-JO', {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'وقت غير محدد'

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">راجع وأرسل</h2>
      <p className="text-sm text-gray-500 mb-6">تأكد من التفاصيل قبل إطلاق الحملة</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-200 bg-white overflow-hidden mb-5"
      >
        <div className="bg-gradient-to-l from-teal-50 to-white px-5 py-4 border-b border-slate-100">
          <p className="text-xs font-medium text-teal-700 uppercase tracking-wide mb-0.5">ملخص الحملة</p>
          <p className="text-sm text-gray-600">حملة إعادة تفعيل — {SEGMENT_LABELS[segment] ?? segment}</p>
        </div>

        <div className="px-5">
          <SummaryRow
            icon={Users}
            label="الفئة المستهدفة"
            value={`${SEGMENT_LABELS[segment] ?? segment} — ${customerCount} عميل`}
          />
          <SummaryRow
            icon={MessageSquare}
            label="نوع الرسالة"
            value={TEMPLATE_LABELS[template] ?? template}
          />
          <SummaryRow icon={Clock} label="وقت الإرسال" value={scheduleLabel} />
          <SummaryRow
            icon={Sparkles}
            label="التخصيص بـ AI"
            value="رسالة فريدة لكل عميل"
          />
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">التخصيص</span>
            <span className="text-xs font-semibold text-teal-700">رسالة فريدة لكل عميل ✓</span>
          </div>
        </div>
      </motion.div>

      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-5"
        >
          <span className="text-lg mt-0.5">🟡</span>
          <div>
            <p className="text-sm font-medium text-amber-800">وضع العرض التجريبي</p>
            <p className="text-xs text-amber-700 mt-0.5">
              لن تُرسَل رسائل حقيقية. ستشاهد محاكاة تفاعلية لنتائج الحملة.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-3">
        <Button
          onClick={onSend}
          disabled={isSending}
          size="lg"
          className="w-full justify-center text-base"
        >
          {isSending ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              جاري الإرسال...
            </span>
          ) : (
            <>
              <Sparkles size={17} />
              تأكيد وإرسال {customerCount} رسالة
            </>
          )}
        </Button>

      </div>
    </div>
  )
}
