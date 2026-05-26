'use client'

import { useEffect, useRef, useState } from 'react'
import { SectionNumber } from '@/components/ui/section-number'

const TYPING_MESSAGE =
  'السلام عليكم أبو محمد 👋 لحظنا إنه مرّت ٦ أشهر منذ آخر زيارتكم لعيادة الابتسامة. نودّ الاطمئنان عليكم وتذكيركم بأهمية الفحص الدوري — خاصةً بعد علاج التقويم. هل يناسبكم موعد هذا الأسبوع؟ 🗓'

const CUSTOMERS = [
  {
    name: 'فاطمة الزهراني',
    last: '٨ أشهر',
    seg: 'VIP',
    segStyle: { color: '#92400E', background: '#FEF3C7' },
    status: 'أُرسلت',
    statusStyle: { color: '#166534', background: '#DCFCE7' },
  },
  {
    name: 'أحمد الغامدي',
    last: '٦ أشهر',
    seg: 'نشط',
    segStyle: { color: '#166534', background: '#DCFCE7' },
    status: 'ردّ',
    statusStyle: { color: '#1F3D36', background: '#D1FAE5' },
  },
  {
    name: 'نورة السلمي',
    last: '١١ شهراً',
    seg: 'خامل',
    segStyle: { color: '#6B6359', background: '#E8DFD0' },
    status: 'جدولة',
    statusStyle: { color: '#B8743D', background: '#FEF3C7' },
  },
  {
    name: 'خالد العمري',
    last: '٧ أشهر',
    seg: 'خامل',
    segStyle: { color: '#6B6359', background: '#E8DFD0' },
    status: 'يكتب…',
    statusStyle: { color: '#6B6359', background: '#E8DFD0' },
  },
  {
    name: 'هنوف المطيري',
    last: '٩ أشهر',
    seg: 'خامل',
    segStyle: { color: '#6B6359', background: '#E8DFD0' },
    status: 'في الانتظار',
    statusStyle: { color: '#6B6359', background: '#E8DFD0' },
  },
]

function TypingMessage() {
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'clearing'>('typing')
  const idxRef = useRef(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (idxRef.current < TYPING_MESSAGE.length) {
        timer = setTimeout(() => {
          idxRef.current++
          setText(TYPING_MESSAGE.slice(0, idxRef.current))
        }, 30)
      } else {
        timer = setTimeout(() => setPhase('pausing'), 2000)
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('clearing'), 400)
    } else {
      idxRef.current = 0
      setText('')
      timer = setTimeout(() => setPhase('typing'), 600)
    }

    return () => clearTimeout(timer)
  }, [phase, text])

  return (
    <div
      className="rounded-xl bg-[#0A1F1C] border border-white/10 p-4 text-[13px] leading-[1.7]"
      style={{ minHeight: 140 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-copper animate-pulse" aria-hidden="true" />
        <span className="text-[11px] font-[500] text-cream/60 tracking-wide uppercase">
          Claude AI يكتب الآن
        </span>
      </div>
      <p className="text-cream/90 cursor-blink" aria-live="polite" aria-atomic="true">
        {text}
      </p>
    </div>
  )
}

export function LiveSystem() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('callouts-visible')
          obs.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      className="py-28 px-6 overflow-hidden"
      style={{ background: 'var(--ink)' }}
      aria-labelledby="live-heading"
    >
      <div className="max-w-content mx-auto">
        <SectionNumber n={3} label="النظام الحي" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Text column — RTL: renders on the right visually (start) */}
          <div>
            <h2
              id="live-heading"
              className="font-sans font-[700] text-cream mb-8"
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
              }}
            >
              نظام يعمل وأنت نايم
            </h2>

            <div
              className="space-y-5 text-cream/70 text-[17px] leading-[1.8]"
              style={{ maxWidth: '44ch' }}
            >
              <p>
                عَودة يراقب قاعدة عملاءك باستمرار. في اللحظة التي يتجاوز فيها عميل فترة الخمول التي
                حددتها، يُصنَّف تلقائياً ويُكتب له رسالة شخصية.
              </p>
              <p>
                لا تدخل يدوي. لا قوائم انتظار. الذكاء الاصطناعي يتعلم أسلوب عيادتك ويكتب بلهجة تناسب
                كل عميل.
              </p>
            </div>

            {/* Pull quote */}
            <blockquote className="mt-10 ps-5 border-s-2 border-copper" dir="rtl">
              <p
                className="font-fraunces font-[400] text-cream/90 leading-[1.4]"
                style={{ fontSize: 22 }}
              >
                &ldquo;أول حملة أرجعت لنا ٢٣ مريضاً خلال أسبوع — من دون ما نرفع إصبع.&rdquo;
              </p>
              <cite className="mt-3 block text-[13px] text-mute not-italic">
                د. سارة المحيسن · عيادة الابتسامة، الرياض
              </cite>
            </blockquote>
          </div>

          {/* Product view — RTL: renders on the left visually (end) */}
          <div ref={sectionRef} className="relative">
            {/* Customer list */}
            <div
              className="rounded-[16px] bg-[#0F2922] border border-white/10 overflow-hidden"
              style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)' }}
            >
              {/* List header */}
              <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <span className="text-[12px] font-[600] text-cream/80">قائمة العملاء الخاملين</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-copper/20 text-copper font-[500]">
                    ٨٩ عميل
                  </span>
                  <span className="text-[10px] text-cream/40">مرتّب بالأولوية</span>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/[0.06]">
                {CUSTOMERS.map(({ name, last, seg, segStyle, status, statusStyle }) => (
                  <div key={name} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-[600]"
                        style={{ background: 'rgba(255,255,255,0.08)', color: '#B8C9C0' }}
                        aria-hidden="true"
                      >
                        {name[0]}
                      </div>
                      <div>
                        <div className="text-[12px] font-[500] text-cream/90">{name}</div>
                        <div className="text-[10px] text-cream/40">آخر زيارة: {last}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[9px] font-[500] px-2 py-0.5 rounded-full"
                        style={segStyle}
                      >
                        {seg}
                      </span>
                      <span
                        className="text-[10px] font-[500] px-2 py-0.5 rounded-full"
                        style={statusStyle}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typing message below */}
            <div className="mt-4">
              <TypingMessage />
            </div>

            {/* Callout lines */}
            <svg
              className="hidden lg:block absolute pointer-events-none"
              style={{ top: 60, insetInlineEnd: -24, width: 28, height: 200 }}
              viewBox="0 0 28 200"
              fill="none"
              aria-hidden="true"
            >
              {[50, 100, 150].map((y, i) => (
                <path
                  key={i}
                  d={`M 0 ${y} C 14 ${y} 20 ${y} 28 ${y}`}
                  className="callout-line"
                  stroke="rgba(184,116,61,0.4)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
