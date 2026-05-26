'use client'

import { useState } from 'react'
import { SectionNumber } from '@/components/ui/section-number'

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
      className="py-28 px-6"
      style={{ background: 'var(--cream)' }}
      aria-labelledby="faq-heading"
    >
      <div className="max-w-content mx-auto">
        <SectionNumber n={6} label="الأسئلة الشائعة" />

        <h2
          id="faq-heading"
          className="font-sans font-[700] text-ink mb-16"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
          }}
        >
          أسئلة يسألها أصحاب العيادات
        </h2>

        <div className="max-w-[700px]">
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className="border-b border-line last:border-0">
              <button
                className="w-full flex items-start justify-between py-6 text-start group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-${i}`}
                id={`faq-btn-${i}`}
              >
                <span
                  className="font-sans font-[500] text-ink group-hover:text-forest transition-colors duration-150 pe-8"
                  style={{ fontSize: 18, lineHeight: 1.4 }}
                >
                  {q}
                </span>
                <span
                  className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full border border-line text-mute group-hover:border-forest group-hover:text-forest transition-all duration-150 mt-0.5"
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
                    className="pb-6 text-mute leading-[1.75]"
                    style={{ fontSize: 16, maxWidth: '56ch' }}
                  >
                    {a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
