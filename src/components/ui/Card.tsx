'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-slate-900 shadow-md',
      bordered: 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-sm',
    }

    return (
      <div
        ref={ref}
        className={`rounded-lg p-4 ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
