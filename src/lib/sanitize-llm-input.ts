/**
 * PIR-001 / PIR-002 / PIR-003 / PIR-004 fix: sanitize untrusted text before
 * interpolation into a Claude prompt.
 *
 * Three layers of defense applied here:
 *  1. Strip newlines + carriage returns (kills "\n\n---\nSYSTEM:" role-shifts)
 *  2. Strip Unicode bidi-override + tag block invisibles (kills RTL spoofing
 *     and U+E0000..U+E007F invisible-instruction smuggling)
 *  3. Soften instruction-shaped tokens (SYSTEM:, USER:, ASSISTANT:, IGNORE,
 *     OVERRIDE) by inserting a zero-width separator so they don't read as
 *     directives to the model
 *  4. Strip URLs (so the model can't be tricked into echoing attacker URLs
 *     into outbound WhatsApp messages)
 *  5. Replace stray backticks / double-quotes that could close a wrapper
 *  6. Hard cap to limit prompt-stuffing
 *
 * Pair with `<untrusted-customer-data>` framing in the user message + a SECURITY
 * clause in the system prompt that explicitly tells Claude to treat content
 * inside the tag as data, not instructions.
 */

const BIDI_AND_INVISIBLES = /[‪-‮⁦-⁩﻿​-‏\u{E0000}-\u{E007F}]/gu
const INSTRUCTION_TOKEN = /\b(SYSTEM|USER|ASSISTANT|IGNORE|OVERRIDE|FORGET|BYPASS|JAILBREAK)\s*:/giu
const URL_LIKE = /https?:\/\/\S+/giu

export function sanitizeForLlmContext(s: string | null | undefined, maxLen = 200): string {
  if (s == null) return ''
  return s
    .replace(BIDI_AND_INVISIBLES, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[`"\\]/g, "'")
    .replace(/-{3,}/g, '—') // em-dash, kills section-break role-shifts
    .replace(INSTRUCTION_TOKEN, '$1​:') // zero-width separator
    .replace(URL_LIKE, '[URL_REMOVED]')
    .trim()
    .slice(0, maxLen)
}

/**
 * Stricter variant for fields that MUST become a single short token (e.g. names
 * appearing inside a WhatsApp template variable).
 */
export function sanitizeForLlmName(s: string | null | undefined, maxLen = 80): string {
  return sanitizeForLlmContext(s, maxLen).replace(/\s+/g, ' ')
}
