import { type NextRequest, NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, LIMITS.auth)
  if (limited) return limited
  const body = (await req.json()) as Record<string, unknown>
  // TODO: Wire to email/CRM (Resend → founder@aooda.com)
  console.warn('[BOOKING] TODO: wire to email/CRM', Object.keys(body).join(','))
  return NextResponse.json({ ok: true })
}
