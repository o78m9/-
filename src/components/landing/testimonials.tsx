'use client'

import { motion } from 'framer-motion'
import { SectionGlow } from '@/components/ui/section-bg'
import { BookingButton } from '@/components/BookingButton'

/**
 * Pre-launch honest state.
 * TODO(brand): once we have signed pilot clinics with named permission,
 * replace this block with real, attributed testimonials (clinic name + role + city).
 * No fabricated names, no AI faces, no stock photos until then.
 */
export function TestimonialsSection() {
  return (
    <section
      className="relative overflow-hidden py-20 px-6 bg-cream"
      aria-labelledby="testimonials-heading"
    >
      <SectionGlow color="gold" position="top-right" size={700} opacity={0.04} />
      <SectionGlow color="sage" position="bottom-left" size={600} opacity={0.035} />

      {/* Decorative quote mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-8 end-8 leading-none font-fraunces text-fluid-6xl"
        style={{
          color: '#D4A574',
          opacity: 0.04,
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        ❞
      </div>

      <div className="max-w-content mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          dir="rtl"
        >
          <span className="inline-flex items-center mb-4 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase bg-copper/9 text-copper dark:text-gold-300 border border-copper/18 dark:border-gold-500/20">
            مرحلة الإطلاق التجريبي
          </span>
          <h2 id="testimonials-heading" className="font-sans font-bold text-ink text-fluid-4xl">
            شهادات حقيقية — قريباً
          </h2>
        </motion.div>

        {/* Pre-launch honest block */}
        <motion.div
          className="rounded-2xl p-10 md:p-14 bg-paper border border-line shadow-e1 dark:shadow-none relative overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          dir="rtl"
        >
          {/* Top accent line */}
          <div
            aria-hidden="true"
            className="absolute top-0 start-0 end-0 h-1"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(212,165,116,0.5), transparent)',
            }}
          />

          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="flex-1">
              <p className="text-ink text-[18px] md:text-[20px] leading-[1.75] font-medium mb-4">
                نحن في مرحلة الإطلاق التجريبي.
              </p>
              <p className="text-mute text-[16px] leading-[1.8] max-w-[52ch]">
                بدل ما نعرض شهادات غير موثّقة، نفضّل تشوف عَودة مباشرةً وتتحدث مع عيادة الإطلاق عبر
                الديمو. شهاداتنا الأولى راح تُنشر بأسماء وروابط حقيقية بعد إكمال أول دورة استرداد.
              </p>
            </div>

            <div className="flex-shrink-0 flex flex-col items-start gap-3">
              <BookingButton source="final-cta" className="hero-cta-primary">
                احجز ديمو
              </BookingButton>
              <span className="text-[12px] text-mute">١٥ دقيقة — بدون التزام</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom transparency note */}
        <motion.p
          className="mt-8 text-center text-mute text-[13px] max-w-[60ch] mx-auto leading-[1.7]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          dir="rtl"
        >
          سياستنا: لا ننشر شهادة بدون اسم العيادة وموافقة كتابية من صاحبها.
        </motion.p>
      </div>
    </section>
  )
}
