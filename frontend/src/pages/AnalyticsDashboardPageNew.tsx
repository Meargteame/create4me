import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaRocket,
  FaTrophy,
  FaFire,
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

export default function AnalyticsDashboardPageNew() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await api.getDashboardAnalytics();
      setStats(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setStats({
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalApplications: 0,
        totalViews: 0,
        conversionRate: 0,
        avgBudget: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

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

  const isCreator = user?.role === 'creator';

  const statsCards = isCreator
    ? [
        {
          title: 'Total Applications',
          value: stats?.totalApplications || 0,
          icon: <FaFileAlt />,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          change: '+12%'
        },
        {
          title: 'Accepted',
          value: stats?.acceptedApplications || 0,
          icon: <FaCheckCircle />,
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          change: '+8%'
        },
        {
          title: 'Pending',
          value: stats?.pendingApplications || 0,
          icon: <FaClock />,
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
          change: '+5%'
        },
        {
          title: 'Success Rate',
          value: `${stats?.successRate || 0}%`,
          icon: <FaTrophy />,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          change: '+15%'
        }
      ]
    : [
        {
          title: 'Total Campaigns',
          value: stats?.totalCampaigns || 0,
          icon: <FaRocket />,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          change: '+12%'
        },
        {
          title: 'Active Campaigns',
          value: stats?.activeCampaigns || 0,
          icon: <FaFire />,
          color: 'from-orange-500 to-orange-600',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600',
          change: '+8%'
        },
        {
          title: 'Total Applications',
          value: stats?.totalApplications || 0,
          icon: <FaFileAlt />,
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          change: '+23%'
        },
        {
          title: 'Total Views',
          value: stats?.totalViews || 0,
          icon: <FaEye />,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          change: '+34%'
        }
      ];

  const campaignPerformanceData = stats?.campaignPerformance || [
    { name: 'Mon', views: 120, applications: 15 },
    { name: 'Tue', views: 180, applications: 22 },
    { name: 'Wed', views: 150, applications: 18 },
    { name: 'Thu', views: 220, applications: 28 },
    { name: 'Fri', views: 280, applications: 35 },
    { name: 'Sat', views: 200, applications: 25 },
    { name: 'Sun', views: 160, applications: 20 }
  ];

  const categoryData = stats?.categoryBreakdown || [
    { name: 'Fashion', value: 35 },
    { name: 'Tech', value: 25 },
    { name: 'Lifestyle', value: 20 },
    { name: 'Food', value: 20 }
  ];

  const applicationStatusData = stats?.applicationStatus || [
    { name: 'Pending', value: 45 },
    { name: 'Accepted', value: 35 },
    { name: 'Rejected', value: 20 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                <FaChartLine />
                Analytics Dashboard
              </h1>
              <p className="text-blue-100">
                {isCreator
                  ? 'Track your application performance and success metrics'
                  : 'Monitor your campaign performance and engagement'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-1">
                {isCreator ? stats?.successRate || 0 : stats?.activeCampaigns || 0}
                {isCreator && '%'}
              </div>
              <div className="text-sm text-blue-100">
                {isCreator ? 'Success Rate' : 'Active Campaigns'}
              </div>
            </div>
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
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                {isCreator ? 'Application Trends' : 'Campaign Performance'}
              </h2>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
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

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isCreator ? 'Application Status' : 'Category Distribution'}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={isCreator ? applicationStatusData : categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(isCreator ? applicationStatusData : categoryData).map((_entry: any, index: number) => (
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

        {/* Additional Metrics */}
        {!isCreator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <p className="text-gray-700 text-sm font-semibold mb-2">Average Budget</p>
                <p className="text-4xl font-bold text-blue-600">
                  ${stats?.avgBudget || 0}
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <p className="text-gray-700 text-sm font-semibold mb-2">Conversion Rate</p>
                <p className="text-4xl font-bold text-green-600">
                  {stats?.conversionRate || 0}%
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <p className="text-gray-700 text-sm font-semibold mb-2">Avg. Applications</p>
                <p className="text-4xl font-bold text-purple-600">
                  {stats?.avgApplications || 0}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold">{activity.title}</p>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                  </div>
                  <span className="text-gray-500 text-sm font-medium">{activity.time}</span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
                  <FaChartLine className="text-4xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-600">Activity will appear here as you use the platform</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
