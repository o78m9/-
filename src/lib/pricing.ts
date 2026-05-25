export const CURRENCIES = {
  SAR: { symbol: 'ر.س', name: 'ريال سعودي', rate: 5.3 },
  JOD: { symbol: 'د.أ', name: 'دينار أردني', rate: 1 },
  AED: { symbol: 'د.إ', name: 'درهم إماراتي', rate: 5.18 },
} as const

export type CurrencyKey = keyof typeof CURRENCIES

export const PLANS_BASE_JOD = {
  trial: 0,
  growth: 250,
  pro: 500,
} as const

export function formatPrice(amount: number, currency: CurrencyKey): string {
  const converted = Math.round(amount * CURRENCIES[currency].rate)
  return converted.toLocaleString('ar')
}
