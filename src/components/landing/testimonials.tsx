// TODO: replace with real testimonials before public launch.
// Coordinate with founder to get written consent from current pilot clinics.

const TESTIMONIALS = [
  {
    quote: 'خلال الشهر الأول، رجع 38 مريض ما كانوا حاجزين من 6 شهور. الفرق إنه ما كنت أعرف إنهم "مفقودين" أصلاً.',
    metric: '+38 مريض',
    metricLabel: 'خلال 30 يوم',
    author: 'د. أحمد',
    role: 'صاحب عيادة أسنان',
    location: 'الرياض',
    initials: 'أح',
    color: '#0F766E',
    bg: '#F0FDFA',
  },
  {
    quote: 'اللي عجبني إنه ما بدفع شي إلا لما يرجع المريض فعلاً ويحجز. أول مرة أشوف نموذج عادل بهذا الشكل بقطاعنا.',
    metric: '12,400 ريال',
    metricLabel: 'إيراد إضافي بشهرين',
    author: 'د. ليلى',
    role: 'مديرة عيادة تجميل',
    location: 'جدة',
    initials: 'لي',
    color: '#B45309',
    bg: '#FFFBEB',
  },
  {
    quote: 'الرسائل اللي بيكتبها النظام حقيقية وشخصية، مش "عميلنا العزيز...". هاد اللي خلى المعدل عالي عندنا.',
    metric: '34%',
    metricLabel: 'معدل الرد على الرسائل',
    author: 'د. خالد',
    role: 'طبيب أسنان',
    location: 'عمّان',
    initials: 'خا',
    color: '#15803D',
    bg: '#F0FDF4',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-content mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-[40px] font-semibold text-stone-950 tracking-tight mb-3">
            ثقة من أصحاب العيادات اللي جرّبونا
          </h2>
          <p className="text-[18px] text-stone-500">نتائج فعلية، خلال أول 60 يوم</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="flex flex-col p-7 rounded-2xl"
              style={{
                border: '1px solid #E7E5E4',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                background: '#FFFFFF',
              }}
            >
              {/* Big metric */}
              <div className="mb-5">
                <p
                  className="font-bold leading-none mb-1"
                  style={{
                    fontSize: 36,
                    color: t.color,
                    fontFamily: 'var(--font-inter)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {t.metric}
                </p>
                <p className="text-[13px] text-stone-400 font-medium">{t.metricLabel}</p>
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-[15px] text-stone-700 leading-[1.7] mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0"
                  style={{ background: t.bg, color: t.color }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-stone-900">{t.author}</p>
                  <p className="text-[12px] text-stone-400">{t.role} — {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
