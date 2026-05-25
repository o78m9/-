'use client'
import Link from 'next/link'
import { BookingButton } from '@/components/BookingButton'
import { ArrowEnd } from '@/components/icons/Arrow'

function BrowserMockup() {
  const bars = [28, 42, 35, 58, 52, 68, 62, 80, 76, 100]
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        boxShadow: '0 24px 48px rgba(0,0,0,0.10), 0 0 0 1px #E7E5E4',
        transform: 'rotate(1.5deg)',
      }}
    >
      <div className="bg-stone-100 border-b border-stone-200 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-stone-300" />
          <div className="w-3 h-3 rounded-full bg-stone-300" />
          <div className="w-3 h-3 rounded-full bg-stone-300" />
        </div>
        <div className="flex-1 bg-stone-200 rounded h-5 max-w-[200px]" />
      </div>

      <div className="bg-[#FAFAF9] p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-700" />
            <span className="text-[13px] font-bold text-teal-700">عَودة</span>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-2 rounded bg-stone-200" />
            <div className="w-10 h-2 rounded bg-stone-200" />
            <div className="w-10 h-2 rounded bg-stone-200" />
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 mb-3" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <p className="text-[9px] text-stone-400 uppercase tracking-[0.05em] mb-3">الإيرادات المسترجعة</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[34px] font-bold text-amber-700 leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>8,400</span>
            <span className="text-[16px] text-stone-400 font-medium">ر.س</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] text-green-700 font-medium">+23%</span>
            <span className="text-[11px] text-stone-400">مقارنة بالشهر السابق</span>
          </div>
          <div className="flex items-end gap-1 h-10">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === bars.length - 1 ? '#0F766E' : '#F0FDFA',
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { n: '247', l: 'إجمالي العملاء' },
            { n: '89', l: 'نشطون' },
            { n: '12', l: 'مواعيد' },
          ].map(({ n, l }) => (
            <div key={l} className="bg-white border border-stone-200 rounded-lg p-3" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              <p className="text-[8px] text-stone-400 uppercase tracking-[0.05em] mb-1.5">{l}</p>
              <p className="text-[18px] font-bold text-stone-950 leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>{n}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5 mt-3">
          {[
            { l: 'VIP', c: 'bg-amber-50 text-amber-700 border-amber-200' },
            { l: 'نشطون', c: 'bg-teal-50 text-teal-700 border-teal-200' },
            { l: 'خاملون', c: 'bg-stone-100 text-stone-600 border-stone-200' },
          ].map(({ l, c }) => (
            <span key={l} className={`text-[8px] font-medium px-2 py-0.5 rounded-full border ${c}`}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="pt-28 pb-20 px-8">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 items-center">

          {/* Text */}
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.05em] text-teal-700 mb-6">
              نظام ذكي لعيادات الأسنان
            </p>

            <h1 className="text-[56px] font-bold text-stone-950 leading-[1.08] tracking-tight mb-6" style={{ maxWidth: 580 }}>
              أعد عملاءك المفقودين قبل ما يروحوا لعيادة ثانية
            </h1>

            <p className="text-[18px] text-stone-600 leading-[1.65] mb-8" style={{ maxWidth: 500 }}>
              نظام يستخدم Claude AI ليكتشف عملاءك الخاملين ويرسلهم رسائل WhatsApp شخصية تجلبهم لحجز موعد جديد. ما تدفع شي للنتائج — نأخذ نسبة فقط مما نسترجعه.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <BookingButton
                source="hero"
                className="inline-flex items-center h-12 px-6 rounded-lg bg-teal-700 text-white text-[16px] font-medium hover:bg-teal-800 transition-colors"
              >
                احجز عرض توضيحي
              </BookingButton>
              <a
                href="#how"
                className="inline-flex items-center gap-2 text-[15px] font-medium text-teal-700 hover:text-teal-800 transition-colors"
              >
                شاهد كيف يعمل
                <ArrowEnd className="w-4 h-4" />
              </a>
            </div>

            <p className="text-[13px] text-stone-400">
              موثوق من <span className="text-stone-600 font-medium">12+ عيادة</span> في السعودية والأردن
            </p>
          </div>

          {/* Mockup */}
          <div className="hidden lg:block">
            <BrowserMockup />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden lg:flex justify-center mt-14">
          <div className="flex flex-col items-center gap-1.5 animate-bounce" aria-hidden="true">
            <div className="w-px h-8 bg-stone-300 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
          </div>
        </div>
      </div>
    </section>
  )
}
