'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Upload, QrCode } from 'lucide-react'
import { Header } from '@/components/header'
import { MetricCard } from '@/components/metric-card'
import { StatusPills } from '@/components/status-pills'
import { SegmentGrid } from '@/components/segment-grid'
import { ActivityFeed } from '@/components/activity-feed'
import { CustomerList } from '@/components/customer-list'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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

export function DashboardClient({ realStats, realCustomers, hasClinicId }: DashboardClientProps) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('awdah-demo-mode')
    if (stored === 'true' || !hasClinicId) {
      setIsDemoMode(true)
    }
  }, [hasClinicId])

  const toggleDemo = () => {
    const next = !isDemoMode
    setIsDemoMode(next)
    localStorage.setItem('awdah-demo-mode', String(next))
  }

  const stats = isDemoMode ? DEMO_STATS : { ...realStats, revenue: 0, activePercent: 0, campaignsSent: 0, recovered: 0 }
  const customers: (RealCustomer | DemoCustomer)[] = isDemoMode ? DEMO_CUSTOMERS : realCustomers
  const activity: ActivityItem[] = isDemoMode ? DEMO_ACTIVITY : []
  const sparks = isDemoMode ? DEMO_SPARKLINES : { total: EMPTY_SPARK, active: EMPTY_SPARK, revenue: EMPTY_SPARK, atRisk: EMPTY_SPARK }

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

      <main className="max-w-content mx-auto px-6 lg:px-10 py-10 space-y-12">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between"
        >
          <div>
            <p className="label-caption mb-2">لوحة التحكم</p>
            <h1 className="text-display-md font-semibold text-slate-900">
              مرحباً بك — إليك نظرة على عيادتك
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              كل ما تحتاجه لمعرفة وضع عملاءك دفعة واحدة
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            <Button asChild>
              <Link href="/capture">
                <Plus size={15} />
                عميل جديد
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/import">
                <Upload size={15} />
                استيراد
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/qr">
                <QrCode size={15} />
                QR
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Status connections */}
        <StatusPills isDemoMode={isDemoMode} />

        {/* Hero metrics */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium text-slate-800 tracking-tight">المقاييس الرئيسية</h2>
            <span className="label-caption">هذا الشهر</span>
          </div>
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
              label="الإيراد الشهري"
              value={stats.revenue}
              suffix=" د.أ"
              trend={12}
              sparkData={sparks.revenue}
              color="#0f766e"
              index={2}
            />
            <MetricCard
              label="يحتاجون متابعة"
              value={stats['at-risk']}
              trend={-4}
              sparkData={sparks.atRisk}
              color="#78716c"
              index={3}
            />
          </div>
        </div>

        {/* Segments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium text-slate-800 tracking-tight">توزيع العملاء</h2>
            <span className="label-caption">{stats.total} عميل إجمالاً</span>
          </div>
          <SegmentGrid stats={stats} />
        </motion.div>

        {/* Main content: customer table + activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.45 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {/* Customer table */}
          <Card className="lg:col-span-2 overflow-hidden border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">قاعدة عملاءك</h3>
              <span className="label-caption">{customers.length} عميل</span>
            </div>
            {customers.length > 0 ? (
              <CustomerList customers={customers} />
            ) : (
              <EmptyState />
            )}
          </Card>

          {/* Activity feed */}
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
