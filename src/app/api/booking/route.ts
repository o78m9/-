import { type NextRequest, NextResponse } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { BookingSchema } from '@/lib/schemas'
import { logAudit } from '@/lib/audit'

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.auth)
  if (limited) return limited

  const parsed = BookingSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  // TODO: Wire to email/CRM (Resend → founder@aooda.com)
  console.warn('[BOOKING] TODO: wire to email/CRM', Object.keys(parsed.data).join(','))
  await logAudit(req, {
    action: 'booking.submit',
    resource: 'booking',
    metadata: { source: parsed.data.source ?? null, hasEmail: !!parsed.data.email },
  })
  return NextResponse.json({ ok: true })
}
