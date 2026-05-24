import QuickForm from '@/components/QuickForm'

export default function CapturePage({
  searchParams,
}: {
  searchParams: { clinic?: string }
}) {
  const clinicId = searchParams.clinic || process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || ''

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">عَودة</h1>
          <p className="text-sm text-gray-500 mt-1">سجّل بياناتك للحصول على خصم 10% في زيارتك القادمة</p>
        </div>
        {clinicId ? (
          <QuickForm clinicId={clinicId} />
        ) : (
          <p className="text-center text-sm text-red-500">رابط غير صحيح — تواصل مع العيادة</p>
        )}
      </div>
    </main>
  )
}
