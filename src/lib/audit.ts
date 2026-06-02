import type { NextRequest } from 'next/server'
import { neon } from '@neondatabase/serverless'
import * as Sentry from '@sentry/nextjs'
import { getClientIp } from '@/lib/client-ip'

/**
 * PDPL-compliant audit log writer.
 *
 * Best-effort: failures are logged to stderr but never thrown — an audit
 * miss must not break the user-facing request. (A separate cron job
 * verifies daily that recent rows exist; long gaps page on-call.)
 *
 * Storage: `audit_log` table (see prisma/schema.prisma → AuditLog).
 * Retention: pruned after 12 months by `scripts/prune-audit-log.mjs` (cron).
 *
 * Never store: passwords, tokens, full card data, raw OTPs, message bodies
 * containing PII. Metadata should be small, structured, and PII-light.
 */
export type AuditAction =
  | 'customer.create'
  | 'customer.update'
  | 'customer.import'
  | 'customer.import.applied'
  | 'message.generate'
  | 'booking.submit'
  | 'auth.signin'
  | 'auth.signout'
  | 'auth.signup'

export interface AuditEntry {
  userId?: string | null
  clinicId?: string | null
  action: AuditAction
  resource: string
  resourceId?: string | null
  metadata?: Record<string, unknown>
}

// RTA-008 fix: prefer platform-set client IP header to avoid trusting
// a value the client can rotate freely.
function clientIp(req: NextRequest): string {
  return getClientIp(req)
}

function clientUa(req: NextRequest): string {
  return req.headers.get('user-agent')?.slice(0, 300) ?? 'unknown'
}

export async function logAudit(req: NextRequest, entry: AuditEntry): Promise<void> {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) return // no DB configured (local dev without Neon) — skip silently

  try {
    const sql = neon(dbUrl)
    const ip = clientIp(req)
    const ua = clientUa(req)
    const metadata = entry.metadata ? JSON.stringify(entry.metadata) : null

    await sql`
      INSERT INTO audit_log (user_id, clinic_id, action, resource, resource_id, ip, user_agent, metadata)
      VALUES (
        ${entry.userId ?? null},
        ${entry.clinicId ?? null},
        ${entry.action},
        ${entry.resource},
        ${entry.resourceId ?? null},
        ${ip},
        ${ua},
        ${metadata}::jsonb
      )
    `
  } catch (err) {
    console.error('[audit] write failed:', err)
    // Surface to Sentry so on-call sees PDPL-relevant audit gaps.
    try {
      Sentry.captureException(err, { tags: { component: 'audit-log' } })
    } catch {
      // Sentry not initialised in test/dev — silent.
    }
  }
}
