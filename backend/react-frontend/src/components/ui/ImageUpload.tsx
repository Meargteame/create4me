import { useState, useRef, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

interface ImageUploadProps {
  value?: string
  onChange: (imageUrl: string) => void
  onUpload?: (file: File) => Promise<string>
  label?: string
  className?: string
  maxSize?: number // in MB
  accept?: string
  preview?: boolean
  shape?: 'square' | 'circle'
  size?: 'sm' | 'md' | 'lg'
}

export default function ImageUpload({
  value,
  onChange,
  onUpload,
  label = 'Upload Image',
  className,
  maxSize = 5,
  accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
  preview = true,
  shape = 'square',
  size = 'md'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string>(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error
    setError('')

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    try {
      setIsUploading(true)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file if onUpload is provided
      if (onUpload) {
        const uploadedUrl = await onUpload(file)
        onChange(uploadedUrl)
      } else {
        // Just use the preview URL
        onChange(reader.result as string)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
      setPreviewUrl('')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group"
            >
              <div
                className={cn(
                  sizeClasses[size],
                  shape === 'circle' ? 'rounded-full' : 'rounded-xl',
                  'overflow-hidden border-2 border-gray-200 shadow-lg'
                )}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay with actions */}
              <div
                className={cn(
                  'absolute inset-0',
                  'bg-black/50 backdrop-blur-sm',
                  'opacity-0 group-hover:opacity-100',
                  'transition-opacity duration-200',
                  'flex items-center justify-center gap-2',
                  shape === 'circle' ? 'rounded-full' : 'rounded-xl'
                )}
              >
                <button
                  type="button"
                  onClick={handleClick}
                  className={cn(
                    'p-2 bg-white/90 rounded-lg',
                    'hover:bg-white transition-colors',
                    'text-gray-700'
                  )}
                  title="Change image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className={cn(
                    'p-2 bg-red-500/90 rounded-lg',
                    'hover:bg-red-500 transition-colors',
                    'text-white'
                  )}
                  title="Remove image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="upload"
              type="button"
              onClick={handleClick}
              disabled={isUploading}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                sizeClasses[size],
                shape === 'circle' ? 'rounded-full' : 'rounded-xl',
                'border-2 border-dashed border-gray-300',
                'hover:border-blue-500 hover:bg-blue-50',
                'transition-all duration-200',
                'flex flex-col items-center justify-center gap-2',
                'text-gray-500 hover:text-blue-600',
                'cursor-pointer',
                isUploading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isUploading ? (
                <>
                  <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-xs font-medium">Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium">Upload</span>
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Helper text */}
      {!error && (
        <p className="text-xs text-gray-500">
          Max size: {maxSize}MB. Formats: JPEG, PNG, GIF, WebP
        </p>
      )}
    </div>
  )
}
