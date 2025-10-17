import { cn } from '../../utils/cn'

interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  children: React.ReactNode
  className?: string
}

export default function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center gap-1.5',
        'font-semibold rounded-full',
        'transition-all duration-200',
        
        // Variants
        {
          'bg-gray-100 text-gray-700': variant === 'default',
          'bg-primary-100 text-primary-700': variant === 'primary',
          'bg-green-100 text-green-700': variant === 'success',
          'bg-yellow-100 text-yellow-700': variant === 'warning',
          'bg-red-100 text-red-700': variant === 'danger',
          'bg-blue-100 text-blue-700': variant === 'info',
        },
        
        // Sizes
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
          'px-4 py-1.5 text-base': size === 'lg',
        },
        
        className
      )}
    >
      {/* Status Dot */}
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            {
              'bg-gray-500': variant === 'default',
              'bg-primary-500': variant === 'primary',
              'bg-green-500 animate-pulse': variant === 'success',
              'bg-yellow-500': variant === 'warning',
              'bg-red-500 animate-pulse': variant === 'danger',
              'bg-blue-500': variant === 'info',
            }
          )}
        />
      )}
      
      {children}
    </span>
  )
}
