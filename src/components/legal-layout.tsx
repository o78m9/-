import Link from 'next/link'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Simple header */}
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
        <div className="mb-8">
          <h1 className="text-[36px] font-bold text-stone-950 tracking-tight mb-2">{title}</h1>
          <p className="text-[14px] text-stone-400">آخر تحديث: {lastUpdated}</p>
        </div>
        <div className="prose prose-stone prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline">
          {children}
        </div>
      </main>

      <footer className="border-t border-stone-200 px-6 py-6 mt-16">
        <div className="max-w-[720px] mx-auto text-center text-[13px] text-stone-400">
          © 2026 عَودة. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  )
}
