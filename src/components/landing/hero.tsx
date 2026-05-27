'use client'

import dynamic from 'next/dynamic'
import { BookingButton } from '@/components/BookingButton'

const HeroMockup = dynamic(() => import('./hero-mockup').then((m) => ({ default: m.HeroMockup })), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl animate-pulse"
      style={{ height: 340, background: 'rgba(212,165,116,0.06)' }}
    />
  ),
})

const HeroOrbitReturn = dynamic(
  () => import('./hero-orbit-return').then((m) => ({ default: m.HeroOrbitReturn })),
  { ssr: false, loading: () => null },
)

// Grain texture as inline SVG data URI — 1% opacity, no extra request
const GRAIN_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0A1F1C 0%, #142B27 60%, #0E2420 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ backgroundImage: GRAIN_BG, opacity: 0.012, backgroundSize: '250px 250px' }}
      />

      {/* Radial glow from center-right (3D side) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0"
        style={{
          right: '-5%',
          top: '10%',
          width: '55%',
          height: '80%',
          background:
            'radial-gradient(ellipse at center, rgba(212,165,116,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ── 2-column grid ───────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 min-h-screen items-center gap-0">
        {/* LEFT COLUMN — Text + CTAs ─────────────────────────────── */}
        <div className="py-32 lg:py-0 lg:pe-8 flex flex-col" dir="rtl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase"
              style={{
                background: 'rgba(127,181,168,0.12)',
                color: '#7FB5A8',
                border: '1px solid rgba(127,181,168,0.2)',
              }}
            >
              لعيادات الأسنان والعيادات التجميلية
            </span>
          </div>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="font-sans font-bold leading-[1.08] tracking-[-0.02em] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 4.8vw, 4.6rem)', color: '#F5EFE6' }}
          >
            عملاؤك الخاملون
            <br />
            <span style={{ color: '#D4A574' }}>يريدون العودة —</span>
            <br />
            ساعدهم
          </h1>

          {/* Subhead */}
          <p
            className="leading-[1.75] mb-10"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', color: '#8A9B95', maxWidth: '44ch' }}
          >
            أكثر من ٤٠٪ من مرضى العيادات يتوقفون عن الزيارة — ليس لأنهم غير راضين، بل لأن أحداً لم
            يتواصل معهم.
            <br />
            عَودة يفعل ذلك بـ AI — تلقائياً.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mb-10" role="list" aria-label="أرقام عَودة">
            {[
              { value: '٤٠٪', label: 'مرضى خاملون قابلون للاسترداد' },
              { value: '٣×', label: 'عائد على الاستثمار في أول شهر' },
              { value: '٥ دقائق', label: 'لإطلاق أول حملة' },
            ].map((s) => (
              <div key={s.label} role="listitem">
                <div
                  className="font-bold leading-none mb-1"
                  style={{ fontSize: '1.6rem', color: '#D4A574' }}
                  aria-label={`${s.value} — ${s.label}`}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#8A9B95', lineHeight: 1.4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <BookingButton source="hero" className="hero-cta-primary">
              ابدأ تجريباً مجانياً
            </BookingButton>

            <a href="#how" className="hero-cta-ghost">
              شاهد كيف يعمل
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-[12px]" style={{ color: '#5A6B65' }}>
            بلا رسوم ثابتة في الشهر الأول — ادفع نسبة فقط مما نسترجعه
          </p>
        </div>

        {/* RIGHT COLUMN — 3D Orbit Return ──────────────────────────── */}
        <div className="hidden lg:block relative" aria-hidden="true" style={{ height: '100vh' }}>
          {/* Soft left-edge vignette so 3D doesn't bleed into text */}
          <div
            className="absolute inset-y-0 start-0 z-10 w-24 pointer-events-none"
            style={{ background: 'linear-gradient(to end, #0A1F1C 0%, transparent 100%)' }}
          />
          <HeroOrbitReturn />
        </div>
      </div>

      {/* ── Dashboard preview — full width below grid ─────────────── */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-12 pb-20">
        {/* Label above mockup */}
        <div className="flex items-center gap-3 mb-6 justify-center" dir="rtl">
          <span
            className="h-px flex-1 max-w-[80px]"
            style={{ background: 'rgba(212,165,116,0.2)' }}
          />
          <span
            className="text-[11px] tracking-[0.14em] uppercase font-medium"
            style={{ color: '#5A6B65' }}
          >
            لوحة التحكم
          </span>
          <span
            className="h-px flex-1 max-w-[80px]"
            style={{ background: 'rgba(212,165,116,0.2)' }}
          />
        </div>

        {/* Mockup with dark glass frame */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(212,165,116,0.12)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,165,116,0.06)',
            background: 'rgba(20,43,39,0.6)',
          }}
        >
          <HeroMockup />
        </div>
      </div>

      {/* Arc transition to next section (cream) */}
      <div className="w-full relative z-10" aria-hidden="true">
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          fill="none"
          className="w-full block"
          style={{ height: 48 }}
        >
          <path d="M0 48 Q720 0 1440 48 L1440 48 L0 48 Z" fill="#F5F1E8" />
        </svg>
      </div>
    </section>
  )
}
