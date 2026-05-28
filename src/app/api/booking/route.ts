import { type NextRequest, NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { BookingSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, LIMITS.auth)
  if (limited) return limited

  const parsed = BookingSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  // TODO: Wire to email/CRM (Resend → founder@aooda.com)
  console.warn('[BOOKING] TODO: wire to email/CRM', Object.keys(parsed.data).join(','))
  return NextResponse.json({ ok: true })
}
