import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaTimes, FaCheckCircle, FaUser, FaImage, FaBriefcase, FaLink } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

interface ProfileCompletionPromptProps {
  onDismiss?: () => void
}

interface ProfileSection {
  id: string
  label: string
  icon: JSX.Element
  completed: boolean
  link: string
}

export default function ProfileCompletionPrompt({ onDismiss }: ProfileCompletionPromptProps) {
  const { user } = useAuth()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the prompt
    const isDismissed = localStorage.getItem('profilePromptDismissed')
    if (isDismissed) {
      setDismissed(true)
      return
    }

    // Show prompt after 2 seconds
    const timer = setTimeout(() => {
      setShow(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
    localStorage.setItem('profilePromptDismissed', 'true')
    onDismiss?.()
  }

  const handleRemindLater = () => {
    setShow(false)
    // Don't set dismissed flag, so it shows again next session
  }

  // Calculate profile completion
  const sections: ProfileSection[] = [
    {
      id: 'avatar',
      label: 'Profile Photo',
      icon: <FaUser />,
      completed: !!user?.avatar,
      link: '/settings'
    },
    {
      id: 'banner',
      label: 'Cover Banner',
      icon: <FaImage />,
      completed: !!user?.banner,
      link: '/settings'
    },
    {
      id: 'bio',
      label: 'Bio & Description',
      icon: <FaBriefcase />,
      completed: !!user?.bio && user.bio.length > 20,
      link: '/my-profile'
    },
    {
      id: 'portfolio',
      label: 'Portfolio Items',
      icon: <FaLink />,
      completed: false, // Check if user has portfolio items
      link: '/my-profile'
    }
  ]

  const completedCount = sections.filter(s => s.completed).length
  const totalCount = sections.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  // Don't show if profile is complete or dismissed
  if (dismissed || completionPercentage === 100 || !show) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Complete Your Profile</h3>
              <p className="text-blue-100 text-sm">
                Stand out to brands by completing your profile
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{completionPercentage}% Complete</span>
              <span className="text-sm text-blue-100">{completedCount}/{totalCount} sections</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {sections.map((section) => (
              <Link
                key={section.id}
                to={section.link}
                className={`p-3 rounded-xl transition-all ${
                  section.completed
                    ? 'bg-white/20 border-2 border-white/40'
                    : 'bg-white/10 border-2 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    section.completed ? 'bg-green-500' : 'bg-white/20'
                  }`}>
                    {section.completed ? (
                      <FaCheckCircle size={20} />
                    ) : (
                      <span className="text-lg">{section.icon}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{section.label}</p>
                    <p className="text-xs text-blue-100">
                      {section.completed ? 'Complete' : 'Add now'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/my-profile"
              className="flex-1 px-4 py-2.5 bg-white text-blue-600 rounded-xl font-semibold text-center hover:bg-blue-50 transition-colors"
            >
              Complete Profile
            </Link>
            <button
              onClick={handleRemindLater}
              className="px-4 py-2.5 bg-white/20 rounded-xl font-medium hover:bg-white/30 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
