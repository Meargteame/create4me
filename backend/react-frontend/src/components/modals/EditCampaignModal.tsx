import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { FaTimes, FaSave } from 'react-icons/fa'

interface EditCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (campaignData: CampaignData) => Promise<void>
  campaign: {
    id: string
    title: string
    description: string
    budget?: number
    deadline?: string
    category?: string
    status?: string
  }
}

interface CampaignData {
  title: string
  description: string
  budget?: number
  deadline?: string
  category?: string
  status?: string
}

export default function EditCampaignModal({ isOpen, onClose, onSave, campaign }: EditCampaignModalProps) {
  const [formData, setFormData] = useState<CampaignData>({
    title: '',
    description: '',
    budget: undefined,
    deadline: '',
    category: '',
    status: 'active'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && campaign) {
      setFormData({
        title: campaign.title || '',
        description: campaign.description || '',
        budget: campaign.budget,
        deadline: campaign.deadline || '',
        category: campaign.category || '',
        status: campaign.status || 'active'
      })
      setErrors({})
    }
  }, [isOpen, campaign])

  const categories = [
    'Marketing',
    'Content Creation',
    'Social Media',
    'Product Launch',
    'Influencer',
    'Photography',
    'Video',
    'Other'
  ]

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' },
    { value: 'draft', label: 'Draft' }
  ]

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (formData.budget && formData.budget < 0) {
      newErrors.budget = 'Budget must be positive'
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update campaign' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof CampaignData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'relative w-full max-w-2xl max-h-[90vh] overflow-y-auto',
            'bg-white rounded-2xl shadow-2xl',
            'border-2 border-gray-100'
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900">Edit Campaign</h2>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg',
                'text-gray-400 hover:text-gray-600',
                'hover:bg-gray-100',
                'transition-colors'
              )}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campaign Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl',
                  'border-2',
                  errors.title ? 'border-red-300' : 'border-gray-200',
                  'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                  'outline-none transition-all'
                )}
                placeholder="Enter campaign title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={cn(
                  'w-full px-4 py-3 rounded-xl',
                  'border-2',
                  errors.description ? 'border-red-300' : 'border-gray-200',
                  'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                  'outline-none transition-all resize-none'
                )}
                placeholder="Describe your campaign"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Budget and Deadline Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget (ETB)
                </label>
                <input
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => handleChange('budget', e.target.value ? Number(e.target.value) : undefined)}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'border-2',
                    errors.budget ? 'border-red-300' : 'border-gray-200',
                    'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                    'outline-none transition-all'
                  )}
                  placeholder="0"
                  min="0"
                />
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline || ''}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'border-2',
                    errors.deadline ? 'border-red-300' : 'border-gray-200',
                    'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                    'outline-none transition-all'
                  )}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>
            </div>

            {/* Category and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'border-2 border-gray-200',
                    'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                    'outline-none transition-all',
                    'bg-white'
                  )}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'border-2 border-gray-200',
                    'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                    'outline-none transition-all',
                    'bg-white'
                  )}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'px-6 py-3 rounded-xl',
                  'text-gray-700 font-semibold',
                  'border-2 border-gray-200',
                  'hover:bg-gray-50',
                  'transition-colors'
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'px-6 py-3 rounded-xl',
                  'bg-blue-600 text-white font-semibold',
                  'hover:bg-blue-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center gap-2',
                  'transition-colors'
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
