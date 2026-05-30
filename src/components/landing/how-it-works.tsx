'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionNumber } from '@/components/ui/section-number'
import { SectionGlow, DotGrid } from '@/components/ui/section-bg'
import { FadeIn } from '@/components/ui/fade-in'

/* ─── Color constants ────────────────────────────────────────────── */
const GOLD_GRADIENT = 'linear-gradient(135deg, #D4A574 0%, #F5D09A 50%, #C08840 100%)'

/* ─── Step 1 mockup: CSV Upload ──────────────────────────────────── */
function CsvFragment() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div
      className="rounded-xl border border-line bg-paper p-4 text-start w-full"
      aria-hidden="true"
    >
      {/* File header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-line flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="#6B6359" strokeWidth="1.2" />
            <line
              x1="4"
              y1="5"
              x2="10"
              y2="5"
              stroke="#6B6359"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="7"
              x2="10"
              y2="7"
              stroke="#6B6359"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="9"
              x2="8"
              y2="9"
              stroke="#6B6359"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <div className="text-[11px] font-[500] text-ink">patients_2024.csv</div>
          <div className="text-[10px] text-mute">247 سجل · 3.2 KB</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-1 rounded-full bg-line overflow-hidden" ref={ref}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: GOLD_GRADIENT }}
          initial={{ width: '0%' }}
          animate={inView ? { width: '100%' } : { width: '0%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Data preview table */}
      <div className="rounded-lg overflow-hidden border border-line/60 mb-3">
        <table className="w-full text-[9.5px]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(31,61,54,0.05)' }}>
              <th className="px-2 py-1.5 text-start text-mute font-[500]">الاسم</th>
              <th className="px-2 py-1.5 text-start text-mute font-[500]">الهاتف</th>
              <th className="px-2 py-1.5 text-start text-mute font-[500]">آخر زيارة</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['أحمد الزهراني', '0501234567', '٢٠٢٤-٠٨-١٥'],
              ['فاطمة العتيبي', '0557891234', '٢٠٢٤-٠٧-٢٢'],
              ['خالد السالم', '0512345678', '٢٠٢٣-١٢-٠١'],
            ].map(([name, phone, date], i) => (
              <tr
                key={i}
                className="border-t border-line/40"
                style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(245,241,232,0.5)' }}
              >
                <td className="px-2 py-1.5 text-ink font-[500]">{name}</td>
                <td
                  className="px-2 py-1.5 text-mute"
                  style={{ direction: 'ltr', textAlign: 'right' }}
                >
                  {phone}
                </td>
                <td className="px-2 py-1.5 text-mute">{date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verified badge */}
      <motion.div
        className="flex items-center gap-2 mt-2"
        initial={{ opacity: 0, y: 4 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-[700] flex-shrink-0"
          style={{ background: 'rgba(212,165,116,0.18)', color: '#B8743D' }}
        >
          ✓
        </span>
        <span className="text-[10px] font-[500]" style={{ color: '#B8743D' }}>
          ٢٤٧ سجل تم التحقق منه
        </span>
      </motion.div>
    </div>
  )
}

/* ─── Typing indicator ───────────────────────────────────────────── */
function TypingDots() {
  return (
    <div
      className="flex items-center gap-[3px] px-3 py-2 rounded-[4px_12px_12px_12px] w-fit"
      style={{ background: 'rgba(26,51,45,0.95)', border: '1px solid rgba(127,181,168,0.15)' }}
    >
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.span
          key={i}
          className="block w-1.5 h-1.5 rounded-full"
          style={{ background: '#8A9B95' }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ─── Status chip ────────────────────────────────────────────────── */
function Chip({ label, variant }: { label: string; variant: 'vip' | 'idle' | 'active' }) {
  const styles = {
    vip: { bg: 'rgba(212,165,116,0.18)', color: '#B8743D' },
    idle: { bg: 'rgba(184,116,61,0.18)', color: '#B8743D' },
    active: { bg: 'rgba(127,181,168,0.18)', color: '#326B5C' },
  }[variant]
  return (
    <span
      className="text-[8px] font-[600] px-1.5 py-0.5 rounded-full"
      style={{ background: styles.bg, color: styles.color }}
    >
      {label}
    </span>
  )
}

/* ─── Step 2 mockup: AI Messages ─────────────────────────────────── */
function MessageFragment() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const chips1: Array<{ label: string; variant: 'vip' | 'idle' | 'active' }> = [
    { label: 'VIP', variant: 'vip' },
    { label: 'خامل', variant: 'idle' },
  ]
  const chips2: Array<{ label: string; variant: 'vip' | 'idle' | 'active' }> = [
    { label: 'نشط', variant: 'active' },
  ]

  return (
    <div
      ref={ref}
      className="rounded-xl border border-line bg-paper overflow-hidden text-start w-full"
      aria-hidden="true"
    >
      {/* WhatsApp header */}
      <div className="bg-forest px-3 py-2 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-paper/20 flex items-center justify-center text-[11px] font-[700] text-cream flex-shrink-0">
          ع
        </div>
        <div>
          <div className="text-[11px] font-[600] text-cream">عَودة</div>
          <div className="text-[9px] text-cream/60">متصل الآن</div>
        </div>
      </div>

      {/* Chat area */}
      <div className="p-3 space-y-3 bg-[#ECE5DD]">
        {/* Patient 1: فاطمة */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[8px] font-[700] text-[#166534] flex-shrink-0">
              ف
            </div>
            <span className="text-[9px] font-[600] text-ink">فاطمة الزهراني</span>
            <div className="flex gap-1">
              {chips1.map((c) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.3 + chips1.indexOf(c) * 0.1 }}
                >
                  <Chip label={c.label} variant={c.variant} />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[160px] bg-[#DCF8C6] rounded-[12px_4px_12px_12px] px-3 py-1.5 text-[10px] text-ink leading-[1.5]">
              السلام عليكم أبو فاطمة، وحشتنا 🌟 مرّت فترة منذ زيارتك لعيادة الابتسامة...
              <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                <span className="text-[8px]">١٠:٢٤</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="#34B7F1">
                  <path
                    d="M1 4l3 3 7-7M4 4l3 3 7-7"
                    strokeWidth="1.2"
                    stroke="#34B7F1"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Patient 2: خالد */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[8px] font-[700] text-[#92400E] flex-shrink-0">
              خ
            </div>
            <span className="text-[9px] font-[600] text-ink">خالد السالم</span>
            <div className="flex gap-1">
              {chips2.map((c) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.5 }}
                >
                  <Chip label={c.label} variant={c.variant} />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[170px] bg-[#DCF8C6] rounded-[12px_4px_12px_12px] px-3 py-1.5 text-[10px] text-ink leading-[1.5]">
              خالد، مرّت فترة منذ زيارتك الأخيرة. لوحة ابتسامة تفتقدك! خصصنا لك موعداً مميزاً هذا
              الأسبوع...
            </div>
          </div>
        </div>

        {/* Typing indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          <TypingDots />
        </motion.div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-line flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-copper flex-shrink-0" />
        <span className="text-[10px] text-mute">كتبه Claude AI · ٤ ثوانٍ</span>
      </div>
    </div>
  )
}

/* ─── Mini calendar ──────────────────────────────────────────────── */
function MiniCalendar() {
  const highlighted = new Set([3, 10, 17])
  return (
    <div className="grid grid-cols-7 gap-0.5 mt-2">
      {Array.from({ length: 21 }, (_, i) => (
        <div
          key={i}
          className="w-5 h-5 rounded-sm flex items-center justify-center text-[7px] font-[500]"
          style={
            highlighted.has(i)
              ? { background: GOLD_GRADIENT, color: '#fff' }
              : { background: 'rgba(255,255,255,0.06)', color: 'rgba(245,241,232,0.35)' }
          }
        >
          {i + 1}
        </div>
      ))}
    </div>
  )
}

/* ─── Step 3 mockup: Results Dashboard ───────────────────────────── */
function DashboardFragment() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div
      ref={ref}
      className="rounded-xl overflow-hidden text-start w-full"
      style={{ background: '#0A1F1C', border: '1px solid rgba(127,181,168,0.15)' }}
      aria-hidden="true"
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(127,181,168,0.1)' }}
      >
        <span className="text-[11px] font-[600]" style={{ color: '#F5EFE6' }}>
          لوحة التحكم
        </span>
        <span className="text-[9px]" style={{ color: '#8A9B95' }}>
          مايو ٢٠٢٦
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* KPI pills */}
        <div className="flex gap-2">
          <motion.div
            className="flex-1 rounded-lg px-3 py-2"
            style={{
              background: 'rgba(212,165,116,0.12)',
              border: '1px solid rgba(212,165,116,0.2)',
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M1 6L4 2L7 6"
                  stroke="#D4A574"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[8px] font-[500]" style={{ color: '#D4A574' }}>
                +٣٧٪
              </span>
            </div>
            <div className="text-[13px] font-[700]" style={{ color: '#D4A574' }}>
              +١٢٬٤٠٠
            </div>
            <div className="text-[8px]" style={{ color: '#8A9B95' }}>
              ريال هذا الشهر
            </div>
          </motion.div>

          <motion.div
            className="flex-1 rounded-lg px-3 py-2"
            style={{
              background: 'rgba(127,181,168,0.1)',
              border: '1px solid rgba(127,181,168,0.2)',
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-[13px] font-[700]" style={{ color: '#7FB5A8' }}>
              ٣٨
            </div>
            <div className="text-[8px]" style={{ color: '#8A9B95' }}>
              مريض عاد
            </div>
            <div className="text-[7px] mt-0.5" style={{ color: 'rgba(127,181,168,0.6)' }}>
              هذا الشهر
            </div>
          </motion.div>
        </div>

        {/* Mini calendar */}
        <MiniCalendar />

        {/* Booking toast */}
        <motion.div
          className="rounded-lg px-3 py-2 flex items-center gap-2"
          style={{
            background: 'rgba(62,144,130,0.15)',
            border: '1px solid rgba(127,181,168,0.25)',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <span
            className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-[700]"
            style={{ background: 'rgba(127,181,168,0.25)', color: '#7FB5A8' }}
          >
            ✓
          </span>
          <span className="text-[9px] font-[500]" style={{ color: '#7FB5A8' }}>
            حجز موعد جديد — فاطمة العتيبي
          </span>
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Step data ──────────────────────────────────────────────────── */
type StepData = {
  numeral: string
  title: string
  desc: string
  bullets: string[]
  Fragment: () => React.JSX.Element
}

const STEPS: StepData[] = [
  {
    numeral: '٠١',
    title: 'اربط بياناتك',
    desc: 'استورد سجلات عملائك بملف CSV. نستخدم الاسم، رقم الهاتف، وتاريخ آخر زيارة فقط — لا بيانات طبية.',
    bullets: ['CSV أو Excel — أي تنسيق', '٣ أعمدة فقط: اسم، هاتف، تاريخ', 'إعداد في أقل من دقيقة'],
    Fragment: CsvFragment,
  },
  {
    numeral: '٠٢',
    title: 'Claude AI يصنّف ويكتب',
    desc: 'النموذج يحلل كل عميل ويكتب رسالة WhatsApp شخصية باللهجة المحلية — يمكنك مراجعتها قبل الإرسال.',
    bullets: [
      'رسالة شخصية لكل مريض',
      'تراجع قبل الإرسال — أنت المتحكم',
      'باللهجة المحلية السعودية أو الأردنية',
    ],
    Fragment: MessageFragment,
  },
  {
    numeral: '٠٣',
    title: 'احصد النتيجة',
    desc: 'كل رد ينعكس تلقائياً في لوحة التحكم. الحجوزات تُحتسب على الفور كإيرادات مسترجعة.',
    bullets: ['كل رد = موعد مباشر في لوحتك', 'إيراد محسوب تلقائياً', 'متوسط ١٢٬٤٠٠ ر.س شهرياً'],
    Fragment: DashboardFragment,
  },
]

/* ─── Single step card ───────────────────────────────────────────── */
function StepCard({ step, index }: { step: StepData; index: number }) {
  const { numeral, title, desc, bullets, Fragment } = step

  return (
    <FadeIn delay={index * 140}>
      <div
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 transition-shadow duration-300"
        style={{
          border: '1px solid rgba(31,61,54,0.12)',
          background:
            'linear-gradient(135deg, rgba(245,241,232,0.6) 0%, rgba(255,252,245,0.9) 60%, rgba(240,247,246,0.5) 100%)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(127,181,168,0.3)'
          el.style.boxShadow = '0 0 40px rgba(127,181,168,0.08)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(31,61,54,0.12)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Dot grid background */}
        <DotGrid opacity={0.025} color="#6B6359" size={24} />

        {/* Watermark number behind */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute font-serif font-black"
          style={{
            fontSize: '18rem',
            lineHeight: 1,
            top: '-2rem',
            insetInlineEnd: '-1rem',
            opacity: 0.04,
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.05em',
            zIndex: 0,
          }}
        >
          {numeral}
        </div>

        {/* Card content grid */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
          {/* ── Number column (20%) ── */}
          <div className="flex-shrink-0 md:w-[20%] flex flex-row md:flex-col items-center md:items-start">
            <span
              className="font-serif font-black leading-none select-none"
              style={{
                fontSize: 'clamp(4rem, 8vw, 8rem)',
                background: GOLD_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.04em',
              }}
              aria-hidden="true"
            >
              {numeral}
            </span>
          </div>

          {/* ── Text column (40%) ── */}
          <div className="flex-1 md:w-[40%]">
            <h3
              className="font-sans font-bold text-ink mb-3"
              style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', letterSpacing: '-0.02em' }}
            >
              {title}
            </h3>
            <p className="text-mute text-[15px] leading-[1.7] mb-5">{desc}</p>
            <ul className="space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: GOLD_GRADIENT }}
                    aria-hidden="true"
                  />
                  <span className="text-[14px] text-ink/80 leading-[1.6]">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Mockup column (40%) — hidden on mobile ── */}
          <div className="hidden md:block md:w-[40%] flex-shrink-0">
            <Fragment />
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

/* ─── Connector line between cards ──────────────────────────────── */
function ConnectorLine() {
  return (
    <div aria-hidden="true" className="hidden md:flex justify-center" style={{ height: 24 }}>
      <div
        style={{
          width: 1,
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(212,165,116,0.5), rgba(212,165,116,0.15))',
        }}
      />
    </div>
  )
}

/* ─── Main section export ────────────────────────────────────────── */
export function HowItWorksSection() {
  return (
    <section
      id="how"
      dir="rtl"
      className="relative overflow-hidden py-20 px-6"
      style={{ background: 'var(--paper)' }}
      aria-labelledby="how-heading"
    >
      {/* Background glows */}
      <SectionGlow color="sage" position="top-right" size={800} opacity={0.06} />
      <SectionGlow color="gold" position="bottom-left" size={500} opacity={0.03} />

      <div className="max-w-content mx-auto relative z-10">
        <SectionNumber n={2} label="كيف يشتغل" />

        <FadeIn>
          <h2
            id="how-heading"
            className="font-sans font-bold text-ink mb-3"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              maxWidth: '24ch',
            }}
          >
            ثلاث خطوات من البيانات إلى الإيراد
          </h2>
          <p className="mb-16" style={{ fontSize: 16, color: '#8A9B95', lineHeight: 1.6 }}>
            من لحظة الرفع إلى موعد محجوز — في أقل من ٧٢ ساعة
          </p>
        </FadeIn>

        {/* Cards with connectors */}
        <div>
          {STEPS.map((step, i) => (
            <div key={step.numeral}>
              <StepCard step={step} index={i} />
              {i < STEPS.length - 1 && <ConnectorLine />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
