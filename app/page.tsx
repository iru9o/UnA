'use client'

import { useState, useEffect } from 'react'
import { getTodayMenuData } from '@/lib/clientDb'
import Header from '@/components/Header'
import DailyMenu from '@/components/DailyMenu'
import Announce from '@/components/Announce'
import RecordSaleForm from '@/components/RecordSaleForm'
import SalesDisplay from '@/components/SalesDisplay'
import SalesHistory from '@/components/SalesHistory'
import RecipeSearch from '@/components/RecipeSearch'

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [menuData, setMenuData] = useState<any>(null)

  useEffect(() => {
    try {
      const d = getTodayMenuData()
      setMenuData(d)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleSaleSuccess = () => {
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="max-w-7xl mx-auto p-3 md:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          <div className="space-y-3">
            <div className="bg-bg-surface border border-bg-border rounded-lg p-3 md:p-4">
              <DailyMenu data={menuData} setData={setMenuData} />
            </div>
            <div className="bg-bg-surface border border-bg-border rounded-lg p-3">
              <Announce todayMenu={menuData?.today || null} />
            </div>
            <RecordSaleForm onSuccess={handleSaleSuccess} />
          </div>

          <div className="space-y-3">
            <SalesDisplay refreshKey={refreshKey} />
            <SalesHistory refreshKey={refreshKey} onSuccess={handleSaleSuccess} />
            <RecipeSearch />
          </div>
        </div>
      </main>
    </div>
  )
}
