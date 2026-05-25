'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, User, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface GeneratedMessage {
  customerId: string
  customerName: string
  lastVisit: string | null
  message: string
}

interface StepPreviewProps {
  isGenerating: boolean
  messages: GeneratedMessage[]
  onRegenerate: (customerId: string) => void
  regeneratingId: string | null
}

function formatVisitDate(d: string | null) {
  if (!d) return 'غير محدد'
  try {
    return new Date(d).toLocaleDateString('ar-JO', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return d
  }
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-teal-500"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

export function StepPreview({ isGenerating, messages, onRegenerate, regeneratingId }: StepPreviewProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <Sparkles size={20} className="text-teal-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isGenerating ? 'Claude يولّد الرسائل...' : 'معاينة الرسائل المُخصَّصة'}
          </h2>
          <p className="text-sm text-gray-500">
            {isGenerating
              ? 'يحلل Claude بيانات كل عميل ويصيغ رسالة فريدة'
              : 'كل رسالة مكتوبة خصيصاً لحالة العميل'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
                    <div>
                      <div className="w-24 h-3.5 bg-slate-100 rounded animate-pulse mb-1" />
                      <div className="w-16 h-3 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                  {i === 0 && <LoadingDots />}
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-slate-100 rounded animate-pulse" />
                  <div className="w-4/5 h-3 bg-slate-100 rounded animate-pulse" />
                  <div className="w-3/5 h-3 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {messages.map((msg, i) => (
              <motion.div
                key={msg.customerId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                        <User size={16} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{msg.customerName}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={11} />
                          <span>آخر زيارة: {formatVisitDate(msg.lastVisit)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRegenerate(msg.customerId)}
                      disabled={regeneratingId === msg.customerId}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors disabled:opacity-40"
                      title="إعادة التوليد"
                    >
                      <RefreshCw
                        size={14}
                        className={cn(regeneratingId === msg.customerId && 'animate-spin')}
                      />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {regeneratingId === msg.customerId ? (
                      <motion.div
                        key="regen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 py-2"
                      >
                        <LoadingDots />
                        <span className="text-xs text-gray-400">جاري إعادة التوليد...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="msg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-50 rounded-xl px-4 py-3"
                      >
                        <p className="text-sm text-gray-800 leading-relaxed" dir="rtl">
                          {msg.message}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isGenerating && messages.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-center text-gray-400 mt-4"
        >
          ✨ كل عميل في الحملة الفعلية سيستلم رسالة فريدة مخصصة لحالته
        </motion.p>
      )}
    </div>
  )
}
