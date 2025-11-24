import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaArrowRight, FaCheckCircle, FaRocket, FaStar } from 'react-icons/fa';

export default function RegisterPageNew() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'creator';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'creator' | 'brand'>(initialRole as 'creator' | 'brand');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, role, name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 py-12">
      {/* Global Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24">

        {/* Left Side - Welcome Text (Hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block flex-1"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">C4</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Create4Me
            </span>
          </Link>

          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">Future of Work</span> in Ethiopia.
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Whether you're a brand looking to grow or a creator ready to earn, your journey starts here.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
              <div className="text-4xl font-black text-green-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Active Brands</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
              <div className="text-4xl font-black text-blue-600 mb-2">2.5k+</div>
              <div className="text-gray-600 font-medium">Verified Creators</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-[520px]"
        >
          <div className="glass-enhanced rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50 bg-white/60 backdrop-blur-xl">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Start your free journey today</p>
            </div>

            {/* Role Selection */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('brand')}
                  className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden group ${role === 'brand'
                      ? 'border-green-500 bg-green-50/50 shadow-md'
                      : 'border-gray-200 bg-white/50 hover:border-green-300 hover:bg-green-50/30'
                    }`}
                >
                  <div className={`relative z-10 flex flex-col items-center ${role === 'brand' ? 'scale-105' : ''} transition-transform`}>
                    <FaRocket className={`text-2xl mb-2 ${role === 'brand' ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`} />
                    <div className={`font-bold ${role === 'brand' ? 'text-gray-900' : 'text-gray-600'}`}>Brand</div>
                    <div className="text-xs text-gray-500 mt-1">I want to hire</div>
                  </div>
                  {role === 'brand' && (
                    <motion.div
                      layoutId="role-bg"
                      className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden group ${role === 'creator'
                      ? 'border-blue-500 bg-blue-50/50 shadow-md'
                      : 'border-gray-200 bg-white/50 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                >
                  <div className={`relative z-10 flex flex-col items-center ${role === 'creator' ? 'scale-105' : ''} transition-transform`}>
                    <FaStar className={`text-2xl mb-2 ${role === 'creator' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                    <div className={`font-bold ${role === 'creator' ? 'text-gray-900' : 'text-gray-600'}`}>Creator</div>
                    <div className="text-xs text-gray-500 mt-1">I want to work</div>
                  </div>
                  {role === 'creator' && (
                    <motion.div
                      layoutId="role-bg"
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
                    />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 ml-1">Must be at least 6 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group w-full py-4 bg-gradient-to-r text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${role === 'brand'
                    ? 'from-green-600 to-teal-600'
                    : 'from-blue-600 to-indigo-600'
                  }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center px-4">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-gray-700 font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-gray-700 font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200/60 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-green-600 hover:text-green-700 transition-colors inline-flex items-center gap-1 group"
                >
                  Sign in
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
