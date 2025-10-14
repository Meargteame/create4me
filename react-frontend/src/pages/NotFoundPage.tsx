import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from '../components/icons';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            404
          </h1>
          <div className="flex justify-center mb-8">
            <svg className="w-64 h-64 text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            <FaArrowLeft size={18} />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md"
          >
            <FaHome size={18} />
            Back to Home
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Looking for something? Try these pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/campaign-board" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Campaigns
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/account" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
