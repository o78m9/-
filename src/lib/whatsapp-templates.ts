/**
 * Meta WhatsApp Business API template registry.
 *
 * Source of truth: `docs/templates/meta-templates.md`.
 * Each template here MUST have a matching submitted+approved template in the
 * BSP console (360dialog / Twilio). The `metaTemplateId` field is populated
 * after Meta approval — until then, the template cannot be sent in production.
 *
 * Why this exists: as of Meta 2026-01-15 policy, no free-form Claude
 * generation is allowed on WhatsApp BSP. Outbound non-session messages MUST
 * be sent as pre-approved templates with variable substitution only.
 */

import { z } from 'zod'

export type TemplateCategory = 'UTILITY' | 'MARKETING' | 'AUTHENTICATION'

export interface WhatsAppTemplate {
  /** Internal slug matching docs/templates/meta-templates.md */
  slug: string
  /** Display name in admin UI (Arabic ok) */
  displayName: string
  /** Meta category — drives approval friction */
  category: TemplateCategory
  /** Once approved by Meta, populate from BSP console */
  metaTemplateId: string | null
  /** Language code(s) approved */
  languages: string[]
  /** Body with {{1}} {{2}} placeholders. Source-of-truth Arabic copy. */
  body: string
  /** Zod schema validating ALL variables before send */
  variablesSchema: z.ZodObject<z.ZodRawShape>
  /** Footer (constant per template) */
  footer?: string
  /** Quick reply or URL buttons */
  buttons?: Array<
    { type: 'QUICK_REPLY'; text: string } | { type: 'URL'; text: string; urlPlaceholder: string }
  >
  /** When this template is applicable — used by `selectTemplate()` */
  appliesWhen: (ctx: TemplateSelectionContext) => boolean
  /** Rough priority when multiple templates apply (higher = preferred) */
  priority: number
}

export interface TemplateSelectionContext {
  daysSinceLastVisit: number | null
  isBirthdayThisWeek: boolean
  hasRecentVisit: boolean
  visitWasYesterdayOr2DaysAgo: boolean
  hasOptedOut: boolean
  hasReplyKeywordPending: boolean
  clinicHasActiveOffer: boolean
  totalSpentJOD: number
}

const firstName = z.string().trim().min(1).max(60)
const clinicName = z.string().trim().min(1).max(120)
const timeSinceText = z.string().trim().min(1).max(60)
const visitDayText = z.string().trim().min(1).max(40)

