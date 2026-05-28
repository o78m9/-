'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  LayoutDashboard,
  Users,
  Send,
  Upload,
  QrCode,
  HelpCircle,
  MessageCircle,
  TrendingUp,
  Eye,
} from 'lucide-react'
import { CountUp } from '@/components/count-up'
import { cn } from '@/lib/utils'

// ── Mock Data ──────────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS = [
  { id: '1', name: 'أحمد الزهراني', lastVisit: '2024-08-15', status: 'restored', revenue: 850 },
  { id: '2', name: 'فاطمة العتيبي', lastVisit: '2024-07-22', status: 'restored', revenue: 1200 },
  { id: '3', name: 'خالد السالم', lastVisit: '2024-09-01', status: 'dormant', revenue: 0 },
  { id: '4', name: 'نورة الدوسري', lastVisit: '2024-06-10', status: 'restored', revenue: 650 },
  { id: '5', name: 'محمد الشهري', lastVisit: '2024-08-30', status: 'restored', revenue: 2100 },
  { id: '6', name: 'سارة القحطاني', lastVisit: '2024-07-05', status: 'dormant', revenue: 0 },
  { id: '7', name: 'عبدالله الغامدي', lastVisit: '2024-09-15', status: 'restored', revenue: 1800 },
  { id: '8', name: 'منى الحربي', lastVisit: '2024-08-20', status: 'restored', revenue: 950 },
  { id: '9', name: 'يوسف العمري', lastVisit: '2024-07-18', status: 'dormant', revenue: 0 },
  { id: '10', name: 'ريم الشمري', lastVisit: '2024-09-08', status: 'restored', revenue: 1450 },
]

const MOCK_REVENUE = [
  840, 1200, 950, 1800, 2100, 1650, 2400, 1900, 2800, 3100, 2650, 3400, 2900, 3800, 3200, 4100,
  3700, 4500, 4000, 5200, 4800, 5600, 5100, 6000, 5500, 6800, 6200, 7100, 6600, 8200,
].map((v, i) => ({ day: i + 1, revenue: v }))

const MOCK_SEGMENTS = [
  { name: 'نشط', value: 1708, color: '#7FB5A8' },
  { name: 'خامل', value: 827, color: '#D4A574' },
  { name: 'VIP', value: 312, color: '#C08840' },
]

const MOCK_MESSAGES = [
  {
    id: 1,
    name: 'أحمد الزهراني',
    time: 'منذ 3 دقائق',
    text: 'مرحباً أحمد، لقد مضى أكثر من 3 أشهر على آخر زيارتك. هل تودّ حجز موعد للمتابعة؟ نحن هنا لخدمتك.',
  },
  {
    id: 2,
    name: 'فاطمة العتيبي',
    time: 'منذ 15 دقيقة',
    text: 'أهلاً فاطمة، اشتقنا إليك! لدينا عرض خاص هذا الشهر. هل يناسبك الحجز الأسبوع القادم؟',
  },
  {
    id: 3,
    name: 'محمد الشهري',
    time: 'منذ 32 دقيقة',
    text: 'السلام عليكم محمد، تذكيرٌ ودي بموعد متابعتك. الفريق في انتظارك، تفضّل بالحجز متى يناسبك.',
  },
]

const SIDEBAR_NAV = [
  { label: 'لوحة التحكم', href: '/dashboard/demo', icon: LayoutDashboard },
  { label: 'العملاء', href: '#', icon: Users },
  { label: 'الحملات', href: '#', icon: Send },
  { label: 'استيراد', href: '#', icon: Upload },
  { label: 'رمز QR', href: '#', icon: QrCode },
]

// ── Brand colors ───────────────────────────────────────────────────────────────
const GOLD = '#D4A574'
const SAGE = '#7FB5A8'
const FOREST = '#0A1F1C'
const COPPER = '#C08840'

// ── Sub-components ─────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string
  value: number
  suffix?: string
  color: string
  delay: number
}

