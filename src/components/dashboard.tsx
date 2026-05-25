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
    <div className="min-h-screen bg-stone-50">
      <Header isDemoMode={isDemoMode} onToggleDemo={toggleDemo} />

      <AnimatePresence>
        {isDemoMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
              <p className="text-xs font-medium text-amber-800">
                🟡 وضع العرض التجريبي — البيانات المعروضة وهمية للتوضيح فقط
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Page title + quick actions */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
            <p className="text-sm text-gray-500 mt-0.5">مرحباً — إليك نظرة على عيادتك اليوم</p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/capture">
                <Plus size={14} />
                عميل جديد
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/import">
                <Upload size={14} />
                استيراد
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/qr">
                <QrCode size={14} />
                QR
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Status pills */}
        <StatusPills isDemoMode={isDemoMode} />

        {/* Hero metrics — 4 cards */}
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
            color="#10b981"
            index={1}
          />
          <MetricCard
            label="الإيراد الشهري"
            value={stats.revenue}
            suffix=" JD"
            trend={12}
            sparkData={sparks.revenue}
            color="#0f766e"
            index={2}
          />
          <MetricCard
            label="في خطر"
            value={stats['at-risk']}
            trend={-4}
            sparkData={sparks.atRisk}
            color="#f97316"
            index={3}
          />
        </div>

        {/* Segments grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">توزيع العملاء</h2>
            <span className="text-xs text-gray-400">{stats.total} إجمالي</span>
          </div>
          <SegmentGrid stats={stats} />
        </motion.div>

        {/* Main bento: customer table + activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.45 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Customer table (2/3) */}
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">قاعدة العملاء</h3>
              <span className="text-xs text-gray-400 font-metric">{customers.length} عميل</span>
            </div>
            {customers.length > 0 ? (
              <CustomerList customers={customers} />
            ) : (
              <EmptyState />
            )}
          </Card>

          {/* Activity feed (1/3) */}
          <div className="lg:col-span-1">
            {activity.length > 0 ? (
              <ActivityFeed items={activity} />
            ) : (
              <Card className="h-full flex items-center justify-center p-8">
                <p className="text-sm text-gray-400 text-center">
                  شغّل Demo Mode لرؤية مثال على النشاط
                </p>
              </Card>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
