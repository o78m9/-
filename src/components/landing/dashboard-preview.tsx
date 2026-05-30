'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import {
  Users,
  MessageSquare,
  BarChart2,
  CheckCircle2,
  Clock,
  Wifi,
  ShieldCheck,
  BellOff,
  Bell,
} from 'lucide-react'

const TABS = [
  { id: 'patients', label: 'المرضى', icon: Users },
  { id: 'messages', label: 'الرسائل', icon: MessageSquare },
  { id: 'review', label: 'المراجعة', icon: ShieldCheck },
  { id: 'reports', label: 'التقارير', icon: BarChart2 },
] as const

type TabId = (typeof TABS)[number]['id']

const MONTHLY_DATA = [
  { month: 'يناير', returned: 42 },
  { month: 'فبراير', returned: 58 },
  { month: 'مارس', returned: 71 },
  { month: 'أبريل', returned: 89 },
  { month: 'مايو', returned: 103 },
  { month: 'يونيو', returned: 124 },
]

const TREND_DATA = [
  { day: '١', rate: 18 },
  { day: '٥', rate: 24 },
  { day: '١٠', rate: 31 },
  { day: '١٥', rate: 27 },
  { day: '٢٠', rate: 38 },
  { day: '٢٥', rate: 42 },
  { day: '٣٠', rate: 47 },
]

const PATIENTS = [
  {
    name: 'أحمد الشمري',
    lastVisit: 'منذ ٨ أشهر',
    status: 'عاد',
    color: '#7FB5A8',
    bg: 'rgba(127,181,168,0.12)',
  },
  {
    name: 'سارة المطيري',
    lastVisit: 'منذ ٦ أشهر',
    status: 'تم التواصل',
    color: '#D4A574',
    bg: 'rgba(212,165,116,0.12)',
  },
  {
    name: 'محمد العنزي',
    lastVisit: 'منذ ١١ شهر',
    status: 'لم يرد',
    color: '#6B6359',
    bg: 'rgba(107,99,89,0.1)',
  },
  {
    name: 'فاطمة الدوسري',
    lastVisit: 'منذ ٧ أشهر',
    status: 'عاد',
    color: '#7FB5A8',
    bg: 'rgba(127,181,168,0.12)',
  },
  {
    name: 'خالد السبيعي',
    lastVisit: 'منذ ٩ أشهر',
    status: 'تم التواصل',
    color: '#D4A574',
    bg: 'rgba(212,165,116,0.12)',
  },
  {
    name: 'نورة الحربي',
    lastVisit: 'منذ ١٢ شهر',
    status: 'عاد',
    color: '#7FB5A8',
    bg: 'rgba(127,181,168,0.12)',
  },
]

const KPI = [
  { label: 'عادوا الشهر', value: '١٢٤', trend: '+١٨٪' },
  { label: 'رسائل أُرسلت', value: '٢١٠', trend: '+٦٪' },
  { label: 'معدل الاستجابة', value: '٥٩٪', trend: '+٤٪' },
  { label: 'إيراد مسترجع', value: '٣٨ ألف', trend: '+٢٢٪' },
]

const CONVERSATIONS = [
  {
    patient: 'أحمد الشمري',
    initial: 'أ',
    out: 'السلام عليكم! لاحظنا أنك لم تزرنا منذ فترة. نودّ الاطمئنان عليك وتذكيرك بموعدك.',
    inc: 'شكراً! كنت ناوي أتصل. متى عندكم وقت هذا الأسبوع؟',
    time: '١٠:٣٢ ص',
  },
  {
    patient: 'سارة المطيري',
    initial: 'س',
    out: 'مرحباً! لديك فحص دوري مستحق. نسبة الخصم ٢٠٪ لمن يحجز هذا الشهر.',
    inc: null,
    time: '٢:١٥ م',
  },
]

const NOTIFICATIONS = [
  'عاد أحمد الشمري وحجز موعداً جديداً',
  'تم إرسال ١٢ رسالة تذكير الآن',
  'نورة الغامدي طلبت موعداً',
  'معدل الاستجابة ارتفع إلى ٥٩٪',
  'سارة المطيري ردّت على الرسالة',
]

