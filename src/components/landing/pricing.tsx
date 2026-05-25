'use client'
import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { BookingButton } from '@/components/BookingButton'
import { formatPrice, CURRENCIES, PLANS_BASE_JOD, type CurrencyKey } from '@/lib/pricing'
import { cn } from '@/lib/utils'

type PlanId = 'pro' | 'growth' | 'trial'

interface Plan {
  id: PlanId
  badge: string
  priceKey: keyof typeof PLANS_BASE_JOD
  period: string
  periodNote?: string
  featured: boolean
  features: string[]
  cta: string
  ctaType: 'booking' | 'dashboard'
}

const PLANS: Plan[] = [
  {
    id: 'pro',
    badge: 'احترافي',
    priceKey: 'pro',
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
    ctaType: 'booking',
  },
  {
    id: 'growth',
    badge: 'نمو',
    priceKey: 'growth',
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
    ctaType: 'dashboard',
  },
  {
    id: 'trial',
    badge: 'تجربة',
    priceKey: 'trial',
    period: 'رسوم شهرية',
    periodNote: 'بدلاً منها: 20% فقط من كل ريال نسترجعه لك',
    featured: false,
    features: [
      'شهر كامل بدون رسوم ثابتة',
      'بناء قاعدة بيانات عملاءك',
      'أول حملة AI مجانية',
      'ادفع 20% من المسترجع فقط',
      'دعم عبر WhatsApp',
    ],
    cta: 'ابدأ التجربة',
    ctaType: 'dashboard',
  },
]

const CURRENCY_LABELS: { key: CurrencyKey; label: string }[] = [
  { key: 'SAR', label: 'ر.س' },
  { key: 'JOD', label: 'د.أ' },
  { key: 'AED', label: 'د.إ' },
]

export function PricingSection() {
  const [currency, setCurrency] = useState<CurrencyKey>('SAR')

  useEffect(() => {
    const stored = localStorage.getItem('aooda-currency') as CurrencyKey | null
    if (stored && stored in CURRENCIES) setCurrency(stored)
  }, [])

  function changeCurrency(c: CurrencyKey) {
    setCurrency(c)
    localStorage.setItem('aooda-currency', c)
  }

  return (
    <section id="pricing" className="py-24 px-8">
      <div className="max-w-content mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[40px] font-semibold text-stone-950 tracking-tight mb-4">
            أسعار شفافة. ادفع فقط من اللي بنرجعه
          </h2>
          <p className="text-[18px] text-stone-600 mb-6">بدون عقود طويلة. بدون مفاجآت.</p>

          {/* Currency switcher */}
          <div className="inline-flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            {CURRENCY_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => changeCurrency(key)}
                className={cn(
                  'px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                  currency === key
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} currency={currency} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PlanCard({ plan, currency }: { plan: Plan; currency: CurrencyKey }) {
  const baseAmount = PLANS_BASE_JOD[plan.priceKey]
  const isTrialFree = plan.id === 'trial'
  const displayPrice = isTrialFree ? '0' : formatPrice(baseAmount, currency)

  return (
    <div
      className="relative bg-white rounded-xl p-8 flex flex-col"
      style={{
        border: plan.featured ? '2px solid #0F766E' : '1px solid #E7E5E4',
        boxShadow: plan.featured
          ? '0 4px 24px rgba(15,118,110,0.10), 0 1px 3px rgba(0,0,0,0.04)'
          : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {plan.featured && (
        <div className="absolute -top-3 end-8">
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
            style={{ fontSize: 48, fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-inter)' }}
          >
            {displayPrice}
          </span>
          {!isTrialFree && (
            <span className="text-[16px] text-stone-400 font-medium">{CURRENCIES[currency].symbol}</span>
          )}
        </div>
        <p className="text-[14px] text-stone-500 mt-1">{plan.period}</p>
        {plan.periodNote && (
          <p className="text-[12px] text-teal-700 font-medium mt-2 leading-snug">{plan.periodNote}</p>
        )}
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
      {plan.ctaType === 'booking' ? (
        <BookingButton
          source="pricing-pro"
          className={cn(
            'inline-flex items-center justify-center h-11 px-5 rounded-lg text-[14px] font-medium transition-colors',
            plan.featured
              ? 'bg-teal-700 text-white hover:bg-teal-800'
              : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
          )}
        >
          {plan.cta}
        </BookingButton>
      ) : (
        <a
          href="/dashboard"
          className={cn(
            'inline-flex items-center justify-center h-11 px-5 rounded-lg text-[14px] font-medium transition-colors',
            plan.featured
              ? 'bg-teal-700 text-white hover:bg-teal-800'
              : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
          )}
        >
          {plan.cta}
        </a>
      )}
    </div>
  )
}
