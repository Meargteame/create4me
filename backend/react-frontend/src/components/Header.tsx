import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";
import NotificationsDropdown, {
  type Notification,
} from "./NotificationsDropdown";
import { getUserDisplayName, getUserInitials } from "../utils/user";
import Logo from "./Logo";
// import CommandPalette from './ui/CommandPalette' // TEMPORARILY DISABLED

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for login page navigation event (from protected routes)
  useEffect(() => {
    const handleOpenLogin = () => {
      navigate("/login");
    };

    window.addEventListener("openLoginModal", handleOpenLogin);
    return () => window.removeEventListener("openLoginModal", handleOpenLogin);
  }, [navigate]);

  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Application Approved!",
      message:
        'Your application for "Summer Fashion Campaign" has been approved.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      link: "/dashboard",
    },
    {
      id: "2",
      type: "info",
      title: "New Campaign Available",
      message:
        "Check out the new tech product review campaign that matches your profile.",
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      link: "/campaign-board",
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const openLogin = () => {
    navigate("/login");
  };

  const openRegister = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  // Get avatar color based on user email
  const getAvatarColor = () => {
    if (!user?.email) return "from-gray-400 to-gray-600";
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-indigo-500 to-indigo-600",
    ];
    const index = user.email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      {/* FIXED Glassmorphic Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "bg-white/70 backdrop-blur-[40px]",
          "border-b-2 border-white/60",
          "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]",
          "ring-1 ring-white/20",
        )}
      >
        <div className="w-full flex items-center h-20">
          {/* Logo - Aligned to match sidebar width (256px/w-64) */}
          <Link
            to={isAuthenticated ? "/feed" : "/"}
            className="flex items-center w-64 flex-shrink-0 pl-6"
          >
            <Logo variant="default" />
          </Link>

          <div className="flex-1 flex items-center justify-end px-4 sm:px-6 lg:px-8">
            {/* Navigation - Desktop - RIGHT ALIGNED */}
            <nav className="hidden lg:flex items-center gap-6">
              {isHomePage ? (
                // Landing page navigation
                <>
                  <a
                    href="#home"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("home")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-xl",
                      "text-gray-900 hover:text-primary-600",
                      "font-semibold text-base",
                      "transition-all duration-300",
                      "relative group",
                      "hover:bg-white/60",
                      "hover:backdrop-blur-xl",
                      "hover:shadow-lg",
                    )}
                  >
                    <span className="relative z-10">Home</span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                  <a
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-xl",
                      "text-gray-900 hover:text-primary-600",
                      "font-semibold text-base",
                      "transition-all duration-300",
                      "relative group",
                      "hover:bg-white/60",
                      "hover:backdrop-blur-xl",
                      "hover:shadow-lg",
                    )}
                  >
                    <span className="relative z-10">Features</span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                  <a
                    href="#creators"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("creators")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-xl",
                      "text-gray-900 hover:text-primary-600",
                      "font-semibold text-base",
                      "transition-all duration-300",
                      "relative group",
                      "hover:bg-white/60",
                      "hover:backdrop-blur-xl",
                      "hover:shadow-lg",
                    )}
                  >
                    <span className="relative z-10">Creators</span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("how-it-works")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-xl",
                      "text-gray-900 hover:text-primary-600",
                      "font-semibold text-base",
                      "transition-all duration-300",
                      "relative group",
                      "hover:bg-white/60",
                      "hover:backdrop-blur-xl",
                      "hover:shadow-lg",
                    )}
                  >
                    <span className="relative z-10">How It Works</span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                  <a
                    href="#stats"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("stats")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-xl",
                      "text-gray-900 hover:text-primary-600",
                      "font-semibold text-base",
                      "transition-all duration-300",
                      "relative group",
                      "hover:bg-white/60",
                      "hover:backdrop-blur-xl",
                      "hover:shadow-lg",
                    )}
                  >
                    <span className="relative z-10">Stats</span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                </>
              ) : (
                // App navigation for logged in users
                <>
                  <Link
                    to="/creators"
                    className={cn(
                      "px-5 py-2.5 rounded-xl",
                      "font-semibold text-base",
                      "transition-all duration-300",
                      "relative group",
                      location.pathname === "/creators"
                        ? "text-primary-600 bg-primary-50/80 backdrop-blur-xl shadow-lg"
                        : "text-gray-900 hover:text-primary-600 hover:bg-white/60 hover:backdrop-blur-xl hover:shadow-lg",
                    )}
                  >
                    <span className="relative z-10">Find Creators</span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                      initial={{
                        scaleX: location.pathname === "/creators" ? 1 : 0,
                      }}
                      animate={{
                        scaleX: location.pathname === "/creators" ? 1 : 0,
                      }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                  <Link
                    to="/feed"
                    className={cn(
                      "px-5 py-2.5 rounded-xl",
                      "font-semibold text-base",
                      "transition-all duration-300",
                      "relative group",
                      location.pathname === "/feed"
                        ? "text-primary-600 bg-primary-50/80 backdrop-blur-xl shadow-lg"
                        : "text-gray-900 hover:text-primary-600 hover:bg-white/60 hover:backdrop-blur-xl hover:shadow-lg",
                    )}
                  >
                    <span className="relative z-10">Campaign Feed</span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                      initial={{
                        scaleX: location.pathname === "/feed" ? 1 : 0,
                      }}
                      animate={{
                        scaleX: location.pathname === "/feed" ? 1 : 0,
                      }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                  <Link
                    to="/network"
                    className={cn(
                      "px-5 py-2.5 rounded-xl",
                      "font-semibold text-base",
                      "transition-all duration-300",
                      "relative group",
                      location.pathname === "/network"
                        ? "text-primary-600 bg-primary-50/80 backdrop-blur-xl shadow-lg"
                        : "text-gray-900 hover:text-primary-600 hover:bg-white/60 hover:backdrop-blur-xl hover:shadow-lg",
                    )}
                  >
                    <span className="relative z-10">Network</span>
                    <motion.span
                      className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 mx-5"
                      initial={{
                        scaleX: location.pathname === "/network" ? 1 : 0,
                      }}
                      animate={{
                        scaleX: location.pathname === "/network" ? 1 : 0,
                      }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </>
              )}
            </nav>

            {/* Actions - Desktop - NEXT TO NAV */}
            <div className="hidden lg:flex items-center gap-4 ml-8 pr-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NotificationsDropdown
                      notifications={notifications}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onClear={handleClearNotification}
                    />
                  </motion.div>

                  {/* Theme Toggle - COMMENTED OUT FOR FIRST LAUNCH */}
                  {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ThemeToggleCompact />
                </motion.div> */}

                  {/* User Avatar with Dropdown - USING INITIALS */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-xl",
                        "bg-white/80",
                        "backdrop-blur-xl",
                        "border border-gray-200/80",
                        "hover:border-purple-300",
                        "shadow-sm hover:shadow-md",
                        "transition-all duration-200",
                      )}
                    >
                      {/* Avatar with Initials */}
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex-shrink-0",
                          "flex items-center justify-center",
                          "bg-gradient-to-br",
                          getAvatarColor(),
                          "text-white font-semibold text-sm",
                          "ring-2 ring-white/80",
                          "shadow-sm",
                        )}
                      >
                        {getUserInitials(user)}
                      </div>
                      <span className="font-medium text-gray-700 text-sm hidden lg:inline max-w-[120px] truncate">
                        {getUserDisplayName(user)}
                      </span>
                      <svg
                        className={cn(
                          "w-3.5 h-3.5 text-gray-500 transition-transform duration-200 flex-shrink-0",
                          isProfileMenuOpen && "rotate-180",
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className={cn(
                            "absolute right-0 mt-3 w-72",
                            "bg-white",
                            "border border-gray-200",
                            "rounded-xl shadow-xl",
                            "overflow-hidden",
                            "z-50",
                          )}
                        >
                          {/* User Info */}
                          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-12 h-12 rounded-full flex-shrink-0",
                                  "flex items-center justify-center",
                                  "bg-gradient-to-br",
                                  getAvatarColor(),
                                  "text-white font-bold text-base",
                                  "ring-2 ring-white shadow-sm",
                                )}
                              >
                                {getUserInitials(user)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 truncate">
                                  {getUserDisplayName(user)}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                  {user?.email}
                                </p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full capitalize">
                                  {user?.role || "User"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            <Link
                              to="/dashboard"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                                "text-gray-700 text-sm",
                                "hover:bg-purple-50 hover:text-purple-700",
                                "transition-all duration-150",
                                "font-medium",
                              )}
                            >
                              <svg
                                className="w-5 h-5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                              <span>Dashboard</span>
                            </Link>

                            <Link
                              to="/account"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                                "text-gray-700 text-sm",
                                "hover:bg-purple-50 hover:text-purple-700",
                                "transition-all duration-150",
                                "font-medium",
                              )}
                            >
                              <svg
                                className="w-5 h-5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>Settings</span>
                            </Link>

                            <div className="my-1.5 border-t border-gray-200" />

                            <button
                              onClick={handleLogout}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                                "text-red-600 text-sm",
                                "hover:bg-red-50",
                                "transition-all duration-150",
                                "font-medium",
                              )}
                            >
                              <svg
                                className="w-5 h-5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  {/* Theme Toggle for logged out users - COMMENTED OUT FOR FIRST LAUNCH */}
                  {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ThemeToggleCompact />
                </motion.div> */}

                  <motion.button
                    onClick={openLogin}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "text-gray-900 hover:text-primary-600",
                      "font-semibold text-base",
                      "px-6 py-3 rounded-xl",
                      "bg-white/60",
                      "backdrop-blur-3xl",
                      "border-2 border-white/60",
                      "hover:border-gray-300",
                      "shadow-lg hover:shadow-xl",
                      "transition-all duration-300",
                    )}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={openRegister}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative overflow-hidden",
                      "bg-blue-600",
                      "text-white font-bold text-base",
                      "px-8 py-3 rounded-xl",
                      "shadow-2xl shadow-blue-500/50",
                      "hover:shadow-3xl hover:shadow-blue-500/60",
                      "transition-all duration-300",
                    )}
                  >
                    <span className="relative z-10">Join Now</span>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%", skewX: -20 }}
                      animate={{ x: "200%" }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-3 rounded-xl bg-white/60 backdrop-blur-xl border-2 border-white/60"
            >
              <svg
                className="w-6 h-6 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-20 right-0 bottom-0 w-80 z-50 lg:hidden",
                "bg-white/95 backdrop-blur-xl",
                "border-l-2 border-white/60",
                "shadow-2xl",
                "overflow-y-auto",
              )}
            >
              <div className="p-6 space-y-6">
                {/* User Info Section (if authenticated) */}
                {isAuthenticated && user && (
                  <div className="pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full",
                          "flex items-center justify-center",
                          "bg-gradient-to-br",
                          getAvatarColor(),
                          "text-white font-bold",
                          "ring-2 ring-white/50",
                        )}
                      >
                        {getUserInitials(user)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {getUserDisplayName(user)}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {isHomePage ? (
                    // Landing page navigation
                    <>
                      <a
                        href="#home"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("home")
                            ?.scrollIntoView({ behavior: "smooth" });
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-gray-900 hover:text-primary-600",
                          "hover:bg-primary-50",
                          "font-semibold",
                          "transition-all duration-200",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Home
                      </a>
                      <a
                        href="#features"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("features")
                            ?.scrollIntoView({ behavior: "smooth" });
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-gray-900 hover:text-primary-600",
                          "hover:bg-primary-50",
                          "font-semibold",
                          "transition-all duration-200",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                        Features
                      </a>
                      <a
                        href="#creators"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("creators")
                            ?.scrollIntoView({ behavior: "smooth" });
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-gray-900 hover:text-primary-600",
                          "hover:bg-primary-50",
                          "font-semibold",
                          "transition-all duration-200",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Creators
                      </a>
                      <a
                        href="#how-it-works"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("how-it-works")
                            ?.scrollIntoView({ behavior: "smooth" });
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-gray-900 hover:text-primary-600",
                          "hover:bg-primary-50",
                          "font-semibold",
                          "transition-all duration-200",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        How It Works
                      </a>
                      <a
                        href="#stats"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("stats")
                            ?.scrollIntoView({ behavior: "smooth" });
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-gray-900 hover:text-primary-600",
                          "hover:bg-primary-50",
                          "font-semibold",
                          "transition-all duration-200",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Stats
                      </a>
                    </>
                  ) : (
                    // App navigation for logged in users
                    <>
                      <Link
                        to="/creators"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "font-semibold",
                          "transition-all duration-200",
                          location.pathname === "/creators"
                            ? "text-primary-600 bg-primary-50"
                            : "text-gray-900 hover:text-primary-600 hover:bg-primary-50",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        Find Creators
                      </Link>
                      <Link
                        to="/feed"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "font-semibold",
                          "transition-all duration-200",
                          location.pathname === "/feed"
                            ? "text-primary-600 bg-primary-50"
                            : "text-gray-900 hover:text-primary-600 hover:bg-primary-50",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                        Campaign Feed
                      </Link>
                      <Link
                        to="/network"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "font-semibold",
                          "transition-all duration-200",
                          location.pathname === "/network"
                            ? "text-primary-600 bg-primary-50"
                            : "text-gray-900 hover:text-primary-600 hover:bg-primary-50",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Network
                      </Link>
                    </>
                  )}
                </nav>

                {/* Authenticated User Actions */}
                {isAuthenticated && (
                  <>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-gray-900 hover:text-primary-600",
                          "hover:bg-gray-100",
                          "font-medium",
                          "transition-all duration-200",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-gray-900 hover:text-primary-600",
                          "hover:bg-gray-100",
                          "font-medium",
                          "transition-all duration-200",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </Link>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-red-600",
                          "hover:bg-red-50",
                          "font-medium",
                          "transition-all duration-200",
                        )}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </>
                )}

                {/* Guest User Actions */}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <button
                      onClick={() => {
                        openLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-6 py-3 rounded-xl",
                        "text-gray-900 hover:text-primary-600",
                        "font-semibold",
                        "bg-white/60 backdrop-blur-xl",
                        "border-2 border-gray-200",
                        "hover:border-gray-300",
                        "shadow-lg",
                        "transition-all duration-300",
                      )}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        openRegister();
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-6 py-3 rounded-xl",
                        "bg-blue-600 text-white",
                        "font-bold",
                        "shadow-xl shadow-blue-500/50",
                        "hover:shadow-2xl",
                        "transition-all duration-300",
                      )}
                    >
                      Join Now
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Command Palette - TEMPORARILY DISABLED */}
      {/* <CommandPalette
      isOpen={isCommandPaletteOpen}
      onClose={() => setIsCommandPaletteOpen(false)}
    /> */}
    </>
  );
}
