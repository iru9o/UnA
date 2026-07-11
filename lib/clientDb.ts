import { calculatePrice, type PaketType } from './pricing'
import { getJakartaDateString, getJakartaDayName } from './date'
import { getTodayMenu, getApipiMenu, DAILY_MENU, type DailyMenuOptions } from './menu'

export interface Order {
  id: number
  timestamp: string
  paket_type: string
  quantity: number
  base_price: number
  tax: number
  delivery_fee: number
  total: number
  notes: string | null
}

export interface DailyStats {
  reguler: { count: number; base: number }
  custom: { count: number; base: number }
  delivery: { count: number; base: number; delivery: number }
  custom_delivery: { count: number; base: number; delivery: number }
  apipi: { count: number; base: number }
  catering: { count: number; base: number }
  totalRevenue: number
  totalTax: number
  totalDelivery: number
  companyCut: number
  staffCut: number
}

const STORAGE_KEY = 'up_n_atom_orders'

const isBrowser = typeof window !== 'undefined'

export function getOrders(): Order[] {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Order[]
    return parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (e) {
    console.error('Failed to parse orders from localStorage', e)
    return []
  }
}

export function insertOrder(
  paket_type: PaketType,
  quantity: number = 1,
  notes: string = ''
): Order {
  const qty = Math.max(1, Math.min(9999, quantity))
  const price = calculatePrice(paket_type)
  const timestamp = new Date().toISOString()

  const currentOrders = getOrders()
  const nextId = currentOrders.length > 0 ? Math.max(...currentOrders.map(o => o.id)) + 1 : 1

  const newOrder: Order = {
    id: nextId,
    timestamp,
    paket_type,
    quantity: qty,
    base_price: price.base * qty,
    tax: price.tax * qty,
    delivery_fee: price.delivery * qty,
    total: price.total * qty,
    notes: notes || null,
  }

  if (isBrowser) {
    const updated = [newOrder, ...currentOrders]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return newOrder
}

export function calculateStatsForOrders(orders: Order[]): DailyStats {
  const result: DailyStats = {
    reguler: { count: 0, base: 0 },
    custom: { count: 0, base: 0 },
    delivery: { count: 0, base: 0, delivery: 0 },
    custom_delivery: { count: 0, base: 0, delivery: 0 },
    apipi: { count: 0, base: 0 },
    catering: { count: 0, base: 0 },
    totalRevenue: 0,
    totalTax: 0,
    totalDelivery: 0,
    companyCut: 0,
    staffCut: 0,
  }

  orders.forEach(order => {
    const type = order.paket_type as PaketType
    if (result[type as keyof typeof result]) {
      const data = result[type as keyof typeof result] as any
      data.count += order.quantity
      data.base += order.base_price
      if (order.delivery_fee) {
        data.delivery += order.delivery_fee
      }

      result.totalTax += order.tax
      result.totalDelivery += order.delivery_fee
      result.companyCut += Math.round(order.base_price * 0.70)
      result.staffCut += Math.round(order.base_price * 0.30)
    }
  })

  result.totalRevenue =
    result.reguler.base +
    result.custom.base +
    result.delivery.base +
    result.custom_delivery.base +
    result.apipi.base +
    result.catering.base

  return result
}

export function getTodayStats(): DailyStats {
  const today = getJakartaDateString()
  const allOrders = getOrders()
  const todayOrders = allOrders.filter(o => o.timestamp.startsWith(today))
  return calculateStatsForOrders(todayOrders)
}

export function getAllStats(): DailyStats {
  const allOrders = getOrders()
  return calculateStatsForOrders(allOrders)
}

export function clearOrders(): void {
  if (isBrowser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  }
}

export function getTodayMenuData() {
  const dayName = getJakartaDayName()
  const isSunday = dayName === 'Minggu'
  const sundayOptions = isSunday ? DAILY_MENU.Minggu as DailyMenuOptions : null
  const apipiOptions = DAILY_MENU.Menu_Apipi as DailyMenuOptions

  return {
    today: getTodayMenu(),
    apipi: getApipiMenu(),
    sundayOptions,
    apipiOptions,
    isSunday,
  }
}
