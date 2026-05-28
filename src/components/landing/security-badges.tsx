'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Zap, Server } from 'lucide-react'

const BADGES = [
  {
    icon: Lock,
    title: 'تشفير ٢٥٦-بت',
    subtitle: 'AES-256 encryption',
  },
  {
    icon: Shield,
    title: 'أمان طبي',
    subtitle: 'HIPAA-aligned',
  },
  {
    icon: Zap,
    title: '٩٩.٩٪ وقت التشغيل',
    subtitle: 'Guaranteed uptime',
  },
  {
    icon: Server,
    title: 'خوادم في السعودية',
    subtitle: 'Data stays in KSA',
  },
]

export function SecurityBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {BADGES.map((badge, i) => {
        const Icon = badge.icon
        return (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl
              border border-line/60 bg-paper/80
              text-sm text-mute"
          >
            <Icon className="w-4 h-4 text-sage-500 shrink-0" aria-hidden="true" />
            <div>
              <span className="font-semibold text-ink/80">{badge.title}</span>
              <span className="text-xs text-mute/70 block leading-none">{badge.subtitle}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