export const TEMPLATES: WhatsAppTemplate[] = [
  {
    slug: 'recall_dormant_v1',
    displayName: 'تذكير مريض نائم (محايد)',
    category: 'UTILITY',
    metaTemplateId: null,
    languages: ['ar'],
    body: `مرحباً {{1}}،\n\nمرّت {{2}} منذ آخر زيارتك لـ{{3}}. نتمنى تكون بخير وبصحة جيدة.\n\nلو تحب تحجز موعد متابعة، نحن هنا.\n\nللرد بـ "إيقاف" لعدم استقبال رسائل لاحقاً.`,
    footer: 'Aooda · رسالة من عيادتك',
    variablesSchema: z.object({
      1: firstName,
      2: timeSinceText,
      3: clinicName,
    }),
    buttons: [
      { type: 'QUICK_REPLY', text: 'أبي أحجز' },
      { type: 'QUICK_REPLY', text: 'ذكّروني لاحقاً' },
    ],
    appliesWhen: (ctx) =>
      !ctx.hasOptedOut && ctx.daysSinceLastVisit !== null && ctx.daysSinceLastVisit >= 90,
    priority: 10,
  },

  {
    slug: 'recall_with_offer_v1',
    displayName: 'تذكير مريض نائم + عرض',
    category: 'MARKETING',
    metaTemplateId: null,
    languages: ['ar'],
    body: `مرحباً {{1}}،\n\nنتذكر زيارتك الأخيرة لـ{{2}} قبل {{3}}.\n\nكعملاء كرام نعطيك خصم {{4}}% على {{5}} هذا الشهر.\n\nلمعرفة التفاصيل، اضغط الزر.\n\nللرد بـ "إيقاف" لعدم استقبال عروض لاحقاً.`,
    variablesSchema: z.object({
      1: firstName,
      2: clinicName,
      3: timeSinceText,
      4: z.number().int().min(5).max(30),
      5: z.string().trim().min(1).max(80),
    }),
    buttons: [{ type: 'URL', text: 'التفاصيل', urlPlaceholder: '{{6}}' }],
    appliesWhen: (ctx) =>
      !ctx.hasOptedOut &&
      ctx.clinicHasActiveOffer &&
      ctx.daysSinceLastVisit !== null &&
      ctx.daysSinceLastVisit >= 90,
    priority: 15,
  },

  {
    slug: 'health_reminder_seasonal_v1',
    displayName: 'تذكير صحي (دوري)',
    category: 'UTILITY',
    metaTemplateId: null,
    languages: ['ar'],
    body: `مرحباً {{1}}،\n\nمرّت {{2}} منذ آخر فحص لك في {{3}}.\n\nالتوصية الطبية: فحص ونظافة كل 6 أشهر للحفاظ على صحة أسنانك.\n\nنحب نذكّرك بحجز موعد متابعة.\n\nللرد بـ "إيقاف" لعدم استقبال تذكيرات صحية لاحقاً.`,
    variablesSchema: z.object({
      1: firstName,
      2: timeSinceText,
      3: clinicName,
    }),
    buttons: [
      { type: 'QUICK_REPLY', text: 'أحجز' },
      { type: 'QUICK_REPLY', text: 'ذكّروني الشهر القادم' },
    ],
    appliesWhen: (ctx) =>
      !ctx.hasOptedOut && ctx.daysSinceLastVisit !== null && ctx.daysSinceLastVisit >= 180,
    priority: 8,
  },

  {
    slug: 'birthday_v1',
    displayName: 'تهنئة عيد ميلاد',
    category: 'MARKETING',
    metaTemplateId: null,
    languages: ['ar'],
    body: `كل عام وأنت بخير {{1}}!\n\nمن عيادة {{2}}، نتمنى لك سنة جديدة مليئة بالصحة والسعادة.\n\nكهدية، خصم {{3}}% على أي خدمة هذا الأسبوع.\n\nللرد بـ "إيقاف" لعدم استقبال رسائل لاحقاً.`,
    variablesSchema: z.object({
      1: firstName,
      2: clinicName,
      3: z.number().int().min(5).max(25),
    }),
    appliesWhen: (ctx) => !ctx.hasOptedOut && ctx.isBirthdayThisWeek,
    priority: 20,
  },

  {
    slug: 'custom_clinic_message_v1',
    displayName: 'رسالة مخصصة من العيادة',
    category: 'MARKETING',
    metaTemplateId: null,
    languages: ['ar'],
    body: `مرحباً {{1}}،\n\n{{2}}\n\nمن عيادة {{3}}.\n\nللرد بـ "إيقاف" لعدم استقبال رسائل لاحقاً.`,
    variablesSchema: z.object({
      1: firstName,
      2: z.string().trim().min(10).max(800),
      3: clinicName,
    }),
    appliesWhen: () => false, // Only fires when clinic explicitly authors — never auto-selected.
    priority: 0,
  },

  {
    slug: 'post_visit_followup_v1',
    displayName: 'متابعة ما بعد الزيارة',
    category: 'UTILITY',
    metaTemplateId: null,
    languages: ['ar'],
    body: `مرحباً {{1}}،\n\nنتمنى تكون بخير بعد زيارتك لـ{{2}} يوم {{3}}.\n\nلو احتجت أي استفسار أو موعد متابعة، نحن متاحون.\n\nللرد بـ "إيقاف" لعدم استقبال رسائل المتابعة لاحقاً.`,
    variablesSchema: z.object({
      1: firstName,
      2: clinicName,
      3: visitDayText,
    }),
    appliesWhen: (ctx) => !ctx.hasOptedOut && ctx.visitWasYesterdayOr2DaysAgo,
    priority: 25,
  },

  {
    slug: 'satisfaction_survey_v1',
    displayName: 'استبيان رضا',
    category: 'UTILITY',
    metaTemplateId: null,
    languages: ['ar'],
    body: `مرحباً {{1}}،\n\nكيف كانت تجربتك في {{2}} يوم {{3}}؟\n\nاختر تقييماً من 1 (سيء) إلى 5 (ممتاز).\n\nللرد بـ "إيقاف" لعدم استقبال استبيانات لاحقاً.`,
    variablesSchema: z.object({
      1: firstName,
      2: clinicName,
      3: visitDayText,
    }),
    buttons: [
      { type: 'QUICK_REPLY', text: 'ممتاز' },
      { type: 'QUICK_REPLY', text: 'جيد جداً' },
      { type: 'QUICK_REPLY', text: 'جيد' },
    ],
    appliesWhen: (ctx) =>
      !ctx.hasOptedOut &&
      ctx.daysSinceLastVisit !== null &&
      ctx.daysSinceLastVisit >= 2 &&
      ctx.daysSinceLastVisit <= 4,
    priority: 18,
  },

  {
    slug: 'opt_out_confirm_v1',
    displayName: 'تأكيد إيقاف',
    category: 'UTILITY',
    metaTemplateId: null,
    languages: ['ar'],
    body: `شكراً {{1}}.\n\nتم إيقاف الرسائل من عيادة {{2}}.\n\nلن تستقبل أي رسائل أخرى ما لم تحجز زيارة جديدة بنفسك.\n\nللعودة لاستقبال التذكيرات، أرسل كلمة "تفعيل".`,
    variablesSchema: z.object({
      1: firstName,
      2: clinicName,
    }),
    appliesWhen: (ctx) => ctx.hasReplyKeywordPending,
    priority: 100,
  },
]

