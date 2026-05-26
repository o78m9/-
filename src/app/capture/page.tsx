import QuickForm from '@/components/QuickForm'

export default function CapturePage({
  searchParams,
}: {
  searchParams: { clinic?: string }
}) {
  const clinicId = searchParams.clinic || process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || ''

  return (
    <main id="main" className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="text-white font-bold text-xl font-metric">ع</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">عَودة</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            سجّل بياناتك واحصل على{' '}
            <span className="font-semibold text-brand-700">خصم 10%</span>{' '}
            في زيارتك القادمة
          </p>
        </div>

        {clinicId ? (
          <QuickForm clinicId={clinicId} />
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-center">
            رابط غير صحيح — تواصل مع العيادة
          </div>
        )}
      </div>
    </main>
  )
}
