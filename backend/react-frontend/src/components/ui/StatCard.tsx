import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  loading?: boolean
  className?: string
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  trend = 'neutral',
  color = 'primary',
  loading = false,
  className,
}: StatCardProps) {
  const colorClasses = {
    primary: {
      bg: 'from-primary-500 to-accent-500',
      text: 'text-primary-600',
      iconBg: 'bg-primary-100',
      changeBg: 'bg-primary-50 text-primary-700',
    },
    success: {
      bg: 'from-green-500 to-emerald-500',
      text: 'text-green-600',
      iconBg: 'bg-green-100',
      changeBg: 'bg-green-50 text-green-700',
    },
    warning: {
      bg: 'from-yellow-500 to-orange-500',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      changeBg: 'bg-yellow-50 text-yellow-700',
    },
    danger: {
      bg: 'from-red-500 to-pink-500',
      text: 'text-red-600',
      iconBg: 'bg-red-100',
      changeBg: 'bg-red-50 text-red-700',
    },
    info: {
      bg: 'from-blue-500 to-cyan-500',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
      changeBg: 'bg-blue-50 text-blue-700',
    },
  }

  const colors = colorClasses[color]

  if (loading) {
    return (
      <div className={cn('bg-white rounded-2xl p-6 shadow-sm', className)}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      className={cn(
        'bg-white rounded-2xl p-6 shadow-sm',
        'border border-gray-100',
        'transition-all duration-200',
        'relative overflow-hidden',
        className
      )}
    >
      {/* Background gradient decoration */}
      <div className={cn(
        'absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16',
        'bg-gradient-to-br opacity-5 rounded-full blur-2xl',
        colors.bg
      )} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          {icon && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                colors.iconBg,
                colors.text
              )}
            >
              {icon}
            </motion.div>
          )}
        </div>

        {/* Value */}
        <div className="mb-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-3xl font-bold text-gray-900"
          >
            {value}
          </motion.div>
        </div>

        {/* Trend */}
        {change !== undefined && (
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                trend === 'up' && 'bg-green-50 text-green-700',
                trend === 'down' && 'bg-red-50 text-red-700',
                trend === 'neutral' && 'bg-gray-50 text-gray-700'
              )}
            >
              {trend === 'up' && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {Math.abs(change)}%
            </motion.div>
            <span className="text-xs text-gray-500">{changeLabel}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Stat Card Grid Container
export function StatCardGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
      className
    )}>
      {children}
    </div>
  )
}

// Compact Stat Card (for smaller spaces)
export function CompactStatCard({
  label,
  value,
  icon,
  color = 'primary',
}: {
  label: string
  value: string | number
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'danger'
}) {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    danger: 'text-red-600 bg-red-50',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      {icon && (
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorClasses[color])}>
          {icon}
        </div>
      )}
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </motion.div>
  )
}
