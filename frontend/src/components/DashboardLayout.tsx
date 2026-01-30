import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaBell, FaBars } from 'react-icons/fa';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-main text-txt-primary font-sans transition-colors duration-300">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="md:ml-64 relative z-10 transition-all duration-300">
                {/* Top Header - Minimal & Clean */}
                <header className="h-20 fixed top-0 right-0 left-0 md:left-64 z-30 bg-card/80 backdrop-blur-xl border-b border-border-color flex px-4 md:px-8 justify-between items-center transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl"
                        >
                            <FaBars />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-txt-primary truncate max-w-[150px] md:max-w-none">
                                {user?.name ? `Hello, ${user.name}` : 'Welcome Back'}
                            </h1>
                            <p className="text-xs text-txt-secondary font-medium hidden md:block">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search */}
                        <div className="relative hidden md:block group">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary group-focus-within:text-primary transition-colors text-xs" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2.5 bg-input border-none rounded-full w-64 text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:bg-card transition-all outline-none text-txt-primary placeholder:text-txt-secondary"
                            />
                        </div>

                        <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden md:block"></div>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                            <FaBell className="text-lg" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content Shell */}
                <main className="pt-24 p-4 md:p-8 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
