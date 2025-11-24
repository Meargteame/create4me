import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaRocket,
  FaUsers,
  FaChartLine,
  FaDollarSign,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowRight,
  FaFire
} from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardPageNew() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsData, campaignsData, applicationsData] = await Promise.all([
        api.getDashboardAnalytics().catch(() => ({})),
        user?.role === 'brand'
          ? api.getMyCampaigns().catch(() => ({ campaigns: [] }))
          : api.getCampaigns().catch(() => ({ campaigns: [] })),
        user?.role === 'brand'
          ? Promise.resolve({ applications: [] })
          : api.getMyApplications().catch(() => ({ applications: [] }))
      ]);

      setStats(analyticsData);
      setCampaigns((campaignsData.campaigns || []).slice(0, 5));
      setApplications((applicationsData.applications || []).slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isBrand = user?.role === 'brand';

  // Brand Stats
  const brandStats = [
    {
      label: 'Active Campaigns',
      value: stats?.activeCampaigns || 0,
      change: '+12%',
      icon: <FaRocket className="text-blue-600" />,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      label: 'Total Applications',
      value: stats?.totalApplications || 0,
      change: '+23%',
      icon: <FaUsers className="text-purple-600" />,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      label: 'Pending Reviews',
      value: stats?.pendingApplications || 0,
      change: '+5',
      icon: <FaClock className="text-yellow-600" />,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100'
    },
    {
      label: 'Total Spend',
      value: `$${(stats?.totalSpend || 0).toLocaleString()}`,
      change: '+18%',
      icon: <FaDollarSign className="text-green-600" />,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    }
  ];

  // Creator Stats
  const creatorStats = [
    {
      label: 'Active Applications',
      value: stats?.activeApplications || 0,
      change: '+3',
      icon: <FaRocket className="text-blue-600" />,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      label: 'Total Earnings',
      value: `$${(stats?.earnings || 0).toLocaleString()}`,
      change: '+28%',
      icon: <FaDollarSign className="text-green-600" />,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      label: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      change: '+5%',
      icon: <FaCheckCircle className="text-purple-600" />,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      label: 'Profile Views',
      value: stats?.profileViews || 0,
      change: '+24',
      icon: <FaEye className="text-pink-600" />,
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-50 to-pink-100'
    }
  ];

  const displayStats = isBrand ? brandStats : creatorStats;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || 'there'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {isBrand
                ? "Here's what's happening with your campaigns today"
                : "Ready to find your next opportunity?"}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mb-24"></div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-white/50 hover:border-white/80"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                    <FaArrowUp className="text-xs" />
                    {stat.change}
                  </div>
                </div>

                <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{stat.value}</h3>
                <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isBrand ? (
              <>
                <Link
                  to="/campaigns"
                  className="group flex items-center gap-4 p-4 bg-white/50 hover:bg-white/80 border border-white/50 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
                    <FaRocket />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">Create Campaign</h3>
                    <p className="text-sm text-gray-600 font-medium">Launch a new campaign</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <FaArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>

                <Link
                  to="/creators"
                  className="group flex items-center gap-4 p-4 bg-white/50 hover:bg-white/80 border border-white/50 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
                    <FaUsers />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">Find Creators</h3>
                    <p className="text-sm text-gray-600 font-medium">Browse verified creators</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                    <FaArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>

                <Link
                  to="/analytics"
                  className="group flex items-center gap-4 p-4 bg-white/50 hover:bg-white/80 border border-white/50 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
                    <FaChartLine />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">View Analytics</h3>
                    <p className="text-sm text-gray-600 font-medium">Track performance</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                    <FaArrowRight className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/feed"
                  className="group flex items-center gap-4 p-4 bg-white/50 hover:bg-white/80 border border-white/50 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
                    <FaFire />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">Browse Campaigns</h3>
                    <p className="text-sm text-gray-600 font-medium">Find opportunities</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <FaArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>

                <Link
                  to="/profile/edit"
                  className="group flex items-center gap-4 p-4 bg-white/50 hover:bg-white/80 border border-white/50 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
                    <FaUsers />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">Edit Profile</h3>
                    <p className="text-sm text-gray-600 font-medium">Update your portfolio</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                    <FaArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>

                <Link
                  to="/applications"
                  className="group flex items-center gap-4 p-4 bg-white/50 hover:bg-white/80 border border-white/50 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
                    <FaCheckCircle />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">My Applications</h3>
                    <p className="text-sm text-gray-600 font-medium">Track your progress</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                    <FaArrowRight className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Campaigns/Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                {isBrand ? 'Recent Campaigns' : 'Hot Opportunities'}
              </h2>
              <Link
                to={isBrand ? '/campaigns' : '/feed'}
                className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                View All
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="space-y-3">
              {campaigns.length > 0 ? (
                campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="group p-4 bg-white/50 hover:bg-white border border-white/50 hover:border-blue-200 rounded-2xl transition-all cursor-pointer hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1 font-medium">{campaign.description}</p>
                      </div>
                      {campaign.budget && (
                        <span className="ml-4 px-3 py-1 bg-green-100/80 text-green-700 rounded-xl text-sm font-bold backdrop-blur-sm">
                          ${campaign.budget}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 bg-white/30 rounded-2xl border border-dashed border-gray-300">
                  <p className="font-medium">No campaigns yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Applications (Creator only) */}
          {!isBrand && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                  Recent Applications
                </h2>
                <Link
                  to="/applications"
                  className="text-purple-600 hover:text-purple-700 font-bold text-sm flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  View All
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>

              <div className="space-y-3">
                {applications.length > 0 ? (
                  applications.map((app, index) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="p-4 bg-white/50 hover:bg-white border border-white/50 hover:border-purple-200 rounded-2xl transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">
                            {app.campaignId?.title || 'Campaign'}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            Applied {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wide ${app.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : app.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white/30 rounded-2xl border border-dashed border-gray-300">
                    <p className="font-medium">No applications yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
