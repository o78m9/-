import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  // TODO: Wire to email/CRM (Resend → founder@aooda.com)
  console.warn('[BOOKING] TODO: wire to email/CRM', JSON.stringify(body))
  return NextResponse.json({ ok: true })
}
