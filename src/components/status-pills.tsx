'use client'
import { motion } from 'framer-motion'
import { MessageCircle, Sparkles } from 'lucide-react'

interface StatusPillsProps {
  isDemoMode: boolean
}

export function StatusPills({ isDemoMode }: StatusPillsProps) {
  const whatsappConnected = isDemoMode
  const claudeReady = isDemoMode

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="flex items-center gap-3 flex-wrap"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
        <span
          className={`w-2 h-2 rounded-full ${whatsappConnected ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-gray-300'}`}
        />
        <MessageCircle size={13} className={whatsappConnected ? 'text-emerald-600' : 'text-gray-400'} />
        <span className={`text-xs font-medium ${whatsappConnected ? 'text-emerald-700' : 'text-gray-400'}`}>
          WhatsApp {whatsappConnected ? 'متصل' : 'غير متصل'}
        </span>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
        <span
          className={`w-2 h-2 rounded-full ${claudeReady ? 'bg-teal-500 shadow-[0_0_6px_rgba(15,118,110,0.5)]' : 'bg-gray-300'}`}
        />
        <Sparkles size={13} className={claudeReady ? 'text-teal-600' : 'text-gray-400'} />
        <span className={`text-xs font-medium ${claudeReady ? 'text-teal-700' : 'text-gray-400'}`}>
          Claude AI {claudeReady ? 'جاهز' : 'غير مفعّل'}
        </span>
      </div>

      {isDemoMode && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-medium text-amber-700">بيانات تجريبية — لن تتأثر قاعدة بيانات حقيقية</span>
        </div>
      )}
    </motion.div>
  )
}
