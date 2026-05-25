'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

function IllustrationCustomers() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="40" cy="40" r="36" fill="#F0FDFA" stroke="#99F6E4" strokeWidth="1.5" />
      {/* Person */}
      <circle cx="40" cy="32" r="9" stroke="#0F766E" strokeWidth="1.5" fill="none" />
      <path d="M22 58c0-9.941 8.059-18 18-18s18 8.059 18 18" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Plus badge */}
      <circle cx="58" cy="22" r="9" fill="#0F766E" />
      <path d="M58 18v8M54 22h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IllustrationCampaigns() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="40" cy="40" r="36" fill="#F0FDFA" stroke="#99F6E4" strokeWidth="1.5" />
      {/* Megaphone */}
      <path d="M20 36v8a2 2 0 002 2h4l6 8h2V28h-2l-6 8h-4a2 2 0 00-2 2z" stroke="#0F766E" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M34 28c6 4 14 6 20 6s14-2 20-6" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0" />
      <path d="M34 28s14 3 22 3" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M34 52s14-3 22-3" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Sparkle */}
      <path d="M58 30l1.5 3 3 1.5-3 1.5L58 39l-1.5-3-3-1.5 3-1.5L58 30z" fill="#14B8A6" />
    </svg>
  )
}

interface EmptyStateProps {
  variant?: 'customers' | 'campaigns'
}

export function EmptyState({ variant = 'customers' }: EmptyStateProps) {
  const config = {
    customers: {
      illustration: <IllustrationCustomers />,
      title: 'لسا ما بدأت',
      subtitle: 'أضف أول عميل لك وابدأ تبني قاعدة بيانات عيادتك',
      cta: (
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/capture"><Plus size={15} />عميل جديد</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/import"><Upload size={15} />استيراد ملف</Link>
          </Button>
        </div>
      ),
    },
    campaigns: {
      illustration: <IllustrationCampaigns />,
      title: 'لا توجد حملات بعد',
      subtitle: 'أنشئ أول حملة الآن — Claude يكتب لكل عميل رسالة مخصصة',
      cta: (
        <Button asChild size="lg">
          <Link href="/campaigns/new"><Plus size={15} />إنشاء حملة الآن</Link>
        </Button>
      ),
    },
  }[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="mb-6">{config.illustration}</div>
      <h3 className="text-lg font-semibold text-slate-800 tracking-tight mb-2">{config.title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-8">{config.subtitle}</p>
      {config.cta}
    </motion.div>
  )
}
