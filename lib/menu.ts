import { recipes } from './recipes'
import { getJakartaDayName } from './date'

interface DailyMenuItem {
  food: string
  drink: string
}

export interface DailyMenuOptions {
  food_options: string[]
  drink_options: string[]
}

type DailyMenu = Record<string, DailyMenuItem | DailyMenuOptions>

export const DAILY_MENU: DailyMenu = {
  Senin: { food: 'Fajitas', drink: 'Iced Berry Manuka Americano' },
  Selasa: { food: 'Tacos Al Pastor', drink: 'Blue Lemon Soda' },
  Rabu: { food: 'Tostadas', drink: 'Mango Yakult Fizz' },
  Kamis: { food: 'Albondigas', drink: 'Strawberry Matcha Fusion' },
  Jumat: { food: 'Chakalaka & PAP', drink: 'Montblanc Creamy Latte' },
  Sabtu: { food: 'Bouillabaisse', drink: 'Purple Butterfly Pea Lemonade' },
  Minggu: {
    food_options: ['Cheesecake Strawberry', 'Cake Red Velvet', 'Zuppa Soup'],
    drink_options: ['Capuccino Latte', 'Sakura Jasmine Peach']
  },
  Menu_Apipi: {
    food_options: ['Cokelat Bucket Strawberry', 'Dubai Chewy Mochii', 'Lovey-Dovey Donuts', 'Pudding Lovely Bears'],
    drink_options: ['Ice Cream Strawberry', 'Ice Cream Cokelat Strawberry', 'Ice Cream Vanilla', 'Ice Cream Matcha']
  }
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export { DAYS }

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function findRecipe(name: string) {
  return recipes.find(r => r.name.toLowerCase() === name.toLowerCase())
}

export interface MenuWithDetails {
  food: string
  drink: string
  foodRecipe?: { ingredients?: { name: string; amount: number }[]; duration?: number }
  drinkRecipe?: { ingredients?: { name: string; amount: number }[]; duration?: number }
}

export function getTodayMenu(): MenuWithDetails {
  const dayName = getJakartaDayName()

  const menu = DAILY_MENU[dayName]

  if (!menu) {
    return { food: 'Menu not available', drink: 'Menu not available' }
  }

  if ('food_options' in menu) {
    const food = getRandomItem(menu.food_options)
    const drink = getRandomItem(menu.drink_options)
    return {
      food,
      drink,
      foodRecipe: findRecipe(food),
      drinkRecipe: findRecipe(drink)
    }
  }

  return {
    ...menu,
    foodRecipe: findRecipe(menu.food),
    drinkRecipe: findRecipe(menu.drink)
  }
}

export function getApipiMenu(): MenuWithDetails {
  const menu = DAILY_MENU.Menu_Apipi as DailyMenuOptions
  const food = getRandomItem(menu.food_options)
  const drink = getRandomItem(menu.drink_options)
  return {
    food,
    drink,
    foodRecipe: findRecipe(food),
    drinkRecipe: findRecipe(drink)
  }
}
