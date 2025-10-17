import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import apiClient from '../lib/api'
import { 
  FaChartLine,
  FaDollarSign,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaRocket,
  FaTasks,
  FaHome
} from '../components/icons/index.js'

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
  const { user, logout } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

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

  const sidebarItems = [
    { id: 'overview', icon: <FaHome />, label: 'Overview', active: true },
    { id: 'campaigns', icon: <FaRocket />, label: 'Find Campaigns', link: '/campaign-board' },
    { id: 'applications', icon: <FaTasks />, label: 'My Applications', count: applications.length },
    { id: 'portfolio', icon: <FaStar />, label: 'Portfolio' },
    { id: 'earnings', icon: <FaDollarSign />, label: 'Earnings' },
    { id: 'analytics', icon: <FaChartLine />, label: 'Analytics' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C4M</span>
            </div>
            <span className="font-bold text-gray-900">Create4Me</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item: any) => {
            const isActive = activeTab === item.id
            return item.link ? (
              <Link
                key={item.id}
                to={item.link}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                    {item.count}
                  </span>
                )}
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">Creator</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full mt-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.email?.split('@')[0]}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stat Card 1 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaTasks className="text-blue-600 text-xl" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{applications.length}</div>
                <div className="text-sm text-gray-600 mb-2">Total Applications</div>
                <div className="flex items-center text-xs text-green-600 font-medium">
                  <span>↑ 12% from last month</span>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <FaClock className="text-amber-600 text-xl" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{pendingCount}</div>
                <div className="text-sm text-gray-600 mb-2">Pending Review</div>
                <div className="flex items-center text-xs text-gray-500">
                  <span>Awaiting response</span>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{approvedCount}</div>
                <div className="text-sm text-gray-600 mb-2">Approved</div>
                <div className="flex items-center text-xs text-green-600 font-medium">
                  <span>↑ 8% from last month</span>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FaChartLine className="text-purple-600 text-xl" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{successRate}%</div>
                <div className="text-sm text-gray-600 mb-2">Success Rate</div>
                <div className="flex items-center text-xs text-green-600 font-medium">
                  <span>↑ 5% from last month</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                  <button 
                    onClick={() => setActiveTab('applications')}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    View all
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {loading ? (
                    <div className="p-12 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                      <p className="text-sm text-gray-600">Loading applications...</p>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaRocket className="text-gray-400 text-2xl" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                      <p className="text-sm text-gray-600 mb-6">Start your creator journey by applying to campaigns</p>
                      <Link 
                        to="/campaign-board"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                      >
                        Browse Campaigns
                      </Link>
                    </div>
                  ) : (
                    applications.slice(0, 5).map((app) => {
                      const colors = getStatusColor(app.status)
                      return (
                        <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-base font-semibold text-gray-900 mb-1">
                                {app.campaignTitle}
                              </h3>
                              <p className="text-sm text-gray-600">by {app.brand}</p>
                            </div>
                            <div 
                              className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
                              style={{ 
                                backgroundColor: colors.bg, 
                                color: colors.text
                              }}
                            >
                              <span style={{ fontSize: '14px' }}>{getStatusIcon(app.status)}</span>
                              <span className="capitalize">{app.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                            {app.deadline && app.deadline !== 'TBD' && (
                              <span>• Deadline {new Date(app.deadline).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Quick Actions & Stats */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link 
                      to="/campaign-board"
                      className="flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <FaRocket className="text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Browse Campaigns</span>
                    </Link>
                    <button 
                      onClick={() => setActiveTab('portfolio')}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                        <FaStar className="text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Update Portfolio</span>
                    </button>
                  </div>
                </div>

                {/* Performance Card */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Your Performance</h3>
                  <p className="text-purple-100 text-sm mb-4">
                    Keep building your creator profile
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profile Strength</span>
                        <span className="font-semibold">75%</span>
                      </div>
                      <div className="w-full bg-purple-400/30 rounded-full h-2">
                        <div className="bg-white rounded-full h-2" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Rate</span>
                        <span className="font-semibold">{successRate}%</span>
                      </div>
                      <div className="w-full bg-purple-400/30 rounded-full h-2">
                        <div className="bg-white rounded-full h-2" style={{ width: `${successRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
