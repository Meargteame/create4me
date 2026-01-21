import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight, FaCheckCircle, FaUser, FaBuilding } from 'react-icons/fa';

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
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Right Side - Visual (Switched for Register) */}
      <div className="hidden lg:flex bg-onyx relative overflow-hidden items-center justify-center p-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 max-w-lg">
              <h2 className="text-5xl font-black text-white mb-8 leading-tight">
                  Join the platform <br/>
                  <span className="text-primary">changing Ethiopia.</span>
              </h2>
              <div className="space-y-6">
                 {[
                     'Direct access to 500+ top brands',
                     'Guaranteed payments via Telebirr',
                     'Professional portfolio tools',
                     'Real-time performance analytics'
                 ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4">
                         <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                             <FaCheckCircle className="text-primary text-sm" />
                         </div>
                         <span className="text-gray-300 font-medium text-lg">{item}</span>
                     </div>
                 ))}
              </div>
          </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-12 sm:px-24 lg:px-32 relative z-10 bg-white">
          <Link to="/" className="absolute top-10 right-12 md:right-24 text-2xl font-black text-onyx tracking-tight">
            C4<span className="text-primary">.</span>
          </Link>

          <div className="w-full max-w-md mx-auto">
              <h1 className="text-4xl font-black text-onyx mb-2">Get Started</h1>
              <p className="text-gray-500 mb-8">Create your free account today.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                    <FaCheckCircle className="rotate-180" />
                    {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Role Selector - Premium Toggle */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                      <button
                        type="button"
                        onClick={() => setRole('creator')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            role === 'creator' 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                          <FaUser className="text-xl" />
                          <span className="font-bold text-sm">I'm a Creator</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('brand')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            role === 'brand' 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                          <FaBuilding className="text-xl" />
                          <span className="font-bold text-sm">I'm a Brand</span>
                      </button>
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900"
                        placeholder="Abebe Bikila"
                      />
                  </div>
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
                      <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900"
                        placeholder="Min. 8 characters"
                      />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-onyx text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-[1.01] shadow-xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Join Now'}
                    {!loading && <FaArrowRight />}
                  </button>
              </form>

              <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500 font-medium">
                      Already have an account? {' '}
                      <Link to="/login" className="text-primary font-bold hover:text-black transition-colors">
                          Log in
                      </Link>
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
}
