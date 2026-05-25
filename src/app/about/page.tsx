import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'عن عَودة',
  description: 'قصة عَودة — منصة AI لإعادة تفعيل عملاء العيادات.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-teal-700 group-hover:scale-110 transition-transform" />
            <span className="text-[20px] font-bold text-stone-950 tracking-tight">عَودة</span>
          </Link>
          <Link href="/" className="text-[14px] text-stone-500 hover:text-stone-800 transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <main id="main" className="max-w-[720px] mx-auto px-6 py-12">
        <h1 className="text-[40px] font-bold text-stone-950 tracking-tight mb-10">
          عَودة — وُلدنا من مشكلة حقيقية
        </h1>

        <section className="mb-10">
          <h2 className="text-[22px] font-semibold text-stone-950 mb-4">القصة</h2>
          <p className="text-[17px] text-stone-600 leading-[1.75]">
            العيادات الطبية في المنطقة العربية تخسر بين 30% و50% من قاعدة عملائها كل سنة — مرضى جايين مرة، استفادوا من الخدمة، وما رجعوا. مش لأنهم مش راضين، لأنهم ببساطة <strong className="text-stone-800">نسوا</strong>.
          </p>
          <p className="text-[17px] text-stone-600 leading-[1.75] mt-4">
            شفنا أصحاب عيادات يقضوا ساعات على calls يدوية بدون نتيجة، أو يدفعوا لشركات تسويق ترسل رسائل generic ما تفرق. قلنا في طريقة أذكى.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-[22px] font-semibold text-stone-950 mb-4">فلسفتنا</h2>
          <div className="bg-teal-50 border border-teal-100 rounded-xl px-6 py-5">
            <p className="text-[17px] text-teal-900 leading-[1.75] font-medium">
              ندفع مع العيادة، مش قبلها.
            </p>
            <p className="text-[15px] text-teal-700 leading-[1.7] mt-2">
              بنأخذ نسبة من الإيراد اللي نرجعه فعلياً — مش من رسوم شهرية مهما كانت النتيجة. هاد بيخلّينا في نفس الخندق.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-[22px] font-semibold text-stone-950 mb-4">الفريق</h2>
          <p className="text-[17px] text-stone-600 leading-[1.75]">
            نحن فريق صغير من المهندسين والأطباء، مقرّنا الرئيسي في عمّان مع وجود تشغيلي في الرياض. نشتغل بـ Claude AI كنواة، مع بيانات مُؤمّنة في خوادم إقليمية.
          </p>
        </section>

        <section className="border-t border-stone-200 pt-10">
          <h2 className="text-[22px] font-semibold text-stone-950 mb-4">نتشرّف بمحادثتك</h2>
          <div className="space-y-2 text-[16px] text-stone-600">
            <p>
              <a href="mailto:founder@aooda.com" className="text-teal-700 hover:text-teal-800 font-medium">
                founder@aooda.com
              </a>
              {' '}— للشراكات والاستفسارات المباشرة.
            </p>
            {/* TODO: replace with real WhatsApp number before public launch */}
            <p>
              <span className="font-medium text-stone-800">واتساب:</span> +962 7X XXX XXXX
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 px-6 py-6 mt-8">
        <div className="max-w-[720px] mx-auto text-center text-[13px] text-stone-400">
          © 2026 عَودة. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  )
}
