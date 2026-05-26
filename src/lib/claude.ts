import Anthropic from '@anthropic-ai/sdk'
import type { ImportedCustomer } from '@/types'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a data cleaning assistant for a dental clinic management system.
Extract patient records from messy, unstructured data (Excel exports, WhatsApp chats, handwritten notes, CSV, etc.).
Return ONLY a valid JSON array — no explanation, no markdown, no code fences. Just the raw JSON array.
Each object must have exactly these fields:
- name: string (patient full name)
- phone: string (normalize to Jordanian format 07XXXXXXXX, digits only)
- last_visit: string (YYYY-MM-DD format) or null if unknown
- notes: string or null

Rules:
- Deduplicate by phone number — keep the entry with the most recent last_visit
- If phone number is missing or invalid, skip that record
- Normalize Arabic names (remove extra spaces, consistent capitalization)
- If you cannot determine last_visit, set it to null`

export async function cleanImportData(rawText: string): Promise<ImportedCustomer[]> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } } as never],
    messages: [
      {
        role: 'user',
        content: `Extract all patient records from this data:\n\n${rawText}`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

  const parsed = JSON.parse(content.text) as ImportedCustomer[]
  if (!Array.isArray(parsed)) throw new Error('Claude returned non-array JSON')
  return parsed
}
