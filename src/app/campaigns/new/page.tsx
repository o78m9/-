import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { sql } from '@/lib/supabase'
import { Header } from '@/components/header'
import { CampaignWizard } from '@/components/campaign/wizard'

const CLINIC_ID = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || ''

async function getSegmentCounts(): Promise<Record<string, number>> {
  const empty = { total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 }
  if (!CLINIC_ID || !sql) return empty

  try {
    const rows = await sql`SELECT status FROM customers WHERE clinic_id = ${CLINIC_ID}`
    const counts = { ...empty }
    ;(rows as { status: string }[]).forEach((r) => {
      counts.total++
      const k = r.status as keyof typeof empty
      if (k in counts) counts[k]++
    })
    return counts
  } catch {
    return empty
  }
}

export default async function NewCampaignPage() {
  const counts = await getSegmentCounts()

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-8" aria-label="breadcrumb">
          <Link href="/campaigns" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
            الحملات
          </Link>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="text-sm text-slate-700 font-medium">حملة جديدة</span>
        </nav>

        <CampaignWizard realCounts={counts} />
      </main>
    </div>
  )
}
