import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';


export default function Header() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-main/90 backdrop-blur-xl border-b border-border-color shadow-sm glass-nav transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-txt-primary">
              Create4Me<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${location.pathname === '/dashboard' ? 'bg-primary/5 text-primary' : 'text-txt-secondary hover:bg-input hover:text-txt-primary'
                  }`}
              >
                Dashboard
              </Link>
              <Link
                to="/feed"
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${location.pathname === '/feed' ? 'bg-primary/5 text-primary' : 'text-txt-secondary hover:bg-input hover:text-txt-primary'
                  }`}
              >
                Feed
              </Link>
              <Link
                to="/campaigns"
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${location.pathname === '/campaigns' ? 'bg-primary/5 text-primary' : 'text-txt-secondary hover:bg-input hover:text-txt-primary'
                  }`}
              >
                Campaigns
              </Link>
              {user.role === 'brand' && (
                <Link
                  to="/creators"
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${location.pathname === '/creators' ? 'bg-primary/5 text-primary' : 'text-txt-secondary hover:bg-input hover:text-txt-primary'
                    }`}
                >
                  Creators
                </Link>
              )}
            </div>
          )}

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">

            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-onyx rounded-full flex items-center justify-center shadow-lg border border-border-color">
                  <span className="text-white font-bold text-sm">
                    {user.name?.[0] || user.email[0].toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-5 py-2 text-sm font-semibold text-txt-secondary hover:bg-input hover:text-txt-primary rounded-full transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold text-txt-secondary hover:bg-input hover:text-txt-primary rounded-full transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-red-700 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-txt-primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border-color">
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-txt-secondary hover:text-txt-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/feed" className="text-txt-secondary hover:text-txt-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Feed
                  </Link>
                  <Link to="/campaigns" className="text-txt-secondary hover:text-txt-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Campaigns
                  </Link>
                  {user.role === 'brand' && (
                    <Link to="/creators" className="text-txt-secondary hover:text-txt-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Creators
                    </Link>
                  )}
                  <Link to="/messages" className="text-txt-secondary hover:text-txt-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Messages
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-txt-secondary hover:text-txt-primary font-medium text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-txt-secondary hover:text-txt-primary font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-center" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
