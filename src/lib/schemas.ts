import { z } from 'zod'

// APF-005 fix: canonicalise to E.164 so phone-format variants of the same human
// collapse to one row + PDPL erasure-by-phone catches all variants.
const phone = z
  .string()
  .min(7)
  .max(20)
  .regex(/^\+?[\d\s\-().]+$/, 'Invalid phone number')
  .transform((s) => {
    const digits = s.replace(/[^\d+]/g, '')
    if (digits.startsWith('00')) return '+' + digits.slice(2)
    if (digits.startsWith('+')) return digits
    if (digits.startsWith('0') && digits.length >= 9) return '+962' + digits.slice(1) // Jordan default
    return '+' + digits
  })
  .refine((s) => /^\+\d{8,15}$/.test(s), 'Phone must canonicalise to E.164')

// WAP-005 / PIR-001..003 fix: strip newlines + Unicode bidi/tag invisibles at
// schema layer. Same data flows to Claude prompts (LLM injection vector) and
// future CSV exports (Excel formula injection). Done here once so every route
// gets the protection.
const safeShortText = z
  .string()
  .min(1)
  .max(200)
  .trim()
  .transform((s) => s.replace(/[‪-‮⁦-⁩\u{E0000}-\u{E007F}]/gu, '').replace(/[\r\n]+/g, ' '))
  .pipe(z.string().min(1, 'value empty after sanitisation'))

const safeLongText = z
  .string()
  .max(1000)
  .transform((s) => s.replace(/[‪-‮⁦-⁩\u{E0000}-\u{E007F}]/gu, '').replace(/[\r\n]+/g, ' '))

export const CustomerCreateSchema = z.object({
  name: safeShortText,
  phone,
  visit_type: z.string().max(100).optional(),
  notes: safeLongText.optional(),
  clinic_id: z.string().uuid(),
})

// APF-002 / PIR-005 fix: drop rawText cap from 500K to 50K. A 50K-char CSV
// covers ~99% of real dental-clinic imports while removing the $112/hour
// Anthropic-cost amplification window.
export const ImportSchema = z.object({
  rawText: z.string().min(1).max(50_000),
  clinic_id: z.string().uuid(),
  confirm: z.boolean().optional().default(false),
})

// Strict date format for last_visit — prevents prompt injection via free-form date strings.
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const GenerateMessageSchema = z.object({
  customers: z
    .array(
      z.object({
        id: z.string().max(100),
        name: z.string().min(1).max(200).trim(),
        // Must be YYYY-MM-DD or null/absent — rejects arbitrary strings that could
        // inject instructions into the Claude prompt.
        last_visit: z
          .string()
          .regex(ISO_DATE_RE, 'last_visit must be YYYY-MM-DD')
          .nullable()
          .optional(),
        total_spent: z.number().nonnegative().max(1_000_000).optional(),
        notes: z.string().max(1000).nullable().optional(),
      }),
    )
    .min(1)
    .max(10),
  template: z.enum(['standard', 'offer', 'health', 'custom']),
  customMessage: z.string().max(500).optional(),
  clinicName: z.string().max(200).optional(),
  // When true (or when WHATSAPP_TEMPLATE_MODE=enforced), the API routes
  // through the Meta-compliant template registry instead of free-form Claude
  // generation. Required for any path that actually sends via BSP (Meta
  // 2026-01-15 policy bans free-form outbound). Defaults to false for
  // backward-compat with the demo flow.
  useTemplates: z.boolean().optional().default(false),
})

export const BookingSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  email: z.string().email().max(320).optional(),
  phone: phone.optional(),
  clinicName: z.string().max(200).optional(),
  source: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
})

// GET /api/roi-report query params.
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const RoiReportQuerySchema = z.object({
  month: z.string().regex(MONTH_RE, 'month must be YYYY-MM').nullable().optional(),
  clinic_id: z.string().regex(UUID_RE, 'clinic_id must be UUID').nullable().optional(),
})

// GET /api/og query params.
export const OgImageQuerySchema = z.object({
  title: z.string().max(120).optional().default(''),
  sub: z.string().max(160).optional().default(''),
})
