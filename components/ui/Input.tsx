'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            h-10 px-3 rounded-lg bg-bg-surface border border-bg-border
            text-text-primary placeholder:text-text-secondary/50
            focus:outline-none focus:border-accent transition-colors
            ${error ? 'border-error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
