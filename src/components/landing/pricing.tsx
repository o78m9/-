import { SectionNumber } from '@/components/ui/section-number'
import { BookingButton } from '@/components/BookingButton'
import { FadeIn } from '@/components/ui/fade-in'

const PLANS = [
  {
    source: 'pricing-revenue' as const,
    name: 'نسبة من المسترجع',
    tagline: 'الأنسب لمعظم العيادات',
    price: '٢٠٪',
    priceSub: 'من الإيرادات المسترجعة فقط',
    description: 'ما تدفع شيئاً مسبقاً. مصلحتنا مرتبطة مباشرةً بنتائجك.',
    features: [
      'رسائل WhatsApp شخصية بـClaude AI',
      'تصنيف عملاء تلقائي · VIP نشط خامل',
      'لوحة تحكم مع تتبع الإيرادات لحظياً',
      'دعم بالعربية ٢٤/٧',
      'تقرير شهري تفصيلي',
    ],
    cta: 'ابدأ مجاناً',
    featured: true,
  },
  {
    source: 'pricing-subscription' as const,
    name: 'اشتراك شهري ثابت',
    tagline: 'للعيادات ذات الحجم العالي',
    price: '٤٩٩',
    priceSub: 'ر.س / شهر',
    description: 'تكلفة ثابتة ومتوقعة — مناسب للعيادات التي تعالج عدداً كبيراً من المرضى.',
    features: [
      'كل مزايا خطة النسبة',
      'عدد عملاء غير محدود',
      'API مخصص للتكامل مع نظامك',
      'مدير حساب مخصص',
      'SLA بوقت استجابة مضمون',
    ],
    cta: 'احجز عرض توضيحي',
    featured: false,
  },
] as const

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-28 px-6"
      style={{ background: 'var(--paper)' }}
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-content mx-auto">
        <SectionNumber n={5} label="التسعير" />

        <FadeIn>
          <h2
            id="pricing-heading"
            className="font-sans font-[700] text-ink mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
            }}
          >
            كيف نحاسب
          </h2>
          <p
            className="text-mute mb-16"
            style={{ fontSize: 18, maxWidth: '44ch', lineHeight: 1.65 }}
          >
            نموذج الدفع على النتائج يعني أن مصلحتنا متوافقة تماماً مع مصلحتك.
          </p>
        </FadeIn>

        {/* Two-column editorial comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl" style={{ gap: 0 }}>
          {PLANS.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 80}>
              <div
                className={`flex flex-col h-full p-8 ${
                  i === 0 ? 'md:border-e border-b md:border-b-0 border-line' : ''
                }`}
              >
                {/* Tag */}
                {plan.featured && (
                  <div className="mb-4">
                    <span
                      className="text-[10px] font-[600] tracking-[0.08em] uppercase text-copper"
                      style={{
                        background: 'rgba(184,116,61,0.12)',
                        padding: '3px 10px',
                        borderRadius: 999,
                        border: '1px solid rgba(184,116,61,0.25)',
                      }}
                    >
                      موصى به
                    </span>
                  </div>
                )}

                <h3
                  className="font-sans font-[700] text-ink mb-1"
                  style={{ fontSize: 18, letterSpacing: '-0.02em' }}
                >
                  {plan.name}
                </h3>
                <p className="text-[13px] text-mute mb-6">{plan.tagline}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="font-fraunces font-[600] text-copper leading-none"
                    style={{
                      fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                      letterSpacing: '-0.02em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {plan.price}
                  </span>
                </div>
                <p className="text-[13px] text-mute mb-4">{plan.priceSub}</p>
                <p className="text-mute mb-8 leading-relaxed" style={{ fontSize: 15 }}>
                  {plan.description}
                </p>

                {/* Features — dot-separated list */}
                <ul className="mb-10 flex-1 space-y-0">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 py-2 border-b border-line last:border-0 text-[14px] text-ink"
                    >
                      <span
                        className="w-1 h-1 rounded-full bg-copper mt-[7px] flex-shrink-0"
                        aria-hidden="true"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <BookingButton
                  source={plan.source}
                  className={`inline-flex items-center justify-center h-11 px-6 rounded-full border text-[14px] font-[500] transition-all duration-150 hover:-translate-y-[1px] ${
                    plan.featured
                      ? 'border-forest bg-forest text-cream hover:shadow-[0_4px_14px_rgba(31,61,54,0.3)]'
                      : 'border-line text-forest hover:border-forest'
                  }`}
                >
                  {plan.cta}
                </BookingButton>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Thin forest divider below */}
        <div className="mt-16 h-px bg-line max-w-3xl" aria-hidden="true" />
        <p className="mt-5 text-[13px] text-mute" style={{ maxWidth: '60ch' }}>
          لا عقود طويلة. لا رسوم إعداد. في خطة النسبة لا تدفع شيئاً إذا لم نُرجع أحداً — ضمان كامل.
        </p>
      </div>
    </section>
  )
}
