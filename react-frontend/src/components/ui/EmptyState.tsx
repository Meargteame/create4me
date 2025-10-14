import { type ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: ReactElement;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-block mb-6 text-gray-400">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      
      <div className="flex items-center justify-center gap-4">
        {actionLabel && actionLink && (
          <Link
            to={actionLink}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm"
          >
            {actionLabel}
          </Link>
        )}
        
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm"
          >
            {actionLabel}
          </button>
        )}
        
        {secondaryActionLabel && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
