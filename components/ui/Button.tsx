'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'motion/react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

    const variants = {
      primary: 'bg-accent text-bg-primary hover:bg-accent-hover',
      secondary: 'bg-transparent border border-accent text-accent hover:bg-accent/10'
    }

    const { disabled, type, onClick, style, title } = props

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={disabled}
        type={type}
        onClick={onClick}
        style={style}
        title={title}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
export default Button
