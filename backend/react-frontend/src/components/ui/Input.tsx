import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export default function Input({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = props.value || props.defaultValue

  return (
    <div className={cn('relative', { 'w-full': fullWidth })}>
      {/* Input Container */}
      <div className="relative">
        {/* Icon Left */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          className={cn(
            // Base styles
            'w-full px-4 py-3 rounded-xl',
            'border-2 border-gray-200',
            'bg-white text-gray-900',
            'transition-all duration-200',
            'placeholder-transparent',
            'focus:outline-none focus:ring-4 focus:ring-primary-500/20',
            'disabled:bg-gray-50 disabled:cursor-not-allowed',
            
            // With icon
            {
              'pl-12': icon && iconPosition === 'left',
              'pr-12': icon && iconPosition === 'right',
            },
            
            // With label (add padding for floating label)
            {
              'pt-6 pb-2': label,
            },
            
            // States
            {
              'border-primary-500': isFocused && !error,
              'border-red-500 focus:ring-red-500/20': error,
            },
            
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={label || props.placeholder}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <motion.label
            initial={false}
            animate={{
              top: isFocused || hasValue ? '0.5rem' : '50%',
              fontSize: isFocused || hasValue ? '0.75rem' : '1rem',
              translateY: isFocused || hasValue ? '0' : '-50%',
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute left-4 pointer-events-none',
              'font-medium',
              'transition-colors duration-200',
              {
                'text-primary-600': isFocused && !error,
                'text-red-600': error,
                'text-gray-500': !isFocused && !error,
                'left-12': icon && iconPosition === 'left',
              }
            )}
          >
            {label}
          </motion.label>
        )}

        {/* Icon Right */}
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
