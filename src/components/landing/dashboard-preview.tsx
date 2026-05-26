'use client'

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ProductMockup = dynamic(
  () => import('./product-mockup').then((m) => ({ default: m.ProductMockup })),
  {
    ssr: false,
    loading: () => <div className="w-full aspect-[4/3] rounded-2xl bg-white/5 animate-pulse" />,
  },
)

const CALLOUTS = [
  {
    top: '18%',
    title: 'الإيرادات المسترجعة',
    desc: '8,400 ر.س محصّلة خلال 30 يوماً',
  },
  {
    top: '40%',
    title: 'معدل الاستجابة',
    desc: '34% من العملاء يردون ويحجزون',
  },
  {
    top: '62%',
    title: 'تصنيف ذكي تلقائي',
    desc: 'Claude يصنّف كل عميل حسب قيمته',
  },
  {
    top: '82%',
    title: 'تتبع لحظي للنتائج',
    desc: 'كل رسالة وكل رد يظهر فوراً',
  },
]

export function DashboardPreview() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('callouts-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="py-24 px-6 overflow-hidden"
      style={{ background: '#0A1F1C' }}
      aria-labelledby="dashboard-heading"
    >
      <div className="max-w-content mx-auto">
        {/* Section label */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4A9689] mb-4">
          لوحة التحكم
        </p>
        <h2
          id="dashboard-heading"
          className="font-bold text-white mb-16"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          كل شي في مكان واحد
        </h2>

        {/* Two-column layout — RTL: callouts on start (right), mockup on end (left) */}
        <div
          ref={sectionRef}
          className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-0 items-center relative"
        >
          {/* Callout labels — right column in RTL */}
          <div className="relative order-2 lg:order-1 lg:pe-12">
            {CALLOUTS.map(({ title, desc }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 mb-8 last:mb-0"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full bg-[#4A9689] mt-2 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-white font-semibold text-[15px] mb-0.5">{title}</p>
                  <p className="text-white/50 text-[13px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SVG connecting lines */}
          <svg
            className="hidden lg:block absolute inset-0 pointer-events-none"
            viewBox="0 0 800 480"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
            style={{ width: '100%', height: '100%' }}
          >
            {[
              'M 265,88  C 340,88  380,105 420,118',
              'M 265,195 C 345,195 380,195 420,208',
              'M 265,298 C 345,298 385,282 420,278',
              'M 265,394 C 350,394 390,358 420,348',
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                className="callout-line"
                stroke="rgba(74,150,137,0.35)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Mockup — left column in RTL */}
          <div className="order-1 lg:order-2 lg:ps-12 opacity-90">
            <ProductMockup scale="large" />
          </div>
        </div>
      </div>
    </section>
  )
}
