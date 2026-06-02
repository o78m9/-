import { NextResponse, type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createClient } from './server'

/**
 * Central clinic-context resolver.
 *
 * Single source of truth for "which clinic is this request acting on?"
 * Replaces ad-hoc `user.user_metadata.clinic_id` reads scattered across
 * API routes (the pattern that caused RTA-002 / IDOR via user-writable
 * metadata).
 *
 * Reads in priority order:
 *   1. user.app_metadata.clinic_id   — AUTHORITATIVE (admin-only writable)
 *   2. user.user_metadata.clinic_id  — FALLBACK during 7-day backfill window
 *                                       (logs warning to Sentry, useful for
 *                                        tracking migration progress; users
 *                                        not yet backfilled silently rely on
 *                                        this — but ONLY until the cutover
 *                                        date below)
 *   3. NEXT_PUBLIC_DEMO_CLINIC_ID    — local dev / Supabase-not-configured
 *
 * Trip-wire (RTA-002 detection):
 *   - If app_metadata.clinic_id AND user_metadata.clinic_id BOTH exist and
 *     DIFFER → log a P0 Sentry event + return 403. This is the signature of
 *     a user who tried to forge `user_metadata` after backfill.
 *   - If a request-supplied clinic_id (body / query) does NOT match the
 *     resolved clinic_id → log a P0 Sentry event + return 403.
 *
 * Cutover:
 *   - After CLINIC_METADATA_FALLBACK_UNTIL date passes, the user_metadata
 *     fallback path returns 403 instead of resolving. Forces clean swap.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type ClinicSource = 'app_metadata' | 'user_metadata_fallback' | 'env_demo'

export interface ClinicContext {
  clinicId: string
  userId: string | null
  source: ClinicSource
}

export interface RequireClinicOptions {
  /** If provided, must match the resolved clinic_id; mismatch trips RTA-002 alert. */
  requestedClinicId?: string | null
  /** Allow env demo clinic when Supabase not configured (default true on local). */
  allowEnvDemo?: boolean
}

function fallbackCutoverPassed(): boolean {
  const cutover = process.env.CLINIC_METADATA_FALLBACK_UNTIL
  if (!cutover) return false
  const t = Date.parse(cutover)
  if (!Number.isFinite(t)) return false
  return Date.now() > t
}

function tripWire(
  reason: string,
  details: Record<string, unknown>,
  req: NextRequest,
): NextResponse {
  try {
    Sentry.captureMessage('rta-002-tripwire', {
      level: 'error',
      tags: { component: 'require-clinic', reason },
      extra: {
        ...details,
        path: req.nextUrl.pathname,
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      },
    })
  } catch {
    // Sentry may not be initialised in test/dev — never block the response on telemetry.
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

function warnFallback(details: Record<string, unknown>): void {
  try {
    Sentry.captureMessage('clinic-metadata-fallback', {
      level: 'warning',
      tags: { component: 'require-clinic', source: 'user_metadata_fallback' },
      extra: details,
    })
  } catch {
    // ignore
  }
}

/**
 * Resolves the clinic context for the current request.
 *
 * Returns:
 *   - ClinicContext on success
 *   - NextResponse (401 / 403 / 400) on failure — the caller should return it directly
 */
export async function requireClinic(
  req: NextRequest,
  options: RequireClinicOptions = {},
): Promise<ClinicContext | NextResponse> {
  const { requestedClinicId, allowEnvDemo = true } = options

  // If a clinic_id was supplied by the client, it must be a UUID before we
  // even try to resolve. Cheap input-validation gate.
  if (requestedClinicId != null && !UUID_RE.test(requestedClinicId)) {
    return NextResponse.json({ error: 'clinic_id must be UUID' }, { status: 400 })
  }

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let resolved: ClinicContext | null = null

  if (supabaseConfigured) {
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // app_metadata is admin-only writable — trustworthy.
      const appClinic = (user.app_metadata as { clinic_id?: unknown } | null)?.clinic_id
      // user_metadata is USER-WRITABLE — only used as fallback during backfill window.
      const userClinic = (user.user_metadata as { clinic_id?: unknown } | null)?.clinic_id

      const appStr = typeof appClinic === 'string' ? appClinic : null
      const userStr = typeof userClinic === 'string' ? userClinic : null

      // TRIP-WIRE: both present and different → likely RTA-002 forge attempt.
      if (appStr && userStr && appStr !== userStr) {
        return tripWire(
          'app_user_metadata_clinic_id_diverge',
          { userId: user.id, appClinic: appStr, userClinic: userStr },
          req,
        )
      }

      if (appStr && UUID_RE.test(appStr)) {
        resolved = { clinicId: appStr, userId: user.id, source: 'app_metadata' }
      } else if (userStr && UUID_RE.test(userStr)) {
        // Fallback path — only valid until cutover.
        if (fallbackCutoverPassed()) {
          return tripWire(
            'fallback_cutover_passed',
            { userId: user.id, hadUserMetadataClinic: true },
            req,
          )
        }
        warnFallback({ userId: user.id, path: req.nextUrl.pathname })
        resolved = { clinicId: userStr, userId: user.id, source: 'user_metadata_fallback' }
      } else {
        // Authenticated but no clinic context anywhere → not permitted.
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch (err) {
      // Supabase call failed unexpectedly — surface to Sentry, return 500.
      try {
        Sentry.captureException(err, { tags: { component: 'require-clinic' } })
      } catch {
        /* ignore */
      }
      return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
  }

  // Fallback to env demo clinic when Supabase isn't configured (local dev only).
  if (!resolved && allowEnvDemo) {
    const envClinic = process.env.NEXT_PUBLIC_DEMO_CLINIC_ID
    if (envClinic && UUID_RE.test(envClinic)) {
      resolved = { clinicId: envClinic, userId: null, source: 'env_demo' }
    }
  }

  if (!resolved) {
    return NextResponse.json({ error: 'clinic_id required' }, { status: 400 })
  }

  // TRIP-WIRE: client-supplied clinic_id must equal the resolved one.
  if (requestedClinicId != null && requestedClinicId !== resolved.clinicId) {
    return tripWire(
      'requested_clinic_mismatch',
      {
        userId: resolved.userId,
        resolvedClinic: resolved.clinicId,
        requestedClinic: requestedClinicId,
        source: resolved.source,
      },
      req,
    )
  }

  return resolved
}

/** Type guard: caller can branch on `if (isClinicError(ctx)) return ctx`. */
export function isClinicError(value: ClinicContext | NextResponse): value is NextResponse {
  return value instanceof NextResponse
}
