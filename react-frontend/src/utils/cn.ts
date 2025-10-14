import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge to resolve conflicts
 * 
 * @example
 * cn('px-4 py-2', 'bg-blue-500', { 'bg-red-500': isError })
 * // Returns: 'px-4 py-2 bg-red-500' (if isError is true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
