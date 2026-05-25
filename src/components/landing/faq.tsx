'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'كيف بشتغل النظام إذا ما عندي قاعدة بيانات؟',
    a: 'ما في مشكلة. نبدأ معك من الصفر — نضع رابط QR في عيادتك، عملاءك يسجّلون بياناتهم بأنفسهم مقابل خصم. خلال أسبوعين عندك قاعدة بيانات حقيقية.',
  },
  {
    q: 'هل بدي أعرف تقنية لاستخدامه؟',
    a: 'لا أبداً. الواجهة مصممة للطاقم الإداري في العيادة. تحمّل ملف، تختار فئة، تضغط إرسال. بس.',
  },
  {
    q: 'كيف بضمن إنه ما يطلع spam على الزباين؟',
    a: 'Claude يكتب رسالة مخصصة لكل عميل بالاسم وتاريخ آخر زيارة — مش رسالة جماعية. العميل يحس إنك بتفكر فيه شخصياً. معدل الرد عادةً 30-40%.',
  },
  {
    q: 'ايش لو ما رجّع شي في الشهر التجريبي؟',
    a: 'ما تدفع شي. الشهر الأول تجريبي مجاناً، ونسبتنا 20% فقط من المبلغ الفعلي المسترجع. إذا ما رجع شي، ما في رسوم.',
  },
  {
    q: 'متوافق مع الأحكام الشرعية؟',
    a: 'نعم. الرسائل احترافية وغير مزعجة، ومبنية على موافقة العميل المسبقة (يسجّل بياناته بإرادته). لا تسويق مضلل.',
  },
  {
    q: 'كم وقت لازم لأشوف نتائج؟',
    a: 'عادةً أول مواعيد محجوزة خلال 48-72 ساعة من إطلاق الحملة. المتوسط اللي شفناه: 8-15% من العملاء المستهدفين يحجزون.',
  },
  {
    q: 'بيشتغل لعيادات غير عيادات الأسنان؟',
    a: 'نعم. جرّبناه مع عيادات تجميلية وعيامات علاج طبيعي. النظام يتكيّف مع أي عيادة فيها زبائن متكررين.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-stone-100 px-8">
      <div className="max-w-[720px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[40px] font-semibold text-stone-950 tracking-tight">
            أسئلة قبل ما تبدأ
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-right"
              >
                <span className="text-[15px] font-medium text-stone-950">{faq.q}</span>
                <span className="shrink-0 mr-4 text-stone-400">
                  {open === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200 ease-out',
                  open === i ? 'max-h-64' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-5 text-[15px] text-stone-600 leading-[1.65]">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
