import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import type { ImportedCustomer } from '@/types'

const client = new Anthropic()

// Zod schema to validate every record Claude returns — prevents malicious AI output
// from injecting unexpected fields into the database.
const ImportedCustomerSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[\d+\s\-().]+$/, 'Invalid phone'),
  last_visit: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
    .nullable()
    .optional(),
  notes: z.string().max(1000).nullable().optional(),
})

const ImportedCustomersArraySchema = z.array(ImportedCustomerSchema).max(500)

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
        // Clearly separate system instructions from user data to reduce prompt injection surface
        content: `Extract all patient records from this data. Output only the JSON array, nothing else:\n\n<data>\n${rawText}\n</data>`,
      },
    ],
  })

  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Unexpected response type from Claude')

  let rawParsed: unknown
  try {
    rawParsed = JSON.parse(content.text)
  } catch {
    throw new Error('Claude returned invalid JSON')
  }

  // Validate the shape of every returned record — reject unexpected fields,
  // enforce field types and lengths to prevent prompt injection side effects.
  const validated = ImportedCustomersArraySchema.safeParse(rawParsed)
  if (!validated.success) {
    throw new Error(`Claude output failed validation: ${validated.error.message}`)
  }

  return validated.data as ImportedCustomer[]
}
