/**
 * CPS-008 fix: Sentry PII redaction helper.
 *
 * Aooda handles patient PII (phone, name, notes — often Arabic). Unhandled
 * exceptions in /api/customers, /api/import, /api/generate-message carry the
 * request body. Without redaction, Sentry receives PII — a PDPL/GDPR sub-
 * processor finding waiting to happen.
 *
 * Applied via `beforeSend` and `beforeSendTransaction` hooks in all three
 * Sentry config files (client, server, edge).
 */

import type { Event } from '@sentry/nextjs'

const PHONE_RE = /(?:\+?\d[\d\s\-().]{6,18})/g
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g

export function redactPii<T extends Event>(event: T): T {
  try {
    const json = JSON.stringify(event)
      .replace(PHONE_RE, '<PHONE_REDACTED>')
      .replace(EMAIL_RE, '<EMAIL_REDACTED>')
    return JSON.parse(json) as T
  } catch {
    return event
  }
}
