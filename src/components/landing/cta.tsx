import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-content mx-auto text-center">
        <h2 className="text-[48px] font-semibold text-stone-950 tracking-tight mb-4">
          جاهز ترجع عملاءك؟
        </h2>
        <p className="text-[18px] text-stone-600 mb-10">
          احجز عرض 15 دقيقة — شوف النظام يشتغل على بياناتك انت.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center h-14 px-8 rounded-lg bg-teal-700 text-white text-[17px] font-medium hover:bg-teal-800 transition-colors"
        >
          احجز موعد العرض
        </Link>
        <p className="text-[13px] text-stone-400 mt-6">
          بدون التزام. الشهر الأول مجاني.
        </p>
      </div>
    </section>
  )
}
