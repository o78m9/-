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
  'at-risk': 'يحتاج تواصل',
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

const AVATAR_COLORS: Record<string, string> = {
  vip:      'bg-amber-100 text-amber-700',
  active:   'bg-teal-100 text-teal-700',
  'at-risk':'bg-slate-100 text-slate-600',
  dormant:  'bg-stone-100 text-stone-600',
  lost:     'bg-slate-200 text-slate-500',
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('ar-JO', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}

function Avatar({ name, status }: { name: string; status: string }) {
  const initial = name.trim()[0] ?? '؟'
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0',
        AVATAR_COLORS[status] ?? 'bg-slate-100 text-slate-600'
      )}
    >
      {initial}
    </div>
  )
}

interface CustomerListProps {
  customers: (Customer | DemoCustomer)[]
}

export function CustomerList({ customers }: CustomerListProps) {
  if (!customers.length) {
    return <p className="text-center text-sm text-slate-400 py-10">لا يوجد عملاء للعرض</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-right px-6 py-3"><span className="label-caption">العميل</span></th>
            <th className="text-right px-4 py-3"><span className="label-caption">الهاتف</span></th>
            <th className="text-right px-4 py-3"><span className="label-caption">آخر زيارة</span></th>
            <th className="text-right px-4 py-3"><span className="label-caption">الحالة</span></th>
            <th className="text-right px-4 py-3"><span className="label-caption">الإنفاق JD</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} status={c.status} />
                  <span className="font-medium text-slate-900">{c.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-400 font-metric text-xs">{c.phone}</td>
              <td className="px-4 py-3 text-slate-400 font-metric text-xs">{formatDate(c.last_visit)}</td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANTS[c.status] ?? 'default'}>
                  {STATUS_LABELS[c.status] ?? c.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-slate-600 font-metric text-xs font-medium">
                {c.total_spent ? c.total_spent.toLocaleString('en-US') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
