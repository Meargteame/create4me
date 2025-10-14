import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaLock, FaSignInAlt } from '../components/icons';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
    // The login modal can be triggered from the home page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Lock Illustration */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <FaLock size={64} className="text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-600 mb-4">
            Access Denied
          </h1>
        </div>

        {/* Content */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Unauthorized Access
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          You don't have permission to access this page. Please log in or contact support if you believe this is an error.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all font-semibold shadow-md"
          >
            <FaSignInAlt size={18} />
            Log In
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            <FaHome size={18} />
            Back to Home
          </Link>
        </div>

        {/* Common Reasons */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md border border-yellow-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common reasons for this error:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Not Logged In</h4>
                <p className="text-sm text-gray-600">You need to log in to access this page</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Session Expired</h4>
                <p className="text-sm text-gray-600">Your login session may have expired</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Wrong Account Type</h4>
                <p className="text-sm text-gray-600">Some pages are restricted to specific user types</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Insufficient Permissions</h4>
                <p className="text-sm text-gray-600">You don't have the required permissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="mailto:support@create4me.com" className="text-amber-600 hover:text-amber-700 font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
