import { z } from 'zod'

export const captureSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف مطلوب'),
  visit_type: z.string().min(1, 'اختر نوع الزيارة'),
  notes: z.string().optional(),
})

export type CaptureFormData = z.infer<typeof captureSchema>
