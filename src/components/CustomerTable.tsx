import { supabase } from '@/lib/supabase'
import { Customer, CustomerStatus } from '@/types'

const STATUS_MAP: Record<CustomerStatus, { label: string; color: string }> = {
  vip: { label: 'VIP', color: 'bg-yellow-100 text-yellow-800' },
  active: { label: 'نشط', color: 'bg-green-100 text-green-800' },
  'at-risk': { label: 'في خطر', color: 'bg-orange-100 text-orange-800' },
  dormant: { label: 'خامل', color: 'bg-red-100 text-red-800' },
  lost: { label: 'مفقود', color: 'bg-gray-100 text-gray-600' },
}

async function getCustomers(clinicId: string): Promise<Customer[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('last_visit', { ascending: false })
    .limit(100)
  return (data as Customer[]) || []
}

export default async function CustomerTable({ clinicId }: { clinicId: string }) {
  const customers = await getCustomers(clinicId)

  if (customers.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">لا يوجد عملاء بعد</p>
        <p className="text-xs mt-1">ابدأ بإضافة عميل جديد أو استيراد بيانات</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">الاسم</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">الهاتف</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">آخر زيارة</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => {
            const s = STATUS_MAP[c.status] ?? STATUS_MAP.active
            return (
              <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500" dir="ltr">{c.phone}</td>
                <td className="px-4 py-3 text-gray-500">
                  {c.last_visit
                    ? new Date(c.last_visit).toLocaleDateString('ar-JO', { year: 'numeric', month: 'short', day: 'numeric' })
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
                    {s.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
