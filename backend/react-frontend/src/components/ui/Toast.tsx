import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from '../icons'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = Date.now().toString()
    const newToast: Toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
    
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [removeToast])

  const getToastStyles = (type: Toast['type']) => {
    const baseClasses = 'flex items-center gap-3 p-4 mb-3 rounded-lg shadow-lg text-white font-medium text-sm max-w-md animate-slideIn'
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-500`
      case 'error':
        return `${baseClasses} bg-red-500`
      case 'warning':
        return `${baseClasses} bg-yellow-500`
      default:
        return `${baseClasses} bg-blue-500`
    }
  }

  const getToastIcon = (type: Toast['type']) => {
    const iconSize = 20
    switch (type) {
      case 'success':
        return <FaCheckCircle size={iconSize} />
      case 'error':
        return <FaTimes size={iconSize} />
      case 'warning':
        return <FaExclamationTriangle size={iconSize} />
      default:
        return <FaInfoCircle size={iconSize} />
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-5 right-5 z-[9999] pointer-events-none">
          <div className="flex flex-col items-end pointer-events-auto">
            {toasts.map(toast => (
              <div key={toast.id} className={getToastStyles(toast.type)}>
                <div className="flex items-center gap-3 flex-1">
                  {getToastIcon(toast.type)}
                  <span className="flex-1">{toast.message}</span>
                </div>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="ml-3 hover:opacity-80 transition-opacity"
                  aria-label="Close"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}