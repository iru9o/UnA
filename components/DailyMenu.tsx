'use client'

import { useEffect, useState } from 'react'
import { ForkKnife, BeerBottle, Clock, Shuffle } from '@phosphor-icons/react'
import { recipes } from '@/lib/recipes'
import { getTodayMenuData } from '@/lib/clientDb'

interface MenuWithDetails {
  food: string
  drink: string
  foodRecipe?: { ingredients?: { name: string; amount: number }[]; duration?: number }
  drinkRecipe?: { ingredients?: { name: string; amount: number }[]; duration?: number }
}

interface DailyMenuOptions {
  food_options: string[]
  drink_options: string[]
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function findRecipe(name: string) {
  return recipes.find(r => r.name.toLowerCase() === name.toLowerCase())
}

function MenuCard({ icon, item, recipe }: { icon: React.ReactNode; item: string; recipe?: MenuWithDetails['foodRecipe'] }) {
  return (
    <div className="bg-bg-primary rounded p-1.5">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="flex-shrink-0">{icon}</span>
        <span className="text-xs text-text-primary font-medium truncate flex-1">{item}</span>
        {recipe?.duration && (
          <span className="flex items-center gap-0.5 text-[9px] text-text-secondary flex-shrink-0">
            <Clock size={9} />{recipe.duration}s
          </span>
        )}
      </div>
      {recipe?.ingredients && (
        <p className="text-[9px] text-text-secondary pl-4 leading-tight">
          {recipe.ingredients.map((ing, i) => (
            <span key={i}>{ing.name} {ing.amount}x{ing.amount > 1 ? '' : ''}{i < recipe.ingredients!.length - 1 ? ', ' : ''}</span>
          ))}
        </p>
      )}
    </div>
  )
}

export default function DailyMenu() {
  const [data, setData] = useState<{
    today: MenuWithDetails
    apipi: MenuWithDetails
    sundayOptions: DailyMenuOptions | null
    apipiOptions: DailyMenuOptions
    isSunday: boolean
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const d = getTodayMenuData()
      setData(d)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const shuffleSunday = () => {
    if (!data?.sundayOptions) return
    const food = getRandomItem(data.sundayOptions.food_options)
    const drink = getRandomItem(data.sundayOptions.drink_options)
    setData(prev => prev ? {
      ...prev,
      today: {
        food,
        drink,
        foodRecipe: findRecipe(food),
        drinkRecipe: findRecipe(drink)
      }
    } : null)
  }

  const shuffleApipi = () => {
    if (!data?.apipiOptions) return
    const food = getRandomItem(data.apipiOptions.food_options)
    const drink = getRandomItem(data.apipiOptions.drink_options)
    setData(prev => prev ? {
      ...prev,
      apipi: {
        food,
        drink,
        foodRecipe: findRecipe(food),
        drinkRecipe: findRecipe(drink)
      }
    } : null)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-3 w-20 bg-bg-border rounded" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-8 bg-bg-border rounded" />
          <div className="h-8 bg-bg-border rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Today Menu
          {data?.isSunday && <span className="ml-1.5 text-[10px] font-normal text-accent">(Random)</span>}
        </h2>
        {data?.isSunday && (
          <button onClick={shuffleSunday} className="p-1 hover:bg-bg-border rounded" title="Shuffle">
            <Shuffle size={12} className="text-text-secondary" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <MenuCard icon={<ForkKnife size={11} className="text-accent" weight="fill" />} item={data?.today.food || ''} recipe={data?.today.foodRecipe} />
        <MenuCard icon={<BeerBottle size={11} className="text-accent" weight="fill" />} item={data?.today.drink || ''} recipe={data?.today.drinkRecipe} />
      </div>

      <div className="border-t border-bg-border pt-2">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wide">Menu Apipi</h2>
          <button onClick={shuffleApipi} className="p-1 hover:bg-bg-border rounded" title="Shuffle">
            <Shuffle size={12} className="text-accent" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <MenuCard icon={<ForkKnife size={11} className="text-accent" weight="fill" />} item={data?.apipi.food || ''} recipe={data?.apipi.foodRecipe} />
          <MenuCard icon={<BeerBottle size={11} className="text-accent" weight="fill" />} item={data?.apipi.drink || ''} recipe={data?.apipi.drinkRecipe} />
        </div>
      </div>
    </div>
  )
}
