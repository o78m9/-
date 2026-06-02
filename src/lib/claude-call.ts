import Anthropic from '@anthropic-ai/sdk'
import * as Sentry from '@sentry/nextjs'

/**
 * CTO fix: wrapped Anthropic call with retry-on-transient, idempotency key, and
 * Sentry span instrumentation. Replaces ad-hoc `client.messages.create({...})`
 * calls in src/lib/claude.ts and src/app/api/generate-message/route.ts.
 *
 * Retry policy:
 *   - 429 (rate limit) → retry with exponential backoff (250ms, 1s, 4s)
 *   - 529 (overloaded) → retry with exponential backoff
 *   - 5xx               → retry with exponential backoff
 *   - Other 4xx        → fail fast, no retry
 *   - Network errors   → retry
 *
 * Idempotency: caller supplies `idempotencyKey` so a retry doesn't double-bill
 * if the original 5xx response actually completed server-side before timing out.
 *
 * Observability: every call gets a Sentry span with `model`, `clinicId`, the
 * estimated token count, and final usage on success.
 */

const client = new Anthropic()

interface CallParams {
  model: string
  max_tokens: number
  system: Parameters<typeof client.messages.create>[0]['system']
  messages: Parameters<typeof client.messages.create>[0]['messages']
  idempotencyKey: string
  clinicId: string
  spanName: string
}

const TRANSIENT_STATUSES = new Set([429, 529, 500, 502, 503, 504])
const MAX_RETRIES = 2 // first attempt + 2 retries = 3 tries total
const BACKOFF_MS = [250, 1000, 4000]

export async function callClaudeWithRetry(
  params: CallParams,
): Promise<Awaited<ReturnType<typeof client.messages.create>>> {
  const { model, max_tokens, system, messages, idempotencyKey, clinicId, spanName } = params

  return Sentry.startSpan(
    {
      op: 'claude.request',
      name: spanName,
      attributes: {
        'claude.model': model,
        'claude.max_tokens': max_tokens,
        'aooda.clinic_id': clinicId,
        'aooda.idempotency_key': idempotencyKey,
      },
    },
    async () => {
      let lastErr: unknown = null
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const response = await client.messages.create(
            { model, max_tokens, system, messages },
            { headers: { 'idempotency-key': idempotencyKey } },
          )
          // Attach usage to the span for cost-attribution dashboards.
          const span = Sentry.getActiveSpan()
          if (span) {
            span.setAttribute('claude.input_tokens', response.usage.input_tokens)
            span.setAttribute('claude.output_tokens', response.usage.output_tokens)
          }
          if (attempt > 0) {
            Sentry.captureMessage('claude-retry-succeeded', {
              level: 'info',
              tags: { clinicId },
              extra: { attempt, model },
            })
          }
          return response
        } catch (err: unknown) {
          lastErr = err
          const status =
            typeof err === 'object' && err && 'status' in err
              ? (err as { status: number }).status
              : 0
          const isTransient = TRANSIENT_STATUSES.has(status) || status === 0
          if (!isTransient || attempt === MAX_RETRIES) {
            Sentry.captureException(err, {
              tags: { component: 'claude-call', clinicId, model },
              extra: { attempt, status },
            })
            throw err
          }
          // Backoff with full jitter to avoid retry thundering herd.
          const base = BACKOFF_MS[attempt] ?? 4000
          const jitter = Math.floor(Math.random() * base)
          await new Promise((r) => setTimeout(r, base + jitter))
        }
      }
      throw lastErr
    },
  )
}

export function makeIdempotencyKey(parts: Array<string | number | null | undefined>): string {
  const seed = parts
    .map((p) => (p == null ? '' : String(p)))
    .join('|')
    .slice(0, 240)
  // Don't need crypto strength — just stable per logical request.
  return `aooda:${seed}`
}
