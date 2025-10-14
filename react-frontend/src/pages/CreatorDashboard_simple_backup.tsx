import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import apiClient from '../lib/api';
import { 
  FaChartLine,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaRocket,
  FaTasks
} from '../components/icons';

interface Application {
  id: string;
  campaignTitle: string;
  brand: string;
  status: 'pending' | 'approved' | 'rejected';
  budget: number;
  appliedDate: string;
  deadline: string;
}

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;
    try {
      const response = await apiClient.getMyApplications();
      if (response.success) {
        const transformedApps = response.applications.map((app: any) => ({
          id: app.id,
          campaignTitle: app.campaign?.title || 'Unknown Campaign',
          brand: app.campaign?.user?.email?.split('@')[0] || 'Unknown Brand',
          status: app.status,
          budget: 0,
          appliedDate: new Date(app.createdAt).toISOString().split('T')[0],
          deadline: app.campaign?.deadline || 'TBD'
        }));
        setApplications(transformedApps);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const successRate = applications.length > 0 
    ? Math.round((approvedCount / applications.length) * 100) 
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return { bg: '#dcfce7', text: '#16a34a' };
      case 'pending': return { bg: '#fef3c7', text: '#d97706' };
      case 'rejected': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'rejected': return <FaTimes />;
      default: return <FaClock />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.email?.split('@')[0]}! 🎨
              </h1>
              <p className="text-gray-600 text-lg">
                Your creator journey continues here
              </p>
            </div>
            <Link
              to="/campaign-board"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <FaRocket />
              Browse Campaigns
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <FaTasks className="text-white text-2xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {applications.length}
            </div>
            <div className="text-sm text-gray-700 font-medium">Total Applications</div>
            <div className="text-xs text-green-600 font-medium mt-2">
              ↑ 12% from last month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-md">
                <FaClock className="text-white text-2xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {pendingCount}
            </div>
            <div className="text-sm text-gray-700 font-medium">Pending Review</div>
            <div className="text-xs text-gray-600 mt-2">
              Awaiting response
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                <FaCheckCircle className="text-white text-2xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {approvedCount}
            </div>
            <div className="text-sm text-gray-700 font-medium">Approved</div>
            <div className="text-xs text-green-600 font-medium mt-2">
              ↑ 8% from last month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                <FaChartLine className="text-white text-2xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {successRate}%
            </div>
            <div className="text-sm text-gray-700 font-medium">Success Rate</div>
            <div className="text-xs text-green-600 font-medium mt-2">
              ↑ 5% from last month
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/20 bg-white/5 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Recent Applications</h3>
            <Link
              to="/my-applications"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <FaRocket className="mx-auto mb-4 text-gray-400 text-5xl" />
              <h4 className="text-lg font-medium mb-2 text-gray-700">No applications yet</h4>
              <p className="text-gray-600 mb-6">Start your creator journey by applying to campaigns</p>
              <Link
                to="/campaign-board"
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
              >
                Browse Campaigns
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {applications.slice(0, 5).map((app) => {
                const colors = getStatusColor(app.status);
                return (
                  <motion.div
                    key={app.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className="p-6 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {app.campaignTitle}
                        </h3>
                        <p className="text-sm text-gray-700">by {app.brand}</p>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        <span style={{ fontSize: '14px' }}>{getStatusIcon(app.status)}</span>
                        <span className="capitalize">{app.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaClock size={14} />
                        Applied {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                      {app.deadline && (
                        <span className="flex items-center gap-1">
                          <FaTasks size={14} />
                          Due {app.deadline}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link
            to="/campaign-board"
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <FaRocket className="text-white text-2xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Find Campaigns</h4>
                <p className="text-sm text-gray-600">Browse available opportunities</p>
              </div>
            </div>
          </Link>

          <Link
            to="/my-profile"
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <FaStar className="text-white text-2xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">My Portfolio</h4>
                <p className="text-sm text-gray-600">Update your creator profile</p>
              </div>
            </div>
          </Link>

          <Link
            to="/analytics"
            className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Analytics</h4>
                <p className="text-sm text-gray-600">View your performance</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
