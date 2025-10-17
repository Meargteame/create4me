import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'gradient' | 'outline'
  hover?: boolean
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Card({
  variant = 'default',
  hover = true,
  glow = false,
  padding = 'md',
  children,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        // Base styles
        'rounded-2xl transition-all duration-200',
        
        // Variants
        {
          // Default - White card with shadow
          'bg-white border border-gray-200 shadow-sm hover:shadow-md':
            variant === 'default',
          
          // Glass - Glassmorphism effect
          'bg-white/80 backdrop-blur-xl border border-white/20 shadow-glass':
            variant === 'glass',
          
          // Gradient - Gradient border with white background
          'bg-white relative before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-primary-600 before:to-accent-600 before:p-[1px]':
            variant === 'gradient',
          
          // Outline - Border only
          'border-2 border-gray-200 hover:border-gray-300':
            variant === 'outline',
        },
        
        // Padding
        {
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        
        // Glow effect
        {
          'shadow-glow-primary hover:shadow-xl': glow && variant === 'default',
        },
        
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
