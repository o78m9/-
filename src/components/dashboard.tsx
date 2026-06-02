'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Upload,
  QrCode,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Sparkles,
  Eye,
  type LucideIcon,
} from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { SegmentGrid } from '@/components/segment-grid'
import { ActivityFeed } from '@/components/activity-feed'
import { CustomerList } from '@/components/customer-list'
import { EmptyState } from '@/components/empty-state'
import { Sparkline } from '@/components/sparkline'
import { CountUp } from '@/components/count-up'
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
  isAuthenticated?: boolean
}

const EMPTY_SPARK = [0, 0, 0, 0, 0, 0, 0]

function SecondaryMetric({
  label,
  value,
  trend,
  sparkData,
  color,
  delay,
}: {
  label: string
  value: number
  trend: number
  sparkData: number[]
  color: string
  delay: number
}) {
  const positive = trend >= 0
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-xl p-5 flex flex-col gap-3"
      style={{ border: '1px solid #E7E5E4', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium uppercase tracking-[0.05em] text-stone-400">
          {label}
        </p>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium',
            positive ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-600',
          )}
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(trend)}%
        </span>
      </div>
      <CountUp
        to={value}
        className="font-bold text-stone-950 leading-none"
        style={{ fontSize: '32px', fontFamily: 'var(--font-inter)', letterSpacing: '-0.02em' }}
        duration={1.2}
      />
      <Sparkline data={sparkData} color={color} height={36} />
    </motion.div>
  )
}

function StatusPill({
  icon: Icon,
  label,
  sublabel,
  connected,
  delay,
}: {
  icon: LucideIcon
  label: string
  sublabel: string
  connected: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl',
        connected ? 'bg-teal-50 border border-teal-100' : 'bg-stone-50 border border-stone-200',
      )}
    >
      <div className={cn('flex-shrink-0', connected ? 'text-teal-600' : 'text-stone-400')}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            'text-[13px] font-semibold',
            connected ? 'text-teal-900' : 'text-stone-500',
          )}
        >
          {label}
        </p>
        <p className={cn('text-[12px]', connected ? 'text-teal-600' : 'text-stone-400')}>
          {connected ? sublabel : 'غير متصل'}
        </p>
      </div>
      <span
        className={cn(
          'w-2 h-2 rounded-full flex-shrink-0 ms-auto',
          connected ? 'bg-teal-500 animate-pulse' : 'bg-stone-300',
        )}
      />
    </motion.div>
  )
}

