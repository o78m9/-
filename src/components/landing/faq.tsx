'use client'

import { useState } from 'react'
import { SectionNumber } from '@/components/ui/section-number'
import { SectionGlow } from '@/components/ui/section-bg'

const FAQS = [
  {
    q: 'كيف تعرف عَودة أي عميل "خامل"؟',
    a: 'نحدد الخمول بناءً على آخر زيارة للعيادة. أي عميل لم يزر خلال فترة تحددها أنت (عادةً ٣–٦ أشهر) يُصنَّف خاملاً ويدخل قائمة الاسترداد تلقائياً.',
  },
  {
    q: 'هل تحتاج تشارك بيانات مرضاك الطبية؟',
    a: 'لا. نستخدم فقط الاسم، رقم الهاتف، وتاريخ آخر زيارة. لا نطلب أي بيانات طبية. كل شيء مشفر ومخزن بشكل آمن ولا يُشارك مع أي طرف ثالث.',
  },
  {
    q: 'كيف يكتب Claude الرسائل؟',
    a: 'Claude يحلل تاريخ العميل وتصنيفه ثم يكتب رسالة شخصية بالعربية الخليجية أو العامية المناسبة للمنطقة. تراجع النماذج قبل الإرسال وتعدّل أي شيء.',
  },
  {
    q: 'ماذا لو ما رجع أي عميل؟',
    a: 'في خطة "نسبة من المسترجع" لا تدفع شيئاً على الإطلاق. مصلحتنا مرتبطة مباشرةً بنتائجك — إذا لم يرجع أحد، لا نأخذ شيئاً.',
  },
  {
    q: 'كم يستغرق الإعداد؟',
    a: 'الإعداد الأساسي يستغرق أقل من ٣٠ دقيقة. ترفع ملف بيانات عملائك، تختار إعدادات الحملة، تعتمد الرسائل — ونتولى الباقي.',
  },
  {
    q: 'هل الخدمة متاحة خارج السعودية؟',
    a: 'نعم، نعمل حالياً في السعودية والأردن والإمارات. نخطط للتوسع لباقي الدول العربية قريباً.',
  },
] as const

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-32 px-6"
      style={{ background: 'var(--paper)' }}
      aria-labelledby="faq-heading"
    >
      <SectionGlow color="sage" position="top-left" size={600} opacity={0.04} />
      <SectionGlow color="gold" position="bottom-right" size={500} opacity={0.035} />

      {/* Huge decorative quote mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-8 end-8 leading-none"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(10rem, 20vw, 18rem)',
          color: '#D4A574',
          opacity: 0.045,
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        ؟
      </div>

      <div className="max-w-content mx-auto relative z-10">
        <SectionNumber n={6} label="الأسئلة الشائعة" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24 items-start">
          {/* Left/End column (RTL: visually left) — decorative illustration */}
          <div
            className="hidden lg:flex flex-col items-center justify-center"
            aria-hidden="true"
            dir="rtl"
          >
            <div className="relative">
              {/* Central icon */}
              <div
                className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(31,61,54,0.12), rgba(31,61,54,0.06))',
                  border: '1px solid rgba(31,61,54,0.14)',
                  boxShadow: '0 8px 32px rgba(31,61,54,0.08)',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <circle cx="24" cy="24" r="20" stroke="rgba(31,61,54,0.4)" strokeWidth="1.5" />
                  <path
                    d="M24 14v12M24 32v2"
                    stroke="#1F3D36"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Floating badges */}
              {[
                { label: 'لا عقود طويلة', top: 0, delay: '0s' },
                { label: 'بيانات آمنة ١٠٠٪', top: 120, delay: '1.5s' },
                { label: 'دعم بالعربية', top: 240, delay: '0.8s' },
              ].map(({ label, top, delay }) => (
                <div
                  key={label}
                  className="absolute start-full ms-6 float-slow"
                  style={{ top, animationDelay: delay }}
                >
                  <div
                    className="whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-medium"
                    style={{
                      background: 'var(--paper)',
                      border: '1px solid var(--line)',
                      color: '#4A6B5C',
                      boxShadow: '0 2px 8px rgba(26,24,21,0.06)',
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <p
              className="mt-16 text-center"
              style={{ color: '#9A9089', fontSize: 13, maxWidth: '24ch' }}
            >
              هل عندك سؤال ما وجدته هنا؟{' '}
              <a
                href="#cta"
                className="underline underline-offset-2 text-copper hover:text-rust transition-colors"
              >
                تواصل معنا
              </a>
            </p>
          </div>

          {/* Right/Start column (RTL: visually right) — accordion */}
          <div>
            <h2
              id="faq-heading"
              className="font-sans font-bold text-ink mb-12"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
              }}
              dir="rtl"
            >
              أسئلة يسألها أصحاب العيادات
            </h2>

            <div className="space-y-3" dir="rtl">
              {FAQS.map(({ q, a }, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden transition-shadow duration-200"
                  style={{
                    background: open === i ? 'var(--paper)' : 'rgba(245,241,232,0.5)',
                    border:
                      open === i ? '1px solid rgba(184,116,61,0.18)' : '1px solid var(--line)',
                    boxShadow: open === i ? '0 4px 16px rgba(26,24,21,0.06)' : 'none',
                  }}
                >
                  <button
                    className="w-full flex items-start justify-between px-6 py-5 text-start group"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                    aria-controls={`faq-${i}`}
                    id={`faq-btn-${i}`}
                  >
                    <span
                      className="font-sans font-medium text-ink group-hover:text-forest transition-colors duration-150 pe-6"
                      style={{ fontSize: 16, lineHeight: 1.45 }}
                    >
                      {q}
                    </span>
                    <span
                      className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200 mt-0.5"
                      style={{
                        background: open === i ? 'rgba(31,61,54,0.1)' : 'transparent',
                        border:
                          open === i ? '1px solid rgba(31,61,54,0.2)' : '1px solid var(--line)',
                        color: open === i ? '#1F3D36' : '#9A9089',
                      }}
                      aria-hidden="true"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        className={`transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}
                      >
                        <line
                          x1="5"
                          y1="0"
                          x2="5"
                          y2="10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="0"
                          y1="5"
                          x2="10"
                          y2="5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    id={`faq-${i}`}
                    className={`faq-body${open === i ? ' open' : ''}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                  >
                    <div>
                      <p
                        className="px-6 pb-6 text-mute leading-[1.8]"
                        style={{ fontSize: 15, maxWidth: '56ch' }}
                      >
                        {a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
