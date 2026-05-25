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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="flex items-center gap-2.5 flex-wrap"
    >
      {/* WhatsApp status */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-200/80 shadow-sm">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            whatsappConnected
              ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] animate-pulse'
              : 'bg-slate-300'
          }`}
        />
        <MessageCircle size={12} className={whatsappConnected ? 'text-emerald-600' : 'text-slate-400'} />
        <span className={`text-xs font-medium ${whatsappConnected ? 'text-emerald-700' : 'text-slate-400'}`}>
          WhatsApp {whatsappConnected ? 'متصل' : 'غير متصل'}
        </span>
      </div>

      {/* Claude status */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-200/80 shadow-sm">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            claudeReady
              ? 'bg-brand-600 shadow-[0_0_6px_rgba(15,118,110,0.4)] animate-pulse'
              : 'bg-slate-300'
          }`}
        />
        <Sparkles size={12} className={claudeReady ? 'text-brand-600' : 'text-slate-400'} />
        <span className={`text-xs font-medium ${claudeReady ? 'text-brand-700' : 'text-slate-400'}`}>
          Claude AI {claudeReady ? 'جاهز' : 'غير مفعّل'}
        </span>
      </div>

      {/* Demo mode indicator */}
      {isDemoMode && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-50 border border-amber-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-xs font-medium text-amber-700">بيانات تجريبية</span>
        </div>
      )}
    </motion.div>
  )
}
