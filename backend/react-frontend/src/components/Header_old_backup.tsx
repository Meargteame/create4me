import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'
import Logo from './Logo'
import LoginModal from './auth/LoginModal'
import RegisterModal from './auth/RegisterModal'
import NotificationsDropdown, { type Notification } from './NotificationsDropdown'
import CommandPalette from './ui/CommandPalette'
import { ThemeToggleCompact } from './ui/ThemeToggle'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const navigate = useNavigate()

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Mock notifications - in production, fetch from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Application Approved!',
      message: 'Your application for "Summer Fashion Campaign" has been approved.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      link: '/dashboard'
    },
    {
      id: '2',
      type: 'info',
      title: 'New Campaign Available',
      message: 'Check out the new tech product review campaign that matches your profile.',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      link: '/campaign-board'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Campaign Deadline Approaching',
      message: 'Only 2 days left to submit your content for "Travel Vlog Series".',
      timestamp: new Date(Date.now() - 86400000),
      read: true
    }
  ])

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleClearNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const openLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  const openRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
    {/* PREMIUM Glassmorphic Header - ENHANCED */}
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-white/70 backdrop-blur-[40px]',
        'border-b-2 border-white/60
        'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]',
        'ring-1 ring-white/20
      )}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - ENHANCED */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Logo variant="default" />
            </motion.div>
          </Link>

          {/* Navigation - Desktop - PREMIUM STYLE */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link 
              to="/creators" 
              className={cn(
                'px-5 py-2.5 rounded-xl',
                'text-gray-900 hover:text-primary-600
                'font-semibold text-base',
                'transition-all duration-300',
                'relative group',
                'hover:bg-white/60
                'hover:backdrop-blur-xl',
                'hover:shadow-lg'
              )}
            >
              <span className="relative z-10">Find Creators</span>
              <motion.span 
                className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link 
              to="/feed" 
              className={cn(
                'px-5 py-2.5 rounded-xl',
                'text-gray-900 hover:text-primary-600
                'font-semibold text-base',
                'transition-all duration-300',
                'relative group',
                'hover:bg-white/60
                'hover:backdrop-blur-xl',
                'hover:shadow-lg'
              )}
            >
              <span className="relative z-10">Campaign Feed</span>
              <motion.span 
                className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link 
              to="/network" 
              className={cn(
                'px-5 py-2.5 rounded-xl',
                'text-gray-900 hover:text-primary-600
                'font-semibold text-base',
                'transition-all duration-300',
                'relative group',
                'hover:bg-white/60
                'hover:backdrop-blur-xl',
                'hover:shadow-lg'
              )}
            >
              <span className="relative z-10">Network</span>
              <motion.span 
                className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <a 
              href="#pricing" 
              className={cn(
                'px-5 py-2.5 rounded-xl',
                'text-gray-900 hover:text-primary-600
                'font-semibold text-base',
                'transition-all duration-300',
                'relative group',
                'hover:bg-white/60
                'hover:backdrop-blur-xl',
                'hover:shadow-lg'
              )}
            >
              <span className="relative z-10">Pricing</span>
              <motion.span 
                className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </a>
          </nav>

          {/* Actions - Desktop - PREMIUM STYLE */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle - ENHANCED */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ThemeToggleCompact />
            </motion.div>
            
            {/* Search Button (Command Palette) - BIGGER & GLASSMORPHIC */}
            <motion.button
              onClick={() => setIsCommandPaletteOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center gap-3 px-5 py-3 rounded-xl',
                'text-base font-semibold text-gray-700
                'bg-white/60
                'backdrop-blur-3xl',
                'border-2 border-white/60
                'hover:border-gray-300
                'shadow-lg hover:shadow-xl',
                'transition-all duration-300',
                'group'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden xl:inline px-2.5 py-1 text-xs font-bold bg-white/80 border-2 border-gray-300 rounded-lg shadow-sm group-hover:border-gray-400 transition-colors">
                ⌘K
              </kbd>
            </motion.button>

            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <NotificationsDropdown
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onClear={handleClearNotification}
                  />
                </motion.div>
                <Link 
                  to="/dashboard"
                  className={cn(
                    'flex items-center gap-3',
                    'px-5 py-3 rounded-xl',
                    'text-gray-900 hover:text-primary-600
                    'font-semibold text-base',
                    'bg-white/60
                    'backdrop-blur-3xl',
                    'border-2 border-white/60
                    'hover:border-primary-500/60',
                    'shadow-lg hover:shadow-xl',
                    'transition-all duration-300'
                  )}
                >
                  <motion.img 
                    src={'/api/placeholder/32/32'} 
                    alt={user?.email}
                    className="w-9 h-9 rounded-full ring-2 ring-primary-500/50 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                  <span>Dashboard</span>
                </Link>
                <motion.button 
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'text-red-600 hover:text-red-700
                    'font-semibold text-base',
                    'px-5 py-3 rounded-xl',
                    'bg-red-50/60
                    'backdrop-blur-3xl',
                    'border-2 border-red-200/60
                    'hover:border-red-400
                    'shadow-lg hover:shadow-xl',
                    'transition-all duration-300'
                  )}
                >
                  Sign Out
                </motion.button>
              </>
            ) : (
              <>
                <motion.button 
                  onClick={openLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'text-gray-900 hover:text-primary-600
                    'font-semibold text-base',
                    'px-6 py-3 rounded-xl',
                    'bg-white/60
                    'backdrop-blur-3xl',
                    'border-2 border-white/60
                    'hover:border-gray-300
                    'shadow-lg hover:shadow-xl',
                    'transition-all duration-300'
                  )}
                >
                  Sign In
                </motion.button>
                <motion.button 
                  onClick={openRegister}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'relative overflow-hidden',
                    'bg-blue-600
                    'text-white font-bold text-base',
                    'px-8 py-3 rounded-xl',
                    'shadow-2xl shadow-blue-500/50',
                    'hover:shadow-3xl hover:shadow-blue-500/60',
                    'transition-all duration-300'
                  )}
                >
                  <span className="relative z-10">Join Now</span>
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%', skewX: -20 }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button - PREMIUM */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'lg:hidden p-3 rounded-xl',
              'text-gray-900
              'bg-white/60
              'backdrop-blur-3xl',
              'border-2 border-white/60
              'shadow-lg',
              'transition-all duration-300'
            )}
            aria-label="Toggle mobile menu"
          >
            <motion.svg 
              className="w-6 h-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu - ENHANCED GLASSMORPHISM */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="lg:hidden border-t-2 border-white/60 bg-white/70 backdrop-blur-[40px] shadow-2xl"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <Link 
                to="/creators" 
                onClick={closeMobileMenu}
                className={cn(
                  'block px-4 py-3 rounded-lg',
                  'text-gray-700 hover:text-primary-600 font-medium',
                  'hover:bg-gray-50',
                  'transition-all duration-200'
                )}
              >
                Find Creators
              </Link>
              <Link 
                to="/feed" 
                onClick={closeMobileMenu}
                className={cn(
                  'block px-4 py-3 rounded-lg',
                  'text-gray-700 hover:text-primary-600 font-medium',
                  'hover:bg-gray-50',
                  'transition-all duration-200'
                )}
              >
                Campaign Feed
              </Link>
              <Link 
                to="/network" 
                onClick={closeMobileMenu}
                className={cn(
                  'block px-4 py-3 rounded-lg',
                  'text-gray-700 hover:text-primary-600 font-medium',
                  'hover:bg-gray-50',
                  'transition-all duration-200'
                )}
              >
                Network
              </Link>
              <a 
                href="#pricing" 
                onClick={closeMobileMenu}
                className={cn(
                  'block px-4 py-3 rounded-lg',
                  'text-gray-700 hover:text-primary-600 font-medium',
                  'hover:bg-gray-50',
                  'transition-all duration-200'
                )}
              >
                Pricing
              </a>

              {/* Mobile Auth Actions */}
              <div className="pt-4 border-t border-gray-200/50 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg',
                        'text-gray-700 hover:text-primary-600 font-medium',
                        'hover:bg-gray-50',
                        'transition-all duration-200'
                      )}
                    >
                      <img 
                        src={'/api/placeholder/32/32'} 
                        alt={user?.email}
                        className="w-8 h-8 rounded-full ring-2 ring-primary-100"
                      />
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout()
                        closeMobileMenu()
                      }}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-lg',
                        'text-red-600 font-medium',
                        'hover:bg-red-50',
                        'transition-all duration-200'
                      )}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        openLogin()
                        closeMobileMenu()
                      }}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'text-gray-700 font-medium',
                        'border border-gray-300',
                        'hover:bg-gray-50',
                        'transition-all duration-200'
                      )}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        openRegister()
                        closeMobileMenu()
                      }}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-gradient-to-r from-primary-600 to-accent-600',
                        'text-white font-semibold',
                        'shadow-lg shadow-primary-500/30',
                        'transition-all duration-200'
                      )}
                    >
                      Join Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>

    <LoginModal 
      isOpen={isLoginOpen}
      onClose={() => setIsLoginOpen(false)}
      onRegisterClick={openRegister}
    />

    <RegisterModal 
      isOpen={isRegisterOpen}
      onClose={() => setIsRegisterOpen(false)}
      onLoginClick={openLogin}
    />

    <CommandPalette
      isOpen={isCommandPaletteOpen}
      onClose={() => setIsCommandPaletteOpen(false)}
    />
    </>
  )
}
