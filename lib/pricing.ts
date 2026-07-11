export type PaketType = 'reguler' | 'custom' | 'delivery' | 'custom_delivery' | 'apipi' | 'catering'

export const PAKET_TYPES: PaketType[] = ['reguler', 'custom', 'delivery', 'custom_delivery', 'apipi', 'catering']

interface PaketConfig {
  base: number
  delivery?: number
}

export const PAKET_PRICES: Record<PaketType, PaketConfig> = {
  reguler: { base: 700 },
  custom: { base: 800 },
  delivery: { base: 700, delivery: 100 },
  custom_delivery: { base: 800, delivery: 100 },
  apipi: { base: 1000 },
  catering: { base: 600 },
}

export const PAKET_LABELS: Record<PaketType, string> = {
  reguler: 'PAKET REGULER',
  custom: 'PAKET CUSTOM',
  delivery: 'PAKET DELIVERY',
  custom_delivery: 'PAKET CUSTOM DELIVERY',
  apipi: 'PAKET APIPI',
  catering: 'PAKET CATERING',
}

export interface PriceBreakdown {
  base: number
  tax: number
  delivery: number
  total: number
  companyCut: number
  staffCut: number
}

export function calculatePrice(paket: PaketType): PriceBreakdown {
  const config = PAKET_PRICES[paket]
  const tax = Math.round(config.base * 0.05)
  const delivery = config.delivery || 0
  const total = config.base + tax + delivery
  const companyCut = Math.round(config.base * 0.70)
  const staffCut = Math.round(config.base * 0.30) + delivery

  return { base: config.base, tax, delivery, total, companyCut, staffCut }
}
