import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight, FaCheckCircle, FaLock } from 'react-icons/fa';

export default function LoginPageNew() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Example default role handling if the backend response doesn't include it directly in the top-level
      // Modify based on actual API response structure
      const userData = await login(email.trim(), password);

      if (userData && 'role' in userData) {
        if (userData.role === 'brand') {
          navigate('/campaigns');
        } else if (userData.role === 'creator') {
          navigate('/feed');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-main transition-colors duration-300">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-12 sm:px-24 lg:px-32 relative z-10">
        <Link to="/" className="absolute top-10 left-12 md:left-24 text-2xl font-black text-txt-primary tracking-tight">
          C4<span className="text-primary">.</span>
        </Link>

        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-4xl font-black text-txt-primary mb-2">Welcome back</h1>
          <p className="text-txt-secondary mb-10">Enter your details to access your dashboard.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <FaCheckCircle className="rotate-180" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-txt-primary mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-input border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-txt-primary placeholder:text-txt-secondary"
                placeholder="hello@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-txt-primary">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:text-txt-primary transition-colors">Forgot Password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-input border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-txt-primary placeholder:text-txt-secondary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-onyx text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-[1.01] shadow-xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <FaArrowRight />}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-color"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-main text-txt-secondary">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/google`}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-border-color rounded-xl hover:bg-input transition-colors font-semibold text-txt-primary"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                // onClick={() => setShowPhoneModal(true)} // TODO: Implement Phone Modal
                className="flex items-center justify-center gap-2 px-4 py-3 border border-border-color rounded-xl hover:bg-input transition-colors font-semibold text-txt-primary"
              >
                <svg className="w-5 h-5 text-txt-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Phone
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 font-medium">
              New to Create4Me? {' '}
              <Link to="/register" className="text-primary font-bold hover:text-black transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex bg-input relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="w-20 h-20 bg-primary rounded-2xl mx-auto mb-8 flex items-center justify-center text-white text-3xl shadow-2xl shadow-primary/30 rotate-3">
            <FaLock />
          </div>
          <h2 className="text-3xl font-bold text-txt-primary mb-4">Bank-Grade Security</h2>
          <p className="text-txt-secondary text-lg leading-relaxed">
            Your account is protected with 256-bit encryption. All payments are processed securely via Telebirr and Chapa.
          </p>
        </div>
      </div>
    </div>
  );
}
