import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../ui/Sidebar'
import { 
  FaChartLine,
  FaRocket,
  FaUsers,
  FaTasks,
  FaChartBar,
  FaCog
} from '../icons'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

// Default navigation items
const defaultNavItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: <FaChartLine size={20} />,
  },
  {
    id: 'campaigns',
    name: 'Campaigns',
    href: '/brand-dashboard',
    icon: <FaRocket size={20} />,
    badge: 3
  },
  {
    id: 'creators',
    name: 'Creators',
    href: '/creators',
    icon: <FaUsers size={20} />,
  },
  {
    id: 'network',
    name: 'Network',
    href: '/network',
    icon: <FaTasks size={20} />,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    href: '/analytics',
    icon: <FaChartBar size={20} />,
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    icon: <FaCog size={20} />,
  },
]

export default function DashboardLayout({ children, title, subtitle, actions }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar items={defaultNavItems} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar items={defaultNavItems} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page Title */}
            {title && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
              </div>
            )}
          </div>

          {/* Actions */}
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

// Page Header Component
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {description && <p className="text-gray-600 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}

// Section Component
export function Section({
  title,
  subtitle,
  actions,
  children,
  className = '',
}: {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`mb-8 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
