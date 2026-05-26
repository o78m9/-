import { BookingButton } from '@/components/BookingButton'

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-36 px-6"
      style={{ background: 'var(--forest)' }}
      aria-labelledby="cta-heading"
      id="cta"
    >
      {/* Watermark */}
      <div
        className="pointer-events-none select-none absolute bottom-0 end-[-4%] font-fraunces text-cream leading-none"
        style={{ fontSize: 'clamp(220px, 30vw, 400px)', opacity: 0.05, zIndex: 0 }}
        aria-hidden="true"
      >
        عَودة
      </div>

      <div className="max-w-content mx-auto text-center relative z-10">
        {/* Eyebrow */}
        <p className="text-[12px] font-[500] tracking-[0.14em] uppercase text-cream/50 mb-6">
          جاهز ترجّع عملاءك؟
        </p>

        {/* Headline */}
        <h2
          id="cta-heading"
          className="font-sans font-[700] text-cream mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            maxWidth: '18ch',
            marginInline: 'auto',
          }}
        >
          ابدأ اليوم — ما تدفع شيئاً حتى نثبت نتائجنا
        </h2>

        <p
          className="text-cream/60 mb-12 mx-auto"
          style={{ fontSize: 18, maxWidth: '44ch', lineHeight: 1.65 }}
        >
          إعداد كامل خلال ٣٠ دقيقة. أول ٣٠ يوماً على حسابنا. إذا ما رجع أحد — لا فاتورة.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <BookingButton
            source="final-cta"
            className="inline-flex items-center h-[52px] px-9 rounded-full bg-cream text-forest text-[16px] font-[600] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-150 active:translate-y-0"
          >
            ابدأ تجريباً مجانياً
          </BookingButton>

          <BookingButton
            source="final-cta-secondary"
            className="inline-flex items-center gap-2 text-[15px] font-[500] text-cream/70 hover:text-cream transition-colors duration-150 underline underline-offset-4 decoration-1 decoration-cream/25"
          >
            أو احجز عرضاً توضيحياً
          </BookingButton>
        </div>
      </div>
    </section>
  )
}
