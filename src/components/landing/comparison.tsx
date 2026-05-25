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
    <section className="py-24 px-8 bg-stone-100">
      <div className="max-w-[860px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[40px] font-semibold text-stone-950 tracking-tight mb-3">
            الفرق بين عَودة والطريقة التقليدية
          </h2>
          <p className="text-[17px] text-stone-500">نتائج موثّقة من عيادات تشبه عيادتك</p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E7E5E4', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-stone-100">
            <div className="px-6 py-4 text-[12px] font-medium uppercase tracking-[0.05em] text-stone-400">
              المعيار
            </div>
            <div className="px-6 py-4 border-s border-stone-100 text-[13px] font-semibold text-stone-600 flex items-center gap-2">
              <X size={14} className="text-red-400" />
              بدون عَودة
            </div>
            <div className="px-6 py-4 border-s border-stone-100 text-[13px] font-semibold text-teal-700 flex items-center gap-2 bg-teal-50/50">
              <Check size={14} className="text-teal-600" />
              مع عَودة
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div
              key={row.metric}
              className={`grid grid-cols-[1fr_1fr_1fr] ${i < ROWS.length - 1 ? 'border-b border-stone-100' : ''}`}
            >
              <div className="px-6 py-4 text-[14px] font-medium text-stone-700">
                {row.metric}
              </div>
              <div className="px-6 py-4 border-s border-stone-100 text-[14px] text-stone-500">
                {row.without}
              </div>
              <div className="px-6 py-4 border-s border-stone-100 text-[14px] text-teal-700 font-medium bg-teal-50/30">
                {row.with}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
