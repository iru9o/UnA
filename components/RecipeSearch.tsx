'use client'

import { useState, useEffect } from 'react'
import { X, CaretDown, CaretUp } from '@phosphor-icons/react'
import { recipes, type Recipe } from '@/lib/recipes'

export default function RecipeSearch() {
  const [query, setQuery] = useState('')
  const [station, setStation] = useState<string>('')
  const [results, setResults] = useState<Recipe[]>(recipes)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const q = query.toLowerCase()
    setResults(recipes.filter(r => {
      const matchQuery = !q || r.name.toLowerCase().includes(q) ||
        r.ingredients?.some(i => i.name.toLowerCase().includes(q))
      const matchStation = !station || r.station === station
      return matchQuery && matchStation
    }))
  }, [query, station])

  const stations = [
    { value: '', label: 'All' },
    { value: 'cutting_board', label: 'Cutting' },
    { value: 'fry_station', label: 'Fry' },
    { value: 'drink_station', label: 'Drink' },
    { value: 'stove', label: 'Stove' },
  ]

  const toggleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name)
  }

  return (
    <div className="bg-bg-surface border border-bg-border rounded-lg p-4 space-y-3">
      <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
        Recipe Search
      </h2>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            id="search-input"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full h-8 pl-2 pr-6 text-sm rounded bg-bg-primary border border-bg-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-1 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={station}
          onChange={e => setStation(e.target.value)}
          className="h-8 px-2 text-sm rounded bg-bg-primary border border-bg-border text-text-primary focus:outline-none focus:border-accent"
        >
          {stations.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1 max-h-[140px] overflow-y-auto scrollbar-hide">
        {results.slice(0, 30).map((recipe, i) => (
          <div key={`${recipe.name}-${i}`} className="text-xs">
            <button
              onClick={() => toggleExpand(recipe.name)}
              className="w-full flex items-center justify-between p-2 bg-bg-primary rounded hover:bg-bg-border/50 transition-colors"
            >
              <span className="text-text-primary font-medium">{recipe.name}</span>
              <div className="flex items-center gap-2">
                <span className={`px-1 rounded text-[10px] ${
                  recipe.station === 'cutting_board' ? 'bg-green-500/20 text-green-400' :
                  recipe.station === 'fry_station' ? 'bg-amber-500/20 text-amber-400' :
                  recipe.station === 'drink_station' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-rose-500/20 text-rose-400'
                }`}>
                  {recipe.station.replace('_', ' ')}
                </span>
                {expanded === recipe.name ? <CaretUp size={10} /> : <CaretDown size={10} />}
              </div>
            </button>
            {expanded === recipe.name && (
              <div className="mt-1 p-2 bg-bg-primary rounded text-text-secondary text-[10px] space-y-1">
                {recipe.ingredients && <div>{recipe.ingredients.map(i => `${i.name} ${i.amount}x`).join(' + ')}</div>}
                {recipe.utensil && <div className="text-accent/70">Tool: {recipe.utensil}</div>}
                {recipe.duration && <div className="text-accent">Time: {recipe.duration}s</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length > 30 && (
        <p className="text-[10px] text-text-secondary text-center">30/{results.length}</p>
      )}
    </div>
  )
}
