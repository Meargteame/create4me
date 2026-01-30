import {
  FaTachometerAlt,
  FaBullhorn,
  FaUsers,
  FaEnvelope,
  FaChartLine,
  FaSignOutAlt,
  FaDollarSign,
  FaFileSignature,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const commonLinks = [
    { to: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { to: '/campaigns', icon: <FaBullhorn />, label: 'Campaigns' },
    { to: '/messages', icon: <FaEnvelope />, label: 'Messages' },
    { to: '/analytics', icon: <FaChartLine />, label: 'Analytics' },
  ];

  const roleLinks = {
    creator: [
      { to: '/feed', icon: <FaUsers />, label: 'Find Campaigns' },
      { to: '/applications', icon: <FaFileSignature />, label: 'My Applications' },
      { to: '/payouts', icon: <FaDollarSign />, label: 'My Payouts' },
    ],
    brand: [
      { to: '/creators', icon: <FaUsers />, label: 'Find Creators' },
    ],
    admin: [],
  };

  const getLinks = () => {
    if (!user) return [];
    const userRole = (user.role || 'creator') as keyof typeof roleLinks;
    const specificLinks = roleLinks[userRole] || [];
    return [...commonLinks, ...specificLinks];
  };

  const navLinks = getLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
            fixed top-0 left-0 h-screen w-64 bg-card border-r border-border-color flex flex-col p-6 z-50 transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
        <div className="flex-shrink-0 mb-10 pl-2 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <span className="text-2xl font-black text-txt-primary tracking-tight">C4<span className="text-primary">.</span></span>
          </Link>
          <button onClick={onClose} className="md:hidden text-txt-secondary hover:text-txt-primary">
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => onClose()} // Close on mobile navigation
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm group overflow-hidden ${isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full"
                        />
                      )}
                      <span className="text-lg relative z-10">{link.icon}</span>
                      <span className="relative z-10">{link.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors font-semibold text-sm"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

          {/* User Mini Profile */}
          <div className="flex items-center gap-3 mt-6 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{user?.role || 'Creator'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
