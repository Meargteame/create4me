import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import apiClient from '../lib/api'
import { 
  FaChartLine,
  FaDollarSign,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaRocket,
  FaTasks
} from '../components/icons/index.js'
import { Link } from 'react-router-dom'

interface Application {
  id: string
  campaignTitle: string
  brand: string
  status: 'pending' | 'approved' | 'rejected'
  budget: number
  appliedDate: string
  deadline: string
}

export default function CreatorDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    if (!user) return
    try {
      const response = await apiClient.getMyApplications()
      if (response.success) {
        const transformedApps = response.applications.map((app: any) => ({
          id: app.id,
          campaignTitle: app.campaign?.title || 'Unknown Campaign',
          brand: app.campaign?.user?.email?.split('@')[0] || 'Unknown Brand',
          status: app.status,
          budget: 0,
          appliedDate: new Date(app.createdAt).toISOString().split('T')[0],
          deadline: app.campaign?.deadline || 'TBD'
        }))
        setApplications(transformedApps)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [user])

  const pendingCount = applications.filter(a => a.status === 'pending').length
  const approvedCount = applications.filter(a => a.status === 'approved').length
  const totalEarnings = applications.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.budget, 0)
  const successRate = applications.length > 0 ? Math.round((approvedCount / applications.length) * 100) : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return { bg: '#ecfdf5', text: '#059669', border: '#10b981' }
      case 'pending': return { bg: '#fef3c7', text: '#d97706', border: '#f59e0b' }
      case 'rejected': return { bg: '#fee2e2', text: '#dc2626', border: '#ef4444' }
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#9ca3af' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <FaCheckCircle />
      case 'pending': return <FaClock />
      case 'rejected': return <FaTimes />
      default: return <FaClock />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your creator profile today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaTasks className="text-indigo-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{pendingCount}</h3>
            <p className="text-sm text-gray-600">Active Applications</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{approvedCount}</h3>
            <p className="text-sm text-gray-600">Approved Projects</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-amber-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-gray-400">--</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalEarnings.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Total Earnings (ETB)</p>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-green-600">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{successRate}%</h3>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <Link to="/campaign-board" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  View All
                </Link>
              </div>
              
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading...</p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaClock className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-sm text-gray-600 mb-6">Start applying to campaigns to see them here</p>
                    <Link 
                      to="/campaign-board"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Browse Campaigns
                    </Link>
                  </div>
                ) : (
                  applications.slice(0, 5).map((app) => {
                    const colors = getStatusColor(app.status)
                    return (
                      <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                              {app.campaignTitle}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">by {app.brand}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                              {app.deadline && app.deadline !== 'TBD' && (
                                <span>Deadline: {new Date(app.deadline).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div 
                            className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
                            style={{ 
                              backgroundColor: colors.bg, 
                              color: colors.text,
                              border: `1px solid ${colors.border}`
                            }}
                          >
                            {getStatusIcon(app.status)}
                            <span className="capitalize">{app.status}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/campaign-board"
                  className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <FaRocket className="text-white" />
                    </div>
                    <span className="font-medium text-gray-900">Find Campaigns</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">→</span>
                </Link>

                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <FaStar className="text-white" />
                    </div>
                    <span className="font-medium text-gray-900">My Portfolio</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <FaDollarSign className="text-white" />
                    </div>
                    <span className="font-medium text-gray-900">View Earnings</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Keep Growing!</h3>
              <p className="text-indigo-100 text-sm mb-4">
                You're doing great! Apply to more campaigns to boost your earnings.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-200">Profile Strength</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="w-full bg-indigo-400/30 rounded-full h-2">
                  <div className="bg-white rounded-full h-2" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
