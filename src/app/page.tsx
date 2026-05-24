import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CustomerTable from '@/components/CustomerTable'

const CLINIC_ID = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || ''

const SEGMENTS = [
  { key: 'vip', label: 'VIP', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'active', label: 'نشطين', color: 'bg-green-100 text-green-800' },
  { key: 'at-risk', label: 'في خطر', color: 'bg-orange-100 text-orange-800' },
  { key: 'dormant', label: 'خاملين', color: 'bg-red-100 text-red-800' },
  { key: 'lost', label: 'مفقودين', color: 'bg-gray-100 text-gray-600' },
]

async function getStats() {
  if (!CLINIC_ID || !supabase) return { vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0, total: 0 }

  const { data } = await supabase
    .from('customers')
    .select('status')
    .eq('clinic_id', CLINIC_ID)

  const counts: Record<string, number> = { vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0, total: 0 }
  data?.forEach(c => {
    if (c.status in counts) counts[c.status]++
    counts.total++
  })
  return counts
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">عَودة</h1>
          <p className="text-sm text-gray-500">لوحة التحكم</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/capture"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + عميل جديد
          </Link>
          <Link
            href="/import"
            className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            استيراد بيانات
          </Link>
          <Link
            href="/qr"
            className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            QR Code
          </Link>
        </div>
      </div>

      {!CLINIC_ID && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          أضف <code className="font-mono bg-yellow-100 px-1 rounded">NEXT_PUBLIC_DEMO_CLINIC_ID</code> في ملف{' '}
          <code className="font-mono bg-yellow-100 px-1 rounded">.env.local</code> لتفعيل لوحة التحكم.
        </div>
      )}

      <div className="grid grid-cols-5 gap-3 mb-8">
        {SEGMENTS.map(s => (
          <div key={s.key} className="bg-white rounded-xl p-4 shadow-sm border text-center">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{stats[s.key] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <p className="font-medium text-sm">قاعدة العملاء</p>
          <p className="text-xs text-gray-400">{stats.total} إجمالي</p>
        </div>
        {CLINIC_ID ? (
          <CustomerTable clinicId={CLINIC_ID} />
        ) : (
          <p className="text-center text-sm text-gray-400 py-12">أضف Clinic ID للبدء</p>
        )}
      </div>
    </main>
  )
}
