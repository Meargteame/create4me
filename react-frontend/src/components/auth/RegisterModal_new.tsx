import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../ui/Toast'
import { validateEmail, validatePassword, validateName } from '../../utils/validation'
import { FaUser, FaEnvelope, FaLock, FaTimes } from '../icons'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'creator' as 'creator' | 'brand'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const nameError = validateName(formData.name)
    if (nameError) newErrors.name = nameError

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast('Please fix the form errors', 'error')
      return
    }

    setLoading(true)

    const { error } = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    })

    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Account created successfully! 🎉', 'success')
      onClose()
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'creator' })
      setErrors({})
      // Navigate to campaign feed after successful registration
      navigate('/feed')
    }

    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-md my-8"
            >
              {/* Glassmorphic Container */}
              <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/60 overflow-hidden">
                {/* Header with Gradient */}
                <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8">
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <FaTimes size={20} />
                  </motion.button>

                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-3xl font-bold text-white mb-2">Join Create4Me! 🚀</h2>
                    <p className="text-white/90 text-sm">Start your creator journey today</p>
                  </motion.div>
                </div>

                {/* Form */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role Selection */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        I want to join as
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, role: 'creator' }))}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
                            formData.role === 'creator'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200
                          }`}
                        >
                          Creator
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, role: 'brand' }))}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
                            formData.role === 'brand'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200
                          }`}
                        >
                          Brand
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Name Input */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaUser size={18} />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                            errors.name
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-gray-200 focus:border-purple-500'
                          } bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
                        />
                      </div>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email Input */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaEnvelope size={18} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                            errors.email
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-gray-200 focus:border-purple-500'
                          } bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Password Input */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaLock size={18} />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                            errors.password
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-gray-200 focus:border-purple-500'
                          } bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
                        />
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Confirm Password Input */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaLock size={18} />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                            errors.confirmPassword
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-gray-200 focus:border-purple-500'
                          } bg-white/50 backdrop-blur-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl shadow-2xl shadow-purple-500/50 hover:shadow-3xl hover:shadow-pink-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        'Create Account'
                      )}
                      {!loading && (
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: '-100%', skewX: -20 }}
                          animate={{ x: '200%' }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                      )}
                    </motion.button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <span className="text-sm text-gray-500 font-medium">OR</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>

                  {/* Switch to Login */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-gray-600
                      Already have an account?{' '}
                      <button
                        onClick={onSwitchToLogin}
                        className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-blue-600 transition-all duration-300"
                      >
                        Sign In →
                      </button>
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