const PAUSE_REASONS = ['طلب عدم التواصل', 'ظرف شخصي', 'خلاف على الفاتورة', 'أخرى'] as const

function PatientsTab() {
  const [paused, setPaused] = useState<Set<number>>(new Set())
  const [pauseNotes, setPauseNotes] = useState<Record<number, (typeof PAUSE_REASONS)[number]>>({})
  const [choosingReason, setChoosingReason] = useState<number | null>(null)

  function handlePauseToggle(i: number) {
    if (paused.has(i)) {
      setPaused((s) => {
        const n = new Set(s)
        n.delete(i)
        return n
      })
      setPauseNotes((n) => {
        const r = { ...n }
        delete r[i]
        return r
      })
      setChoosingReason(null)
    } else {
      setPaused((s) => new Set([...s, i]))
      setChoosingReason(i)
    }
  }

  function selectReason(i: number, reason: (typeof PAUSE_REASONS)[number]) {
    setPauseNotes((n) => ({ ...n, [i]: reason }))
    setChoosingReason(null)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {KPI.map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-3"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p className="text-[0.625rem] mb-1" style={{ color: '#8A9B95' }}>
              {k.label}
            </p>
            <p
              className="text-xl font-black"
              style={{ color: '#F5EFE6', fontFamily: 'var(--font-tajawal)' }}
            >
              {k.value}
            </p>
            <p className="text-[0.625rem] mt-0.5" style={{ color: '#7FB5A8' }}>
              {k.trend}
            </p>
          </div>
        ))}
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {PATIENTS.map((p, i) => {
          const isPaused = paused.has(i)
          const note = pauseNotes[i]
          const isChoosingReason = choosingReason === i
          return (
            <div key={p.name}>
              <div
                className="flex items-center gap-3 px-4 py-3 text-sm transition-opacity duration-200"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderBottom:
                    !isChoosingReason && i < PATIENTS.length - 1
                      ? '1px solid rgba(255,255,255,0.05)'
                      : undefined,
                  opacity: isPaused ? 0.65 : 1,
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[0.625rem] font-bold shrink-0"
                  style={{ background: 'rgba(127,181,168,0.15)', color: '#7FB5A8' }}
                >
                  {[...p.name][0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[0.8125rem] truncate" style={{ color: '#F5EFE6' }}>
                    {p.name}
                  </p>
                  <p className="text-[0.6875rem]" style={{ color: '#8A9B95' }}>
                    {p.lastVisit}
                  </p>
                  {note && (
                    <>
                      <p className="text-[0.5625rem] mt-0.5 truncate" style={{ color: '#D4A574' }}>
                        {note}
                      </p>
                      <p
                        className="text-[0.5rem] mt-0.5"
                        style={{ color: 'rgba(127,181,168,0.6)' }}
                      >
                        يُستأنف تلقائياً عند حجز موعد جديد
                      </p>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handlePauseToggle(i)}
                  title={isPaused ? 'استئناف الرسائل' : 'إيقاف مؤقت'}
                  className="w-6 h-6 flex items-center justify-center rounded-md shrink-0 transition-colors duration-150 hover:opacity-80"
                  style={{
                    background: isPaused ? 'rgba(212,165,116,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isPaused ? 'rgba(212,165,116,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    color: isPaused ? '#D4A574' : '#6B6359',
                  }}
                >
                  {isPaused ? (
                    <Bell className="w-3 h-3" aria-hidden="true" />
                  ) : (
                    <BellOff className="w-3 h-3" aria-hidden="true" />
                  )}
                </button>
                {isPaused ? (
                  <span
                    className="text-[0.625rem] font-medium px-2 py-1 rounded-full"
                    style={{ color: '#D4A574', background: 'rgba(212,165,116,0.12)' }}
                  >
                    موقوف مؤقتاً
                  </span>
                ) : (
                  <span
                    className="text-[0.625rem] font-medium px-2 py-1 rounded-full"
                    style={{ color: p.color, background: p.bg }}
                  >
                    {p.status}
                  </span>
                )}
              </div>

              <AnimatePresence>
                {isChoosingReason && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                    style={{
                      borderBottom:
                        i < PATIENTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                    }}
                  >
                    <div
                      className="px-4 pb-3 pt-1 flex flex-wrap gap-1.5"
                      dir="rtl"
                      style={{ background: 'rgba(212,165,116,0.10)' }}
                    >
                      <span className="text-[0.625rem] self-center" style={{ color: '#8A9B95' }}>
                        سبب الإيقاف:
                      </span>
                      {PAUSE_REASONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => selectReason(i, r)}
                          className="text-[0.625rem] px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                          style={{
                            background: 'rgba(212,165,116,0.12)',
                            border: '1px solid rgba(212,165,116,0.25)',
                            color: '#D4A574',
                          }}
                        >
                          {r}
                        </button>
                      ))}
                      <button
                        onClick={() => setChoosingReason(null)}
                        className="text-[0.625rem] px-2 py-1 rounded-full transition-opacity hover:opacity-70 ms-auto"
                        style={{ color: 'rgba(138,155,149,0.6)' }}
                      >
                        تخطّ
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      <p
        className="text-[0.5625rem] px-1 flex items-center gap-1"
        style={{ color: 'rgba(138,155,149,0.45)' }}
      >
        <BellOff className="w-3 h-3 shrink-0" aria-hidden="true" />
        اضغط على أي مريض لإيقاف رسائله مؤقتاً مع تسجيل السبب — يستأنف بضغطة واحدة.
      </p>
    </div>
  )
}

function MessagesTab() {
  return (
    <div className="space-y-3">
      {CONVERSATIONS.map((conv) => (
        <div
          key={conv.patient}
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="flex items-center gap-2.5 px-4 py-2.5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[0.5625rem] font-bold"
              style={{ background: 'rgba(212,165,116,0.2)', color: '#D4A574' }}
            >
              {[...conv.patient][0]}
            </div>
            <span className="text-[0.8125rem] font-semibold" style={{ color: '#F5EFE6' }}>
              {conv.patient}
            </span>
            <span className="text-[0.625rem] ms-auto" style={{ color: '#8A9B95' }}>
              {conv.time}
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-end">
              <div
                className="max-w-[82%] rounded-2xl rounded-ee-sm px-4 py-2.5 text-[0.8125rem] leading-relaxed"
                style={{
                  background: 'linear-gradient(135deg, #0F3D38, #1A5550)',
                  color: '#D8EDEA',
                }}
              >
                {conv.out}
              </div>
            </div>
            {conv.inc ? (
              <div className="flex justify-start">
                <div
                  className="max-w-[82%] rounded-2xl rounded-es-sm px-4 py-2.5 text-[0.8125rem] leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#F5EFE6' }}
                >
                  {conv.inc}
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 text-[0.6875rem] px-2 py-1.5"
                  style={{ color: 'rgba(138,155,149,0.6)' }}
                >
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  بانتظار الرد...
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const PENDING_MESSAGES = [
  {
    patient: 'محمد العتيبي',
    initial: 'م',
    lastVisit: 'منذ ٩ أشهر',
    msg: 'السلام عليكم أبو محمد، لاحظنا أنك لم تزرنا منذ فترة، وكنا نودّ الاطمئنان عليك. لو تحب نحجز لك موعداً هذا الأسبوع يكون عندنا وقت مناسب.',
  },
  {
    patient: 'هند الغامدي',
    initial: 'هـ',
    lastVisit: 'منذ ٧ أشهر',
    msg: 'مرحباً هند، فترة ما شفناك! تذكيرك بالفحص الدوري — وعندنا هالشهر خصم خاص لمريضاتنا القدامى.',
  },
]

function ReviewTab() {
  const [approved, setApproved] = useState<Set<number>>(new Set())
  const [undoPending, setUndoPending] = useState<number | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleApprove(i: number) {
    setApproved((s) => new Set([...s, i]))
    setUndoPending(i)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => setUndoPending(null), 5000)
  }

  function handleUndo() {
    if (undoPending === null) return
    const idx = undoPending
    setApproved((s) => {
      const next = new Set(s)
      next.delete(idx)
      return next
    })
    setUndoPending(null)
    if (undoTimer.current) clearTimeout(undoTimer.current)
  }

  return (
    <div className="space-y-3">
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-xl"
        style={{ background: 'rgba(212,165,116,0.08)', border: '1px solid rgba(212,165,116,0.18)' }}
      >
        <span className="text-[0.75rem] font-medium" style={{ color: '#D4A574' }}>
          رسالتان بانتظار موافقتك
        </span>
        <span className="text-[0.625rem]" style={{ color: '#8A9B95' }}>
          لا ترسل عَودة رسالة واحدة بدون موافقتك
        </span>
      </div>
      <p className="text-[0.625rem] px-1" style={{ color: 'rgba(138,155,149,0.6)' }}>
        الرسائل تبقى معلّقة حتى موافقتك — لا تُرسل تلقائياً أبداً
      </p>

      <AnimatePresence>
        {undoPending !== null && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between px-4 py-2 rounded-lg"
            style={{
              background: 'rgba(127,181,168,0.1)',
              border: '1px solid rgba(127,181,168,0.25)',
            }}
          >
            <span className="text-[0.75rem]" style={{ color: '#7FB5A8' }}>
              اعتُمدت الرسالة
            </span>
            <button
              onClick={handleUndo}
              className="text-[0.75rem] font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: '#D4A574' }}
            >
              تراجع
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {PENDING_MESSAGES.map((m, i) => (
        <div
          key={m.patient}
          className="rounded-xl overflow-hidden transition-opacity duration-300"
          style={{
            border: approved.has(i)
              ? '1px solid rgba(127,181,168,0.3)'
              : '1px solid rgba(255,255,255,0.07)',
            opacity: approved.has(i) ? 0.6 : 1,
          }}
        >
          <div
            className="flex items-center gap-2.5 px-4 py-2.5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[0.5625rem] font-bold shrink-0"
              style={{ background: 'rgba(212,165,116,0.2)', color: '#D4A574' }}
            >
              {m.initial}
            </div>
            <span className="text-[0.8125rem] font-semibold" style={{ color: '#F5EFE6' }}>
              {m.patient}
            </span>
            <span className="text-[0.625rem] ms-auto" style={{ color: '#8A9B95' }}>
              {m.lastVisit}
            </span>
          </div>
          <div className="px-4 py-3">
            <p
              className="text-[0.8125rem] leading-relaxed mb-3"
              style={{ color: '#D8EDEA', direction: 'rtl' }}
            >
              {m.msg}
            </p>
            <div className="flex gap-2 justify-end">
              {approved.has(i) ? (
                <span
                  className="flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(127,181,168,0.15)', color: '#7FB5A8' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تمت الموافقة
                </span>
              ) : (
                <>
                  <button
                    onClick={() => handleApprove(i)}
                    className="text-[0.75rem] font-semibold px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(127,181,168,0.2)', color: '#7FB5A8' }}
                  >
                    اعتمد ✓
                  </button>
                  <button
                    className="text-[0.75rem] font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#8A9B95',
                    }}
                  >
                    طلب تعديل
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ReportsTab() {
  return (
    <div className="space-y-3">
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-[0.8125rem] font-semibold mb-4" style={{ color: '#F5EFE6' }}>
          المرضى الذين عادوا شهرياً
        </p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={MONTHLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="month"
              tick={{ fill: '#8A9B95', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: '#8A9B95', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#0D2A24',
                border: '1px solid rgba(127,181,168,0.2)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#F5EFE6' }}
              itemStyle={{ color: '#7FB5A8' }}
            />
            <Bar dataKey="returned" fill="#7FB5A8" radius={[4, 4, 0, 0]} name="عادوا" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-[0.8125rem] font-semibold mb-4" style={{ color: '#F5EFE6' }}>
          معدل الاستجابة — ٣٠ يوم
        </p>
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={TREND_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A574" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4A574" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fill: '#8A9B95', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: '#8A9B95', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#0D2A24',
                border: '1px solid rgba(212,165,116,0.2)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#F5EFE6' }}
              itemStyle={{ color: '#D4A574' }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#D4A574"
              strokeWidth={2}
              fill="url(#goldGrad)"
              name="معدل %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const CONTENT: Record<TabId, React.ReactNode> = {
  patients: <PatientsTab />,
  messages: <MessagesTab />,
  review: <ReviewTab />,
  reports: <ReportsTab />,
}

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<TabId>('patients')
  const prefersReducedMotion = useReducedMotion()
  const notifRef = useRef<HTMLDivElement>(null)
  const [showNotif, setShowNotif] = useState(false)
  // Single notification reveal, no loop. First item only.
  const notifText = NOTIFICATIONS[0]

  useEffect(() => {
    const el = notifRef.current
    if (!el) return
    if (prefersReducedMotion) {
      setShowNotif(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShowNotif(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [prefersReducedMotion])

  return (
    <section
      className="py-24 overflow-hidden"
      style={{ background: '#071A18' }}
      aria-labelledby="dashboard-heading"
    >
      <div className="max-w-content mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
            style={{
              background: 'rgba(127,181,168,0.12)',
              color: '#7FB5A8',
              border: '1px solid rgba(127,181,168,0.2)',
            }}
          >
            <Wifi className="w-3 h-3" aria-hidden="true" />
            معاينة تجريبية
          </span>
          <h2
            id="dashboard-heading"
            className="font-black mb-4 text-fluid-4xl"
            style={{
              color: '#F5EFE6',
              fontFamily: 'var(--font-tajawal)',
            }}
          >
            لوحة تحكم واضحة
          </h2>
          <p style={{ color: '#8A9B95', fontSize: '1.0625rem' }} className="max-w-sm mx-auto">
            كل شيء في مكانه. من المريض الأول إلى التقرير الشهري.
          </p>
        </motion.div>

        {/* Browser frame */}
        <motion.div
          ref={notifRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl overflow-hidden shadow-e3"
          style={{
            border: '1px solid rgba(127,181,168,0.12)',
          }}
        >
          {/* Browser bar */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: '#030D0B', borderBottom: '1px solid rgba(127,181,168,0.08)' }}
          >
            <div className="flex gap-1.5">
              {['rgba(184,116,61,0.4)', 'rgba(212,165,116,0.35)', 'rgba(127,181,168,0.35)'].map(
                (c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ),
              )}
            </div>
            <div className="flex-1 flex justify-center">
              <div
                className="text-[0.6875rem] px-4 py-1 rounded-md"
                style={{
                  background: 'rgba(127,181,168,0.05)',
                  border: '1px solid rgba(127,181,168,0.08)',
                  color: 'rgba(138,155,149,0.7)',
                }}
              >
                app.aooda.sa/dashboard
              </div>
            </div>
            <div className="flex items-center gap-1 text-[0.625rem]" style={{ color: '#468A7A' }}>
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              آمن
            </div>
          </div>

          {/* Dashboard body */}
          <div style={{ background: '#0A1F1C', minHeight: 480 }} className="p-5">
            {/* Tabs */}
            <div
              role="tablist"
              aria-label="أقسام لوحة التحكم"
              className="flex gap-1 p-1 rounded-xl mb-5 w-fit"
              style={{
                background: 'rgba(127,181,168,0.05)',
                border: '1px solid rgba(127,181,168,0.1)',
              }}
            >
              {TABS.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={active}
                    aria-controls={`panel-${tab.id}`}
                    className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.8125rem] font-medium transition-colors duration-200"
                    style={{ color: active ? '#F5EFE6' : '#8A9B95' }}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(212,165,116,0.14), rgba(127,181,168,0.14))',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" aria-hidden="true" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                id={`panel-${activeTab}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {CONTENT[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live notification — single reveal on viewport entry, no loop */}
          {showNotif && (
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, y: 0, x: '-50%' }
                  : { opacity: 0, y: 12, x: '-50%' }
              }
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
              }
              className="absolute bottom-4 shadow-e2"
              style={{ insetInlineStart: '50%', zIndex: 10 }}
              role="status"
              aria-live="polite"
            >
              <div
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[0.8125rem] whitespace-nowrap"
                style={{
                  background: '#0D2A24',
                  border: '1px solid rgba(212,165,116,0.25)',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: '#7FB5A8' }}
                  aria-hidden="true"
                />
                <span style={{ color: '#F5EFE6' }}>{notifText}</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        <p className="text-center text-xs mt-4" style={{ color: 'rgba(138,155,149,0.4)' }}>
          جميع البيانات المعروضة تجريبية وليست حقيقية
        </p>
      </div>
    </section>
  )
}
