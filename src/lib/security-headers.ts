import type { NextResponse } from 'next/server'

const isDev = process.env.NODE_ENV === 'development'

const CSP = [
  "default-src 'self'",
  `script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : "'nonce-{NONCE}'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co https://api.anthropic.com wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

export function applySecurityHeaders(res: NextResponse): NextResponse {
  // Prevent clickjacking
  res.headers.set('X-Frame-Options', 'DENY')
  // Prevent MIME sniffing
  res.headers.set('X-Content-Type-Options', 'nosniff')
  // Referrer control
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  // HSTS (1 year, include subdomains, preload-ready)
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  // Permissions policy — disable unneeded browser features
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  )
  // XSS protection (legacy browsers)
  res.headers.set('X-XSS-Protection', '1; mode=block')
  // CSP
  res.headers.set('Content-Security-Policy', CSP)
  return res
}