export function DashboardClient({
  realStats,
  realCustomers,
  hasClinicId,
  isAuthenticated = false,
}: DashboardClientProps) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('awdah-demo-mode')
    if (stored === 'true' || !hasClinicId) setIsDemoMode(true)
  }, [hasClinicId])

  const toggleDemo = async () => {
    const next = !isDemoMode
    setIsDemoMode(next)
    localStorage.setItem('awdah-demo-mode', String(next))
    // RTA-001: cookie is HMAC-signed server-side. Client cannot mint a value
    // that satisfies the middleware verifier, so we ask the server to set it.
    try {
      await fetch('/api/demo/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next ? {} : { off: true }),
      })
    } catch {
      // Network failure — UI already updated; cookie will be re-tried on next toggle.
    }
  }

  const stats = isDemoMode
    ? DEMO_STATS
    : { ...realStats, revenue: 0, activePercent: 0, campaignsSent: 0, recovered: 0 }
  const customers: (RealCustomer | DemoCustomer)[] = isDemoMode ? DEMO_CUSTOMERS : realCustomers
  const activity: ActivityItem[] = isDemoMode ? DEMO_ACTIVITY : []
  const sparks = isDemoMode
    ? DEMO_SPARKLINES
    : { total: EMPTY_SPARK, active: EMPTY_SPARK, revenue: EMPTY_SPARK, atRisk: EMPTY_SPARK }

  const campaignsSpark = isDemoMode
    ? [120, 138, 145, 158, 167, 179, stats.campaignsSent]
    : EMPTY_SPARK
  const recoveredSpark = isDemoMode ? [4, 5, 7, 8, 9, 11, stats.recovered] : EMPTY_SPARK

  if (!mounted) return null

  // CPO fix: authenticated tenant with zero customers should NOT see the
  // deflated full dashboard (0 د.أ in 80px serif looks broken). Show an
  // activation card that converts the empty state into the activation funnel.
  const showActivationCard = !isDemoMode && isAuthenticated && hasClinicId && realStats.total === 0

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF9]" dir="rtl">
      {/* Sidebar */}
      <DashboardSidebar
        isDemoMode={isDemoMode}
        onToggleDemo={toggleDemo}
        isAuthenticated={isAuthenticated}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Demo banner */}
        <AnimatePresence>
          {isDemoMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden flex-shrink-0"
            >
              <div className="sticky top-0 z-40 bg-amber-500 text-white px-4 py-2.5 text-center">
                <span className="inline-flex items-center gap-2 text-[13px] font-medium">
                  <Eye size={14} />
                  هذا عرض تجريبي ببيانات وهمية.
                  <Link href="/" className="underline font-semibold hover:no-underline">
                    احجز عرضاً حقيقياً على بياناتك
                  </Link>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {showActivationCard && (
            <div className="max-w-[760px] mx-auto py-16">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-stone-200 p-10 text-center"
              >
                <h2 className="text-[26px] font-semibold text-stone-950 mb-2">
                  أهلاً بك في عيادتك الرقمية
                </h2>
                <p className="text-[14px] text-stone-500 mb-8 leading-relaxed">
                  ثلاث خطوات للبدء بإعادة تفعيل مرضاك واسترجاع إيرادات نائمة.
                </p>
                <ol className="space-y-4 text-start max-w-md mx-auto">
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-700 text-white text-[14px] font-semibold flex items-center justify-center">
                      ١
                    </span>
                    <div className="flex-1">
                      <p className="text-[15px] font-medium text-stone-950 mb-1">
                        استورد قاعدة عملائك
                      </p>
                      <p className="text-[13px] text-stone-500 mb-2">
                        ارفع ملف Excel أو CSV وسيقوم المساعد الذكي بتنظيف البيانات.
                      </p>
                      <Link
                        href="/import"
                        className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-teal-700 text-white text-[12px] font-medium hover:bg-teal-800 transition-colors"
                      >
                        <Upload size={12} />
                        ابدأ الاستيراد
                      </Link>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 text-stone-500 text-[14px] font-semibold flex items-center justify-center">
                      ٢
                    </span>
                    <div className="flex-1">
                      <p className="text-[15px] font-medium text-stone-950 mb-1">
                        ضع رمز QR على استقبال العيادة
                      </p>
                      <p className="text-[13px] text-stone-500 mb-2">
                        مريض يمسح ← يدخل اسمه ورقمه ← يدخل قاعدة بياناتك تلقائياً.
                      </p>
                      <Link
                        href="/qr"
                        className="inline-flex items-center gap-2 h-8 px-3 rounded-lg border border-stone-200 bg-white text-stone-700 text-[12px] font-medium hover:bg-stone-50 transition-colors"
                      >
                        <QrCode size={12} />
                        اطبع QR
                      </Link>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start opacity-60">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 text-stone-400 text-[14px] font-semibold flex items-center justify-center">
                      ٣
                    </span>
                    <div className="flex-1">
                      <p className="text-[15px] font-medium text-stone-700 mb-1">أرسل أول حملة</p>
                      <p className="text-[13px] text-stone-500">
                        بعد استيراد ١٠+ مرضى، ستظهر الحملات تلقائياً.
                      </p>
                    </div>
                  </li>
                </ol>
                <p className="text-[12px] text-stone-400 mt-8">
                  أو{' '}
                  <button
                    onClick={toggleDemo}
                    className="underline hover:no-underline text-stone-500"
                  >
                    شاهد العرض التجريبي
                  </button>{' '}
                  بدون استيراد.
                </p>
              </motion.div>
            </div>
          )}
          {!showActivationCard && (
            <div className="max-w-[1100px] mx-auto space-y-7">
              {/* Page header */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.05em] text-stone-400 mb-1">
                    لوحة التحكم
                  </p>
                  <h1 className="text-[28px] font-semibold text-stone-950 tracking-tight leading-tight">
                    مرحباً بك في عيادتك
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/capture"
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-teal-700 text-white text-[13px] font-medium hover:bg-teal-800 transition-colors"
                  >
                    <Plus size={14} />
                    عميل جديد
                  </Link>
                  <Link
                    href="/import"
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-stone-200 bg-white text-stone-700 text-[13px] font-medium hover:bg-stone-50 transition-colors"
                  >
                    <Upload size={14} />
                    استيراد
                  </Link>
                  <Link
                    href="/qr"
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-stone-200 bg-white text-stone-700 text-[13px] font-medium hover:bg-stone-50 transition-colors"
                  >
                    <QrCode size={14} />
                    QR
                  </Link>
                </div>
              </motion.div>

              {/* ── Hero revenue card ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl p-8"
                style={{
                  border: '1px solid #E7E5E4',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div className="flex items-start justify-between gap-8">
                  {/* Left: number + trend */}
                  <div className="flex-shrink-0">
                    <p className="text-[12px] font-medium uppercase tracking-[0.05em] text-stone-400 mb-5">
                      إيراد مسترجع هذا الشهر
                    </p>
                    <div className="flex items-end gap-3 mb-4">
                      <CountUp
                        to={stats.revenue}
                        className="font-bold leading-none"
                        style={{
                          fontSize: '80px',
                          color: '#B45309',
                          fontFamily: 'var(--font-inter)',
                          letterSpacing: '-0.03em',
                          lineHeight: 1,
                        }}
                        duration={1.6}
                      />
                      <span
                        className="text-[24px] font-medium text-stone-400 mb-2"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        ر.س
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[13px] font-medium">
                      <TrendingUp size={13} />
                      +12% مقارنة بالشهر الماضي
                    </div>
                  </div>

                  {/* Right: sparkline + status pills */}
                  <div className="flex-1 flex flex-col gap-5 min-w-0">
                    <Sparkline data={sparks.revenue} color="#B45309" height={72} />
                    <div className="grid grid-cols-2 gap-3">
                      <StatusPill
                        icon={MessageCircle}
                        label="WhatsApp"
                        sublabel="متصل ومستعد"
                        connected={isDemoMode}
                        delay={0.15}
                      />
                      <StatusPill
                        icon={Sparkles}
                        label="Claude AI"
                        sublabel="يحضّر رسائلك"
                        connected={isDemoMode}
                        delay={0.22}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Secondary metrics ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SecondaryMetric
                  label="إجمالي العملاء"
                  value={stats.total}
                  trend={8}
                  sparkData={sparks.total}
                  color="#0F766E"
                  delay={0.08}
                />
                <SecondaryMetric
                  label="نشطون هذا الشهر"
                  value={stats.active}
                  trend={5}
                  sparkData={sparks.active}
                  color="#0D9488"
                  delay={0.14}
                />
                <SecondaryMetric
                  label="رسائل أُرسلت"
                  value={stats.campaignsSent}
                  trend={18}
                  sparkData={campaignsSpark}
                  color="#0F766E"
                  delay={0.2}
                />
                <SecondaryMetric
                  label="مواعيد محجوزة"
                  value={stats.recovered}
                  trend={33}
                  sparkData={recoveredSpark}
                  color="#0D9488"
                  delay={0.26}
                />
              </div>

              {/* ── Segments ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-semibold text-stone-950 tracking-tight">
                    توزيع العملاء
                  </h2>
                  <span className="text-[12px] font-medium uppercase tracking-[0.05em] text-stone-400">
                    {stats.total} إجمالاً
                  </span>
                </div>
                <SegmentGrid stats={stats} />
              </motion.div>

              {/* ── Bottom: customer table + activity feed ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-5"
              >
                {/* Customer table */}
                <div
                  className="lg:col-span-2 bg-white rounded-xl overflow-hidden"
                  style={{ border: '1px solid #E7E5E4', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                >
                  <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold text-stone-950 tracking-tight">
                      قاعدة عملاءك
                    </h3>
                    <span className="text-[12px] font-medium uppercase tracking-[0.05em] text-stone-400">
                      {customers.length} عميل
                    </span>
                  </div>
                  {customers.length > 0 ? <CustomerList customers={customers} /> : <EmptyState />}
                </div>

                {/* Activity feed */}
                <div className="lg:col-span-1">
                  {activity.length > 0 ? (
                    <ActivityFeed items={activity} />
                  ) : (
                    <div
                      className="h-full bg-white rounded-xl flex items-center justify-center p-10"
                      style={{
                        border: '1px solid #E7E5E4',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="text-center">
                        <p className="text-[14px] font-medium text-stone-500">لسا ما بدأت</p>
                        <p className="text-[12px] text-stone-400 mt-1">شغّل التجريبي لرؤية مثال</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
