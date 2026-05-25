import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  // TODO: Wire to email/CRM (Resend → founder@aooda.com)
  console.log('[BOOKING]', JSON.stringify(body, null, 2))
  return NextResponse.json({ ok: true })
}
