'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, type ReactNode } from 'react'

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!KEY) return
    posthog.capture('$pageview')
  }, [pathname, searchParams])

  return null
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!KEY) return
    posthog.init(KEY, {
      api_host: HOST,
      capture_pageview: false,
      capture_pageleave: true,
      respect_dnt: true,
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug()
      },
    })
  }, [])

  if (!KEY) return <>{children}</>

  return (
    <PostHogProvider client={posthog}>
      <PageviewTracker />
      {children}
    </PostHogProvider>
  )
}
