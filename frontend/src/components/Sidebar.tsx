import {
  FaTachometerAlt,
  FaBullhorn,
  FaUsers,
  FaEnvelope,
  FaChartLine,
  FaSignOutAlt,
  FaDollarSign,
  FaFileSignature,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Sidebar() {
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
    const userRole = user.role as keyof typeof roleLinks;
    return [...commonLinks, ...(roleLinks[userRole] || [])];
  };

  const navLinks = getLinks();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-800 text-white flex flex-col p-4 shadow-2xl">
      <div className="flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">C4</span>
            </div>
            <h1 className="text-xl font-bold text-white">Create4Me</h1>
          </Link>
      </div>

      <nav className="mt-10 flex-1">
        <ul className="space-y-2">
          {navLinks.map((link, index) => (
            <motion.li
              key={link.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`
                }
              >
                {link.icon}
                <span className="font-semibold">{link.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
