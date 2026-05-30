import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'عن عَودة',
  description: 'قصة عَودة — منصة AI لإعادة تفعيل عملاء العيادات.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A1F1C' }}>
      <header
        className="px-6 py-4"
        style={{
          background: '#0A1F1C',
          borderBottom: '1px solid rgba(127,181,168,0.1)',
        }}
      >
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-teal-700 group-hover:scale-110 transition-transform" />
            <span className="text-[20px] font-bold tracking-tight" style={{ color: '#D4A574' }}>
              عَودة
            </span>
          </Link>
          <Link
            href="/"
            className="text-[14px] transition-colors"
            style={{ color: '#8A9B95' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE6')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8A9B95')}
          >
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <main id="main" className="max-w-[720px] mx-auto px-6 py-12">
        <h1 className="text-[40px] font-bold tracking-tight mb-10" style={{ color: '#F5EFE6' }}>
          عَودة — وُلدنا من مشكلة حقيقية
        </h1>

        <section className="mb-10">
          <h2 className="text-[22px] font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            القصة
          </h2>
          <p className="text-[17px] leading-[1.75]" style={{ color: '#8A9B95' }}>
            العيادات الطبية في المنطقة العربية تخسر بين 30% و50% من قاعدة عملائها كل سنة — مرضى
            جايين مرة، استفادوا من الخدمة، وما رجعوا. مش لأنهم مش راضين، لأنهم ببساطة{' '}
            <strong style={{ color: '#F5EFE6' }}>نسوا</strong>.
          </p>
          <p className="text-[17px] leading-[1.75] mt-4" style={{ color: '#8A9B95' }}>
            شفنا أصحاب عيادات يقضوا ساعات على calls يدوية بدون نتيجة، أو يدفعوا لشركات تسويق ترسل
            رسائل generic ما تفرق. قلنا في طريقة أذكى.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-[22px] font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            فلسفتنا
          </h2>
          <div
            className="rounded-xl px-6 py-5"
            style={{
              background: '#142B27',
              border: '1px solid rgba(127,181,168,0.12)',
            }}
          >
            <p className="text-[17px] leading-[1.75] font-medium" style={{ color: '#F5EFE6' }}>
              ندفع مع العيادة، مش قبلها.
            </p>
            <p className="text-[15px] leading-[1.7] mt-2" style={{ color: '#7FB5A8' }}>
              بنأخذ نسبة من الإيراد اللي نرجعه فعلياً — مش من رسوم شهرية مهما كانت النتيجة. هاد
              بيخلّينا في نفس الخندق.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-[22px] font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            الفريق
          </h2>
          <p className="text-[17px] leading-[1.75]" style={{ color: '#8A9B95' }}>
            نحن فريق صغير من المهندسين والأطباء، مقرّنا الرئيسي في عمّان مع وجود تشغيلي في الرياض.
            نشتغل بـ Claude AI كنواة، مع بيانات مُؤمّنة في خوادم إقليمية.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-[22px] font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            أمان بياناتك
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: '🔒',
                title: 'تشفير كامل',
                desc: 'جميع البيانات مشفّرة أثناء النقل والتخزين (TLS 1.3 + AES-256).',
              },
              {
                icon: '🇸🇦',
                title: 'ملتزمون بـ PDPL',
                desc: 'عَودة ملتزمة بنظام حماية البيانات الشخصية (PDPL) الصادر عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) — جهة رقابية حكومية سعودية.',
              },
              {
                icon: '🛡️',
                title: 'ملكيتك الكاملة',
                desc: 'بيانات مرضاك ملكك وحدك. تستلمها كاملةً عند أي طلب أو عند إلغاء الاشتراك، وتُحذف من خوادمنا خلال أسبوع.',
              },
              {
                icon: '🚫',
                title: 'لا مشاركة مع أطراف ثالثة',
                desc: 'لا نبيع بياناتك ولا نشاركها مع أي طرف خارجي بأي شكل.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl px-5 py-4"
                style={{ background: '#142B27', border: '1px solid rgba(127,181,168,0.1)' }}
              >
                <span className="text-[20px] shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-[15px] font-semibold mb-1" style={{ color: '#F5EFE6' }}>
                    {item.title}
                  </p>
                  <p className="text-[14px] leading-[1.6]" style={{ color: '#8A9B95' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-10" style={{ borderTop: '1px solid rgba(127,181,168,0.12)' }}>
          <h2 className="text-[22px] font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            نتشرّف بمحادثتك
          </h2>
          <div className="space-y-2 text-[16px]" style={{ color: '#8A9B95' }}>
            <p>
              <a
                href="mailto:founder@aooda.com"
                className="font-medium transition-colors"
                style={{ color: '#7FB5A8' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A574')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#7FB5A8')}
              >
                founder@aooda.com
              </a>{' '}
              — للشراكات والاستفسارات المباشرة.
            </p>
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 mt-8" style={{ borderTop: '1px solid rgba(127,181,168,0.1)' }}>
        <div className="max-w-[720px] mx-auto text-center text-[13px]" style={{ color: '#8A9B95' }}>
          © 2026 عَودة. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  )
}
