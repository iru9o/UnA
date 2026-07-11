'use client'

import { useState, useEffect, useRef } from 'react'
import Button from './ui/Button'
import Select from './ui/Select'
import Card from './ui/Card'
import { PAKET_LABELS, calculatePrice, type PaketType } from '@/lib/pricing'
import { insertOrder } from '@/lib/clientDb'

interface RecordSaleFormProps {
  onSuccess?: () => void
}

const paketOptions = Object.entries(PAKET_LABELS).map(([value, label]) => ({
  value,
  label
}))

export default function RecordSaleForm({ onSuccess }: RecordSaleFormProps) {
  const [paket, setPaket] = useState<PaketType>('reguler')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState(calculatePrice('reguler'))
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
      }
      if (e.key === 'Enter' && !e.shiftKey && document.activeElement?.tagName !== 'BUTTON') {
        const target = e.target as HTMLElement
        if (!target.closest('form')) return
        e.preventDefault()
        formRef.current?.requestSubmit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handlePaketChange = (value: string) => {
    setPaket(value as PaketType)
    setPreview(calculatePrice(value as PaketType))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      insertOrder(paket, quantity, notes)
      setNotes('')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record sale')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-2">
        <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wide">Record Sale</h2>

        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <Select
              id="paket"
              label="Paket"
              options={paketOptions}
              value={paket}
              onChange={e => handlePaketChange(e.target.value)}
            />
          </div>
          <div className="w-16">
            <label className="block text-[10px] text-text-secondary mb-0.5">Qty</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-8 px-1 text-xs rounded bg-bg-primary border border-bg-border text-text-primary text-center font-mono focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="p-1.5 bg-bg-primary rounded text-[10px] space-y-0.5">
          <div className="flex justify-between">
            <span className="text-text-secondary">{quantity}x Base</span>
            <span className="font-mono text-text-primary">${(preview.base * quantity).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-text-secondary">Tax (5%)</span>
            <span className="font-mono text-text-secondary">+${(preview.tax * quantity).toFixed(2)}</span>
          </div>
          {preview.delivery > 0 && (
            <div className="flex justify-between text-[9px]">
              <span className="text-text-secondary">Delivery</span>
              <span className="font-mono text-success">+${(preview.delivery * quantity).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-0.5 border-t border-bg-border font-medium">
            <span className="text-text-primary">Total</span>
            <span className="font-mono text-accent">${(preview.total * quantity).toFixed(2)}</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full h-8 px-2 text-xs rounded bg-bg-primary border border-bg-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
        />

        {error && (
          <div className="p-1.5 bg-error/20 border border-error/30 rounded text-[10px] text-error text-center">
            {error}
          </div>
        )}

        <Button type="submit" disabled={submitting} className="w-full text-xs">
          {submitting ? '...' : 'Record Sale'}
        </Button>
        <p className="text-[9px] text-text-secondary/60 text-center">Press Enter to submit</p>
      </form>
    </Card>
  )
}