/**
 * Pick the best template for this patient context.
 * Returns null if no template applies (= do not send).
 */
export function selectTemplate(ctx: TemplateSelectionContext): WhatsAppTemplate | null {
  const candidates = TEMPLATES.filter((t) => t.appliesWhen(ctx))
  if (candidates.length === 0) return null
  candidates.sort((a, b) => b.priority - a.priority)
  return candidates[0] ?? null
}

/**
 * Get a template by slug. Throws if not found — registry is authoritative.
 */
export function getTemplate(slug: string): WhatsAppTemplate {
  const t = TEMPLATES.find((x) => x.slug === slug)
  if (!t) throw new Error(`Unknown WhatsApp template slug: ${slug}`)
  return t
}

/**
 * Validate variables against the template's schema.
 * Returns parsed (and possibly coerced) variables, or throws ZodError.
 */
export function validateTemplateVariables(
  template: WhatsAppTemplate,
  variables: Record<string | number, unknown>,
): z.infer<typeof template.variablesSchema> {
  return template.variablesSchema.parse(variables) as z.infer<typeof template.variablesSchema>
}

/**
 * Render the body with variables substituted in.
 * Used for previews + audit logging. Production send goes through the BSP API.
 */
export function renderTemplate(
  template: WhatsAppTemplate,
  variables: Record<string | number, string | number>,
): string {
  return template.body.replace(/\{\{(\d+)\}\}/g, (_, idx) => {
    const v = variables[idx] ?? variables[Number(idx)]
    return v === undefined || v === null ? '' : String(v)
  })
}

/**
 * Safety check for the {{2}} body slot in custom_clinic_message_v1.
 * Rejects content with medical claims, prescriptions, false urgency, etc.
 */
export function cleanCustomMessage(
  raw: string,
): { ok: true; cleaned: string } | { ok: false; reason: string } {
  const trimmed = raw.trim()
  if (trimmed.length < 10) return { ok: false, reason: 'النص قصير جداً' }
  if (trimmed.length > 800) return { ok: false, reason: 'النص طويل جداً' }

  // Substring-based detection for Arabic + Latin mixed text. Avoid \b — it
  // does not behave reliably across Arabic word boundaries in JS regex.
  const forbiddenSubstrings = [
    'علاج ', // trailing space to avoid matching inside other words
    'دواء',
    'وصفة',
    'تشخيص',
    'مضمون',
    'عاجل',
    'آخر فرصة',
    'ذكاء اصطناعي',
    'http://',
    'https://',
  ]
  const lower = trimmed.toLowerCase()
  for (const s of forbiddenSubstrings) {
    if (trimmed.includes(s)) {
      return {
        ok: false,
        reason: `النص يحتوي على كلمة ممنوعة وفق سياسة Meta أو سياسة Aooda: ${s.trim()}`,
      }
    }
  }
  // Latin tokens — case-insensitive whole-token check using simple split
  const latinForbidden = ['claude', 'ai', 'gpt', 'chatbot']
  const tokens = lower.split(/[^a-z0-9]+/i).filter(Boolean)
  for (const tok of tokens) {
    if (latinForbidden.includes(tok)) {
      return {
        ok: false,
        reason: `النص يحتوي على كلمة ممنوعة وفق سياسة Meta أو سياسة Aooda: ${tok}`,
      }
    }
  }

  // Strip dangerous chars that could break Meta rendering.
  const cleaned = trimmed.replace(/[`{}]/g, '')
  return { ok: true, cleaned }
}
