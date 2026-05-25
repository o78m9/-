const STEPS = [
  {
    n: '01',
    title: 'اربط بياناتك',
    desc: 'استورد ملف عملاءك السابقين، أو اسمح للنظام يجمعهم تلقائياً من المكالمات والاستفسارات. أي ملف Excel أو CSV يكفي.',
  },
  {
    n: '02',
    title: 'AI يصنّف ويولّد',
    desc: 'Claude يحلل البيانات، يكتشف الخاملين، ويكتب رسالة شخصية فريدة لكل عميل — مش قالب جاهز، رسالة حقيقية.',
  },
  {
    n: '03',
    title: 'نتائج قابلة للقياس',
    desc: 'نرسل الرسائل عبر WhatsApp، نستقبل الردود، ونحجز المواعيد. كل دينار رجع موثّق ومحسوب.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how" className="py-24 bg-stone-100 px-8">
      <div className="max-w-content mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-semibold text-stone-950 tracking-tight mb-4">
            كيف يعمل النظام
          </h2>
          <p className="text-[18px] text-stone-600">
            ثلاث خطوات بسيطة من الإعداد للإيرادات
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STEPS.map((step) => (
            <div key={step.n}>
              <p
                className="font-semibold text-stone-200 mb-4 leading-none"
                style={{ fontSize: 80, fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-inter)' }}
              >
                {step.n}
              </p>
              <h3 className="text-[20px] font-semibold text-stone-950 mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[15px] text-stone-600 leading-[1.65]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
