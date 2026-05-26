'use client'
import { motion } from 'framer-motion'
import { Check, PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'

export const TEMPLATES = [
  {
    key: 'friendly',
    label: 'تذكير ودود',
    emoji: '👋',
    desc: 'أسلوب دافئ وشخصي',
    preview: 'مرحبا {{name}}، وحشتنا بالعيادة! بقي وقت على آخر زيارة. كيف صحة أسنانك؟ احجز موعدك 😊',
  },
  {
    key: 'offer',
    label: 'عرض خاص',
    emoji: '🎁',
    desc: 'خصم محدود الوقت',
    preview: 'أهلاً {{name}}، عندنا خصم 20% لعملائنا الكرام هذا الشهر فقط! احجز قبل نهاية الشهر 🎉',
  },
  {
    key: 'health',
    label: 'متابعة صحية',
    emoji: '🦷',
    desc: 'تذكير بالفحص الدوري',
    preview: 'عزيزي {{name}}، صحة أسنانك مهمة! الفحص الدوري كل 6 أشهر يحمي ابتسامتك. متى يناسبك موعد؟',
  },
]

interface StepTemplateProps {
  selected: string | null
  customMessage: string
  onSelect: (key: string) => void
  onCustomChange: (msg: string) => void
}

export function StepTemplate({ selected, customMessage, onSelect, onCustomChange }: StepTemplateProps) {
  const isCustom = selected === 'custom'

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">اختر قالب الرسالة</h2>
      <p className="text-sm text-gray-500 mb-6">سيُخصّص Claude كل رسالة حسب بيانات العميل</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {TEMPLATES.map((t, i) => {
          const isSel = selected === t.key
          return (
            <motion.button
              key={t.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.07 }}
              whileHover={{ y: -2, transition: { duration: 0.12 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(t.key)}
              className={cn(
                'relative text-right p-5 rounded-xl border-2 transition-all duration-150 w-full',
                isSel
                  ? 'border-teal-600 bg-teal-50/60 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              )}
            >
              {isSel && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 start-4 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center"
                >
                  <Check size={11} className="text-white" strokeWidth={3} />
                </motion.div>
              )}

              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-900">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg px-3 py-2.5 text-right">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t.preview.replace(
                    '{{name}}',
                    '<span class="text-teal-700 font-medium">اسم العميل</span>'
                  )}
                </p>
                <p className="text-[10px] text-teal-700 font-medium mt-1.5">
                  {`"${t.preview.split('{{name}}')[0]}"`}
                  <span className="text-teal-600 bg-teal-100 px-1 rounded mx-0.5">{'{الاسم}'}</span>
                  <span>{t.preview.split('{{name}}')[1]?.substring(0, 20)}...</span>
                </p>
              </div>
            </motion.button>
          )
        })}

        {/* Custom option */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.21 }}
          whileHover={{ y: -2, transition: { duration: 0.12 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('custom')}
          className={cn(
            'relative text-right p-5 rounded-xl border-2 transition-all duration-150 w-full',
            isCustom
              ? 'border-teal-600 bg-teal-50/60 shadow-md'
              : 'border-dashed border-slate-300 bg-white hover:border-teal-300 hover:bg-teal-50/30'
          )}
        >
          {isCustom && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 start-4 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center"
            >
              <Check size={11} className="text-white" strokeWidth={3} />
            </motion.div>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <PenLine size={17} className="text-slate-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">كتابة مخصصة</p>
              <p className="text-xs text-gray-500">اكتب رسالتك الخاصة</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Custom textarea */}
      {isCustom && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
        >
          <textarea
            value={customMessage}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="اكتب رسالتك هنا... استخدم {{name}} لاسم العميل"
            rows={4}
            maxLength={300}
            className="w-full rounded-xl border border-slate-200 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent resize-none bg-white"
            dir="rtl"
          />
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-xs text-gray-400">
              استخدم{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700">{'{{name}}'}</code>{' '}
              لإدراج اسم العميل تلقائياً
            </p>
            <p className={`text-xs font-metric tabular-nums ${customMessage.length < 6 ? 'text-red-400' : 'text-gray-400'}`}>
              {customMessage.length}/300
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
