'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Clock, MessageSquare, Calendar, TrendingUp, CheckCircle } from 'lucide-react'
import { Header } from '@/components/header'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { DEMO_CAMPAIGNS, type DemoCampaign } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

const SEGMENT_LABELS: Record<DemoCampaign['segment'], string> = {
  vip: 'VIP',
  active: 'نشطون',
  'at-risk': 'يحتاجون تواصل',
  dormant: 'خاملون',
  lost: 'مفقودون',
}

const SEGMENT_COLORS: Record<DemoCampaign['segment'], string> = {
  vip: 'bg-amber-100 text-amber-700',
  active: 'bg-teal-100 text-teal-700',
  'at-risk': 'bg-orange-100 text-orange-700',
  dormant: 'bg-slate-100 text-slate-600',
  lost: 'bg-red-100 text-red-700',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function CampaignCard({ campaign, index }: { campaign: DemoCampaign; index: number }) {
  const replyRate = Math.round((campaign.replies / campaign.customerCount) * 100)
  const bookingRate = Math.round((campaign.bookings / campaign.customerCount) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                SEGMENT_COLORS[campaign.segment],
              )}
            >
              {SEGMENT_LABELS[campaign.segment]}
            </span>
            {campaign.status === 'completed' && (
              <span className="flex items-center gap-1 text-xs text-teal-600">
                <CheckCircle size={11} />
                مكتملة
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 text-base truncate">{campaign.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{formatDate(campaign.sentAt)}</p>
        </div>
        <p className="text-sm text-slate-500 shrink-0 font-metric">
          {campaign.customerCount} رسالة
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center bg-slate-50 rounded-xl p-3">
          <MessageSquare size={14} className="text-teal-600 mx-auto mb-1" />
          <p className="font-metric text-lg font-bold text-slate-900">{replyRate}%</p>
          <p className="text-[11px] text-slate-500">{campaign.replies} رد</p>
        </div>
        <div className="text-center bg-slate-50 rounded-xl p-3">
          <Calendar size={14} className="text-blue-600 mx-auto mb-1" />
          <p className="font-metric text-lg font-bold text-slate-900">{bookingRate}%</p>
          <p className="text-[11px] text-slate-500">{campaign.bookings} حجز</p>
        </div>
        <div className="text-center bg-slate-50 rounded-xl p-3">
          <TrendingUp size={14} className="text-emerald-600 mx-auto mb-1" />
          <p className="font-metric text-lg font-bold text-slate-900">{campaign.revenue}</p>
          <p className="text-[11px] text-slate-500">ر.س إيرادات</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function CampaignsPage() {
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    setIsDemo(localStorage.getItem('awdah-demo-mode') === 'true')
  }, [])

  const campaigns = isDemo ? DEMO_CAMPAIGNS : []

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Header />
      <main id="main" className="max-w-content mx-auto px-6 lg:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between mb-10"
        >
          <div>
            <p className="label-caption mb-2">الحملات</p>
            <h1 className="text-display-md font-semibold text-slate-900 leading-tight">
              أعد تفعيل عملاءك
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Claude يكتب رسالة مخصصة لكل عميل — لا قوالب جاهزة
            </p>
          </div>
          <div className="mt-1">
            <Button asChild size="lg">
              <Link href="/campaigns/new">
                <Plus size={16} />
                حملة جديدة
              </Link>
            </Button>
            <p className="text-xs text-slate-400 mt-2 flex items-center justify-end gap-1">
              <Clock size={10} />
              تستغرق دقيقتين
            </p>
          </div>
        </motion.div>

        {campaigns.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c, i) => (
              <CampaignCard key={c.id} campaign={c} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <EmptyState variant="campaigns" />
          </motion.div>
        )}
      </main>
    </div>
  )
}
