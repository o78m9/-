import QuickForm from '@/components/QuickForm'

// UUID v4 format — must match the format used by the API IDOR guard.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function CapturePage({
  searchParams,
}: {
  searchParams: Promise<{ clinic?: string }>
}) {
  const params = await searchParams

  // Validate the clinic query param before use — reject non-UUID values so an
  // attacker cannot probe arbitrary clinic IDs or inject unexpected strings.
  const rawClinic = params.clinic ?? ''
  const clinicParam = UUID_RE.test(rawClinic) ? rawClinic : ''

  const clinicId = clinicParam || process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || ''

  return (
    <main
      id="main"
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #0A1F1C 0%, #142B27 100%)' }}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-sm"
        style={{
          background: '#142B27',
          border: '1px solid rgba(127,181,168,0.15)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="text-white font-bold text-xl font-metric">ع</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#D4A574' }}>
            عَودة
          </h1>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: '#8A9B95' }}>
            سجّل بياناتك واحصل على{' '}
            <span className="font-semibold" style={{ color: '#D4A574' }}>
              خصم 10%
            </span>{' '}
            في زيارتك القادمة
          </p>
        </div>

        {clinicId ? (
          <QuickForm clinicId={clinicId} />
        ) : (
          <div
            className="rounded-xl p-4 text-sm text-center"
            style={{
              background: 'rgba(212,165,116,0.1)',
              border: '1px solid rgba(212,165,116,0.3)',
              color: '#D4A574',
            }}
          >
            رابط غير صحيح — تواصل مع العيادة
          </div>
        )}
      </div>
    </main>
  )
}
