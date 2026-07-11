'use client'

import { useEffect, useState } from 'react'
import { Trash, FunnelSimple } from '@phosphor-icons/react'
import { PAKET_LABELS } from '@/lib/pricing'
import { getOrders, clearOrders, type Order } from '@/lib/clientDb'

interface SalesHistoryProps {
  refreshKey?: number
  onSuccess?: () => void
}

interface GroupedOrders {
  [date: string]: Order[]
}

export default function SalesHistory({ refreshKey = 0, onSuccess }: SalesHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const fetchOrders = () => {
    try {
      const data = getOrders()
      setOrders(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [refreshKey])

  const clearHistory = () => {
    if (!confirm('Clear all sales history?')) return
    clearOrders()
    setOrders([])
    onSuccess?.()
  }

  const groupedOrders: GroupedOrders = orders.reduce((acc, order) => {
    const date = new Date(order.timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(order)
    return acc
  }, {} as GroupedOrders)

  const filteredOrders = selectedDate ? groupedOrders[selectedDate] || [] : orders

  if (loading) {
    return (
      <div className="bg-bg-surface border border-bg-border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-medium text-text-secondary uppercase">History</h2>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-6 bg-bg-border rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-bg-surface border border-bg-border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-medium text-text-secondary uppercase">History</h2>
          <button onClick={clearHistory} className="text-text-secondary hover:text-error">
            <Trash size={14} />
          </button>
        </div>
        <p className="text-text-secondary text-xs text-center py-4">No sales</p>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface border border-bg-border rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xs font-medium text-text-secondary uppercase">History</h2>
        <div className="flex items-center gap-2">
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-[10px] text-accent hover:text-accent-hover"
            >
              Clear filter
            </button>
          )}
          <button onClick={clearHistory} className="text-text-secondary hover:text-error">
            <Trash size={14} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-2 overflow-x-auto scrollbar-hide pb-1">
        {Object.keys(groupedOrders).map(date => (
          <button
            key={date}
            onClick={() => setSelectedDate(selectedDate === date ? null : date)}
            className={`px-2 py-1 rounded text-[10px] whitespace-nowrap ${
              selectedDate === date
                ? 'bg-accent text-bg-primary'
                : 'bg-bg-primary text-text-secondary hover:bg-bg-border'
            }`}
          >
            {date}
          </button>
        ))}
      </div>

      <div className="space-y-1 max-h-[150px] overflow-y-auto scrollbar-hide">
        {(selectedDate ? filteredOrders : orders.slice(0, 50)).map(order => {
          const time = new Date(order.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          })
          return (
            <div key={order.id} className="flex justify-between items-center p-2 bg-bg-primary rounded text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-text-secondary font-mono shrink-0">{time}</span>
                <span className="text-text-primary truncate">
                  {PAKET_LABELS[order.paket_type as keyof typeof PAKET_LABELS]?.replace('PAKET ', '')}
                  {order.quantity > 1 && <span className="text-accent ml-1">x{order.quantity}</span>}
                </span>
                {order.notes && (
                  <span className="text-text-secondary truncate text-[10px] italic hidden sm:inline">({order.notes})</span>
                )}
              </div>
              <span className="font-mono text-accent shrink-0 ml-2">
                ${order.total.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
      {!selectedDate && orders.length > 50 && (
        <p className="text-[10px] text-text-secondary text-center mt-2">+{orders.length - 50} more</p>
      )}
    </div>
  )
}
