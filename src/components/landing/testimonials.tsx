'use client'

import { motion } from 'framer-motion'
import { SectionGlow } from '@/components/ui/section-bg'

const TESTIMONIALS = [
  {
    quote:
      'خلال الشهر الأول، رجع ٣٨ مريض ما كانوا حاجزين من ٦ شهور. الفرق إنه ما كنت أعرف إنهم "مفقودين" أصلاً.',
    metric: '+٣٨',
    metricLabel: 'مريض رجع في ٣٠ يوم',
    author: 'د. أحمد',
    role: 'عيادة أسنان',
    location: 'الرياض',
    initials: 'أح',
  },
  {
    quote:
      'اللي عجبني إنه ما بدفع شي إلا لما يرجع المريض فعلاً. أول مرة أشوف نموذج عادل بهذا الشكل.',
    metric: '١٢٬٤٠٠',
    metricLabel: 'ريال إيراد إضافي بشهرين',
    author: 'د. ليلى',
    role: 'مديرة عيادة تجميل',
    location: 'جدة',
    initials: 'لي',
  },
  {
    quote:
      'الرسائل اللي يكتبها النظام حقيقية وشخصية — مش "عميلنا العزيز". هاد اللي خلى معدل الرد عالي.',
    metric: '٣٤٪',
    metricLabel: 'معدل الرد على الرسائل',
    author: 'د. خالد',
    role: 'طبيب أسنان',
    location: 'عمّان',
    initials: 'خا',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
}

export function TestimonialsSection() {
  return (
    <section
      className="relative overflow-hidden py-20 px-6"
      style={{ background: 'var(--cream)' }}
      aria-labelledby="testimonials-heading"
    >
      <SectionGlow color="gold" position="top-right" size={700} opacity={0.04} />
      <SectionGlow color="sage" position="bottom-left" size={600} opacity={0.035} />

      {/* Decorative huge quote mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-8 end-8 leading-none font-fraunces"
        style={{
          fontSize: 'clamp(3.5rem, 7vw, 6rem)',
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
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          dir="rtl"
        >
          <span
            className="inline-flex items-center mb-4 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase"
            style={{
              background: 'rgba(184,116,61,0.09)',
              color: '#B8743D',
              border: '1px solid rgba(184,116,61,0.18)',
            }}
          >
            شهادات العملاء
          </span>
          <h2
            id="testimonials-heading"
            className="font-sans font-bold text-ink"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
            }}
          >
            ثقة من أصحاب العيادات
          </h2>
          <p className="mt-4 text-mute" style={{ fontSize: 17, maxWidth: '44ch' }}>
            نتائج فعلية من العيادات الأولى التي جرّبت عَودة
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          dir="rtl"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.author}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="flex flex-col rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                boxShadow: '0 2px 8px rgba(26,24,21,0.04), 0 1px 2px rgba(26,24,21,0.06)',
              }}
            >
              {/* Top glow accent */}
              <div
                aria-hidden="true"
                className="absolute top-0 start-0 end-0 h-1"
                style={{
                  background:
                    i === 1
                      ? 'linear-gradient(to right, transparent, rgba(212,165,116,0.5), transparent)'
                      : 'linear-gradient(to right, transparent, rgba(127,181,168,0.35), transparent)',
                }}
              />

              {/* Metric */}
              <div className="mb-6">
                <p
                  className="font-fraunces font-semibold text-copper leading-none mb-1"
                  style={{
                    fontSize: 40,
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {t.metric}
                </p>
                <p className="text-[12px] font-medium" style={{ color: '#6B6359' }}>
                  {t.metricLabel}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px mb-6" style={{ background: 'var(--line)' }} />

              {/* Quote */}
              <blockquote
                className="flex-1 leading-[1.75] mb-8"
                style={{ color: '#4A4440', fontSize: 15 }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                  style={{
                    background: 'rgba(31,61,54,0.1)',
                    color: '#4A4440',
                    border: '1px solid rgba(31,61,54,0.15)',
                  }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-ink" style={{ fontSize: 14 }}>
                    {t.author}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B6359' }}>
                    {t.role} — {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="mt-10 text-center"
          style={{ fontSize: 13, color: '#6B6359' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          * البيانات من أول ٦٠ يوماً لكل عيادة. النتائج قد تختلف.
        </motion.p>
      </div>
    </section>
  )
}
