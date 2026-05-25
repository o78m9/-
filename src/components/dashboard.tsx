'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Upload, QrCode, MessageCircle, Sparkles, TrendingUp, TrendingDown } from 'lucide-react'
import { Header } from '@/components/header'
import { SegmentGrid } from '@/components/segment-grid'
import { ActivityFeed } from '@/components/activity-feed'
import { CustomerList } from '@/components/customer-list'
import { EmptyState } from '@/components/empty-state'
import { MetricCard } from '@/components/metric-card'
import { Sparkline } from '@/components/sparkline'
import { CountUp } from '@/components/count-up'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  DEMO_STATS,
  DEMO_SPARKLINES,
  DEMO_ACTIVITY,
  DEMO_CUSTOMERS,
  type DemoCustomer,
  type ActivityItem,
} from '@/lib/demo-data'

interface RealStats {
  total: number
  vip: number
  active: number
  'at-risk': number
  dormant: number
  lost: number
}

interface RealCustomer {
  id: string
  name: string
  phone: string
  status: string
  last_visit?: string | null
  total_spent?: number
}

interface DashboardClientProps {
  realStats: RealStats
  realCustomers: RealCustomer[]
  hasClinicId: boolean
}

const EMPTY_SPARK = [0, 0, 0, 0, 0, 0, 0]

function StatusCard({
  icon: Icon,
  label,
  sublabel,
  connected,
  activeColor,
  dotColor,
  delay,
}: {
  icon: React.ElementType
  label: string
  sublabel: string
  connected: boolean
  activeColor: string
  dotColor: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1"
    >
      <Card className="p-5 h-full border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', connected ? 'bg-slate-50' : 'bg-slate-50')}>
            <Icon size={16} className={connected ? activeColor : 'text-slate-400'} />
          </div>
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              connected ? `${dotColor} animate-pulse shadow-sm` : 'bg-slate-300'
            )}
          />
        </div>
        <p className={cn('text-base font-semibold tracking-tight', connected ? 'text-slate-900' : 'text-slate-400')}>
          {label}
        </p>
        <p className={cn('text-xs mt-0.5', connected ? 'text-slate-500' : 'text-slate-400')}>
          {connected ? sublabel : 'غير متصل'}
        </p>
      </Card>
    </motion.div>
  )
}

