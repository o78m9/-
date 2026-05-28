'use client'

import dynamic from 'next/dynamic'
import { SkeletonChart } from '@/components/ui/skeleton'

export const DashboardPreviewWrapper = dynamic(
  () => import('./dashboard-preview').then((m) => ({ default: m.DashboardPreview })),
  {
    ssr: false,
    loading: () => (
      <section className="py-24" style={{ background: '#071A18' }}>
        <div className="max-w-content mx-auto px-6 space-y-6">
          <div className="text-center space-y-3">
            <div
              className="h-8 w-40 rounded-full mx-auto"
              style={{ background: 'rgba(127,181,168,0.1)' }}
            />
            <div
              className="h-12 w-80 rounded-xl mx-auto"
              style={{ background: 'rgba(127,181,168,0.07)' }}
            />
          </div>
          <SkeletonChart />
        </div>
      </section>
    ),
  },
)
