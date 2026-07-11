'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from '@phosphor-icons/react'
import { useTheme } from './ThemeProvider'

function AtomLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="3.5" fill="#e84040" />
      <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#f0c040" strokeWidth="1.8" fill="none" transform="rotate(0 16 16)" />
      <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#f0c040" strokeWidth="1.8" fill="none" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#f0c040" strokeWidth="1.8" fill="none" transform="rotate(-60 16 16)" />
      <circle cx="29" cy="16" r="2.2" fill="#e84040" />
      <circle cx="3.5" cy="22" r="2.2" fill="#e84040" />
      <circle cx="3.5" cy="10" r="2.2" fill="#e84040" />
    </svg>
  )
}

export default function Header() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
      setDate(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-bg-border">
      <div className="flex items-center gap-3">
        <AtomLogo size={32} />
        <h1 className="text-lg font-bold text-accent">Up n Atom Kitchen</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-text-secondary">{date}</p>
          <p className="text-sm font-mono text-accent">{time}</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded hover:bg-bg-border transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} className="text-accent" /> : <Moon size={18} className="text-accent" />}
        </button>
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-accent/20 text-accent">
          Kitchen Staff
        </span>
      </div>
    </header>
  )
}
