import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit, LIMITS } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HealthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  timestamp: z.string().datetime(),
  version: z.string(),
  checks: z.object({
    db: z.enum(['ok', 'fail']),
    auth: z.enum(['ok', 'fail']),
  }),
})

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.api)
  if (limited) return limited

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const [dbResult, authResult] = await Promise.allSettled([
    prisma.$queryRaw`SELECT 1`,
    supabaseUrl && supabaseAnon
      ? fetch(`${supabaseUrl}/auth/v1/health`, {
          headers: { apikey: supabaseAnon },
          signal: AbortSignal.timeout(2000),
        })
      : Promise.reject(new Error('supabase env missing')),
  ])

  const checks = {
    db: dbResult.status === 'fulfilled' ? ('ok' as const) : ('fail' as const),
    auth:
      authResult.status === 'fulfilled' && (authResult.value as Response).ok
        ? ('ok' as const)
        : ('fail' as const),
  }

  const healthy = checks.db === 'ok' && checks.auth === 'ok'

  const body = HealthSchema.parse({
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version:
      process.env.npm_package_version ??
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
      'unknown',
    checks,
  })

  return NextResponse.json(body, {
    status: healthy ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  })
}
