import type { NextResponse } from 'next/server'

const isDev = process.env.NODE_ENV === 'development'

function buildCSP(nonce: string): string {
  return [
    "default-src 'self'",
    isDev
      ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
      : `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data:",
    [
      "connect-src 'self'",
      'https://*.supabase.co',
      'wss://*.supabase.co',
      'https://api.anthropic.com',
      // PostHog analytics — capture, decide, and EU/US ingest hosts.
      'https://app.posthog.com',
      'https://us.i.posthog.com',
      'https://eu.i.posthog.com',
      'https://*.posthog.com',
      // Sentry error monitoring — main API + per-project ingest subdomains.
      'https://*.sentry.io',
      'https://*.ingest.sentry.io',
      'https://*.ingest.us.sentry.io',
      'https://*.ingest.de.sentry.io',
    ].join(' '),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ')
}

export function applySecurityHeaders(res: NextResponse, nonce: string): NextResponse {
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  )
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Content-Security-Policy', buildCSP(nonce))
  return res
}
