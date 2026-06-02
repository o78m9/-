'use client'

// RTA-005 fix: rows are ranks, not names. Quasi-identifier scrub.
interface Patient {
  rank: number
  lastVisit: string
  totalSpent: number
  status: string
}

const STATUS_LABEL: Record<string, string> = {
  active: 'نشط',
  dormant: 'خامل',
  vip: 'VIP',
  lost: 'مفقود',
}
const STATUS_STYLE: Record<string, { color: string; background: string }> = {
  active: { color: '#166534', background: '#DCFCE7' },
  dormant: { color: '#6B6359', background: '#E8DFD0' },
  vip: { color: '#92400E', background: '#FEF3C7' },
  lost: { color: '#9A3412', background: '#FEE2E2' },
}

function formatDate(d: string) {
  // Use ar-JO so RoI report dates match the Jordan-first product locale.
  return new Date(d).toLocaleDateString('ar-JO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function TopReactivatedTable({ patients }: { patients: Patient[] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(212,165,116,0.15)' }}
      dir="rtl"
    >
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: '#0F2922' }}
      >
        <p className="text-[12px] font-medium" style={{ color: '#8A9B95' }}>
          أبرز المرضى المستعادين هذا الشهر
        </p>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(212,165,116,0.12)', color: '#D4A574' }}
        >
          {patients.length} مريض
        </span>
      </div>
      <div
        className="divide-y"
        style={{ background: '#0A1F1C', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        {patients.map((p) => (
          <div key={p.rank} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#8A9B95' }}
              >
                #{p.rank}
              </div>
              <div>
                <p className="text-[12px] font-medium" style={{ color: '#F5EFE6' }}>
                  مريض #{p.rank}
                </p>
                <p className="text-[10px]" style={{ color: '#6B6359' }}>
                  آخر زيارة: {formatDate(p.lastVisit)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                style={STATUS_STYLE[p.status] ?? STATUS_STYLE.active}
              >
                {STATUS_LABEL[p.status] ?? '—'}
              </span>
              <span className="text-[12px] font-semibold" style={{ color: '#D4A574' }}>
                {p.totalSpent.toLocaleString()} د.أ
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
