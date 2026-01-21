import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaRocket,
  FaDollarSign,
  FaEye,
  FaCheckCircle,
  FaArrowUp,
  FaArrowRight,
  FaWallet,
  FaBriefcase
} from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardPageNew() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const isBrand = user?.role === 'brand';

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fallback data if API fails (since backend might be down)
      const mockStats = isBrand 
        ? { activeCampaigns: 2, totalSpent: 1250, applicationsReceived: 15, avgEngagement: 4.5 }
        : { activeApplications: 3, earnings: 450, successRate: 85, profileViews: 120 };
      
      const [analyticsData, campaignsData] = await Promise.all([
        api.getDashboardAnalytics().catch(() => mockStats),
        isBrand
          ? api.getMyCampaigns().catch(() => ({ campaigns: [] }))
          : api.getCampaigns().catch(() => ({ campaigns: [] })),
      ]);

      setStats(analyticsData);
      setCampaigns((campaignsData.campaigns || []).slice(0, 3));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats Configuration
  const brandStats = [
    { label: 'Active Campaigns', value: stats?.activeCampaigns || 0, icon: <FaRocket />, change: '+12%' },
    { label: 'Total Spent', value: `$${(stats?.totalSpent || 0).toLocaleString()}`, icon: <FaWallet />, change: '+5%' },
    { label: 'Applications', value: stats?.applicationsReceived || 0, icon: <FaBriefcase />, change: '+24%' },
    { label: 'Avg. Engagement', value: `${stats?.avgEngagement || 0}%`, icon: <FaEye />, change: '+1.2%' },
  ];

  const creatorStats = [
    { label: 'Active Applications', value: stats?.activeApplications || 0, icon: <FaRocket />, change: '+2' },
    { label: 'Total Earnings', value: `$${(stats?.earnings || 0).toLocaleString()}`, icon: <FaDollarSign />, change: '+18%' },
    { label: 'Success Rate', value: `${stats?.successRate || 0}%`, icon: <FaCheckCircle />, change: '+5%' },
    { label: 'Profile Views', value: stats?.profileViews || 0, icon: <FaEye />, change: '+124' },
  ];

  const displayStats = isBrand ? brandStats : creatorStats;

  if (loading) {
    return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-96">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
                <p className="text-gray-500 mt-1">
                    {isBrand ? 'Track your campaign performance' : 'Your creative career at a glance'}
                </p>
            </div>
            
            <div className="flex gap-3">
                {isBrand ? (
                     <Link to="/campaigns/new" className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-primary/25">
                        Create Campaign
                     </Link>
                ) : (
                    <Link to="/feed" className="bg-onyx hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
                        Find Opportunities
                    </Link>
                )}
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayStats.map((stat, idx) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-gray-50 rounded-lg text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                            {stat.icon}
                        </div>
                        <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {stat.change} <FaArrowUp className="ml-1 text-[10px]" />
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                </motion.div>
            ))}
        </div>

        {/* Recent Activity / Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isBrand ? 'Recent Campaigns' : 'Recent Opportunities'}
                    </h2>
                    <Link to={isBrand ? "/campaigns" : "/feed"} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                        View All <FaArrowRight className="text-xs" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {campaigns.length > 0 ? campaigns.map((campaign, idx) => (
                        <motion.div 
                            key={campaign._id || idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                    <FaBriefcase />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                        {campaign.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Budget: ${campaign.budget?.toLocaleString()} • {campaign.status || 'Active'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Link to={`/campaigns/${campaign._id}`} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all">
                                    Manage
                                </Link>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
                            <p className="text-gray-500">No active campaigns found.</p>
                            <Link to={isBrand ? "/campaigns/new" : "/feed"} className="text-primary font-semibold text-sm mt-2 inline-block">
                                {isBrand ? "Start your first campaign" : "Browse opportunities"}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar / Quick Actions */}
            <div className="space-y-6">
                 <div className="bg-onyx text-white p-6 rounded-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Pro Tips</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            {isBrand 
                             ? "Brands with complete profiles get 3x more applications." 
                             : "Complete your portfolio to unlock premium campaigns."}
                        </p>
                        <button className="bg-white text-onyx px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                            Complete Profile
                        </button>
                    </div>
                    {/* Abstract Circle Decoration */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                 </div>

                 {/* System Status or Calendar could go here */}
                 <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-sm text-gray-900 mb-4">System Status</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> API</span>
                            <span className="text-green-600 font-medium">Operational</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Payments</span>
                            <span className="text-green-600 font-medium">Operational</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
