import { z } from 'zod'

const phone = z
  .string()
  .min(7)
  .max(20)
  .regex(/^\+?[\d\s\-().]+$/, 'Invalid phone number')

export const CustomerCreateSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  phone,
  visit_type: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
  clinic_id: z.string().uuid(),
})

export const ImportSchema = z.object({
  rawText: z.string().min(1).max(500_000),
  clinic_id: z.string().uuid(),
  confirm: z.boolean().optional().default(false),
})

export const GenerateMessageSchema = z.object({
  customers: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(200).trim(),
        last_visit: z.string().nullable().optional(),
        total_spent: z.number().nonnegative().optional(),
        notes: z.string().max(1000).nullable().optional(),
      }),
    )
    .min(1)
    .max(10),
  template: z.enum(['standard', 'offer', 'health', 'custom']),
  customMessage: z.string().max(500).optional(),
  clinicName: z.string().max(200).optional(),
})

export const BookingSchema = z.object({
  name: z.string().min(1).max(200).trim().optional(),
  email: z.string().email().max(320).optional(),
  phone: phone.optional(),
  clinicName: z.string().max(200).optional(),
  source: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
})
