import type { Metadata } from 'next'
import Link from 'next/link'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'عن عَودة',
  description: 'قصة عَودة — منصة AI لإعادة تفعيل عملاء العيادات.',
  alternates: { canonical: '/about' },
}

function LockIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="#7FB5A8" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#7FB5A8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function OwnershipIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-7-4.5-7-10a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 11c0 5.5-7 10-7 10z"
        stroke="#7FB5A8"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NoShareIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#7FB5A8" strokeWidth="1.6" />
      <path d="M6 6l12 12" stroke="#7FB5A8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function PdplIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
        stroke="#7FB5A8"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 11h6M9 14h6M9 17h4" stroke="#7FB5A8" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
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
            <span className="text-fluid-lg font-bold tracking-tight" style={{ color: '#D4A574' }}>
              عَودة
            </span>
          </Link>
          <Link
            href="/"
            className="text-fluid-sm transition-colors"
            style={{ color: '#8A9B95' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE6')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8A9B95')}
          >
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <main id="main" className="max-w-[720px] mx-auto px-6 py-12">
        <h1 className="text-fluid-4xl font-bold tracking-tight mb-10" style={{ color: '#F5EFE6' }}>
          عَودة — وُلدنا من مشكلة حقيقية
        </h1>

        <section className="mb-10">
          <h2 className="text-fluid-xl font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            القصة
          </h2>
          <p className="text-fluid-base leading-[1.75]" style={{ color: '#8A9B95' }}>
            العيادات الطبية في المنطقة العربية تخسر بين 30% و50% من قاعدة عملائها كل سنة — مرضى
            جايين مرة، استفادوا من الخدمة، وما رجعوا. مش لأنهم مش راضين، لأنهم ببساطة{' '}
            <strong style={{ color: '#F5EFE6' }}>نسوا</strong>.
          </p>
          <p className="text-fluid-base leading-[1.75] mt-4" style={{ color: '#8A9B95' }}>
            شفنا أصحاب عيادات يقضوا ساعات على calls يدوية بدون نتيجة، أو يدفعوا لشركات تسويق ترسل
            رسائل generic ما تفرق. قلنا في طريقة أذكى.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-fluid-xl font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            فلسفتنا
          </h2>
          <div
            className="rounded-xl px-6 py-5 shadow-e1"
            style={{
              background: '#142B27',
              border: '1px solid rgba(127,181,168,0.12)',
            }}
          >
            <p className="text-fluid-base leading-[1.75] font-medium" style={{ color: '#F5EFE6' }}>
              ندفع مع العيادة، مش قبلها.
            </p>
            <p className="text-fluid-sm leading-[1.7] mt-2" style={{ color: '#7FB5A8' }}>
              بنأخذ نسبة من الإيراد اللي نرجعه فعلياً — مش من رسوم شهرية مهما كانت النتيجة. هاد
              بيخلّينا في نفس الخندق.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-fluid-xl font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            الفريق
          </h2>
          <p className="text-fluid-base leading-[1.75]" style={{ color: '#8A9B95' }}>
            فريق صغير من المهندسين والأطباء، مقرّنا الرئيسي في عمّان مع وجود تشغيلي في الرياض. نشتغل
            بـ Claude AI كنواة، مع بيانات مُؤمّنة في خوادم إقليمية.
          </p>
        </section>

        {/* TODO(founders): replace with real names + roles + LinkedIn URLs before public launch */}
        <section className="mb-10">
          <h2 className="text-fluid-xl font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            الفريق المؤسس
          </h2>
          <div
            className="rounded-xl px-6 py-5 shadow-e1"
            style={{
              background: '#142B27',
              border: '1px solid rgba(127,181,168,0.12)',
            }}
          >
            <p className="text-fluid-base leading-[1.75]" style={{ color: '#F5EFE6' }}>
              نلتزم بالشفافية الكاملة حول هوية المؤسسين.
            </p>
            <p className="text-fluid-sm leading-[1.7] mt-3" style={{ color: '#8A9B95' }}>
              سنُعلن عن أسماء الفريق المؤسس وروابطهم المهنية (LinkedIn) مع الإطلاق التجريبي العام.
              حتى ذلك الحين، نرد على كل رسالة باسم حقيقي وموعد للقاء فيديو قصير عند الطلب.
            </p>
            <p
              className="text-fluid-sm leading-[1.75] mt-4 font-medium"
              style={{ color: '#D4A574' }}
            >
              نلتزم بأن أول مكالمة ديمو تكون مع المؤسس مباشرة — لا فريق مبيعات بيننا في هذه المرحلة.
            </p>
            <p className="text-fluid-sm leading-[1.6] mt-4" style={{ color: '#8A9B95' }}>
              للتواصل المباشر مع المؤسس:{' '}
              <a
                href="mailto:founder@aooda.com"
                className="font-medium transition-colors"
                style={{ color: '#7FB5A8' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A574')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#7FB5A8')}
              >
                founder@aooda.com
              </a>
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-fluid-xl font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            أمان بياناتك
          </h2>
          <div className="space-y-3">
            {[
              {
                Icon: LockIcon,
                title: 'تشفير كامل',
                desc: 'جميع البيانات مشفّرة أثناء النقل والتخزين (TLS 1.3 + AES-256).',
              },
              {
                /* TODO(legal): once SDAIA registration completes, replace with actual registration number and effective date */
                Icon: PdplIcon,
                title: 'التزام بمتطلبات PDPL',
                desc: 'نلتزم بمتطلبات نظام حماية البيانات الشخصية (PDPL). تقدّمنا بطلب تسجيل سدايا (SDAIA). نُحدّث هذه الصفحة فور صدور رقم التسجيل. التفاصيل الكاملة في سياسة الخصوصية.',
              },
              {
                Icon: OwnershipIcon,
                title: 'ملكيتك الكاملة',
                desc: 'بيانات مرضاك ملكك وحدك. تستلمها كاملةً عند أي طلب أو عند إلغاء الاشتراك، وتُحذف من خوادمنا خلال أسبوع.',
              },
              {
                Icon: NoShareIcon,
                title: 'لا مشاركة مع أطراف ثالثة',
                desc: 'لا نبيع بياناتك ولا نشاركها مع أي طرف خارجي بأي شكل.',
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-xl px-5 py-4 shadow-e1"
                style={{ background: '#142B27', border: '1px solid rgba(127,181,168,0.1)' }}
              >
                <span className="shrink-0 mt-0.5 inline-flex" aria-hidden="true">
                  <Icon />
                </span>
                <div>
                  <p className="text-fluid-sm font-semibold mb-1" style={{ color: '#F5EFE6' }}>
                    {title}
                  </p>
                  <p className="text-fluid-sm leading-[1.6]" style={{ color: '#8A9B95' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-fluid-sm leading-[1.7]" style={{ color: '#8A9B95' }}>
            للاطلاع على التفاصيل الكاملة لمعالجة البيانات، الاحتفاظ، وحقوق المريض:{' '}
            <Link
              href="/privacy"
              className="font-medium underline underline-offset-4 transition-colors"
              style={{ color: '#7FB5A8' }}
            >
              سياسة الخصوصية
            </Link>
          </p>
        </section>

        <section className="pt-10" style={{ borderTop: '1px solid rgba(127,181,168,0.12)' }}>
          <h2 className="text-fluid-xl font-semibold mb-4" style={{ color: '#F5EFE6' }}>
            نتشرّف بمحادثتك
          </h2>
          <div className="space-y-2 text-fluid-base" style={{ color: '#8A9B95' }}>
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
        <div
          className="max-w-[720px] mx-auto text-center text-fluid-xs"
          style={{ color: '#8A9B95' }}
        >
          © 2026 عَودة. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  )
}
