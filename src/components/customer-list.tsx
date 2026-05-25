'use client'
import { Badge } from '@/components/ui/badge'
import { type DemoCustomer } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

type Customer = {
  id: string
  name: string
  phone: string
  status: string
  last_visit?: string | null
  total_spent?: number
}

const STATUS_LABELS: Record<string, string> = {
  vip: 'VIP',
  active: 'نشط',
  'at-risk': 'في خطر',
  dormant: 'خامل',
  lost: 'مفقود',
}

const STATUS_VARIANTS: Record<string, 'vip' | 'active' | 'at-risk' | 'dormant' | 'lost'> = {
  vip: 'vip',
  active: 'active',
  'at-risk': 'at-risk',
  dormant: 'dormant',
  lost: 'lost',
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('ar-JO', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}

interface CustomerListProps {
  customers: (Customer | DemoCustomer)[]
}

export function CustomerList({ customers }: CustomerListProps) {
  if (!customers.length) {
    return (
      <p className="text-center text-sm text-gray-400 py-10">لا يوجد عملاء للعرض</p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-right text-xs font-medium text-gray-500 px-4 py-2.5">الاسم</th>
            <th className="text-right text-xs font-medium text-gray-500 px-4 py-2.5">رقم الهاتف</th>
            <th className="text-right text-xs font-medium text-gray-500 px-4 py-2.5">آخر زيارة</th>
            <th className="text-right text-xs font-medium text-gray-500 px-4 py-2.5">الحالة</th>
            <th className="text-right text-xs font-medium text-gray-500 px-4 py-2.5">الإنفاق JD</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
              <td className="px-4 py-3 text-gray-500 font-metric text-xs">{c.phone}</td>
              <td className="px-4 py-3 text-gray-500 font-metric text-xs">{formatDate(c.last_visit)}</td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANTS[c.status] ?? 'default'}>
                  {STATUS_LABELS[c.status] ?? c.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-700 font-metric text-xs">
                {c.total_spent ? c.total_spent.toLocaleString('en-US') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
