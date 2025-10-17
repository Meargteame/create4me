import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../lib/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { 
  FaUsers,
  FaDollarSign,
  FaRocket,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaChartBar,
  FaCalendarAlt,
  FaUserCheck,
  FaEnvelope,
  FaSearch,
  FaStar
} from '../components/icons'

interface Campaign {
  id: string
  title: string
  description: string
  createdAt: string
  budget?: number
  deadline?: string
  status?: string
  applicantsCount?: number
}

interface Stats {
  totalCampaigns: number
  activeCampaigns: number
  totalApplicants: number
  pendingReview: number
  totalBudget: number
  approvalRate: number
  avgResponseTime: number
  completedCampaigns: number
}

export default function BrandDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalApplicants: 0,
    pendingReview: 0,
    totalBudget: 0,
    approvalRate: 0,
    avgResponseTime: 0,
    completedCampaigns: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const campaignResponse = await apiClient.getCampaigns()
      
      if (campaignResponse.success) {
        const campaignsWithCount = await Promise.all(
          campaignResponse.campaigns.map(async (campaign: any) => {
            try {
              const applicantsResponse = await apiClient.getCampaignApplicants(campaign.id)
              return {
                ...campaign,
                applicantsCount: applicantsResponse.applicants?.length || 0
              }
            } catch {
              return { ...campaign, applicantsCount: 0 }
            }
          })
        )
        
        setCampaigns(campaignsWithCount)

        // Calculate stats
        const activeCampaigns = campaignsWithCount.filter((c: Campaign) => c.status === 'active')
        const totalApplicants = campaignsWithCount.reduce((sum: number, c: Campaign) => sum + (c.applicantsCount || 0), 0)
        
        setStats({
          totalCampaigns: campaignsWithCount.length,
          activeCampaigns: activeCampaigns.length,
          totalApplicants,
          pendingReview: Math.floor(totalApplicants * 0.4),
          totalBudget: campaignsWithCount.length * 15000,
          approvalRate: 68,
          avgResponseTime: 2.5,
          completedCampaigns: Math.floor(campaignsWithCount.length * 0.6)
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = () => {
    navigate('/landing-page-builder')
  }

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await apiClient.deleteCampaign(id)
        setCampaigns(campaigns.filter(c => c.id !== id))
      } catch (error) {
        console.error('Error deleting campaign:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="h-24" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.email?.split('@')[0] || 'Brand'}! 👋
              </h1>
              <p className="text-gray-600">
                Manage your campaigns and connect with top creators
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateCampaign}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                <FaPlus size={16} />
                Create Campaign
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                📢
              </div>
              <span className="flex items-center text-blue-600 text-sm font-semibold">
                🔥 Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Campaigns</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCampaigns}</p>
            <p className="text-xs text-gray-500 mt-2">{stats.activeCampaigns} active</p>
          </motion.div>

          {/* Total Applicants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <FaUsers className="text-white" size={20} />
              </div>
              <span className="flex items-center text-purple-600 text-sm font-semibold">
                ↑ +18%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Applicants</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalApplicants}</p>
            <p className="text-xs text-gray-500 mt-2">{stats.pendingReview} pending review</p>
          </motion.div>

          {/* Total Budget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <FaDollarSign className="text-white" size={20} />
              </div>
              <span className="flex items-center text-green-600 text-sm font-semibold">
                Budget
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Budget</h3>
            <p className="text-3xl font-bold text-gray-900">
              ETB {stats.totalBudget.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">Allocated this month</p>
          </motion.div>

          {/* Approval Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                🏆
              </div>
              <span className="flex items-center text-yellow-600 text-sm font-semibold">
                ⭐ Good
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Approval Rate</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.approvalRate}%</p>
            <p className="text-xs text-gray-500 mt-2">Avg response: {stats.avgResponseTime}hrs</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Campaigns & Applicants */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Campaigns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaRocket className="text-purple-600" />
                    Your Campaigns
                  </h2>
                  <button
                    onClick={handleCreateCampaign}
                    className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
                  >
                    <FaPlus size={12} />
                    New Campaign
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {campaigns.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                      📢
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-gray-600 mb-6">Create your first campaign to start finding creators</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreateCampaign}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
                    >
                      <FaPlus className="inline mr-2" />
                      Create Campaign
                    </motion.button>
                  </div>
                ) : (
                  campaigns.slice(0, 5).map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                            {campaign.description || 'No description'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt size={12} />
                              Created: {new Date(campaign.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaUsers size={12} />
                              {campaign.applicantsCount || 0} applicants
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/projects/${campaign.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEye size={16} />
                            </motion.button>
                          </Link>
                          <Link to={`/landing-page-builder?id=${campaign.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <FaEdit size={16} />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Analytics Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaChartBar className="text-blue-600" />
                Campaign Performance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <FaEye className="text-blue-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-900">
                    {(stats.totalCampaigns * 4500).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Views</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <FaUserCheck className="text-purple-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-900">{stats.completedCampaigns}</p>
                  <p className="text-sm text-gray-600 mt-1">Completed</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <FaStar className="text-green-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-900">4.6</p>
                  <p className="text-sm text-gray-600 mt-1">Avg Rating</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateCampaign}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                >
                  <FaPlus size={16} />
                  Create Campaign
                </motion.button>

                <Link to="/creators">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                    <FaSearch size={16} />
                    Find Creators
                  </motion.button>
                </Link>

                <Link to="/network">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                    <FaEnvelope size={16} />
                    Messages
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Pending Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg border border-orange-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                  <FaClock className="text-white" size={16} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Pending Reviews</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Applicants</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                    {stats.pendingReview}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Tasks</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    0
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Messages</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    0
                  </span>
                </div>
              </div>

              {stats.pendingReview > 0 && (
                <Link to="/creators">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors"
                  >
                    Review Applications
                  </motion.button>
                </Link>
              )}
            </motion.div>

            {/* Campaign Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">💡 Pro Tips</h2>
              
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                  <span>Clear campaign descriptions get 3x more applicants</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                  <span>Respond to applicants within 24 hours for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                  <span>Check creator profiles before approval</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="h-16" />
      <Footer />
    </div>
  )
}
