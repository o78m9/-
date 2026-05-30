/**
 * PostHog analytics — lightweight, SSR-safe wrapper.
 *
 * Goals:
 * - Never throw on the server or when keys are missing.
 * - Respect Do-Not-Track and Save-Data / prefers-reduced-data signals.
 * - Provide a small, typed event catalog so call sites stay consistent.
 */
import posthog, { type PostHog } from 'posthog-js'

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

/** Catalog of tracked events. Add new event names here so TS catches typos. */
export type AnalyticsEvent =
  | 'cta_click'
  | 'command_palette_open'
  | 'signup_started'
  | 'signup_completed'

/** Properties allowed on tracked events. Keep flat + JSON-serialisable. */
export type EventProps = Record<string, string | number | boolean | null | undefined>

/**
 * True when we should suppress analytics for this user/session.
 * Honors browser Do-Not-Track and the Save-Data hint (prefers-reduced-data analogue).
 */
export function shouldOptOut(): boolean {
  if (typeof window === 'undefined') return true

  // Do-Not-Track — standard browser opt-out.
  const dnt =
    // @ts-expect-error — vendor-prefixed legacy DNT signals
    navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack
  if (dnt === '1' || dnt === 'yes') return true

  // Save-Data — surfaced by Chromium when the user has data-saver on. We treat
  // this as a proxy for prefers-reduced-data until that media query ships.
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean }
    }
  ).connection
  if (conn?.saveData) return true

  // prefers-reduced-data media query (where supported).
  try {
    if (window.matchMedia('(prefers-reduced-data: reduce)').matches) return true
  } catch {
    // matchMedia may throw on the unknown feature — ignore.
  }

  return false
}

let initialized = false

/**
 * Idempotent init. Safe to call from multiple places; only the first call
 * with a valid key actually boots the SDK.
 */
export function initPostHog(): PostHog | null {
  if (typeof window === 'undefined') return null
  if (!POSTHOG_KEY) return null
  if (shouldOptOut()) return null
  if (initialized) return posthog

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // we handle pageviews manually via the provider
    capture_pageleave: true,
    respect_dnt: true,
    persistence: 'localStorage+cookie',
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.debug()
    },
  })
  initialized = true
  return posthog
}

/** Returns the live client only when initialised and not opted-out. */
export function getClient(): PostHog | null {
  if (typeof window === 'undefined') return null
  if (!POSTHOG_KEY || !initialized) return null
  return posthog
}

/** Fire-and-forget event capture. No-ops when the SDK isn't available. */
export function track(event: AnalyticsEvent, properties?: EventProps): void {
  const client = getClient()
  if (!client) return
  try {
    client.capture(event, properties)
  } catch {
    // Never let analytics break the UI.
  }
}

/** Manual pageview capture — used by the provider on route changes. */
export function capturePageview(url?: string): void {
  const client = getClient()
  if (!client) return
  try {
    client.capture('$pageview', url ? { $current_url: url } : undefined)
  } catch {
    // ignore
  }
}
