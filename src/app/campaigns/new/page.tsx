import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { withClinic } from '@/shared/lib/db'
import { createClient } from '@/features/auth/lib/server'
import { Header } from '@/components/header'
import { CampaignWizard } from '@/components/campaign/wizard'

// CTO fix: campaign segment counts MUST scope to the authenticated tenant.
// Previously this page hard-coded NEXT_PUBLIC_DEMO_CLINIC_ID — the same AUB-003
// pattern that leaked the demo clinic's data on /dashboard.
async function resolveClinicIdForUser(
  user: { app_metadata?: unknown } | null,
): Promise<string | null> {
  if (!user) return process.env.NEXT_PUBLIC_DEMO_CLINIC_ID || null
  const app = (user.app_metadata as { clinic_id?: unknown } | null)?.clinic_id
  if (typeof app === 'string' && app.length > 0) return app
  return null
}

async function getSegmentCounts(clinicId: string | null): Promise<Record<string, number>> {
  const empty = { total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 }
  if (!clinicId) return empty

  try {
    const [rows] = await withClinic<[Array<{ status: string }>]>(clinicId, (sql) => [
      sql`SELECT status FROM customers WHERE clinic_id = ${clinicId}`,
    ])
    const counts = { ...empty }
    rows.forEach((r) => {
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
  let clinicId: string | null = null

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) redirect('/login')
      clinicId = await resolveClinicIdForUser(user)
    } catch {
      redirect('/login')
    }
  } else {
    clinicId = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID ?? null
  }

  const counts = await getSegmentCounts(clinicId)

  return (
    <div className="min-h-screen" style={{ background: '#0A1F1C' }}>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Breadcrumb — RTL fix: ChevronLeft, not ChevronRight, points "back" in RTL */}
        <nav className="flex items-center gap-1.5 mb-8" aria-label="breadcrumb" dir="rtl">
          <Link
            href="/campaigns"
            className="text-sm transition-colors text-[#8A9B95] hover:text-[#F5EFE6]"
          >
            الحملات
          </Link>
          <ChevronLeft size={13} style={{ color: 'rgba(127,181,168,0.4)' }} />
          <span className="text-sm font-medium" style={{ color: '#F5EFE6' }}>
            حملة جديدة
          </span>
        </nav>

        <CampaignWizard realCounts={counts} />
      </main>
    </div>
  )
}
