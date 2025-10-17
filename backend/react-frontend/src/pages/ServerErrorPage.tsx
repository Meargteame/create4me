import { Link } from 'react-router-dom';
import { FaHome, FaRedoAlt } from '../components/icons';

export default function ServerErrorPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 500 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4">
            500
          </h1>
          <div className="flex justify-center mb-8">
            <svg className="w-64 h-64 text-red-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V6h2v6zm2 4h-2v-2h2v2zm0-4h-2V6h2v6z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Server Error
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Something went wrong on our end. We're working to fix the issue. Please try again later.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-md"
          >
            <FaRedoAlt size={18} />
            Refresh Page
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all font-semibold shadow-md"
          >
            <FaHome size={18} />
            Back to Home
          </Link>
        </div>

        {/* Error Details */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md border border-red-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">What you can do:</h3>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Refresh the page and try again</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Clear your browser cache and cookies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Try again in a few minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Contact support if the problem persists</span>
            </li>
          </ul>
        </div>

        {/* Support Link */}
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            Still having trouble?{' '}
            <a href="mailto:support@create4me.com" className="text-orange-600 hover:text-orange-700 font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
