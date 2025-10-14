import { Fragment, useState, useEffect } from 'react'
import { Dialog, Combobox, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface Command {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  action: () => void
  category?: 'navigation' | 'actions' | 'settings'
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Define all available commands
  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-home',
      name: 'Home',
      description: 'Go to homepage',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      action: () => {
        navigate('/')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'nav-creators',
      name: 'Find Creators',
      description: 'Browse creator profiles',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      action: () => {
        navigate('/creators')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'nav-feed',
      name: 'Campaign Feed',
      description: 'View active campaigns',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      action: () => {
        navigate('/feed')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'nav-dashboard',
      name: 'Dashboard',
      description: 'View your dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      action: () => {
        navigate('/dashboard')
        onClose()
      },
      category: 'navigation',
    },
    {
      id: 'nav-network',
      name: 'Network',
      description: 'View your network',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      action: () => {
        navigate('/network')
        onClose()
      },
      category: 'navigation',
    },
    // Component showcase
    {
      id: 'nav-showcase',
      name: 'Component Showcase',
      description: 'View UI components',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      action: () => {
        navigate('/showcase')
        onClose()
      },
      category: 'navigation',
    },
  ]

  // Filter commands based on query
  const filteredCommands =
    query === ''
      ? commands
      : commands.filter((command) =>
          command.name.toLowerCase().includes(query.toLowerCase()) ||
          command.description?.toLowerCase().includes(query.toLowerCase())
        )

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    const category = command.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(command)
    return acc
  }, {} as Record<string, Command[]>)

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-[20vh]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                <Combobox onChange={(command) => {
                  if (command && typeof command === 'object' && 'action' in command) {
                    (command as Command).action()
                  }
                }}>
                  {/* Search Input */}
                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-4 flex items-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <Combobox.Input
                      className="w-full border-0 bg-transparent py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 text-lg"
                      placeholder="Search for pages, actions, or settings..."
                      onChange={(event) => setQuery(event.target.value)}
                      autoComplete="off"
                    />
                    <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                        ESC
                      </kbd>
                    </div>
                  </div>

                  {/* Results */}
                  {filteredCommands.length > 0 ? (
                    <Combobox.Options
                      static
                      className="max-h-[60vh] scroll-py-2 overflow-y-auto border-t border-gray-100"
                    >
                      {Object.entries(groupedCommands).map(([category, commands]) => (
                        <div key={category} className="p-2">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {category}
                          </div>
                          {commands.map((command) => (
                            <Combobox.Option
                              key={command.id}
                              value={command}
                              className={({ active }) =>
                                cn(
                                  'flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors',
                                  active ? 'bg-primary-50' : 'hover:bg-gray-50'
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <div className={cn(
                                    'flex-shrink-0',
                                    active ? 'text-primary-600' : 'text-gray-400'
                                  )}>
                                    {command.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={cn(
                                      'font-medium truncate',
                                      active ? 'text-primary-900' : 'text-gray-900'
                                    )}>
                                      {command.name}
                                    </div>
                                    {command.description && (
                                      <div className="text-sm text-gray-500 truncate">
                                        {command.description}
                                      </div>
                                    )}
                                  </div>
                                  {active && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="flex-shrink-0"
                                    >
                                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </motion.div>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </div>
                      ))}
                    </Combobox.Options>
                  ) : (
                    <div className="border-t border-gray-100 py-14 px-6 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="mt-4 text-sm text-gray-900">No results found</p>
                      <p className="mt-2 text-xs text-gray-500">
                        Try searching for something else
                      </p>
                    </div>
                  )}
                </Combobox>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 bg-gray-50">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 font-semibold bg-white border border-gray-200 rounded">↑</kbd>
                      <kbd className="px-1.5 py-0.5 font-semibold bg-white border border-gray-200 rounded">↓</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 font-semibold bg-white border border-gray-200 rounded">↵</kbd>
                      <span>Select</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Press <kbd className="px-1.5 py-0.5 font-semibold bg-white border border-gray-200 rounded">⌘K</kbd> to close
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
