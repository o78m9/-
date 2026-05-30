import type { NextRequest } from 'next/server'
import { handlers } from '../../../../../auth'
import { rateLimit, LIMITS } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.auth)
  if (limited) return limited
  return handlers.GET(req)
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.auth)
  if (limited) return limited
  return handlers.POST(req)
}
