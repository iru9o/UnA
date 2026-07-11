'use client'

import { useEffect, useState, useRef } from 'react'
import { PAKET_LABELS } from '@/lib/pricing'
import { getTodayStats, getAllStats, type DailyStats } from '@/lib/clientDb'

interface SalesDisplayProps {
  refreshKey?: number
}

export default function SalesDisplay({ refreshKey = 0 }: SalesDisplayProps) {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null)
  const [totalStats, setTotalStats] = useState<DailyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const prevKeyRef = useRef(refreshKey)

  const fetchStats = async () => {
    try {
      const today = getTodayStats()
      const total = getAllStats()
      setTodayStats(today)
      setTotalStats(total)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (prevKeyRef.current !== refreshKey) {
      prevKeyRef.current = refreshKey
    }
    fetchStats()
  }, [refreshKey])

  if (isLoading && !todayStats) {
    return (
      <div className="space-y-2">
        <div className="h-16 bg-bg-surface border border-bg-border rounded-lg animate-pulse" />
        <div className="h-16 bg-bg-surface border border-bg-border rounded-lg animate-pulse" />
      </div>
    )
  }

  const renderStats = (stats: DailyStats, title: string) => {
    const paketList = (['reguler', 'custom', 'delivery', 'custom_delivery', 'apipi', 'catering'] as const)
      .map(type => {
        const data = stats[type as keyof typeof stats] as { count: number; base: number } | undefined
        if (!data || data.count === 0) return null
        return { type, count: data.count }
      })
      .filter(Boolean)

    return (
      <div className="bg-bg-surface border border-bg-border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-text-secondary uppercase">{title}</span>
          <span className="font-mono text-accent font-bold text-sm md:text-base">
            ${(stats.totalRevenue + stats.totalTax + stats.totalDelivery).toLocaleString()}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {paketList.map(p => p && (
            <span key={p.type} className="px-2 py-0.5 bg-bg-primary rounded text-[10px] md:text-xs">
              <span className="text-text-secondary">{PAKET_LABELS[p.type as keyof typeof PAKET_LABELS].replace('PAKET ', '')}</span>
              <span className="text-accent ml-1">{p.count}x</span>
            </span>
          ))}
        </div>
        <div className="flex justify-between text-[10px] md:text-xs pt-1 border-t border-bg-border">
          <span className="text-text-secondary">Comp: ${stats.companyCut.toLocaleString()}</span>
          <span className="text-success">Staff: ${(stats.staffCut + stats.totalDelivery).toLocaleString()}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {todayStats && renderStats(todayStats, 'Today Sales')}
      {totalStats && renderStats(totalStats, 'Total Sales')}
    </div>
  )
}
