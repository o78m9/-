import { SectionNumber } from '@/components/ui/section-number'
import { FadeIn } from '@/components/ui/fade-in'

function CsvFragment() {
  return (
    <div
      className="rounded-xl border border-line bg-paper p-4 text-start"
      style={{ maxWidth: 260 }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-line flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="#6B6359" strokeWidth="1.2" />
            <line
              x1="4"
              y1="5"
              x2="10"
              y2="5"
              stroke="#6B6359"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="7"
              x2="10"
              y2="7"
              stroke="#6B6359"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="9"
              x2="8"
              y2="9"
              stroke="#6B6359"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <div className="text-[11px] font-[500] text-ink">patients_2024.csv</div>
          <div className="text-[10px] text-mute">247 سجل · 3.2 KB</div>
        </div>
      </div>
      <div className="space-y-1.5">
        {['الاسم', 'رقم الهاتف', 'آخر زيارة'].map((col) => (
          <div key={col} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-copper flex-shrink-0" />
            <span className="text-[11px] text-mute">{col}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 w-full h-8 rounded-lg bg-forest text-cream text-[11px] font-[500]"
        tabIndex={-1}
      >
        رفع الملف
      </button>
    </div>
  )
}

function MessageFragment() {
  return (
    <div
      className="rounded-xl border border-line bg-paper p-4 text-start"
      style={{ maxWidth: 280 }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[10px] font-[600] text-[#166534]">
          ف
        </div>
        <div>
          <div className="text-[11px] font-[500] text-ink">فاطمة الزهراني</div>
          <div className="text-[10px] text-mute">VIP · آخر زيارة ٨ أشهر</div>
        </div>
        <div className="ms-auto">
          <span className="text-[9px] bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded-full font-[500]">
            مراجعة
          </span>
        </div>
      </div>
      <div className="rounded-lg bg-cream p-3 text-[11px] text-ink leading-[1.6]">
        السلام عليكم أبو فاطمة، وحشتنا 🌟 مرّت فترة منذ زيارتك الأخيرة لعيادة الابتسامة — نودّ نتأكد
        إن كل شي تمام. خصصنا لك موعد مميز هذا الأسبوع...
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-copper" />
        <span className="text-[10px] text-mute">كتبه Claude AI · ٤ ثوانٍ</span>
      </div>
    </div>
  )
}

function WhatsAppFragment() {
  return (
    <div
      className="rounded-xl border border-line bg-paper overflow-hidden text-start"
      style={{ maxWidth: 260 }}
      aria-hidden="true"
    >
      <div className="bg-forest px-4 py-2.5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-paper/20 flex items-center justify-center text-[11px] font-[700] text-cream">
          ع
        </div>
        <div>
          <div className="text-[11px] font-[600] text-cream">عَودة</div>
          <div className="text-[9px] text-cream/60">متصل الآن</div>
        </div>
      </div>
      <div className="p-3 space-y-2 bg-[#ECE5DD]">
        <div className="flex justify-end">
          <div className="max-w-[160px] bg-[#DCF8C6] rounded-[12px_4px_12px_12px] px-3 py-1.5 text-[10px] text-ink leading-[1.5]">
            السلام عليكم، وحشتنا! موعد ؟
            <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
              <span className="text-[8px]">١٠:٢٤</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="#34B7F1">
                <path
                  d="M1 4l3 3 7-7M4 4l3 3 7-7"
                  strokeWidth="1.2"
                  stroke="#34B7F1"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[160px] bg-white rounded-[4px_12px_12px_12px] px-3 py-1.5 text-[10px] text-ink leading-[1.5]">
            أهلاً! أبي أحجز موعد هذا الأسبوع 🗓
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[160px] bg-[#DCF8C6] rounded-[12px_4px_12px_12px] px-3 py-1.5 text-[10px] text-ink leading-[1.5]">
            ممتاز! الثلاثاء الساعة ٤ مناسب؟
          </div>
        </div>
      </div>
    </div>
  )
}

const STEPS = [
  {
    n: 1,
    title: 'اربط بياناتك',
    desc: 'استورد سجلات عملائك بملف CSV. نستخدم الاسم، رقم الهاتف، وتاريخ آخر زيارة فقط — لا بيانات طبية.',
    Fragment: CsvFragment,
  },
  {
    n: 2,
    title: 'Claude AI يصنّف ويكتب',
    desc: 'النموذج يحلل كل عميل ويكتب رسالة WhatsApp شخصية باللهجة المحلية — يمكنك مراجعتها قبل الإرسال.',
    Fragment: MessageFragment,
  },
  {
    n: 3,
    title: 'الردود تتحول لمواعيد',
    desc: 'كل رد ينعكس تلقائياً في لوحة التحكم. الحجوزات تُحتسب على الفور كإيرادات مسترجعة.',
    Fragment: WhatsAppFragment,
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how"
      className="py-28 px-6"
      style={{ background: 'var(--paper)' }}
      aria-labelledby="how-heading"
    >
      <div className="max-w-content mx-auto">
        <SectionNumber n={2} label="كيف يشتغل" />

        <FadeIn>
          <h2
            id="how-heading"
            className="font-sans font-[700] text-ink mb-20"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              maxWidth: '20ch',
            }}
          >
            ثلاث خطوات من البيانات إلى الإيراد
          </h2>
        </FadeIn>

        {/* Steps — vertical rows with connecting line */}
        <div className="relative">
          {/* Vertical arc line — start side (RTL: right edge) */}
          <div
            className="absolute top-0 bottom-0 start-[52px] hidden md:block"
            aria-hidden="true"
            style={{
              width: 1,
              background:
                'linear-gradient(to bottom, transparent, #1F3D36 15%, #1F3D36 85%, transparent)',
              opacity: 0.18,
            }}
          />

          <div className="space-y-0 divide-y divide-line">
            {STEPS.map(({ n, title, desc, Fragment }, i) => (
              <FadeIn key={n} delay={i * 120}>
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] items-start gap-8 py-12">
                  {/* Number */}
                  <div className="hidden md:flex items-center justify-center">
                    <span
                      className="font-fraunces font-[600] text-copper leading-none select-none"
                      style={{
                        fontSize: 80,
                        letterSpacing: '-0.04em',
                        color: 'transparent',
                        WebkitTextStroke: '1.5px #B8743D',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                      aria-hidden="true"
                    >
                      {String(n).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Text */}
                  <div>
                    <div className="flex items-center gap-3 mb-3 md:hidden">
                      <span
                        className="font-fraunces font-[600] text-copper text-[28px]"
                        style={{ letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}
                        aria-hidden="true"
                      >
                        {String(n).padStart(2, '0')}
                      </span>
                    </div>
                    <h3
                      className="font-sans font-[700] text-ink mb-3"
                      style={{ fontSize: 22, letterSpacing: '-0.02em' }}
                    >
                      {title}
                    </h3>
                    <p className="text-mute text-[16px] leading-[1.7]" style={{ maxWidth: '44ch' }}>
                      {desc}
                    </p>
                  </div>

                  {/* UI Fragment */}
                  <div className="hidden lg:block">
                    <Fragment />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
