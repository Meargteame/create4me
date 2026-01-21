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
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-12 sm:px-24 lg:px-32 relative z-10">
          <Link to="/" className="absolute top-10 left-12 md:left-24 text-2xl font-black text-onyx tracking-tight">
            C4<span className="text-primary">.</span>
          </Link>

          <div className="w-full max-w-sm mx-auto">
              <h1 className="text-4xl font-black text-onyx mb-2">Welcome back</h1>
              <p className="text-gray-500 mb-10">Enter your details to access your dashboard.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                    <FaCheckCircle className="rotate-180" />
                    {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900"
                        placeholder="hello@example.com"
                      />
                  </div>
                  <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-700">Password</label>
                        <a href="#" className="text-xs font-bold text-primary hover:text-black transition-colors">Forgot Password?</a>
                      </div>
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900"
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
      <div className="hidden lg:flex bg-gray-50 relative overflow-hidden items-center justify-center p-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 max-w-lg text-center">
              <div className="w-20 h-20 bg-primary rounded-2xl mx-auto mb-8 flex items-center justify-center text-white text-3xl shadow-2xl shadow-primary/30 rotate-3">
                  <FaLock />
              </div>
              <h2 className="text-3xl font-bold text-onyx mb-4">Bank-Grade Security</h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                  Your account is protected with 256-bit encryption. All payments are processed securely via Telebirr and Chapa.
              </p>
          </div>
      </div>
    </div>
  );
}
