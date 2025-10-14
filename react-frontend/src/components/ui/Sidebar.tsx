import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface NavItem {
  id: string
  name: string
  href: string
  icon: React.ReactNode
  badge?: string | number
}

interface SidebarProps {
  items: NavItem[]
  userSection?: React.ReactNode
  className?: string
}

export default function Sidebar({ items, userSection, className }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'flex flex-col w-64 h-screen',
        'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900',
        'border-r border-gray-700/50',
        'fixed left-0 top-0',
        className
      )}
    >
      {/* Logo/Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-700/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <span className="text-white font-bold text-xl">C4</span>
        </div>
        <div>
          <div className="text-white font-bold text-lg">Create4Me</div>
          <div className="text-gray-400 text-xs">Dashboard</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item, index) => {
          const isActive = location.pathname === item.href
          
          return (
            <Link key={item.id} to={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 rounded-xl',
                  'transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-r-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    'flex-shrink-0 transition-all duration-200',
                    isActive
                      ? 'text-primary-400 scale-110'
                      : 'text-gray-400 group-hover:text-primary-400 group-hover:scale-105'
                  )}
                >
                  {item.icon}
                </div>

                {/* Name */}
                <span className="flex-1 font-medium text-sm">{item.name}</span>

                {/* Badge */}
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-700 text-gray-300 group-hover:bg-primary-500 group-hover:text-white'
                    )}
                  >
                    {item.badge}
                  </motion.span>
                )}

                {/* Hover glow effect */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-accent-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      {userSection && (
        <div className="px-3 py-4 border-t border-gray-700/50">
          {userSection}
        </div>
      )}
    </aside>
  )
}

// User Profile Card for Sidebar
export function SidebarUserProfile({
  name,
  email,
  avatar,
  onSignOut,
}: {
  name: string
  email: string
  avatar?: string
  onSignOut?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img
            src={avatar || '/api/placeholder/40/40'}
            alt={name}
            className="w-10 h-10 rounded-lg ring-2 ring-primary-500/50"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-sm truncate">{name}</div>
          <div className="text-gray-400 text-xs truncate">{email}</div>
        </div>
      </div>
      {onSignOut && (
        <button
          onClick={onSignOut}
          className={cn(
            'w-full px-3 py-2 rounded-lg',
            'text-sm font-medium text-gray-300',
            'hover:text-white hover:bg-white/10',
            'transition-all duration-200',
            'flex items-center justify-center gap-2'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      )}
    </motion.div>
  )
}
