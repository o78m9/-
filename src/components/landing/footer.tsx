import Link from 'next/link'

const LINKS = [
  {
    heading: 'المنتج',
    items: [
      { label: 'كيف يعمل', href: '#how' },
      { label: 'الأسعار', href: '#pricing' },
      { label: 'الأسئلة الشائعة', href: '#faq' },
      { label: 'لوحة التحكم', href: '/dashboard' },
    ],
  },
  {
    heading: 'الشركة',
    items: [
      { label: 'عن عَودة', href: '/about' },
      { label: 'تواصل معنا', href: 'mailto:founder@aooda.com' },
    ],
  },
  {
    heading: 'للعيادات',
    items: [
      { label: 'عيادات الأسنان', href: '#' },
      { label: 'العيادات التجميلية', href: '#' },
      { label: 'العلاج الطبيعي', href: '#' },
    ],
  },
  {
    heading: 'قانوني',
    items: [
      { label: 'شروط الاستخدام', href: '/terms' },
      { label: 'سياسة الخصوصية', href: '/privacy' },
      { label: 'سياسة الإلغاء', href: '/cancellation' },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="bg-stone-950 text-white px-8 py-16">
      <div className="max-w-content mx-auto">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-[20px] font-bold tracking-tight">عَودة</span>
            </div>
            <p className="text-[13px] text-stone-400 leading-relaxed mb-4">
              نظام ذكي لإعادة تفعيل عملاء العيادات باستخدام Claude AI وWhatsApp.
            </p>
            <div className="space-y-1">
              <a
                href="mailto:founder@aooda.com"
                className="block text-[13px] text-stone-500 hover:text-stone-300 transition-colors"
              >
                founder@aooda.com
              </a>
              {/* TODO: replace with real WhatsApp number */}
              <p className="text-[13px] text-stone-500">+962 7X XXX XXXX</p>
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading}>
              <p className="text-[12px] font-medium uppercase tracking-[0.05em] text-stone-500 mb-4">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[14px] text-stone-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-stone-800 flex items-center justify-between">
          <p className="text-[13px] text-stone-500">
            © 2026 عَودة. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-[13px] text-stone-500 hover:text-stone-300 transition-colors">الشروط</Link>
            <Link href="/privacy" className="text-[13px] text-stone-500 hover:text-stone-300 transition-colors">الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