export function DashboardClient({ realStats, realCustomers, hasClinicId }: DashboardClientProps) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('awdah-demo-mode')
    if (stored === 'true' || !hasClinicId) setIsDemoMode(true)
  }, [hasClinicId])

  const toggleDemo = () => {
    const next = !isDemoMode
    setIsDemoMode(next)
    localStorage.setItem('awdah-demo-mode', String(next))
  }

  const stats = isDemoMode
    ? DEMO_STATS
    : { ...realStats, revenue: 0, activePercent: 0, campaignsSent: 0, recovered: 0 }
  const customers: (RealCustomer | DemoCustomer)[] = isDemoMode ? DEMO_CUSTOMERS : realCustomers
  const activity: ActivityItem[] = isDemoMode ? DEMO_ACTIVITY : []
  const sparks = isDemoMode
    ? DEMO_SPARKLINES
    : { total: EMPTY_SPARK, active: EMPTY_SPARK, revenue: EMPTY_SPARK, atRisk: EMPTY_SPARK }

  const revenueTrend = 12
  const trendPositive = revenueTrend >= 0

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Header isDemoMode={isDemoMode} onToggleDemo={toggleDemo} />

      {/* Demo banner */}
      <AnimatePresence>
        {isDemoMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-50 border-b border-amber-200/60 px-6 py-2 text-center">
              <p className="text-xs font-medium text-amber-700 tracking-wide">
                وضع العرض التجريبي — البيانات المعروضة للتوضيح فقط
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-content mx-auto px-6 lg:px-10 py-10 space-y-10">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between"
        >
          <div>
            <p className="label-caption mb-2">لوحة التحكم</p>
            <h1 className="text-display-md font-semibold text-slate-900 leading-tight">
              مرحباً — إليك نظرة على عيادتك
            </h1>
          </div>
          <div className="flex gap-2 mt-1">
            <Button asChild>
              <Link href="/capture"><Plus size={15} />عميل جديد</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/import"><Upload size={15} />استيراد</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/qr"><QrCode size={15} />QR</Link>
            </Button>
          </div>
        </motion.div>

        {/* ── BENTO: Hero row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Hero revenue card — 2/3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-2xl border border-teal-100/80 bg-gradient-to-br from-teal-50 via-white to-white p-8 shadow-sm overflow-hidden h-full">
              {/* Subtle background orb */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-teal-100/30 blur-3xl pointer-events-none" />

              <div className="relative">
                <p className="label-caption mb-4">الإيراد الشهري</p>

                {/* Big number + trend */}
                <div className="flex items-end gap-4 mb-1">
                  <CountUp
                    to={stats.revenue}
                    className="font-metric font-bold leading-none text-slate-900"
                    style={{ fontSize: '4.5rem', letterSpacing: '-0.03em' }}
                    duration={1.4}
                  />
                  <span className="font-metric text-2xl text-slate-400 font-medium mb-2">د.أ</span>
                </div>

                {/* Trend badge */}
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium font-metric',
                      trendPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {trendPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {trendPositive ? '+' : ''}{revenueTrend}% مقارنة بالشهر الماضي
                  </div>
                </div>

                {/* Big sparkline */}
                <Sparkline data={sparks.revenue} color="#0f766e" height={96} />
              </div>
            </div>
          </motion.div>

          {/* Status cards — 1/3 */}
          <div className="flex flex-col gap-4">
            <StatusCard
              icon={MessageCircle}
              label="WhatsApp"
              sublabel="متصل ومستعد للإرسال"
              connected={isDemoMode}
              activeColor="text-emerald-600"
              dotColor="bg-emerald-500"
              delay={0.1}
            />
            <StatusCard
              icon={Sparkles}
              label="Claude AI"
              sublabel="يحضّر رسائلك الآن"
              connected={isDemoMode}
              activeColor="text-brand-600"
              dotColor="bg-brand-500"
              delay={0.2}
            />
          </div>
        </div>

        {/* ── BENTO: Secondary metrics ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="إجمالي العملاء"
            value={stats.total}
            trend={8}
            sparkData={sparks.total}
            color="#0f766e"
            index={0}
          />
          <MetricCard
            label="نشطون هذا الشهر"
            value={stats.active}
            suffix={` (${stats.activePercent}%)`}
            trend={5}
            sparkData={sparks.active}
            color="#0d9488"
            index={1}
          />
          <MetricCard
            label="رسائل أُرسلت"
            value={stats.campaignsSent}
            trend={18}
            sparkData={[120, 138, 145, 158, 167, 179, stats.campaignsSent]}
            color="#0f766e"
            index={2}
          />
          <MetricCard
            label="مواعيد محجوزة"
            value={stats.recovered}
            trend={33}
            sparkData={[4, 5, 7, 8, 9, 11, stats.recovered]}
            color="#0d9488"
            index={3}
          />
        </div>

        {/* ── Segments: horizontal scroll ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium text-slate-800 tracking-tight">توزيع العملاء</h2>
            <span className="label-caption">{stats.total} إجمالاً</span>
          </div>
          <SegmentGrid stats={stats} />
        </motion.div>

        {/* ── Bottom: customer table + activity feed ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.45 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          <Card className="lg:col-span-2 overflow-hidden border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">قاعدة عملاءك</h3>
              <span className="label-caption">{customers.length} عميل</span>
            </div>
            {customers.length > 0 ? <CustomerList customers={customers} /> : <EmptyState />}
          </Card>

          <div className="lg:col-span-1">
            {activity.length > 0 ? (
              <ActivityFeed items={activity} />
            ) : (
              <Card className="h-full flex items-center justify-center p-10 border-slate-100 shadow-sm">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">لسا ما بدأت</p>
                  <p className="text-xs text-slate-400 mt-1">شغّل Demo لرؤية مثال على النشاط</p>
                </div>
              </Card>
            )}
          </div>
        </motion.div>

      </main>
    </div>
  )
}
