'use client'

import dynamic from 'next/dynamic'
import { BookingButton } from '@/components/BookingButton'
import { HeroPatientCards } from '@/components/hero/HeroPatientCards'

const HeroMockup = dynamic(() => import('./hero-mockup').then((m) => ({ default: m.HeroMockup })), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl animate-pulse"
      style={{ height: 340, background: 'rgba(212,165,116,0.06)' }}
    />
  ),
})

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
                background: 'rgba(212,165,116,0.12)',
                color: '#D4A574',
                border: '1px solid rgba(212,165,116,0.2)',
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

          {/* Subhead — softened claim, no fabricated ratio.
              TODO(brand): if pilot data supports a specific ratio, cite it with source. */}
          <p
            className="leading-[1.75] mb-10"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', color: '#8A9B95', maxWidth: '44ch' }}
          >
            كثير من مرضاك ما يرجعون — ليس غضباً، بل نسياناً.
            <br />
            عَودة يذكّرهم. تلقائياً.
          </p>

          {/* Value props — no fabricated cohort numbers.
              TODO(brand): once we have a signed pilot cohort with published results,
              replace with attributed numbers + a source link. */}
          <div
            className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10"
            role="list"
            aria-label="مزايا عَودة"
          >
            {[
              {
                title: 'بدون رسوم مسبقة',
                desc: 'تدفع نسبة من الإيراد المسترجع فقط',
              },
              {
                title: 'بياناتك تبقى لك',
                desc: 'تشفير كامل · تستلم نسخة عند الإلغاء',
              },
              {
                title: 'أقل من ٣٠ دقيقة',
                desc: 'لإطلاق أول حملة من رفع الملف',
              },
            ].map((s) => (
              <div key={s.title} role="listitem" className="max-w-[18ch]">
                <div
                  className="font-semibold leading-tight mb-1"
                  style={{ fontSize: '0.95rem', color: '#D4A574' }}
                >
                  {s.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8A9B95', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <BookingButton source="hero" className="hero-cta-primary">
              أبدأ مجاناً
            </BookingButton>

            <a href="#how" className="hero-cta-ghost">
              أشاهد كيف يعمل
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
          <p className="mt-8 text-[12px]" style={{ color: '#8A9B95' }}>
            بدون رسوم مسبقة — تدفع نسبة فقط مما نسترجعه
          </p>
          <p className="mt-3 text-[11px]" style={{ color: '#6B6359' }}>
            لا رفع بيانات · مخزّن في السعودية · تجربة كاملة مجاناً
          </p>
        </div>

        {/* RIGHT COLUMN — Patient Cards ───────────────────────────── */}
        <div
          className="hidden lg:flex relative items-center justify-center"
          aria-hidden="true"
          style={{ minHeight: '100vh' }}
        >
          <HeroPatientCards />
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
            style={{ color: '#8A9B95' }}
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
          className="rounded-2xl overflow-hidden shadow-e3"
          style={{
            border: '1px solid rgba(212,165,116,0.12)',
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
          <path d="M0 48 Q720 0 1440 48 L1440 48 L0 48 Z" fill="var(--cream)" />
        </svg>
      </div>
    </section>
  )
}
