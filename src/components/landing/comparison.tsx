import { Check, X } from 'lucide-react'

const ROWS = [
  { metric: 'الوقت اليومي', without: '3 ساعات calls يدوية', with: '15 دقيقة مراجعة' },
  { metric: 'دقة الاستهداف', without: 'عشوائي، قائمة يدوية', with: 'AI يحدد الأولوية' },
  { metric: 'الرسائل', without: 'قوالب جاهزة، 5% رد', with: 'مخصصة، 30-40% رد' },
  { metric: 'التتبع', without: 'Excel أو لا شيء', with: 'لوحة تحكم آنية' },
  { metric: 'التكلفة', without: 'ثابتة شهرياً', with: 'نسبة من المسترجع فقط' },
]

export function ComparisonSection() {
  return (
    <section className="py-24 px-8" style={{ background: '#0A1F1C' }}>
      <div className="max-w-[860px] mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-[40px] font-semibold tracking-tight mb-3"
            style={{ color: '#F5EFE6' }}
          >
            الفرق بين عَودة والطريقة التقليدية
          </h2>
          <p className="text-[17px]" style={{ color: '#8A9B95' }}>
            نتائج موثّقة من عيادات تشبه عيادتك
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#142B27',
            border: '1px solid rgba(127,181,168,0.12)',
          }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-[1fr_1fr_1fr]"
            style={{ borderBottom: '1px solid rgba(127,181,168,0.1)' }}
          >
            <div
              className="px-6 py-4 text-[12px] font-medium uppercase tracking-[0.05em]"
              style={{ color: '#8A9B95' }}
            >
              المعيار
            </div>
            <div
              className="px-6 py-4 text-[13px] font-semibold flex items-center gap-2"
              style={{
                color: '#8A9B95',
                borderInlineStart: '1px solid rgba(127,181,168,0.08)',
              }}
            >
              <X size={14} style={{ color: '#B8743D' }} />
              بدون عَودة
            </div>
            <div
              className="px-6 py-4 text-[13px] font-semibold flex items-center gap-2"
              style={{
                color: '#D4A574',
                background: 'rgba(212,165,116,0.06)',
                borderInlineStart: '1px solid rgba(127,181,168,0.08)',
              }}
            >
              <Check size={14} style={{ color: '#D4A574' }} />
              مع عَودة
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div
              key={row.metric}
              className="grid grid-cols-[1fr_1fr_1fr]"
              style={
                i < ROWS.length - 1
                  ? { borderBottom: '1px solid rgba(127,181,168,0.08)' }
                  : undefined
              }
            >
              <div className="px-6 py-4 text-[14px] font-medium" style={{ color: '#F5EFE6' }}>
                {row.metric}
              </div>
              <div
                className="px-6 py-4 text-[14px]"
                style={{
                  color: '#8A9B95',
                  borderInlineStart: '1px solid rgba(127,181,168,0.08)',
                }}
              >
                {row.without}
              </div>
              <div
                className="px-6 py-4 text-[14px] font-medium"
                style={{
                  color: '#D4A574',
                  background: 'rgba(212,165,116,0.06)',
                  borderInlineStart: '1px solid rgba(127,181,168,0.08)',
                }}
              >
                {row.with}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
