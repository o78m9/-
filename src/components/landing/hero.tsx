import dynamic from 'next/dynamic'
import { BookingButton } from '@/components/BookingButton'
import { ReturnArc } from '@/components/ui/return-arc'

const HeroMockup = dynamic(() => import('./hero-mockup').then((m) => ({ default: m.HeroMockup })), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-[20px] bg-paper border border-line animate-pulse"
      style={{ height: 280 }}
    />
  ),
})

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-36 pb-0 px-6"
      aria-labelledby="hero-heading"
      style={{ background: 'var(--cream)' }}
    >
      {/* Watermark عَودة */}
      <div
        className="pointer-events-none select-none absolute bottom-0 end-[-2%] font-fraunces text-forest leading-none"
        style={{ fontSize: 'clamp(200px, 28vw, 360px)', opacity: 0.04, zIndex: 0 }}
        aria-hidden="true"
      >
        عَودة
      </div>

      <div className="max-w-content mx-auto relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className="h-px w-14 bg-forest" aria-hidden="true" />
          <span className="text-[12px] font-[500] tracking-[0.14em] uppercase text-forest">
            لعيادات الأسنان
          </span>
          <span className="h-px w-14 bg-forest" aria-hidden="true" />
        </div>

        {/* Headline — asymmetric editorial */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <ReturnArc
              width={560}
              height={90}
              strokeWidth={1.2}
              className="text-forest opacity-[0.07]"
            />
          </div>

          <h1
            id="hero-heading"
            className="font-sans font-[700] text-ink relative"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.25rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            <span className="block" style={{ textAlign: 'right' }}>
              عملاؤك الخاملون
            </span>
            <span className="block text-mute" style={{ textAlign: 'left' }}>
              لم يتركوك — صمتَّ
            </span>
            <span className="block" style={{ textAlign: 'center' }}>
              عَودة يكسر الصمت
            </span>
          </h1>
        </div>

        {/* Subhead */}
        <p
          className="text-mute text-center mx-auto mb-10"
          style={{ fontSize: 18, lineHeight: 1.65, maxWidth: '52ch' }}
        >
          أكثر من ٤٠٪ من مرضى العيادات يتوقفون عن الزيارة — ليس لأنهم غير راضين، بل لأن أحداً لم
          يتواصل معهم. عَودة يفعل ذلك تلقائياً.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <BookingButton
            source="hero"
            className="inline-flex items-center h-12 px-8 rounded-full border border-forest bg-forest text-cream text-[16px] font-[500] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(31,61,54,0.35)] transition-all duration-150 active:translate-y-0"
          >
            ابدأ تجريباً مجانياً
          </BookingButton>
          <a
            href="#how"
            className="inline-flex items-center gap-2 text-[15px] font-[500] text-forest hover:text-moss transition-colors duration-150"
            style={{
              textDecoration: 'underline',
              textDecorationColor: 'rgba(31,61,54,0.3)',
              textUnderlineOffset: '4px',
              textDecorationThickness: '1px',
            }}
          >
            شاهد كيف يعمل
          </a>
        </div>

        {/* Full-width mockup — bleeds to edges on mobile */}
        <div className="mx-auto max-w-4xl">
          <HeroMockup />
        </div>
      </div>

      {/* Arc section transition */}
      <div className="w-full mt-[-1px] relative z-10" aria-hidden="true">
        <svg
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          fill="none"
          className="w-full block"
          style={{ height: 40 }}
        >
          <path d="M0 0 L1440 0 L1440 40 Q720 0 0 40 Z" fill="#FFFCF5" />
        </svg>
      </div>
    </section>
  )
}
