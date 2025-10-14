import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface SlideOverProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  position?: 'right' | 'left'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  footer?: React.ReactNode
}

export default function SlideOver({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  footer,
}: SlideOverProps) {
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className={cn(
            'absolute inset-y-0 flex',
            position === 'right' ? 'right-0' : 'left-0'
          )}>
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom={position === 'right' ? 'translate-x-full' : '-translate-x-full'}
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo={position === 'right' ? 'translate-x-full' : '-translate-x-full'}
            >
              <Dialog.Panel
                className={cn(
                  'w-screen pointer-events-auto',
                  {
                    'max-w-xs': size === 'sm',
                    'max-w-md': size === 'md',
                    'max-w-2xl': size === 'lg',
                    'max-w-4xl': size === 'xl',
                  }
                )}
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
                  {/* Header */}
                  <div className="px-6 py-6 bg-white border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {title && (
                          <Dialog.Title className="text-xl font-bold text-gray-900">
                            {title}
                          </Dialog.Title>
                        )}
                        {description && (
                          <Dialog.Description className="mt-2 text-sm text-gray-600">
                            {description}
                          </Dialog.Description>
                        )}
                      </div>
                      {showCloseButton && (
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={onClose}
                          className={cn(
                            'ml-4 p-2 rounded-lg',
                            'text-gray-400 hover:text-gray-600',
                            'hover:bg-gray-100',
                            'transition-colors duration-200'
                          )}
                          aria-label="Close panel"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-6 py-6 overflow-y-auto">
                    {children}
                  </div>

                  {/* Footer */}
                  {footer && (
                    <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
                      {footer}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
