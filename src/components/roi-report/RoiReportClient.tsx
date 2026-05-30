'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Printer, ChevronRight, ChevronLeft } from 'lucide-react'
import type { RoiReportData } from './demo-roi-data'
import { RoiHeroCard } from './RoiHeroCard'
import { CostOfInactionCard } from './CostOfInactionCard'
import { RevenueBarChart } from './RevenueBarChart'
import { SegmentDonutChart } from './SegmentDonutChart'
import { TopReactivatedTable } from './TopReactivatedTable'

const MONTH_AR: Record<string, string> = {
  '01': 'يناير',
  '02': 'فبراير',
  '03': 'مارس',
  '04': 'أبريل',
  '05': 'مايو',
  '06': 'يونيو',
  '07': 'يوليو',
  '08': 'أغسطس',
  '09': 'سبتمبر',
  '10': 'أكتوبر',
  '11': 'نوفمبر',
  '12': 'ديسمبر',
}

function formatReportMonth(m: string) {
  const yyyy = m.split('-')[0]
  const mm = m.split('-')[1]
  return `${(mm ? MONTH_AR[mm] : undefined) ?? mm} ${yyyy}`
}

function prevMonth(m: string) {
  const yyyy = Number(m.split('-')[0])
  const mm = Number(m.split('-')[1])
  const d = new Date(yyyy, mm - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function nextMonth(m: string) {
  const yyyy = Number(m.split('-')[0])
  const mm = Number(m.split('-')[1])
  const d = new Date(yyyy, mm, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function isCurrentMonth(m: string) {
  const now = new Date()
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return m >= current
}

export function RoiReportClient({ data }: { data: RoiReportData }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const month = searchParams.get('month') ?? data.reportMonth

  function navigate(m: string) {
    router.push(`/dashboard/roi-report?month=${m}`)
  }

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: '#060F0D' }} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 no-print">
        <div>
          <p className="text-[11px] tracking-widest uppercase mb-1" style={{ color: '#6B6359' }}>
            تقرير الإيرادات الشهري
          </p>
          <h1 className="font-bold text-[1.4rem]" style={{ color: '#F5EFE6' }}>
            {data.clinicName}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Month navigation */}
          <div
            className="flex items-center gap-1 rounded-xl px-3 py-2"
            style={{ background: '#0F2922', border: '1px solid rgba(212,165,116,0.15)' }}
          >
            <button
              onClick={() => navigate(prevMonth(month))}
              className="p-1 rounded transition-colors hover:opacity-70"
              aria-label="الشهر السابق"
            >
              <ChevronRight size={14} style={{ color: '#8A9B95' }} />
            </button>
            <span className="text-[13px] font-medium px-2" style={{ color: '#F5EFE6' }}>
              {formatReportMonth(month)}
            </span>
            <button
              onClick={() => navigate(nextMonth(month))}
              disabled={isCurrentMonth(month)}
              className="p-1 rounded transition-colors hover:opacity-70 disabled:opacity-30"
              aria-label="الشهر التالي"
            >
              <ChevronLeft size={14} style={{ color: '#8A9B95' }} />
            </button>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-[12px] font-medium transition-opacity hover:opacity-80"
            style={{
              background: '#0F2922',
              border: '1px solid rgba(212,165,116,0.15)',
              color: '#D4A574',
            }}
          >
            <Printer size={13} />
            طباعة / PDF
          </button>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 roi-report-content">
        <RoiHeroCard
          current={data.current.revenueRecovered}
          previous={data.previous.revenueRecovered}
          label="الإيراد المسترجع هذا الشهر"
          sublabel="ريال سعودي"
          suffix=" ر.س"
        />
        <RoiHeroCard
          current={data.current.reactivatedCount}
          previous={data.previous.reactivatedCount}
          label="مرضى عادوا هذا الشهر"
          sublabel="مريض مستعاد"
        />
        <CostOfInactionCard
          unreachedCount={data.current.unreachedCount}
          costOfInaction={data.current.costOfInaction}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 roi-report-content">
        <div className="lg:col-span-2">
          <RevenueBarChart data={data.revenueTrend} />
        </div>
        <SegmentDonutChart data={data.segmentBreakdown} />
      </div>

      {/* Top patients table */}
      <div className="roi-report-content">
        <TopReactivatedTable patients={data.topReactivated} />
      </div>

      {/* Print footer */}
      <div
        className="hidden print:block mt-8 pt-4 border-t text-[10px] text-center"
        style={{ color: '#6B6359', borderColor: '#E8DFD0' }}
      >
        تقرير عَودة — {formatReportMonth(month)} — {data.clinicName}
      </div>
    </div>
  )
}
