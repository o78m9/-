'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((_metric) => {
    // TODO: send to analytics endpoint
    // fetch('/api/vitals', { method: 'POST', body: JSON.stringify(_metric) })
  })

  return null
}
