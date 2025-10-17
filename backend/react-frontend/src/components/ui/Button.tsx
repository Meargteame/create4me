import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  glow = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      disabled={isDisabled}
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center gap-2',
        'font-semibold rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-4 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Variants
        {
          // Primary - Gradient background with glow
          'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-700 hover:to-accent-700 focus:ring-primary-500/50':
            variant === 'primary',
          
          // Secondary - White background with border
          'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500/50':
            variant === 'secondary',
          
          // Ghost - Transparent background
          'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500/50':
            variant === 'ghost',
          
          // Outline - Border only
          'border-2 border-current text-primary-600 hover:bg-primary-50 focus:ring-primary-500/50':
            variant === 'outline',
          
          // Danger - Red theme
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50':
            variant === 'danger',
        },
        
        // Sizes
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-6 py-2.5 text-base': size === 'md',
          'px-8 py-3 text-lg': size === 'lg',
          'px-10 py-4 text-xl': size === 'xl',
        },
        
        // Glow effect
        {
          'shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40': 
            glow && variant === 'primary',
          'shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40': 
            glow && variant === 'outline',
        },
        
        // Full width
        {
          'w-full': fullWidth,
        },
        
        className
      )}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg 
          className="animate-spin h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Icon Left */}
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      
      {/* Content */}
      <span>{children}</span>
      
      {/* Icon Right */}
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </motion.button>
  )
}
