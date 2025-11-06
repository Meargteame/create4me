import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft,
  FaEye,
  FaFileAlt,
  FaCheckCircle,
  FaChartLine,
  FaDollarSign,
  FaClock,
  FaTag,
  FaTimesCircle,
  FaRocket,
  FaCalendarAlt
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function CampaignAnalyticsPageNew() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCampaignData();
    }
  }, [id]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      const [campaignData, analyticsData] = await Promise.all([
        api.getCampaign(id!),
        api.getCampaignAnalytics(id!)
      ]);
      setCampaign(campaignData.campaign);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#f59e0b', '#10b981', '#ef4444'];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <FaTimesCircle className="text-4xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
          <p className="text-gray-600 mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/campaigns')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            Back to Campaigns
          </button>
        </motion.div>
      </DashboardLayout>
    );
  }

  const daysRemaining = campaign.deadline 
    ? Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const statsCards = [
    {
      title: 'Total Views',
      value: analytics?.totalViews || 0,
      icon: <FaEye />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+34%'
    },
    {
      title: 'Applications',
      value: analytics?.totalApplications || 0,
      icon: <FaFileAlt />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+23%'
    },
    {
      title: 'Accepted',
      value: analytics?.acceptedApplications || 0,
      icon: <FaCheckCircle />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+18%'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics?.conversionRate || 0}%`,
      icon: <FaChartLine />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '+12%'
    }
  ];

  const performanceData = analytics?.performanceOverTime || [
    { date: 'Mon', views: 45, applications: 8 },
    { date: 'Tue', views: 68, applications: 12 },
    { date: 'Wed', views: 52, applications: 9 },
    { date: 'Thu', views: 89, applications: 15 },
    { date: 'Fri', views: 102, applications: 18 },
    { date: 'Sat', views: 76, applications: 13 },
    { date: 'Sun', views: 58, applications: 10 }
  ];

  const applicationStatusData = [
    { name: 'Pending', value: analytics?.pendingApplications || 0 },
    { name: 'Accepted', value: analytics?.acceptedApplications || 0 },
    { name: 'Rejected', value: analytics?.rejectedApplications || 0 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/campaigns')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
        >
          <FaArrowLeft />
          Back to Campaigns
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{campaign.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <span className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                  <FaTag />
                  {campaign.category}
                </span>
                <span className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                  <FaDollarSign />
                  ${campaign.budget.toLocaleString()}
                </span>
                <span className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                  <FaClock />
                  {daysRemaining} days left
                </span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
              campaign.status === 'active' 
                ? 'bg-green-500 text-white'
                : 'bg-white/20 text-white'
            }`}>
              {campaign.status.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} text-xl group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Performance Over Time
              </h2>
              <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af" 
                  style={{ fontSize: '12px', fontWeight: 500 }} 
                />
                <YAxis 
                  stroke="#9ca3af" 
                  style={{ fontSize: '12px', fontWeight: 500 }} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Views"
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Application Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Application Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationStatusData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Campaign Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                <FaFileAlt className="text-blue-600" />
                Description
              </h3>
              <p className="text-gray-900">{campaign.description}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                Requirements
              </h3>
              <p className="text-gray-900">{campaign.requirements}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                <FaRocket className="text-purple-600" />
                Deliverables
              </h3>
              <p className="text-gray-900">{campaign.deliverables}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                <FaTag className="text-orange-600" />
                Platform
              </h3>
              <p className="text-gray-900 capitalize">{campaign.platform}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
        >
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate(`/campaigns`)}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              View All Applications
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              Refresh Data
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
