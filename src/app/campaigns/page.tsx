'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Clock, MessageSquare, Calendar, TrendingUp, CheckCircle } from 'lucide-react'
import { Header } from '@/components/header'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { DEMO_CAMPAIGNS, type DemoCampaign } from '@/lib/demo-data'

const SEGMENT_LABELS: Record<DemoCampaign['segment'], string> = {
  vip: 'VIP',
  active: 'نشطون',
  'at-risk': 'يحتاجون تواصل',
  dormant: 'خاملون',
  lost: 'مفقودون',
}

// Segment badge styles using inline styles for dark brand tokens
const SEGMENT_STYLES: Record<DemoCampaign['segment'], React.CSSProperties> = {
  vip: { background: 'rgba(212,165,116,0.15)', color: '#D4A574' },
  active: { background: 'rgba(127,181,168,0.15)', color: '#7FB5A8' },
  'at-risk': { background: 'rgba(251,146,60,0.15)', color: '#fb923c' },
  dormant: { background: 'rgba(138,155,149,0.15)', color: '#8A9B95' },
  lost: { background: 'rgba(248,113,113,0.15)', color: '#f87171' },
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
      className="rounded-2xl p-6 transition-colors"
      style={{
        background: '#142B27',
        border: '1px solid rgba(127,181,168,0.12)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(127,181,168,0.3)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(127,181,168,0.12)')}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={SEGMENT_STYLES[campaign.segment]}
            >
              {SEGMENT_LABELS[campaign.segment]}
            </span>
            {campaign.status === 'completed' && (
              <span className="flex items-center gap-1 text-xs" style={{ color: '#7FB5A8' }}>
                <CheckCircle size={11} />
                مكتملة
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base truncate" style={{ color: '#F5EFE6' }}>
            {campaign.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#8A9B95' }}>
            {formatDate(campaign.sentAt)}
          </p>
        </div>
        <p className="text-sm shrink-0 font-metric" style={{ color: '#8A9B95' }}>
          {campaign.customerCount} رسالة
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center rounded-xl p-3" style={{ background: 'rgba(26,51,45,0.8)' }}>
          <MessageSquare size={14} className="text-teal-400 mx-auto mb-1" />
          <p className="font-metric text-lg font-bold" style={{ color: '#D4A574' }}>
            {replyRate}%
          </p>
          <p className="text-[11px]" style={{ color: '#8A9B95' }}>
            {campaign.replies} رد
          </p>
        </div>
        <div className="text-center rounded-xl p-3" style={{ background: 'rgba(26,51,45,0.8)' }}>
          <Calendar size={14} className="text-blue-400 mx-auto mb-1" />
          <p className="font-metric text-lg font-bold" style={{ color: '#D4A574' }}>
            {bookingRate}%
          </p>
          <p className="text-[11px]" style={{ color: '#8A9B95' }}>
            {campaign.bookings} حجز
          </p>
        </div>
        <div className="text-center rounded-xl p-3" style={{ background: 'rgba(26,51,45,0.8)' }}>
          <TrendingUp size={14} className="text-emerald-400 mx-auto mb-1" />
          <p className="font-metric text-lg font-bold" style={{ color: '#D4A574' }}>
            {campaign.revenue}
          </p>
          <p className="text-[11px]" style={{ color: '#8A9B95' }}>
            ر.س إيرادات
          </p>
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
    <div className="min-h-screen" style={{ background: '#0A1F1C' }}>
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
            <h1
              className="text-display-md font-semibold leading-tight"
              style={{ color: '#F5EFE6' }}
            >
              أعد تفعيل عملاءك
            </h1>
            <p className="mt-2 text-sm" style={{ color: '#8A9B95' }}>
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
            <p
              className="text-xs mt-2 flex items-center justify-end gap-1"
              style={{ color: '#8A9B95' }}
            >
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
