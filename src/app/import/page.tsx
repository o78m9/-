import Link from 'next/link'
import ImportForm from '@/components/ImportForm'

export default function ImportPage() {
  const clinicId = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || ''

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← الرئيسية
        </Link>
        <h1 className="text-xl font-bold mt-2">استيراد بيانات المرضى</h1>
        <p className="text-sm text-gray-500 mt-1">
          الصق بياناتك من Excel أو WhatsApp أو أي مصدر — Claude سينظّفها تلقائياً
        </p>
      </div>
      {clinicId ? (
        <ImportForm clinicId={clinicId} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          أضف <code className="font-mono">NEXT_PUBLIC_DEMO_CLINIC_ID</code> في .env.local أولاً
        </div>
      )}
    </main>
  )
}
