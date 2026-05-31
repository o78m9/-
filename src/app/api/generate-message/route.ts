import { type NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { GenerateMessageSchema } from '@/lib/schemas'
import { logAudit } from '@/lib/audit'
import { createClient } from '@/features/auth/lib/server'
import {
  selectTemplate,
  renderTemplate,
  validateTemplateVariables,
  type TemplateSelectionContext,
} from '@/lib/whatsapp-templates'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a warm, professional dental clinic communication assistant.
Generate a brief WhatsApp message in Arabic (Jordanian dialect) to re-engage a customer who hasn't visited in a while.
Be friendly, not pushy. Reference their specific situation (name, time since last visit, amount spent).
Keep it under 50 words. Don't use emojis excessively (max 2).
Include a soft call-to-action at the end.
Return ONLY the message text. No labels, no formatting, no explanation.`

function daysSince(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.floor(diff / 86400000)
}

function templateContext(template: string): string {
  switch (template) {
    case 'offer':
      return 'You are running a special promotion: 20% discount this month. Mention the limited-time offer.'
    case 'health':
      return 'Focus on health reminder: regular checkups every 6 months are important for dental health.'
    case 'custom':
      return 'Use a friendly, personalized re-engagement tone.'
    default:
      return 'Use a warm, friendly reminder tone.'
  }
}

export async function POST(request: NextRequest) {
  const limited = await rateLimit(request, LIMITS.ai)
  if (limited) return limited

  // Require authenticated session — AI generation consumes paid API quota
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseConfigured && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = GenerateMessageSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { customers, template, customMessage, clinicName, useTemplates } = parsed.data

  const templateMode = useTemplates || process.env.WHATSAPP_TEMPLATE_MODE === 'enforced'

  // Template-based path: Meta 2026-01-15 compliant. No free-form generation.
  // Selects an approved template per patient context + substitutes variables.
  if (templateMode) {
    const messages = customers.slice(0, 3).map((customer) => {
      const days = daysSince(customer.last_visit)
      const ctx: TemplateSelectionContext = {
        daysSinceLastVisit: days,
        isBirthdayThisWeek: false, // wire to real birthday data when available
        hasRecentVisit: days !== null && days < 30,
        visitWasYesterdayOr2DaysAgo: days !== null && days >= 1 && days <= 2,
        hasOptedOut: false, // wire to message-log opt-out lookup
        hasReplyKeywordPending: false,
        clinicHasActiveOffer: template === 'offer',
        totalSpentJOD: customer.total_spent ?? 0,
      }
      const selected = selectTemplate(ctx)
      if (!selected) {
        return {
          customerId: customer.id,
          customerName: customer.name,
          lastVisit: customer.last_visit ?? null,
          templateSlug: null,
          message: null,
          reason: 'no template applies for this patient context',
        }
      }
      const variables = {
        1: customer.name.split(' ')[0] ?? customer.name,
        2:
          days === null
            ? 'فترة طويلة'
            : days >= 365
              ? `أكثر من سنة`
              : days >= 180
                ? 'ستة أشهر'
                : days >= 90
                  ? 'ثلاثة أشهر'
                  : `${days} يوم`,
        3: clinicName ?? 'عيادة الأسنان',
        ...(selected.slug === 'recall_with_offer_v1' ? { 4: 20, 5: 'تنظيف الأسنان' } : {}),
      } as Record<string | number, unknown>
      try {
        const validated = validateTemplateVariables(selected, variables)
        const rendered = renderTemplate(
          selected,
          validated as Record<string | number, string | number>,
        )
        return {
          customerId: customer.id,
          customerName: customer.name,
          lastVisit: customer.last_visit ?? null,
          templateSlug: selected.slug,
          metaTemplateId: selected.metaTemplateId,
          category: selected.category,
          variables: validated,
          message: rendered,
        }
      } catch (err) {
        return {
          customerId: customer.id,
          customerName: customer.name,
          lastVisit: customer.last_visit ?? null,
          templateSlug: selected.slug,
          message: null,
          reason: err instanceof Error ? err.message : 'variable validation failed',
        }
      }
    })

    await logAudit(request, {
      userId: user?.id ?? null,
      action: 'message.generate',
      resource: 'message',
      metadata: { mode: 'template', count: messages.length },
    })
    return NextResponse.json({ mode: 'template', messages })
  }

  // Legacy free-form path — kept for the demo flow only. Will be removed once
  // WHATSAPP_TEMPLATE_MODE=enforced is set in production env.
  try {
    const messages = await Promise.all(
      customers.slice(0, 3).map(async (customer) => {
        const days = daysSince(customer.last_visit)
        const daysText = days
          ? days > 365
            ? `more than a year ago (${Math.floor(days / 30)} months)`
            : `${days} days ago`
          : 'unknown time'

        // Strip double-quotes and backticks from customMessage to prevent a user from
        // closing the quoted string and injecting additional instructions into the prompt.
        const safeCustomMessage = customMessage?.replace(/["`]/g, "'")
        const context =
          template === 'custom' && safeCustomMessage
            ? `Custom message template: "${safeCustomMessage}". Adapt it for this specific customer.`
            : templateContext(template)

        const userMessage = `
Customer info:
- Name: ${customer.name}
- Last visit: ${customer.last_visit ?? 'unknown'} (${daysText})
- Total spent: ${customer.total_spent ?? 0} JD
- Notes: ${customer.notes ?? 'none'}
- Clinic name: ${clinicName ?? 'عيادة الأسنان'}

Template instruction: ${context}

Write the Arabic WhatsApp message now.`

        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 200,
          system: [
            { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
          ] as never,
          messages: [{ role: 'user', content: userMessage }],
        })

        const text = response.content[0]?.type === 'text' ? response.content[0].text.trim() : ''

        return {
          customerId: customer.id,
          customerName: customer.name,
          lastVisit: customer.last_visit ?? null,
          message: text,
        }
      }),
    )

    await logAudit(request, {
      userId: user?.id ?? null,
      action: 'message.generate',
      resource: 'message',
      metadata: { mode: 'legacy', template, count: messages.length },
    })
    return NextResponse.json({ mode: 'legacy', messages })
  } catch (err) {
    console.error('generate-message error:', err)
    return NextResponse.json({ error: 'Failed to generate messages' }, { status: 500 })
  }
}
