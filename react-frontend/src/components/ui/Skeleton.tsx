import { cn } from '../../utils/cn'

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  className?: string
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-200',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
        'before:animate-shimmer',
        
        // Variants
        {
          'h-4 rounded': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-none': variant === 'rectangular',
          'rounded-lg': variant === 'rounded',
        },
        
        className
      )}
      style={{
        width: width || (variant === 'text' ? '100%' : variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'text' ? '16px' : variant === 'circular' ? '40px' : '200px'),
      }}
    />
  )
}

// Preset skeleton components
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-4">
      <Skeleton variant="circular" width={64} height={64} />
      <div className="space-y-3">
        <Skeleton width="60%" />
        <Skeleton width="80%" />
        <Skeleton width="40%" />
      </div>
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 32,
    md: 40,
    lg: 64,
  }
  
  return (
    <Skeleton variant="circular" width={sizes[size]} height={sizes[size]} />
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}
