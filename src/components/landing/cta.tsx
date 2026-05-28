import { BookingButton } from '@/components/BookingButton'

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-40 px-6"
      style={{ background: 'linear-gradient(170deg, #0A1F1C 0%, #0E2420 60%, #071810 100%)' }}
      aria-labelledby="cta-heading"
      id="cta"
    >
      {/* Pulsing gold orb — central accent */}
      <div
        className="pulse-glow pointer-events-none absolute left-1/2 top-1/2 rounded-full"
        aria-hidden="true"
        style={{
          width: 600,
          height: 600,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.05) 40%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* Secondary sage glow offset */}
      <div
        className="pulse-glow-slow pointer-events-none absolute"
        aria-hidden="true"
        style={{
          width: 400,
          height: 400,
          top: '10%',
          right: '5%',
          background: 'radial-gradient(circle, rgba(127,181,168,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Brand watermark */}
      <div
        className="pointer-events-none select-none absolute bottom-0 end-[-2%] font-fraunces text-cream leading-none"
        style={{
          fontSize: 'clamp(180px, 28vw, 380px)',
          opacity: 0.04,
          zIndex: 0,
          lineHeight: 0.9,
        }}
        aria-hidden="true"
      >
        عَودة
      </div>

      {/* Subtle dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(127,181,168,0.15) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.025,
        }}
      />

      <div className="max-w-content mx-auto text-center relative z-10">
        {/* Eyebrow */}
        <p
          className="text-[12px] font-semibold tracking-[0.18em] uppercase mb-6"
          style={{ color: 'rgba(245,239,230,0.45)' }}
        >
          الخطوة الأولى مجانية
        </p>

        {/* Divider ornament */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="h-px w-12"
            style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.4))' }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'rgba(212,165,116,0.6)' }}
          />
          <div
            className="h-px w-12"
            style={{ background: 'linear-gradient(to left, transparent, rgba(212,165,116,0.4))' }}
          />
        </div>

        {/* Headline */}
        <h2
          id="cta-heading"
          className="font-sans font-black text-cream mb-6 mx-auto"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.8rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            maxWidth: '18ch',
          }}
        >
          أبدأ اليوم — <span style={{ color: '#D4A574' }}>ما أدفع</span> حتى ترجع نتائجي
        </h2>

        <p
          className="text-cream/60 mb-14 mx-auto"
          style={{ fontSize: 18, maxWidth: '44ch', lineHeight: 1.7 }}
        >
          إعداد كامل في ٣٠ دقيقة. أول ٣٠ يوماً مجاناً. ما رجع أحد — ما دفعت شيئاً.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <BookingButton
            source="final-cta"
            className="inline-flex items-center h-[54px] px-10 rounded-full text-[16px] font-bold transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] active:translate-y-0"
            style={
              {
                background: 'linear-gradient(135deg, #D4A574, #C08840)',
                color: '#0A1F1C',
              } as React.CSSProperties
            }
          >
            أبدأ مجاناً
          </BookingButton>

          <BookingButton
            source="final-cta-secondary"
            className="inline-flex items-center gap-2 h-[54px] px-8 rounded-full text-[15px] font-medium transition-all duration-200 hover:bg-white/5"
            style={
              {
                color: 'rgba(245,239,230,0.65)',
                border: '1px solid rgba(245,239,230,0.12)',
              } as React.CSSProperties
            }
          >
            أو احجز عرضاً توضيحياً
          </BookingButton>
        </div>

        {/* Trust line */}
        <p className="mt-10" style={{ color: 'rgba(245,239,230,0.28)', fontSize: 13 }}>
          ٣٤+ عيادة تثق بعَودة · لا عقود · إلغاء في أي وقت
        </p>
      </div>
    </section>
  )
}
