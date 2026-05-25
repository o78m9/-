import Link from 'next/link'
import { Check } from 'lucide-react'

const PLANS = [
  {
    id: 'trial',
    badge: 'تجربة',
    price: 'مجاناً',
    period: 'لأول شهر',
    featured: false,
    features: [
      'شهر كامل بدون رسوم ثابتة',
      'بناء قاعدة بيانات عملاءك',
      'أول حملة AI مجانية',
      'ادفع 20% من المسترجع فقط',
      'دعم عبر WhatsApp',
    ],
    cta: 'ابدأ التجربة',
    ctaStyle: 'outline' as const,
  },
  {
    id: 'growth',
    badge: 'نمو',
    price: '250',
    period: '/شهر + 20% من المسترجع',
    featured: true,
    features: [
      'حملات غير محدودة',
      'تقارير تفصيلية شهرية',
      'تصنيف تلقائي للعملاء',
      'رسائل مخصصة بـ Claude AI',
      'متابعة المواعيد تلقائياً',
      'دعم أولوية',
    ],
    cta: 'اختر نمو',
    ctaStyle: 'filled' as const,
  },
  {
    id: 'pro',
    badge: 'احترافي',
    price: '500',
    period: '/شهر + 15% من المسترجع',
    featured: false,
    features: [
      'كل ميزات نمو',
      'حملات متعددة بالتوازي',
      'API مخصص للتكامل',
      'مدير حساب مخصص',
      'تقارير مخصصة',
    ],
    cta: 'تواصل معنا',
    ctaStyle: 'outline' as const,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-8">
      <div className="max-w-content mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[40px] font-semibold text-stone-950 tracking-tight mb-4">
            أسعار شفافة. ادفع فقط من اللي بنرجعه
          </h2>
          <p className="text-[18px] text-stone-600">بدون عقود طويلة. بدون مفاجآت.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="relative bg-white rounded-xl p-8 flex flex-col"
              style={{
                border: plan.featured ? '2px solid #0F766E' : '1px solid #E7E5E4',
                boxShadow: plan.featured
                  ? '0 4px 24px rgba(15,118,110,0.10), 0 1px 3px rgba(0,0,0,0.04)'
                  : '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {plan.featured && (
                <div className="absolute -top-3 right-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-teal-700 text-white text-[12px] font-medium">
                    موصى به
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <p className="text-[12px] font-medium uppercase tracking-[0.05em] text-stone-400 mb-4">
                  {plan.badge}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-bold text-stone-950 leading-none"
                    style={{ fontSize: plan.price === 'مجاناً' ? 40 : 48, fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-inter)' }}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== 'مجاناً' && (
                    <span className="text-[16px] text-stone-400 font-medium">د.أ</span>
                  )}
                </div>
                <p className="text-[14px] text-stone-500 mt-1">{plan.period}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={14} className="text-teal-700 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-[14px] text-stone-600">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/dashboard"
                className={`inline-flex items-center justify-center h-11 px-5 rounded-lg text-[14px] font-medium transition-colors ${
                  plan.ctaStyle === 'filled'
                    ? 'bg-teal-700 text-white hover:bg-teal-800'
                    : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
