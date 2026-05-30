'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { PostHogProvider } from 'posthog-js/react'
import { Suspense, useEffect, type ReactNode } from 'react'
import { POSTHOG_KEY, capturePageview, getClient, initPostHog, shouldOptOut } from '@/lib/posthog'

/**
 * Tracks SPA navigations as $pageview events.
 *
 * Wrapped in <Suspense> by the parent because `useSearchParams` opts the
 * subtree into client-side bailout — we don't want that to bubble up to
 * the whole layout.
 */
function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    const qs = searchParams?.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    capturePageview(typeof window !== 'undefined' ? window.location.origin + url : url)
  }, [pathname, searchParams])

  return null
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Init is a no-op when the user opted out or the key is missing.
    initPostHog()
  }, [])

  // If we have no key OR the user opted out, render children without the
  // provider so we don't ship the React context for nothing.
  if (!POSTHOG_KEY || (typeof window !== 'undefined' && shouldOptOut())) {
    return <>{children}</>
  }

  const client = getClient()
  if (!client) {
    // First render before init effect — still render children, tracker will
    // come online on the next render via Suspense.
    return (
      <>
        <Suspense fallback={null}>
          <PageviewTracker />
        </Suspense>
        {children}
      </>
    )
  }

  return (
    <PostHogProvider client={client}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PostHogProvider>
  )
}
