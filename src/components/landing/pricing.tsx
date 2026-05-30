'use client'

import { Check, Shield, Zap, Star } from 'lucide-react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { BookingButton } from '@/components/BookingButton'
import { DotGrid, SectionGlow } from '@/components/ui/section-bg'
import type { MouseEvent } from 'react'

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.65, delay, ease: 'easeOut' as const },
  }
}

const REVENUE_FEATURES = [
  'رسائل WhatsApp شخصية بـ Claude AI',
  'تصنيف عملاء تلقائي — VIP · نشط · خامل',
  'لوحة تحكم مع تتبع الإيرادات لحظياً',
  'دعم بالعربية ٢٤/٧',
  'تقرير شهري تفصيلي',
]

const SUBSCRIPTION_FEATURES = [
  'كل مزايا خطة النسبة',
  'عدد عملاء غير محدود',
  'API مخصص للتكامل مع نظامك',
  'مدير حساب مخصص',
  'SLA بوقت استجابة مضمون',
]

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useTransform(my, [-80, 80], [4, -4])
  const rotateY = useTransform(mx, [-80, 80], [-4, 4])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left - r.width / 2)
    my.set(e.clientY - r.top - r.height / 2)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      {children}
    </motion.div>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(127,181,168,0.12)', border: '1px solid rgba(127,181,168,0.25)' }}
      >
        <Check size={10} strokeWidth={2.5} color="#7FB5A8" />
      </span>
      <span style={{ color: '#8A9B95', fontSize: 14, lineHeight: 1.55 }}>{text}</span>
    </li>
  )
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-20 px-6"
      style={{ background: 'linear-gradient(170deg, #071810 0%, #0A1F1C 55%, #0E2420 100%)' }}
      aria-labelledby="pricing-heading"
    >
      <DotGrid opacity={0.04} color="#7FB5A8" size={32} />
      <SectionGlow color="sage" position="top-right" size={800} opacity={0.055} />
      <SectionGlow color="gold" position="bottom-left" size={600} opacity={0.04} />

      <div className="max-w-content mx-auto relative z-10">
        {/* Eyebrow */}
        <motion.div className="flex justify-center mb-6" {...fade(0)}>
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.15em] uppercase"
            style={{
              background: 'rgba(212,165,116,0.08)',
              color: '#D4A574',
              border: '1px solid rgba(212,165,116,0.18)',
            }}
          >
            <Zap size={10} />
            الأسعار
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          id="pricing-heading"
          className="font-sans font-black text-cream text-center mb-5"
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
          }}
          {...fade(0.08)}
        >
          تدفع بعد ما نثبت
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-center mb-12 mx-auto"
          style={{ color: '#8A9B95', fontSize: 18, maxWidth: '52ch', lineHeight: 1.7 }}
          {...fade(0.16)}
        >
          لا نجاح — لا فاتورة. مصلحتنا واحدة.
        </motion.p>

        {/* Divider ornament */}
        <motion.div className="flex items-center justify-center gap-3 mb-20" {...fade(0.22)}>
          <div
            className="h-px w-14"
            style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.45))' }}
          />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4A574' }} />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'rgba(212,165,116,0.4)' }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'rgba(212,165,116,0.2)' }}
          />
          <div
            className="h-px w-14"
            style={{ background: 'linear-gradient(to left, transparent, rgba(212,165,116,0.45))' }}
          />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 items-stretch">
          {/* ── Featured: Revenue share ─────────────────────────────── */}
          <motion.div className="flex flex-col" {...fade(0.18)}>
            <TiltCard
              className="h-full flex flex-col rounded-3xl p-12 relative overflow-hidden"
              // @ts-expect-error padding-box/border-box gradient border trick
              style={{
                background:
                  'linear-gradient(135deg, #142B27, #1B3830) padding-box, linear-gradient(135deg, rgba(212,165,116,0.55) 0%, rgba(138,96,64,0.25) 50%, rgba(212,165,116,0.55) 100%) border-box',
                border: '1.5px solid transparent',
                boxShadow: '0 0 80px rgba(212,165,116,0.06), 0 24px 64px rgba(0,0,0,0.45)',
              }}
            >
              {/* Inner top glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 start-0 end-0 h-48"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(212,165,116,0.12) 0%, transparent 70%)',
                }}
              />

              {/* "Recommended" badge */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase"
                  style={{
                    background: 'rgba(212,165,116,0.13)',
                    color: '#D4A574',
                    border: '1px solid rgba(212,165,116,0.28)',
                  }}
                >
                  <Star size={8} fill="currentColor" />
                  موصى به
                </span>
              </div>

              <h3
                className="font-sans font-bold text-cream mb-1 relative z-10"
                style={{ fontSize: 20, letterSpacing: '-0.02em' }}
              >
                نسبة من المسترجع
              </h3>
              <p className="mb-8 relative z-10" style={{ color: '#8A9B95', fontSize: 13 }}>
                الأنسب لمعظم العيادات
              </p>

              {/* Price */}
              <div className="mb-2 relative z-10" aria-label="٢٠٪ من الإيرادات المسترجعة">
                <span
                  className="font-sans font-black leading-none select-none"
                  aria-hidden="false"
                  style={{
                    fontSize: 'clamp(5rem, 10vw, 8rem)',
                    letterSpacing: '-0.045em',
                    background: 'linear-gradient(135deg, #D4A574 0%, #F5D09A 55%, #D4A574 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                    WebkitFontSmoothing: 'antialiased',
                    willChange: 'auto',
                  }}
                >
                  ٢٠٪
                </span>
              </div>
              <p className="mb-4 relative z-10" style={{ color: '#8A9B95', fontSize: 13 }}>
                من الإيرادات المسترجعة فقط
              </p>
              <p
                className="mb-10 relative z-10 leading-relaxed"
                style={{ color: '#8A9B95', fontSize: 14 }}
              >
                ما تدفع شيئاً مسبقاً. مصلحتنا مرتبطة مباشرةً بنتائجك.
              </p>

              <ul className="space-y-3.5 flex-1 mb-10 relative z-10">
                {REVENUE_FEATURES.map((f) => (
                  <FeatureItem key={f} text={f} />
                ))}
              </ul>

              <div className="relative z-10">
                <BookingButton
                  source="pricing-revenue"
                  className="w-full h-12 rounded-full font-bold text-[15px] transition-all duration-200 hover:shadow-[0_0_28px_rgba(212,165,116,0.45)] active:scale-[0.98]"
                  style={
                    {
                      background: 'linear-gradient(135deg, #D4A574, #C08840)',
                      color: '#0A1F1C',
                    } as React.CSSProperties
                  }
                >
                  ابدأ مجاناً
                </BookingButton>
              </div>
            </TiltCard>
          </motion.div>

          {/* ── OR divider ───────────────────────────────────────────── */}
          <div className="hidden md:flex flex-col items-center justify-center px-8 py-16">
            <div
              className="w-px flex-1"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, rgba(127,181,168,0.18) 25%, rgba(127,181,168,0.18) 75%, transparent)',
              }}
            />
            <div
              className="my-4 w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0"
              style={{
                border: '1px solid rgba(127,181,168,0.22)',
                color: '#7FB5A8',
                background: 'rgba(127,181,168,0.05)',
              }}
            >
              أو
            </div>
            <div
              className="w-px flex-1"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, rgba(127,181,168,0.18) 25%, rgba(127,181,168,0.18) 75%, transparent)',
              }}
            />
          </div>

          {/* ── Subscription ────────────────────────────────────────── */}
          <motion.div className="flex flex-col" {...fade(0.3)}>
            <TiltCard
              className="h-full flex flex-col rounded-3xl p-12 relative overflow-hidden"
              // @ts-expect-error inline style
              style={{
                background: '#0E2118',
                border: '1.5px solid rgba(127,181,168,0.14)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              }}
            >
              {/* Spacer aligns with badge height */}
              <div className="mb-6 h-7" aria-hidden="true" />

              <h3
                className="font-sans font-bold text-cream mb-1"
                style={{ fontSize: 20, letterSpacing: '-0.02em' }}
              >
                اشتراك شهري ثابت
              </h3>
              <p className="mb-8" style={{ color: '#8A9B95', fontSize: 13 }}>
                للعيادات ذات الحجم العالي
              </p>

              {/* Price */}
              <div className="mb-2" aria-label="٤٩٩ ريال سعودي شهرياً">
                <span
                  className="font-sans font-black leading-none select-none"
                  style={{
                    fontSize: 'clamp(5rem, 10vw, 8rem)',
                    letterSpacing: '-0.045em',
                    background: 'linear-gradient(135deg, #7FB5A8 0%, #9FD0C8 55%, #7FB5A8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                    WebkitFontSmoothing: 'antialiased',
                    willChange: 'auto',
                  }}
                >
                  ٤٩٩
                </span>
              </div>
              <p className="mb-4" style={{ color: '#8A9B95', fontSize: 13 }}>
                ر.س / شهر
              </p>
              <p className="mb-10 leading-relaxed" style={{ color: '#8A9B95', fontSize: 14 }}>
                تكلفة ثابتة ومتوقعة — مناسب للعيادات التي تعالج عدداً كبيراً من المرضى.
              </p>

              <ul className="space-y-3.5 flex-1 mb-10">
                {SUBSCRIPTION_FEATURES.map((f) => (
                  <FeatureItem key={f} text={f} />
                ))}
              </ul>

              <BookingButton
                source="pricing-subscription"
                className="w-full h-12 rounded-full font-semibold text-[15px] transition-all duration-200 hover:bg-[rgba(127,181,168,0.1)] active:scale-[0.98]"
                style={
                  {
                    border: '1.5px solid rgba(127,181,168,0.3)',
                    color: '#7FB5A8',
                    background: 'rgba(127,181,168,0.05)',
                  } as React.CSSProperties
                }
              >
                أحجز عرضاً توضيحياً
              </BookingButton>
            </TiltCard>
          </motion.div>
        </div>

        {/* ── Trust bar ────────────────────────────────────────────── */}
        <motion.div
          className="mt-16 pt-10"
          style={{ borderTop: '1px solid rgba(127,181,168,0.09)' }}
          {...fade(0.2)}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Clinic avatars */}
            <div className="flex items-center gap-4">
              <div className="flex items-center" dir="ltr">
                {['ع', 'ر', 'س', 'ن', 'خ'].map((letter, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold"
                    style={{
                      background: `hsl(${158 + i * 12}, 28%, 18%)`,
                      color: '#7FB5A8',
                      border: '2px solid #0A1F1C',
                      marginLeft: i > 0 ? -8 : 0,
                      position: 'relative',
                      zIndex: 5 - i,
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p style={{ color: '#8A9B95', fontSize: 14 }}>
                <span style={{ color: '#D4A574', fontWeight: 600 }}>٣٤+ عيادة</span> تثق بعَودة في
                السعودية والأردن والإمارات
              </p>
            </div>

            {/* Guarantee badge */}
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full"
              style={{
                background: 'rgba(127,181,168,0.05)',
                border: '1px solid rgba(127,181,168,0.14)',
              }}
            >
              <Shield size={14} color="#7FB5A8" />
              <span style={{ color: '#7FB5A8', fontSize: 13, fontWeight: 500 }}>
                ضمان: إذا ما رجع أحد — لا فاتورة
              </span>
            </div>
          </div>

          <p className="mt-6 text-center" style={{ color: '#8A9B95', fontSize: 12 }}>
            لا عقود طويلة · لا رسوم إعداد · إلغاء في أي وقت
          </p>
          <div
            className="mt-4 text-end"
            dir="rtl"
            style={{ color: '#6B6359', fontSize: 11, lineHeight: 1.8 }}
          >
            <p>
              * &ldquo;إيراد مسترجع&rdquo; = مريض لم يحجز خلال ٩٠ يوماً أو أكثر، ثم حجز خلال ٣٠
              يوماً من إرسال الرسالة.
            </p>
            <p>التعريف مُوثّق في العقد.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
