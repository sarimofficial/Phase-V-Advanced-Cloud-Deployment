'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full group">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 rounded-2xl
            transition-all duration-300 outline-none
            placeholder:text-gray-400 dark:placeholder:text-gray-600
            ${error
              ? 'border-red-500 ring-red-500/10'
              : 'border-gray-100 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'}
            disabled:bg-gray-50 dark:disabled:bg-slate-950 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 ml-1 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