function KpiCard({ label, value, suffix = '', color, delay }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl p-6 flex flex-col gap-2"
      style={{
        border: `1px solid ${color}40`,
        boxShadow: `0 0 0 1px ${color}15, 0 2px 8px rgba(0,0,0,0.06)`,
      }}
    >
      <p className="text-[12px] font-semibold uppercase tracking-wider text-stone-400">{label}</p>
      <div className="flex items-end gap-1.5 mt-1">
        <CountUp
          to={value}
          className="font-bold leading-none"
          style={{
            fontSize: '36px',
            color,
            fontFamily: 'var(--font-inter)',
            letterSpacing: '-0.025em',
          }}
          duration={1.4}
        />
        {suffix && (
          <span className="text-[16px] font-medium mb-0.5" style={{ color: `${color}AA` }}>
            {suffix}
          </span>
        )}
      </div>
      <div
        className="mt-1 h-1 rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}60, ${color}15)` }}
      />
    </motion.div>
  )
}

interface TooltipPayloadItem {
  value: number
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const first = payload[0]
  const val = first !== undefined ? (first.value ?? 0) : 0
  return (
    <div className="bg-white border border-stone-100 rounded-lg px-3 py-2 shadow-lg text-right">
      <p className="text-[11px] text-stone-400 mb-0.5">يوم {label}</p>
      <p className="text-[14px] font-bold" style={{ color: GOLD }}>
        {val.toLocaleString('ar-SA')} ر.س
      </p>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function DashboardDemoPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl" style={{ background: FOREST }}>
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside
        className="w-[220px] flex-shrink-0 h-full flex flex-col border-l border-white/5"
        style={{ background: FOREST }}
      >
        {/* Logo */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: SAGE }} />
            <span className="text-[18px] font-bold text-white tracking-tight">عَودة</span>
          </div>
          <p className="text-[11px]" style={{ color: `${SAGE}80` }}>
            نظام تنشيط المرضى
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {SIDEBAR_NAV.map((item) => {
            const active = item.href === '/dashboard/demo'
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors',
                  active ? 'text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5',
                )}
                style={active ? { background: `${SAGE}25`, color: SAGE } : {}}
              >
                <item.icon
                  size={16}
                  style={{ color: active ? SAGE : undefined }}
                  className={active ? '' : 'text-white/30'}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-white/30 hover:text-white/60 transition-colors"
          >
            <HelpCircle size={15} className="text-white/20" />
            مساعدة وتواصل
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
            style={{ color: GOLD }}
          >
            <Eye size={15} style={{ color: GOLD }} />
            عرض الموقع
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F5F1E8' }}>
        {/* Demo banner */}
        <div
          className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white"
          style={{ background: COPPER }}
        >
          <Eye size={14} />
          هذا عرض تجريبي ببيانات وهمية — لا توجد بيانات حقيقية
          <Link href="/" className="underline font-semibold hover:no-underline ms-2">
            احجز عرضاً حقيقياً
          </Link>
        </div>

        {/* Scrollable area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          <div className="max-w-[1100px] mx-auto space-y-6">
            {/* Page header */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                  لوحة التحكم
                </p>
                <h1 className="text-[26px] font-bold text-stone-950 tracking-tight leading-tight">
                  مرحباً بك في عيادتك
                </h1>
              </div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold tracking-wider"
                style={{ background: `${GOLD}20`, color: COPPER, border: `1px solid ${GOLD}50` }}
              >
                <Eye size={12} />
                وضع العرض التجريبي
              </span>
            </motion.div>

            {/* ── KPI Cards ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard label="إجمالي المرضى" value={2847} color={GOLD} delay={0.05} />
              <KpiCard label="مرضى خاملون" value={1139} color={COPPER} delay={0.1} />
              <KpiCard label="تم استرجاعهم" value={312} color={SAGE} delay={0.15} />
              <KpiCard label="إيرادات الشهر" value={12400} suffix="ر.س" color={GOLD} delay={0.2} />
            </div>

            {/* ── Charts row ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Revenue area chart (spans 2 cols) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="lg:col-span-2 bg-white rounded-2xl p-6"
                style={{ border: '1px solid #E7E5E4', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[15px] font-semibold text-stone-950 tracking-tight">
                    الإيراد المسترجع — 30 يوماً
                  </h2>
                  <span
                    className="inline-flex items-center gap-1 text-[12px] font-medium"
                    style={{ color: GOLD }}
                  >
                    <TrendingUp size={13} />
                    +34% هذا الشهر
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart
                    data={MOCK_REVENUE}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={GOLD} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10, fill: '#A8A29E' }}
                      tickLine={false}
                      axisLine={false}
                      interval={4}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#A8A29E' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={GOLD}
                      strokeWidth={2}
                      fill="url(#goldGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: GOLD, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Donut chart */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 flex flex-col"
                style={{ border: '1px solid #E7E5E4', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <h2 className="text-[15px] font-semibold text-stone-950 tracking-tight mb-4">
                  توزيع المرضى
                </h2>
                <div className="flex-1 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={MOCK_SEGMENTS}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {MOCK_SEGMENTS.map((seg) => (
                          <Cell key={seg.name} fill={seg.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {MOCK_SEGMENTS.map((seg) => (
                    <div key={seg.name} className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: seg.color }}
                        />
                        <span className="text-stone-600 font-medium">{seg.name}</span>
                      </div>
                      <span className="font-semibold text-stone-800">
                        {seg.value.toLocaleString('ar-SA')}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── Table + WhatsApp panel ────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Reactivations table */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="lg:col-span-2 bg-white rounded-2xl overflow-hidden"
                style={{ border: '1px solid #E7E5E4', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold text-stone-950 tracking-tight">
                    آخر 10 عمليات استرجاع
                  </h2>
                  <span className="text-[12px] font-medium uppercase tracking-wider text-stone-400">
                    10 مرضى
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-[13px]">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-100">
                        <th className="px-6 py-3 font-semibold text-stone-500 text-right">الاسم</th>
                        <th className="px-4 py-3 font-semibold text-stone-500 text-right">
                          آخر زيارة
                        </th>
                        <th className="px-4 py-3 font-semibold text-stone-500 text-right">
                          الحالة
                        </th>
                        <th className="px-4 py-3 font-semibold text-stone-500 text-right">
                          الإيراد
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_CUSTOMERS.map((c, i) => (
                        <tr
                          key={c.id}
                          className="border-b border-stone-50 transition-colors"
                          style={{ background: i % 2 === 0 ? 'white' : '#FAFAF9' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${SAGE}12`
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#FAFAF9'
                          }}
                        >
                          <td className="px-6 py-3 font-medium text-stone-900">{c.name}</td>
                          <td className="px-4 py-3 text-stone-500">{c.lastVisit}</td>
                          <td className="px-4 py-3">
                            <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                              style={
                                c.status === 'restored'
                                  ? {
                                      background: `${SAGE}20`,
                                      color: '#3D8F80',
                                    }
                                  : {
                                      background: `${COPPER}20`,
                                      color: COPPER,
                                    }
                              }
                            >
                              {c.status === 'restored' ? 'مُسترجع' : 'خامل'}
                            </span>
                          </td>
                          <td
                            className="px-4 py-3 font-semibold"
                            style={{ color: c.revenue > 0 ? GOLD : '#A8A29E' }}
                          >
                            {c.revenue > 0 ? `${c.revenue.toLocaleString('ar-SA')} ر.س` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* WhatsApp message preview panel */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white rounded-2xl overflow-hidden flex flex-col"
                style={{ border: '1px solid #E7E5E4', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                  <MessageCircle size={16} style={{ color: SAGE }} />
                  <h2 className="text-[15px] font-semibold text-stone-950 tracking-tight">
                    رسائل WhatsApp
                  </h2>
                </div>
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{ background: '#ECE5DD' }}
                >
                  {MOCK_MESSAGES.map((msg) => (
                    <div key={msg.id} className="flex flex-col gap-0.5">
                      <p className="text-[10px] font-semibold text-stone-500 text-right pe-1">
                        {msg.name} · {msg.time}
                      </p>
                      <div
                        className="rounded-xl rounded-tl-sm px-3.5 py-2.5 text-[12px] leading-relaxed text-stone-800 text-right max-w-[90%] self-end"
                        style={{
                          background: 'white',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        }}
                      >
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-stone-400 text-left ps-1">✓✓</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-stone-100">
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-medium"
                    style={{ background: `${SAGE}15`, color: SAGE }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Claude AI يكتب الرسائل تلقائياً
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
