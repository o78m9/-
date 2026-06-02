import { type NextRequest, NextResponse } from 'next/server'
import { cleanImportData } from '@/lib/claude'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { ImportSchema } from '@/lib/schemas'
import { logAudit } from '@/lib/audit'
import { chargeClinicTokens, estimateTokens } from '@/lib/claude-budget'
import { withClinic } from '@/shared/lib/db'
import { requireClinic, isClinicError } from '@/features/auth/lib/require-clinic'

// Maximum records Claude may return — prevents DoS via giant import
const MAX_IMPORT_RECORDS = 500
// Anthropic max_tokens for cleanImportData — must match value in src/lib/claude.ts
const IMPORT_MAX_TOKENS = 4096

export async function POST(req: NextRequest) {
  // COO fix: AI kill-switch — same env flag as /api/generate-message so a
  // founder can disable all Anthropic-billed routes from one Vercel env var.
  if (process.env.FEATURE_AI_GENERATION === 'false') {
    return NextResponse.json(
      { error: 'AI-assisted import is temporarily disabled' },
      { status: 503, headers: { 'Retry-After': '3600' } },
    )
  }

  const limited = await rateLimit(req, LIMITS.import)
  if (limited) return limited

  const parsed = ImportSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { rawText, clinic_id, confirm } = parsed.data

  // AUB-001 / RTA-002 fix: swap to requireClinic() with trip-wires.
  const ctx = await requireClinic(req, { requestedClinicId: clinic_id })
  if (isClinicError(ctx)) return ctx
  const tenant = ctx.clinicId

  // APF-002 / PIR-007 fix: per-clinic Anthropic token budget.
  // CFO fix: charge input AND output tokens — output cost is the larger half on imports.
  const estIn = estimateTokens(rawText)
  const estTotal = estIn + IMPORT_MAX_TOKENS
  const budget = await chargeClinicTokens(tenant, estTotal)
  if (!budget.ok) {
    return NextResponse.json(
      { error: 'Daily AI quota exceeded for this clinic', spentToday: budget.spentToday },
      { status: 429, headers: { 'Retry-After': '3600' } },
    )
  }

  // APF-007 fix: audit BEFORE the confirm short-circuit so preview-mode is also tracked.
  await logAudit(req, {
    userId: ctx.userId,
    clinicId: tenant,
    action: 'customer.import',
    resource: 'customer',
    metadata: { mode: confirm ? 'apply' : 'preview', estInputTokens: estIn },
  })

  const cleaned = await cleanImportData(rawText)

  // Enforce record cap — defence against prompt injection producing massive arrays
  const safeRecords = cleaned.slice(0, MAX_IMPORT_RECORDS)

  if (!confirm) {
    return NextResponse.json({ preview: safeRecords, count: safeRecords.length })
  }

  // CISO + CTO fix: batch all inserts inside one withClinic() transaction so RLS
  // policies see app.clinic_id set + writes are atomic per import.
  const validRecords = safeRecords.filter((c) => c.name && c.phone)
  if (validRecords.length === 0) {
    return NextResponse.json({ imported: 0 })
  }

  await withClinic(tenant, (sql) =>
    validRecords.map(
      (c) => sql`
        INSERT INTO customers (clinic_id, name, phone, first_visit, last_visit, notes, status, total_spent)
        VALUES (${tenant}, ${c.name}, ${c.phone}, ${c.last_visit || null}, ${c.last_visit || null}, ${c.notes || null}, 'active', 0)
        ON CONFLICT (phone, clinic_id) DO UPDATE SET
          last_visit = EXCLUDED.last_visit,
          notes = COALESCE(EXCLUDED.notes, customers.notes)
      `,
    ),
  )

  await logAudit(req, {
    userId: ctx.userId,
    clinicId: tenant,
    action: 'customer.import.applied',
    resource: 'customer',
    metadata: { imported: validRecords.length, requested: safeRecords.length },
  })
  return NextResponse.json({ imported: validRecords.length })
}
