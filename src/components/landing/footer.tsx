import Link from 'next/link'

const COL_PRODUCT = [
  { href: '#how', label: 'كيف يعمل' },
  { href: '#pricing', label: 'الأسعار' },
  { href: '#faq', label: 'الأسئلة الشائعة' },
  { href: '/dashboard', label: 'لوحة التحكم' },
]

const COL_COMPANY = [
  { href: '/about', label: 'عن عَودة' },
  { href: '/about#security', label: 'الأمان والخصوصية' },
  { href: '#cta', label: 'تواصل معنا' },
]

const COL_LEGAL = [
  { href: '/terms', label: 'الشروط والأحكام' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
  { href: '/cancellation', label: 'سياسة الإلغاء' },
]

function FooterCol({
  heading,
  links,
}: {
  heading: string
  links: readonly { href: string; label: string }[]
}) {
  return (
    <div>
      <p className="text-[11px] font-[600] uppercase tracking-[0.1em] text-mute mb-5">{heading}</p>
      <ul className="space-y-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[14px] text-mute hover:text-ink transition-colors duration-150 underline underline-offset-[3px] decoration-1 decoration-transparent hover:decoration-copper/40"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LandingFooter() {
  return (
    <footer className="bg-paper border-t border-line" aria-label="تذييل الصفحة">
      <div className="max-w-content mx-auto px-6 pt-16 pb-10">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-16">
          {/* Brand column — wide */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-[5px] h-[5px] rounded-full bg-copper" aria-hidden="true" />
              <span className="font-sans font-[700] text-[20px] text-ink tracking-[-0.03em]">
                عَودة
              </span>
            </div>
            <p
              className="text-mute leading-relaxed mb-6"
              style={{ fontSize: 14, maxWidth: '24ch' }}
            >
              نظام ذكاء اصطناعي يرجّع عملاءك الخاملين ويحوّلهم لمواعيد حقيقية.
            </p>

            {/* Email input */}
            <div>
              <label htmlFor="footer-email" className="sr-only">
                بريدك الإلكتروني
              </label>
              <div className="flex items-stretch border border-line rounded-full overflow-hidden max-w-[260px]">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 bg-transparent px-4 text-[13px] text-ink placeholder:text-mute focus:outline-none min-w-0"
                  dir="ltr"
                />
                <button
                  type="button"
                  className="px-4 py-2.5 bg-forest text-cream text-[12px] font-[500] hover:bg-moss transition-colors duration-150 flex-shrink-0"
                >
                  اشتراك
                </button>
              </div>
            </div>
          </div>

          <FooterCol heading="المنتج" links={COL_PRODUCT} />
          <FooterCol heading="الشركة" links={COL_COMPANY} />
          <FooterCol heading="قانوني" links={COL_LEGAL} />
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-line">
          <p className="text-[13px] text-mute">
            © {new Date().getFullYear()} عَودة. جميع الحقوق محفوظة.
          </p>

          {/* Geo signature */}
          <p className="text-[13px]">
            <span className="text-mute">صُنع في </span>
            <span className="font-[500] text-copper">عمّان</span>
          </p>

          {/* Social */}
          <div className="flex items-center gap-3" aria-label="روابط التواصل الاجتماعي">
            {[
              {
                label: 'X (تويتر)',
                href: '#',
                icon: (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                  </svg>
                ),
              },
              {
                label: 'LinkedIn',
                href: '#',
                icon: (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                  </svg>
                ),
              },
              {
                label: 'Instagram',
                href: '#',
                icon: (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm.003 1.44c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.844-.038 1.097-.046 3.233-.046" />
                    <path d="M8 10.93a2.929 2.929 0 1 1 0-5.858 2.929 2.929 0 0 1 0 5.858m0-7.436a4.507 4.507 0 1 0 0 9.014 4.507 4.507 0 0 0 0-9.014m5.843-.182a1.034 1.034 0 1 1-2.067 0 1.034 1.034 0 0 1 2.067 0" />
                  </svg>
                ),
              },
            ].map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-full text-mute hover:text-ink hover:bg-line transition-all duration-150 border border-transparent hover:border-line"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
